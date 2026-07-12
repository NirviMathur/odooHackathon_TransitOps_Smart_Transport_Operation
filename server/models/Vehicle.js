const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    maxLoadCapacity: { type: Number, required: true }, // kg
    odometer: { type: Number, default: 0 },
    acquisitionCost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Available", "OnTrip", "InShop", "Retired"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
