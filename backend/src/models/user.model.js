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
    // Alumni-specific fields
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
    // Student-specific fields
    yearOfStudying: { 
        type: Number,
        min: 1,
        max: 5
    },
    course: { 
        type: String,
        maxlength: 200
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
    }
  },
  { timestamps: true }
);

// Add compound index for finding users by role
userSchema.index({ role: 1, createdAt: -1 });

// Add text index for searching
userSchema.index({ name: 'text', email: 'text', company: 'text' });

// TTL index for lastSeen (optional - for analytics)
userSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

module.exports = mongoose.model("user", userSchema);
