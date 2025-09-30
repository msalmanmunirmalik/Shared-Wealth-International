import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/index.js';

export interface ReactionData {
  id: string;
  postId: string;
  postType: string;
  userId: string;
  reactionType: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface ReactionStats {
  totalReactions: number;
  reactionBreakdown: {
    like: number;
    dislike: number;
    love: number;
    laugh: number;
    wow: number;
    sad: number;
    angry: number;
  };
  userReaction?: string;
}

export class ReactionsController {
  /**
   * Add or update a reaction to a post
   */
  static async addReaction(req: AuthenticatedRequest, res: Response<ApiResponse<ReactionData>>) {
    try {
      const userId = req.user?.id;
      const { postId, postType, reactionType } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      if (!postId || !postType || !reactionType) {
        return res.status(400).json({
          success: false,
          message: 'postId, postType, and reactionType are required'
        });
      }

      // Validate reaction type
      const validReactions = ['like', 'dislike', 'love', 'laugh', 'wow', 'sad', 'angry'];
      if (!validReactions.includes(reactionType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid reaction type'
        });
      }

      // Check if user already has a reaction on this post
      const existingReaction = await DatabaseService.findAll('post_reactions', {
        where: {
          post_id: postId,
          post_type: postType,
          user_id: userId
        },
        limit: 1
      });

      let reactionData: ReactionData;

      if (existingReaction.length > 0) {
        // Update existing reaction
        const updatedReaction = await DatabaseService.update('post_reactions', existingReaction[0].id, {
          reaction_type: reactionType,
          updated_at: new Date()
        });

        reactionData = {
          id: updatedReaction.id,
          postId: updatedReaction.post_id,
          postType: updatedReaction.post_type,
          userId: updatedReaction.user_id,
          reactionType: updatedReaction.reaction_type,
          createdAt: updatedReaction.created_at
        };
      } else {
        // Create new reaction
        const newReaction = await DatabaseService.insert('post_reactions', {
          post_id: postId,
          post_type: postType,
          user_id: userId,
          reaction_type: reactionType
        });

        reactionData = {
          id: newReaction.id,
          postId: newReaction.post_id,
          postType: newReaction.post_type,
          userId: newReaction.user_id,
          reactionType: newReaction.reaction_type,
          createdAt: newReaction.created_at
        };
      }

      // Get user info for the reaction
      const user = await DatabaseService.findById('users', userId);
      if (user) {
        reactionData.user = {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          avatarUrl: user.avatar_url
        };
      }

      res.json({
        success: true,
        data: reactionData
      });
    } catch (error) {
      console.error('Add reaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Remove a reaction from a post
   */
  static async removeReaction(req: AuthenticatedRequest, res: Response<ApiResponse<null>>) {
    try {
      const userId = req.user?.id;
      const { postId, postType } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      // Find and delete the reaction
      const reactions = await DatabaseService.findAll('post_reactions', {
        where: {
          post_id: postId,
          post_type: postType,
          user_id: userId
        }
      });

      if (reactions.length > 0) {
        await DatabaseService.delete('post_reactions', reactions[0].id);
      }

      res.json({
        success: true,
        data: null,
        message: 'Reaction removed successfully'
      });
    } catch (error) {
      console.error('Remove reaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get reaction statistics for a post
   */
  static async getReactionStats(req: Request, res: Response<ApiResponse<ReactionStats>>) {
    try {
      const { postId, postType } = req.params;
      const userId = req.query.userId as string;

      // Validate required parameters
      if (!postId || !postType || postId === 'undefined' || postType === 'undefined') {
        return res.status(400).json({
          success: false,
          message: 'Invalid postId or postType parameter'
        });
      }

      // Get all reactions for this post
      const reactions = await DatabaseService.findAll('post_reactions', {
        where: {
          post_id: postId,
          post_type: postType
        }
      });

      // Calculate reaction breakdown
      const reactionBreakdown = {
        like: 0,
        dislike: 0,
        love: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0
      };

      let userReaction: string | undefined;

      reactions.forEach(reaction => {
        if (reactionBreakdown.hasOwnProperty(reaction.reaction_type)) {
          reactionBreakdown[reaction.reaction_type]++;
        }
        
        // Check if this is the current user's reaction
        if (userId && reaction.user_id === userId) {
          userReaction = reaction.reaction_type;
        }
      });

      const totalReactions = reactions.length;

      const stats: ReactionStats = {
        totalReactions,
        reactionBreakdown,
        userReaction
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get reaction stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get all reactions for a post with user details
   */
  static async getPostReactions(req: Request, res: Response<ApiResponse<ReactionData[]>>) {
    try {
      const { postId, postType } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      // Get reactions with user details
      const reactions = await DatabaseService.query(`
        SELECT 
          pr.*,
          u.first_name,
          u.last_name,
          u.avatar_url
        FROM post_reactions pr
        INNER JOIN users u ON pr.user_id = u.id
        WHERE pr.post_id = $1 AND pr.post_type = $2
        ORDER BY pr.created_at DESC
        LIMIT $3 OFFSET $4
      `, [postId, postType, parseInt(limit as string), parseInt(offset as string)]);

      const reactionData: ReactionData[] = reactions.map(reaction => ({
        id: reaction.id,
        postId: reaction.post_id,
        postType: reaction.post_type,
        userId: reaction.user_id,
        reactionType: reaction.reaction_type,
        createdAt: reaction.created_at,
        user: {
          id: reaction.user_id,
          firstName: reaction.first_name,
          lastName: reaction.last_name,
          avatarUrl: reaction.avatar_url
        }
      }));

      res.json({
        success: true,
        data: reactionData
      });
    } catch (error) {
      console.error('Get post reactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user's reaction history
   */
  static async getUserReactions(req: AuthenticatedRequest, res: Response<ApiResponse<ReactionData[]>>) {
    try {
      const userId = req.user?.id;
      const { limit = 50, offset = 0 } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      const reactions = await DatabaseService.findAll('post_reactions', {
        where: { user_id: userId },
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      const reactionData: ReactionData[] = reactions.map(reaction => ({
        id: reaction.id,
        postId: reaction.post_id,
        postType: reaction.post_type,
        userId: reaction.user_id,
        reactionType: reaction.reaction_type,
        createdAt: reaction.created_at
      }));

      res.json({
        success: true,
        data: reactionData
      });
    } catch (error) {
      console.error('Get user reactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
