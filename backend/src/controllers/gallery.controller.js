const Gallery = require('../models/gallery.model');

exports.addImage = async (req, res) => {
  try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Only admin has this privilege" });
      }
  
      let { imageUrl, description } = req.body || {};
      
      // If a file was uploaded, use its path
      if (req.file) {
        imageUrl = `/uploads/gallery/${req.file.filename}`;
      }
  
      if (!imageUrl) {
        return res.status(400).json({ error: "Image source placeholder required (URL or File)" });
      }
  
      const image = await Gallery.create({
        imageUrl,
        description: description || 'Campus Life'
      });
      
      return res.status(201).json({
        message: 'Image added successfully',
        image
      });
    } catch (error) {
      console.error('Error adding image:', error);
      return res.status(500).json({ error: "Server error adding image" });
    }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching images" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
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
    return res.status(500).json({ error: "Server error deleting image" });
  }
};

