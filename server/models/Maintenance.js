const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: { type: String, required: true, trim: true }, // e.g. Oil Change, Tire Rotation
    description: { type: String, trim: true },
    cost: { type: Number, required: true, min: 0, default: 0 },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
