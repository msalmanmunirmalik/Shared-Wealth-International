import winston from 'winston';
import path from 'path';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = `\n${JSON.stringify(meta, null, 2)}`;
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'shared-wealth-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat
    }),
    
    // File transports
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: logFormat
    }),
    
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: logFormat
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'exceptions.log'),
      format: logFormat
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'rejections.log'),
      format: logFormat
    })
  ]
});

// Ensure logs directory exists
import fs from 'fs';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs', { recursive: true });
}

// Custom logging methods
export const log = {
  // Standard logging methods
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  
  // API request logging
  apiRequest: (req: any, res: any, duration: number) => {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
      userRole: req.user?.role
    };
    
    if (res.statusCode >= 400) {
      logger.error('API Request Error', logData);
    } else if (duration > 5000) {
      logger.warn('Slow API Request', logData);
    } else {
      logger.info('API Request', logData);
    }
  },
  
  // Database query logging
  dbQuery: (query: string, duration: number, error?: Error) => {
    const logData = {
      query: query.substring(0, 200), // Truncate long queries
      duration: `${duration}ms`,
      error: error?.message
    };
    
    if (error) {
      logger.error('Database Query Error', logData);
    } else if (duration > 1000) {
      logger.warn('Slow Database Query', logData);
    } else {
      logger.debug('Database Query', logData);
    }
  },
  
  // Authentication logging
  auth: (action: string, userId?: string, email?: string, success: boolean = true, error?: string) => {
    const logData = {
      action,
      userId,
      email: email ? email.replace(/(.{2}).*(@.*)/, '$1***$2') : undefined, // Mask email
      success,
      error,
      timestamp: new Date().toISOString()
    };
    
    if (success) {
      logger.info('Authentication Success', logData);
    } else {
      logger.warn('Authentication Failure', logData);
    }
  },
  
  // File upload logging
  fileUpload: (filename: string, size: number, type: string, userId?: string, success: boolean = true, error?: string) => {
    const logData = {
      filename,
      size: `${Math.round(size / 1024)}KB`,
      type,
      userId,
      success,
      error
    };
    
    if (success) {
      logger.info('File Upload Success', logData);
    } else {
      logger.error('File Upload Error', logData);
    }
  },
  
  // Security event logging
  security: (event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    const logData = {
      event,
      severity,
      details,
      timestamp: new Date().toISOString(),
      ip: details.ip,
      userAgent: details.userAgent,
      userId: details.userId
    };
    
    switch (severity) {
      case 'critical':
      case 'high':
        logger.error('Security Event', logData);
        break;
      case 'medium':
        logger.warn('Security Event', logData);
        break;
      case 'low':
        logger.info('Security Event', logData);
        break;
    }
  },
  
  // Performance monitoring
  performance: (operation: string, duration: number, details?: any) => {
    const logData = {
      operation,
      duration: `${duration}ms`,
      details
    };
    
    if (duration > 10000) { // >10s
      logger.error('Performance Issue', logData);
    } else if (duration > 5000) { // >5s
      logger.warn('Slow Operation', logData);
    } else {
      logger.debug('Performance Metric', logData);
    }
  },
  
  // Business logic logging
  business: (action: string, entityType: string, entityId?: string, details?: any) => {
    logger.info('Business Action', {
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString()
    });
  },
  
  // System health logging
  health: (component: string, status: 'healthy' | 'unhealthy' | 'degraded', details?: any) => {
    const logData = {
      component,
      status,
      details,
      timestamp: new Date().toISOString()
    };
    
    switch (status) {
      case 'unhealthy':
        logger.error('Health Check Failed', logData);
        break;
      case 'degraded':
        logger.warn('Health Check Degraded', logData);
        break;
      case 'healthy':
        logger.debug('Health Check Passed', logData);
        break;
    }
  }
};

// Express middleware for request logging
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  // Log request start
  logger.debug('Request Started', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - start;
    log.apiRequest(req, res, duration);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Error logging middleware
export const errorLogger = (error: Error, req?: any, res?: any, next?: any) => {
  logger.error('Unhandled Error', {
    message: error.message,
    stack: error.stack,
    url: req?.url,
    method: req?.method,
    ip: req?.ip,
    userId: req?.user?.id
  });
  
  if (next) {
    next(error);
  }
};

// Performance monitoring middleware
export const performanceLogger = (req: any, res: any, next: any) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1000000; // Convert to milliseconds
    log.performance(`${req.method} ${req.url}`, duration, {
      statusCode: res.statusCode,
      contentLength: res.get('Content-Length')
    });
  });
  
  next();
};

export default logger;