const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const userController = require('../controllers/user.controller');

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware')

router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.json({
        message: "Welcome Admin"
    });
});

router.get('/alumni', async (req, res) => {
    try {
        const alumni = await User.find({ role: 'alumni' }).select('-password');
        res.json(alumni);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch alumni', error: err.message });
    }
});

router.get('/student', verifyToken, authorizeRoles('admin', 'alumni', 'student'), (req, res) => {
    res.json({
        message: "Welcome Student"
    });
});

// Get all users (admin only)
router.get('/', verifyToken, userController.getAllUsers);

// Get user by ID
router.get('/:id', verifyToken, userController.getUserById);

// Update user profile
router.put('/:id', verifyToken, userController.updateUser);

// Delete user
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;