import winston from 'winston';
import { performanceMonitor } from './optimizationService.js';
const logFormat = winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.errors({ stack: true }), winston.format.json());
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'shared-wealth-international' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: 'logs/performance.log',
            level: 'info',
            maxsize: 5242880,
            maxFiles: 3
        })
    ]
});
export const performanceLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({
            filename: 'logs/performance.log',
            maxsize: 5242880,
            maxFiles: 3
        })
    ]
});
export const securityLogger = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({
            filename: 'logs/security.log',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    ]
});
export const databaseLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({
            filename: 'logs/database.log',
            maxsize: 5242880,
            maxFiles: 3
        })
    ]
});
export const apiLoggingMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    req.requestId = requestId;
    logger.info('API Request', {
        requestId,
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id,
        timestamp: new Date().toISOString()
    });
    const originalJson = res.json;
    res.json = function (data) {
        const duration = Date.now() - startTime;
        logger.info('API Response', {
            requestId,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration,
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
        if (duration > 1000) {
            performanceLogger.warn('Slow API Request', {
                requestId,
                method: req.method,
                url: req.url,
                duration,
                userId: req.user?.id
            });
        }
        return originalJson.call(this, data);
    };
    next();
};
export const errorLoggingMiddleware = (error, req, res, next) => {
    const requestId = req.requestId || 'unknown';
    logger.error('API Error', {
        requestId,
        error: error.message,
        stack: error.stack,
        method: req.method,
        url: req.url,
        userId: req.user?.id,
        timestamp: new Date().toISOString()
    });
    if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        securityLogger.warn('Security Event', {
            requestId,
            error: error.message,
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
    }
    next(error);
};
export const logDatabaseQuery = (query, params, duration, error) => {
    const logData = {
        query: query.substring(0, 200),
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
    }
    else if (duration > 1000) {
        databaseLogger.warn('Slow Database Query', logData);
    }
    else {
        databaseLogger.info('Database Query', logData);
    }
};
export const logUserActivity = (userId, activity, details) => {
    logger.info('User Activity', {
        userId,
        activity,
        details,
        timestamp: new Date().toISOString()
    });
};
export const logSecurityEvent = (event, details, severity = 'medium') => {
    securityLogger.warn('Security Event', {
        event,
        severity,
        details,
        timestamp: new Date().toISOString()
    });
};
export const logPerformanceMetrics = () => {
    const metrics = performanceMonitor.getMetrics();
    performanceLogger.info('Performance Metrics', {
        metrics,
        timestamp: new Date().toISOString()
    });
};
export const logSystemHealth = (health) => {
    logger.info('System Health Check', {
        health,
        timestamp: new Date().toISOString()
    });
};
export const setupLogRotation = () => {
    setInterval(() => {
        logPerformanceMetrics();
    }, 300000);
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
export const loggingUtils = {
    logApiUsage: (endpoint, userId, metadata) => {
        logger.info('API Usage', {
            endpoint,
            userId,
            metadata,
            timestamp: new Date().toISOString()
        });
    },
    logBusinessEvent: (event, userId, companyId, details) => {
        logger.info('Business Event', {
            event,
            userId,
            companyId,
            details,
            timestamp: new Date().toISOString()
        });
    },
    logFileOperation: (operation, filename, userId, details) => {
        logger.info('File Operation', {
            operation,
            filename,
            userId,
            details,
            timestamp: new Date().toISOString()
        });
    },
    logContentOperation: (operation, contentType, contentId, userId, details) => {
        logger.info('Content Operation', {
            operation,
            contentType,
            contentId,
            userId,
            details,
            timestamp: new Date().toISOString()
        });
    },
    logSocialInteraction: (interaction, userId, targetId, details) => {
        logger.info('Social Interaction', {
            interaction,
            userId,
            targetId,
            details,
            timestamp: new Date().toISOString()
        });
    }
};
setupLogRotation();
//# sourceMappingURL=loggingService.js.map