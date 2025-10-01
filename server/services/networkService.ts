import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/index.js';

export class NetworkService {
  /**
   * Get companies in user's network
   */
  static async getUserNetwork(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT c.*, nc.connection_type, nc.status as connection_status
        FROM companies c
        INNER JOIN network_connections nc ON c.id = nc.company_id
        WHERE nc.user_id = $1
        ORDER BY c.created_at DESC
      `;
      
      const result = await pool.query(query, [userId]);
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Get user network error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Add company to user's network
   */
  static async addToNetwork(userId: string, companyId: string, connectionType: string = 'member', notes?: string): Promise<ApiResponse<any>> {
    try {
      // Check if company exists
      const company = await DatabaseService.findById('companies', companyId);
      if (!company) {
        return {
          success: false,
          message: 'Company not found'
        };
      }

      // Check if already in network
      const existingConnection = await DatabaseService.findAll('network_connections', {
        where: {
          user_id: userId,
          company_id: companyId
        },
        limit: 1
      });

      if (existingConnection.length > 0) {
        return {
          success: false,
          message: 'Company is already in your network'
        };
      }

      // Add to network
      const connection = await DatabaseService.insert('network_connections', {
        user_id: userId,
        company_id: companyId,
        connection_type: connectionType,
        status: 'active',
        notes: notes
      });

      return {
        success: true,
        data: connection
      };
    } catch (error) {
      console.error('Add to network error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Remove company from user's network
   */
  static async removeFromNetwork(userId: string, companyId: string): Promise<ApiResponse<any>> {
    try {
      // Check if connection exists
      const existingConnection = await DatabaseService.findAll('network_connections', {
        where: {
          user_id: userId,
          company_id: companyId
        },
        limit: 1
      });

      if (existingConnection.length === 0) {
        return {
          success: false,
          message: 'Company is not in your network'
        };
      }

      // Remove from network
      await DatabaseService.delete('network_connections', existingConnection[0].id);

      return {
        success: true,
        data: { message: 'Company removed from network' }
      };
    } catch (error) {
      console.error('Remove from network error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Get companies available to add to network (not already in user's network)
   */
  static async getAvailableCompanies(userId: string, searchTerm?: string): Promise<ApiResponse<any[]>> {
    try {
      // Get companies not already in user's network
      const query = `
        SELECT c.*
        FROM companies c
        WHERE c.status = 'approved'
        AND c.id NOT IN (
          SELECT nc.company_id 
          FROM network_connections nc 
          WHERE nc.user_id = $1
        )
        ${searchTerm ? `AND (c.name ILIKE $2 OR c.description ILIKE $2)` : ''}
        ORDER BY c.created_at DESC
        LIMIT 50
      `;
      
      const params = searchTerm ? [userId, `%${searchTerm}%`] : [userId];
      const result = await pool.query(query, params);
      
      return {
        success: true,
        data: result.rows || []
      };
    } catch (error) {
      console.error('Get available companies error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }
}
