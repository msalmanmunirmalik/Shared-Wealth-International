import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/api.js';

export class CompanyNewsService {
  /**
   * Get all company news (platform-wide feed)
   */
  static async getAllCompanyNews(limit: number = 20, offset: number = 0): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT 
          cn.*,
          c.name as company_name,
          c.logo_url as company_logo,
          c.sector as company_sector,
          u.first_name,
          u.last_name,
          u.email as author_email
        FROM company_news cn
        JOIN companies c ON cn.company_id = c.id
        JOIN users u ON cn.author_id = u.id
        WHERE cn.is_published = true
        ORDER BY cn.published_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await DatabaseService.query(query, [limit, offset]);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM company_news cn
        WHERE cn.is_published = true
      `;
      const countResult = await DatabaseService.query(countQuery);
      const total = parseInt(countResult.rows[0]?.total || '0');
      
      return {
        success: true,
        data: result.rows || [],
        total
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to fetch company news',
        data: []
      };
    }
  }

  /**
   * Get company news for a specific company
   */
  static async getCompanyNews(companyId: string): Promise<ApiResponse<any[]>> {
    try {
      const query = `
        SELECT 
          cn.*,
          c.name as company_name,
          c.logo_url as company_logo,
          c.sector as company_sector,
          u.first_name,
          u.last_name,
          u.email as author_email
        FROM company_news cn
        JOIN companies c ON cn.company_id = c.id
        JOIN users u ON cn.author_id = u.id
        WHERE cn.company_id = $1 AND cn.is_published = true
        ORDER BY cn.published_at DESC
      `;
      
      const result = await DatabaseService.query(query, [companyId]);
      
      return {
        success: true,
        data: result.rows || []
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to fetch company news',
        data: []
      };
    }
  }

  /**
   * Create a new company news post
   */
  static async createCompanyPost(companyId: string, userId: string, postData: any): Promise<ApiResponse<any>> {
    try {
      // Verify user has access to the company
      const companyQuery = `
        SELECT id FROM companies 
        WHERE id = $1 AND applicant_user_id = $2
      `;
      const companyResult = await DatabaseService.query(companyQuery, [companyId, userId]);
      
      if (companyResult.rows.length === 0) {
        return {
          success: false,
          message: 'You do not have permission to create posts for this company'
        };
      }

      const insertQuery = `
        INSERT INTO company_news (
          company_id,
          author_id,
          title,
          content,
          post_type,
          tags,
          media_urls,
          is_published,
          published_at,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      
      const now = new Date().toISOString();
      const values = [
        companyId,
        userId,
        postData.title,
        postData.content,
        postData.post_type || 'news',
        JSON.stringify(postData.tags || []),
        JSON.stringify(postData.media_urls || []),
        true,
        now,
        now,
        now
      ];
      
      const result = await DatabaseService.query(insertQuery, values);
      
      if (result.rows.length > 0) {
        // Get the created post with company and author info
        const getPostQuery = `
          SELECT 
            cn.*,
            c.name as company_name,
            c.logo_url as company_logo,
            c.sector as company_sector,
            u.first_name,
            u.last_name,
            u.email as author_email
          FROM company_news cn
          JOIN companies c ON cn.company_id = c.id
          JOIN users u ON cn.author_id = u.id
          WHERE cn.id = $1
        `;
        
        const postResult = await DatabaseService.query(getPostQuery, [result.rows[0].id]);
        
        return {
          success: true,
          data: postResult.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to create news & update'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to create news & update'
      };
    }
  }

  /**
   * Update a company news post
   */
  static async updateCompanyPost(companyId: string, postId: string, userId: string, updateData: any): Promise<ApiResponse<any>> {
    try {
      // Verify user has access to the post
      const verifyQuery = `
        SELECT cn.id FROM company_news cn
        JOIN companies c ON cn.company_id = c.id
        WHERE cn.id = $1 AND cn.company_id = $2 AND c.applicant_user_id = $3
      `;
      const verifyResult = await DatabaseService.query(verifyQuery, [postId, companyId, userId]);
      
      if (verifyResult.rows.length === 0) {
        return {
          success: false,
          message: 'You do not have permission to update this post'
        };
      }

      const updateQuery = `
        UPDATE company_news 
        SET 
          title = COALESCE($1, title),
          content = COALESCE($2, content),
          post_type = COALESCE($3, post_type),
          tags = COALESCE($4, tags),
          media_urls = COALESCE($5, media_urls),
          updated_at = $6
        WHERE id = $7 AND company_id = $8
        RETURNING *
      `;
      
      const values = [
        updateData.title,
        updateData.content,
        updateData.post_type,
        updateData.tags ? JSON.stringify(updateData.tags) : null,
        updateData.media_urls ? JSON.stringify(updateData.media_urls) : null,
        new Date().toISOString(),
        postId,
        companyId
      ];
      
      const result = await DatabaseService.query(updateQuery, values);
      
      if (result.rows.length > 0) {
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to update news & update'
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to update news & update'
      };
    }
  }

  /**
   * Delete a company news post
   */
  static async deleteCompanyPost(companyId: string, postId: string, userId: string): Promise<ApiResponse<any>> {
    try {
      // Verify user has access to the post
      const verifyQuery = `
        SELECT cn.id FROM company_news cn
        JOIN companies c ON cn.company_id = c.id
        WHERE cn.id = $1 AND cn.company_id = $2 AND c.applicant_user_id = $3
      `;
      const verifyResult = await DatabaseService.query(verifyQuery, [postId, companyId, userId]);
      
      if (verifyResult.rows.length === 0) {
        return {
          success: false,
          message: 'You do not have permission to delete this post'
        };
      }

      const deleteQuery = `
        DELETE FROM company_news 
        WHERE id = $1 AND company_id = $2
      `;
      
      await DatabaseService.query(deleteQuery, [postId, companyId]);
      
      return {
        success: true,
        message: 'News & Update deleted successfully'
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        message: 'Failed to delete news & update'
      };
    }
  }
}
