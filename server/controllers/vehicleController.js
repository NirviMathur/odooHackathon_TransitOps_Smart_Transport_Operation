const Vehicle = require('../models/Vehicle');

async function getVehicles(req, res) {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching vehicles', error: err.message });
  }
}

async function createVehicle(req, res) {
  try {
    const { regNumber, name, type, capacity, odometer, cost, status } = req.body;

    if (!regNumber || !name || !capacity || !cost) {
      return res.status(400).json({ message: 'regNumber, name, capacity and cost are required' });
    }

    const existing = await Vehicle.findOne({ regNumber: regNumber.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Registration number must be unique' });
    }

    const vehicle = await Vehicle.create({ regNumber, name, type, capacity, odometer, cost, status });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating vehicle', error: err.message });
  }
}

async function deleteVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting vehicle', error: err.message });
  }
}

module.exports = { getVehicles, createVehicle, deleteVehicle };
