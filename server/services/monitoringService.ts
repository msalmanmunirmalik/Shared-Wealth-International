import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from './databaseService.js';
import { CacheService } from './cacheService.js';

export interface PerformanceMetrics {
  timestamp: Date;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  activeConnections: number;
  cacheHitRate: number;
  errorCount: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  memory: {
    used: number;
    free: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  database: {
    connected: boolean;
    responseTime: number;
    activeConnections: number;
  };
  cache: {
    connected: boolean;
    memoryUsage: number;
    hitRate: number;
  };
  disk: {
    used: number;
    free: number;
    total: number;
    percentage: number;
  };
}

export interface AlertConfig {
  memoryThreshold: number; // percentage
  cpuThreshold: number; // percentage
  responseTimeThreshold: number; // milliseconds
  errorRateThreshold: number; // percentage
  diskThreshold: number; // percentage
}

export class MonitoringService {
  private db: DatabaseService;
  private cache: CacheService;
  private metrics: PerformanceMetrics[] = [];
  private alertConfig: AlertConfig;
  private alertHistory: Array<{
    timestamp: Date;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> = [];

  constructor(db: DatabaseService, cache: CacheService) {
    this.db = db;
    this.cache = cache;
    this.alertConfig = {
      memoryThreshold: 80,
      cpuThreshold: 70,
      responseTimeThreshold: 2000,
      errorRateThreshold: 5,
      diskThreshold: 85
    };

    // Start periodic health checks
    this.startHealthChecks();
  }

  /**
   * Record performance metrics
   */
  recordMetrics(req: Request, res: Response, next: NextFunction) {
    const startTime = process.hrtime();
    const startMemory = process.memoryUsage();
    const startCpu = process.cpuUsage();

    // Override res.end to capture response time
    const originalEnd = res.end.bind(res);
    res.end = (chunk?: any, encoding?: any) => {
      const endTime = process.hrtime(startTime);
      const endMemory = process.memoryUsage();
      const endCpu = process.cpuUsage(startCpu);

      const responseTime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds

      const metrics: PerformanceMetrics = {
        timestamp: new Date(),
        endpoint: req.path,
        method: req.method,
        responseTime,
        statusCode: res.statusCode,
        memoryUsage: endMemory,
        cpuUsage: endCpu,
        activeConnections: (this.db as any).pool?.totalCount || 0,
        cacheHitRate: this.calculateCacheHitRate(),
        errorCount: res.statusCode >= 400 ? 1 : 0
      };

      this.metrics.push(metrics);

      // Keep only last 1000 metrics
      if (this.metrics.length > 1000) {
        this.metrics = this.metrics.slice(-1000);
      }

      // Check for alerts
      this.checkAlerts(metrics);

      return originalEnd(chunk, encoding);
    };

    next();
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const memory = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const freeMemory = require('os').freemem();
    const cpuUsage = process.cpuUsage();
    const loadAverage = require('os').loadavg();

    // Database health
    const dbStartTime = process.hrtime();
    let dbConnected = false;
    let dbResponseTime = 0;

    try {
      await this.db.query('SELECT 1');
      dbConnected = true;
      const dbEndTime = process.hrtime(dbStartTime);
      dbResponseTime = dbEndTime[0] * 1000 + dbEndTime[1] / 1000000;
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    // Cache health
    const cacheConnected = this.cache.isReady();
    const cacheStats = await this.cache.getStats();

    // Disk usage
    const diskUsage = await this.getDiskUsage();

    const health: SystemHealth = {
      status: this.determineHealthStatus({
        memory: memory.heapUsed / totalMemory * 100,
        cpu: this.calculateCpuUsage(cpuUsage),
        dbConnected,
        dbResponseTime,
        cacheConnected,
        disk: diskUsage.percentage
      }),
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: {
        used: memory.heapUsed,
        free: freeMemory,
        total: totalMemory,
        percentage: (memory.heapUsed / totalMemory) * 100
      },
      cpu: {
        usage: this.calculateCpuUsage(cpuUsage),
        loadAverage
      },
      database: {
        connected: dbConnected,
        responseTime: dbResponseTime,
        activeConnections: (this.db as any).pool?.totalCount || 0
      },
      cache: {
        connected: cacheConnected,
        memoryUsage: cacheStats.memory?.usage || 0,
        hitRate: this.calculateCacheHitRate()
      },
      disk: diskUsage
    };

    return health;
  }

  /**
   * Get performance metrics
   */
  getMetrics(limit: number = 100): PerformanceMetrics[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    averageResponseTime: number;
    totalRequests: number;
    errorRate: number;
    cacheHitRate: number;
    memoryUsage: number;
    cpuUsage: number;
  } {
    if (this.metrics.length === 0) {
      return {
        averageResponseTime: 0,
        totalRequests: 0,
        errorRate: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        cpuUsage: 0
      };
    }

    const totalRequests = this.metrics.length;
    const errorCount = this.metrics.filter(m => m.statusCode >= 400).length;
    const totalResponseTime = this.metrics.reduce((sum, m) => sum + m.responseTime, 0);
    const totalMemory = this.metrics.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0);
    const totalCpu = this.metrics.reduce((sum, m) => sum + m.cpuUsage.user + m.cpuUsage.system, 0);

    return {
      averageResponseTime: totalResponseTime / totalRequests,
      totalRequests,
      errorRate: (errorCount / totalRequests) * 100,
      cacheHitRate: this.calculateCacheHitRate(),
      memoryUsage: totalMemory / totalRequests,
      cpuUsage: totalCpu / totalRequests
    };
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit: number = 50): Array<{
    timestamp: Date;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> {
    return this.alertHistory.slice(-limit);
  }

  /**
   * Update alert configuration
   */
  updateAlertConfig(config: Partial<AlertConfig>): void {
    this.alertConfig = { ...this.alertConfig, ...config };
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    setInterval(async () => {
      try {
        const health = await this.getSystemHealth();
        
        // Check for critical issues
        if (health.status === 'unhealthy') {
          this.addAlert('system', 'System is unhealthy', 'critical');
        } else if (health.status === 'degraded') {
          this.addAlert('system', 'System performance is degraded', 'medium');
        }

        // Log health status
        console.log(`🏥 System Health: ${health.status.toUpperCase()} - Memory: ${health.memory.percentage.toFixed(1)}%, CPU: ${health.cpu.usage.toFixed(1)}%`);
      } catch (error) {
        console.error('❌ Health check failed:', error);
        this.addAlert('health-check', 'Health check failed', 'high');
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check for alerts based on metrics
   */
  private checkAlerts(metrics: PerformanceMetrics): void {
    const memoryPercentage = (metrics.memoryUsage.heapUsed / require('os').totalmem()) * 100;
    const cpuUsage = this.calculateCpuUsage(metrics.cpuUsage);

    // Memory alert
    if (memoryPercentage > this.alertConfig.memoryThreshold) {
      this.addAlert('memory', `High memory usage: ${memoryPercentage.toFixed(1)}%`, 'high');
    }

    // CPU alert
    if (cpuUsage > this.alertConfig.cpuThreshold) {
      this.addAlert('cpu', `High CPU usage: ${cpuUsage.toFixed(1)}%`, 'high');
    }

    // Response time alert
    if (metrics.responseTime > this.alertConfig.responseTimeThreshold) {
      this.addAlert('performance', `Slow response time: ${metrics.responseTime.toFixed(0)}ms`, 'medium');
    }

    // Error rate alert
    if (metrics.errorCount > 0) {
      this.addAlert('error', `Error detected: ${metrics.endpoint} returned ${metrics.statusCode}`, 'medium');
    }
  }

  /**
   * Add alert to history
   */
  private addAlert(type: string, message: string, severity: 'low' | 'medium' | 'high' | 'critical'): void {
    const alert = {
      timestamp: new Date(),
      type,
      message,
      severity
    };

    this.alertHistory.push(alert);

    // Keep only last 100 alerts
    if (this.alertHistory.length > 100) {
      this.alertHistory = this.alertHistory.slice(-100);
    }

    // Log alert
    console.warn(`🚨 ALERT [${severity.toUpperCase()}] ${type}: ${message}`);

    // Send critical alerts (implement notification service)
    if (severity === 'critical') {
      this.sendCriticalAlert(alert);
    }
  }

  /**
   * Send critical alert (implement with your notification service)
   */
  private sendCriticalAlert(alert: any): void {
    // TODO: Implement email/Slack/Discord notifications
    console.error(`🚨 CRITICAL ALERT: ${alert.message}`);
  }

  /**
   * Calculate CPU usage percentage
   */
  private calculateCpuUsage(cpuUsage: NodeJS.CpuUsage): number {
    const total = cpuUsage.user + cpuUsage.system;
    return (total / 1000000) * 100; // Convert to percentage
  }

  /**
   * Calculate cache hit rate
   */
  private calculateCacheHitRate(): number {
    // This would need to be implemented based on your cache service
    // For now, return a placeholder
    return 85.5;
  }

  /**
   * Determine overall health status
   */
  private determineHealthStatus(metrics: {
    memory: number;
    cpu: number;
    dbConnected: boolean;
    dbResponseTime: number;
    cacheConnected: boolean;
    disk: number;
  }): 'healthy' | 'degraded' | 'unhealthy' {
    // Critical issues
    if (!metrics.dbConnected || metrics.memory > 95 || metrics.cpu > 90 || metrics.disk > 95) {
      return 'unhealthy';
    }

    // Warning conditions
    if (metrics.memory > 80 || metrics.cpu > 70 || metrics.dbResponseTime > 1000 || metrics.disk > 85) {
      return 'degraded';
    }

    return 'healthy';
  }

  /**
   * Get disk usage information
   */
  private async getDiskUsage(): Promise<{ used: number; free: number; total: number; percentage: number }> {
    try {
      const fs = require('fs');
      const stats = fs.statSync('.');
      
      // This is a simplified implementation
      // In production, you'd want to use a proper disk usage library
      return {
        used: 0,
        free: 0,
        total: 0,
        percentage: 0
      };
    } catch (error) {
      return {
        used: 0,
        free: 0,
        total: 0,
        percentage: 0
      };
    }
  }
}

export default MonitoringService;
