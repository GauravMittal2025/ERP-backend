const studentPayment = require('../models/payment.model');

exports.addStdPayment = async(req, res) => {
    const {stdName, totalFees = 10000, paidFees = 0} = req.body;
    const stdPayment = new studentPayment({stdName, totalFees, paidFees});
    await stdPayment.save();
    res.json({ message: 'Student Payment saved!', stdPayment});
}

exports.getAllStdPayments = async(req, res) => {
    const stdPayments = await studentPayment.find();
    res.json(stdPayments);
}

exports.getStdPayment = async (req, res) => {
  const stdPayment = await studentPayment.findById(req.params.id);
  if (!stdPayment) return res.status(404).json({ error: 'Student Payment not found' });

  res.json({ ...stdPayment.toObject(), stdPayment });
};

exports.getStdDuePayment = async (req, res) => {
    const stdPayment = await studentPayment.findById(req.params.id);
    if (!stdPayment) return res.status(404).json({ error: 'Student Payment not found' });
  
    const dueFees = stdPayment.totalFees - stdPayment.paidFees;
    res.json({ ...stdPayment.toObject(), dueFees });  
}

exports.payFees = async (req, res) => {
  const { amount } = req.body;
  const stdPayment = await studentPayment.findById(req.params.id);
  if (!stdPayment) return res.status(404).json({ error: 'Student not found' });

  if (stdPayment.paidFees + amount > stdPayment.totalFees) {
    return res.status(400).json({ error: 'Overpayment not allowed' });
  }

  stdPayment.paidFees += amount;
  await stdPayment.save();
  res.json({ message: 'Payment updated', stdPayment });
};

// exports.deleteStudent = async (req, res) => {
//   await Student.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Student deleted' });
// };
