const userModel = require("../models/user.model");
const { createVerificationHash, calculateFakeProfileScore } = require('../services/moderation.service');
const { parsePagination, buildPaginationResponse } = require('../utils/pagination');

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const {
      name,
      email,
      yearOfStudying,
      course,
      graduationYear,
      courseStudied,
      company,
      expertise,
      skills,
      bio,
      mentorAvailable,
      mentorshipTopics,
      // Student job profile fields
      experience,
      languages,
      portfolioLinks,
      certifications,
      achievements,
      location,
      availabilityStatus,
      desiredRoles,
      openToRemote,
      gpa,
      projects,
      socialLinks
    } = req.body;
    const currentUserId = req.user.id || req.user._id;
    
    if (currentUserId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this user",
        error: { code: 'FORBIDDEN', message: 'Unauthorized to update this user', details: [] }
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: 'NOT_FOUND', message: 'User not found', details: [] }
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (user.role === "student") {
      if (yearOfStudying !== undefined) user.yearOfStudying = yearOfStudying;
      if (course) user.course = course;
      // Student job profile fields
      if (experience !== undefined) user.experience = experience;
      if (languages !== undefined) {
        user.languages = Array.isArray(languages) ? languages : String(languages).split(',').map(l => l.trim()).filter(Boolean);
      }
      if (portfolioLinks !== undefined) user.portfolioLinks = portfolioLinks;
      if (certifications !== undefined) {
        user.certifications = Array.isArray(certifications) ? certifications : String(certifications).split(',').map(c => c.trim()).filter(Boolean);
      }
      if (achievements !== undefined) user.achievements = achievements;
      if (location !== undefined) user.location = location;
      if (availabilityStatus !== undefined) user.availabilityStatus = availabilityStatus;
      if (desiredRoles !== undefined) {
        user.desiredRoles = Array.isArray(desiredRoles) ? desiredRoles : String(desiredRoles).split(',').map(r => r.trim()).filter(Boolean);
      }
      if (openToRemote !== undefined) user.openToRemote = openToRemote === true || openToRemote === 'true';
      if (gpa !== undefined && gpa !== null) user.gpa = parseFloat(gpa);
      if (projects !== undefined) user.projects = projects;
      if (socialLinks !== undefined) user.socialLinks = socialLinks;
    } else if (user.role === "alumni") {
      if (graduationYear !== undefined) user.graduationYear = graduationYear;
      if (courseStudied) user.courseStudied = courseStudied;
      if (company) user.company = company;
    }

    if (expertise !== undefined) user.expertise = expertise;
    if (bio !== undefined) user.bio = bio;
    if (mentorAvailable !== undefined) user.mentorAvailable = mentorAvailable === true || mentorAvailable === 'true';
    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : String(skills).split(',').map((item) => item.trim()).filter(Boolean);
    }
    if (mentorshipTopics !== undefined) {
      user.mentorshipTopics = Array.isArray(mentorshipTopics) ? mentorshipTopics : String(mentorshipTopics).split(',').map((item) => item.trim()).filter(Boolean);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        _id: updatedUser._id,
        role: updatedUser.role,
        name: updatedUser.name,
        email: updatedUser.email,
        courseStudied: updatedUser.courseStudied,
        company: updatedUser.company,
        graduationYear: updatedUser.graduationYear,
        yearOfStudying: updatedUser.yearOfStudying,
        course: updatedUser.course,
        experience: updatedUser.experience,
        languages: updatedUser.languages,
        portfolioLinks: updatedUser.portfolioLinks,
        certifications: updatedUser.certifications,
        achievements: updatedUser.achievements,
        location: updatedUser.location,
        availabilityStatus: updatedUser.availabilityStatus,
        desiredRoles: updatedUser.desiredRoles,
        openToRemote: updatedUser.openToRemote,
        gpa: updatedUser.gpa,
        projects: updatedUser.projects,
        socialLinks: updatedUser.socialLinks,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating user',
      error: { code: 'SERVER_ERROR', message: error.message, details: [] }
    });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete users",
        error: { code: 'FORBIDDEN', message: 'Only admin can delete users', details: [] }
      });
    }

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: 'NOT_FOUND', message: 'User not found', details: [] }
      });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting user",
      error: { code: 'SERVER_ERROR', message: error.message, details: [] }
    });
  }
}

async function getAllUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all users",
        error: { code: 'FORBIDDEN', message: 'Only admin can view all users', details: [] }
      });
    }

    const { page, limit } = parsePagination(req.query, { page: 1, limit: 12 });
    const [users, total] = await Promise.all([
      userModel.find().select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      userModel.countDocuments()
    ]);

    res.status(200).json(buildPaginationResponse(users, page, limit, total));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
      error: { code: 'SERVER_ERROR', message: error.message, details: [] }
    });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: 'NOT_FOUND', message: 'User not found', details: [] }
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching user",
      error: { code: 'SERVER_ERROR', message: error.message, details: [] }
    });
  }
}

async function verifyUserProfile(req, res) {
  try {
    const userId = req.params.id;
    // Ensure we get a boolean, defaulting to true if not provided (for backward compatibility if needed)
    const isVerified = req.body.isVerified !== undefined ? Boolean(req.body.isVerified) : true;
    
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({
      success: false,
      message: 'User not found',
      error: { code: 'NOT_FOUND', message: 'User not found', details: [] }
    });

    user.isVerified = isVerified;
    user.profileStatus = isVerified ? 'verified' : 'pending';
    
    if (isVerified) {
      user.verifiedAt = new Date();
      user.verificationHash = createVerificationHash(user._id, user.email);
      user.fakeProfileScore = calculateFakeProfileScore(user);
    } else {
      user.verifiedAt = null;
      user.verificationHash = null;
    }
    
    await user.save();

    res.json({
      success: true,
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: { isVerified: user.isVerified }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error verifying user',
      error: { code: 'SERVER_ERROR', message: error.message, details: [] }
    });
  }
}

module.exports = {
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  verifyUserProfile,
};

