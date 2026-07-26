const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const userController = require('../controllers/user.controller');

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const { validateAlumniQuery, validateUserUpdate, validateUserId } = require('../middlewares/validation.middleware');

router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.json({
        message: "Welcome Admin"
    });
});

router.get('/alumni', validateAlumniQuery, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
        const search = (req.query.search || '').trim();

        const query = { role: 'alumni' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { courseStudied: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const [alumni, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: alumni,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch alumni',
            error: { code: 'SERVER_ERROR', message: err.message, details: [] }
        });
    }
});

router.get('/student', verifyToken, authorizeRoles('admin', 'alumni', 'student'), (req, res) => {
    res.json({
        message: "Welcome Student"
    });
});

router.get('/', verifyToken, userController.getAllUsers);

router.get('/:id', verifyToken, validateUserId, userController.getUserById);

router.put('/:id', verifyToken, validateUserId, validateUserUpdate, userController.updateUser);

router.delete('/:id', verifyToken, validateUserId, userController.deleteUser);

router.patch('/:id/verify', verifyToken, validateUserId, authorizeRoles('admin'), userController.verifyUserProfile);

module.exports = router;