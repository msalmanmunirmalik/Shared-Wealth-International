import { DatabaseService } from '../../src/integrations/postgresql/database.js';
export class UnifiedSocialService {
    static async addReaction(userId, contentId, reactionType, contentType) {
        try {
            const existingQuery = `
        SELECT id FROM post_reactions 
        WHERE user_id = $1 AND content_id = $2 AND content_type = $3 AND reaction_type = $4
      `;
            const existingResult = await DatabaseService.query(existingQuery, [userId, contentId, contentType, reactionType]);
            if (existingResult.rows.length > 0) {
                return {
                    success: false,
                    message: 'Reaction already exists'
                };
            }
            const insertQuery = `
        INSERT INTO post_reactions (user_id, content_id, content_type, reaction_type, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
            const result = await DatabaseService.query(insertQuery, [userId, contentId, contentType, reactionType]);
            if (result.rows.length > 0) {
                await this.updateContentReactionsCount(contentId, contentType);
                return {
                    success: true,
                    data: result.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Failed to add reaction'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to add reaction'
            };
        }
    }
    static async removeReaction(userId, contentId, reactionType, contentType) {
        try {
            const deleteQuery = `
        DELETE FROM post_reactions 
        WHERE user_id = $1 AND content_id = $2 AND content_type = $3 AND reaction_type = $4
        RETURNING *
      `;
            const result = await DatabaseService.query(deleteQuery, [userId, contentId, contentType, reactionType]);
            if (result.rows.length > 0) {
                await this.updateContentReactionsCount(contentId, contentType);
                return {
                    success: true,
                    data: result.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Reaction not found'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to remove reaction'
            };
        }
    }
    static async getReactions(contentId, contentType) {
        try {
            const query = `
        SELECT 
          reaction_type,
          COUNT(*) as count,
          array_agg(DISTINCT u.first_name || ' ' || u.last_name) as users
        FROM post_reactions pr
        JOIN users u ON pr.user_id = u.id
        WHERE pr.content_id = $1 AND pr.content_type = $2
        GROUP BY reaction_type
        ORDER BY count DESC
      `;
            const result = await DatabaseService.query(query, [contentId, contentType]);
            const reactions = {};
            result.rows.forEach(row => {
                reactions[row.reaction_type] = {
                    count: parseInt(row.count),
                    users: row.users.slice(0, 5)
                };
            });
            return {
                success: true,
                data: reactions
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to get reactions',
                data: {}
            };
        }
    }
    static async createConnection(followerId, followingId, connectionType = 'follow') {
        try {
            const existingQuery = `
        SELECT id FROM user_connections 
        WHERE follower_id = $1 AND following_id = $2
      `;
            const existingResult = await DatabaseService.query(existingQuery, [followerId, followingId]);
            if (existingResult.rows.length > 0) {
                return {
                    success: false,
                    message: 'Connection already exists'
                };
            }
            const insertQuery = `
        INSERT INTO user_connections (follower_id, following_id, connection_type, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
            const result = await DatabaseService.query(insertQuery, [followerId, followingId, connectionType]);
            if (result.rows.length > 0) {
                return {
                    success: true,
                    data: result.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Failed to create connection'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to create connection'
            };
        }
    }
    static async removeConnection(followerId, followingId) {
        try {
            const deleteQuery = `
        DELETE FROM user_connections 
        WHERE follower_id = $1 AND following_id = $2
        RETURNING *
      `;
            const result = await DatabaseService.query(deleteQuery, [followerId, followingId]);
            if (result.rows.length > 0) {
                return {
                    success: true,
                    data: result.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Connection not found'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to remove connection'
            };
        }
    }
    static async getConnections(userId, filters) {
        try {
            let whereCondition = '';
            let queryParams = [userId];
            let paramIndex = 2;
            if (filters.type === 'followers') {
                whereCondition = 'WHERE uc.following_id = $1';
            }
            else if (filters.type === 'following') {
                whereCondition = 'WHERE uc.follower_id = $1';
            }
            else {
                whereCondition = 'WHERE (uc.follower_id = $1 OR uc.following_id = $1)';
            }
            const query = `
        SELECT 
          uc.*,
          CASE 
            WHEN uc.follower_id = $1 THEN u_following.first_name || ' ' || u_following.last_name
            ELSE u_follower.first_name || ' ' || u_follower.last_name
          END as user_name,
          CASE 
            WHEN uc.follower_id = $1 THEN u_following.email
            ELSE u_follower.email
          END as user_email,
          CASE 
            WHEN uc.follower_id = $1 THEN 'following'
            ELSE 'follower'
          END as relationship_type
        FROM user_connections uc
        LEFT JOIN users u_follower ON uc.follower_id = u_follower.id
        LEFT JOIN users u_following ON uc.following_id = u_following.id
        ${whereCondition}
        ORDER BY uc.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
            queryParams.push(filters.limit || 20, filters.offset || 0);
            const result = await DatabaseService.query(query, queryParams);
            const countQuery = `
        SELECT COUNT(*) as total
        FROM user_connections uc
        ${whereCondition}
      `;
            const countResult = await DatabaseService.query(countQuery, [userId]);
            const total = parseInt(countResult.rows[0]?.total || '0');
            return {
                success: true,
                data: result.rows || [],
                total
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to get connections',
                data: []
            };
        }
    }
    static async getConnectionStats(userId) {
        try {
            const query = `
        SELECT 
          COUNT(*) FILTER (WHERE follower_id = $1) as following_count,
          COUNT(*) FILTER (WHERE following_id = $1) as followers_count,
          COUNT(DISTINCT connection_type) as connection_types_count
        FROM user_connections
        WHERE follower_id = $1 OR following_id = $1
      `;
            const result = await DatabaseService.query(query, [userId]);
            return {
                success: true,
                data: result.rows[0] || { following_count: 0, followers_count: 0, connection_types_count: 0 }
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to get connection stats',
                data: { following_count: 0, followers_count: 0, connection_types_count: 0 }
            };
        }
    }
    static async shareContent(userId, contentId, shareType, platform, message) {
        try {
            const insertQuery = `
        INSERT INTO content_shares (user_id, content_id, content_type, share_type, platform, message, created_at)
        VALUES ($1, $2, 'unified_content', $3, $4, $5, NOW())
        RETURNING *
      `;
            const result = await DatabaseService.query(insertQuery, [userId, contentId, shareType, platform, message]);
            if (result.rows.length > 0) {
                await this.updateContentSharesCount(contentId);
                return {
                    success: true,
                    data: result.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Failed to share content'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to share content'
            };
        }
    }
    static async getSharedContent(userId, filters) {
        try {
            let whereCondition = 'WHERE cs.user_id = $1';
            let queryParams = [userId];
            let paramIndex = 2;
            if (filters.platform) {
                whereCondition += ` AND cs.platform = $${paramIndex}`;
                queryParams.push(filters.platform);
                paramIndex++;
            }
            const query = `
        SELECT 
          cs.*,
          uc.title,
          uc.content,
          uc.type as content_type,
          u.first_name || ' ' || u.last_name as author_name
        FROM content_shares cs
        LEFT JOIN unified_content uc ON cs.content_id = uc.id
        LEFT JOIN users u ON uc.author_id = u.id
        ${whereCondition}
        ORDER BY cs.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
            queryParams.push(filters.limit || 20, filters.offset || 0);
            const result = await DatabaseService.query(query, queryParams);
            const countQuery = `
        SELECT COUNT(*) as total
        FROM content_shares cs
        ${whereCondition}
      `;
            const countResult = await DatabaseService.query(countQuery, queryParams.slice(0, -2));
            const total = parseInt(countResult.rows[0]?.total || '0');
            return {
                success: true,
                data: result.rows || [],
                total
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to get shared content',
                data: []
            };
        }
    }
    static async bookmarkContent(userId, contentId, contentType) {
        try {
            const existingQuery = `
        SELECT id FROM bookmarks 
        WHERE user_id = $1 AND bookmarked_id = $2 AND bookmarked_type = $3
      `;
            const existingResult = await DatabaseService.query(existingQuery, [userId, contentId, contentType]);
            if (existingResult.rows.length > 0) {
                return {
                    success: false,
                    message: 'Content already bookmarked'
                };
            }
            const insertQuery = `
        INSERT INTO bookmarks (user_id, bookmarked_id, bookmarked_type, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
            const result = await DatabaseService.query(insertQuery, [userId, contentId, contentType]);
            if (result.rows.length > 0) {
                return {
                    success: true,
                    data: result.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Failed to bookmark content'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to bookmark content'
            };
        }
    }
    static async removeBookmark(userId, contentId) {
        try {
            const deleteQuery = `
        DELETE FROM bookmarks 
        WHERE user_id = $1 AND bookmarked_id = $2
        RETURNING *
      `;
            const result = await DatabaseService.query(deleteQuery, [userId, contentId]);
            if (result.rows.length > 0) {
                return {
                    success: true,
                    data: result.rows[0]
                };
            }
            else {
                return {
                    success: false,
                    message: 'Bookmark not found'
                };
            }
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to remove bookmark'
            };
        }
    }
    static async getBookmarks(userId, filters) {
        try {
            let whereCondition = 'WHERE b.user_id = $1';
            let queryParams = [userId];
            let paramIndex = 2;
            if (filters.content_type) {
                whereCondition += ` AND b.bookmarked_type = $${paramIndex}`;
                queryParams.push(filters.content_type);
                paramIndex++;
            }
            const query = `
        SELECT 
          b.*,
          uc.title,
          uc.content,
          uc.type as content_type,
          u.first_name || ' ' || u.last_name as author_name
        FROM bookmarks b
        LEFT JOIN unified_content uc ON b.bookmarked_id = uc.id
        LEFT JOIN users u ON uc.author_id = u.id
        ${whereCondition}
        ORDER BY b.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
            queryParams.push(filters.limit || 20, filters.offset || 0);
            const result = await DatabaseService.query(query, queryParams);
            const countQuery = `
        SELECT COUNT(*) as total
        FROM bookmarks b
        ${whereCondition}
      `;
            const countResult = await DatabaseService.query(countQuery, queryParams.slice(0, -2));
            const total = parseInt(countResult.rows[0]?.total || '0');
            return {
                success: true,
                data: result.rows || [],
                total
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to get bookmarks',
                data: []
            };
        }
    }
    static async getSocialAnalytics(userId, period) {
        try {
            const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
            const query = `
        SELECT 
          COUNT(DISTINCT pr.id) as total_reactions_given,
          COUNT(DISTINCT cs.id) as total_shares,
          COUNT(DISTINCT b.id) as total_bookmarks,
          COUNT(DISTINCT uc_following.id) as following_count,
          COUNT(DISTINCT uc_followers.id) as followers_count
        FROM users u
        LEFT JOIN post_reactions pr ON u.id = pr.user_id AND pr.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN content_shares cs ON u.id = cs.user_id AND cs.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN bookmarks b ON u.id = b.user_id AND b.created_at > NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN user_connections uc_following ON u.id = uc_following.follower_id
        LEFT JOIN user_connections uc_followers ON u.id = uc_followers.following_id
        WHERE u.id = $1
      `;
            const result = await DatabaseService.query(query, [userId]);
            return {
                success: true,
                data: result.rows[0] || {
                    total_reactions_given: 0,
                    total_shares: 0,
                    total_bookmarks: 0,
                    following_count: 0,
                    followers_count: 0
                }
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to get social analytics',
                data: {}
            };
        }
    }
    static async getSocialFeed(userId, filters) {
        try {
            const query = `
        SELECT DISTINCT
          uc.*,
          u.first_name || ' ' || u.last_name as author_name,
          u.email as author_email,
          comp.name as company_name,
          comp.logo_url as company_logo,
          comp.sector as company_sector
        FROM unified_content uc
        JOIN users u ON uc.author_id = u.id
        LEFT JOIN companies comp ON uc.company_id = comp.id
        LEFT JOIN user_connections uc_conn ON uc.author_id = uc_conn.following_id AND uc_conn.follower_id = $1
        WHERE uc.is_published = true
        AND (uc.author_id = $1 OR uc_conn.id IS NOT NULL)
        ORDER BY uc.published_at DESC
        LIMIT $2 OFFSET $3
      `;
            const result = await DatabaseService.query(query, [userId, filters.limit || 20, filters.offset || 0]);
            const countQuery = `
        SELECT COUNT(DISTINCT uc.id) as total
        FROM unified_content uc
        LEFT JOIN user_connections uc_conn ON uc.author_id = uc_conn.following_id AND uc_conn.follower_id = $1
        WHERE uc.is_published = true
        AND (uc.author_id = $1 OR uc_conn.id IS NOT NULL)
      `;
            const countResult = await DatabaseService.query(countQuery, [userId]);
            const total = parseInt(countResult.rows[0]?.total || '0');
            return {
                success: true,
                data: result.rows || [],
                total
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Failed to get social feed',
                data: []
            };
        }
    }
    static async updateContentReactionsCount(contentId, contentType) {
        try {
            if (contentType === 'unified_content') {
                const countQuery = `
          SELECT reaction_type, COUNT(*) as count
          FROM post_reactions 
          WHERE content_id = $1 AND content_type = $2
          GROUP BY reaction_type
        `;
                const countResult = await DatabaseService.query(countQuery, [contentId, contentType]);
                const reactions = {};
                countResult.rows.forEach(row => {
                    reactions[row.reaction_type] = parseInt(row.count);
                });
                const updateQuery = `
          UPDATE unified_content 
          SET reactions = $1, updated_at = NOW()
          WHERE id = $2
        `;
                await DatabaseService.query(updateQuery, [JSON.stringify(reactions), contentId]);
            }
        }
        catch (error) {
            console.error('Error updating content reactions count:', error);
        }
    }
    static async updateContentSharesCount(contentId) {
        try {
            const countQuery = `
        SELECT COUNT(*) as count
        FROM content_shares 
        WHERE content_id = $1
      `;
            const countResult = await DatabaseService.query(countQuery, [contentId]);
            const sharesCount = parseInt(countResult.rows[0]?.count || '0');
            const updateQuery = `
        UPDATE unified_content 
        SET shares_count = $1, updated_at = NOW()
        WHERE id = $2
      `;
            await DatabaseService.query(updateQuery, [sharesCount, contentId]);
        }
        catch (error) {
            console.error('Error updating content shares count:', error);
        }
    }
}
//# sourceMappingURL=unifiedSocialService.js.map