import { Request, Response } from 'express';
import { UnifiedDashboardService } from '../services/unifiedDashboardService.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

export class UnifiedDashboardController {
  /**
   * Get unified dashboard data for authenticated user
   * Combines user dashboard, company dashboard, and admin dashboard data
   */
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { sections = 'all', period = '30d' } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedDashboardService.getDashboardData(userId, {
        sections: sections as string,
        period: period as string
      });

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get dashboard data'
        });
      }
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user-specific dashboard data
   */
  static async getUserDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { period = '30d' } = req.query;
      const authUserId = (req as any).user?.id;

      // Users can only view their own dashboard unless they're admin
      if (authUserId !== userId && (req as any).user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Unauthorized to view this dashboard'
        });
        return;
      }

      const result = await UnifiedDashboardService.getUserDashboardData(userId, period as string);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get user dashboard data'
        });
      }
    } catch (error) {
      console.error('Get user dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get company-specific dashboard data
   */
  static async getCompanyDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const { period = '30d' } = req.query;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      // Check if user has access to this company
      const hasAccess = await UnifiedDashboardService.checkCompanyAccess(userId, companyId);
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: 'Unauthorized to view this company dashboard'
        });
        return;
      }

      const result = await UnifiedDashboardService.getCompanyDashboardData(companyId, period as string);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get company dashboard data'
        });
      }
    } catch (error) {
      console.error('Get company dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get admin dashboard data
   */
  static async getAdminDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { period = '30d' } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      // Check if user is admin
      const isAdmin = await UnifiedDashboardService.checkAdminAccess(userId);
      if (!isAdmin) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const result = await UnifiedDashboardService.getAdminDashboardData(period as string);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get admin dashboard data'
        });
      }
    } catch (error) {
      console.error('Get admin dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get dashboard analytics
   */
  static async getDashboardAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { type = 'overview', period = '30d', entityId, entityType } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedDashboardService.getAnalytics(userId, {
        type: type as string,
        period: period as string,
        entityId: entityId as string,
        entityType: entityType as string
      });

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get analytics'
        });
      }
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get dashboard widgets configuration
   */
  static async getDashboardWidgets(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { dashboardType = 'user' } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedDashboardService.getDashboardWidgets(userId, dashboardType as string);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get dashboard widgets'
        });
      }
    } catch (error) {
      console.error('Get dashboard widgets error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update dashboard widget configuration
   */
  static async updateDashboardWidgets(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { widgets } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!widgets || !Array.isArray(widgets)) {
        res.status(400).json({
          success: false,
          message: 'Widgets configuration is required'
        });
        return;
      }

      const result = await UnifiedDashboardService.updateDashboardWidgets(userId, widgets);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Dashboard widgets updated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to update dashboard widgets'
        });
      }
    } catch (error) {
      console.error('Update dashboard widgets error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get dashboard notifications
   */
  static async getDashboardNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { limit = '10', offset = '0', type = 'all' } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedDashboardService.getNotifications(userId, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        type: type as string
      });

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
            total: result.total || 0
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get notifications'
        });
      }
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Mark notification as read
   */
  static async markNotificationRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { notificationId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedDashboardService.markNotificationRead(userId, notificationId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Notification marked as read'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to mark notification as read'
        });
      }
    } catch (error) {
      console.error('Mark notification read error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get dashboard activity feed
   */
  static async getActivityFeed(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { limit = '20', offset = '0', type = 'all' } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedDashboardService.getActivityFeed(userId, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        type: type as string
      });

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
            total: result.total || 0
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get activity feed'
        });
      }
    } catch (error) {
      console.error('Get activity feed error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
