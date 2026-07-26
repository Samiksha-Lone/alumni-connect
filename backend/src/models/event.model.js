const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    location: { type: String, default: 'Seminar Hall, MGM Campus' },
    eventTime: { type: String, default: '10:30 AM · 2 hours' },
    category: { type: String, default: 'Alumni Event' },
    markedForDeletion: {
        type: Boolean,
        default: false
    },
    deletionScheduledAt: {
        type: Date,
        default: null
    }
},
{ timestamps: true });

module.exports =  mongoose.model("event", eventSchema);