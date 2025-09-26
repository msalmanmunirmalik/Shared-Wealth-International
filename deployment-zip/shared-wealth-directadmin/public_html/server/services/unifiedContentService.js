import { DatabaseService } from '../../src/integrations/postgresql/database.js';
export class UnifiedContentService {
    static async getAllContent(filters) {
        try {
            let whereConditions = [];
            let queryParams = [];
            let paramIndex = 1;
            if (filters.type) {
                whereConditions.push(`c.type = $${paramIndex}`);
                queryParams.push(filters.type);
                paramIndex++;
            }
            if (filters.author_id) {
                whereConditions.push(`c.author_id = $${paramIndex}`);
                queryParams.push(filters.author_id);
                paramIndex++;
            }
            if (filters.company_id) {
                whereConditions.push(`c.company_id = $${paramIndex}`);
                queryParams.push(filters.company_id);
                paramIndex++;
            }
            if (filters.is_published !== undefined) {
                whereConditions.push(`c.is_published = $${paramIndex}`);
                queryParams.push(filters.is_published);
                paramIndex++;
            }
            if (filters.search) {
                whereConditions.push(`(c.title ILIKE $${paramIndex} OR c.content ILIKE $${paramIndex})`);
                queryParams.push(`%${filters.search}%`);
                paramIndex++;
            }
            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
            const sortBy = filters.sort_by || 'published_at';
            const sortOrder = filters.sort_order || 'desc';
            const orderClause = `ORDER BY c.${sortBy} ${sortOrder.toUpperCase()}`;
            const limit = filters.limit || 20;
            const offset = filters.offset || 0;
            const paginationClause = `LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            queryParams.push(limit, offset);
            const query = `
        SELECT 
          c.*,
          u.first_name,
          u.last_name,
          u.email as author_email,
          comp.name as company_name,
          comp.logo_url as company_logo,
          comp.sector as company_sector
        FROM unified_content c
        LEFT JOIN users u ON c.author_id = u.id
        LEFT JOIN companies comp ON c.company_id = comp.id
        ${whereClause}
        ${orderClause}
        ${paginationClause}
      `;
            const result = await DatabaseService.query(query, queryParams);
            const countQuery = `
        SELECT COUNT(*) as total
        FROM unified_content c
        ${whereClause}
      `;
            const countResult = await DatabaseService.query(countQuery, queryParams.slice(0, -2));
            const total = parseInt(countResult.rows[0]?.total || '0');
            const hasMore = offset + limit < total;
            return {
                success: true,
                data: result.rows || [],
                total,
                has_more: hasMore
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to fetch content',
                data: []
            };
        }
    }
    static async getContentById(id) {
        try {
            const query = `
        SELECT 
          c.*,
          u.first_name,
          u.last_name,
          u.email as author_email,
          comp.name as company_name,
          comp.logo_url as company_logo,
          comp.sector as company_sector
        FROM unified_content c
        LEFT JOIN users u ON c.author_id = u.id
        LEFT JOIN companies comp ON c.company_id = comp.id
        WHERE c.id = $1
      `;
            const result = await DatabaseService.query(query, [id]);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'Content not found'
                };
            }
            return {
                success: true,
                data: result.rows[0]
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to fetch content'
            };
        }
    }
    static async createContent(userId, contentData) {
        try {
            if (contentData.company_id) {
                const companyQuery = `
          SELECT id FROM companies 
          WHERE id = $1 AND applicant_user_id = $2
        `;
                const companyResult = await DatabaseService.query(companyQuery, [contentData.company_id, userId]);
                if (companyResult.rows.length === 0) {
                    return {
                        success: false,
                        message: 'You do not have permission to create content for this company'
                    };
                }
            }
            const insertQuery = `
        INSERT INTO unified_content (
          author_id,
          company_id,
          title,
          content,
          type,
          tags,
          media_urls,
          metadata,
          is_published,
          published_at,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
            const now = new Date().toISOString();
            const values = [
                userId,
                contentData.company_id || null,
                contentData.title,
                contentData.content,
                contentData.type,
                contentData.tags || [],
                contentData.media_urls || [],
                contentData.metadata || {},
                contentData.is_published !== false,
                contentData.is_published !== false ? now : null,
                now,
                now
            ];
            const result = await DatabaseService.query(insertQuery, values);
            if (result.rows.length > 0) {
                const getContentQuery = `
          SELECT 
            c.*,
            u.first_name,
            u.last_name,
            u.email as author_email,
            comp.name as company_name,
            comp.logo_url as company_logo,
            comp.sector as company_sector
          FROM unified_content c
          LEFT JOIN users u ON c.author_id = u.id
          LEFT JOIN companies comp ON c.company_id = comp.id
          WHERE c.id = $1
        `;
                const contentResult = await DatabaseService.query(getContentQuery, [result.rows[0].id]);
                return {
                    success: true,
                    data: contentResult.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Failed to create content'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to create content'
            };
        }
    }
    static async updateContent(id, userId, updateData) {
        try {
            const verifyQuery = `
        SELECT c.*, comp.applicant_user_id as company_owner_id
        FROM unified_content c
        LEFT JOIN companies comp ON c.company_id = comp.id
        WHERE c.id = $1
      `;
            const verifyResult = await DatabaseService.query(verifyQuery, [id]);
            if (verifyResult.rows.length === 0) {
                return {
                    success: false,
                    message: 'Content not found'
                };
            }
            const content = verifyResult.rows[0];
            if (content.author_id !== userId && content.company_owner_id !== userId) {
                return {
                    success: false,
                    message: 'Permission denied'
                };
            }
            const updateFields = [];
            const values = [];
            let paramIndex = 1;
            if (updateData.title !== undefined) {
                updateFields.push(`title = $${paramIndex}`);
                values.push(updateData.title);
                paramIndex++;
            }
            if (updateData.content !== undefined) {
                updateFields.push(`content = $${paramIndex}`);
                values.push(updateData.content);
                paramIndex++;
            }
            if (updateData.type !== undefined) {
                updateFields.push(`type = $${paramIndex}`);
                values.push(updateData.type);
                paramIndex++;
            }
            if (updateData.tags !== undefined) {
                updateFields.push(`tags = $${paramIndex}`);
                values.push(updateData.tags);
                paramIndex++;
            }
            if (updateData.media_urls !== undefined) {
                updateFields.push(`media_urls = $${paramIndex}`);
                values.push(updateData.media_urls);
                paramIndex++;
            }
            if (updateData.metadata !== undefined) {
                updateFields.push(`metadata = $${paramIndex}`);
                values.push(updateData.metadata);
                paramIndex++;
            }
            if (updateData.is_published !== undefined) {
                updateFields.push(`is_published = $${paramIndex}`);
                values.push(updateData.is_published);
                paramIndex++;
                if (updateData.is_published && !content.published_at) {
                    updateFields.push(`published_at = $${paramIndex}`);
                    values.push(new Date().toISOString());
                    paramIndex++;
                }
            }
            if (updateFields.length === 0) {
                return {
                    success: false,
                    message: 'No fields to update'
                };
            }
            updateFields.push(`updated_at = $${paramIndex}`);
            values.push(new Date().toISOString());
            paramIndex++;
            values.push(id);
            const updateQuery = `
        UPDATE unified_content 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
            const result = await DatabaseService.query(updateQuery, values);
            if (result.rows.length > 0) {
                return {
                    success: true,
                    data: result.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Failed to update content'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to update content'
            };
        }
    }
    static async deleteContent(id, userId) {
        try {
            const verifyQuery = `
        SELECT c.*, comp.applicant_user_id as company_owner_id
        FROM unified_content c
        LEFT JOIN companies comp ON c.company_id = comp.id
        WHERE c.id = $1
      `;
            const verifyResult = await DatabaseService.query(verifyQuery, [id]);
            if (verifyResult.rows.length === 0) {
                return {
                    success: false,
                    message: 'Content not found'
                };
            }
            const content = verifyResult.rows[0];
            if (content.author_id !== userId && content.company_owner_id !== userId) {
                return {
                    success: false,
                    message: 'Permission denied'
                };
            }
            const deleteQuery = `
        DELETE FROM unified_content 
        WHERE id = $1
      `;
            await DatabaseService.query(deleteQuery, [id]);
            return {
                success: true,
                message: 'Content deleted successfully'
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to delete content'
            };
        }
    }
    static async getContentByCompany(filters) {
        try {
            const companyId = filters.company_id;
            if (!companyId) {
                return {
                    success: false,
                    message: 'Company ID is required',
                    data: []
                };
            }
            const queryFilters = {
                ...filters,
                company_id: companyId
            };
            return await this.getAllContent(queryFilters);
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to fetch company content',
                data: []
            };
        }
    }
    static async getContentByUser(filters) {
        try {
            const userId = filters.author_id;
            if (!userId) {
                return {
                    success: false,
                    message: 'User ID is required',
                    data: []
                };
            }
            const queryFilters = {
                ...filters,
                author_id: userId
            };
            return await this.getAllContent(queryFilters);
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to fetch user content',
                data: []
            };
        }
    }
    static async togglePublishStatus(id, userId, isPublished) {
        try {
            const updateData = {
                is_published: isPublished
            };
            return await this.updateContent(id, userId, updateData);
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to update publish status'
            };
        }
    }
}
//# sourceMappingURL=unifiedContentService.js.map