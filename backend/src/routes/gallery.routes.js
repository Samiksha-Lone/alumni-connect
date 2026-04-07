const express = require('express');
const router = express.Router();

const galleryController = require('../controllers/gallery.controller');
const authenticate = require('../middlewares/auth.middleware');
const galleryUpload = require('../utils/galleryUpload');

router.post('/', authenticate, galleryUpload.single('file'), galleryController.addImage);
router.get('/', galleryController.getImages);

router.delete('/:id', authenticate, galleryController.deleteImage);

module.exports = router;
