import { test, expect } from '@playwright/test';

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock user login
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/user-dashboard');
  });

  test('should display user dashboard with personal information', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome');
    await expect(page.locator('text=My Companies')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=Quick Actions')).toBeVisible();
  });

  test('should show user profile information', async ({ page }) => {
    await expect(page.locator('text=Profile Information')).toBeVisible();
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=Role')).toBeVisible();
    await expect(page.locator('text=Member Since')).toBeVisible();
  });

  test('should display user companies', async ({ page }) => {
    await page.click('text=My Companies');
    await expect(page.locator('text=Company Name')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Industry')).toBeVisible();
    await expect(page.locator('button:has-text("View Details")')).toBeVisible();
  });

  test('should show recent activity feed', async ({ page }) => {
    await page.click('text=Recent Activity');
    await expect(page.locator('[data-testid="activity-feed"]')).toBeVisible();
    await expect(page.locator('text=Activity')).toBeVisible();
    await expect(page.locator('text=Timestamp')).toBeVisible();
  });

  test('should allow profile editing', async ({ page }) => {
    await page.click('text=Edit Profile');
    
    // Check profile form fields
    await expect(page.locator('input[placeholder*="First name"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Last name"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Bio"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Position"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Company"]')).toBeVisible();
    
    // Test profile image upload
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should handle company registration', async ({ page }) => {
    await page.click('text=Register Company');
    
    await expect(page.locator('input[placeholder*="Company name"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Description"]')).toBeVisible();
    await expect(page.locator('select[name="industry"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Website"]')).toBeVisible();
    
    // Fill out company form
    await page.fill('input[placeholder*="Company name"]', 'Test Company');
    await page.fill('textarea[placeholder*="Description"]', 'A test company for demonstration');
    await page.selectOption('select[name="industry"]', 'technology');
    await page.fill('input[placeholder*="Website"]', 'https://testcompany.com');
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Company registration submitted')).toBeVisible();
  });

  test('should display notifications', async ({ page }) => {
    await expect(page.locator('[data-testid="notifications"]')).toBeVisible();
    await expect(page.locator('text=Notifications')).toBeVisible();
  });

  test('should handle navigation between sections', async ({ page }) => {
    // Test navigation to different sections
    await page.click('text=My Companies');
    await expect(page.url()).toContain('/companies');
    
    await page.click('text=Profile');
    await expect(page.url()).toContain('/profile');
    
    await page.click('text=Network');
    await expect(page.url()).toContain('/network');
  });
});
