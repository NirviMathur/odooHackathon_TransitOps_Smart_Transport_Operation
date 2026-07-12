const mongoose = require('mongoose');

const EXPENSE_TYPES = ['Toll', 'Maintenance', 'Parking', 'Fine', 'Other'];

const expenseSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: { type: String, enum: EXPENSE_TYPES, default: 'Other' },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.EXPENSE_TYPES = EXPENSE_TYPES;
