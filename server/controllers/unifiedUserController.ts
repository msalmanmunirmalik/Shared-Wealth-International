import { Request, Response } from 'express';
import { UnifiedUserService } from '../services/unifiedUserService.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UnifiedUserController {
  /**
   * Register new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, role = 'user' } = req.body;

      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          message: 'Email, password, first name, and last name are required'
        });
        return;
      }

      const result = await UnifiedUserService.register({
        email,
        password,
        firstName,
        lastName,
        role
      });

      if (result.success) {
        res.status(201).json({
          success: true,
          data: result.data,
          message: 'User registered successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Registration failed'
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const result = await UnifiedUserService.login(email, password);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Login successful'
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.message || 'Invalid credentials'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Logout user
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (userId) {
        await UnifiedUserService.logout(userId);
      }

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedUserService.getUserProfile(userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message || 'User not found'
        });
      }
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { firstName, lastName, bio, avatar, preferences } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedUserService.updateUserProfile(userId, {
        firstName,
        lastName,
        bio,
        avatar,
        preferences
      });

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Profile updated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to update profile'
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
        return;
      }

      const result = await UnifiedUserService.changePassword(userId, currentPassword, newPassword);

      if (result.success) {
        res.json({
          success: true,
          message: 'Password changed successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Failed to change password'
        });
      }
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user by ID
   */
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const authUserId = (req as any).user?.id;

      // Users can only view their own profile unless they're admin
      if (authUserId !== userId && (req as any).user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Unauthorized to view this user'
        });
        return;
      }

      const result = await UnifiedUserService.getUserProfile(userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message || 'User not found'
        });
      }
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { limit = '20', offset = '0', search, role, status } = req.query;

      // Check if user is admin
      const isAdmin = await UnifiedUserService.checkAdminAccess(userId);
      if (!isAdmin) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const result = await UnifiedUserService.getAllUsers({
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        search: search as string,
        role: role as string,
        status: status as string
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
          message: result.message || 'Failed to get users'
        });
      }
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update user (admin only)
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { firstName, lastName, email, role, status, bio, avatar } = req.body;
      const authUserId = (req as any).user?.id;

      // Check if user is admin
      const isAdmin = await UnifiedUserService.checkAdminAccess(authUserId);
      if (!isAdmin) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const result = await UnifiedUserService.updateUser(userId, {
        firstName,
        lastName,
        email,
        role,
        status,
        bio,
        avatar
      });

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'User updated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to update user'
        });
      }
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const authUserId = (req as any).user?.id;

      // Check if user is admin
      const isAdmin = await UnifiedUserService.checkAdminAccess(authUserId);
      if (!isAdmin) {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      // Prevent admin from deleting themselves
      if (authUserId === userId) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
        return;
      }

      const result = await UnifiedUserService.deleteUser(userId);

      if (result.success) {
        res.json({
          success: true,
          message: 'User deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to delete user'
        });
      }
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const authUserId = (req as any).user?.id;

      // Users can only view their own stats unless they're admin
      if (authUserId !== userId && (req as any).user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Unauthorized to view this user\'s statistics'
        });
        return;
      }

      const result = await UnifiedUserService.getUserStats(userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get user statistics'
        });
      }
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user activity
   */
  static async getUserActivity(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { limit = '20', offset = '0', type } = req.query;
      const authUserId = (req as any).user?.id;

      // Users can only view their own activity unless they're admin
      if (authUserId !== userId && (req as any).user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Unauthorized to view this user\'s activity'
        });
        return;
      }

      const result = await UnifiedUserService.getUserActivity(userId, {
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
          message: result.message || 'Failed to get user activity'
        });
      }
    } catch (error) {
      console.error('Get user activity error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Verify email
   */
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;

      const result = await UnifiedUserService.verifyEmail(token);

      if (result.success) {
        res.json({
          success: true,
          message: 'Email verified successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Invalid verification token'
        });
      }
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required'
        });
        return;
      }

      const result = await UnifiedUserService.requestPasswordReset(email);

      if (result.success) {
        res.json({
          success: true,
          message: 'Password reset email sent'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Failed to send password reset email'
        });
      }
    } catch (error) {
      console.error('Request password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        res.status(400).json({
          success: false,
          message: 'New password is required'
        });
        return;
      }

      const result = await UnifiedUserService.resetPassword(token, newPassword);

      if (result.success) {
        res.json({
          success: true,
          message: 'Password reset successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Invalid reset token'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
