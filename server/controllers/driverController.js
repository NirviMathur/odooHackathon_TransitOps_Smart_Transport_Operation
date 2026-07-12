const Driver = require('../models/Driver');

async function getDrivers(req, res) {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching drivers', error: err.message });
  }
}

async function createDriver(req, res) {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiry, contact, safetyScore, status } = req.body;

    if (!name || !licenseNumber || !licenseExpiry || !contact) {
      return res.status(400).json({ message: 'name, licenseNumber, licenseExpiry and contact are required' });
    }

    const existing = await Driver.findOne({ licenseNumber: licenseNumber.trim() });
    if (existing) {
      return res.status(409).json({ message: 'License number must be unique' });
    }

    const driver = await Driver.create({ name, licenseNumber, licenseCategory, licenseExpiry, contact, safetyScore, status });
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating driver', error: err.message });
  }
}

async function deleteDriver(req, res) {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting driver', error: err.message });
  }
}

module.exports = { getDrivers, createDriver, deleteDriver };
