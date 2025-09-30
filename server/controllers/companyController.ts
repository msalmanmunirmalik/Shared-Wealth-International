import { Request, Response } from 'express';
import { CompanyService } from '../services/companyService.js';
import { CreateCompanyRequest, PaginationParams } from '../types/index.js';

export class CompanyController {
  /**
   * Get all companies
   */
  static async getCompanies(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;
      
      let pagination: PaginationParams | undefined;
      if (page && limit) {
        pagination = {
          page: parseInt(page as string),
          limit: parseInt(limit as string)
        };
      }

      const result = await CompanyService.getCompanies(pagination);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get companies controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get company by ID
   */
  static async getCompanyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID'
        });
        return;
      }

      const result = await CompanyService.getCompanyById(id);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else if (result.message === 'Company not found') {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get company controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Create new company
   */
  static async createCompany(req: Request, res: Response): Promise<void> {
    try {
      const companyData: CreateCompanyRequest = req.body;
      const userId = (req as any).user?.id; // Get user ID from JWT token
      
      // Additional input sanitization
      if (!companyData.name || typeof companyData.name !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Company name is required'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const result = await CompanyService.createCompany(companyData, userId);
      
      if (result.success) {
        res.status(201).json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Create company controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get companies for the authenticated user
   */
  static async getUserCompanies(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const result = await CompanyService.getUserCompanies(userId);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get user companies controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get company applications for the authenticated user
   */
  static async getUserApplications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const result = await CompanyService.getUserApplications(userId);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get user applications controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update company
   */
  static async updateCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID'
        });
        return;
      }

      const result = await CompanyService.updateCompany(id, updateData);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Update company controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete company
   */
  static async deleteCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid company ID'
        });
        return;
      }

      const result = await CompanyService.deleteCompany(id);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.data?.message
        });
      } else if (result.message === 'Company not found') {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Delete company controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get companies by status
   */
  static async getCompaniesByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be pending, approved, or rejected'
        });
        return;
      }

      // Convert status to boolean for is_active
      const isActive = status === 'approved' || status === 'active';
      const result = await CompanyService.getCompaniesByStatus(isActive);
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get companies by status controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Search companies
   */
  static async searchCompanies(req: Request, res: Response): Promise<void> {
    try {
      const { q, category } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const result = await CompanyService.searchCompanies(
        q, 
        category as string | undefined
      );
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Search companies controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get company statistics
   */
  static async getCompanyStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await CompanyService.getCompanyStats();
      
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get company stats controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
