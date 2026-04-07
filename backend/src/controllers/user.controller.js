const userModel = require("../models/user.model");

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, yearOfStudying, course, graduationYear, courseStudied, company } = req.body;
    const currentUserId = req.user.id || req.user._id;
    
    if (currentUserId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to update this user" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (user.role === "student") {
      if (yearOfStudying !== undefined) user.yearOfStudying = yearOfStudying;
      if (course) user.course = course;
    } else if (user.role === "alumni") {
      if (graduationYear !== undefined) user.graduationYear = graduationYear;
      if (courseStudied) user.courseStudied = courseStudied;
      if (company) user.company = company;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      role: updatedUser.role,
      name: updatedUser.name,
      email: updatedUser.email,
      courseStudied: updatedUser.courseStudied,
      company: updatedUser.company,
      graduationYear: updatedUser.graduationYear,
      yearOfStudying: updatedUser.yearOfStudying,
      course: updatedUser.course,
      resumeUrl: updatedUser.resumeUrl,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating user", error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete users" });
    }

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting user", error: error.message });
  }
}

async function getAllUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view all users" });
    }

    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users", error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching user", error: error.message });
  }
}

async function uploadResume(req, res) {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.id || req.user._id;

    if (currentUserId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to upload for this user' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const filename = req.file.filename;
    const resumePath = `/uploads/resumes/${filename}`;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.resumeUrl = `${req.protocol}://${req.get('host')}${resumePath}`;
    await user.save();

    res.status(200).json({ message: 'Resume uploaded', resumeUrl: user.resumeUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error uploading resume', error: err.message });
  }
}

module.exports = {
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  uploadResume
};

