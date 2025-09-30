import { Request, Response } from 'express';
import { UnifiedSocialService } from '../services/unifiedSocialService.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

export class UnifiedSocialController {
  /**
   * REACTIONS - Add/Remove reactions to content
   */
  static async addReaction(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const { reaction_type, content_type } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!contentId || !reaction_type || !content_type) {
        res.status(400).json({
          success: false,
          message: 'Content ID, reaction type, and content type are required'
        });
        return;
      }

      const result = await UnifiedSocialService.addReaction(userId, contentId, reaction_type, content_type);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Reaction added successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to add reaction'
        });
      }
    } catch (error) {
      console.error('Add reaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async removeReaction(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const { reaction_type, content_type } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedSocialService.removeReaction(userId, contentId, reaction_type, content_type);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Reaction removed successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to remove reaction'
        });
      }
    } catch (error) {
      console.error('Remove reaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getReactions(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const { content_type } = req.query;

      if (!contentId || !content_type) {
        res.status(400).json({
          success: false,
          message: 'Content ID and content type are required'
        });
        return;
      }

      const result = await UnifiedSocialService.getReactions(contentId, content_type as string);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get reactions'
        });
      }
    } catch (error) {
      console.error('Get reactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * CONNECTIONS - Follow/Unfollow users and companies
   */
  static async followUser(req: Request, res: Response): Promise<void> {
    try {
      const { targetUserId } = req.params;
      const { connection_type = 'follow' } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!targetUserId) {
        res.status(400).json({
          success: false,
          message: 'Target user ID is required'
        });
        return;
      }

      if (userId === targetUserId) {
        res.status(400).json({
          success: false,
          message: 'Cannot follow yourself'
        });
        return;
      }

      const result = await UnifiedSocialService.createConnection(userId, targetUserId, connection_type);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'User followed successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to follow user'
        });
      }
    } catch (error) {
      console.error('Follow user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const { targetUserId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedSocialService.removeConnection(userId, targetUserId);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'User unfollowed successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to unfollow user'
        });
      }
    } catch (error) {
      console.error('Unfollow user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getConnections(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { type = 'all', limit = '20', offset = '0' } = req.query;

      const result = await UnifiedSocialService.getConnections(userId, {
        type: type as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
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
          message: result.message || 'Failed to get connections'
        });
      }
    } catch (error) {
      console.error('Get connections error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getConnectionStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const result = await UnifiedSocialService.getConnectionStats(userId);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get connection stats'
        });
      }
    } catch (error) {
      console.error('Get connection stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * SHARING - Share content across platforms
   */
  static async shareContent(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const { share_type, platform, message } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!contentId || !share_type || !platform) {
        res.status(400).json({
          success: false,
          message: 'Content ID, share type, and platform are required'
        });
        return;
      }

      const result = await UnifiedSocialService.shareContent(userId, contentId, share_type, platform, message);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Content shared successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to share content'
        });
      }
    } catch (error) {
      console.error('Share content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getSharedContent(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { platform, limit = '20', offset = '0' } = req.query;

      const result = await UnifiedSocialService.getSharedContent(userId, {
        platform: platform as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
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
          message: result.message || 'Failed to get shared content'
        });
      }
    } catch (error) {
      console.error('Get shared content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * BOOKMARKS - Save content for later
   */
  static async bookmarkContent(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const { content_type } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!contentId || !content_type) {
        res.status(400).json({
          success: false,
          message: 'Content ID and content type are required'
        });
        return;
      }

      const result = await UnifiedSocialService.bookmarkContent(userId, contentId, content_type);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Content bookmarked successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to bookmark content'
        });
      }
    } catch (error) {
      console.error('Bookmark content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async removeBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedSocialService.removeBookmark(userId, contentId);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Bookmark removed successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to remove bookmark'
        });
      }
    } catch (error) {
      console.error('Remove bookmark error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getBookmarks(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { content_type, limit = '20', offset = '0' } = req.query;

      const result = await UnifiedSocialService.getBookmarks(userId, {
        content_type: content_type as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
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
          message: result.message || 'Failed to get bookmarks'
        });
      }
    } catch (error) {
      console.error('Get bookmarks error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * SOCIAL ANALYTICS - Get social engagement metrics
   */
  static async getSocialAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { period = '30d' } = req.query;

      const result = await UnifiedSocialService.getSocialAnalytics(userId, period as string);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get social analytics'
        });
      }
    } catch (error) {
      console.error('Get social analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * SOCIAL FEED - Get personalized social feed
   */
  static async getSocialFeed(req: Request, res: Response): Promise<void> {
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

      const result = await UnifiedSocialService.getSocialFeed(userId, {
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
          message: result.message || 'Failed to get social feed'
        });
      }
    } catch (error) {
      console.error('Get social feed error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
