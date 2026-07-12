const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    licenseNumber: { type: String, required: [true, 'License number is required'], unique: true, trim: true },
    licenseCategory: { type: String, enum: ['LMV', 'HMV', 'MCWG'], default: 'LMV' },
    licenseExpiry: { type: Date, required: [true, 'License expiry date is required'] },
    contact: { type: String, required: [true, 'Contact number is required'], trim: true },
    safetyScore: { type: Number, min: 0, max: 100, default: 100 },
    status: { type: String, enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'], default: 'Available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
