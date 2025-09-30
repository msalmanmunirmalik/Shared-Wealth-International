import { DatabaseService } from '../../services/databaseService.js';
import { testPool } from '../setup.js';

// Mock the database pool for testing
jest.mock('../../../src/integrations/postgresql/config.js', () => ({
  default: testPool
}));

describe('DatabaseService', () => {
  beforeEach(async () => {
    // Clear any test data
    await testPool.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
    await testPool.query('DELETE FROM companies WHERE name LIKE $1', ['Test%']);
  });

  afterEach(async () => {
    // Clean up test data
    await testPool.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
    await testPool.query('DELETE FROM companies WHERE name LIKE $1', ['Test%']);
  });

  describe('query', () => {
    it('should execute a valid query successfully', async () => {
      const result = await DatabaseService.query('SELECT 1 as test');
      expect(result.rows[0].test).toBe(1);
    });

    it('should reject dangerous SQL operations', async () => {
      const dangerousQueries = [
        'DROP TABLE users',
        'DELETE FROM users',
        'TRUNCATE users',
        'ALTER TABLE users ADD COLUMN test'
      ];

      for (const query of dangerousQueries) {
        await expect(DatabaseService.query(query)).rejects.toThrow('Dangerous SQL operation detected');
      }
    });

    it('should handle query errors gracefully', async () => {
      await expect(DatabaseService.query('SELECT * FROM non_existent_table')).rejects.toThrow();
    });
  });

  describe('insert', () => {
    it('should insert data into valid table', async () => {
      const userData = {
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user'
      };

      const result = await DatabaseService.insert('users', userData);
      expect(result.email).toBe(userData.email);
      expect(result.role).toBe(userData.role);
    });

    it('should reject invalid table names', async () => {
      const userData = { email: 'test@example.com' };
      
      await expect(DatabaseService.insert('invalid_table', userData))
        .rejects.toThrow('Invalid table name: invalid_table');
    });

    it('should reject invalid column names', async () => {
      const userData = { 
        email: 'test@example.com',
        invalid_column: 'value' // This column doesn't exist in our whitelist
      };
      
      await expect(DatabaseService.insert('users', userData))
        .rejects.toThrow('Invalid column names detected');
    });
  });

  describe('update', () => {
    it('should update existing record', async () => {
      // First insert a test user
      const userData = {
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user'
      };
      const user = await DatabaseService.insert('users', userData);

      // Update the user
      const updateData = { role: 'admin' };
      const result = await DatabaseService.update('users', user.id, updateData);
      
      expect(result.role).toBe('admin');
      expect(result.id).toBe(user.id);
    });

    it('should reject updates to invalid tables', async () => {
      await expect(DatabaseService.update('invalid_table', '123', { name: 'test' }))
        .rejects.toThrow('Invalid table name: invalid_table');
    });

    it('should reject updates with invalid column names', async () => {
      const updateData = { invalid_column: 'value' };
      
      await expect(DatabaseService.update('users', '123', updateData))
        .rejects.toThrow('Invalid column names detected');
    });
  });

  describe('delete', () => {
    it('should delete existing record', async () => {
      // First insert a test user
      const userData = {
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user'
      };
      const user = await DatabaseService.insert('users', userData);

      // Delete the user
      const result = await DatabaseService.delete('users', user.id);
      expect(result).toBe(true);

      // Verify user is deleted
      const deletedUser = await DatabaseService.findById('users', user.id);
      expect(deletedUser).toBeNull();
    });

    it('should reject deletes from invalid tables', async () => {
      await expect(DatabaseService.delete('invalid_table', '123'))
        .rejects.toThrow('Invalid table name: invalid_table');
    });
  });

  describe('findById', () => {
    it('should find existing record by ID', async () => {
      // First insert a test user
      const userData = {
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user'
      };
      const user = await DatabaseService.insert('users', userData);

      // Find the user
      const result = await DatabaseService.findById('users', user.id);
      expect(result).toBeDefined();
      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
    });

    it('should return null for non-existent ID', async () => {
      const result = await DatabaseService.findById('users', 'non-existent-id');
      expect(result).toBeNull();
    });

    it('should reject queries to invalid tables', async () => {
      await expect(DatabaseService.findById('invalid_table', '123'))
        .rejects.toThrow('Invalid table name: invalid_table');
    });
  });

  describe('findAll', () => {
    it('should return all records from table', async () => {
      // Insert test users
      const userData1 = {
        email: 'test1@example.com',
        password_hash: 'hashed_password1',
        role: 'user'
      };
      const userData2 = {
        email: 'test2@example.com',
        password_hash: 'hashed_password2',
        role: 'admin'
      };

      await DatabaseService.insert('users', userData1);
      await DatabaseService.insert('users', userData2);

      const results = await DatabaseService.findAll('users');
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply where clause correctly', async () => {
      // Insert test users
      const userData1 = {
        email: 'test1@example.com',
        password_hash: 'hashed_password1',
        role: 'user'
      };
      const userData2 = {
        email: 'test2@example.com',
        password_hash: 'hashed_password2',
        role: 'admin'
      };

      await DatabaseService.insert('users', userData1);
      await DatabaseService.insert('users', userData2);

      const results = await DatabaseService.findAll('users', { where: { role: 'admin' } });
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.every(user => user.role === 'admin')).toBe(true);
    });

    it('should apply pagination correctly', async () => {
      // Insert multiple test users
      for (let i = 0; i < 5; i++) {
        await DatabaseService.insert('users', {
          email: `test${i}@example.com`,
          password_hash: `hashed_password${i}`,
          role: 'user'
        });
      }

      const results = await DatabaseService.findAll('users', { limit: 3, offset: 0 });
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('should reject queries to invalid tables', async () => {
      await expect(DatabaseService.findAll('invalid_table'))
        .rejects.toThrow('Invalid table name: invalid_table');
    });
  });

  describe('findOne', () => {
    it('should return first matching record', async () => {
      // Insert test users
      const userData1 = {
        email: 'test1@example.com',
        password_hash: 'hashed_password1',
        role: 'user'
      };
      const userData2 = {
        email: 'test2@example.com',
        password_hash: 'hashed_password2',
        role: 'admin'
      };

      await DatabaseService.insert('users', userData1);
      await DatabaseService.insert('users', userData2);

      const result = await DatabaseService.findOne('users', { where: { role: 'admin' } });
      expect(result).toBeDefined();
      expect(result.role).toBe('admin');
    });

    it('should return null when no matches found', async () => {
      const result = await DatabaseService.findOne('users', { where: { role: 'superadmin' } });
      expect(result).toBeNull();
    });
  });

  describe('count', () => {
    it('should return correct count of records', async () => {
      // Insert test users
      const userData1 = {
        email: 'test1@example.com',
        password_hash: 'hashed_password1',
        role: 'user'
      };
      const userData2 = {
        email: 'test2@example.com',
        password_hash: 'hashed_password2',
        role: 'admin'
      };

      await DatabaseService.insert('users', userData1);
      await DatabaseService.insert('users', userData2);

      const count = await DatabaseService.count('users');
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it('should return correct count with where clause', async () => {
      // Insert test users
      const userData1 = {
        email: 'test1@example.com',
        password_hash: 'hashed_password1',
        role: 'user'
      };
      const userData2 = {
        email: 'test2@example.com',
        password_hash: 'hashed_password2',
        role: 'admin'
      };

      await DatabaseService.insert('users', userData1);
      await DatabaseService.insert('users', userData2);

      const adminCount = await DatabaseService.count('users', { where: { role: 'admin' } });
      expect(adminCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('transaction', () => {
    it('should execute transaction successfully', async () => {
      const result = await DatabaseService.transaction(async (client) => {
        const res = await client.query('SELECT 1 as test');
        return res.rows[0].test;
      });

      expect(result).toBe(1);
    });

    it('should rollback on error', async () => {
      // This should rollback the transaction
      await expect(DatabaseService.transaction(async (client) => {
        await client.query('SELECT 1');
        throw new Error('Test error');
      })).rejects.toThrow('Test error');
    });
  });

  describe('healthCheck', () => {
    it('should return true when database is healthy', async () => {
      const isHealthy = await DatabaseService.healthCheck();
      expect(isHealthy).toBe(true);
    });
  });
});
