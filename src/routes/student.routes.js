const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const auth = require('../middleware/auth.middleware');

router.post('/save-student', auth.isAuthenticated, studentController.addStudent);
router.get('/get-all-students', auth.isAuthenticated, studentController.getAllStudents);
router.get('/get-student/:id', auth.isAuthenticated, studentController.getStudent);
// router.put('/:id/pay', auth.isAuthenticated, studentController.payFees);
router.delete('/delete-student/:id', auth.isAuthenticated, studentController.deleteStudent);

module.exports = router;
