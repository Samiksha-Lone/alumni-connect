const express = require('express');
const router = express.Router();
const multer = require('multer')  
const path = require('path')
const fs = require('fs')

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

router.get('/', verifyToken, userController.getAllUsers);

router.get('/:id', verifyToken, userController.getUserById);

router.put('/:id', verifyToken, userController.updateUser);

router.delete('/:id', verifyToken, userController.deleteUser);

const resumesDir = path.join(__dirname, '..', '..', 'uploads', 'resumes');
fs.mkdirSync(resumesDir, { recursive: true });
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, resumesDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/:id/upload-resume', verifyToken, upload.single('resume'), userController.uploadResume);

module.exports = router;