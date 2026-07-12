const mongoose = require('mongoose');

const DRIVER_STATUS = ['Available', 'On Trip', 'Off Duty', 'Suspended'];

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    licenseCategory: { type: String, required: true, trim: true },
    licenseExpiryDate: { type: Date, required: true },
    contactNumber: { type: String, required: true, trim: true },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 },
    status: { type: String, enum: DRIVER_STATUS, default: 'Available' },
  },
  { timestamps: true }
);

driverSchema.methods.isLicenseValid = function () {
  return this.licenseExpiryDate && this.licenseExpiryDate.getTime() > Date.now();
};

module.exports = mongoose.model('Driver', driverSchema);
module.exports.DRIVER_STATUS = DRIVER_STATUS;
