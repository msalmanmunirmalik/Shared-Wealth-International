import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
  });

  test('should load dashboard within acceptable time', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(4000); // Should load within 4 seconds
  });

  test('should handle concurrent user sessions', async ({ browser }) => {
    // Create multiple browser contexts to simulate concurrent users
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);
    
    const pages = await Promise.all(contexts.map(context => context.newPage()));
    
    // Login all users concurrently
    const loginPromises = pages.map(async (page) => {
      await page.goto('/auth');
      await page.fill('input[type="email"]', 'admin@sharedwealth.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });
    
    await Promise.all(loginPromises);
    
    // All pages should be logged in
    for (const page of pages) {
      await expect(page.locator('text=Welcome')).toBeVisible();
    }
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });

  test('should handle large data sets efficiently', async ({ page }) => {
    // Login as admin
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    const startTime = Date.now();
    
    // Navigate to admin dashboard which loads multiple data sets
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Check that all data sections are loaded
    await expect(page.locator('[data-testid="total-users"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-companies"]')).toBeVisible();
  });

  test('should handle API response times', async ({ page }) => {
    // Monitor network requests
    const responses: number[] = [];
    
    page.on('response', response => {
      responses.push(response.status());
    });
    
    // Login and navigate through different sections
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // All API responses should be successful
    expect(responses.every(status => status >= 200 && status < 300)).toBeTruthy();
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Navigate through multiple pages
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.goto('/admin');
    await page.goto('/dashboard');
    await page.goto('/companies');
    await page.goto('/network');
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Memory usage shouldn't increase dramatically
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
  });

  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G network
    await context.route('**/*', route => {
      setTimeout(() => route.continue(), 100); // Add 100ms delay
    });
    
    const startTime = Date.now();
    
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/.*dashboard/);
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); // Should still load within 10 seconds even with slow network
  });
});
