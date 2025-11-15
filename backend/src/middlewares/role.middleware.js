const authorizeRoles = (...allowedRoles) => {
  return(req, res, next) => {
    if(!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "access denied"
      });
    }
    next();
    console.log(`User role: ${req.user.role}, Allowed roles: ${allowedRoles}`);
  };
};

module.exports = authorizeRoles;