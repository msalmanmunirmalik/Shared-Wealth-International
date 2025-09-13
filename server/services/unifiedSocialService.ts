import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/api.js';

export interface SocialFilters {
  type?: string;
  platform?: string;
  content_type?: string;
  limit?: number;
  offset?: number;
}

export interface ConnectionData {
  follower_id: string;
  following_id: string;
  connection_type: string;
}

export interface ReactionData {
  user_id: string;
  content_id: string;
  content_type: string;
  reaction_type: string;
}

export interface ShareData {
  user_id: string;
  content_id: string;
  content_type: string;
  share_type: string;
  platform: string;
  message?: string;
}

export interface BookmarkData {
  user_id: string;
  content_id: string;
  content_type: string;
}

export class UnifiedSocialService {
  /**
   * REACTIONS - Add reaction to content
   */
  static async addReaction(userId: string, contentId: string, reactionType: string, contentType: string): Promise<ApiResponse<any>> {
    try {
      // Check if reaction already exists
      const existingQuery = `
        SELECT id FROM post_reactions 
        WHERE user_id = $1 AND content_id = $2 AND content_type = $3 AND reaction_type = $4
      `;
      const existingResult = await DatabaseService.query(existingQuery, [userId, contentId, contentType, reactionType]);
      
      if (existingResult.rows.length > 0) {
        return {
          success: false,
          message: 'Reaction already exists'
        };
      }

      // Add new reaction
      const insertQuery = `
        INSERT INTO post_reactions (user_id, content_id, content_type, reaction_type, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      
      const result = await DatabaseService.query(insertQuery, [userId, contentId, contentType, reactionType]);
      
      if (result.rows.length > 0) {
        // Update content reactions count
        await this.updateContentReactionsCount(contentId, contentType);
        
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to add reaction'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to add reaction'
      };
    }
  }

  /**
   * REACTIONS - Remove reaction from content
   */
  static async removeReaction(userId: string, contentId: string, reactionType: string, contentType: string): Promise<ApiResponse<any>> {
    try {
      const deleteQuery = `
        DELETE FROM post_reactions 
        WHERE user_id = $1 AND content_id = $2 AND content_type = $3 AND reaction_type = $4
        RETURNING *
      `;
      
      const result = await DatabaseService.query(deleteQuery, [userId, contentId, contentType, reactionType]);
      
      if (result.rows.length > 0) {
        // Update content reactions count
        await this.updateContentReactionsCount(contentId, contentType);
        
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Reaction not found'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to remove reaction'
      };
    }
  }

  /**
   * REACTIONS - Get reactions for content
   */
  static async getReactions(contentId: string, contentType: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          reaction_type,
          COUNT(*) as count,
          array_agg(DISTINCT u.first_name || ' ' || u.last_name) as users
        FROM post_reactions pr
        JOIN users u ON pr.user_id = u.id
        WHERE pr.content_id = $1 AND pr.content_type = $2
        GROUP BY reaction_type
        ORDER BY count DESC
      `;
      
      const result = await DatabaseService.query(query, [contentId, contentType]);
      
      // Format as reactions object
      const reactions: Record<string, { count: number; users: string[] }> = {};
      result.rows.forEach(row => {
        reactions[row.reaction_type] = {
          count: parseInt(row.count),
          users: row.users.slice(0, 5) // Show first 5 users
        };
      });
      
      return {
        success: true,
        data: reactions
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to get reactions',
        data: {}
      };
    }
  }

  /**
   * CONNECTIONS - Create connection between users
   */
  static async createConnection(followerId: string, followingId: string, connectionType: string = 'follow'): Promise<ApiResponse<any>> {
    try {
      // Check if connection already exists
      const existingQuery = `
        SELECT id FROM user_connections 
        WHERE follower_id = $1 AND following_id = $2
      `;
      const existingResult = await DatabaseService.query(existingQuery, [followerId, followingId]);
      
      if (existingResult.rows.length > 0) {
        return {
          success: false,
          message: 'Connection already exists'
        };
      }

      const insertQuery = `
        INSERT INTO user_connections (follower_id, following_id, connection_type, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      
      const result = await DatabaseService.query(insertQuery, [followerId, followingId, connectionType]);
      
      if (result.rows.length > 0) {
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to create connection'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to create connection'
      };
    }
  }

  /**
   * CONNECTIONS - Remove connection between users
   */
  static async removeConnection(followerId: string, followingId: string): Promise<ApiResponse<any>> {
    try {
      const deleteQuery = `
        DELETE FROM user_connections 
        WHERE follower_id = $1 AND following_id = $2
        RETURNING *
      `;
      
      const result = await DatabaseService.query(deleteQuery, [followerId, followingId]);
      
      if (result.rows.length > 0) {
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Connection not found'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to remove connection'
      };
    }
  }

  /**
   * CONNECTIONS - Get user connections
   */
  static async getConnections(userId: string, filters: SocialFilters): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = '';
      let queryParams: any[] = [userId];
      let paramIndex = 2;

      if (filters.type === 'followers') {
        whereCondition = 'WHERE uc.following_id = $1';
      } else if (filters.type === 'following') {
        whereCondition = 'WHERE uc.follower_id = $1';
      } else {
        whereCondition = 'WHERE (uc.follower_id = $1 OR uc.following_id = $1)';
      }

      const query = `
        SELECT 
          uc.*,
          CASE 
            WHEN uc.follower_id = $1 THEN u_following.first_name || ' ' || u_following.last_name
            ELSE u_follower.first_name || ' ' || u_follower.last_name
          END as user_name,
          CASE 
            WHEN uc.follower_id = $1 THEN u_following.email
            ELSE u_follower.email
          END as user_email,
          CASE 
            WHEN uc.follower_id = $1 THEN 'following'
            ELSE 'follower'
          END as relationship_type
        FROM user_connections uc
        LEFT JOIN users u_follower ON uc.follower_id = u_follower.id
        LEFT JOIN users u_following ON uc.following_id = u_following.id
        ${whereCondition}
        ORDER BY uc.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      queryParams.push(filters.limit || 20, filters.offset || 0);
      
      const result = await DatabaseService.query(query, queryParams);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM user_connections uc
        ${whereCondition}
      `;
      const countResult = await DatabaseService.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0]?.total || '0');
      
      return {
        success: true,
        data: result.rows || [],
        total
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to get connections',
        data: []
      };
    }
  }

  /**
   * CONNECTIONS - Get connection statistics
   */
  static async getConnectionStats(userId: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          COUNT(*) FILTER (WHERE follower_id = $1) as following_count,
          COUNT(*) FILTER (WHERE following_id = $1) as followers_count,
          COUNT(DISTINCT connection_type) as connection_types_count
        FROM user_connections
        WHERE follower_id = $1 OR following_id = $1
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      
      return {
        success: true,
        data: result.rows[0] || { following_count: 0, followers_count: 0, connection_types_count: 0 }
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to get connection stats',
        data: { following_count: 0, followers_count: 0, connection_types_count: 0 }
      };
    }
  }

  /**
   * SHARING - Share content
   */
  static async shareContent(userId: string, contentId: string, shareType: string, platform: string, message?: string): Promise<ApiResponse<any>> {
    try {
      const insertQuery = `
        INSERT INTO content_shares (user_id, content_id, content_type, share_type, platform, message, created_at)
        VALUES ($1, $2, 'unified_content', $3, $4, $5, NOW())
        RETURNING *
      `;
      
      const result = await DatabaseService.query(insertQuery, [userId, contentId, shareType, platform, message]);
      
      if (result.rows.length > 0) {
        // Update content shares count
        await this.updateContentSharesCount(contentId);
        
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to share content'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to share content'
      };
    }
  }

  /**
   * SHARING - Get shared content
   */
  static async getSharedContent(userId: string, filters: SocialFilters): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = 'WHERE cs.user_id = $1';
      let queryParams: any[] = [userId];
      let paramIndex = 2;

      if (filters.platform) {
        whereCondition += ` AND cs.platform = $${paramIndex}`;
        queryParams.push(filters.platform);
        paramIndex++;
      }

      const query = `
        SELECT 
          cs.*,
          uc.title,
          uc.content,
          uc.type as content_type,
          u.first_name || ' ' || u.last_name as author_name
        FROM content_shares cs
        LEFT JOIN unified_content uc ON cs.content_id = uc.id
        LEFT JOIN users u ON uc.author_id = u.id
        ${whereCondition}
        ORDER BY cs.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      queryParams.push(filters.limit || 20, filters.offset || 0);
      
      const result = await DatabaseService.query(query, queryParams);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM content_shares cs
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
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to get shared content',
        data: []
      };
    }
  }

  /**
   * BOOKMARKS - Bookmark content
   */
  static async bookmarkContent(userId: string, contentId: string, contentType: string): Promise<ApiResponse<any>> {
    try {
      // Check if bookmark already exists
      const existingQuery = `
        SELECT id FROM bookmarks 
        WHERE user_id = $1 AND bookmarked_id = $2 AND bookmarked_type = $3
      `;
      const existingResult = await DatabaseService.query(existingQuery, [userId, contentId, contentType]);
      
      if (existingResult.rows.length > 0) {
        return {
          success: false,
          message: 'Content already bookmarked'
        };
      }

      const insertQuery = `
        INSERT INTO bookmarks (user_id, bookmarked_id, bookmarked_type, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      
      const result = await DatabaseService.query(insertQuery, [userId, contentId, contentType]);
      
      if (result.rows.length > 0) {
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to bookmark content'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to bookmark content'
      };
    }
  }

  /**
   * BOOKMARKS - Remove bookmark
   */
  static async removeBookmark(userId: string, contentId: string): Promise<ApiResponse<any>> {
    try {
      const deleteQuery = `
        DELETE FROM bookmarks 
        WHERE user_id = $1 AND bookmarked_id = $2
        RETURNING *
      `;
      
      const result = await DatabaseService.query(deleteQuery, [userId, contentId]);
      
      if (result.rows.length > 0) {
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Bookmark not found'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to remove bookmark'
      };
    }
  }

  /**
   * BOOKMARKS - Get bookmarks
   */
  static async getBookmarks(userId: string, filters: SocialFilters): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = 'WHERE b.user_id = $1';
      let queryParams: any[] = [userId];
      let paramIndex = 2;

      if (filters.content_type) {
        whereCondition += ` AND b.bookmarked_type = $${paramIndex}`;
        queryParams.push(filters.content_type);
        paramIndex++;
      }

      const query = `
        SELECT 
          b.*,
          uc.title,
          uc.content,
          uc.type as content_type,
          u.first_name || ' ' || u.last_name as author_name
        FROM bookmarks b
        LEFT JOIN unified_content uc ON b.bookmarked_id = uc.id
        LEFT JOIN users u ON uc.author_id = u.id
        ${whereCondition}
        ORDER BY b.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      queryParams.push(filters.limit || 20, filters.offset || 0);
      
      const result = await DatabaseService.query(query, queryParams);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM bookmarks b
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
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to get bookmarks',
        data: []
      };
    }
  }

  /**
   * SOCIAL ANALYTICS - Get social engagement metrics
   */
  static async getSocialAnalytics(userId: string, period: string): Promise<ApiResponse<any>> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      const query = `
        SELECT 
          COUNT(DISTINCT pr.id) as total_reactions_given,
          COUNT(DISTINCT cs.id) as total_shares,
          COUNT(DISTINCT b.id) as total_bookmarks,
          COUNT(DISTINCT uc_following.id) as following_count,
          COUNT(DISTINCT uc_followers.id) as followers_count
        FROM users u
        LEFT JOIN post_reactions pr ON u.id = pr.user_id AND pr.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN content_shares cs ON u.id = cs.user_id AND cs.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN bookmarks b ON u.id = b.user_id AND b.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN user_connections uc_following ON u.id = uc_following.follower_id
        LEFT JOIN user_connections uc_followers ON u.id = uc_followers.following_id
        WHERE u.id = $1
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      
      return {
        success: true,
        data: result.rows[0] || {
          total_reactions_given: 0,
          total_shares: 0,
          total_bookmarks: 0,
          following_count: 0,
          followers_count: 0
        }
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to get social analytics',
        data: {}
      };
    }
  }

  /**
   * SOCIAL FEED - Get personalized social feed
   */
  static async getSocialFeed(userId: string, filters: SocialFilters): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT DISTINCT
          uc.*,
          u.first_name || ' ' || u.last_name as author_name,
          u.email as author_email,
          comp.name as company_name,
          comp.logo_url as company_logo,
          comp.sector as company_sector
        FROM unified_content uc
        JOIN users u ON uc.author_id = u.id
        LEFT JOIN companies comp ON uc.company_id = comp.id
        LEFT JOIN user_connections uc_conn ON uc.author_id = uc_conn.following_id AND uc_conn.follower_id = $1
        WHERE uc.is_published = true
        AND (uc.author_id = $1 OR uc_conn.id IS NOT NULL)
        ORDER BY uc.published_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await DatabaseService.query(query, [userId, filters.limit || 20, filters.offset || 0]);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(DISTINCT uc.id) as total
        FROM unified_content uc
        LEFT JOIN user_connections uc_conn ON uc.author_id = uc_conn.following_id AND uc_conn.follower_id = $1
        WHERE uc.is_published = true
        AND (uc.author_id = $1 OR uc_conn.id IS NOT NULL)
      `;
      const countResult = await DatabaseService.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0]?.total || '0');
      
      return {
        success: true,
        data: result.rows || [],
        total
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to get social feed',
        data: []
      };
    }
  }

  /**
   * Helper method to update content reactions count
   */
  private static async updateContentReactionsCount(contentId: string, contentType: string): Promise<void> {
    try {
      if (contentType === 'unified_content') {
        const countQuery = `
          SELECT reaction_type, COUNT(*) as count
          FROM post_reactions 
          WHERE content_id = $1 AND content_type = $2
          GROUP BY reaction_type
        `;
        
        const countResult = await DatabaseService.query(countQuery, [contentId, contentType]);
        
        const reactions: Record<string, number> = {};
        countResult.rows.forEach(row => {
          reactions[row.reaction_type] = parseInt(row.count);
        });
        
        const updateQuery = `
          UPDATE unified_content 
          SET reactions = $1, updated_at = NOW()
          WHERE id = $2
        `;
        
        await DatabaseService.query(updateQuery, [JSON.stringify(reactions), contentId]);
      }
    } catch (error) {
      console.error('Error updating content reactions count:', error);
    }
  }

  /**
   * Helper method to update content shares count
   */
  private static async updateContentSharesCount(contentId: string): Promise<void> {
    try {
      const countQuery = `
        SELECT COUNT(*) as count
        FROM content_shares 
        WHERE content_id = $1
      `;
      
      const countResult = await DatabaseService.query(countQuery, [contentId]);
      const sharesCount = parseInt(countResult.rows[0]?.count || '0');
      
      const updateQuery = `
        UPDATE unified_content 
        SET shares_count = $1, updated_at = NOW()
        WHERE id = $2
      `;
      
      await DatabaseService.query(updateQuery, [sharesCount, contentId]);
    } catch (error) {
      console.error('Error updating content shares count:', error);
    }
  }
}
