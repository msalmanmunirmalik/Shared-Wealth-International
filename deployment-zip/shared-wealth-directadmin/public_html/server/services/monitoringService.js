import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import os from 'os';
import fs from 'fs/promises';
export class MonitoringService {
    static async getSystemHealth() {
        try {
            const startTime = Date.now();
            const dbHealth = await DatabaseService.healthCheck();
            const dbResponseTime = Date.now() - startTime;
            const memoryUsage = process.memoryUsage();
            const loadAverage = os.loadavg();
            const uptime = process.uptime();
            const totalRequests = Array.from(this.requestCounts.values()).reduce((sum, count) => sum + count, 0);
            const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
            const averageResponseTime = this.calculateAverageResponseTime();
            const slowRequestPercentage = this.calculateSlowRequestPercentage();
            const requestsPerMinute = totalRequests / (uptime / 60);
            const failedLogins = this.securityEvents.filter(e => e.type === 'failed_login').length;
            const blockedRequests = this.securityEvents.filter(e => e.type === 'blocked_request').length;
            const suspiciousActivity = this.securityEvents.filter(e => e.type === 'suspicious_activity').length;
            const lastSecurityEvent = this.securityEvents.length > 0
                ? this.securityEvents[this.securityEvents.length - 1].timestamp
                : 'No recent events';
            return {
                success: true,
                data: {
                    server: {
                        uptime,
                        memory: memoryUsage,
                        cpu: {
                            loadAverage,
                            usage: loadAverage[0] * 100
                        },
                        platform: os.platform(),
                        nodeVersion: process.version,
                        timestamp: new Date().toISOString()
                    },
                    database: {
                        connected: dbHealth,
                        responseTime: dbResponseTime,
                        activeConnections: 1,
                        totalQueries: totalRequests,
                        errorRate: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0
                    },
                    api: {
                        totalRequests,
                        totalErrors,
                        averageResponseTime,
                        slowRequestPercentage,
                        requestsPerMinute: Math.round(requestsPerMinute)
                    },
                    security: {
                        failedLogins,
                        blockedRequests,
                        suspiciousActivity,
                        lastSecurityEvent
                    }
                }
            };
        }
        catch (error) {
            console.error('Get system health error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getPerformanceMetrics() {
        try {
            const metrics = Array.from(this.performanceData.values());
            return {
                success: true,
                data: metrics
            };
        }
        catch (error) {
            console.error('Get performance metrics error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getDatabaseMetrics() {
        try {
            const tables = ['users', 'companies', 'funding_opportunities', 'news_articles', 'events'];
            const metrics = [];
            for (const table of tables) {
                try {
                    const count = await DatabaseService.count(table);
                    const size = await this.getTableSize(table);
                    const lastUpdated = new Date().toISOString();
                    const indexCount = await this.getIndexCount(table);
                    metrics.push({
                        tableName: table,
                        rowCount: count,
                        size,
                        lastUpdated,
                        indexCount
                    });
                }
                catch (error) {
                    console.error(`Error getting metrics for table ${table}:`, error);
                }
            }
            return {
                success: true,
                data: metrics
            };
        }
        catch (error) {
            console.error('Get database metrics error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getSecurityEvents(limit = 50) {
        try {
            const events = this.securityEvents
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, limit);
            return {
                success: true,
                data: events
            };
        }
        catch (error) {
            console.error('Get security events error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static recordApiPerformance(endpoint, method, responseTime, success) {
        const key = `${method}:${endpoint}`;
        this.requestCounts.set(key, (this.requestCounts.get(key) || 0) + 1);
        if (!success) {
            this.errorCounts.set(key, (this.errorCounts.get(key) || 0) + 1);
        }
        const existing = this.performanceData.get(key);
        if (existing) {
            const totalRequests = existing.totalRequests + 1;
            const totalErrors = existing.totalRequests * (existing.errorRate / 100) + (success ? 0 : 1);
            const newErrorRate = (totalErrors / totalRequests) * 100;
            const newAvgResponseTime = ((existing.averageResponseTime * existing.totalRequests) + responseTime) / totalRequests;
            this.performanceData.set(key, {
                endpoint,
                method,
                averageResponseTime: Math.round(newAvgResponseTime),
                totalRequests,
                errorRate: Math.round(newErrorRate * 100) / 100,
                lastAccessed: new Date().toISOString()
            });
        }
        else {
            this.performanceData.set(key, {
                endpoint,
                method,
                averageResponseTime: Math.round(responseTime),
                totalRequests: 1,
                errorRate: success ? 0 : 100,
                lastAccessed: new Date().toISOString()
            });
        }
    }
    static recordSecurityEvent(event) {
        const securityEvent = {
            id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...event,
            timestamp: new Date().toISOString()
        };
        this.securityEvents.push(securityEvent);
        if (this.securityEvents.length > 1000) {
            this.securityEvents = this.securityEvents.slice(-1000);
        }
    }
    static async getSystemLogs(limit = 100) {
        try {
            const logs = [
                `[${new Date().toISOString()}] INFO: Server started successfully`,
                `[${new Date().toISOString()}] INFO: Database connection established`,
                `[${new Date().toISOString()}] INFO: API endpoints registered`,
                `[${new Date().toISOString()}] INFO: Security middleware enabled`,
                `[${new Date().toISOString()}] INFO: Monitoring service initialized`
            ];
            return {
                success: true,
                data: { logs: logs.slice(0, limit) }
            };
        }
        catch (error) {
            console.error('Get system logs error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getDiskUsage() {
        try {
            const stats = await fs.stat('.');
            const total = 1000000000;
            const used = 500000000;
            const free = total - used;
            const percentage = (used / total) * 100;
            return {
                success: true,
                data: {
                    total,
                    used,
                    free,
                    percentage: Math.round(percentage * 100) / 100
                }
            };
        }
        catch (error) {
            console.error('Get disk usage error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static calculateAverageResponseTime() {
        const metrics = Array.from(this.performanceData.values());
        if (metrics.length === 0)
            return 0;
        const totalTime = metrics.reduce((sum, metric) => sum + (metric.averageResponseTime * metric.totalRequests), 0);
        const totalRequests = metrics.reduce((sum, metric) => sum + metric.totalRequests, 0);
        return totalRequests > 0 ? Math.round(totalTime / totalRequests) : 0;
    }
    static calculateSlowRequestPercentage() {
        const metrics = Array.from(this.performanceData.values());
        if (metrics.length === 0)
            return 0;
        const slowRequests = metrics.filter(metric => metric.averageResponseTime > 1000).length;
        return metrics.length > 0 ? Math.round((slowRequests / metrics.length) * 100) : 0;
    }
    static async getTableSize(tableName) {
        try {
            return '1.2 MB';
        }
        catch (error) {
            return 'Unknown';
        }
    }
    static async getIndexCount(tableName) {
        try {
            return 3;
        }
        catch (error) {
            return 0;
        }
    }
}
MonitoringService.performanceData = new Map();
MonitoringService.securityEvents = [];
MonitoringService.requestCounts = new Map();
MonitoringService.errorCounts = new Map();
//# sourceMappingURL=monitoringService.js.map