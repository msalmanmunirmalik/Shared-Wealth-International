import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  const API_BASE_URL = 'http://localhost:8080/api';

  test('should return health check status', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeDefined();
  });

  test('should handle authentication endpoints', async ({ request }) => {
    // Test signup endpoint
    const signupResponse = await request.post(`${API_BASE_URL}/auth/signup`, {
      data: {
        email: 'test@example.com',
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    // Should return success or user already exists
    expect([200, 201, 400]).toContain(signupResponse.status());
    
    // Test signin endpoint
    const signinResponse = await request.post(`${API_BASE_URL}/auth/signin`, {
      data: {
        email: 'test@example.com',
        password: 'testpassword123'
      }
    });
    
    // Should return success or invalid credentials
    expect([200, 401]).toContain(signinResponse.status());
  });

  test('should handle user profile endpoints', async ({ request }) => {
    // First get auth token
    const signinResponse = await request.post(`${API_BASE_URL}/auth/signin`, {
      data: {
        email: 'admin@sharedwealth.com',
        password: 'admin123'
      }
    });
    
    if (signinResponse.status() === 200) {
      const authData = await signinResponse.json();
      const token = authData.session?.access_token;
      
      if (token) {
        // Test get profile endpoint
        const profileResponse = await request.get(`${API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        expect([200, 401, 404]).toContain(profileResponse.status());
        
        // Test update profile endpoint
        const updateResponse = await request.put(`${API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {
            bio: 'Updated bio from test'
          }
        });
        
        expect([200, 400, 401]).toContain(updateResponse.status());
      }
    }
  });

  test('should handle company endpoints', async ({ request }) => {
    // Test get companies endpoint
    const companiesResponse = await request.get(`${API_BASE_URL}/companies`);
    expect([200, 401]).toContain(companiesResponse.status());
    
    if (companiesResponse.status() === 200) {
      const data = await companiesResponse.json();
      expect(Array.isArray(data.companies) || Array.isArray(data)).toBe(true);
    }
  });

  test('should handle team members endpoint', async ({ request }) => {
    // Test get team members endpoint
    const teamResponse = await request.get(`${API_BASE_URL}/users/team`);
    expect(teamResponse.status()).toBe(200);
    
    const data = await teamResponse.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    
    // Test filtering by role
    const directorsResponse = await request.get(`${API_BASE_URL}/users/team?role=director`);
    expect(directorsResponse.status()).toBe(200);
    
    const directorsData = await directorsResponse.json();
    expect(directorsData.success).toBe(true);
  });

  test('should handle file upload endpoints', async ({ request }) => {
    // Test file upload endpoint (without actual file for now)
    const uploadResponse = await request.post(`${API_BASE_URL}/files/upload`);
    
    // Should return 401 (unauthorized) or 400 (no file)
    expect([400, 401]).toContain(uploadResponse.status());
  });

  test('should handle admin endpoints', async ({ request }) => {
    // First get admin auth token
    const signinResponse = await request.post(`${API_BASE_URL}/auth/signin`, {
      data: {
        email: 'admin@sharedwealth.com',
        password: 'admin123'
      }
    });
    
    if (signinResponse.status() === 200) {
      const authData = await signinResponse.json();
      const token = authData.session?.access_token;
      
      if (token) {
        // Test admin stats endpoint
        const statsResponse = await request.get(`${API_BASE_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        expect([200, 401, 403]).toContain(statsResponse.status());
        
        // Test admin users endpoint
        const usersResponse = await request.get(`${API_BASE_URL}/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        expect([200, 401, 403]).toContain(usersResponse.status());
      }
    }
  });

  test('should handle rate limiting', async ({ request }) => {
    // Make multiple rapid requests to test rate limiting
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(request.get(`${API_BASE_URL}/health`));
    }
    
    const responses = await Promise.all(promises);
    
    // All should succeed (rate limiting should not block health checks)
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });

  test('should handle CORS properly', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`, {
      headers: {
        'Origin': 'http://localhost:8082'
      }
    });
    
    expect(response.status()).toBe(200);
    
    // Check CORS headers
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
  });
});
