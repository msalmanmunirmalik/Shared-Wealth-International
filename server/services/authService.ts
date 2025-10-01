import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { User, Session, SignInRequest, SignUpRequest, JWTPayload, ApiResponse } from '../types/index.js';

// JWT secret validation
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

export class AuthService {
  /**
   * Sign in user with email and password
   */
  static async signIn(credentials: SignInRequest): Promise<ApiResponse<Session>> {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await DatabaseService.findOne('users', { where: { email } });
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Verify password with constant-time comparison
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Generate JWT with proper expiration and claims
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          iat: Math.floor(Date.now() / 1000)
        },
        JWT_SECRET as string,
        { 
          expiresIn: '24h',
          issuer: 'shared-wealth-international',
          audience: 'wealth-pioneers-users'
        }
      );

      const session: Session = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        },
        access_token: token
      };

      return {
        success: true,
        data: session
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Sign up new user
   */
  static async signUp(userData: any): Promise<ApiResponse<{ userId: string; token?: string }>> {
    try {
      const { email, password, firstName, lastName, phone, role, selectedCompanyId, position } = userData;

      // Check if user already exists
      const existingUser = await DatabaseService.findOne('users', { where: { email } });
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists'
        };
      }

      // Hash password with proper salt rounds
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user with enhanced data
      const newUser = await DatabaseService.insert('users', {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        role: role || 'user'
      });

      // If user selected an existing company, create user-company relationship
      if (selectedCompanyId) {
        try {
          // Create user-company relationship (skip validation for now to avoid errors)
          await DatabaseService.insert('user_companies', {
            user_id: newUser.id,
            company_id: selectedCompanyId,
            role: position || 'member',
            position: position || 'Member',
            status: 'active'
          });
          console.log('✅ User-company relationship created successfully');
        } catch (error) {
          console.error('Error creating user-company relationship:', error);
          // Don't fail the signup if company relationship fails
        }
      }

      // Generate JWT token for immediate login
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      return {
        success: true,
        data: { userId: newUser.id, token },
        message: 'User created successfully'
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Sign out user (in production, implement token blacklisting)
   */
  static async signOut(userId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      // In production, you would:
      // 1. Add token to blacklist
      // 2. Invalidate refresh tokens
      // 3. Log the sign out event
      
      return {
        success: true,
        data: { message: 'Signed out successfully' }
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Reset password (send reset email)
   */
  static async resetPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      // Check if user exists
      const user = await DatabaseService.findOne('users', { where: { email } });
      if (!user) {
        // Don't reveal if user exists or not (security best practice)
        return {
          success: true,
          data: { message: 'Password reset email sent' }
        };
      }

      // In production, you would:
      // 1. Generate reset token
      // 2. Store reset token with expiration
      // 3. Send reset email
      // 4. Log the reset request

      return {
        success: true,
        data: { message: 'Password reset email sent' }
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Check if user is admin
   */
  static async isAdmin(userId: string): Promise<ApiResponse<{ isAdmin: boolean }>> {
    try {
      const user = await DatabaseService.findOne('users', { where: { id: userId } });
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const isAdmin = user.role === 'admin' || user.role === 'superadmin';
      
      return {
        success: true,
        data: { isAdmin }
      };
    } catch (error) {
      console.error('Admin check error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Check if user is super admin
   */
  static async isSuperAdmin(userId: string): Promise<ApiResponse<{ isSuperAdmin: boolean }>> {
    try {
      const user = await DatabaseService.findOne('users', { where: { id: userId } });
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const isSuperAdmin = user.role === 'superadmin';
      
      return {
        success: true,
        data: { isSuperAdmin }
      };
    } catch (error) {
      console.error('Super admin check error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const user = await DatabaseService.findOne('users', { where: { id: userId } });
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, updateData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      // Remove sensitive fields that shouldn't be updated directly
      const { password_hash, ...safeUpdateData } = updateData;
      
      const updatedUser = await DatabaseService.update('users', userId, safeUpdateData);
      
      return {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    try {
      // Get current user
      const user = await DatabaseService.findOne('users', { where: { id: userId } });
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await DatabaseService.update('users', userId, { password_hash: newPasswordHash });

      return {
        success: true,
        data: { message: 'Password changed successfully' }
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }
}
