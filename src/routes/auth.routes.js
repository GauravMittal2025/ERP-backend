const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authMiddleware.isNotAuthenticated, authController.register);
router.post('/login', authMiddleware.isNotAuthenticated, authController.login);

// Protected routes
router.post('/logout', authMiddleware.isAuthenticated, authController.logout);
router.post('/category', categoryController.saveCategory);
router.get('/getCategory', categoryController.getCategories);

router.get('/me', authMiddleware.isAuthenticated, authController.getCurrentUser);



module.exports = router;