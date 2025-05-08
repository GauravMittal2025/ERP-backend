const Student = require('../models/student.model');

exports.addStudent = async (req, res) => {
  const { name, rollNo, className, phoneNo } = req.body;
  const student = new Student({ name, rollNo, className, phoneNo });
  await student.save();
  res.json({ message: 'Student added', student });
};

exports.getAllStudents = async (req, res) => {
  res.json('herllo from server')
  return
  const students = await Student.find();
  res.json(students);
  return;
};

exports.getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // const dueFees = student.totalFees - student.paidFees;
  res.json({ ...student.toObject(), student });
};

exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Student deleted' });
};