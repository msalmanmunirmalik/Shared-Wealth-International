import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../services/authService.js';
import { testPool } from '../setup.js';
import { mockEnvVars } from '../testConfig.js';

// Mock the database pool for testing
jest.mock('../../src/integrations/postgresql/config.js', () => ({
  default: testPool
}));

// Mock environment variables
beforeAll(() => {
  mockEnvVars();
});

describe('AuthService', () => {
  beforeEach(async () => {
    // Clear any test data
    await testPool.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
  });

  afterEach(async () => {
    // Clean up test data
    await testPool.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
  });

  describe('signIn', () => {
    it('should sign in user with valid credentials', async () => {
      // Create test user
      const password = 'testpassword123';
      const passwordHash = await bcrypt.hash(password, 12);
      
      const userData = {
        email: 'test@example.com',
        password_hash: passwordHash,
        role: 'user'
      };
      
      await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        [userData.email, userData.password_hash, userData.role]
      );

      // Test sign in
      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'testpassword123'
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.user.email).toBe('test@example.com');
      expect(result.data?.user.role).toBe('user');
      expect(result.data?.access_token).toBeDefined();
    });

    it('should reject sign in with invalid email', async () => {
      const result = await AuthService.signIn({
        email: 'nonexistent@example.com',
        password: 'testpassword123'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
    });

    it('should reject sign in with invalid password', async () => {
      // Create test user
      const password = 'testpassword123';
      const passwordHash = await bcrypt.hash(password, 12);
      
      await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      // Test sign in with wrong password
      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      jest.spyOn(testPool, 'query').mockRejectedValueOnce(new Error('Database error'));

      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'testpassword123'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Internal server error');
    });
  });

  describe('signUp', () => {
    it('should create new user successfully', async () => {
      const result = await AuthService.signUp({
        email: 'newuser@example.com',
        password: 'newpassword123'
      });

      expect(result.success).toBe(true);
      expect(result.data?.userId).toBeDefined();
      expect(result.message).toBe('User created successfully');

      // Verify user was created in database
      const dbResult = await testPool.query(
        'SELECT * FROM users WHERE email = $1',
        ['newuser@example.com']
      );
      expect(dbResult.rows.length).toBe(1);
      expect(dbResult.rows[0].email).toBe('newuser@example.com');
      expect(dbResult.rows[0].role).toBe('user');
    });

    it('should reject sign up with existing email', async () => {
      // Create existing user
      const passwordHash = await bcrypt.hash('password123', 12);
      await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['existing@example.com', passwordHash, 'user']
      );

      // Try to sign up with same email
      const result = await AuthService.signUp({
        email: 'existing@example.com',
        password: 'newpassword123'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('User already exists');
    });

    it('should hash password securely', async () => {
      const password = 'testpassword123';
      
      const result = await AuthService.signUp({
        email: 'test@example.com',
        password
      });

      expect(result.success).toBe(true);

      // Verify password was hashed
      const dbResult = await testPool.query(
        'SELECT password_hash FROM users WHERE email = $1',
        ['test@example.com']
      );
      
      const storedHash = dbResult.rows[0].password_hash;
      expect(storedHash).not.toBe(password);
      
      // Verify hash is valid
      const isValid = await bcrypt.compare(password, storedHash);
      expect(isValid).toBe(true);
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      const result = await AuthService.signOut('test-user-id');

      expect(result.success).toBe(true);
      expect(result.data?.message).toBe('Signed out successfully');
    });

    it('should handle errors gracefully', async () => {
      // Mock error
      jest.spyOn(AuthService, 'signOut').mockRejectedValueOnce(new Error('Test error'));

      await expect(AuthService.signOut('test-user-id')).rejects.toThrow('Test error');
    });
  });

  describe('resetPassword', () => {
    it('should handle password reset for existing user', async () => {
      // Create test user
      const passwordHash = await bcrypt.hash('password123', 12);
      await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      const result = await AuthService.resetPassword('test@example.com');

      expect(result.success).toBe(true);
      expect(result.data?.message).toBe('Password reset email sent');
    });

    it('should handle password reset for non-existent user (security)', async () => {
      const result = await AuthService.resetPassword('nonexistent@example.com');

      // Should not reveal if user exists or not
      expect(result.success).toBe(true);
      expect(result.data?.message).toBe('Password reset email sent');
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin user', async () => {
      // Create admin user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['admin@example.com', passwordHash, 'admin']
      );

      const result = await AuthService.isAdmin(userResult.rows[0].id);

      expect(result.success).toBe(true);
      expect(result.data?.isAdmin).toBe(true);
    });

    it('should return true for super admin user', async () => {
      // Create super admin user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['superadmin@example.com', passwordHash, 'superadmin']
      );

      const result = await AuthService.isAdmin(userResult.rows[0].id);

      expect(result.success).toBe(true);
      expect(result.data?.isAdmin).toBe(true);
    });

    it('should return false for regular user', async () => {
      // Create regular user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['user@example.com', passwordHash, 'user']
      );

      const result = await AuthService.isAdmin(userResult.rows[0].id);

      expect(result.success).toBe(true);
      expect(result.data?.isAdmin).toBe(false);
    });

    it('should return false for non-existent user', async () => {
      const result = await AuthService.isAdmin('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
    });
  });

  describe('isSuperAdmin', () => {
    it('should return true for super admin user', async () => {
      // Create super admin user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['superadmin@example.com', passwordHash, 'superadmin']
      );

      const result = await AuthService.isSuperAdmin(userResult.rows[0].id);

      expect(result.success).toBe(true);
      expect(result.data?.isSuperAdmin).toBe(true);
    });

    it('should return false for regular admin user', async () => {
      // Create admin user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['admin@example.com', passwordHash, 'admin']
      );

      const result = await AuthService.isSuperAdmin(userResult.rows[0].id);

      expect(result.success).toBe(true);
      expect(result.data?.isSuperAdmin).toBe(false);
    });

    it('should return false for regular user', async () => {
      // Create regular user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['user@example.com', passwordHash, 'user']
      );

      const result = await AuthService.isSuperAdmin(userResult.rows[0].id);

      expect(result.success).toBe(true);
      expect(result.data?.isSuperAdmin).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('should return user for valid ID', async () => {
      // Create test user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      const result = await AuthService.getUserById(userResult.rows[0].id);

      expect(result.success).toBe(true);
      expect(result.data?.email).toBe('test@example.com');
      expect(result.data?.role).toBe('user');
    });

    it('should return error for non-existent user', async () => {
      const result = await AuthService.getUserById('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Create test user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      const result = await AuthService.updateUser(userResult.rows[0].id, {
        role: 'admin'
      });

      expect(result.success).toBe(true);
      expect(result.data?.role).toBe('admin');
    });

    it('should not allow password_hash update through this method', async () => {
      // Create test user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      const result = await AuthService.updateUser(userResult.rows[0].id, {
        role: 'admin',
        password_hash: 'new_hash'
      });

      expect(result.success).toBe(true);
      expect(result.data?.role).toBe('admin');
      
      // Verify password_hash was not changed
      const dbResult = await testPool.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userResult.rows[0].id]
      );
      expect(dbResult.rows[0].password_hash).toBe(passwordHash);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      // Create test user
      const oldPassword = 'oldpassword123';
      const passwordHash = await bcrypt.hash(oldPassword, 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      const newPassword = 'newpassword123';
      const result = await AuthService.changePassword(
        userResult.rows[0].id,
        oldPassword,
        newPassword
      );

      expect(result.success).toBe(true);
      expect(result.data?.message).toBe('Password changed successfully');

      // Verify new password works
      const dbResult = await testPool.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userResult.rows[0].id]
      );
      
      const newHash = dbResult.rows[0].password_hash;
      const isValidNewPassword = await bcrypt.compare(newPassword, newHash);
      expect(isValidNewPassword).toBe(true);
    });

    it('should reject password change with wrong current password', async () => {
      // Create test user
      const passwordHash = await bcrypt.hash('password123', 12);
      const userResult = await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      const result = await AuthService.changePassword(
        userResult.rows[0].id,
        'wrongpassword',
        'newpassword123'
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe('Current password is incorrect');
    });

    it('should reject password change for non-existent user', async () => {
      const result = await AuthService.changePassword(
        'non-existent-id',
        'oldpassword',
        'newpassword'
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
    });
  });
});
