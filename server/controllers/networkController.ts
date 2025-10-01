import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { NetworkService } from '../services/networkService.js';
import { ApiResponse } from '../types/index.js';

export class NetworkController {
  /**
   * Get user's network
   */
  static async getUserNetwork(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      const result = await NetworkService.getUserNetwork(userId);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get user network controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Add company to network
   */
  static async addToNetwork(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const userId = req.user?.id;
      const { company_id, connection_type, notes } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      if (!company_id) {
        return res.status(400).json({
          success: false,
          message: 'Company ID is required'
        });
      }

      const result = await NetworkService.addToNetwork(userId, company_id, connection_type, notes);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Add to network controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Remove company from network
   */
  static async removeFromNetwork(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const userId = req.user?.id;
      const { company_id } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      if (!company_id) {
        return res.status(400).json({
          success: false,
          message: 'Company ID is required'
        });
      }

      const result = await NetworkService.removeFromNetwork(userId, company_id);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Remove from network controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get available companies to add to network
   */
  static async getAvailableCompanies(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>) {
    try {
      const userId = req.user?.id;
      const { search } = req.query;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      const result = await NetworkService.getAvailableCompanies(userId, search as string);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get available companies controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
