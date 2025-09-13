import rateLimit from 'express-rate-limit';

/**
 * Rate limiting configuration for different endpoint types
 */

// Authentication endpoints - stricter limits to prevent brute force
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5'), // 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use default memory store
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// General API endpoints - standard limits
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Admin endpoints - more restrictive limits
export const adminLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.ADMIN_RATE_LIMIT_MAX_REQUESTS || '200'), // 200 requests per windowMs
  message: {
    success: false,
    message: 'Too many admin requests, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// File upload endpoints - very restrictive limits
export const uploadLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX_REQUESTS || '10'), // 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many upload attempts, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Health check endpoints - very permissive limits
export const healthCheckLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.HEALTH_CHECK_RATE_LIMIT_MAX_REQUESTS || '1000'), // 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many health check requests.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});
