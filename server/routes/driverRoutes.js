const express = require('express');
const { getDrivers, createDriver, deleteDriver } = require('../controllers/driverController');
const protect = require('../middleware/auth');

const router = express.Router();
router.get('/', protect, getDrivers);
router.post('/', protect, createDriver);
router.delete('/:id', protect, deleteDriver);

module.exports = router;
