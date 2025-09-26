import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { performanceMonitor } from './optimizationService.js';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'shared-wealth-international' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File transports
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/performance.log', 
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ]
});

// Performance logging
export const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/performance.log',
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ]
});

// Security logging
export const securityLogger = winston.createLogger({
  level: 'warn',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Database logging
export const databaseLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/database.log',
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ]
});

// API logging middleware
export const apiLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  // Add request ID to request object
  (req as any).requestId = requestId;

  // Log request
  logger.info('API Request', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString()
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data: any) {
    const duration = Date.now() - startTime;
    
    // Log response
    logger.info('API Response', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString()
    });

    // Log performance metrics
    if (duration > 1000) { // Log slow requests
      performanceLogger.warn('Slow API Request', {
        requestId,
        method: req.method,
        url: req.url,
        duration,
        userId: (req as any).user?.id
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

// Error logging middleware
export const errorLoggingMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId || 'unknown';
  
  logger.error('API Error', {
    requestId,
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString()
  });

  // Log security-related errors
  if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
    securityLogger.warn('Security Event', {
      requestId,
      error: error.message,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString()
    });
  }

  next(error);
};

// Database query logging
export const logDatabaseQuery = (query: string, params: any[], duration: number, error?: Error) => {
  const logData = {
    query: query.substring(0, 200), // Truncate long queries
    params: params.length > 0 ? params : undefined,
    duration,
    timestamp: new Date().toISOString()
  };

  if (error) {
    databaseLogger.error('Database Query Error', {
      ...logData,
      error: error.message,
      stack: error.stack
    });
  } else if (duration > 1000) { // Log slow queries
    databaseLogger.warn('Slow Database Query', logData);
  } else {
    databaseLogger.info('Database Query', logData);
  }
};

// User activity logging
export const logUserActivity = (userId: string, activity: string, details?: any) => {
  logger.info('User Activity', {
    userId,
    activity,
    details,
    timestamp: new Date().toISOString()
  });
};

// Security event logging
export const logSecurityEvent = (event: string, details: any, severity: 'low' | 'medium' | 'high' = 'medium') => {
  securityLogger.warn('Security Event', {
    event,
    severity,
    details,
    timestamp: new Date().toISOString()
  });
};

// Performance metrics logging
export const logPerformanceMetrics = () => {
  const metrics = performanceMonitor.getMetrics();
  
  performanceLogger.info('Performance Metrics', {
    metrics,
    timestamp: new Date().toISOString()
  });
};

// System health logging
export const logSystemHealth = (health: any) => {
  logger.info('System Health Check', {
    health,
    timestamp: new Date().toISOString()
  });
};

// Log rotation and cleanup
export const setupLogRotation = () => {
  // Log performance metrics every 5 minutes
  setInterval(() => {
    logPerformanceMetrics();
  }, 300000);

  // Log system health every hour
  setInterval(() => {
    const health = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };
    logSystemHealth(health);
  }, 3600000);
};

// Export logging utilities
export const loggingUtils = {
  // Log API usage
  logApiUsage: (endpoint: string, userId?: string, metadata?: any) => {
    logger.info('API Usage', {
      endpoint,
      userId,
      metadata,
      timestamp: new Date().toISOString()
    });
  },

  // Log business events
  logBusinessEvent: (event: string, userId?: string, companyId?: string, details?: any) => {
    logger.info('Business Event', {
      event,
      userId,
      companyId,
      details,
      timestamp: new Date().toISOString()
    });
  },

  // Log file operations
  logFileOperation: (operation: string, filename: string, userId?: string, details?: any) => {
    logger.info('File Operation', {
      operation,
      filename,
      userId,
      details,
      timestamp: new Date().toISOString()
    });
  },

  // Log content operations
  logContentOperation: (operation: string, contentType: string, contentId?: string, userId?: string, details?: any) => {
    logger.info('Content Operation', {
      operation,
      contentType,
      contentId,
      userId,
      details,
      timestamp: new Date().toISOString()
    });
  },

  // Log social interactions
  logSocialInteraction: (interaction: string, userId: string, targetId?: string, details?: any) => {
    logger.info('Social Interaction', {
      interaction,
      userId,
      targetId,
      details,
      timestamp: new Date().toISOString()
    });
  }
};

// Initialize log rotation
setupLogRotation();
