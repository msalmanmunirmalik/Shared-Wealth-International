import { body, param, query, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';
export class InputValidation {
}
InputValidation.sanitizeHtml = (input) => {
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
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            sanitized[key] = InputValidation.sanitizeHtml(value);
        }
        return sanitized;
    }
    return input;
};
InputValidation.escapeSql = (input) => {
    if (typeof input !== 'string')
        return input;
    return input
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\x1a/g, '\\Z');
};
InputValidation.sanitizeRequest = (req, res, next) => {
    try {
        if (req.body && Object.keys(req.body).length > 0) {
            req.sanitizedBody = InputValidation.sanitizeHtml(req.body);
        }
        if (req.query && Object.keys(req.query).length > 0) {
            req.sanitizedQuery = InputValidation.sanitizeHtml(req.query);
        }
        if (req.params && Object.keys(req.params).length > 0) {
            req.sanitizedParams = InputValidation.sanitizeHtml(req.params);
        }
        next();
    }
    catch (error) {
        console.error('Input sanitization error:', error);
        res.status(400).json({
            success: false,
            error: 'Input sanitization failed',
            message: 'Invalid input data provided'
        });
    }
};
InputValidation.handleValidationErrors = (req, res, next) => {
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
InputValidation.customRules = {
    email: (field = 'email') => body(field)
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ min: 5, max: 254 })
        .withMessage('Email must be between 5 and 254 characters')
        .custom((value) => {
        if (!validator.isEmail(value)) {
            throw new Error('Invalid email format');
        }
        if (value.includes('..') || value.startsWith('.') || value.endsWith('.')) {
            throw new Error('Email contains invalid characters');
        }
        return true;
    }),
    password: (field = 'password', minLength = 8) => body(field)
        .isLength({ min: minLength, max: 128 })
        .withMessage(`Password must be between ${minLength} and 128 characters`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
        .custom((value) => {
        const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
        if (weakPasswords.includes(value.toLowerCase())) {
            throw new Error('Password is too common, please choose a stronger password');
        }
        if (/(.)\1{3,}/.test(value)) {
            throw new Error('Password contains too many repeated characters');
        }
        return true;
    }),
    companyName: (field = 'name') => body(field)
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-&.,()]+$/)
        .withMessage('Company name contains invalid characters')
        .custom((value) => {
        if (value.toLowerCase().includes('script') ||
            value.toLowerCase().includes('javascript') ||
            value.toLowerCase().includes('onload') ||
            value.toLowerCase().includes('onerror')) {
            throw new Error('Company name contains potentially malicious content');
        }
        return true;
    }),
    url: (field = 'website') => body(field)
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
        const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
        const url = new URL(value);
        if (suspiciousDomains.includes(url.hostname)) {
            throw new Error('URL cannot point to localhost or private IP addresses');
        }
        return true;
    }),
    uuid: (field) => param(field)
        .isUUID()
        .withMessage('Invalid ID format')
        .custom((value) => {
        if (!validator.isUUID(value)) {
            throw new Error('Invalid UUID format');
        }
        return true;
    }),
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
    searchQuery: (field = 'q') => query(field)
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_.]+$/)
        .withMessage('Search query contains invalid characters'),
    fileUpload: (field = 'file') => body(field)
        .custom((value, { req }) => {
        if (!req.file && !req.files) {
            throw new Error('No file uploaded');
        }
        const file = req.file || req.files?.[0];
        if (!file) {
            throw new Error('Invalid file upload');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('File size cannot exceed 10MB');
        }
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
InputValidation.sensitiveOperationRateLimit = (req, res, next) => {
    next();
};
InputValidation.validateRequestSize = (maxSize = 1024 * 1024) => {
    return (req, res, next) => {
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
InputValidation.routeValidators = {
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
    uuidParam: (paramName = 'id') => [
        InputValidation.customRules.uuid(paramName),
        InputValidation.handleValidationErrors
    ],
    pagination: [
        ...InputValidation.customRules.pagination(),
        InputValidation.handleValidationErrors
    ],
    search: [
        InputValidation.customRules.searchQuery(),
        InputValidation.handleValidationErrors
    ]
};
export default InputValidation;
//# sourceMappingURL=inputValidation.js.map