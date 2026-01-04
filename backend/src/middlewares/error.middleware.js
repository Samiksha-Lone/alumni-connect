const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Should be the last middleware in the app
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  logger.error({
    message: message,
    statusCode: statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      message: 'Validation error',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `${field} already exists`,
      errors: [{ field, message: `${field} already exists` }],
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      errors: [{ field: 'token', message: 'Invalid or malformed token' }],
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
      errors: [{ field: 'token', message: 'Token has expired' }],
    });
  }

  // Cast error (invalid MongoDB ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
      errors: [{ field: err.path, message: 'Invalid ID format' }],
    });
  }

  // Default error response
  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler - should be registered before error handler
 */
const notFoundHandler = (req, res) => {
  logger.warn({
    message: '404 Not Found',
    path: req.path,
    method: req.method,
  });
  
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
  });
};

/**
 * Async error wrapper - wraps async route handlers
 * Usage: router.get('/', asyncHandler(async (req, res) => {...}))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
