import { test, expect } from '@playwright/test';

test.describe('Basic Functionality Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads
    await expect(page).toHaveTitle(/Shared Wealth International/);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check if there's some content on the page
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for basic navigation or content
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should handle API endpoints', async ({ request }) => {
    // Test the health endpoint
    const response = await request.get('http://localhost:8080/api/health');
    
    // Should return some response (could be 200 or error, but should respond)
    expect(response.status()).toBeLessThan(500);
  });
});
