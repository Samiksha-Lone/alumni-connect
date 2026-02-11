const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('../models/user.model');

const verifyToken = async (req, res, next) => {
  let token;
  
  let authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(" ")[1];
  }
  
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    req.user = user; 
    next();
  } catch (err) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;

