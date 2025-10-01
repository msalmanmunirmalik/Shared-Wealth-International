import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { Company, CreateCompanyRequest, ApiResponse, PaginationParams, PaginatedResponse } from '../types/index.js';

export class CompanyService {
  /**
   * Get approved companies for public directory (with optional pagination)
   */
  static async getCompanies(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Company> | Company[]>> {
    try {
      let companies: Company[];
      let total = 0;

      if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        
        companies = await DatabaseService.findAll('companies', { 
          where: { status: 'approved' },
          limit,
          offset
        });
        total = await DatabaseService.count('companies', { where: { status: 'approved' } });
      } else {
        companies = await DatabaseService.findAll('companies', { 
          where: { status: 'approved' }
        });
        total = companies.length;
      }

      if (pagination) {
        const totalPages = Math.ceil(total / pagination.limit);
        const paginatedResponse: PaginatedResponse<Company> = {
          data: companies,
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
        data: companies
      };
    } catch (error) {
      console.error('Get companies error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get company by ID
   */
  static async getCompanyById(id: string): Promise<ApiResponse<Company>> {
    try {
      const company = await DatabaseService.findById('companies', id);
      
      if (!company) {
        return {
          success: false,
          message: 'Company not found'
        };
      }

      return {
        success: true,
        data: company
      };
    } catch (error) {
      console.error('Get company error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Create new company
   */
  static async createCompany(companyData: CreateCompanyRequest, userId: string): Promise<ApiResponse<Company>> {
    try {
      const newCompany = await DatabaseService.insert('companies', {
        name: companyData.name,
        description: companyData.description,
        industry: companyData.industry,
        sector: companyData.industry, // Map industry to sector
        size: companyData.size,
        location: companyData.location,
        website: companyData.website,
        status: 'pending', // Set initial status
        is_active: true,
        is_verified: false,
        applicant_user_id: userId // Link company to the user who created it
      });

      return {
        success: true,
        data: newCompany
      };
    } catch (error) {
      console.error('Create company error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Update company
   */
  static async updateCompany(id: string, updateData: Partial<Company>): Promise<ApiResponse<Company>> {
    try {
      // Remove fields that shouldn't be updated directly
      const { id: _, created_at, ...safeUpdateData } = updateData;
      
      // Map industry to sector for database compatibility and filter out non-existent columns
      const mappedData: any = { ...safeUpdateData };
      if (mappedData.industry) {
        mappedData.sector = mappedData.industry;
        delete mappedData.industry;
      }
      
      // Filter out columns that don't exist in the current database schema
      const allowedColumns = ['name', 'description', 'sector', 'location', 'website', 'logo_url', 'is_active', 'is_verified'];
      const filteredData: any = {};
      Object.keys(mappedData).forEach(key => {
        if (allowedColumns.includes(key)) {
          filteredData[key] = mappedData[key];
        }
      });
      
      const updatedCompany = await DatabaseService.update('companies', id, filteredData);
      
      return {
        success: true,
        data: updatedCompany
      };
    } catch (error) {
      console.error('Update company error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get companies for a specific user (companies they own/created)
   */
  static async getUserCompanies(userId: string): Promise<ApiResponse<Company[]>> {
    try {
      const query = `
        SELECT c.*, uc.role
        FROM companies c
        INNER JOIN user_companies uc ON c.id = uc.company_id
        WHERE uc.user_id = $1
        ORDER BY c.created_at DESC
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Get user companies error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get companies created by a specific user (as applicant)
   */
  static async getUserCreatedCompanies(userId: string): Promise<ApiResponse<Company[]>> {
    try {
      const query = `
        SELECT c.*
        FROM companies c
        WHERE c.applicant_user_id = $1
        ORDER BY c.created_at DESC
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      
      return {
        success: true,
        data: result.rows || []
      };
    } catch (error) {
      console.error('Get user created companies error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get company applications for a specific user
   */
  static async getUserApplications(userId: string): Promise<ApiResponse<any[]>> {
    try {
      // For now, return empty array since company_applications table doesn't exist
      // TODO: Implement when company applications feature is needed
      return {
        success: true,
        data: []
      };
    } catch (error) {
      console.error('Get user applications error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Delete company
   */
  static async deleteCompany(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const deleted = await DatabaseService.delete('companies', id);
      
      if (!deleted) {
        return {
          success: false,
          message: 'Company not found'
        };
      }

      return {
        success: true,
        data: { message: 'Company deleted successfully' }
      };
    } catch (error) {
      console.error('Delete company error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get companies by active status
   */
  static async getCompaniesByStatus(isActive: boolean): Promise<ApiResponse<Company[]>> {
    try {
      const companies = await DatabaseService.findAll('companies', { 
        where: { status: 'approved' }
      });
      return {
        success: true,
        data: companies
      };
    } catch (error) {
      console.error('Get companies by status error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Search approved companies only (public search)
   */
  static async searchCompanies(query: string, category?: string): Promise<ApiResponse<Company[]>> {
    try {
      let companies: Company[];
      
      if (category) {
        companies = await DatabaseService.findAll('companies', { 
          where: { status: 'approved', industry: category }
        });
      } else {
        companies = await DatabaseService.findAll('companies', { 
          where: { status: 'approved' }
        });
      }

      // Simple search implementation
      // In production, use full-text search or external search service
      const filteredCompanies = companies.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.description.toLowerCase().includes(query.toLowerCase()) ||
        (company.industry && company.industry.toLowerCase().includes(query.toLowerCase()))
      );

      return {
        success: true,
        data: filteredCompanies
      };
    } catch (error) {
      console.error('Search companies error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get company statistics
   */
  static async getCompanyStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    verified: number;
    unverified: number;
  }>> {
    try {
      const total = await DatabaseService.count('companies');
      const active = await DatabaseService.count('companies', { where: { is_active: true } });
      const inactive = await DatabaseService.count('companies', { where: { is_active: false } });
      const verified = await DatabaseService.count('companies', { where: { is_verified: true } });
      const unverified = await DatabaseService.count('companies', { where: { is_verified: false } });

      return {
        success: true,
        data: {
          total,
          active,
          inactive,
          verified,
          unverified
        }
      };
    } catch (error) {
      console.error('Get company stats error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }
}