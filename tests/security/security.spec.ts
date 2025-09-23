import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should protect against CSRF attacks', async ({ page }) => {
    await page.goto('/auth');
    
    // Login first
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Try to make a request without CSRF token
    const response = await page.request.post('/api/companies', {
      data: {
        name: 'Test Company',
        description: 'Test description'
      }
    });
    
    // Should be rejected due to missing CSRF token
    expect(response.status()).toBe(403);
    
    const responseData = await response.json();
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe('CSRF token missing');
  });

  test('should validate input data', async ({ page }) => {
    await page.goto('/auth');
    
    // Login first
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Try to create a company with invalid data
    await page.goto('/companies');
    await page.click('button:has-text("Create Company")');
    
    // Submit form with invalid data
    await page.fill('input[name="name"]', '<script>alert("xss")</script>');
    await page.fill('input[name="description"]', 'Test description');
    await page.fill('input[name="website"]', 'invalid-url');
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Invalid')).toBeVisible();
  });

  test('should handle SQL injection attempts', async ({ page }) => {
    await page.goto('/auth');
    
    // Login first
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Try SQL injection in search
    await page.goto('/companies');
    
    // Attempt SQL injection in search field
    const maliciousInput = "'; DROP TABLE users; --";
    
    // This should be sanitized and not cause any issues
    await page.fill('input[placeholder*="search"], input[name*="search"]', maliciousInput);
    
    // The page should still be functional
    await expect(page.locator('text=Companies')).toBeVisible();
  });

  test('should enforce rate limiting', async ({ page }) => {
    await page.goto('/auth');
    
    // Login first
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Make multiple rapid requests to trigger rate limiting
    const requests = [];
    for (let i = 0; i < 20; i++) {
      requests.push(page.request.get('/api/companies'));
    }
    
    const responses = await Promise.all(requests);
    
    // Some requests should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('should validate file uploads', async ({ page }) => {
    await page.goto('/auth');
    
    // Login first
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Try to upload an invalid file
    await page.goto('/files');
    
    // Create a malicious file
    const maliciousContent = '<?php echo "hacked"; ?>';
    const buffer = Buffer.from(maliciousContent);
    
    // Try to upload the malicious file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'malicious.php',
      mimeType: 'application/x-php',
      buffer: buffer
    });
    
    // Should show validation error
    await expect(page.locator('text=File type not allowed')).toBeVisible();
  });

  test('should handle XSS attempts', async ({ page }) => {
    await page.goto('/auth');
    
    // Login first
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Try XSS in profile update
    await page.goto('/profile');
    
    const xssPayload = '<script>document.location="http://evil.com"</script>';
    
    await page.fill('input[name="firstName"]', xssPayload);
    await page.click('button:has-text("Save")');
    
    // Check that the script was sanitized
    const firstNameValue = await page.inputValue('input[name="firstName"]');
    expect(firstNameValue).not.toContain('<script>');
    expect(firstNameValue).not.toContain('document.location');
  });

  test('should validate authentication tokens', async ({ page }) => {
    // Try to access protected route without authentication
    const response = await page.request.get('/api/admin/stats');
    
    // Should be rejected
    expect(response.status()).toBe(401);
    
    const responseData = await response.json();
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('token');
  });

  test('should handle session security', async ({ page }) => {
    await page.goto('/auth');
    
    // Login first
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Check that session cookie is secure
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => 
      cookie.name.includes('session') || cookie.name.includes('wealth-pioneers')
    );
    
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);
  });
});
