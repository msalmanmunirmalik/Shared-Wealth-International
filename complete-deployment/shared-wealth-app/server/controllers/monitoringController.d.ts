import { Request, Response } from 'express';
export declare class MonitoringController {
    static getSystemHealth(req: Request, res: Response): Promise<void>;
    static getPerformanceMetrics(req: Request, res: Response): Promise<void>;
    static getDatabaseMetrics(req: Request, res: Response): Promise<void>;
    static getSecurityEvents(req: Request, res: Response): Promise<void>;
    static getSystemLogs(req: Request, res: Response): Promise<void>;
    static getDiskUsage(req: Request, res: Response): Promise<void>;
    static recordApiPerformance(endpoint: string, method: string, responseTime: number, success: boolean): void;
    static recordSecurityEvent(event: {
        type: 'failed_login' | 'blocked_request' | 'suspicious_activity' | 'rate_limit_exceeded';
        description: string;
        ipAddress: string;
        userAgent: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
    }): void;
}
//# sourceMappingURL=monitoringController.d.ts.map