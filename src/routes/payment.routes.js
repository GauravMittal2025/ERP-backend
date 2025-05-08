const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth.isAuthenticated, paymentController.addStdPayment);
router.get('/', auth.isAuthenticated, paymentController.getAllStdPayments);
router.get('/:id', auth.isAuthenticated, paymentController.getStdPayment);
router.get('/:id', auth.isAuthenticated, paymentController.getStdDuePayment);
router.put('/:id/pay', auth.isAuthenticated, paymentController.payFees);
// router.delete('/:id', auth.isAuthenticated, paymentController.deleteStudent);

module.exports = router;
