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

userSchema.index({ role: 1, createdAt: -1 });

userSchema.index({ name: 'text', email: 'text', company: 'text' });

userSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("User", userSchema);

