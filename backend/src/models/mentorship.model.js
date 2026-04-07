const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    mentorName: {
      type: String,
      required: true,
    },
    studentCourse: {
      type: String,
      required: true,
    },
    mentorExpertise: {
      type: String,
      required: true,
    },
    topics: {
      type: [String],
      default: [],
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    responseMessage: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

mentorshipRequestSchema.index({ studentId: 1 });
mentorshipRequestSchema.index({ mentorId: 1 });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
