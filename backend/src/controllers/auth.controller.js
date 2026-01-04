const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const userModel = require("../models/user.model");

async function registerUser(req, res, next) {
  try {
    const {
      role, name,
      email, password, courseStudied,
      company,
      graduationYear,
      yearOfStudying,
      course,
    } = req.body;

    // Check if user already exists
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({
        message: "User already exists",
        errors: [{ field: "email", message: "Email already registered" }]
      });
    }

    // Hash password with proper salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await userModel.create({
      role,
      name,
      email,
      password: hashedPassword,
      courseStudied: role === "alumni" ? courseStudied : undefined,
      company: role === "alumni" ? company : undefined,
      graduationYear: role === "alumni" ? graduationYear : undefined,
      yearOfStudying: role === "student" ? yearOfStudying : undefined,
      course: role === "student" ? course : undefined,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.info(`User registered successfully: ${user._id}`);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        message: "Invalid credentials",
        errors: [{ field: "email", message: "Invalid email or password" }]
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for user: ${user._id}`);
      return res.status(401).json({
        message: "Invalid credentials",
        errors: [{ field: "password", message: "Invalid email or password" }]
      });
    }

    // Generate JWT token with expiration
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }  
    );

    logger.info(`User logged in: ${user._id}`);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    next(err);
  }
}

function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  });
  
  logger.info(`User logged out: ${req.user?.id}`);
  
  res.status(200).json({
    message: "Logged out successfully"
  });
}

async function meUser(req, res, next) {
  try {
    const id = (req.user && (req.user.id || req.user._id)) || null;
    if (!id) {
      return res.status(401).json({ 
        message: 'Authentication required'
      });
    }

    const user = await userModel.findById(id).select('-password');
    if (!user) {
      logger.warn(`User not found: ${id}`);
      return res.status(404).json({ 
        message: 'User not found'
      });
    }

    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user profile: ${err.message}`);
    next(err);
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  meUser
};