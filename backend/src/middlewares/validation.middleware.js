const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation error handler middleware
 * Checks for validation errors and returns them
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      }))
    });
  }
  next();
};

// ============ AUTH VALIDATIONS ============
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('role')
    .isIn(['student', 'alumni', 'admin'])
    .withMessage('Invalid role'),
  // Conditional validations based on role
  body('courseStudied')
    .if(() => {
      return (req.body.role === 'alumni');
    })
    .notEmpty()
    .withMessage('Course studied is required for alumni'),
  body('company')
    .if(() => req.body.role === 'alumni')
    .notEmpty()
    .withMessage('Company is required for alumni'),
  body('graduationYear')
    .if(() => req.body.role === 'alumni')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Invalid graduation year'),
  body('yearOfStudying')
    .if(() => req.body.role === 'student')
    .isInt({ min: 1, max: 5 })
    .withMessage('Invalid year of studying'),
  body('course')
    .if(() => req.body.role === 'student')
    .notEmpty()
    .withMessage('Course is required for students'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// ============ USER VALIDATIONS ============
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('company')
    .optional()
    .trim(),
  body('courseStudied')
    .optional()
    .trim(),
  body('graduationYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() }),
  body('yearOfStudying')
    .optional()
    .isInt({ min: 1, max: 5 }),
  body('course')
    .optional()
    .trim(),
  handleValidationErrors
];

const validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  handleValidationErrors
];

// ============ MESSAGE VALIDATIONS ============
const validateSendMessage = [
  body('receiverId')
    .isMongoId()
    .withMessage('Invalid receiver ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content cannot be empty')
    .isLength({ max: 5000 })
    .withMessage('Message cannot exceed 5000 characters'),
  handleValidationErrors
];

const validateMessageParams = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// ============ EVENT VALIDATIONS ============
const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('location')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
  handleValidationErrors
];

const validateEventId = [
  param('eventId')
    .isMongoId()
    .withMessage('Invalid event ID'),
  handleValidationErrors
];

// ============ JOB VALIDATIONS ============
const validateCreateJob = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required'),
  body('location')
    .optional()
    .trim(),
  body('salary')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Salary must be a positive number'),
  handleValidationErrors
];

const validateJobId = [
  param('jobId')
    .isMongoId()
    .withMessage('Invalid job ID'),
  handleValidationErrors
];

// ============ GALLERY VALIDATIONS ============
const validateUploadGallery = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  handleValidationErrors
];

const validateGalleryId = [
  param('galleryId')
    .isMongoId()
    .withMessage('Invalid gallery ID'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUserUpdate,
  validateUserId,
  validateSendMessage,
  validateMessageParams,
  validateCreateEvent,
  validateEventId,
  validateCreateJob,
  validateJobId,
  validateUploadGallery,
  validateGalleryId,
};
