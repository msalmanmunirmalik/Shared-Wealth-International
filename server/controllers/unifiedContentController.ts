import { Request, Response } from 'express';
import { UnifiedContentService } from '../services/unifiedContentService.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

export class UnifiedContentController {
  /**
   * Get all content with filtering and pagination
   */
  static async getAllContent(req: Request, res: Response): Promise<void> {
    try {
      const {
        type,
        author_id,
        company_id,
        is_published,
        limit = '20',
        offset = '0',
        search,
        sort_by = 'published_at',
        sort_order = 'desc'
      } = req.query;

      const filters = {
        type: type as string,
        author_id: author_id as string,
        company_id: company_id as string,
        is_published: is_published === 'true' ? true : is_published === 'false' ? false : undefined,
        search: search as string,
        sort_by: sort_by as string,
        sort_order: sort_order as 'asc' | 'desc',
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const result = await UnifiedContentService.getAllContent(filters);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            limit: filters.limit,
            offset: filters.offset,
            total: result.total || 0,
            has_more: result.has_more || false
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to fetch content'
        });
      }
    } catch (error) {
      console.error('Get all content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get content by ID
   */
  static async getContentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid content ID'
        });
        return;
      }

      const result = await UnifiedContentService.getContentById(id);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else if (result.message === 'Content not found') {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to fetch content'
        });
      }
    } catch (error) {
      console.error('Get content by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Create new content
   */
  static async createContent(req: Request, res: Response): Promise<void> {
    try {
      const contentData = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      // Validate required fields
      if (!contentData.title || !contentData.content) {
        res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
        return;
      }

      // Set default type since the column doesn't exist in production
      contentData.type = 'post';

      const result = await UnifiedContentService.createContent(userId, contentData);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          data: result.data,
          message: 'Content created successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to create content'
        });
      }
    } catch (error) {
      console.error('Create content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update content
   */
  static async updateContent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Invalid content ID'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedContentService.updateContent(id, userId, updateData);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Content updated successfully'
        });
      } else if (result.message === 'Content not found') {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else if (result.message === 'Permission denied') {
        res.status(403).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to update content'
        });
      }
    } catch (error) {
      console.error('Update content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete content
   */
  static async deleteContent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Invalid content ID'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedContentService.deleteContent(id, userId);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Content deleted successfully'
        });
      } else if (result.message === 'Content not found') {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else if (result.message === 'Permission denied') {
        res.status(403).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to delete content'
        });
      }
    } catch (error) {
      console.error('Delete content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get content by company
   */
  static async getContentByCompany(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const { type, limit = '20', offset = '0' } = req.query;

      if (!companyId || typeof companyId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID'
        });
        return;
      }

      const filters = {
        company_id: companyId,
        type: type as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const result = await UnifiedContentService.getContentByCompany(filters);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            limit: filters.limit,
            offset: filters.offset,
            total: result.total || 0
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to fetch company content'
        });
      }
    } catch (error) {
      console.error('Get content by company error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get content by user
   */
  static async getContentByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { type, limit = '20', offset = '0' } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const filters = {
        author_id: userId,
        type: type as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const result = await UnifiedContentService.getContentByUser(filters);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            limit: filters.limit,
            offset: filters.offset,
            total: result.total || 0
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to fetch user content'
        });
      }
    } catch (error) {
      console.error('Get content by user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Publish/Unpublish content
   */
  static async togglePublishStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { is_published } = req.body;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Invalid content ID'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (typeof is_published !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'is_published must be a boolean value'
        });
        return;
      }

      const result = await UnifiedContentService.togglePublishStatus(id, userId, is_published);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: `Content ${is_published ? 'published' : 'unpublished'} successfully`
        });
      } else if (result.message === 'Content not found') {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else if (result.message === 'Permission denied') {
        res.status(403).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to update publish status'
        });
      }
    } catch (error) {
      console.error('Toggle publish status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
