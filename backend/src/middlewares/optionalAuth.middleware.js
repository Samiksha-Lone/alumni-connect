const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function optionalAuth(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    if (!token && req.cookies && req.cookies.token) token = req.cookies.token;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (user) req.user = user;
    return next();
  } catch (err) {
    // If token is invalid, treat as unauthenticated but continue
    return next();
  }
}

module.exports = optionalAuth;
