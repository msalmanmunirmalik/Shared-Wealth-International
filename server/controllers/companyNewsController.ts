import { Request, Response } from 'express';
import { CompanyNewsService } from '../services/companyNewsService.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

export class CompanyNewsController {
  /**
   * Get all company news (platform-wide feed)
   */
  static async getAllCompanyNews(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const result = await CompanyNewsService.getAllCompanyNews(limit, offset);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            limit,
            offset,
            total: result.total || 0
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to fetch company news'
        });
      }
    } catch (error) {
      console.error('Get all company news error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get company news for a specific company
   */
  static async getCompanyNews(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      
      if (!companyId || typeof companyId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID'
        });
        return;
      }

      const result = await CompanyNewsService.getCompanyNews(companyId);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to fetch company news'
        });
      }
    } catch (error) {
      console.error('Get company news error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Create a new company news post
   */
  static async createCompanyPost(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const postData = req.body;
      const userId = (req as any).user?.id;

      if (!companyId || typeof companyId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID'
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

      // Validate required fields
      if (!postData.title || !postData.content) {
        res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
        return;
      }

      const result = await CompanyNewsService.createCompanyPost(companyId, userId, postData);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          data: result.data,
          message: 'News & Update created successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to create news & update'
        });
      }
    } catch (error) {
      console.error('Create company post error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update a company news post
   */
  static async updateCompanyPost(req: Request, res: Response): Promise<void> {
    try {
      const { companyId, postId } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id;

      if (!companyId || !postId) {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID or post ID'
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

      const result = await CompanyNewsService.updateCompanyPost(companyId, postId, userId, updateData);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'News & Update updated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to update news & update'
        });
      }
    } catch (error) {
      console.error('Update company post error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete a company news post
   */
  static async deleteCompanyPost(req: Request, res: Response): Promise<void> {
    try {
      const { companyId, postId } = req.params;
      const userId = (req as any).user?.id;

      if (!companyId || !postId) {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID or post ID'
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

      const result = await CompanyNewsService.deleteCompanyPost(companyId, postId, userId);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'News & Update deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to delete news & update'
        });
      }
    } catch (error) {
      console.error('Delete company post error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
