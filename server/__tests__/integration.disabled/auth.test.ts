import request from 'supertest';
import express from 'express';
import { testPool } from '../setup.js';
import { mockEnvVars } from '../testConfig.js';
import authRoutes from '../../routes/auth.js';

// Mock environment variables
beforeAll(() => {
  mockEnvVars();
});

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Integration Tests', () => {
  beforeEach(async () => {
    // Clear test data
    await testPool.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
  });

  afterEach(async () => {
    // Clean up test data
    await testPool.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
  });

  describe('POST /api/auth/signup', () => {
    it('should create new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'newpassword123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.role).toBe('user');

      // Verify user was created in database
      const dbResult = await testPool.query(
        'SELECT * FROM users WHERE email = $1',
        [userData.email]
      );
      expect(dbResult.rows.length).toBe(1);
    });

    it('should reject signup with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'newpassword123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject signup with short password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject signup with existing email', async () => {
      // Create existing user
      const passwordHash = 'hashed_password';
      await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['existing@example.com', passwordHash, 'user']
      );

      const userData = {
        email: 'existing@example.com',
        password: 'newpassword123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should sign in user with valid credentials', async () => {
      // Create test user
      const password = 'testpassword123';
      const passwordHash = await import('bcryptjs').then(bcrypt => 
        bcrypt.default.hash(password, 12)
      );
      
      await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      const credentials = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toBe(credentials.email);
      expect(response.body.user.role).toBe('user');
    });

    it('should reject signin with invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject signin with invalid password', async () => {
      // Create test user
      const password = 'testpassword123';
      const passwordHash = await import('bcryptjs').then(bcrypt => 
        bcrypt.default.hash(password, 12)
      );
      
      await testPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        ['test@example.com', passwordHash, 'user']
      );

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject signin with invalid email format', async () => {
      const credentials = {
        email: 'invalid-email',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject signin with short password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should handle password reset request', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Password reset email sent');
    });

    it('should reject password reset with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on auth endpoints', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      // Make multiple requests quickly
      const promises = Array.from({ length: 10 }, () =>
        request(app)
          .post('/api/auth/signup')
          .send(userData)
      );

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimited = responses.filter(res => res.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });
});
