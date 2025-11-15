const express = require('express');
const router = express.Router();

const galleryController = require('../controllers/gallery.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/gallery', authenticate, galleryController.addImage);
// public GET to load gallery without auth
router.get('/gallery', galleryController.getImages);

// Delete image (Admin only)
router.delete('/gallery/:id', authenticate, galleryController.deleteImage);

module.exports = router;
