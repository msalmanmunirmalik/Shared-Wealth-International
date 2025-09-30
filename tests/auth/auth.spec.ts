import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Welcome Back');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('should switch to signup form', async ({ page }) => {
    await page.click('text=Create Account');
    await expect(page.locator('h2')).toContainText('Create Your Account');
    await expect(page.locator('input[placeholder*="Enter your first name"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Enter your last name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Create Account with Profile');
  });

  test('should show enhanced signup form with profile fields', async ({ page }) => {
    await page.click('text=Create Account');
    
    // Check for profile picture upload
    await expect(page.locator('text=Profile Picture')).toBeVisible();
    
    // Check for professional information section
    await expect(page.locator('text=Professional Information')).toBeVisible();
    await expect(page.locator('input[placeholder*="e.g., CEO, Director"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Your company name"]')).toBeVisible();
    
    // Check for location and links section
    await expect(page.locator('text=Location & Links')).toBeVisible();
    await expect(page.locator('input[placeholder*="City, Country"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="https://linkedin.com"]')).toBeVisible();
    
    // Check for role selection
    await expect(page.locator('text=Role in Shared Wealth')).toBeVisible();
    await expect(page.locator('[role="combobox"]')).toBeVisible();
  });

  test('should validate required fields in signup', async ({ page }) => {
    await page.click('text=Create Account');
    await page.click('button[type="submit"]');
    
    // Should show validation errors for required fields
    await expect(page.locator('input[placeholder*="Enter your first name"]')).toHaveAttribute('required');
    await expect(page.locator('input[placeholder*="Enter your last name"]')).toHaveAttribute('required');
    await expect(page.locator('input[type="email"]')).toHaveAttribute('required');
    await expect(page.locator('input[placeholder*="Create a strong password"]')).toHaveAttribute('required');
  });

  test('should show password confirmation validation', async ({ page }) => {
    await page.click('text=Create Account');
    
    await page.fill('input[placeholder*="Create a strong password"]', 'testpassword123');
    await page.fill('input[placeholder*="Confirm your password"]', 'differentpassword');
    
    await page.click('button[type="submit"]');
    
    // Should prevent form submission due to password mismatch
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should handle invalid login credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Failed to sign in')).toBeVisible();
  });

  test('should navigate to user dashboard after successful login', async ({ page }) => {
    // This test would need valid credentials or mock the API
    await page.fill('input[type="email"]', 'admin@sharedwealth.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await page.waitForURL('/user-dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
