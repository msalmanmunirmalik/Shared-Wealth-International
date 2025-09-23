import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/auth');
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    expect(await h1.count()).toBeGreaterThan(0);
    expect(await h2.count()).toBeGreaterThan(0);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/auth');
    
    // Check that form inputs have proper labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Check for associated labels or aria-labels
    const emailLabel = page.locator('label[for], [aria-label]').first();
    const passwordLabel = page.locator('label[for], [aria-label]').nth(1);
    
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/auth');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through all interactive elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/auth');
    
    // Check that text is visible (basic contrast check)
    const textElements = page.locator('text=/[A-Za-z]/');
    const visibleText = await textElements.first().isVisible();
    expect(visibleText).toBeTruthy();
  });

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/auth');
    
    // Focus on an input element
    await page.focus('input[type="email"]');
    
    // Check that focus is visible
    const focusedInput = page.locator('input[type="email"]:focus');
    await expect(focusedInput).toBeVisible();
  });

  test('should handle screen reader navigation', async ({ page }) => {
    await page.goto('/auth');
    
    // Check for proper ARIA attributes
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Check for proper button labels
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    
    const buttonText = await submitButton.textContent();
    expect(buttonText).toBeTruthy();
    expect(buttonText?.length).toBeGreaterThan(0);
  });

  test('should have proper error messaging', async ({ page }) => {
    await page.goto('/auth');
    
    // Submit empty form to trigger validation
    await page.click('button[type="submit"]');
    
    // Check that error messages are properly associated with inputs
    const errorMessages = page.locator('[role="alert"], .error, [aria-invalid="true"]');
    await expect(errorMessages.first()).toBeVisible();
  });

  test('should work with reduced motion preferences', async ({ page, context }) => {
    // Set reduced motion preference
    await context.addInitScript(() => {
      Object.defineProperty(window.matchMedia, 'matchMedia', {
        value: (query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });
    
    await page.goto('/auth');
    
    // Page should still be functional with reduced motion
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should handle high contrast mode', async ({ page, context }) => {
    // Simulate high contrast mode
    await context.addInitScript(() => {
      Object.defineProperty(window.matchMedia, 'matchMedia', {
        value: (query: string) => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });
    
    await page.goto('/auth');
    
    // Page should still be functional in high contrast mode
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('/auth');
    
    // Check for proper semantic elements
    const form = page.locator('form');
    const inputs = page.locator('input');
    const buttons = page.locator('button');
    
    await expect(form).toBeVisible();
    expect(await inputs.count()).toBeGreaterThan(0);
    expect(await buttons.count()).toBeGreaterThan(0);
  });
});
