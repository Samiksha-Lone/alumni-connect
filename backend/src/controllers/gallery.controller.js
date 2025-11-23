const Gallery = require('../models/gallery.model');

exports.addImage = async (req, res) => {
  try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Only admin has this privilege" });
      }
  
      const { imageUrl} = req.body || {};
  
      if (!imageUrl) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const image = await Gallery.create({
        imageUrl
      });
      
      return res.status(201).json({
        message: 'Image added successfully',
        image,

      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error adding image" });
    }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching images" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      console.warn('Unauthorized delete image attempt', { user: req.user, params: req.params })
      return res.status(403).json({ error: "Only admin can delete images" });
    }

    const imageId = req.params.id;
    const image = await Gallery.findById(imageId);
    
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    await Gallery.findByIdAndDelete(imageId);
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error deleting image" });
  }
};
