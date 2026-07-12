const express = require('express');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const FuelLog = require('../models/FuelLog');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const trips = await Trip.find(filter).populate('vehicle driver').sort({ createdAt: -1 });
  res.json(trips);
});

router.get('/:id', async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('vehicle driver');
  if (!trip) return res.status(404).json({ message: 'Trip not found.' });
  res.json(trip);
});

// CREATE trip (Draft). Driver or Fleet Manager can create.
router.post('/', requireRole('Driver', 'FleetManager'), async (req, res) => {
  try {
    const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;
    if (!source || !destination || !vehicle || !driver || cargoWeight == null || plannedDistance == null) {
      return res.status(400).json({ message: 'source, destination, vehicle, driver, cargoWeight, and plannedDistance are required.' });
    }

    const vehicleDoc = await Vehicle.findById(vehicle);
    const driverDoc = await Driver.findById(driver);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found.' });
    if (!driverDoc) return res.status(404).json({ message: 'Driver not found.' });

    // Rule: Cargo weight must not exceed vehicle max load capacity
    if (cargoWeight > vehicleDoc.maxLoadCapacity) {
      return res.status(400).json({
        message: `Cargo weight (${cargoWeight}kg) exceeds vehicle max load capacity (${vehicleDoc.maxLoadCapacity}kg).`,
      });
    }

    const trip = await Trip.create({
      source, destination, vehicle, driver, cargoWeight, plannedDistance,
      status: 'Draft', createdBy: req.user._id,
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DISPATCH a draft trip -> vehicle & driver become On Trip
router.post('/:id/dispatch', requireRole('Driver', 'FleetManager'), async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const trip = await Trip.findById(req.params.id).session(session);
    if (!trip) throw { status: 404, message: 'Trip not found.' };
    if (trip.status !== 'Draft') throw { status: 400, message: `Only Draft trips can be dispatched. Current status: ${trip.status}.` };

    const vehicleDoc = await Vehicle.findById(trip.vehicle).session(session);
    const driverDoc = await Driver.findById(trip.driver).session(session);
    if (!vehicleDoc || !driverDoc) throw { status: 404, message: 'Vehicle or driver not found.' };

    // Rule: Retired/In Shop vehicles never dispatchable
    if (['Retired', 'In Shop'].includes(vehicleDoc.status)) {
      throw { status: 400, message: `Vehicle is ${vehicleDoc.status} and cannot be dispatched.` };
    }
    // Rule: vehicle already On Trip cannot be assigned again
    if (vehicleDoc.status === 'On Trip') {
      throw { status: 400, message: 'Vehicle is already assigned to another trip.' };
    }
    if (vehicleDoc.status !== 'Available') {
      throw { status: 400, message: `Vehicle is not Available (status: ${vehicleDoc.status}).` };
    }

    // Rule: expired license or Suspended driver cannot be assigned
    if (driverDoc.status === 'Suspended') {
      throw { status: 400, message: 'Driver is suspended and cannot be assigned to trips.' };
    }
    if (driverDoc.status === 'On Trip') {
      throw { status: 400, message: 'Driver is already assigned to another trip.' };
    }
    if (driverDoc.status !== 'Available') {
      throw { status: 400, message: `Driver is not Available (status: ${driverDoc.status}).` };
    }
    if (!driverDoc.isLicenseValid()) {
      throw { status: 400, message: 'Driver license has expired and cannot be assigned to trips.' };
    }

    // Rule: cargo weight re-validated against capacity at dispatch time too
    if (trip.cargoWeight > vehicleDoc.maxLoadCapacity) {
      throw { status: 400, message: `Cargo weight (${trip.cargoWeight}kg) exceeds vehicle max load capacity (${vehicleDoc.maxLoadCapacity}kg).` };
    }

    vehicleDoc.status = 'On Trip';
    driverDoc.status = 'On Trip';
    trip.status = 'Dispatched';
    trip.dispatchedAt = new Date();

    await vehicleDoc.save({ session });
    await driverDoc.save({ session });
    await trip.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.json(trip);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    const status = err.status || 400;
    res.status(status).json({ message: err.message || 'Failed to dispatch trip.' });
  }
});

// COMPLETE a dispatched trip -> vehicle & driver become Available again
router.post('/:id/complete', requireRole('Driver', 'FleetManager'), async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { finalOdometer, fuelConsumed, fuelCost } = req.body;
    const trip = await Trip.findById(req.params.id).session(session);
    if (!trip) throw { status: 404, message: 'Trip not found.' };
    if (trip.status !== 'Dispatched') throw { status: 400, message: `Only Dispatched trips can be completed. Current status: ${trip.status}.` };

    const vehicleDoc = await Vehicle.findById(trip.vehicle).session(session);
    const driverDoc = await Driver.findById(trip.driver).session(session);

    if (finalOdometer != null) {
      if (finalOdometer < vehicleDoc.odometer) {
        throw { status: 400, message: 'Final odometer cannot be less than current odometer reading.' };
      }
      trip.actualDistance = finalOdometer - vehicleDoc.odometer;
      vehicleDoc.odometer = finalOdometer;
    }
    if (fuelConsumed != null) trip.fuelConsumed = fuelConsumed;
    trip.finalOdometer = finalOdometer;
    trip.status = 'Completed';
    trip.completedAt = new Date();

    vehicleDoc.status = 'Available';
    driverDoc.status = 'Available';

    await vehicleDoc.save({ session });
    await driverDoc.save({ session });
    await trip.save({ session });

    // Optional: log fuel used on this trip
    if (fuelConsumed != null && fuelCost != null) {
      await FuelLog.create([{
        vehicle: trip.vehicle, trip: trip._id, liters: fuelConsumed, cost: fuelCost, date: new Date(),
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();
    res.json(trip);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    const status = err.status || 400;
    res.status(status).json({ message: err.message || 'Failed to complete trip.' });
  }
});

// CANCEL a trip. If it was Dispatched, restore vehicle & driver to Available.
router.post('/:id/cancel', requireRole('Driver', 'FleetManager'), async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const trip = await Trip.findById(req.params.id).session(session);
    if (!trip) throw { status: 404, message: 'Trip not found.' };
    if (['Completed', 'Cancelled'].includes(trip.status)) {
      throw { status: 400, message: `Trip is already ${trip.status} and cannot be cancelled.` };
    }

    if (trip.status === 'Dispatched') {
      const vehicleDoc = await Vehicle.findById(trip.vehicle).session(session);
      const driverDoc = await Driver.findById(trip.driver).session(session);
      if (vehicleDoc && vehicleDoc.status !== 'Retired') { vehicleDoc.status = 'Available'; await vehicleDoc.save({ session }); }
      if (driverDoc && driverDoc.status !== 'Suspended') { driverDoc.status = 'Available'; await driverDoc.save({ session }); }
    }

    trip.status = 'Cancelled';
    trip.cancelledAt = new Date();
    await trip.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.json(trip);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    const status = err.status || 400;
    res.status(status).json({ message: err.message || 'Failed to cancel trip.' });
  }
});

module.exports = router;
