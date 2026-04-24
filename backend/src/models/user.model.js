const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "alumni", "student"],
      required: true,
      index: true
    },
    name: { 
        type: String, 
        required: true,
        minlength: 2,
        maxlength: 100
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        index: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    resetCode: { type: String, default: null },
    resetCodeExpires: { type: Date, default: null },
    courseStudied: { 
        type: String,
        maxlength: 200
    },
    company: { 
        type: String,
        maxlength: 200
    },
    graduationYear: { 
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
    },
    yearOfStudying: { 
        type: Number,
        min: 1,
        max: 5
    },
    course: { 
        type: String,
        maxlength: 200
    },
    expertise: {
      type: String,
      maxlength: 250,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      maxlength: 1000,
      default: ''
    },
    mentorAvailable: {
      type: Boolean,
      default: false,
      index: true
    },
    mentorshipTopics: {
      type: [String],
      default: []
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    verificationHash: {
      type: String,
      default: null
    },
    profileStatus: {
      type: String,
      enum: ['pending', 'verified', 'suspended', 'under_review'],
      default: 'pending'
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    fakeProfileScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    
    isOnline: { 
        type: Boolean, 
        default: false,
        index: true
    },
    lastSeen: { 
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: null
    },
    // Student Job Profile Fields (only for students)
    experience: {
        type: String,
        maxlength: 2000,
        default: ''
    },
    languages: {
        type: [String],
        default: []
    },
    portfolioLinks: {
        type: String,
        maxlength: 1000,
        default: ''
    },
    certifications: {
        type: [String],
        default: []
    },
    achievements: {
        type: String,
        maxlength: 1000,
        default: ''
    },
    location: {
        type: String,
        maxlength: 200,
        default: ''
    },
    availabilityStatus: {
        type: String,
        enum: ['immediate', 'notice_period', 'not_available'],
        default: 'not_available'
    },
    desiredRoles: {
        type: [String],
        default: []
    },
    openToRemote: {
        type: Boolean,
        default: true
    },
    gpa: {
        type: Number,
        min: 0,
        max: 10,
        default: null
    },
    projects: [{
        title: String,
        description: String,
        link: String,
        technologies: [String]
    }],
    socialLinks: {
        github: String,
        linkedin: String,
        portfolio: String,
        twitter: String
    }
  },
  { timestamps: true }
);

userSchema.index({ role: 1, createdAt: -1 });

userSchema.index({ name: 'text', email: 'text', company: 'text' });

userSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("User", userSchema);

