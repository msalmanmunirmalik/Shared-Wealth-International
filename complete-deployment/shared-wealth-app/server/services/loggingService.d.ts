import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
export declare const logger: winston.Logger;
export declare const performanceLogger: winston.Logger;
export declare const securityLogger: winston.Logger;
export declare const databaseLogger: winston.Logger;
export declare const apiLoggingMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorLoggingMiddleware: (error: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const logDatabaseQuery: (query: string, params: any[], duration: number, error?: Error) => void;
export declare const logUserActivity: (userId: string, activity: string, details?: any) => void;
export declare const logSecurityEvent: (event: string, details: any, severity?: "low" | "medium" | "high") => void;
export declare const logPerformanceMetrics: () => void;
export declare const logSystemHealth: (health: any) => void;
export declare const setupLogRotation: () => void;
export declare const loggingUtils: {
    logApiUsage: (endpoint: string, userId?: string, metadata?: any) => void;
    logBusinessEvent: (event: string, userId?: string, companyId?: string, details?: any) => void;
    logFileOperation: (operation: string, filename: string, userId?: string, details?: any) => void;
    logContentOperation: (operation: string, contentType: string, contentId?: string, userId?: string, details?: any) => void;
    logSocialInteraction: (interaction: string, userId: string, targetId?: string, details?: any) => void;
};
//# sourceMappingURL=loggingService.d.ts.map