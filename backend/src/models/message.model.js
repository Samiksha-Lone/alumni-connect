const mongoose = require('mongoose');

const User = mongoose.models.User || require('./user.model');

const messageSchema = new mongoose.Schema({

    chatId: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: function() { return !this.fileUrl; }
    },
    fileUrl: {
        type: String,
        default: null
    },
    fileName: {
        type: String,
        default: null
    },
    fileType: {
        type: String,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);