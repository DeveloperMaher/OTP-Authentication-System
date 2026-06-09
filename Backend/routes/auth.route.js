// routes/auth.route.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/verify', authController.verifyCode);
router.post('/login', authController.login);

module.exports = router;