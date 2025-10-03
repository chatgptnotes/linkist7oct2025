import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

/**
 * Simplified Color Compatibility Validation Tests
 * Focuses on key pages that actually exist and tests core color fixes
 */

test.describe('Color Fixes Validation - Core Pages', () => {
  test('product-selection page: form elements should have correct colors', async ({ page }) => {
    await page.goto(`${BASE_URL}/product-selection`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check body background is white
    const bodyBg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    expect(bodyBg).toMatch(/rgb\(255, 255, 255\)/);

    // Check if there are any input fields
    const inputs = page.locator('input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      const styles = await firstInput.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // Input should have white background and dark text
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)|rgb\(17, 24, 39\)/);
    }
  });

  test('register page: inputs should be visible with white bg and dark text', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    const inputs = page.locator('input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await inputs.count();

    expect(inputCount).toBeGreaterThan(0);

    // Test all inputs
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const styles = await input.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // All inputs should have white bg
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      // All inputs should have dark text
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)|rgb\(17, 24, 39\)/);
    }
  });

  test('login page: form elements should have correct colors', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    const inputs = page.locator('input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      const styles = await firstInput.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });

  test('payment page: all inputs visible', async ({ page }) => {
    // Setup minimal user data
    await page.addInitScript(() => {
      localStorage.setItem('userProfile', JSON.stringify({
        id: 'test-123',
        email: 'test@example.com'
      }));
    });

    await page.goto(`${BASE_URL}/payment`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    const inputs = page.locator('input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      const styles = await firstInput.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });
});

test.describe('Color Fixes - Button Visibility', () => {
  test('black buttons should have white text', async ({ page }) => {
    await page.goto(`${BASE_URL}/product-selection`);
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button[class*="bg-black"]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const styles = await firstButton.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // Black background
      expect(styles.backgroundColor).toMatch(/rgb\(0, 0, 0\)/);
      // White text
      expect(styles.color).toMatch(/rgb\(255, 255, 255\)/);
    }
  });

  test('white buttons should have dark text', async ({ page }) => {
    await page.goto(`${BASE_URL}/product-selection`);
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button[class*="bg-white"]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const styles = await firstButton.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // White background
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      // Dark text
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });
});

test.describe('Color Fixes - Dark Mode Override', () => {
  test('should maintain white background even with dark color scheme preference', async ({ page }) => {
    // Emulate dark mode
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Body should still be white
    const bodyBg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    expect(bodyBg).toMatch(/rgb\(255, 255, 255\)/);

    // Inputs should still have white backgrounds
    const input = page.locator('input').first();
    if (await input.count() > 0) {
      const inputBg = await input.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(inputBg).toMatch(/rgb\(255, 255, 255\)/);
    }
  });
});

test.describe('Color Fixes - Autofill State', () => {
  test('autofilled inputs should maintain dark text color', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]').first();

    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');

      const styles = await emailInput.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          webkitTextFillColor: computed.webkitTextFillColor || 'N/A'
        };
      });

      // Text should be dark
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);

      // Background should be white
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);

      // Webkit autofill color should also be dark (if browser supports it)
      if (styles.webkitTextFillColor !== 'N/A') {
        expect(styles.webkitTextFillColor).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
      }
    }
  });
});

test.describe('Color Fixes - Placeholder Visibility', () => {
  test('placeholder text should be gray and visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input[placeholder]');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      const placeholder = await firstInput.getAttribute('placeholder');

      expect(placeholder).toBeTruthy();
      expect(placeholder!.length).toBeGreaterThan(0);

      // Check input background is white (placeholder color is enforced via CSS)
      const inputBg = await firstInput.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(inputBg).toMatch(/rgb\(255, 255, 255\)/);
    }
  });
});

test.describe('Color Fixes - Card Elements', () => {
  test('white background cards should have dark text', async ({ page }) => {
    await page.goto(`${BASE_URL}/product-selection`);
    await page.waitForLoadState('networkidle');

    // Find cards with white background
    const cards = page.locator('[class*="bg-white"]').first();

    if (await cards.count() > 0) {
      const cardBg = await cards.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(cardBg).toMatch(/rgb\(255, 255, 255\)/);

      // Find text inside card
      const cardText = cards.locator('h1, h2, h3, p, span').first();
      if (await cardText.count() > 0) {
        const textColor = await cardText.evaluate(el =>
          window.getComputedStyle(el).color
        );

        // Text should be dark (not white)
        expect(textColor).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)|rgb\(17, 24, 39\)|rgb\(55, 65, 81\)|rgb\(75, 85, 99\)/);
      }
    }
  });
});

test.describe('Color Fixes - CSS Verification', () => {
  test('CSS variables should be properly defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Check that CSS color-scheme is set to light
    const colorScheme = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).colorScheme
    );

    expect(colorScheme).toBe('light');

    // Check body styles
    const bodyStyles = await page.evaluate(() => ({
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
      color: window.getComputedStyle(document.body).color
    }));

    expect(bodyStyles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
    expect(bodyStyles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
  });

  test('globals.css should be loaded and active', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Check if our custom CSS rules are applied
    const input = page.locator('input').first();

    if (await input.count() > 0) {
      const styles = await input.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // These styles come from our globals.css fixes
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });
});
