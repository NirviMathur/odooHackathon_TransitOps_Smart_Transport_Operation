const express = require('express');
const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { vehicle } = req.query;
  const filter = {};
  if (vehicle) filter.vehicle = vehicle;
  const logs = await FuelLog.find(filter).populate('vehicle trip').sort({ date: -1 });
  res.json(logs);
});

router.post('/', requireRole('FleetManager', 'Driver'), async (req, res) => {
  try {
    const { vehicle, liters, cost, date, trip } = req.body;
    if (!vehicle || liters == null || cost == null) {
      return res.status(400).json({ message: 'vehicle, liters, and cost are required.' });
    }
    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found.' });

    const log = await FuelLog.create({ vehicle, liters, cost, date: date || new Date(), trip });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
