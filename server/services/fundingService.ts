import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types/index.js';

export interface FundingApplication {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  company_id: string;
  application_data: {
    project_title: string;
    project_description: string;
    requested_amount: number;
    project_duration: string;
    team_size: number;
    previous_experience: string;
    business_plan: string;
    financial_projections: string;
    sustainability_plan: string;
    expected_outcomes: string;
  };
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'funded' | 'completed';
  submitted_at: string;
  reviewed_at?: string;
  approved_at?: string;
  funded_at?: string;
  completed_at?: string;
  review_notes?: string;
  rejection_reason?: string;
  funding_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface FundingOpportunity {
  id: string;
  title: string;
  category: string;
  description: string;
  amount: string;
  deadline: string;
  eligibility: string;
  url: string;
  status: 'active' | 'inactive' | 'expired';
  max_applications?: number;
  current_applications: number;
  funded_projects: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export interface FundingAnalytics {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalFundingDisbursed: number;
  averageApplicationValue: number;
  successRate: number;
  applicationsByCategory: Array<{ category: string; count: number; amount: number }>;
  applicationsByStatus: Array<{ status: string; count: number }>;
  monthlyTrends: Array<{ month: string; applications: number; approvals: number; funding: number }>;
  topApplicants: Array<{ company_id: string; company_name: string; applications: number; approvals: number; total_funding: number }>;
}

export class FundingService {
  /**
   * Funding Applications Management
   */
  static async createFundingApplication(data: Omit<FundingApplication, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<FundingApplication>> {
    try {
      const application = await DatabaseService.insert('funding_applications', {
        opportunity_id: data.opportunity_id,
        applicant_id: data.applicant_id,
        company_id: data.company_id,
        application_data: JSON.stringify(data.application_data),
        status: data.status || 'submitted',
        submitted_at: data.submitted_at || new Date().toISOString(),
        review_notes: data.review_notes || '',
        rejection_reason: data.rejection_reason || '',
        funding_amount: data.funding_amount || 0
      });

      return {
        success: true,
        data: application
      };
    } catch (error) {
      console.error('Create funding application error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  static async updateFundingApplication(id: string, data: Partial<FundingApplication>): Promise<ApiResponse<FundingApplication>> {
    try {
      const updateData: any = { ...data };
      if (data.application_data) {
        updateData.application_data = JSON.stringify(data.application_data);
      }

      const updated = await DatabaseService.update('funding_applications', id, updateData);
      
      if (!updated) {
        return {
          success: false,
          message: 'Funding application not found'
        };
      }

      return {
        success: true,
        data: updated
      };
    } catch (error) {
      console.error('Update funding application error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  static async getFundingApplications(pagination?: PaginationParams, filters?: { status?: string; opportunity_id?: string; applicant_id?: string }): Promise<ApiResponse<PaginatedResponse<FundingApplication> | FundingApplication[]>> {
    try {
      let applications: FundingApplication[];
      let total = 0;

      const whereClause: any = {};
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.opportunity_id) whereClause.opportunity_id = filters.opportunity_id;
      if (filters?.applicant_id) whereClause.applicant_id = filters.applicant_id;

      if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        
        applications = await DatabaseService.findAll('funding_applications', { 
          where: whereClause,
          limit, 
          offset
        });
        
        total = await DatabaseService.count('funding_applications', whereClause);
      } else {
        applications = await DatabaseService.findAll('funding_applications', {
          where: whereClause
        });
      }

      // Parse application_data JSON
      applications = applications.map(app => ({
        ...app,
        application_data: typeof app.application_data === 'string' 
          ? JSON.parse(app.application_data) 
          : app.application_data
      }));

      if (pagination) {
        const totalPages = Math.ceil(total / pagination.limit);
        const paginatedResponse: PaginatedResponse<FundingApplication> = {
          data: applications,
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
        data: applications
      };
    } catch (error) {
      console.error('Get funding applications error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  static async getFundingApplicationById(id: string): Promise<ApiResponse<FundingApplication>> {
    try {
      const application = await DatabaseService.findById('funding_applications', id);
      
      if (!application) {
        return {
          success: false,
          message: 'Funding application not found'
        };
      }

      // Parse application_data JSON
      const parsedApplication = {
        ...application,
        application_data: typeof application.application_data === 'string' 
          ? JSON.parse(application.application_data) 
          : application.application_data
      };

      return {
        success: true,
        data: parsedApplication
      };
    } catch (error) {
      console.error('Get funding application by ID error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  static async approveFundingApplication(id: string, fundingAmount: number, reviewNotes?: string): Promise<ApiResponse<FundingApplication>> {
    try {
      const updateData = {
        status: 'approved',
        approved_at: new Date().toISOString(),
        funding_amount: fundingAmount,
        review_notes: reviewNotes || ''
      };

      const updated = await DatabaseService.update('funding_applications', id, updateData);
      
      if (!updated) {
        return {
          success: false,
          message: 'Funding application not found'
        };
      }

      return {
        success: true,
        data: updated
      };
    } catch (error) {
      console.error('Approve funding application error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  static async rejectFundingApplication(id: string, rejectionReason: string): Promise<ApiResponse<FundingApplication>> {
    try {
      const updateData = {
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        rejection_reason: rejectionReason
      };

      const updated = await DatabaseService.update('funding_applications', id, updateData);
      
      if (!updated) {
        return {
          success: false,
          message: 'Funding application not found'
        };
      }

      return {
        success: true,
        data: updated
      };
    } catch (error) {
      console.error('Reject funding application error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  static async deleteFundingApplication(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const deleted = await DatabaseService.delete('funding_applications', id);
      
      if (!deleted) {
        return {
          success: false,
          message: 'Funding application not found'
        };
      }

      return {
        success: true,
        data: { message: 'Funding application deleted successfully' }
      };
    } catch (error) {
      console.error('Delete funding application error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Enhanced Funding Opportunities Management
   */
  static async getFundingOpportunitiesWithStats(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<FundingOpportunity> | FundingOpportunity[]>> {
    try {
      let opportunities: FundingOpportunity[];
      let total = 0;

      if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        
        opportunities = await DatabaseService.findAll('funding_opportunities', { 
          limit, 
          offset
        });
        
        total = await DatabaseService.count('funding_opportunities');
      } else {
        opportunities = await DatabaseService.findAll('funding_opportunities');
      }

      // Add application statistics to each opportunity
      for (const opportunity of opportunities) {
        const applications = await DatabaseService.findAll('funding_applications', {
          where: { opportunity_id: opportunity.id }
        });
        
        const approvedApplications = applications.filter(app => app.status === 'approved' || app.status === 'funded');
        const fundedApplications = applications.filter(app => app.status === 'funded');
        
        opportunity.current_applications = applications.length;
        opportunity.funded_projects = fundedApplications.length;
        opportunity.success_rate = applications.length > 0 ? (approvedApplications.length / applications.length) * 100 : 0;
      }

      if (pagination) {
        const totalPages = Math.ceil(total / pagination.limit);
        const paginatedResponse: PaginatedResponse<FundingOpportunity> = {
          data: opportunities,
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
        data: opportunities
      };
    } catch (error) {
      console.error('Get funding opportunities with stats error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Funding Analytics
   */
  static async getFundingAnalytics(): Promise<ApiResponse<FundingAnalytics>> {
    try {
      const applications = await DatabaseService.findAll('funding_applications');
      const opportunities = await DatabaseService.findAll('funding_opportunities');
      
      const totalApplications = applications.length;
      const approvedApplications = applications.filter(app => app.status === 'approved' || app.status === 'funded').length;
      const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
      const pendingApplications = applications.filter(app => app.status === 'submitted' || app.status === 'under_review').length;
      
      const totalFundingDisbursed = applications
        .filter(app => app.status === 'funded')
        .reduce((sum, app) => sum + (app.funding_amount || 0), 0);
      
      const averageApplicationValue = totalApplications > 0 
        ? applications.reduce((sum, app) => sum + (app.funding_amount || 0), 0) / totalApplications 
        : 0;
      
      const successRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;

      // Applications by category
      const applicationsByCategory: Array<{ category: string; count: number; amount: number }> = [];
      for (const opportunity of opportunities) {
        const categoryApplications = applications.filter(app => app.opportunity_id === opportunity.id);
        const categoryAmount = categoryApplications.reduce((sum, app) => sum + (app.funding_amount || 0), 0);
        
        applicationsByCategory.push({
          category: opportunity.category,
          count: categoryApplications.length,
          amount: categoryAmount
        });
      }

      // Applications by status
      const applicationsByStatus: Array<{ status: string; count: number }> = [
        { status: 'submitted', count: applications.filter(app => app.status === 'submitted').length },
        { status: 'under_review', count: applications.filter(app => app.status === 'under_review').length },
        { status: 'approved', count: applications.filter(app => app.status === 'approved').length },
        { status: 'rejected', count: applications.filter(app => app.status === 'rejected').length },
        { status: 'funded', count: applications.filter(app => app.status === 'funded').length },
        { status: 'completed', count: applications.filter(app => app.status === 'completed').length }
      ];

      // Monthly trends (simplified - would need actual date grouping in production)
      const monthlyTrends: Array<{ month: string; applications: number; approvals: number; funding: number }> = [
        { month: '2024-01', applications: Math.floor(totalApplications * 0.1), approvals: Math.floor(approvedApplications * 0.1), funding: Math.floor(totalFundingDisbursed * 0.1) },
        { month: '2024-02', applications: Math.floor(totalApplications * 0.15), approvals: Math.floor(approvedApplications * 0.15), funding: Math.floor(totalFundingDisbursed * 0.15) },
        { month: '2024-03', applications: Math.floor(totalApplications * 0.2), approvals: Math.floor(approvedApplications * 0.2), funding: Math.floor(totalFundingDisbursed * 0.2) },
        { month: '2024-04', applications: Math.floor(totalApplications * 0.25), approvals: Math.floor(approvedApplications * 0.25), funding: Math.floor(totalFundingDisbursed * 0.25) },
        { month: '2024-05', applications: Math.floor(totalApplications * 0.3), approvals: Math.floor(approvedApplications * 0.3), funding: Math.floor(totalFundingDisbursed * 0.3) }
      ];

      // Top applicants (simplified - would need company name lookup in production)
      const topApplicants: Array<{ company_id: string; company_name: string; applications: number; approvals: number; total_funding: number }> = [];
      const companyStats = new Map();
      
      applications.forEach(app => {
        if (!companyStats.has(app.company_id)) {
          companyStats.set(app.company_id, {
            company_id: app.company_id,
            company_name: `Company ${app.company_id.slice(0, 8)}`, // Simplified
            applications: 0,
            approvals: 0,
            total_funding: 0
          });
        }
        
        const stats = companyStats.get(app.company_id);
        stats.applications++;
        if (app.status === 'approved' || app.status === 'funded') {
          stats.approvals++;
        }
        if (app.status === 'funded') {
          stats.total_funding += app.funding_amount || 0;
        }
      });

      companyStats.forEach(stats => {
        topApplicants.push(stats);
      });

      topApplicants.sort((a, b) => b.total_funding - a.total_funding);

      return {
        success: true,
        data: {
          totalApplications,
          approvedApplications,
          rejectedApplications,
          pendingApplications,
          totalFundingDisbursed,
          averageApplicationValue: Math.round(averageApplicationValue),
          successRate: Math.round(successRate * 100) / 100,
          applicationsByCategory,
          applicationsByStatus,
          monthlyTrends,
          topApplicants: topApplicants.slice(0, 10)
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
}
