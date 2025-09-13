import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ApiResponse } from '../types/index.js';

/**
 * Generic validation result handler
 */
export const handleValidationErrors = (
  req: Request, 
  res: Response<ApiResponse>, 
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => error.msg)
    });
    return;
  }
  next();
};

/**
 * Authentication validation rules
 */
export const authValidation = {
  signIn: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  
  signUp: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  
  resetPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required')
  ]
};

/**
 * Company validation rules
 */
export const companyValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Company name must be between 2 and 255 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('industry')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Industry must be between 2 and 100 characters'),
    body('size')
      .isIn(['startup', 'small', 'medium', 'large'])
      .withMessage('Size must be one of: startup, small, medium, large'),
    body('location')
      .optional()
      .trim()
      .custom((value) => {
        if (value && value.length > 0 && value.length < 2) {
          throw new Error('Location must be between 2 and 255 characters');
        }
        if (value && value.length > 255) {
          throw new Error('Location must be between 2 and 255 characters');
        }
        return true;
      }),
    body('website')
      .optional()
      .isURL()
      .withMessage('Website must be a valid URL')
  ],
  
  update: [
    param('id')
      .isUUID()
      .withMessage('Invalid company ID format'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Company name must be between 2 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('industry')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Industry must be between 2 and 100 characters'),
    body('size')
      .optional()
      .isIn(['startup', 'small', 'medium', 'large'])
      .withMessage('Size must be one of: startup, small, medium, large'),
    body('location')
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Location must be between 2 and 255 characters'),
    body('website')
      .optional()
      .isURL()
      .withMessage('Website must be a valid URL')
  ],
  
  getById: [
    param('id')
      .isUUID()
      .withMessage('Invalid company ID format')
  ]
};

/**
 * User validation rules
 */
export const userValidation = {
  getById: [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format')
  ],
  
  update: [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('role')
      .optional()
      .isIn(['user', 'admin', 'superadmin'])
      .withMessage('Role must be one of: user, admin, superadmin')
  ]
};

/**
 * Pagination validation rules
 */
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Search validation rules
 */
export const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
];

/**
 * File upload validation rules
 */
export const fileUploadValidation = [
  body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required');
      }
      
      // Check file size (10MB limit)
      if (req.file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('File type not allowed. Only JPEG, PNG, GIF, and PDF files are accepted');
      }
      
      return true;
    })
];
