import { test, expect } from '@playwright/test';

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as regular user
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'msalmanmunirmalik@outlook.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display user dashboard with navigation', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Companies')).toBeVisible();
    await expect(page.locator('text=Network')).toBeVisible();
    await expect(page.locator('text=Resources')).toBeVisible();
    await expect(page.locator('text=News & Updates')).toBeVisible();
  });

  test('should display user companies', async ({ page }) => {
    await page.click('text=Companies');
    await expect(page.locator('text=My Companies')).toBeVisible();
    
    // Check if user has companies
    const userCompanies = page.locator('[data-testid="user-company"]');
    if (await userCompanies.count() > 0) {
      await expect(userCompanies.first()).toBeVisible();
    }
  });

  test('should create a new company', async ({ page }) => {
    await page.click('text=Companies');
    await page.click('button:has-text("Create Company")');
    
    // Fill company form
    await page.fill('input[name="name"]', 'Test Company E2E');
    await page.fill('input[name="description"]', 'Test company created via E2E testing');
    await page.fill('input[name="website"]', 'https://testcompany.com');
    await page.selectOption('select[name="sector"]', 'Technology');
    await page.fill('input[name="location"]', 'Test City');
    
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Company created successfully')).toBeVisible();
    
    // Company should appear in pending state
    await expect(page.locator('text=Pending Approval')).toBeVisible();
  });

  test('should navigate to network section', async ({ page }) => {
    await page.click('text=Network');
    await expect(page.locator('text=Network')).toBeVisible();
    
    // Check tabs
    await expect(page.locator('text=Members')).toBeVisible();
    await expect(page.locator('text=Companies')).toBeVisible();
    await expect(page.locator('text=Events')).toBeVisible();
  });

  test('should display events in network section', async ({ page }) => {
    await page.click('text=Network');
    await page.click('text=Events');
    
    await expect(page.locator('text=Network Events')).toBeVisible();
    
    // Check if events are displayed
    const events = page.locator('[data-testid="network-event"]');
    if (await events.count() > 0) {
      await expect(events.first()).toBeVisible();
    }
  });

  test('should navigate to resources section', async ({ page }) => {
    await page.click('text=Resources');
    await expect(page.locator('text=Tools & Learning')).toBeVisible();
    
    // Check tabs (Events should not be here anymore)
    await expect(page.locator('text=Training')).toBeVisible();
    await expect(page.locator('text=Tools')).toBeVisible();
    await expect(page.locator('text=Documentation')).toBeVisible();
  });

  test('should display news and updates', async ({ page }) => {
    await page.click('text=News & Updates');
    await expect(page.locator('text=Latest News')).toBeVisible();
    
    // Should not show statistics section (removed per requirements)
    await expect(page.locator('text=Total Posts')).not.toBeVisible();
    await expect(page.locator('text=Total Reactions')).not.toBeVisible();
  });

  test('should handle profile updates', async ({ page }) => {
    await page.click('button:has-text("Profile")');
    await expect(page.locator('text=Profile Settings')).toBeVisible();
    
    // Update profile
    await page.fill('input[name="firstName"]', 'Updated');
    await page.fill('input[name="lastName"]', 'Name');
    await page.click('button:has-text("Save Changes")');
    
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });

  test('should handle company applications', async ({ page }) => {
    await page.click('text=Applications');
    await expect(page.locator('text=My Applications')).toBeVisible();
    
    // Check if there are any applications
    const applications = page.locator('[data-testid="application-item"]');
    if (await applications.count() > 0) {
      await expect(applications.first()).toBeVisible();
    }
  });

  test('should display real-time activity feed', async ({ page }) => {
    await expect(page.locator('[data-testid="activity-feed"]')).toBeVisible();
    
    // Check if activities are displayed
    const activities = page.locator('[data-testid="activity-item"]');
    if (await activities.count() > 0) {
      await expect(activities.first()).toBeVisible();
    }
  });
});
