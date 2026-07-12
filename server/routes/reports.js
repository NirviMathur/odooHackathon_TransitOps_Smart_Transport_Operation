const express = require('express');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const Maintenance = require('../models/Maintenance');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Per-vehicle report: fuel efficiency, utilization, operational cost, ROI
router.get('/vehicles', async (req, res) => {
  const vehicles = await Vehicle.find();

  const results = await Promise.all(vehicles.map(async (v) => {
    const [fuelLogs, expenses, maintenance, trips] = await Promise.all([
      FuelLog.find({ vehicle: v._id }),
      Expense.find({ vehicle: v._id }),
      Maintenance.find({ vehicle: v._id }),
      Trip.find({ vehicle: v._id, status: 'Completed' }),
    ]);

    const totalFuelLiters = fuelLogs.reduce((s, f) => s + f.liters, 0);
    const totalFuelCost = fuelLogs.reduce((s, f) => s + f.cost, 0);
    const totalMaintenanceCost = maintenance.reduce((s, m) => s + (m.cost || 0), 0);
    const totalExpenseCost = expenses.reduce((s, e) => s + e.amount, 0);
    const totalDistance = trips.reduce((s, t) => s + (t.actualDistance || 0), 0);

    const fuelEfficiency = totalFuelLiters > 0 ? Number((totalDistance / totalFuelLiters).toFixed(2)) : 0;
    const operationalCost = Number((totalFuelCost + totalMaintenanceCost + totalExpenseCost).toFixed(2));

    // Revenue is not directly captured in the spec; approximate as 0 unless tracked elsewhere.
    // Formula: ROI = (Revenue - (Maintenance + Fuel)) / AcquisitionCost
    const revenue = 0; // Placeholder: hook up to a Revenue/Invoice model if tracked
    const roi = v.acquisitionCost > 0
      ? Number(((revenue - (totalMaintenanceCost + totalFuelCost)) / v.acquisitionCost).toFixed(4))
      : 0;

    return {
      vehicleId: v._id,
      registrationNumber: v.registrationNumber,
      name: v.name,
      status: v.status,
      totalDistance,
      totalFuelLiters,
      fuelEfficiency, // distance / fuel
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenseCost,
      operationalCost,
      roi,
      completedTrips: trips.length,
    };
  }));

  res.json(results);
});

// Fleet utilization over current snapshot
router.get('/utilization', async (req, res) => {
  const total = await Vehicle.countDocuments({ status: { $ne: 'Retired' } });
  const onTrip = await Vehicle.countDocuments({ status: 'On Trip' });
  res.json({
    totalActiveVehicles: total,
    onTrip,
    fleetUtilizationPercent: total > 0 ? Number(((onTrip / total) * 100).toFixed(2)) : 0,
  });
});

// CSV export of the vehicle report
router.get('/vehicles.csv', async (req, res) => {
  const vehicles = await Vehicle.find();
  const rows = await Promise.all(vehicles.map(async (v) => {
    const [fuelLogs, expenses, maintenance, trips] = await Promise.all([
      FuelLog.find({ vehicle: v._id }),
      Expense.find({ vehicle: v._id }),
      Maintenance.find({ vehicle: v._id }),
      Trip.find({ vehicle: v._id, status: 'Completed' }),
    ]);
    const totalFuelLiters = fuelLogs.reduce((s, f) => s + f.liters, 0);
    const totalFuelCost = fuelLogs.reduce((s, f) => s + f.cost, 0);
    const totalMaintenanceCost = maintenance.reduce((s, m) => s + (m.cost || 0), 0);
    const totalExpenseCost = expenses.reduce((s, e) => s + e.amount, 0);
    const totalDistance = trips.reduce((s, t) => s + (t.actualDistance || 0), 0);
    const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(2) : 0;
    const operationalCost = (totalFuelCost + totalMaintenanceCost + totalExpenseCost).toFixed(2);
    return [v.registrationNumber, v.name, v.status, totalDistance, totalFuelLiters, fuelEfficiency, totalFuelCost, totalMaintenanceCost, totalExpenseCost, operationalCost].join(',');
  }));

  const header = 'RegistrationNumber,Name,Status,TotalDistance,TotalFuelLiters,FuelEfficiency,TotalFuelCost,TotalMaintenanceCost,TotalExpenseCost,OperationalCost';
  const csv = [header, ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="vehicle_report.csv"');
  res.send(csv);
});

module.exports = router;
