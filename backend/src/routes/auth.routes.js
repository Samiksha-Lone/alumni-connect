const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);
router.get('/me', verifyToken, authController.meUser);

module.exports = router;