const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

/**
 * GET /api/trips
 * List all trips, newest first, with vehicle/driver details populated.
 * Optional query filter: ?status=Dispatched
 */
exports.getTrips = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const trips = await Trip.find(filter)
      .populate("vehicleId", "registrationNumber name type maxLoadCapacity odometer")
      .populate("driverId", "name licenseNumber licenseExpiryDate status")
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trips", error: err.message });
  }
};

/**
 * GET /api/trips/available-vehicles
 * Only vehicles with status "Available" — used to populate the Trip form dropdown.
 * Retired/InShop/OnTrip vehicles are excluded by design (mandatory business rule).
 */
exports.getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: "Available" }).sort({ registrationNumber: 1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch available vehicles", error: err.message });
  }
};

/**
 * GET /api/trips/available-drivers
 * Only drivers with status "Available" AND a non-expired license.
 */
exports.getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      status: "Available",
      licenseExpiryDate: { $gt: new Date() },
    }).sort({ name: 1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch available drivers", error: err.message });
  }
};

/**
 * POST /api/trips
 * Create a trip in "Draft" status after validating all mandatory business rules:
 *  - vehicle must exist and be Available
 *  - driver must exist, be Available, and hold a non-expired license
 *  - cargoWeight <= vehicle.maxLoadCapacity
 */
exports.createTrip = async (req, res) => {
  try {
    const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

    if (!source || !destination || !vehicleId || !driverId || cargoWeight == null || plannedDistance == null) {
      return res.status(400).json({ message: "Missing required trip fields" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (vehicle.status !== "Available") {
      return res.status(400).json({ message: `Vehicle is not available (current status: ${vehicle.status})` });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (driver.status !== "Available") {
      return res.status(400).json({ message: `Driver is not available (current status: ${driver.status})` });
    }
    if (driver.licenseExpiryDate <= new Date()) {
      return res.status(400).json({ message: "Driver's license has expired" });
    }

    if (cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(400).json({
        message: `Cargo weight (${cargoWeight}kg) exceeds vehicle max load capacity (${vehicle.maxLoadCapacity}kg)`,
      });
    }

    const trip = await Trip.create({
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeight,
      plannedDistance,
      status: "Draft",
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: "Failed to create trip", error: err.message });
  }
};

/**
 * PATCH /api/trips/:id/dispatch
 * Draft -> Dispatched. Re-validates vehicle/driver are still Available
 * (protects against race conditions if two trips were drafted for the same asset).
 * Sets vehicle.status = OnTrip, driver.status = OnTrip.
 */
exports.dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Draft") {
      return res.status(400).json({ message: `Only Draft trips can be dispatched (current status: ${trip.status})` });
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    if (!vehicle || vehicle.status !== "Available") {
      return res.status(400).json({ message: "Vehicle is no longer available for dispatch" });
    }
    if (!driver || driver.status !== "Available" || driver.licenseExpiryDate <= new Date()) {
      return res.status(400).json({ message: "Driver is no longer available for dispatch" });
    }

    trip.status = "Dispatched";
    vehicle.status = "OnTrip";
    driver.status = "OnTrip";

    await Promise.all([trip.save(), vehicle.save(), driver.save()]);

    res.json({ message: "Trip dispatched", trip });
  } catch (err) {
    res.status(500).json({ message: "Failed to dispatch trip", error: err.message });
  }
};

/**
 * PATCH /api/trips/:id/complete
 * Dispatched -> Completed. Body: { actualDistance, fuelConsumed }
 * Sets vehicle.status = Available, driver.status = Available.
 * Also bumps the vehicle's odometer by actualDistance.
 */
exports.completeTrip = async (req, res) => {
  try {
    const { actualDistance, fuelConsumed } = req.body;
    if (actualDistance == null || fuelConsumed == null) {
      return res.status(400).json({ message: "actualDistance and fuelConsumed are required to complete a trip" });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Dispatched") {
      return res.status(400).json({ message: `Only Dispatched trips can be completed (current status: ${trip.status})` });
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    trip.status = "Completed";
    trip.actualDistance = actualDistance;
    trip.fuelConsumed = fuelConsumed;

    if (vehicle) {
      vehicle.status = "Available";
      vehicle.odometer = (vehicle.odometer || 0) + Number(actualDistance);
    }
    if (driver) {
      driver.status = "Available";
    }

    await Promise.all([trip.save(), vehicle && vehicle.save(), driver && driver.save()].filter(Boolean));

    res.json({ message: "Trip completed", trip });
  } catch (err) {
    res.status(500).json({ message: "Failed to complete trip", error: err.message });
  }
};

/**
 * PATCH /api/trips/:id/cancel
 * Dispatched -> Cancelled (restores vehicle/driver to Available)
 * Draft -> Cancelled (nothing to restore, since assets were never locked)
 */
exports.cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (!["Draft", "Dispatched"].includes(trip.status)) {
      return res.status(400).json({ message: `Trip cannot be cancelled from status: ${trip.status}` });
    }

    const wasDispatched = trip.status === "Dispatched";
    trip.status = "Cancelled";

    if (wasDispatched) {
      const vehicle = await Vehicle.findById(trip.vehicleId);
      const driver = await Driver.findById(trip.driverId);
      if (vehicle) vehicle.status = "Available";
      if (driver) driver.status = "Available";
      await Promise.all([trip.save(), vehicle && vehicle.save(), driver && driver.save()].filter(Boolean));
    } else {
      await trip.save();
    }

    res.json({ message: "Trip cancelled", trip });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel trip", error: err.message });
  }
};
