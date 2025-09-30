import pool from './config.js';
const ALLOWED_TABLES = [
    'users', 'companies', 'user_companies', 'network_connections',
    'funding_opportunities', 'funding_applications', 'forum_posts', 'events', 'messages',
    'news_articles', 'content_sections', 'admin_activity_log', 'activity_feed',
    'forum_categories', 'forum_topics', 'forum_replies', 'social_license_agreements',
    'network_companies', 'company_applications', 'admin_users', 'file_uploads',
    'projects', 'company_applications', 'collaboration_meetings', 'user_connections',
    'post_reactions', 'bookmarks', 'content_shares', 'company_news', 'unified_content'
];
function validateTableName(table) {
    if (!table || typeof table !== 'string')
        return false;
    return ALLOWED_TABLES.includes(table.toLowerCase());
}
function sanitizeColumnNames(columns) {
    const allowedColumns = [
        'id', 'email', 'password_hash', 'role', 'created_at', 'updated_at',
        'first_name', 'last_name', 'phone', 'is_active', 'email_verified', 'last_login',
        'name', 'description', 'industry', 'sector', 'size', 'location', 'website', 'logo', 'status',
        'user_id', 'company_id', 'connected_company_id', 'connection_strength', 'shared_projects',
        'collaboration_score', 'title', 'category', 'amount', 'deadline', 'eligibility', 'url',
        'content', 'start_date', 'end_date', 'max_participants', 'recipient_id', 'sender_id', 'message',
        'applicant_user_id', 'applicant_role', 'applicant_position', 'is_shared_wealth_licensed',
        'license_number', 'license_date', 'created_by_admin', 'logo_url', 'logo_file_path', 'countries', 'employees',
        'is_primary', 'joined_at', 'filename', 'original_filename', 'file_path', 'file_size', 'mime_type', 'upload_type', 'uploaded_by', 'related_entity_type', 'related_entity_id',
        'sender_id', 'recipient_id', 'content', 'message_type', 'attachments', 'reply_to_id', 'is_read', 'read_at',
        'project_type', 'status', 'start_date', 'end_date', 'budget', 'currency', 'participants', 'project_manager_id',
        'company_name', 'applicant_name', 'applicant_email', 'applicant_phone', 'company_sector', 'company_size', 'company_location', 'company_website', 'company_description', 'business_model', 'shared_wealth_commitment', 'expected_impact', 'application_status', 'review_notes', 'reviewed_by', 'reviewed_at',
        'meeting_title', 'meeting_date', 'meeting_notes', 'outcomes', 'impact_score', 'shared_wealth_contribution', 'meeting_type',
        'follower_id', 'following_id', 'connection_type',
        'post_id', 'post_type', 'reaction_type',
        'bookmarked_id', 'bookmarked_type',
        'content_id', 'content_type', 'share_type', 'platform',
        'company_id', 'author_id', 'title', 'content', 'tags', 'media_urls', 'is_published', 'published_at',
        'type', 'metadata', 'reactions', 'comments_count', 'shares_count', 'views_count'
    ];
    return columns.filter(col => allowedColumns.includes(col.toLowerCase()));
}
export class DatabaseService {
    static async query(text, params) {
        if (text.toLowerCase().includes('drop') ||
            text.toLowerCase().includes('truncate') ||
            text.toLowerCase().includes('alter') ||
            (text.toLowerCase().includes('delete from') && !text.toLowerCase().includes('where'))) {
            throw new Error('Dangerous SQL operation detected');
        }
        const start = Date.now();
        try {
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            console.log('Executed query', { text, duration, rows: res.rowCount });
            return res;
        }
        catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }
    static async insert(table, data) {
        if (!validateTableName(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }
        const columns = Object.keys(data);
        const sanitizedColumns = sanitizeColumnNames(columns);
        if (sanitizedColumns.length !== columns.length) {
            throw new Error('Invalid column names detected');
        }
        const values = Object.values(data);
        const placeholders = sanitizedColumns.map((_, index) => `$${index + 1}`).join(', ');
        const query = `
      INSERT INTO ${table} (${sanitizedColumns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
        const result = await this.query(query, values);
        return result.rows[0];
    }
    static async update(table, id, data) {
        if (!validateTableName(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }
        const columns = Object.keys(data);
        const sanitizedColumns = sanitizeColumnNames(columns);
        if (sanitizedColumns.length !== columns.length) {
            throw new Error('Invalid column names detected');
        }
        const values = Object.values(data);
        const setClause = sanitizedColumns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
        const result = await this.query(query, [...values, id]);
        return result.rows[0];
    }
    static async delete(table, id) {
        if (!validateTableName(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }
        const query = `DELETE FROM ${table} WHERE id = $1`;
        const result = await this.query(query, [id]);
        return result.rowCount > 0;
    }
    static async findById(table, id) {
        if (!validateTableName(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }
        const query = `SELECT * FROM ${table} WHERE id = $1`;
        const result = await this.query(query, [id]);
        return result.rows[0] || null;
    }
    static async findAll(table, options = {}) {
        if (!validateTableName(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }
        const { where = {}, selectColumns = ['*'], limit, offset } = options;
        let finalSelectColumns = ['*'];
        if (selectColumns.length > 0 && !selectColumns.includes('*')) {
            finalSelectColumns = sanitizeColumnNames(selectColumns);
            if (finalSelectColumns.length !== selectColumns.length) {
                throw new Error('Invalid column names detected');
            }
        }
        let query = `SELECT ${finalSelectColumns.join(', ')} FROM ${table}`;
        const values = [];
        let paramIndex = 1;
        if (Object.keys(where).length > 0) {
            const whereClause = Object.keys(where)
                .map(key => {
                const sanitizedKey = sanitizeColumnNames([key])[0];
                if (!sanitizedKey) {
                    throw new Error(`Invalid column name in where clause: ${key}`);
                }
                return `${sanitizedKey} = $${paramIndex++}`;
            })
                .join(' AND ');
            query += ` WHERE ${whereClause}`;
            values.push(...Object.values(where));
        }
        if (limit && typeof limit === 'number' && limit > 0 && limit <= 1000) {
            query += ` LIMIT $${paramIndex++}`;
            values.push(limit);
        }
        if (offset && typeof offset === 'number' && offset >= 0) {
            query += ` OFFSET $${paramIndex++}`;
            values.push(offset);
        }
        const result = await this.query(query, values);
        return result.rows;
    }
    static async findOne(table, options = {}) {
        if (!validateTableName(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }
        const { where = {}, selectColumns = ['*'] } = options;
        const result = await this.findAll(table, { where, selectColumns, limit: 1 });
        return result[0] || null;
    }
    static async count(table, options = {}) {
        if (!validateTableName(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }
        const { where = {} } = options;
        let query = `SELECT COUNT(*) FROM ${table}`;
        const values = [];
        let paramIndex = 1;
        if (Object.keys(where).length > 0) {
            const whereClause = Object.keys(where)
                .map(key => {
                const sanitizedKey = sanitizeColumnNames([key])[0];
                if (!sanitizedKey) {
                    throw new Error(`Invalid column name in where clause: ${key}`);
                }
                return `${sanitizedKey} = $${paramIndex++}`;
            })
                .join(' AND ');
            query += ` WHERE ${whereClause}`;
            values.push(...Object.values(where));
        }
        const result = await this.query(query, values);
        return parseInt(result.rows[0].count);
    }
    static async transaction(callback) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async healthCheck() {
        try {
            await this.query('SELECT 1');
            return true;
        }
        catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    }
}
//# sourceMappingURL=database.js.map