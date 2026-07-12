const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    regNumber: { type: String, required: [true, 'Registration number is required'], unique: true, trim: true },
    name: { type: String, required: [true, 'Vehicle name/model is required'], trim: true },
    type: { type: String, enum: ['Van', 'Truck', 'Bike'], default: 'Van' },
    capacity: { type: Number, required: [true, 'Capacity is required'] },
    odometer: { type: Number, default: 0 },
    cost: { type: Number, required: [true, 'Acquisition cost is required'] },
    status: { type: String, enum: ['Available', 'On Trip', 'In Shop', 'Retired'], default: 'Available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
