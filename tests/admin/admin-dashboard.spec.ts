import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    await page.goto('/admin');
  });

  test('should display admin dashboard with all sections', async ({ page }) => {
    // Check main navigation
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Users')).toBeVisible();
    await expect(page.locator('text=Companies')).toBeVisible();
    await expect(page.locator('text=Content')).toBeVisible();
    await expect(page.locator('text=Monitoring')).toBeVisible();
    await expect(page.locator('text=Funding')).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await expect(page.locator('[data-testid="total-users"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-companies"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-funding"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-content"]')).toBeVisible();
  });

  test('should display recent activities', async ({ page }) => {
    await expect(page.locator('text=Recent Activities')).toBeVisible();
    await expect(page.locator('[data-testid="activity-feed"]')).toBeVisible();
  });

  test('should navigate to users management', async ({ page }) => {
    await page.click('text=Users');
    await expect(page).toHaveURL(/.*admin\/users/);
    await expect(page.locator('text=User Management')).toBeVisible();
  });

  test('should navigate to companies management', async ({ page }) => {
    await page.click('text=Companies');
    await expect(page).toHaveURL(/.*admin\/companies/);
    await expect(page.locator('text=Company Management')).toBeVisible();
  });

  test('should display company approval workflow', async ({ page }) => {
    await page.click('text=Companies');
    await expect(page.locator('text=Pending Approvals')).toBeVisible();
    
    // Check if there are pending companies to approve
    const pendingCompanies = page.locator('[data-testid="pending-company"]');
    if (await pendingCompanies.count() > 0) {
      await expect(pendingCompanies.first()).toBeVisible();
      await expect(page.locator('button:has-text("Approve")')).toBeVisible();
      await expect(page.locator('button:has-text("Reject")')).toBeVisible();
    }
  });

  test('should approve a company successfully', async ({ page }) => {
    await page.click('text=Companies');
    
    const approveButton = page.locator('button:has-text("Approve")').first();
    if (await approveButton.isVisible()) {
      await approveButton.click();
      
      // Should show success message
      await expect(page.locator('text=Company approved successfully')).toBeVisible();
      
      // Company should move from pending to approved list
      await expect(page.locator('text=Approved Companies')).toBeVisible();
    }
  });

  test('should display system health metrics', async ({ page }) => {
    await page.click('text=Monitoring');
    await expect(page.locator('text=System Health')).toBeVisible();
    await expect(page.locator('text=Database Status')).toBeVisible();
    await expect(page.locator('text=API Response Time')).toBeVisible();
    await expect(page.locator('text=Server Load')).toBeVisible();
  });

  test('should display funding analytics', async ({ page }) => {
    await page.click('text=Funding');
    await expect(page.locator('text=Funding Analytics')).toBeVisible();
    await expect(page.locator('text=Total Funding')).toBeVisible();
    await expect(page.locator('text=Applications')).toBeVisible();
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    // Try to make multiple rapid requests to trigger rate limiting
    for (let i = 0; i < 5; i++) {
      await page.reload();
      await page.waitForTimeout(100);
    }
    
    // Should still be able to access the page
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
});
