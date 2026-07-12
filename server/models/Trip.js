const mongoose = require('mongoose');

const TRIP_STATUS = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

const tripSchema = new mongoose.Schema(
  {
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    cargoWeight: { type: Number, required: true, min: 0 },
    plannedDistance: { type: Number, required: true, min: 0 },
    actualDistance: { type: Number },
    fuelConsumed: { type: Number }, // liters, entered on completion
    finalOdometer: { type: Number },
    status: { type: String, enum: TRIP_STATUS, default: 'Draft' },
    dispatchedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
module.exports.TRIP_STATUS = TRIP_STATUS;
