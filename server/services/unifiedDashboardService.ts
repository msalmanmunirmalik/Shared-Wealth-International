import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/api.js';

export interface DashboardFilters {
  sections?: string;
  period?: string;
  type?: string;
  entityId?: string;
  entityType?: string;
  limit?: number;
  offset?: number;
}

export interface DashboardData {
  user: any;
  companies: any[];
  analytics: any;
  notifications: any[];
  activityFeed: any[];
  widgets: any[];
  recentContent: any[];
  socialStats: any;
  adminStats?: any;
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
  enabled: boolean;
}

export class UnifiedDashboardService {
  /**
   * Get comprehensive dashboard data for authenticated user
   */
  static async getDashboardData(userId: string, filters: DashboardFilters): Promise<ApiResponse<DashboardData>> {
    try {
      const sections = filters.sections?.split(',') || ['user', 'companies', 'analytics', 'notifications', 'activity', 'widgets', 'content', 'social'];
      
      const [
        userData,
        companiesData,
        analyticsData,
        notificationsData,
        activityData,
        widgetsData,
        contentData,
        socialData,
        adminData
      ] = await Promise.all([
        sections.includes('user') ? this.getUserData(userId) : Promise.resolve({ success: true, data: null }),
        sections.includes('companies') ? this.getUserCompanies(userId) : Promise.resolve({ success: true, data: [] }),
        sections.includes('analytics') ? this.getUserAnalytics(userId, filters.period || '30d') : Promise.resolve({ success: true, data: {} }),
        sections.includes('notifications') ? this.getNotifications(userId, { limit: 10, offset: 0, type: 'all' }) : Promise.resolve({ success: true, data: [] }),
        sections.includes('activity') ? this.getActivityFeed(userId, { limit: 20, offset: 0, type: 'all' }) : Promise.resolve({ success: true, data: [] }),
        sections.includes('widgets') ? this.getDashboardWidgets(userId, 'user') : Promise.resolve({ success: true, data: [] }),
        sections.includes('content') ? this.getRecentContent(userId) : Promise.resolve({ success: true, data: [] }),
        sections.includes('social') ? this.getSocialStats(userId) : Promise.resolve({ success: true, data: {} }),
        await this.checkAdminAccess(userId) ? this.getAdminStats(filters.period || '30d') : Promise.resolve({ success: true, data: null })
      ]);

      const dashboardData: DashboardData = {
        user: userData.data,
        companies: companiesData.data || [],
        analytics: analyticsData.data || {},
        notifications: notificationsData.data || [],
        activityFeed: activityData.data || [],
        widgets: widgetsData.data || [],
        recentContent: contentData.data || [],
        socialStats: socialData.data || {},
        adminStats: adminData.data
      };

      return {
        success: true,
        data: dashboardData
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return {
        success: false,
        message: 'Failed to get dashboard data'
      };
    }
  }

  /**
   * Get user-specific dashboard data
   */
  static async getUserDashboardData(userId: string, period: string): Promise<ApiResponse<any>> {
    try {
      const [
        userData,
        analyticsData,
        socialData,
        contentData
      ] = await Promise.all([
        this.getUserData(userId),
        this.getUserAnalytics(userId, period),
        this.getSocialStats(userId),
        this.getRecentContent(userId)
      ]);

      return {
        success: true,
        data: {
          user: userData.data,
          analytics: analyticsData.data,
          socialStats: socialData.data,
          recentContent: contentData.data
        }
      };
    } catch (error) {
      console.error('Error getting user dashboard data:', error);
      return {
        success: false,
        message: 'Failed to get user dashboard data'
      };
    }
  }

  /**
   * Get company-specific dashboard data
   */
  static async getCompanyDashboardData(companyId: string, period: string): Promise<ApiResponse<any>> {
    try {
      const [
        companyData,
        analyticsData,
        contentData,
        teamData
      ] = await Promise.all([
        this.getCompanyData(companyId),
        this.getCompanyAnalytics(companyId, period),
        this.getCompanyContent(companyId),
        this.getCompanyTeam(companyId)
      ]);

      return {
        success: true,
        data: {
          company: companyData.data,
          analytics: analyticsData.data,
          content: contentData.data,
          team: teamData.data
        }
      };
    } catch (error) {
      console.error('Error getting company dashboard data:', error);
      return {
        success: false,
        message: 'Failed to get company dashboard data'
      };
    }
  }

  /**
   * Get admin dashboard data
   */
  static async getAdminDashboardData(period: string): Promise<ApiResponse<any>> {
    try {
      const [
        platformStats,
        userStats,
        companyStats,
        contentStats,
        systemStats
      ] = await Promise.all([
        this.getPlatformStats(period),
        this.getUserStats(period),
        this.getCompanyStats(period),
        this.getContentStats(period),
        this.getSystemStats()
      ]);

      return {
        success: true,
        data: {
          platform: platformStats.data,
          users: userStats.data,
          companies: companyStats.data,
          content: contentStats.data,
          system: systemStats.data
        }
      };
    } catch (error) {
      console.error('Error getting admin dashboard data:', error);
      return {
        success: false,
        message: 'Failed to get admin dashboard data'
      };
    }
  }

  /**
   * Get analytics data
   */
  static async getAnalytics(userId: string, filters: DashboardFilters): Promise<ApiResponse<any>> {
    try {
      const { type, period, entityId, entityType } = filters;

      let analyticsData;
      switch (type) {
        case 'user':
          analyticsData = await this.getUserAnalytics(userId, period || '30d');
          break;
        case 'company':
          if (!entityId) {
            return { success: false, message: 'Company ID required for company analytics' };
          }
          analyticsData = await this.getCompanyAnalytics(entityId, period || '30d');
          break;
        case 'platform':
          analyticsData = await this.getPlatformAnalytics(period || '30d');
          break;
        default:
          analyticsData = await this.getUserAnalytics(userId, period || '30d');
      }

      return analyticsData;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        success: false,
        message: 'Failed to get analytics'
      };
    }
  }

  /**
   * Get dashboard widgets configuration
   */
  static async getDashboardWidgets(userId: string, dashboardType: string): Promise<ApiResponse<WidgetConfig[]>> {
    try {
      // Get default widgets based on dashboard type
      const defaultWidgets = this.getDefaultWidgets(dashboardType);
      
      // Try to get user's custom widget configuration
      const customWidgetsQuery = `
        SELECT widget_config FROM user_preferences 
        WHERE user_id = $1 AND preference_type = 'dashboard_widgets'
      `;
      
      const customResult = await DatabaseService.query(customWidgetsQuery, [userId]);
      
      if (customResult.rows.length > 0) {
        const customWidgets = JSON.parse(customResult.rows[0].widget_config);
        return {
          success: true,
          data: customWidgets
        };
      }

      return {
        success: true,
        data: defaultWidgets
      };
    } catch (error) {
      console.error('Error getting dashboard widgets:', error);
      return {
        success: false,
        message: 'Failed to get dashboard widgets',
        data: this.getDefaultWidgets(dashboardType)
      };
    }
  }

  /**
   * Update dashboard widgets configuration
   */
  static async updateDashboardWidgets(userId: string, widgets: WidgetConfig[]): Promise<ApiResponse<WidgetConfig[]>> {
    try {
      const upsertQuery = `
        INSERT INTO user_preferences (user_id, preference_type, widget_config, updated_at)
        VALUES ($1, 'dashboard_widgets', $2, NOW())
        ON CONFLICT (user_id, preference_type)
        DO UPDATE SET widget_config = $2, updated_at = NOW()
        RETURNING widget_config
      `;
      
      const result = await DatabaseService.query(upsertQuery, [userId, JSON.stringify(widgets)]);
      
      if (result.rows.length > 0) {
        return {
          success: true,
          data: JSON.parse(result.rows[0].widget_config)
        };
      } else {
        return {
          success: false,
          message: 'Failed to update dashboard widgets'
        };
      }
    } catch (error) {
      console.error('Error updating dashboard widgets:', error);
      return {
        success: false,
        message: 'Failed to update dashboard widgets'
      };
    }
  }

  /**
   * Get notifications
   */
  static async getNotifications(userId: string, filters: { limit: number; offset: number; type: string }): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = 'WHERE user_id = $1';
      let queryParams: any[] = [userId];
      let paramIndex = 2;

      if (filters.type !== 'all') {
        whereCondition += ` AND type = $${paramIndex}`;
        queryParams.push(filters.type);
        paramIndex++;
      }

      const query = `
        SELECT 
          id, type, title, message, data, is_read, created_at
        FROM notifications
        ${whereCondition}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      queryParams.push(filters.limit, filters.offset);
      
      const result = await DatabaseService.query(query, queryParams);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM notifications
        ${whereCondition}
      `;
      const countResult = await DatabaseService.query(countQuery, queryParams.slice(0, -2));
      const total = parseInt(countResult.rows[0]?.total || '0');
      
      return {
        success: true,
        data: result.rows || [],
        total
      };
    } catch (error) {
      console.error('Error getting notifications:', error);
      return {
        success: false,
        message: 'Failed to get notifications',
        data: []
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markNotificationRead(userId: string, notificationId: string): Promise<ApiResponse<boolean>> {
    try {
      const updateQuery = `
        UPDATE notifications 
        SET is_read = true, read_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING id
      `;
      
      const result = await DatabaseService.query(updateQuery, [notificationId, userId]);
      
      if (result.rows.length > 0) {
        return {
          success: true,
          data: true
        };
      } else {
        return {
          success: false,
          message: 'Notification not found'
        };
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        message: 'Failed to mark notification as read'
      };
    }
  }

  /**
   * Get activity feed
   */
  static async getActivityFeed(userId: string, filters: { limit: number; offset: number; type: string }): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = 'WHERE user_id = $1';
      let queryParams: any[] = [userId];
      let paramIndex = 2;

      if (filters.type !== 'all') {
        whereCondition += ` AND activity_type = $${paramIndex}`;
        queryParams.push(filters.type);
        paramIndex++;
      }

      const query = `
        SELECT 
          id, activity_type, title, description, data, created_at
        FROM activity_feed
        ${whereCondition}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      queryParams.push(filters.limit, filters.offset);
      
      const result = await DatabaseService.query(query, queryParams);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM activity_feed
        ${whereCondition}
      `;
      const countResult = await DatabaseService.query(countQuery, queryParams.slice(0, -2));
      const total = parseInt(countResult.rows[0]?.total || '0');
      
      return {
        success: true,
        data: result.rows || [],
        total
      };
    } catch (error) {
      console.error('Error getting activity feed:', error);
      return {
        success: false,
        message: 'Failed to get activity feed',
        data: []
      };
    }
  }

  /**
   * Check if user has access to company
   */
  static async checkCompanyAccess(userId: string, companyId: string): Promise<boolean> {
    try {
      const query = `
        SELECT 1 FROM user_companies 
        WHERE user_id = $1 AND company_id = $2
      `;
      
      const result = await DatabaseService.query(query, [userId, companyId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking company access:', error);
      return false;
    }
  }

  /**
   * Check if user is admin
   */
  static async checkAdminAccess(userId: string): Promise<boolean> {
    try {
      const query = `
        SELECT role FROM users 
        WHERE id = $1 AND role = 'admin'
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }

  // Helper methods for data retrieval
  private static async getUserData(userId: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          u.*,
          COUNT(DISTINCT uc.company_id) as companies_count,
          COUNT(DISTINCT uc_following.following_id) as following_count,
          COUNT(DISTINCT uc_followers.follower_id) as followers_count
        FROM users u
        LEFT JOIN user_companies uc ON u.id = uc.user_id
        LEFT JOIN user_connections uc_following ON u.id = uc_following.follower_id
        LEFT JOIN user_connections uc_followers ON u.id = uc_followers.following_id
        WHERE u.id = $1
        GROUP BY u.id
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      return {
        success: true,
        data: result.rows[0] || null
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return {
        success: false,
        message: 'Failed to get user data'
      };
    }
  }

  private static async getUserCompanies(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT 
          c.*,
          uc.role,
          uc.joined_at
        FROM companies c
        JOIN user_companies uc ON c.id = uc.company_id
        WHERE uc.user_id = $1
        ORDER BY uc.joined_at DESC
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      return {
        success: true,
        data: result.rows || []
      };
    } catch (error) {
      console.error('Error getting user companies:', error);
      return {
        success: false,
        message: 'Failed to get user companies',
        data: []
      };
    }
  }

  private static async getUserAnalytics(userId: string, period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(DISTINCT uc.id) as content_created,
          COUNT(DISTINCT pr.id) as reactions_given,
          COUNT(DISTINCT cs.id) as content_shared,
          COUNT(DISTINCT b.id) as content_bookmarked,
          COUNT(DISTINCT uc_conn.id) as connections_made
        FROM users u
        LEFT JOIN unified_content uc ON u.id = uc.author_id AND uc.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN post_reactions pr ON u.id = pr.user_id AND pr.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN content_shares cs ON u.id = cs.user_id AND cs.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN bookmarks b ON u.id = b.user_id AND b.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN user_connections uc_conn ON u.id = uc_conn.follower_id AND uc_conn.created_at > NOW() - INTERVAL '${periodDays} days'
        WHERE u.id = $1
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return {
        success: false,
        message: 'Failed to get user analytics',
        data: {}
      };
    }
  }

  private static async getSocialStats(userId: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT uc_following.following_id) as following_count,
          COUNT(DISTINCT uc_followers.follower_id) as followers_count,
          COUNT(DISTINCT pr.id) as total_reactions_given,
          COUNT(DISTINCT cs.id) as total_shares,
          COUNT(DISTINCT b.id) as total_bookmarks
        FROM users u
        LEFT JOIN user_connections uc_following ON u.id = uc_following.follower_id
        LEFT JOIN user_connections uc_followers ON u.id = uc_followers.following_id
        LEFT JOIN post_reactions pr ON u.id = pr.user_id
        LEFT JOIN content_shares cs ON u.id = cs.user_id
        LEFT JOIN bookmarks b ON u.id = b.user_id
        WHERE u.id = $1
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting social stats:', error);
      return {
        success: false,
        message: 'Failed to get social stats',
        data: {}
      };
    }
  }

  private static async getRecentContent(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT 
          uc.*,
          c.name as company_name,
          c.logo_url as company_logo
        FROM unified_content uc
        LEFT JOIN companies c ON uc.company_id = c.id
        WHERE uc.author_id = $1
        ORDER BY uc.created_at DESC
        LIMIT 10
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      return {
        success: true,
        data: result.rows || []
      };
    } catch (error) {
      console.error('Error getting recent content:', error);
      return {
        success: false,
        message: 'Failed to get recent content',
        data: []
      };
    }
  }

  private static async getCompanyData(companyId: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          c.*,
          COUNT(DISTINCT uc.id) as content_count,
          COUNT(DISTINCT uc_users.id) as team_size
        FROM companies c
        LEFT JOIN unified_content uc ON c.id = uc.company_id
        LEFT JOIN user_companies uc_users ON c.id = uc_users.company_id
        WHERE c.id = $1
        GROUP BY c.id
      `;
      
      const result = await DatabaseService.query(query, [companyId]);
      return {
        success: true,
        data: result.rows[0] || null
      };
    } catch (error) {
      console.error('Error getting company data:', error);
      return {
        success: false,
        message: 'Failed to get company data'
      };
    }
  }

  private static async getCompanyAnalytics(companyId: string, period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(DISTINCT uc.id) as content_created,
          COUNT(DISTINCT pr.id) as total_reactions,
          COUNT(DISTINCT cs.id) as total_shares,
          COUNT(DISTINCT uc.id) FILTER (WHERE uc.created_at > NOW() - INTERVAL '${periodDays} days') as recent_content
        FROM companies c
        LEFT JOIN unified_content uc ON c.id = uc.company_id
        LEFT JOIN post_reactions pr ON uc.id = pr.content_id AND pr.content_type = 'unified_content'
        LEFT JOIN content_shares cs ON uc.id = cs.content_id
        WHERE c.id = $1
      `;
      
      const result = await DatabaseService.query(query, [companyId]);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting company analytics:', error);
      return {
        success: false,
        message: 'Failed to get company analytics',
        data: {}
      };
    }
  }

  private static async getCompanyContent(companyId: string): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT 
          uc.*,
          u.first_name || ' ' || u.last_name as author_name
        FROM unified_content uc
        JOIN users u ON uc.author_id = u.id
        WHERE uc.company_id = $1
        ORDER BY uc.created_at DESC
        LIMIT 20
      `;
      
      const result = await DatabaseService.query(query, [companyId]);
      return {
        success: true,
        data: result.rows || []
      };
    } catch (error) {
      console.error('Error getting company content:', error);
      return {
        success: false,
        message: 'Failed to get company content',
        data: []
      };
    }
  }

  private static async getCompanyTeam(companyId: string): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          uc.role,
          uc.joined_at
        FROM users u
        JOIN user_companies uc ON u.id = uc.user_id
        WHERE uc.company_id = $1
        ORDER BY uc.joined_at ASC
      `;
      
      const result = await DatabaseService.query(query, [companyId]);
      return {
        success: true,
        data: result.rows || []
      };
    } catch (error) {
      console.error('Error getting company team:', error);
      return {
        success: false,
        message: 'Failed to get company team',
        data: []
      };
    }
  }

  private static async getAdminStats(period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT c.id) as total_companies,
          COUNT(DISTINCT uc.id) as total_content,
          COUNT(DISTINCT u.id) FILTER (WHERE u.created_at > NOW() - INTERVAL '${periodDays} days') as new_users,
          COUNT(DISTINCT c.id) FILTER (WHERE c.created_at > NOW() - INTERVAL '${periodDays} days') as new_companies,
          COUNT(DISTINCT uc.id) FILTER (WHERE uc.created_at > NOW() - INTERVAL '${periodDays} days') as new_content
        FROM users u
        CROSS JOIN companies c
        LEFT JOIN unified_content uc ON true
      `;
      
      const result = await DatabaseService.query(query);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting admin stats:', error);
      return {
        success: false,
        message: 'Failed to get admin stats',
        data: {}
      };
    }
  }

  private static async getPlatformStats(period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT c.id) as total_companies,
          COUNT(DISTINCT uc.id) as total_content,
          COUNT(DISTINCT pr.id) as total_reactions,
          COUNT(DISTINCT cs.id) as total_shares
        FROM users u
        CROSS JOIN companies c
        LEFT JOIN unified_content uc ON true
        LEFT JOIN post_reactions pr ON true
        LEFT JOIN content_shares cs ON true
      `;
      
      const result = await DatabaseService.query(query);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting platform stats:', error);
      return {
        success: false,
        message: 'Failed to get platform stats',
        data: {}
      };
    }
  }

  private static async getUserStats(period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '${periodDays} days') as new_users,
          COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
          COUNT(*) FILTER (WHERE role = 'user') as regular_users
        FROM users
      `;
      
      const result = await DatabaseService.query(query);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        success: false,
        message: 'Failed to get user stats',
        data: {}
      };
    }
  }

  private static async getCompanyStats(period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(*) as total_companies,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '${periodDays} days') as new_companies,
          COUNT(*) FILTER (WHERE status = 'approved') as approved_companies,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_companies
        FROM companies
      `;
      
      const result = await DatabaseService.query(query);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting company stats:', error);
      return {
        success: false,
        message: 'Failed to get company stats',
        data: {}
      };
    }
  }

  private static async getContentStats(period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(*) as total_content,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '${periodDays} days') as new_content,
          COUNT(*) FILTER (WHERE is_published = true) as published_content,
          COUNT(*) FILTER (WHERE is_published = false) as draft_content
        FROM unified_content
      `;
      
      const result = await DatabaseService.query(query);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting content stats:', error);
      return {
        success: false,
        message: 'Failed to get content stats',
        data: {}
      };
    }
  }

  private static async getSystemStats(): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_notifications,
          COUNT(*) FILTER (WHERE is_read = false) as unread_notifications,
          COUNT(*) as total_activity_items
        FROM notifications
        UNION ALL
        SELECT 
          COUNT(*) as total_notifications,
          COUNT(*) FILTER (WHERE is_read = false) as unread_notifications,
          COUNT(*) as total_activity_items
        FROM activity_feed
      `;
      
      const result = await DatabaseService.query(query);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      return {
        success: false,
        message: 'Failed to get system stats',
        data: {}
      };
    }
  }

  private static async getPlatformAnalytics(period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(DISTINCT u.id) as active_users,
          COUNT(DISTINCT uc.id) as content_created,
          COUNT(DISTINCT pr.id) as reactions_given,
          COUNT(DISTINCT cs.id) as content_shared
        FROM users u
        LEFT JOIN unified_content uc ON u.id = uc.author_id AND uc.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN post_reactions pr ON u.id = pr.user_id AND pr.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN content_shares cs ON u.id = cs.user_id AND cs.created_at > NOW() - INTERVAL '${periodDays} days'
      `;
      
      const result = await DatabaseService.query(query);
      return {
        success: true,
        data: result.rows[0] || {}
      };
    } catch (error) {
      console.error('Error getting platform analytics:', error);
      return {
        success: false,
        message: 'Failed to get platform analytics',
        data: {}
      };
    }
  }

  private static getDefaultWidgets(dashboardType: string): WidgetConfig[] {
    const baseWidgets: WidgetConfig[] = [
      {
        id: 'welcome',
        type: 'welcome',
        title: 'Welcome',
        position: { x: 0, y: 0, w: 6, h: 2 },
        config: {},
        enabled: true
      },
      {
        id: 'analytics',
        type: 'analytics',
        title: 'Analytics',
        position: { x: 6, y: 0, w: 6, h: 4 },
        config: { period: '30d' },
        enabled: true
      },
      {
        id: 'recent_content',
        type: 'recent_content',
        title: 'Recent Content',
        position: { x: 0, y: 2, w: 6, h: 4 },
        config: { limit: 5 },
        enabled: true
      },
      {
        id: 'notifications',
        type: 'notifications',
        title: 'Notifications',
        position: { x: 0, y: 6, w: 6, h: 3 },
        config: { limit: 5 },
        enabled: true
      },
      {
        id: 'activity_feed',
        type: 'activity_feed',
        title: 'Activity Feed',
        position: { x: 6, y: 4, w: 6, h: 5 },
        config: { limit: 10 },
        enabled: true
      }
    ];

    if (dashboardType === 'company') {
      baseWidgets.push(
        {
          id: 'company_stats',
          type: 'company_stats',
          title: 'Company Statistics',
          position: { x: 0, y: 9, w: 6, h: 3 },
          config: {},
          enabled: true
        },
        {
          id: 'team_members',
          type: 'team_members',
          title: 'Team Members',
          position: { x: 6, y: 9, w: 6, h: 3 },
          config: { limit: 10 },
          enabled: true
        }
      );
    }

    if (dashboardType === 'admin') {
      baseWidgets.push(
        {
          id: 'platform_stats',
          type: 'platform_stats',
          title: 'Platform Statistics',
          position: { x: 0, y: 9, w: 6, h: 3 },
          config: {},
          enabled: true
        },
        {
          id: 'system_health',
          type: 'system_health',
          title: 'System Health',
          position: { x: 6, y: 9, w: 6, h: 3 },
          config: {},
          enabled: true
        }
      );
    }

    return baseWidgets;
  }
}
