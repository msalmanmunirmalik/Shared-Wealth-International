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
        
        // Only return approved companies for public directory
        companies = await DatabaseService.findAll('companies', { 
          where: { status: 'approved' },
          limit, 
          offset 
        });
        
        // Count only approved companies
        total = await DatabaseService.count('companies', { where: { status: 'approved' } });
      } else {
        // Only return approved companies for public directory
        companies = await DatabaseService.findAll('companies', { 
          where: { status: 'approved' } 
        });
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
        sector: companyData.industry, // Map industry to sector
        location: companyData.location,
        website: companyData.website,
        status: 'pending',
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
      const allowedColumns = ['name', 'description', 'sector', 'location', 'website', 'logo_url', 'status'];
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
   * Get companies for a specific user
   */
  static async getUserCompanies(userId: string): Promise<ApiResponse<Company[]>> {
    try {
      const query = `
        SELECT c.*, uc.role, uc.is_primary
        FROM companies c
        INNER JOIN user_companies uc ON c.id = uc.company_id
        WHERE uc.user_id = $1
        ORDER BY c.created_at DESC
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      
      return {
        success: true,
        data: result.rows || []
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
   * Get company applications for a specific user
   */
  static async getUserApplications(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT * FROM company_applications 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `;
      
      const result = await DatabaseService.query(query, [userId]);
      
      return {
        success: true,
        data: result.rows || []
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
   * Search approved companies only (public search)
   */
  static async searchCompanies(query: string, category?: string): Promise<ApiResponse<Company[]>> {
    try {
      let companies: Company[];
      
      if (category) {
        // Only search approved companies with specific category
        companies = await DatabaseService.findAll('companies', { 
          where: { 
            industry: category,
            status: 'approved'
          } 
        });
      } else {
        // Only search approved companies
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