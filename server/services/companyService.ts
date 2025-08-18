import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { Company, CreateCompanyRequest, ApiResponse, PaginationParams, PaginatedResponse } from '../types/index.js';

export class CompanyService {
  /**
   * Get all companies with optional pagination
   */
  static async getCompanies(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Company> | Company[]>> {
    try {
      let companies: Company[];
      let total = 0;

      if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        
        companies = await DatabaseService.findAll('companies', { 
          limit, 
          offset 
        });
        
        total = await DatabaseService.count('companies');
      } else {
        companies = await DatabaseService.findAll('companies');
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
  static async createCompany(companyData: CreateCompanyRequest): Promise<ApiResponse<Company>> {
    try {
      const newCompany = await DatabaseService.insert('companies', {
        ...companyData,
        status: 'pending'
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
      
      const updatedCompany = await DatabaseService.update('companies', id, safeUpdateData);
      
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
   * Get companies by status
   */
  static async getCompaniesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<Company[]>> {
    try {
      const companies = await DatabaseService.findAll('companies', { 
        where: { status } 
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
   * Search companies
   */
  static async searchCompanies(query: string, category?: string): Promise<ApiResponse<Company[]>> {
    try {
      let companies: Company[];
      
      if (category) {
        companies = await DatabaseService.findAll('companies', { 
          where: { industry: category } 
        });
      } else {
        companies = await DatabaseService.findAll('companies');
      }

      // Simple search implementation
      // In production, use full-text search or external search service
      const filteredCompanies = companies.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.description.toLowerCase().includes(query.toLowerCase()) ||
        company.industry.toLowerCase().includes(query.toLowerCase())
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
    pending: number;
    approved: number;
    rejected: number;
  }>> {
    try {
      const total = await DatabaseService.count('companies');
      const pending = await DatabaseService.count('companies', { where: { status: 'pending' } });
      const approved = await DatabaseService.count('companies', { where: { status: 'approved' } });
      const rejected = await DatabaseService.count('companies', { where: { status: 'rejected' } });

      return {
        success: true,
        data: {
          total,
          pending,
          approved,
          rejected
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
