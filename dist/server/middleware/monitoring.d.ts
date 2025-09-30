import { Request, Response, NextFunction } from 'express';
interface PerformanceMetrics {
    requestCount: number;
    errorCount: number;
    totalResponseTime: number;
    slowRequestCount: number;
    startTime: number;
}
export declare const performanceMonitor: (req: Request, res: Response, next: NextFunction) => void;
export declare const healthCheck: (req: Request, res: Response) => void;
export declare const metricsEndpoint: (req: Request, res: Response) => void;
export declare const systemStatus: (req: Request, res: Response) => void;
export declare const resetMetrics: () => void;
export declare const getCurrentMetrics: () => PerformanceMetrics;
export {};
//# sourceMappingURL=monitoring.d.ts.map