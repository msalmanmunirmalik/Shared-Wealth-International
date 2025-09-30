import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/api.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface UserProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  preferences?: any;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
  bio?: string;
  avatar?: string;
}

export interface UserFilters {
  limit?: number;
  offset?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UserActivityFilters {
  limit?: number;
  offset?: number;
  type?: string;
}

export class UnifiedUserService {
  /**
   * Register new user
   */
  static async register(userData: UserRegistrationData): Promise<ApiResponse<any>> {
    try {
      const { email, password, firstName, lastName, role = 'user' } = userData;

      // Check if user already exists
      const existingUser = await DatabaseService.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      // Insert user
      const insertQuery = `
        INSERT INTO users (
          email, password, first_name, last_name, role, email_verification_token,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, email, first_name, last_name, role, created_at
      `;

      const result = await DatabaseService.query(insertQuery, [
        email,
        hashedPassword,
        firstName,
        lastName,
        role,
        emailVerificationToken
      ]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        );

        return {
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              role: user.role,
              createdAt: user.created_at
            },
            token
          }
        };
      } else {
        return {
          success: false,
          message: 'Failed to create user'
        };
      }
    } catch (error) {
      console.error('Error registering user:', error);
      return {
        success: false,
        message: 'Failed to register user'
      };
    }
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      // Get user with password_hash
      const query = `
        SELECT id, email, password_hash, first_name, last_name, role, is_active as status, 
               is_verified as email_verified, created_at, updated_at
        FROM users 
        WHERE email = $1
      `;

      const result = await DatabaseService.query(query, [email]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      const user = result.rows[0];

      // Check if user is active
      if (user.status === 'inactive') {
        return {
          success: false,
          message: 'Account is inactive'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Update last login
      await DatabaseService.query(
        'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
        [user.id]
      );

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            status: user.status,
            emailVerified: user.email_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at
          },
          token
        }
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      return {
        success: false,
        message: 'Failed to login'
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(userId: string): Promise<ApiResponse<boolean>> {
    try {
      // Update last logout
      await DatabaseService.query(
        'UPDATE users SET last_logout = NOW(), updated_at = NOW() WHERE id = $1',
        [userId]
      );

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Error logging out user:', error);
      return {
        success: false,
        message: 'Failed to logout'
      };
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          u.*,
          COUNT(DISTINCT uc.company_id) as companies_count,
          COUNT(DISTINCT uc_following.following_id) as following_count,
          COUNT(DISTINCT uc_followers.follower_id) as followers_count,
          COUNT(DISTINCT fu.id) as files_count,
          COUNT(DISTINCT un.id) as content_count
        FROM users u
        LEFT JOIN user_companies uc ON u.id = uc.user_id
        LEFT JOIN user_connections uc_following ON u.id = uc_following.follower_id
        LEFT JOIN user_connections uc_followers ON u.id = uc_followers.following_id
        LEFT JOIN file_uploads fu ON u.id = fu.uploaded_by
        LEFT JOIN unified_content un ON u.id = un.author_id
        WHERE u.id = $1
        GROUP BY u.id
      `;

      const result = await DatabaseService.query(query, [userId]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        return {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            status: user.status,
            bio: user.bio,
            avatar: user.avatar,
            emailVerified: user.email_verified,
            preferences: user.preferences ? JSON.parse(user.preferences) : {},
            companiesCount: parseInt(user.companies_count || '0'),
            followingCount: parseInt(user.following_count || '0'),
            followersCount: parseInt(user.followers_count || '0'),
            filesCount: parseInt(user.files_count || '0'),
            contentCount: parseInt(user.content_count || '0'),
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            lastLogin: user.last_login
          }
        };
      } else {
        return {
          success: false,
          message: 'User not found'
        };
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {
        success: false,
        message: 'Failed to get user profile'
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, profileData: UserProfileData): Promise<ApiResponse<any>> {
    try {
      const fieldsToUpdate: { [key: string]: any } = {};
      
      if (profileData.firstName !== undefined) fieldsToUpdate.first_name = profileData.firstName;
      if (profileData.lastName !== undefined) fieldsToUpdate.last_name = profileData.lastName;
      if (profileData.bio !== undefined) fieldsToUpdate.bio = profileData.bio;
      if (profileData.avatar !== undefined) fieldsToUpdate.avatar = profileData.avatar;
      if (profileData.preferences !== undefined) fieldsToUpdate.preferences = JSON.stringify(profileData.preferences);

      const result = await DatabaseService.update('users', userId, fieldsToUpdate);

      if (result.length > 0) {
        return {
          success: true,
          data: result[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to update profile'
        };
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<boolean>> {
    try {
      // Get current password
      const userResult = await DatabaseService.query(
        'SELECT password FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const user = userResult.rows[0];

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await DatabaseService.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedNewPassword, userId]
      );

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        message: 'Failed to change password'
      };
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(filters: UserFilters): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = 'WHERE 1=1';
      let queryParams: any[] = [];
      let paramIndex = 1;

      if (filters.search) {
        whereCondition += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
        queryParams.push(`%${filters.search}%`);
        paramIndex++;
      }

      if (filters.role) {
        whereCondition += ` AND u.role = $${paramIndex}`;
        queryParams.push(filters.role);
        paramIndex++;
      }

      if (filters.status) {
        whereCondition += ` AND u.status = $${paramIndex}`;
        queryParams.push(filters.status);
        paramIndex++;
      }

      const query = `
        SELECT 
          u.id, u.email, u.first_name, u.last_name, u.role, u.status,
          u.email_verified, u.created_at, u.updated_at, u.last_login,
          COUNT(DISTINCT uc.company_id) as companies_count,
          COUNT(DISTINCT fu.id) as files_count,
          COUNT(DISTINCT un.id) as content_count
        FROM users u
        LEFT JOIN user_companies uc ON u.id = uc.user_id
        LEFT JOIN file_uploads fu ON u.id = fu.uploaded_by
        LEFT JOIN unified_content un ON u.id = un.author_id
        ${whereCondition}
        GROUP BY u.id, u.email, u.first_name, u.last_name, u.role, u.status,
                 u.email_verified, u.created_at, u.updated_at, u.last_login
        ORDER BY u.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(filters.limit || 20, filters.offset || 0);

      const result = await DatabaseService.query(query, queryParams);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM users u
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
      console.error('Error getting all users:', error);
      return {
        success: false,
        message: 'Failed to get users',
        data: []
      };
    }
  }

  /**
   * Update user (admin only)
   */
  static async updateUser(userId: string, updateData: UserUpdateData): Promise<ApiResponse<any>> {
    try {
      const fieldsToUpdate: { [key: string]: any } = {};
      
      if (updateData.firstName !== undefined) fieldsToUpdate.first_name = updateData.firstName;
      if (updateData.lastName !== undefined) fieldsToUpdate.last_name = updateData.lastName;
      if (updateData.email !== undefined) fieldsToUpdate.email = updateData.email;
      if (updateData.role !== undefined) fieldsToUpdate.role = updateData.role;
      if (updateData.status !== undefined) fieldsToUpdate.status = updateData.status;
      if (updateData.bio !== undefined) fieldsToUpdate.bio = updateData.bio;
      if (updateData.avatar !== undefined) fieldsToUpdate.avatar = updateData.avatar;

      const result = await DatabaseService.update('users', userId, fieldsToUpdate);

      if (result.length > 0) {
        return {
          success: true,
          data: result[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to update user'
        };
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: 'Failed to update user'
      };
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const result = await DatabaseService.delete('users', userId);

      if (result) {
        return {
          success: true,
          data: true
        };
      } else {
        return {
          success: false,
          message: 'User not found'
        };
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: 'Failed to delete user'
      };
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT uc.id) as content_created,
          COUNT(DISTINCT pr.id) as reactions_given,
          COUNT(DISTINCT cs.id) as content_shared,
          COUNT(DISTINCT b.id) as content_bookmarked,
          COUNT(DISTINCT uc_conn.id) as connections_made,
          COUNT(DISTINCT fu.id) as files_uploaded,
          COUNT(DISTINCT uc_comp.company_id) as companies_joined,
          COUNT(DISTINCT fs.id) as files_shared
        FROM users u
        LEFT JOIN unified_content uc ON u.id = uc.author_id
        LEFT JOIN post_reactions pr ON u.id = pr.user_id
        LEFT JOIN content_shares cs ON u.id = cs.user_id
        LEFT JOIN bookmarks b ON u.id = b.user_id
        LEFT JOIN user_connections uc_conn ON u.id = uc_conn.follower_id
        LEFT JOIN file_uploads fu ON u.id = fu.uploaded_by
        LEFT JOIN user_companies uc_comp ON u.id = uc_comp.user_id
        LEFT JOIN file_shares fs ON u.id = fs.shared_by
        WHERE u.id = $1
      `;

      const result = await DatabaseService.query(query, [userId]);

      return {
        success: true,
        data: result.rows[0] || {
          content_created: 0,
          reactions_given: 0,
          content_shared: 0,
          content_bookmarked: 0,
          connections_made: 0,
          files_uploaded: 0,
          companies_joined: 0,
          files_shared: 0
        }
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        success: false,
        message: 'Failed to get user statistics',
        data: {}
      };
    }
  }

  /**
   * Get user activity
   */
  static async getUserActivity(userId: string, filters: UserActivityFilters): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = 'WHERE user_id = $1';
      let queryParams: any[] = [userId];
      let paramIndex = 2;

      if (filters.type) {
        whereCondition += ` AND activity_type = $${paramIndex}`;
        queryParams.push(filters.type);
        paramIndex++;
      }

      const query = `
        SELECT 
          id, activity_type, title, description, data, created_at
        FROM activity_feed
        ${whereCondition}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(filters.limit || 20, filters.offset || 0);

      const result = await DatabaseService.query(query, queryParams);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM activity_feed
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
      console.error('Error getting user activity:', error);
      return {
        success: false,
        message: 'Failed to get user activity',
        data: []
      };
    }
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string): Promise<ApiResponse<boolean>> {
    try {
      const query = `
        UPDATE users 
        SET email_verified = true, email_verification_token = NULL, updated_at = NOW()
        WHERE email_verification_token = $1
        RETURNING id
      `;

      const result = await DatabaseService.query(query, [token]);

      if (result.rows.length > 0) {
        return {
          success: true,
          data: true
        };
      } else {
        return {
          success: false,
          message: 'Invalid verification token'
        };
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      return {
        success: false,
        message: 'Failed to verify email'
      };
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<ApiResponse<boolean>> {
    try {
      // Check if user exists
      const userResult = await DatabaseService.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour

      // Update user with reset token
      await DatabaseService.query(
        'UPDATE users SET password_reset_token = $1, password_reset_expires = $2, updated_at = NOW() WHERE email = $3',
        [resetToken, resetExpires, email]
      );

      // TODO: Send email with reset token
      // For now, just return success
      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return {
        success: false,
        message: 'Failed to request password reset'
      };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse<boolean>> {
    try {
      // Check if token is valid and not expired
      const userResult = await DatabaseService.query(
        'SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
        [token]
      );

      if (userResult.rows.length === 0) {
        return {
          success: false,
          message: 'Invalid or expired reset token'
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and clear reset token
      await DatabaseService.query(
        'UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW() WHERE password_reset_token = $2',
        [hashedPassword, token]
      );

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        message: 'Failed to reset password'
      };
    }
  }

  /**
   * Check if user is admin
   */
  static async checkAdminAccess(userId: string): Promise<boolean> {
    try {
      const query = `
        SELECT role FROM users 
        WHERE id = $1 AND role = 'admin'
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }
}
