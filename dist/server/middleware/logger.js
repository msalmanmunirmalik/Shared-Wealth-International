import winston from 'winston';
import path from 'path';
const logFormat = winston.format.combine(winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
}), winston.format.errors({ stack: true }), winston.format.json(), winston.format.prettyPrint());
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({
    format: 'HH:mm:ss'
}), winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
        metaStr = `\n${JSON.stringify(meta, null, 2)}`;
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
}));
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: {
        service: 'shared-wealth-api',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    },
    transports: [
        new winston.transports.Console({
            format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat
        }),
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
            format: logFormat
        }),
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5,
            format: logFormat
        })
    ],
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
import fs from 'fs';
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
}
export const log = {
    error: (message, meta) => logger.error(message, meta),
    warn: (message, meta) => logger.warn(message, meta),
    info: (message, meta) => logger.info(message, meta),
    debug: (message, meta) => logger.debug(message, meta),
    apiRequest: (req, res, duration) => {
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
        }
        else if (duration > 5000) {
            logger.warn('Slow API Request', logData);
        }
        else {
            logger.info('API Request', logData);
        }
    },
    dbQuery: (query, duration, error) => {
        const logData = {
            query: query.substring(0, 200),
            duration: `${duration}ms`,
            error: error?.message
        };
        if (error) {
            logger.error('Database Query Error', logData);
        }
        else if (duration > 1000) {
            logger.warn('Slow Database Query', logData);
        }
        else {
            logger.debug('Database Query', logData);
        }
    },
    auth: (action, userId, email, success = true, error) => {
        const logData = {
            action,
            userId,
            email: email ? email.replace(/(.{2}).*(@.*)/, '$1***$2') : undefined,
            success,
            error,
            timestamp: new Date().toISOString()
        };
        if (success) {
            logger.info('Authentication Success', logData);
        }
        else {
            logger.warn('Authentication Failure', logData);
        }
    },
    fileUpload: (filename, size, type, userId, success = true, error) => {
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
        }
        else {
            logger.error('File Upload Error', logData);
        }
    },
    security: (event, details, severity = 'medium') => {
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
    performance: (operation, duration, details) => {
        const logData = {
            operation,
            duration: `${duration}ms`,
            details
        };
        if (duration > 10000) {
            logger.error('Performance Issue', logData);
        }
        else if (duration > 5000) {
            logger.warn('Slow Operation', logData);
        }
        else {
            logger.debug('Performance Metric', logData);
        }
    },
    business: (action, entityType, entityId, details) => {
        logger.info('Business Action', {
            action,
            entityType,
            entityId,
            details,
            timestamp: new Date().toISOString()
        });
    },
    health: (component, status, details) => {
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
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    logger.debug('Request Started', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - start;
        log.apiRequest(req, res, duration);
        originalEnd.call(this, chunk, encoding);
    };
    next();
};
export const errorLogger = (error, req, res, next) => {
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
export const performanceLogger = (req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const duration = Number(process.hrtime.bigint() - start) / 1000000;
        log.performance(`${req.method} ${req.url}`, duration, {
            statusCode: res.statusCode,
            contentLength: res.get('Content-Length')
        });
    });
    next();
};
export default logger;
//# sourceMappingURL=logger.js.map