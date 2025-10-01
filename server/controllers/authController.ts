import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';
import { SignInRequest, SignUpRequest, ResetPasswordRequest, ApiResponse } from '../types/index.js';

export class AuthController {
  /**
   * Sign in user
   */
  static async signIn(req: Request, res: Response): Promise<void> {
    try {
      const credentials: SignInRequest = req.body;
      
      // Additional input sanitization
      if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid input types'
        });
        return;
      }

      const result = await AuthService.signIn(credentials);
      
      if (result.success && result.data) {
        res.json({ session: result.data });
      } else {
        res.status(401).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Sign in controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Sign up new user
   */
  static async signUp(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      
      // Additional input sanitization
      if (typeof userData.email !== 'string' || typeof userData.password !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid input types'
        });
        return;
      }

      // Handle enhanced signup with profile data
      const enhancedUserData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role || 'user',
        selectedCompanyId: userData.selectedCompanyId,
        position: userData.position,
        companyName: userData.companyName
      };

      const result = await AuthService.signUp(enhancedUserData);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: {
            userId: result.data?.userId,
            token: result.data?.token
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Sign up controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Sign out user
   */
  static async signOut(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const result = await AuthService.signOut(userId);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.data?.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Sign out controller error:', error);
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
      const { email }: ResetPasswordRequest = req.body;
      
      // Additional input sanitization
      if (typeof email !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid input type'
        });
        return;
      }

      const result = await AuthService.resetPassword(email);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.data?.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Reset password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Check if user is admin
   */
  static async checkAdminStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      // Validate userId parameter
      if (!userId || typeof userId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await AuthService.isAdmin(userId);
      
      if (result.success) {
        res.json({
          success: true,
          isAdmin: result.data?.isAdmin
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Admin check controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Check if user is super admin
   */
  static async checkSuperAdminStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      // Validate userId parameter
      if (!userId || typeof userId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await AuthService.isSuperAdmin(userId);
      
      if (result.success) {
        res.json({
          success: true,
          isSuperAdmin: result.data?.isSuperAdmin
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Super admin check controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get current user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
