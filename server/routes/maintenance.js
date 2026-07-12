const express = require('express');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { status, vehicle } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (vehicle) filter.vehicle = vehicle;
  const records = await Maintenance.find(filter).populate('vehicle').sort({ date: -1 });
  res.json(records);
});

// Create a maintenance record -> vehicle automatically becomes "In Shop"
router.post('/', requireRole('FleetManager'), async (req, res) => {
  try {
    const { vehicle, type, description, cost, date } = req.body;
    if (!vehicle || !type) return res.status(400).json({ message: 'vehicle and type are required.' });

    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found.' });
    if (vehicleDoc.status === 'On Trip') {
      return res.status(400).json({ message: 'Cannot log maintenance for a vehicle that is currently On Trip.' });
    }
    if (vehicleDoc.status === 'Retired') {
      return res.status(400).json({ message: 'Cannot log maintenance for a Retired vehicle.' });
    }

    const record = await Maintenance.create({
      vehicle, type, description, cost: cost || 0, date: date || new Date(), status: 'Open',
    });

    vehicleDoc.status = 'In Shop';
    await vehicleDoc.save();

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Close a maintenance record -> vehicle restored to Available (unless Retired)
router.post('/:id/close', requireRole('FleetManager'), async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Maintenance record not found.' });
  if (record.status === 'Closed') return res.status(400).json({ message: 'Maintenance record is already closed.' });

  record.status = 'Closed';
  record.closedAt = new Date();
  await record.save();

  const vehicleDoc = await Vehicle.findById(record.vehicle);
  if (vehicleDoc && vehicleDoc.status !== 'Retired') {
    // Only restore if there's no other open maintenance record for this vehicle
    const stillOpen = await Maintenance.exists({ vehicle: vehicleDoc._id, status: 'Open', _id: { $ne: record._id } });
    if (!stillOpen) {
      vehicleDoc.status = 'Available';
      await vehicleDoc.save();
    }
  }

  res.json(record);
});

module.exports = router;
