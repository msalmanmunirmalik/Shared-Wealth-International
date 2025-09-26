import { ApiResponse } from '../types/index.js';
export interface SystemHealth {
    server: {
        uptime: number;
        memory: NodeJS.MemoryUsage;
        cpu: {
            loadAverage: number[];
            usage: number;
        };
        platform: string;
        nodeVersion: string;
        timestamp: string;
    };
    database: {
        connected: boolean;
        responseTime: number;
        activeConnections: number;
        totalQueries: number;
        errorRate: number;
    };
    api: {
        totalRequests: number;
        totalErrors: number;
        averageResponseTime: number;
        slowRequestPercentage: number;
        requestsPerMinute: number;
    };
    security: {
        failedLogins: number;
        blockedRequests: number;
        suspiciousActivity: number;
        lastSecurityEvent: string;
    };
}
export interface PerformanceMetrics {
    endpoint: string;
    method: string;
    averageResponseTime: number;
    totalRequests: number;
    errorRate: number;
    lastAccessed: string;
}
export interface DatabaseMetrics {
    tableName: string;
    rowCount: number;
    size: string;
    lastUpdated: string;
    indexCount: number;
}
export interface SecurityEvent {
    id: string;
    type: 'failed_login' | 'blocked_request' | 'suspicious_activity' | 'rate_limit_exceeded';
    description: string;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export declare class MonitoringService {
    private static performanceData;
    private static securityEvents;
    private static requestCounts;
    private static errorCounts;
    static getSystemHealth(): Promise<ApiResponse<SystemHealth>>;
    static getPerformanceMetrics(): Promise<ApiResponse<PerformanceMetrics[]>>;
    static getDatabaseMetrics(): Promise<ApiResponse<DatabaseMetrics[]>>;
    static getSecurityEvents(limit?: number): Promise<ApiResponse<SecurityEvent[]>>;
    static recordApiPerformance(endpoint: string, method: string, responseTime: number, success: boolean): void;
    static recordSecurityEvent(event: Omit<SecurityEvent, 'id'>): void;
    static getSystemLogs(limit?: number): Promise<ApiResponse<{
        logs: string[];
    }>>;
    static getDiskUsage(): Promise<ApiResponse<{
        total: number;
        used: number;
        free: number;
        percentage: number;
    }>>;
    private static calculateAverageResponseTime;
    private static calculateSlowRequestPercentage;
    private static getTableSize;
    private static getIndexCount;
}
//# sourceMappingURL=monitoringService.d.ts.map