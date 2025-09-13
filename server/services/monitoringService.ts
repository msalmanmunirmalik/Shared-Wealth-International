import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/index.js';
import os from 'os';
import fs from 'fs/promises';

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

export class MonitoringService {
  private static performanceData: Map<string, PerformanceMetrics> = new Map();
  private static securityEvents: SecurityEvent[] = [];
  private static requestCounts: Map<string, number> = new Map();
  private static errorCounts: Map<string, number> = new Map();

  /**
   * Get comprehensive system health status
   */
  static async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    try {
      const startTime = Date.now();
      
      // Test database connection
      const dbHealth = await DatabaseService.healthCheck();
      const dbResponseTime = Date.now() - startTime;

      // Get system metrics
      const memoryUsage = process.memoryUsage();
      const loadAverage = os.loadavg();
      const uptime = process.uptime();

      // Calculate API metrics
      const totalRequests = Array.from(this.requestCounts.values()).reduce((sum, count) => sum + count, 0);
      const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
      const averageResponseTime = this.calculateAverageResponseTime();
      const slowRequestPercentage = this.calculateSlowRequestPercentage();

      // Calculate requests per minute (simplified)
      const requestsPerMinute = totalRequests / (uptime / 60);

      // Get security metrics
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
              usage: loadAverage[0] * 100 // Simplified CPU usage
            },
            platform: os.platform(),
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
          },
          database: {
            connected: dbHealth,
            responseTime: dbResponseTime,
            activeConnections: 1, // Simplified - would need actual pool monitoring
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
    } catch (error) {
      console.error('Get system health error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get detailed performance metrics
   */
  static async getPerformanceMetrics(): Promise<ApiResponse<PerformanceMetrics[]>> {
    try {
      const metrics = Array.from(this.performanceData.values());
      
      return {
        success: true,
        data: metrics
      };
    } catch (error) {
      console.error('Get performance metrics error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get database performance metrics
   */
  static async getDatabaseMetrics(): Promise<ApiResponse<DatabaseMetrics[]>> {
    try {
      const tables = ['users', 'companies', 'funding_opportunities', 'news_articles', 'events'];
      const metrics: DatabaseMetrics[] = [];

      for (const table of tables) {
        try {
          const count = await DatabaseService.count(table);
          const size = await this.getTableSize(table);
          const lastUpdated = new Date().toISOString(); // Simplified
          const indexCount = await this.getIndexCount(table);

          metrics.push({
            tableName: table,
            rowCount: count,
            size,
            lastUpdated,
            indexCount
          });
        } catch (error) {
          console.error(`Error getting metrics for table ${table}:`, error);
        }
      }

      return {
        success: true,
        data: metrics
      };
    } catch (error) {
      console.error('Get database metrics error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get security events
   */
  static async getSecurityEvents(limit: number = 50): Promise<ApiResponse<SecurityEvent[]>> {
    try {
      const events = this.securityEvents
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      return {
        success: true,
        data: events
      };
    } catch (error) {
      console.error('Get security events error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Record API performance
   */
  static recordApiPerformance(endpoint: string, method: string, responseTime: number, success: boolean) {
    const key = `${method}:${endpoint}`;
    
    // Update request count
    this.requestCounts.set(key, (this.requestCounts.get(key) || 0) + 1);
    
    // Update error count
    if (!success) {
      this.errorCounts.set(key, (this.errorCounts.get(key) || 0) + 1);
    }

    // Update performance data
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
    } else {
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

  /**
   * Record security event
   */
  static recordSecurityEvent(event: Omit<SecurityEvent, 'id'>) {
    const securityEvent: SecurityEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...event,
      timestamp: new Date().toISOString()
    };

    this.securityEvents.push(securityEvent);
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }
  }

  /**
   * Get system logs
   */
  static async getSystemLogs(limit: number = 100): Promise<ApiResponse<{ logs: string[] }>> {
    try {
      // In a real implementation, you would read from actual log files
      // For now, we'll return a placeholder
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
    } catch (error) {
      console.error('Get system logs error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get disk usage information
   */
  static async getDiskUsage(): Promise<ApiResponse<{ total: number; used: number; free: number; percentage: number }>> {
    try {
      // Simplified disk usage - in production you'd use actual disk monitoring
      const stats = await fs.stat('.');
      const total = 1000000000; // 1GB placeholder
      const used = 500000000; // 500MB placeholder
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
    } catch (error) {
      console.error('Get disk usage error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  // Helper methods
  private static calculateAverageResponseTime(): number {
    const metrics = Array.from(this.performanceData.values());
    if (metrics.length === 0) return 0;
    
    const totalTime = metrics.reduce((sum, metric) => sum + (metric.averageResponseTime * metric.totalRequests), 0);
    const totalRequests = metrics.reduce((sum, metric) => sum + metric.totalRequests, 0);
    
    return totalRequests > 0 ? Math.round(totalTime / totalRequests) : 0;
  }

  private static calculateSlowRequestPercentage(): number {
    const metrics = Array.from(this.performanceData.values());
    if (metrics.length === 0) return 0;
    
    const slowRequests = metrics.filter(metric => metric.averageResponseTime > 1000).length;
    return metrics.length > 0 ? Math.round((slowRequests / metrics.length) * 100) : 0;
  }

  private static async getTableSize(tableName: string): Promise<string> {
    try {
      // Simplified - in production you'd query actual table size
      return '1.2 MB';
    } catch (error) {
      return 'Unknown';
    }
  }

  private static async getIndexCount(tableName: string): Promise<number> {
    try {
      // Simplified - in production you'd query actual index count
      return 3; // Placeholder
    } catch (error) {
      return 0;
    }
  }
}
