const express = require('express');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/kpis', async (req, res) => {
  const { type, status, region } = req.query;
  const vehicleFilter = {};
  if (type) vehicleFilter.type = type;
  if (region) vehicleFilter.region = region;
  if (status) vehicleFilter.status = status;

  const [totalVehicles, activeVehicles, availableVehicles, inMaintenance, activeTrips, pendingTrips, driversOnDuty] =
    await Promise.all([
      Vehicle.countDocuments({ ...vehicleFilter, status: { $ne: 'Retired' } }),
      Vehicle.countDocuments({ ...vehicleFilter, status: { $in: ['Available', 'On Trip'] } }),
      Vehicle.countDocuments({ ...vehicleFilter, status: 'Available' }),
      Vehicle.countDocuments({ ...vehicleFilter, status: 'In Shop' }),
      Trip.countDocuments({ status: 'Dispatched' }),
      Trip.countDocuments({ status: 'Draft' }),
      Driver.countDocuments({ status: 'On Trip' }),
    ]);

  const fleetUtilization = activeVehicles > 0
    ? Number((( (await Vehicle.countDocuments({ ...vehicleFilter, status: 'On Trip' })) / activeVehicles) * 100).toFixed(2))
    : 0;

  res.json({
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance: inMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilizationPercent: fleetUtilization,
  });
});

module.exports = router;
