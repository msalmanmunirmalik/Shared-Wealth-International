import pool from './config.js';

export class DatabaseService {
  // Generic query method
  static async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Generic insert method
  static async insert(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.query(query, values);
    return result.rows[0];
  }

  // Generic update method
  static async update(table: string, id: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
    
    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    
    const result = await this.query(query, [...values, id]);
    return result.rows[0];
  }

  // Generic delete method
  static async delete(table: string, id: string): Promise<boolean> {
    const query = `DELETE FROM ${table} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rowCount > 0;
  }

  // Generic find by ID method
  static async findById(table: string, id: string): Promise<any> {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  // Generic find all method
  static async findAll(table: string, options: { where?: Record<string, any>, selectColumns?: string[], limit?: number, offset?: number } = {}): Promise<any[]> {
    const { where = {}, selectColumns = ['*'], limit, offset } = options;
    
    let query = `SELECT ${selectColumns.join(', ')} FROM ${table}`;
    const values: any[] = [];
    let paramIndex = 1;

    if (Object.keys(where).length > 0) {
      const whereClause = Object.keys(where)
        .map(key => `${key} = $${paramIndex++}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(where));
    }

    if (limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(limit);
    }

    if (offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  // Generic find one method
  static async findOne(table: string, options: { where?: Record<string, any>, selectColumns?: string[] } = {}): Promise<any> {
    const { where = {}, selectColumns = ['*'] } = options;
    const result = await this.findAll(table, { where, selectColumns, limit: 1 });
    return result[0] || null;
  }

  // Generic count method
  static async count(table: string, options: { where?: Record<string, any> } = {}): Promise<number> {
    const { where = {} } = options;
    
    let query = `SELECT COUNT(*) FROM ${table}`;
    const values: any[] = [];
    let paramIndex = 1;

    if (Object.keys(where).length > 0) {
      const whereClause = Object.keys(where)
        .map(key => `${key} = $${paramIndex++}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(where));
    }

    const result = await this.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Transaction method
  static async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Health check method
  static async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}
