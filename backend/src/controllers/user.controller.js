const userModel = require("../models/user.model");

// Update user profile
async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, yearOfStudying, course, graduationYear, courseStudied, company } = req.body;

    // Get the current user's ID (handle both 'id' and '_id')
    const currentUserId = req.user.id || req.user._id;
    
    // Verify user is updating their own profile or is admin
    if (currentUserId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to update this user" });
    }

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;

    // Update role-specific fields
    if (user.role === "student") {
      if (yearOfStudying !== undefined) user.yearOfStudying = yearOfStudying;
      if (course) user.course = course;
    } else if (user.role === "alumni") {
      if (graduationYear !== undefined) user.graduationYear = graduationYear;
      if (courseStudied) user.courseStudied = courseStudied;
      if (company) user.company = company;
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Return updated user without password
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
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating user", error: error.message });
  }
}

// Delete user (Admin only)
async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    // Only admin can delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete users" });
    }

    // Find and delete the user
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting user", error: error.message });
  }
}

// Get all users (admin only)
async function getAllUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view all users" });
    }

    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching users", error: error.message });
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching user", error: error.message });
  }
}

module.exports = {
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById
};
