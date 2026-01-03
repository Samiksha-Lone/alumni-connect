// const jwt = require('jsonwebtoken');

// const userModel = require('../models/user.model')

// const verifyToken = async (req, res, next) => {
//   let token;
//   let authHeader = req.headers.authorization;
//   if(!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }
//   if(authHeader && authHeader.startsWith('Bearer ')) {
//     token = authHeader.split(" ")[1];
//     if(!token) {
//       return res.status(401).json({
//         message: "Token not found"
//       });
//     }
//     try {
//       const decode = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await userModel.findById(decode.id);
//       if (!user) return res.status(401).json({ message: 'User not found' });
//       req.user = user; 
//       next();
//     }catch(err) {
//       console.warn('verifyToken: token verification error', err && err.message)
//       res.status(400).json({message: "Token is not valid"});
//     }
//   }
// }

// module.exports = verifyToken;










const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Add if missing
const userModel = require('../models/user.model');

const verifyToken = async (req, res, next) => {
  let token;
  
  // 1. TRY BEARER HEADER FIRST (Postman)
  let authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(" ")[1];
  }
  
  // 2. FALLBACK TO COOKIES (Frontend/Browser)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  // 3. NO TOKEN FOUND
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
    console.warn('verifyToken error:', err.message);
    res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;
