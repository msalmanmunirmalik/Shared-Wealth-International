import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  const API_BASE = 'http://localhost:8080/api';

  test('should have healthy API endpoints', async ({ request }) => {
    // Test health endpoint
    const healthResponse = await request.get(`${API_BASE}/health`);
    expect(healthResponse.ok()).toBeTruthy();
    
    const healthData = await healthResponse.json();
    expect(healthData).toHaveProperty('status', 'healthy');
  });

  test('should handle authentication endpoints', async ({ request }) => {
    // Test signin endpoint
    const signinResponse = await request.post(`${API_BASE}/auth/signin`, {
      data: {
        email: 'admin@sharedwealth.com',
        password: 'password'
      }
    });
    
    expect(signinResponse.ok()).toBeTruthy();
    const signinData = await signinResponse.json();
    expect(signinData).toHaveProperty('token');
    expect(signinData).toHaveProperty('user');
  });

  test('should reject invalid authentication', async ({ request }) => {
    const signinResponse = await request.post(`${API_BASE}/auth/signin`, {
      data: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }
    });
    
    expect(signinResponse.status()).toBe(401);
    const errorData = await signinResponse.json();
    expect(errorData).toHaveProperty('success', false);
  });

  test('should handle companies API endpoints', async ({ request }) => {
    // First login to get token
    const signinResponse = await request.post(`${API_BASE}/auth/signin`, {
      data: {
        email: 'admin@sharedwealth.com',
        password: 'password'
      }
    });
    
    const { token } = await signinResponse.json();
    
    // Test companies endpoint
    const companiesResponse = await request.get(`${API_BASE}/companies`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(companiesResponse.ok()).toBeTruthy();
    const companiesData = await companiesResponse.json();
    expect(Array.isArray(companiesData)).toBeTruthy();
  });

  test('should handle admin endpoints with proper authorization', async ({ request }) => {
    // Login as admin
    const signinResponse = await request.post(`${API_BASE}/auth/signin`, {
      data: {
        email: 'admin@sharedwealth.com',
        password: 'password'
      }
    });
    
    const { token } = await signinResponse.json();
    
    // Test admin stats endpoint
    const statsResponse = await request.get(`${API_BASE}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(statsResponse.ok()).toBeTruthy();
    const statsData = await statsResponse.json();
    expect(statsData).toHaveProperty('totalUsers');
    expect(statsData).toHaveProperty('totalCompanies');
  });

  test('should reject unauthorized access to admin endpoints', async ({ request }) => {
    // Login as regular user
    const signinResponse = await request.post(`${API_BASE}/auth/signin`, {
      data: {
        email: 'msalmanmunirmalik@outlook.com',
        password: 'password'
      }
    });
    
    const { token } = await signinResponse.json();
    
    // Try to access admin endpoint
    const adminResponse = await request.get(`${API_BASE}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(adminResponse.status()).toBe(403);
  });

  test('should handle rate limiting', async ({ request }) => {
    // Make multiple rapid requests to trigger rate limiting
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(request.get(`${API_BASE}/health`));
    }
    
    const responses = await Promise.all(requests);
    
    // Some requests should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('should handle CORS properly', async ({ request }) => {
    const response = await request.options(`${API_BASE}/health`, {
      headers: {
        'Origin': 'http://localhost:8081',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    expect(response.status()).toBe(204);
    expect(response.headers()['access-control-allow-origin']).toBeTruthy();
  });

  test('should handle user endpoints', async ({ request }) => {
    // Login as user
    const signinResponse = await request.post(`${API_BASE}/auth/signin`, {
      data: {
        email: 'msalmanmunirmalik@outlook.com',
        password: 'password'
      }
    });
    
    const { token } = await signinResponse.json();
    
    // Test user profile endpoint
    const userResponse = await request.get(`${API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(userResponse.ok()).toBeTruthy();
    const userData = await userResponse.json();
    expect(userData).toHaveProperty('id');
    expect(userData).toHaveProperty('email');
  });

  test('should handle content endpoints', async ({ request }) => {
    // Login as user
    const signinResponse = await request.post(`${API_BASE}/auth/signin`, {
      data: {
        email: 'msalmanmunirmalik@outlook.com',
        password: 'password'
      }
    });
    
    const { token } = await signinResponse.json();
    
    // Test content endpoint
    const contentResponse = await request.get(`${API_BASE}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(contentResponse.ok()).toBeTruthy();
    const contentData = await contentResponse.json();
    expect(Array.isArray(contentData)).toBeTruthy();
  });
});
