import winston from 'winston';
declare const logger: winston.Logger;
export declare const log: {
    error: (message: string, meta?: any) => winston.Logger;
    warn: (message: string, meta?: any) => winston.Logger;
    info: (message: string, meta?: any) => winston.Logger;
    debug: (message: string, meta?: any) => winston.Logger;
    apiRequest: (req: any, res: any, duration: number) => void;
    dbQuery: (query: string, duration: number, error?: Error) => void;
    auth: (action: string, userId?: string, email?: string, success?: boolean, error?: string) => void;
    fileUpload: (filename: string, size: number, type: string, userId?: string, success?: boolean, error?: string) => void;
    security: (event: string, details: any, severity?: "low" | "medium" | "high" | "critical") => void;
    performance: (operation: string, duration: number, details?: any) => void;
    business: (action: string, entityType: string, entityId?: string, details?: any) => void;
    health: (component: string, status: "healthy" | "unhealthy" | "degraded", details?: any) => void;
};
export declare const requestLogger: (req: any, res: any, next: any) => void;
export declare const errorLogger: (error: Error, req?: any, res?: any, next?: any) => void;
export declare const performanceLogger: (req: any, res: any, next: any) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map