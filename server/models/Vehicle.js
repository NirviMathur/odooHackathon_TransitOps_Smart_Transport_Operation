const mongoose = require('mongoose');

const VEHICLE_STATUS = ['Available', 'On Trip', 'In Shop', 'Retired'];

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true }, // Vehicle Name/Model
    type: { type: String, required: true, trim: true }, // e.g. Van, Truck, Bike
    maxLoadCapacity: { type: Number, required: true, min: 0 }, // kg
    odometer: { type: Number, required: true, default: 0, min: 0 },
    acquisitionCost: { type: Number, required: true, min: 0 },
    region: { type: String, trim: true, default: 'Unassigned' },
    status: { type: String, enum: VEHICLE_STATUS, default: 'Available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
module.exports.VEHICLE_STATUS = VEHICLE_STATUS;
