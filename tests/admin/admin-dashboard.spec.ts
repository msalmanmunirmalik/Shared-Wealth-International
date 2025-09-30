import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin login or use test credentials
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('should display admin dashboard with all sections', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    
    // Check for main dashboard sections
    await expect(page.locator('text=System Overview')).toBeVisible();
    await expect(page.locator('text=User Management')).toBeVisible();
    await expect(page.locator('text=Company Management')).toBeVisible();
    await expect(page.locator('text=Content Management')).toBeVisible();
    await expect(page.locator('text=Analytics & Reports')).toBeVisible();
  });

  test('should display system statistics', async ({ page }) => {
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Active Companies')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=System Health')).toBeVisible();
  });

  test('should show user management table', async ({ page }) => {
    await page.click('text=User Management');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th')).toContainText(['Email', 'Role', 'Status', 'Created']);
    await expect(page.locator('button:has-text("Create User")')).toBeVisible();
  });

  test('should show company management table', async ({ page }) => {
    await page.click('text=Company Management');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th')).toContainText(['Company Name', 'Status', 'Industry', 'Actions']);
    await expect(page.locator('button:has-text("Approve")')).toBeVisible();
    await expect(page.locator('button:has-text("Reject")')).toBeVisible();
  });

  test('should handle company approval workflow', async ({ page }) => {
    await page.click('text=Company Management');
    
    // Find a pending company and approve it
    const approveButton = page.locator('button:has-text("Approve")').first();
    if (await approveButton.isVisible()) {
      await approveButton.click();
      await expect(page.locator('text=Company approved successfully')).toBeVisible();
    }
  });

  test('should display analytics charts', async ({ page }) => {
    await page.click('text=Analytics & Reports');
    
    // Check for chart containers
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-growth-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="company-stats-chart"]')).toBeVisible();
  });

  test('should show system monitoring data', async ({ page }) => {
    await page.click('text=System Monitoring');
    
    await expect(page.locator('text=Server Status')).toBeVisible();
    await expect(page.locator('text=Database Status')).toBeVisible();
    await expect(page.locator('text=Memory Usage')).toBeVisible();
    await expect(page.locator('text=CPU Usage')).toBeVisible();
  });

  test('should handle bulk user operations', async ({ page }) => {
    await page.click('text=User Management');
    
    // Test bulk operations
    const selectAllCheckbox = page.locator('input[type="checkbox"]').first();
    if (await selectAllCheckbox.isVisible()) {
      await selectAllCheckbox.check();
      await expect(page.locator('button:has-text("Bulk Actions")')).toBeVisible();
    }
  });
});
