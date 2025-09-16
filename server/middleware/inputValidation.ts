import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      sanitizedBody?: any;
      sanitizedQuery?: any;
      sanitizedParams?: any;
    }
  }
}

/**
 * Comprehensive Input Validation and Sanitization Middleware
 */
export class InputValidation {
  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml = (input: any): any => {
    if (typeof input === 'string') {
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: []
      });
    }
    
    if (Array.isArray(input)) {
      return input.map(item => InputValidation.sanitizeHtml(item));
    }
    
    if (input && typeof input === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = InputValidation.sanitizeHtml(value);
      }
      return sanitized;
    }
    
    return input;
  };

  /**
   * Escape SQL special characters (additional layer of protection)
   */
  static escapeSql = (input: string): string => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\x1a/g, '\\Z');
  };

  /**
   * Validate and sanitize request data
   */
  static sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize body
      if (req.body && Object.keys(req.body).length > 0) {
        req.sanitizedBody = InputValidation.sanitizeHtml(req.body);
      }

      // Sanitize query parameters
      if (req.query && Object.keys(req.query).length > 0) {
        req.sanitizedQuery = InputValidation.sanitizeHtml(req.query);
      }

      // Sanitize route parameters
      if (req.params && Object.keys(req.params).length > 0) {
        req.sanitizedParams = InputValidation.sanitizeHtml(req.params);
      }

      next();
    } catch (error) {
      console.error('Input sanitization error:', error);
      res.status(400).json({
        success: false,
        error: 'Input sanitization failed',
        message: 'Invalid input data provided'
      });
    }
  };

  /**
   * Handle validation errors
   */
  static handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined
      }));

      console.warn('Validation errors:', errorMessages);

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid input data provided',
        details: errorMessages
      });
    }

    next();
  };

  /**
   * Custom validation rules
   */
  static customRules = {
    // Validate email with additional checks
    email: (field: string = 'email') => 
      body(field)
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ min: 5, max: 254 })
        .withMessage('Email must be between 5 and 254 characters')
        .custom((value) => {
          // Additional email validation
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email format');
          }
          
          // Check for suspicious patterns
          if (value.includes('..') || value.startsWith('.') || value.endsWith('.')) {
            throw new Error('Email contains invalid characters');
          }
          
          return true;
        }),

    // Validate password with strength requirements
    password: (field: string = 'password', minLength: number = 8) =>
      body(field)
        .isLength({ min: minLength, max: 128 })
        .withMessage(`Password must be between ${minLength} and 128 characters`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
        .custom((value) => {
          // Check for common weak passwords
          const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
          if (weakPasswords.includes(value.toLowerCase())) {
            throw new Error('Password is too common, please choose a stronger password');
          }
          
          // Check for repeated characters
          if (/(.)\1{3,}/.test(value)) {
            throw new Error('Password contains too many repeated characters');
          }
          
          return true;
        }),

    // Validate company name
    companyName: (field: string = 'name') =>
      body(field)
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-&.,()]+$/)
        .withMessage('Company name contains invalid characters')
        .custom((value) => {
          // Check for suspicious patterns
          if (value.toLowerCase().includes('script') || 
              value.toLowerCase().includes('javascript') ||
              value.toLowerCase().includes('onload') ||
              value.toLowerCase().includes('onerror')) {
            throw new Error('Company name contains potentially malicious content');
          }
          
          return true;
        }),

    // Validate URL
    url: (field: string = 'website') =>
      body(field)
        .optional()
        .isURL({ protocols: ['http', 'https'], require_protocol: true })
        .withMessage('Please provide a valid URL with http:// or https://')
        .custom((value) => {
          if (value && !validator.isURL(value, { 
            protocols: ['http', 'https'], 
            require_protocol: true 
          })) {
            throw new Error('Invalid URL format');
          }
          
          // Check for suspicious domains
          const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
          const url = new URL(value);
          if (suspiciousDomains.includes(url.hostname)) {
            throw new Error('URL cannot point to localhost or private IP addresses');
          }
          
          return true;
        }),

    // Validate UUID
    uuid: (field: string) =>
      param(field)
        .isUUID()
        .withMessage('Invalid ID format')
        .custom((value) => {
          if (!validator.isUUID(value)) {
            throw new Error('Invalid UUID format');
          }
          return true;
        }),

    // Validate pagination parameters
    pagination: () => [
      query('page')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Page must be a positive integer between 1 and 1000'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a positive integer between 1 and 100')
    ],

    // Validate search query
    searchQuery: (field: string = 'q') =>
      query(field)
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_.]+$/)
        .withMessage('Search query contains invalid characters'),

    // Validate file upload
    fileUpload: (field: string = 'file') =>
      body(field)
        .custom((value, { req }) => {
          if (!req.file && !req.files) {
            throw new Error('No file uploaded');
          }
          
          const file = req.file || (req.files as any)?.[0];
          if (!file) {
            throw new Error('Invalid file upload');
          }
          
          // Check file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            throw new Error('File size cannot exceed 10MB');
          }
          
          // Check file type
          const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'text/plain', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ];
          
          if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('File type not allowed');
          }
          
          return true;
        })
  };

  /**
   * Rate limiting for sensitive operations
   */
  static sensitiveOperationRateLimit = (req: Request, res: Response, next: NextFunction) => {
    // This would integrate with your existing rate limiting
    // For now, just pass through
    next();
  };

  /**
   * Validate request size
   */
  static validateRequestSize = (maxSize: number = 1024 * 1024) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const contentLength = parseInt(req.headers['content-length'] || '0');
      
      if (contentLength > maxSize) {
        return res.status(413).json({
          success: false,
          error: 'Request too large',
          message: `Request size cannot exceed ${maxSize} bytes`
        });
      }
      
      next();
    };
  };

  /**
   * Validate and sanitize specific routes
   */
  static routeValidators = {
    // Authentication routes
    signin: [
      InputValidation.customRules.email('email'),
      InputValidation.customRules.password('password'),
      InputValidation.handleValidationErrors
    ],

    signup: [
      InputValidation.customRules.email('email'),
      InputValidation.customRules.password('password'),
      body('firstName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
      body('lastName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
      InputValidation.handleValidationErrors
    ],

    // Company routes
    createCompany: [
      InputValidation.customRules.companyName('name'),
      body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
      InputValidation.customRules.url('website'),
      body('sector')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Sector must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s\-&]+$/)
        .withMessage('Sector contains invalid characters'),
      body('location')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
      InputValidation.handleValidationErrors
    ],

    // User routes
    updateProfile: [
      body('firstName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
      body('lastName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
      body('bio')
        .optional()
        .trim()
        .isLength({ min: 0, max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
      InputValidation.handleValidationErrors
    ],

    // Generic UUID parameter validation
    uuidParam: (paramName: string = 'id') => [
      InputValidation.customRules.uuid(paramName),
      InputValidation.handleValidationErrors
    ],

    // Pagination validation
    pagination: [
      ...InputValidation.customRules.pagination(),
      InputValidation.handleValidationErrors
    ],

    // Search validation
    search: [
      InputValidation.customRules.searchQuery(),
      InputValidation.handleValidationErrors
    ]
  };
}

export default InputValidation;
