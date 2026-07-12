const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    cargoWeight: { type: Number, required: true }, // kg
    plannedDistance: { type: Number, required: true }, // km
    actualDistance: { type: Number, default: null },
    fuelConsumed: { type: Number, default: null }, // liters
    status: {
      type: String,
      enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
      default: "Draft",
    },
  },
  { timestamps: true } // gives createdAt automatically
);

module.exports = mongoose.model("Trip", tripSchema);
