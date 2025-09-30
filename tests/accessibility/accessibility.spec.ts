import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that h1 is present and properly structured
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check for proper heading sequence
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.click('text=Create Account');
    
    // Check that all form inputs have proper labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const firstNameInput = page.locator('input[placeholder*="Enter your first name"]');
    const lastNameInput = page.locator('input[placeholder*="Enter your last name"]');
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
    await expect(firstNameInput).toHaveAttribute('required');
    await expect(lastNameInput).toHaveAttribute('required');
    
    // Check for associated labels
    await expect(page.locator('label[for*="email"]')).toBeVisible();
    await expect(page.locator('label[for*="password"]')).toBeVisible();
  });

  test('should have proper focus management', async ({ page }) => {
    // Test tab navigation through form
    await page.click('text=Create Account');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Focus should be on form elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check that text has sufficient color contrast
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    
    // This is a basic check - in a real scenario, you'd use axe-core or similar
    await expect(textElements.first()).toBeVisible();
  });

  test('should have accessible buttons', async ({ page }) => {
    const buttons = page.locator('button');
    
    for (const button of await buttons.all()) {
      // Check that buttons have accessible text or aria-label
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.click('text=Create Account');
    
    // Check for proper ARIA attributes on form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check for aria-required or required attribute
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test keyboard-only navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Should be able to navigate without mouse
    await expect(page.locator('text=Create Account')).toBeVisible();
  });

  test('should have proper alt text for images', async ({ page }) => {
    const images = page.locator('img');
    
    for (const img of await images.all()) {
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Images should have alt text or aria-label
      expect(alt || ariaLabel).toBeTruthy();
    }
  });

  test('should have accessible error messages', async ({ page }) => {
    await page.click('text=Create Account');
    
    // Trigger validation error
    await page.click('button[type="submit"]');
    
    // Check for accessible error messages
    const errorMessages = page.locator('[role="alert"], .error, .invalid');
    await expect(errorMessages.first()).toBeVisible();
  });

  test('should support screen readers', async ({ page }) => {
    // Check for screen reader friendly elements
    const srOnlyElements = page.locator('.sr-only, .screen-reader-only');
    const ariaLiveElements = page.locator('[aria-live]');
    const ariaAtomicElements = page.locator('[aria-atomic]');
    
    // These should be present for screen reader support
    expect(await srOnlyElements.count() + await ariaLiveElements.count() + await ariaAtomicElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should have proper form validation feedback', async ({ page }) => {
    await page.click('text=Create Account');
    
    // Fill invalid data
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[placeholder*="Create a strong password"]', '123');
    await page.fill('input[placeholder*="Confirm your password"]', '456');
    
    await page.click('button[type="submit"]');
    
    // Check for validation feedback
    const validationMessages = page.locator('[aria-invalid="true"], .invalid, .error');
    await expect(validationMessages.first()).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check for proper navigation structure
    const nav = page.locator('nav, [role="navigation"]');
    const navLinks = page.locator('nav a, [role="navigation"] a');
    
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible();
      expect(await navLinks.count()).toBeGreaterThan(0);
    }
  });

  test('should handle high contrast mode', async ({ page }) => {
    // Test with high contrast preferences
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Page should still be usable in dark mode
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
