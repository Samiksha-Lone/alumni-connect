const express = require('express');
const router = express.Router();

const galleryController = require('../controllers/gallery.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/gallery', authenticate, galleryController.addImage);
router.get('/gallery', galleryController.getImages);

router.delete('/gallery/:id', authenticate, galleryController.deleteImage);

module.exports = router;
