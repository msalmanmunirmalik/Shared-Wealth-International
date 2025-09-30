import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/index.js';

export interface DashboardStats {
  totalCompanies: number;
  networkPartners: number;
  growthRate: number;
  activeProjects: number;
  pendingApplications: number;
  approvedCompanies: number;
  totalUsers: number;
  totalEvents: number;
  totalForumPosts: number;
  totalMessages: number;
  recentActivities: number;
  collaborationMeetings: number;
}

export class DashboardController {
  /**
   * Get comprehensive dashboard statistics
   */
  static async getDashboardStats(req: AuthenticatedRequest, res: Response<ApiResponse<DashboardStats>>) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      // Get user's companies count
      const userCompanies = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM user_companies uc
        WHERE uc.user_id = $1 AND uc.status = 'active'
      `, [userId]);

      // Get total approved companies in network
      const networkCompanies = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM companies
        WHERE is_active = true AND is_verified = true
      `);

      // Get active projects count
      const activeProjects = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM projects p
        INNER JOIN user_companies uc ON p.company_id = uc.company_id
        WHERE uc.user_id = $1 AND p.status = 'active'
      `, [userId]);

      // Get pending applications count
      const pendingApplications = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM company_applications
        WHERE application_status = 'pending'
      `);

      // Get approved companies count
      const approvedCompanies = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM companies
        WHERE is_active = true AND is_verified = true
      `);

      // Get total users count
      const totalUsers = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM users
        WHERE is_active = true
      `);

      // Get total events count
      const totalEvents = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM events
        WHERE status = 'upcoming'
      `);

      // Get total forum posts count
      const totalForumPosts = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM forum_topics
      `);

      // Get total messages count
      const totalMessages = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM messages
        WHERE sender_id = $1 OR recipient_id = $1
      `, [userId]);

      // Get recent activities count (last 30 days)
      const recentActivities = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM activity_feed
        WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
      `, [userId]);

      // Get collaboration meetings count
      const collaborationMeetings = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM collaboration_meetings cm
        INNER JOIN user_companies uc ON cm.company_id = uc.company_id
        WHERE uc.user_id = $1 AND cm.meeting_date >= NOW() - INTERVAL '30 days'
      `, [userId]);

      // Calculate growth rate (simplified calculation)
      const userCompaniesCount = parseInt(userCompanies[0]?.count || '0');
      const networkCompaniesCount = parseInt(networkCompanies[0]?.count || '0');
      const growthRate = userCompaniesCount > 0 ? Math.round((userCompaniesCount / Math.max(networkCompaniesCount, 1)) * 100) : 0;

      const stats: DashboardStats = {
        totalCompanies: userCompaniesCount,
        networkPartners: networkCompaniesCount,
        growthRate: growthRate,
        activeProjects: parseInt(activeProjects[0]?.count || '0'),
        pendingApplications: parseInt(pendingApplications[0]?.count || '0'),
        approvedCompanies: parseInt(approvedCompanies[0]?.count || '0'),
        totalUsers: parseInt(totalUsers[0]?.count || '0'),
        totalEvents: parseInt(totalEvents[0]?.count || '0'),
        totalForumPosts: parseInt(totalForumPosts[0]?.count || '0'),
        totalMessages: parseInt(totalMessages[0]?.count || '0'),
        recentActivities: parseInt(recentActivities[0]?.count || '0'),
        collaborationMeetings: parseInt(collaborationMeetings[0]?.count || '0')
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user's recent activities
   */
  static async getRecentActivities(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>) {
    try {
      const userId = req.user?.id;
      const { limit = 10 } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      const activities = await DatabaseService.findAll('activity_feed', {
        where: { user_id: userId },
        limit: parseInt(limit as string)
      });

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      console.error('Get recent activities error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user's projects
   */
  static async getUserProjects(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      const projects = await DatabaseService.query(`
        SELECT p.*, c.name as company_name
        FROM projects p
        INNER JOIN user_companies uc ON p.company_id = uc.company_id
        INNER JOIN companies c ON p.company_id = c.id
        WHERE uc.user_id = $1
        ORDER BY p.created_at DESC
      `, [userId]);

      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('Get user projects error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user's collaboration meetings
   */
  static async getUserMeetings(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      const meetings = await DatabaseService.query(`
        SELECT cm.*, c.name as company_name
        FROM collaboration_meetings cm
        INNER JOIN user_companies uc ON cm.company_id = uc.company_id
        INNER JOIN companies c ON cm.company_id = c.id
        WHERE uc.user_id = $1
        ORDER BY cm.meeting_date DESC
      `, [userId]);

      res.json({
        success: true,
        data: meetings
      });
    } catch (error) {
      console.error('Get user meetings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get platform-wide statistics (admin only)
   */
  static async getPlatformStats(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      // Check if user is admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      // Get comprehensive platform statistics
      const [
        totalUsers,
        totalCompanies,
        activeProjects,
        totalEvents,
        totalForumPosts,
        totalMessages,
        recentActivities
      ] = await Promise.all([
        DatabaseService.count('users', { where: { is_active: true } }),
        DatabaseService.count('companies', { where: { is_active: true, is_verified: true } }),
        DatabaseService.count('projects', { where: { status: 'active' } }),
        DatabaseService.count('events', { where: { status: 'upcoming' } }),
        DatabaseService.count('forum_topics'),
        DatabaseService.count('messages'),
        DatabaseService.count('activity_feed', { where: { created_at: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } })
      ]);

      const platformStats = {
        totalUsers,
        totalCompanies,
        activeProjects,
        totalEvents,
        totalForumPosts,
        totalMessages,
        recentActivities,
        platformHealth: 'healthy',
        lastUpdated: new Date()
      };

      res.json({
        success: true,
        data: platformStats
      });
    } catch (error) {
      console.error('Get platform stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
