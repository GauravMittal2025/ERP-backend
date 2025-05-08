const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: Number,
  className: String,
  phoneNo: Number,
  // totalFees: { type: Number, default: 0 },
  // paidFees: { type: Number, default: 0 }
});

module.exports = mongoose.model('Student', studentSchema);
