const express = require('express');
const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { vehicle, type } = req.query;
  const filter = {};
  if (vehicle) filter.vehicle = vehicle;
  if (type) filter.type = type;
  const expenses = await Expense.find(filter).populate('vehicle').sort({ date: -1 });
  res.json(expenses);
});

router.post('/', requireRole('FleetManager', 'FinancialAnalyst'), async (req, res) => {
  try {
    const { vehicle, type, amount, description, date } = req.body;
    if (!vehicle || amount == null) return res.status(400).json({ message: 'vehicle and amount are required.' });

    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) return res.status(404).json({ message: 'Vehicle not found.' });

    const expense = await Expense.create({ vehicle, type: type || 'Other', amount, description, date: date || new Date() });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
