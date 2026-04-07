const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'Campus Life'
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('gallery', gallerySchema);