import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { User, Company, AdminStats, ApiResponse, PaginationParams, PaginatedResponse } from '../types/index.js';

export class AdminService {
  /**
   * Get admin dashboard statistics
   */
  static async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    try {
      const totalUsers = await DatabaseService.count('users');
      const totalCompanies = await DatabaseService.count('companies');
      const pendingCompanies = await DatabaseService.count('companies', { where: { status: 'pending' } });
      const approvedCompanies = await DatabaseService.count('companies', { where: { status: 'approved' } });

      return {
        success: true,
        data: {
          totalUsers,
          totalCompanies,
          pendingCompanies,
          approvedCompanies
        }
      };
    } catch (error) {
      console.error('Get admin stats error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get all users with optional pagination
   */
  static async getUsers(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User> | User[]>> {
    try {
      let users: User[];
      let total = 0;

      if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        
        users = await DatabaseService.findAll('users', { 
          limit, 
          offset 
        });
        
        total = await DatabaseService.count('users');
      } else {
        users = await DatabaseService.findAll('users');
      }

      if (pagination) {
        const totalPages = Math.ceil(total / pagination.limit);
        const paginatedResponse: PaginatedResponse<User> = {
          data: users,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPages
          }
        };
        
        return {
          success: true,
          data: paginatedResponse
        };
      }

      return {
        success: true,
        data: users
      };
    } catch (error) {
      console.error('Get users error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await DatabaseService.findOne('users', { where: { id } });
      
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
   * Update user role
   */
  static async updateUserRole(userId: string, newRole: 'user' | 'admin' | 'superadmin'): Promise<ApiResponse<User>> {
    try {
      // Validate role
      if (!['user', 'admin', 'superadmin'].includes(newRole)) {
        return {
          success: false,
          message: 'Invalid role. Must be user, admin, or superadmin'
        };
      }

      const updatedUser = await DatabaseService.update('users', userId, { role: newRole });
      
      return {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      console.error('Update user role error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const deleted = await DatabaseService.delete('users', userId);
      
      if (!deleted) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        data: { message: 'User deleted successfully' }
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Approve company
   */
  static async approveCompany(companyId: string): Promise<ApiResponse<Company>> {
    try {
      const updatedCompany = await DatabaseService.update('companies', companyId, { 
        status: 'approved' 
      });
      
      return {
        success: true,
        data: updatedCompany
      };
    } catch (error) {
      console.error('Approve company error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Reject company
   */
  static async rejectCompany(companyId: string, reason?: string): Promise<ApiResponse<Company>> {
    try {
      const updateData: any = { status: 'rejected' };
      if (reason) {
        updateData.rejection_reason = reason;
      }

      const updatedCompany = await DatabaseService.update('companies', companyId, updateData);
      
      return {
        success: true,
        data: updatedCompany
      };
    } catch (error) {
      console.error('Reject company error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get system health status
   */
  static async getSystemHealth(): Promise<ApiResponse<{
    database: boolean;
    timestamp: string;
    uptime: number;
    memory: NodeJS.MemoryUsage;
  }>> {
    try {
      const database = await DatabaseService.healthCheck();
      const uptime = process.uptime();
      const memory = process.memoryUsage();

      return {
        success: true,
        data: {
          database,
          timestamp: new Date().toISOString(),
          uptime,
          memory
        }
      };
    } catch (error) {
      console.error('Get system health error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get audit log (placeholder for future implementation)
   */
  static async getAuditLog(
    pagination?: PaginationParams,
    filters?: { action?: string; userId?: string; dateFrom?: string; dateTo?: string }
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      // Placeholder for audit log implementation
      // In production, this would query an audit log table
      
      return {
        success: true,
        data: { message: 'Audit log feature coming soon' }
      };
    } catch (error) {
      console.error('Get audit log error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }
}
