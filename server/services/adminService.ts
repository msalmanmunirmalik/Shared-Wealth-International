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
   * Update user information
   */
  static async updateUser(userId: string, updateData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      // Remove fields that shouldn't be updated directly
      const { id, created_at, password_hash, ...safeUpdateData } = updateData;
      
      // Filter out columns that don't exist in the current database schema
      const allowedColumns = ['email', 'first_name', 'last_name', 'phone', 'is_active', 'email_verified', 'role'];
      const filteredData: any = {};
      Object.keys(safeUpdateData).forEach(key => {
        if (allowedColumns.includes(key)) {
          filteredData[key] = safeUpdateData[key as keyof typeof safeUpdateData];
        }
      });

      const updatedUser = await DatabaseService.update('users', userId, filteredData);
      
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
      // First, get the company to find the applicant_user_id
      const company = await DatabaseService.findById('companies', companyId);
      if (!company) {
        return {
          success: false,
          message: 'Company not found'
        };
      }

      // Update company status to approved
      const updatedCompany = await DatabaseService.update('companies', companyId, { 
        status: 'approved' 
      });

      // If the company has an applicant_user_id, create a user_companies relationship
      if (company.applicant_user_id) {
        try {
          await DatabaseService.insert('user_companies', {
            user_id: company.applicant_user_id,
            company_id: companyId,
            role: company.applicant_role || 'Owner',
            position: company.applicant_position || 'CEO',
            is_primary: true
          });
          console.log(`✅ Created user_companies relationship for user ${company.applicant_user_id} and company ${companyId}`);
        } catch (relationshipError) {
          console.error('Error creating user_companies relationship:', relationshipError);
          // Don't fail the approval if relationship creation fails
        }
      }
      
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
   * Get comprehensive analytics data
   */
  static async getAnalytics(): Promise<ApiResponse<{
    platformGrowth: {
      totalUsers: number;
      totalCompanies: number;
      totalFundingOpportunities: number;
      totalApplications: number;
    };
    userEngagement: {
      activeUsers: number;
      newUsersThisMonth: number;
      userGrowthRate: number;
    };
    companyMetrics: {
      pendingCompanies: number;
      approvedCompanies: number;
      rejectedCompanies: number;
      averageApprovalTime: number;
    };
    fundingMetrics: {
      totalOpportunities: number;
      totalApplications: number;
      applicationRate: number;
      successRate: number;
    };
    sectorDistribution: Array<{ sector: string; count: number }>;
    geographicDistribution: Array<{ location: string; count: number }>;
    monthlyGrowth: Array<{ month: string; users: number; companies: number }>;
  }>> {
    try {
      // Get basic counts
      const totalUsers = await DatabaseService.count('users');
      const totalCompanies = await DatabaseService.count('companies');
      const totalFundingOpportunities = await DatabaseService.count('funding_opportunities');
      const totalApplications = await DatabaseService.count('funding_applications');

      // Get user engagement metrics
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const activeUsersResult = await DatabaseService.query(
        'SELECT COUNT(*) FROM users WHERE updated_at >= $1',
        [thirtyDaysAgo]
      );
      const activeUsers = parseInt(activeUsersResult.rows[0].count);

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const newUsersResult = await DatabaseService.query(
        'SELECT COUNT(*) FROM users WHERE created_at >= $1',
        [startOfMonth]
      );
      const newUsersThisMonth = parseInt(newUsersResult.rows[0].count);

      // Get company metrics
      const pendingCompanies = await DatabaseService.count('companies', { where: { status: 'pending' } });
      const approvedCompanies = await DatabaseService.count('companies', { where: { status: 'approved' } });
      const rejectedCompanies = await DatabaseService.count('companies', { where: { status: 'rejected' } });

      // Get sector distribution
      const companies = await DatabaseService.findAll('companies');
      const sectorCounts: { [key: string]: number } = {};
      companies.forEach((company: any) => {
        const sector = company.sector || company.industry || 'Unknown';
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      });

      const sectorDistribution = Object.entries(sectorCounts).map(([sector, count]) => ({
        sector,
        count: count as number
      }));

      // Get geographic distribution
      const locationCounts: { [key: string]: number } = {};
      companies.forEach((company: any) => {
        const location = company.location || 'Unknown';
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      });

      const geographicDistribution = Object.entries(locationCounts).map(([location, count]) => ({
        location,
        count: count as number
      }));

      // Calculate rates
      const applicationRate = totalFundingOpportunities > 0 ? (totalApplications / totalFundingOpportunities) * 100 : 0;
      const userGrowthRate = totalUsers > 0 ? (newUsersThisMonth / totalUsers) * 100 : 0;

      // Generate monthly growth data (last 6 months)
      const monthlyGrowth: Array<{ month: string; users: number; companies: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        // For now, we'll use mock data since we don't have historical data
        // In production, you'd query the database for actual historical data
        monthlyGrowth.push({
          month: monthName,
          users: Math.floor(totalUsers * (0.8 + Math.random() * 0.4)),
          companies: Math.floor(totalCompanies * (0.8 + Math.random() * 0.4))
        });
      }

      return {
        success: true,
        data: {
          platformGrowth: {
            totalUsers,
            totalCompanies,
            totalFundingOpportunities,
            totalApplications
          },
          userEngagement: {
            activeUsers,
            newUsersThisMonth,
            userGrowthRate: Math.round(userGrowthRate * 100) / 100
          },
          companyMetrics: {
            pendingCompanies,
            approvedCompanies,
            rejectedCompanies,
            averageApprovalTime: 2.5 // Mock data - would calculate from actual approval times
          },
          fundingMetrics: {
            totalOpportunities: totalFundingOpportunities,
            totalApplications,
            applicationRate: Math.round(applicationRate * 100) / 100,
            successRate: 75 // Mock data - would calculate from actual success rates
          },
          sectorDistribution,
          geographicDistribution,
          monthlyGrowth
        }
      };
    } catch (error) {
      console.error('Get analytics error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get funding opportunities with analytics
   */
  static async getFundingAnalytics(): Promise<ApiResponse<{
    opportunities: Array<{
      id: string;
      title: string;
      category: string;
      amount: string;
      deadline: string;
      applicationCount: number;
      status: string;
    }>;
    categories: Array<{ category: string; count: number }>;
    trends: Array<{ month: string; applications: number; opportunities: number }>;
  }>> {
    try {
      const opportunities = await DatabaseService.findAll('funding_opportunities');
      const applications = await DatabaseService.findAll('funding_applications');

      // Get application counts per opportunity
      const opportunityData = opportunities.map((opp: any) => {
        const applicationCount = applications.filter((app: any) => app.funding_id === opp.id).length;
        return {
          id: opp.id,
          title: opp.title,
          category: opp.category || 'General',
          amount: opp.amount || 'Not specified',
          deadline: opp.deadline || 'No deadline',
          applicationCount,
          status: applicationCount > 0 ? 'Active' : 'No applications'
        };
      });

      // Get category distribution
      const categoryCounts: { [key: string]: number } = {};
      opportunities.forEach((opp: any) => {
        const category = opp.category || 'General';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      const categories = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count: count as number
      }));

      // Generate trends data (mock for now)
      const trends: Array<{ month: string; applications: number; opportunities: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        trends.push({
          month: monthName,
          applications: Math.floor(Math.random() * 10),
          opportunities: Math.floor(Math.random() * 5) + 1
        });
      }

      return {
        success: true,
        data: {
          opportunities: opportunityData,
          categories,
          trends
        }
      };
    } catch (error) {
      console.error('Get funding analytics error:', error);
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
