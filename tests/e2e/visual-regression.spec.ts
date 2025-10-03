import { test, expect } from '@playwright/test';

const BASE_URL = 'http://192.168.1.6:3001';

/**
 * Visual Regression Tests
 * Takes screenshots of key pages for manual visual verification
 * Verifies that form inputs and text are visible across browsers
 */

// Helper to setup authenticated user
async function setupAuthenticatedUser(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem('userProfile', JSON.stringify({
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      country: 'India',
      phone: '+911234567890'
    }));
  });
}

test.describe('Visual Regression - Full Page Screenshots', () => {
  test('landing page screenshot', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/landing`);
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: `test-results/screenshots/landing-${browserName}.png`,
      fullPage: true
    });
  });

  test('registration page screenshot', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/register-${browserName}.png`,
      fullPage: true
    });
  });

  test('product selection page screenshot', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/product-selection`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/product-selection-${browserName}.png`,
      fullPage: true
    });
  });

  test('nfc configure page screenshot', async ({ page, browserName }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/configure`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/nfc-configure-${browserName}.png`,
      fullPage: true
    });
  });

  test('checkout page screenshot', async ({ page, browserName }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/checkout`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/checkout-${browserName}.png`,
      fullPage: true
    });
  });

  test('payment page screenshot', async ({ page, browserName }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/payment`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/payment-${browserName}.png`,
      fullPage: true
    });
  });

  test('profile builder page screenshot', async ({ page, browserName }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/profiles/builder`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/profile-builder-${browserName}.png`,
      fullPage: true
    });
  });
});

test.describe('Visual Regression - Form Element Focus', () => {
  test('registration form with focused input', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Focus on first input
    const firstInput = page.locator('input').first();
    await firstInput.focus();

    await page.screenshot({
      path: `test-results/screenshots/register-focused-input-${browserName}.png`,
      fullPage: false
    });
  });

  test('registration form with filled inputs', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Fill some inputs if they exist
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');
    }

    const textInputs = page.locator('input[type="text"]');
    if (await textInputs.count() > 0) {
      await textInputs.first().fill('Test User');
    }

    await page.screenshot({
      path: `test-results/screenshots/register-filled-inputs-${browserName}.png`,
      fullPage: false
    });
  });

  test('checkout form with all inputs filled', async ({ page, browserName }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/checkout`);
    await page.waitForLoadState('networkidle');

    // Fill various input types
    const inputs = page.locator('input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputs.nth(i);
      const type = await input.getAttribute('type');

      if (type === 'email') {
        await input.fill('test@example.com');
      } else if (type === 'tel') {
        await input.fill('+911234567890');
      } else {
        await input.fill('Test Value');
      }
    }

    await page.screenshot({
      path: `test-results/screenshots/checkout-filled-${browserName}.png`,
      fullPage: true
    });
  });
});

test.describe('Visual Regression - Button States', () => {
  test('product selection with button hover', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/product-selection`);
    await page.waitForLoadState('networkidle');

    // Find a select button and hover
    const selectButton = page.locator('button').filter({ hasText: /Select This Plan/i }).first();
    if (await selectButton.count() > 0) {
      await selectButton.hover();

      await page.screenshot({
        path: `test-results/screenshots/product-selection-button-hover-${browserName}.png`,
        fullPage: false
      });
    }
  });

  test('product selection with selected card', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/product-selection`);
    await page.waitForLoadState('networkidle');

    // Click on a card to select it
    const card = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();
    if (await card.count() > 0) {
      await card.click();

      await page.screenshot({
        path: `test-results/screenshots/product-selection-selected-${browserName}.png`,
        fullPage: true
      });
    }
  });
});

test.describe('Visual Regression - Mobile Views', () => {
  test('registration page mobile view', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/register-mobile-${browserName}.png`,
      fullPage: true
    });
  });

  test('product selection mobile view', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/product-selection`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/product-selection-mobile-${browserName}.png`,
      fullPage: true
    });
  });

  test('payment page mobile view', async ({ page, browserName }) => {
    await setupAuthenticatedUser(page);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/payment`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/payment-mobile-${browserName}.png`,
      fullPage: true
    });
  });
});

test.describe('Visual Regression - Dark Mode Override', () => {
  test('verify light mode is maintained even with dark color scheme', async ({ page, browserName }) => {
    // Set dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/register-dark-mode-override-${browserName}.png`,
      fullPage: true
    });

    // Verify that despite dark mode, inputs have white background
    const input = page.locator('input').first();
    if (await input.count() > 0) {
      const bgColor = await input.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      // Should still be white despite dark mode preference
      expect(bgColor).toMatch(/rgb\(255, 255, 255\)/);
    }
  });

  test('all pages should ignore OS dark mode', async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: 'dark' });

    const pages = [
      '/landing',
      '/register',
      '/product-selection'
    ];

    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState('networkidle');

      // Body should have white background
      const bodyBg = await page.evaluate(() =>
        window.getComputedStyle(document.body).backgroundColor
      );

      expect(bodyBg).toMatch(/rgb\(255, 255, 255\)/);

      await page.screenshot({
        path: `test-results/screenshots${pagePath}-dark-mode-${browserName}.png`,
        fullPage: true
      });
    }
  });
});

test.describe('Visual Regression - Specific Form Elements', () => {
  test('textarea elements visibility', async ({ page, browserName }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/configure`);
    await page.waitForLoadState('networkidle');

    const textareas = page.locator('textarea');
    const count = await textareas.count();

    if (count > 0) {
      const textarea = textareas.first();
      await textarea.fill('This is test content to verify text is visible in textarea elements');
      await textarea.focus();

      await page.screenshot({
        path: `test-results/screenshots/textarea-filled-${browserName}.png`,
        fullPage: false
      });
    }
  });

  test('select dropdown visibility', async ({ page, browserName }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/checkout`);
    await page.waitForLoadState('networkidle');

    const selects = page.locator('select');
    const count = await selects.count();

    if (count > 0) {
      const select = selects.first();
      await select.focus();

      await page.screenshot({
        path: `test-results/screenshots/select-focused-${browserName}.png`,
        fullPage: false
      });
    }
  });

  test('autofilled inputs visibility', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/register`);

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      // Fill to simulate autofill
      await emailInput.fill('autofilled@example.com');

      await page.screenshot({
        path: `test-results/screenshots/autofill-input-${browserName}.png`,
        fullPage: false
      });
    }
  });
});
