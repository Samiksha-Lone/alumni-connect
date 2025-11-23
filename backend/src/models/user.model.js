const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "alumni", "student"],
      required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    // Alumni-specific fields
    courseStudied: { 
        type: String 
    },
    company: { 
        type: String 
    },
    graduationYear: { 
        type: Number 
    },
    // Student-specific fields
    yearOfStudying: { 
        type: Number 
    },
    course: { 
        type: String 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
