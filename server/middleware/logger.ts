import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'shared-wealth-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): Response {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
    
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Error logging middleware
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Unhandled error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  next(error);
};

// Performance monitoring middleware
export const performanceLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1000000; // Convert to milliseconds
    
    if (duration > 1000) { // Log slow requests (>1s)
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  next();
};

// Database query logger
export const dbLogger = {
  info: (message: string, meta?: any) => {
    logger.info(`[DB] ${message}`, meta);
  },
  error: (message: string, meta?: any) => {
    logger.error(`[DB] ${message}`, meta);
  },
  warn: (message: string, meta?: any) => {
    logger.warn(`[DB] ${message}`, meta);
  }
};

// Security event logger
export const securityLogger = {
  info: (event: string, meta?: any) => {
    logger.info(`[SECURITY] ${event}`, meta);
  },
  warn: (event: string, meta?: string) => {
    logger.warn(`[SECURITY] ${event}`, meta);
  },
  error: (event: string, meta?: any) => {
    logger.error(`[SECURITY] ${event}`, meta);
  }
};

export default logger;
