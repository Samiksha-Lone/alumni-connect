const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../middlewares/validation.middleware');

router.post('/register', validateRegister, authController.registerUser);
router.post('/login', validateLogin, authController.loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/logout', verifyToken, authController.logoutUser);
router.get('/me', verifyToken, authController.meUser);

module.exports = router;