const express = require('express');
const Vehicle = require('../models/Vehicle');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();
router.use(requireAuth);

// GET /api/vehicles  (all authenticated roles can view, with filters)
router.get('/', async (req, res) => {
  const { type, status, region } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (region) filter.region = region;
  const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
  res.json(vehicles);
});

// GET /api/vehicles/dispatch-pool -> only vehicles eligible for dispatch
router.get('/dispatch-pool', async (req, res) => {
  const vehicles = await Vehicle.find({ status: 'Available' }).sort({ registrationNumber: 1 });
  res.json(vehicles);
});

router.get('/:id', async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
  res.json(vehicle);
});

// POST /api/vehicles - Fleet Manager only
router.post('/', requireRole('FleetManager'), async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region } = req.body;
    if (!registrationNumber || !name || !type || maxLoadCapacity == null || acquisitionCost == null) {
      return res.status(400).json({ message: 'registrationNumber, name, type, maxLoadCapacity, and acquisitionCost are required.' });
    }
    const existing = await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (existing) return res.status(409).json({ message: 'Registration number must be unique.' });

    const vehicle = await Vehicle.create({
      registrationNumber, name, type, maxLoadCapacity, odometer: odometer || 0, acquisitionCost, region,
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/vehicles/:id - Fleet Manager only
router.put('/:id', requireRole('FleetManager'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    if (req.body.registrationNumber && req.body.registrationNumber.toUpperCase() !== vehicle.registrationNumber) {
      const dup = await Vehicle.findOne({ registrationNumber: req.body.registrationNumber.toUpperCase() });
      if (dup) return res.status(409).json({ message: 'Registration number must be unique.' });
    }

    // Manual status changes are blocked for On Trip / In Shop - those are system controlled.
    if (req.body.status && ['On Trip', 'In Shop'].includes(req.body.status)) {
      return res.status(400).json({ message: 'This status is set automatically by trip/maintenance workflows.' });
    }

    Object.assign(vehicle, req.body);
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/vehicles/:id - Fleet Manager only (soft: mark Retired)
router.delete('/:id', requireRole('FleetManager'), async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
  vehicle.status = 'Retired';
  await vehicle.save();
  res.json({ message: 'Vehicle retired.', vehicle });
});

module.exports = router;
