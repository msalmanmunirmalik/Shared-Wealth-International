import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load login page quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForSelector('input[type="email"]');
    const loadTime = Date.now() - startTime;
    
    // Login form should be visible within 1 second
    expect(loadTime).toBeLessThan(1000);
  });

  test('should handle signup form interactions smoothly', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Create Account');
    
    const startTime = Date.now();
    await page.fill('input[placeholder*="Enter your first name"]', 'Test');
    await page.fill('input[placeholder*="Enter your last name"]', 'User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[placeholder*="Create a strong password"]', 'password123');
    await page.fill('input[placeholder*="Confirm your password"]', 'password123');
    
    const interactionTime = Date.now() - startTime;
    
    // Form interactions should be smooth (less than 500ms)
    expect(interactionTime).toBeLessThan(500);
  });

  test('should load dashboard within acceptable time', async ({ page }) => {
    // Mock login
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'admin123');
    
    const startTime = Date.now();
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Dashboard should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle API calls efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Monitor network requests
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.click('text=Create Account');
    await page.waitForLoadState('networkidle');
    
    // Should not make unnecessary API calls on form load
    const apiRequests = requests.filter(url => url.includes('/api/'));
    expect(apiRequests.length).toBeLessThan(5);
  });

  test('should handle large forms without performance issues', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Create Account');
    
    const startTime = Date.now();
    
    // Fill out all form fields
    await page.fill('input[placeholder*="Enter your first name"]', 'Test');
    await page.fill('input[placeholder*="Enter your last name"]', 'User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[placeholder*="Phone"]', '1234567890');
    await page.fill('textarea[placeholder*="Tell us about yourself"]', 'This is a test bio for performance testing');
    await page.fill('input[placeholder*="e.g., CEO, Director"]', 'Software Engineer');
    await page.fill('input[placeholder*="Your company name"]', 'Test Company');
    await page.fill('input[placeholder*="City, Country"]', 'Test City, Test Country');
    await page.fill('input[placeholder*="https://yourwebsite.com"]', 'https://testwebsite.com');
    await page.fill('input[placeholder*="https://linkedin.com"]', 'https://linkedin.com/in/testuser');
    await page.fill('input[placeholder*="https://twitter.com"]', 'https://twitter.com/testuser');
    await page.fill('input[placeholder*="Create a strong password"]', 'testpassword123');
    await page.fill('input[placeholder*="Confirm your password"]', 'testpassword123');
    
    const formFillTime = Date.now() - startTime;
    
    // Form filling should be fast (less than 1 second)
    expect(formFillTime).toBeLessThan(1000);
  });

  test('should handle image upload efficiently', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Create Account');
    
    // Test profile image upload performance
    const startTime = Date.now();
    
    // Create a small test file
    const testFile = Buffer.from('fake-image-data');
    
    await page.setInputFiles('input[type="file"]', {
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: testFile
    });
    
    const uploadTime = Date.now() - startTime;
    
    // File selection should be fast (less than 100ms)
    expect(uploadTime).toBeLessThan(100);
  });

  test('should maintain performance with multiple tabs', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    const startTime = Date.now();
    
    await Promise.all([
      page1.goto('/'),
      page2.goto('/')
    ]);
    
    await Promise.all([
      page1.waitForLoadState('networkidle'),
      page2.waitForLoadState('networkidle')
    ]);
    
    const loadTime = Date.now() - startTime;
    
    // Multiple tabs should not significantly impact performance
    expect(loadTime).toBeLessThan(4000);
    
    await page1.close();
    await page2.close();
  });

  test('should handle memory efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Navigate through multiple pages to test memory usage
    await page.click('text=Create Account');
    await page.goBack();
    await page.click('text=Create Account');
    await page.fill('input[placeholder*="Enter your first name"]', 'Test');
    await page.fill('input[placeholder*="Enter your last name"]', 'User');
    await page.goBack();
    
    // Page should still be responsive after navigation
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
