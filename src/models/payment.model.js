const mongoose = require('mongoose');

const studentPaymentSchema = new mongoose.Schema({
  stdName: String,
  totalFees: { type: Number, default: 10000},
  paidFees: { type: Number, default: 0 }
});

module.exports = mongoose.model('StudentPayment', studentPaymentSchema);
