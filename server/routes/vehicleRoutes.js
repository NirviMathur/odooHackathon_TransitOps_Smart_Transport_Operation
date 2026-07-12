const express = require('express');
const { getVehicles, createVehicle, deleteVehicle } = require('../controllers/vehicleController');
const protect = require('../middleware/auth');

const router = express.Router();
router.get('/', protect, getVehicles);
router.post('/', protect, createVehicle);
router.delete('/:id', protect, deleteVehicle);

module.exports = router;
