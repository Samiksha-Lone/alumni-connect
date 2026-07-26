const express = require('express');
const router = express.Router();

const galleryController = require('../controllers/gallery.controller');
const authenticate = require('../middlewares/auth.middleware');
const galleryUpload = require('../utils/galleryUpload');
const { validateUploadGallery, validateGalleryId } = require('../middlewares/validation.middleware');

router.post('/', authenticate, validateUploadGallery, galleryUpload.single('file'), galleryController.addImage);
router.get('/', galleryController.getImages);

router.delete('/:id', authenticate, validateGalleryId, galleryController.deleteImage);

module.exports = router;
