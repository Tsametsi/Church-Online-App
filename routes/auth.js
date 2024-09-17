// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middlewares/rateLimiter');

// Login Route
router.post('/login', loginLimiter, authController.login);

// Other routes (logout, signup, etc.) can be added here similarly
router.post('/logout', authController.logout);
router.post('/signup', authController.signup);

module.exports = router;
