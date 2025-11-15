const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model')

const verifyToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if(authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(" ")[1];
    if(!token) {
      return res.status(401).json({
        message: "Token not found"
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log('verifyToken: decoded token', { id: decode.id, role: decode.role })
      // load full user document to make role and _id available consistently
      const user = await userModel.findById(decode.id);
      console.log('verifyToken: db user', user ? { id: user._id, role: user.role } : null)
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user; // attach full user document
      next();
    }catch(err) {
      console.warn('verifyToken: token verification error', err && err.message)
      res.status(400).json({message: "Token is not valid"});
    }
  }
}

module.exports = verifyToken;