import { Request, Response } from 'express';
import { AdminService } from '../services/adminService.js';
import { PaginationParams } from '../types/index.js';

export class AdminController {
  /**
   * Get admin dashboard statistics
   */
  static async getAdminStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await AdminService.getAdminStats();
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get admin stats controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get all users
   */
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;
      
      let pagination: PaginationParams | undefined;
      if (page && limit) {
        pagination = {
          page: parseInt(page as string),
          limit: parseInt(limit as string)
        };
      }

      const result = await AdminService.getUsers(pagination);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get users controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await AdminService.getUserById(id);
      
      if (result.success) {
        res.json(result.data);
      } else if (result.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      if (!role || !['user', 'admin', 'superadmin'].includes(role)) {
        res.status(400).json({
          success: false,
          message: 'Invalid role. Must be user, admin, or superadmin'
        });
        return;
      }

      const result = await AdminService.updateUserRole(id, role);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Update user role controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update user information
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await AdminService.updateUser(id, updateData);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Update user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await AdminService.deleteUser(id);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.data?.message
        });
      } else if (result.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Delete user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Approve company
   */
  static async approveCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID'
        });
        return;
      }

      const result = await AdminService.approveCompany(id);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Approve company controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Reject company
   */
  static async rejectCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID'
        });
        return;
      }

      const result = await AdminService.rejectCompany(id, reason);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Reject company controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get system health
   */
  static async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      const result = await AdminService.getSystemHealth();
      
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
   * Get comprehensive analytics
   */
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const result = await AdminService.getAnalytics();
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get analytics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get funding analytics
   */
  static async getFundingAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const result = await AdminService.getFundingAnalytics();
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get funding analytics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get audit log
   */
  static async getAuditLog(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, action, userId, dateFrom, dateTo } = req.query;
      
      let pagination: PaginationParams | undefined;
      if (page && limit) {
        pagination = {
          page: parseInt(page as string),
          limit: parseInt(limit as string)
        };
      }

      const filters = {
        action: action as string | undefined,
        userId: userId as string | undefined,
        dateFrom: dateFrom as string | undefined,
        dateTo: dateTo as string | undefined
      };

      const result = await AdminService.getAuditLog(pagination, filters);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get audit log controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
