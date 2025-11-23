const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

async function registerUser(req, res) {
  const {
    role, name,
    email, password, courseStudied,
    company,
    graduationYear,
    yearOfStudying,
    course,
  } = req.body;
  if (!role || !name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }
  if (role === "alumni" && (!courseStudied || !company || !graduationYear)) {
    return res.status(400).send("Missing alumni fields");
  }
  if (role === "student" && (!yearOfStudying || !course)) {
    return res.status(400).send("Missing student fields");
  }
  try {
    let existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
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
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET
    );
    res.cookie("token", token);
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send("Registration error");
  }
}

async function loginUser(req, res) {
  const { role, email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }  
    );
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logged out",
  });
}

async function meUser(req, res) {
  try {
    const id = (req.user && (req.user.id || req.user._id)) || null;
    if (!id) return res.status(401).json({ message: 'Authentication required' });
    const user = await userModel.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'invalid token' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  meUser
};
