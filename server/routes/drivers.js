const express = require('express');
const Driver = require('../models/Driver');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const drivers = await Driver.find(filter).sort({ createdAt: -1 });
  res.json(drivers);
});

// Only drivers eligible for dispatch: Available status + non-expired license
router.get('/dispatch-pool', async (req, res) => {
  const drivers = await Driver.find({ status: 'Available', licenseExpiryDate: { $gt: new Date() } }).sort({ name: 1 });
  res.json(drivers);
});

router.get('/:id', async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ message: 'Driver not found.' });
  res.json(driver);
});

// Fleet Manager or Safety Officer can manage drivers
router.post('/', requireRole('FleetManager', 'SafetyOfficer'), async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore } = req.body;
    if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
      return res.status(400).json({ message: 'name, licenseNumber, licenseCategory, licenseExpiryDate, and contactNumber are required.' });
    }
    const existing = await Driver.findOne({ licenseNumber });
    if (existing) return res.status(409).json({ message: 'License number must be unique.' });

    const driver = await Driver.create({
      name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber,
      safetyScore: safetyScore ?? 100,
    });
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', requireRole('FleetManager', 'SafetyOfficer'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });

    if (req.body.status && ['On Trip'].includes(req.body.status)) {
      return res.status(400).json({ message: 'On Trip status is set automatically by the trip workflow.' });
    }

    Object.assign(driver, req.body);
    await driver.save();
    res.json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Safety Officer can suspend a driver (compliance action)
router.post('/:id/suspend', requireRole('SafetyOfficer', 'FleetManager'), async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ message: 'Driver not found.' });
  if (driver.status === 'On Trip') return res.status(400).json({ message: 'Cannot suspend a driver who is currently on a trip.' });
  driver.status = 'Suspended';
  await driver.save();
  res.json(driver);
});

router.delete('/:id', requireRole('FleetManager'), async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ message: 'Driver not found.' });
  driver.status = 'Off Duty';
  await driver.save();
  res.json({ message: 'Driver set to Off Duty.', driver });
});

module.exports = router;
