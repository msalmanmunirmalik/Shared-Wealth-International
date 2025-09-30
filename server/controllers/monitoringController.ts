import { Request, Response } from 'express';
import { MonitoringService } from '../services/monitoringService.js';

export class MonitoringController {
  /**
   * Get comprehensive system health
   */
  static async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      const result = await MonitoringService.getSystemHealth();
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get system health controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get performance metrics
   */
  static async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      const result = await MonitoringService.getPerformanceMetrics();
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get performance metrics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get database metrics
   */
  static async getDatabaseMetrics(req: Request, res: Response): Promise<void> {
    try {
      const result = await MonitoringService.getDatabaseMetrics();
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get database metrics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get security events
   */
  static async getSecurityEvents(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const limitNumber = limit ? parseInt(limit as string) : 50;
      
      const result = await MonitoringService.getSecurityEvents(limitNumber);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get security events controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get system logs
   */
  static async getSystemLogs(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const limitNumber = limit ? parseInt(limit as string) : 100;
      
      const result = await MonitoringService.getSystemLogs(limitNumber);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get system logs controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get disk usage
   */
  static async getDiskUsage(req: Request, res: Response): Promise<void> {
    try {
      const result = await MonitoringService.getDiskUsage();
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get disk usage controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Record API performance (internal use)
   */
  static recordApiPerformance(endpoint: string, method: string, responseTime: number, success: boolean) {
    MonitoringService.recordApiPerformance(endpoint, method, responseTime, success);
  }

  /**
   * Record security event (internal use)
   */
  static recordSecurityEvent(event: {
    type: 'failed_login' | 'blocked_request' | 'suspicious_activity' | 'rate_limit_exceeded';
    description: string;
    ipAddress: string;
    userAgent: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }) {
    MonitoringService.recordSecurityEvent({
      ...event,
      timestamp: new Date().toISOString()
    });
  }
}
