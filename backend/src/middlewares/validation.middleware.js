const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.path || err.param || 'unknown',
        message: err.msg,
        location: err.location,
      }))
    });
  }
  next();
};

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
  body('courseStudied')
    .if((value, { req }) => req.body.role === 'alumni')
    .notEmpty()
    .withMessage('Course studied is required for alumni'),
  body('company')
    .if((value, { req }) => req.body.role === 'alumni')
    .notEmpty()
    .withMessage('Company is required for alumni'),
  body('graduationYear')
    .if((value, { req }) => req.body.role === 'alumni')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Invalid graduation year'),
  body('yearOfStudying')
    .if((value, { req }) => req.body.role === 'student')
    .isInt({ min: 1, max: 5 })
    .withMessage('Invalid year of studying'),
  body('course')
    .if((value, { req }) => req.body.role === 'student')
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

const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  handleValidationErrors
];

const validateResetPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('resetCode')
    .matches(/^\d{6}$/)
    .withMessage('Reset code must be a 6-digit number'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
  handleValidationErrors
];

const validateAlumniQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
];

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
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  handleValidationErrors
];

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
  body('eventDate')
    .isISO8601()
    .withMessage('Invalid event date format'),
  body('location')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
  handleValidationErrors
];

const validateEventId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid event ID'),
  handleValidationErrors
];

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
  param('id')
    .isMongoId()
    .withMessage('Invalid job ID'),
  handleValidationErrors
];

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
  param('id')
    .isMongoId()
    .withMessage('Invalid gallery ID'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateAlumniQuery,
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

