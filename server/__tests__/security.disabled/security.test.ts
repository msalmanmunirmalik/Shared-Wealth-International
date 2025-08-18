import request from 'supertest';
import express from 'express';
import { testPool } from '../setup.js';
import { mockEnvVars } from '../testConfig.js';
import authRoutes from '../../routes/auth.js';
import companyRoutes from '../../routes/companies.js';

// Mock environment variables
beforeAll(() => {
  mockEnvVars();
});

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);

describe('Security Tests', () => {
  beforeEach(async () => {
    // Clear test data
    await testPool.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
    await testPool.query('DELETE FROM companies WHERE name LIKE $1', ['Test%']);
  });

  afterEach(async () => {
    // Clean up test data
    await testPool.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
    await testPool.query('DELETE FROM companies WHERE name LIKE $1', ['Test%']);
  });

  describe('SQL Injection Protection', () => {
    it('should reject malicious SQL in email field', async () => {
      const maliciousPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; INSERT INTO users (email, password_hash, role) VALUES ('hacker@evil.com', 'hash', 'admin'); --",
        "'; UPDATE users SET role = 'admin' WHERE email = 'test@example.com'; --"
      ];

      for (const payload of maliciousPayloads) {
        const response = await request(app)
          .post('/api/auth/signin')
          .send({
            email: payload,
            password: 'password123'
          });

        // Should either reject the request or not execute malicious SQL
        expect(response.status).not.toBe(500);
        
        // Verify no malicious users were created
        const dbResult = await testPool.query(
          'SELECT * FROM users WHERE email = $1',
          ['hacker@evil.com']
        );
        expect(dbResult.rows.length).toBe(0);
      }
    });

    it('should reject malicious SQL in password field', async () => {
      const maliciousPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; INSERT INTO users (email, password_hash, role) VALUES ('hacker@evil.com', 'hash', 'admin'); --"
      ];

      for (const payload of maliciousPayloads) {
        const response = await request(app)
          .post('/api/auth/signin')
          .send({
            email: 'test@example.com',
            password: payload
          });

        // Should either reject the request or not execute malicious SQL
        expect(response.status).not.toBe(500);
      }
    });

    it('should reject malicious SQL in company name field', async () => {
      const maliciousPayloads = [
        "'; DROP TABLE companies; --",
        "' OR '1'='1",
        "'; INSERT INTO companies (name, description, industry, size, location) VALUES ('Evil Corp', 'Hacking', 'Technology', 'large', 'Dark Web'); --"
      ];

      for (const payload of maliciousPayloads) {
        const response = await request(app)
          .post('/api/companies')
          .send({
            name: payload,
            description: 'Test company',
            industry: 'Technology',
            size: 'small',
            location: 'Test City'
          });

        // Should either reject the request or not execute malicious SQL
        expect(response.status).not.toBe(500);
        
        // Verify no malicious companies were created
        const dbResult = await testPool.query(
          'SELECT * FROM companies WHERE name = $1',
          ['Evil Corp']
        );
        expect(dbResult.rows.length).toBe(0);
      }
    });
  });

  describe('Input Validation', () => {
    it('should reject XSS payloads in input fields', async () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">',
        '"><script>alert("XSS")</script>',
        '"; alert("XSS"); //'
      ];

      for (const payload of xssPayloads) {
        const response = await request(app)
          .post('/api/companies')
          .send({
            name: payload,
            description: payload,
            industry: 'Technology',
            size: 'small',
            location: payload
          });

        // Should reject XSS payloads
        expect(response.status).toBe(400);
      }
    });

    it('should reject oversized payloads', async () => {
      const oversizedPayload = {
        name: 'A'.repeat(10000), // Very long name
        description: 'B'.repeat(10000), // Very long description
        industry: 'Technology',
        size: 'small',
        location: 'C'.repeat(10000) // Very long location
      };

      const response = await request(app)
        .post('/api/companies')
        .send(oversizedPayload);

      // Should reject oversized payloads
      expect(response.status).toBe(413);
    });

    it('should reject malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", "password": "password123"') // Malformed JSON

      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on authentication endpoints', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Make many requests quickly
      const promises = Array.from({ length: 20 }, () =>
        request(app)
          .post('/api/auth/signin')
          .send(credentials)
      );

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimited = responses.filter(res => res.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
      
      // Rate limited responses should include retry information
      const rateLimitedResponse = rateLimited[0];
      expect(rateLimitedResponse.body.message).toContain('Too many authentication attempts');
    });

    it('should enforce rate limiting on company endpoints', async () => {
      const companyData = {
        name: 'Test Company',
        description: 'Test Description',
        industry: 'Technology',
        size: 'small',
        location: 'Test City'
      };

      // Make many requests quickly
      const promises = Array.from({ length: 150 }, () =>
        request(app)
          .get('/api/companies')
      );

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimited = responses.filter(res => res.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('Authentication & Authorization', () => {
    it('should reject requests without authentication token', async () => {
      const response = await request(app)
        .post('/api/companies')
        .send({
          name: 'Test Company',
          description: 'Test Description',
          industry: 'Technology',
          size: 'small',
          location: 'Test City'
        });

      expect(response.status).toBe(401);
    });

    it('should reject requests with invalid authentication token', async () => {
      const response = await request(app)
        .post('/api/companies')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Test Company',
          description: 'Test Description',
          industry: 'Technology',
          size: 'small',
          location: 'Test City'
        });

      expect(response.status).toBe(403);
    });

    it('should reject requests with expired authentication token', async () => {
      // Create an expired token
      const jwt = await import('jsonwebtoken');
      const expiredToken = jwt.default.sign(
        { userId: 'test', email: 'test@example.com', role: 'user' },
        'test-secret',
        { expiresIn: '0s' } // Expired immediately
      );

      const response = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({
          name: 'Test Company',
          description: 'Test Description',
          industry: 'Technology',
          size: 'small',
          location: 'Test City'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('CSRF Protection', () => {
    it('should reject requests with invalid content type', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .set('Content-Type', 'text/plain')
        .send('email=test@example.com&password=password123');

      expect(response.status).toBe(400);
    });

    it('should validate JSON content type', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('email=test@example.com&password=password123');

      expect(response.status).toBe(400);
    });
  });

  describe('Data Sanitization', () => {
    it('should sanitize HTML in input fields', async () => {
      const htmlPayload = {
        name: '<strong>Test Company</strong>',
        description: '<script>alert("XSS")</script>Test Description',
        industry: 'Technology',
        size: 'small',
        location: '<em>Test City</em>'
      };

      const response = await request(app)
        .post('/api/companies')
        .send(htmlPayload);

      // Should either reject or sanitize HTML
      if (response.status === 201) {
        // If accepted, verify HTML was sanitized
        const company = response.body;
        expect(company.name).not.toContain('<strong>');
        expect(company.description).not.toContain('<script>');
        expect(company.location).not.toContain('<em>');
      } else {
        // If rejected, that's also acceptable
        expect(response.status).toBe(400);
      }
    });

    it('should handle null and undefined values safely', async () => {
      const nullPayload = {
        name: null,
        description: undefined,
        industry: 'Technology',
        size: 'small',
        location: null
      };

      const response = await request(app)
        .post('/api/companies')
        .send(nullPayload);

      // Should handle null/undefined gracefully
      expect(response.status).toBe(400);
    });
  });
});
