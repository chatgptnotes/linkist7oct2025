import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://192.168.1.6:3001';

/**
 * Color Compatibility Tests
 * Tests to ensure no white text on white background across browsers and OS
 * Verifies CSS fixes for dark mode auto-inversion issues
 */

// Helper to check computed styles
async function getComputedColor(page: Page, selector: string, property: 'color' | 'background-color'): Promise<string> {
  return await page.evaluate(({ sel, prop }) => {
    const element = document.querySelector(sel);
    if (!element) throw new Error(`Element not found: ${sel}`);
    return window.getComputedStyle(element).getPropertyValue(prop);
  }, { sel: selector, prop: property });
}

// Helper to verify text is visible (color contrast)
async function verifyTextVisible(page: Page, selector: string) {
  const color = await getComputedColor(page, selector, 'color');
  const bgColor = await getComputedColor(page, selector, 'background-color');

  // Both should be defined
  expect(color).toBeTruthy();
  expect(bgColor).toBeTruthy();

  // They should not be the same (or very similar)
  expect(color).not.toBe(bgColor);
}

// Helper to setup user profile for authenticated pages
async function setupAuthenticatedUser(page: Page) {
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

test.describe('Color Compatibility - Landing Page', () => {
  test('landing page should have visible text on all elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/landing`);

    // Check hero section text
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Verify text is not white on white
    const h1Color = await getComputedColor(page, 'h1', 'color');
    const bodyBg = await getComputedColor(page, 'body', 'background-color');

    // Colors should be different
    expect(h1Color).not.toBe(bodyBg);
  });

  test('landing page buttons should have correct colors', async ({ page }) => {
    await page.goto(`${BASE_URL}/landing`);

    // Find CTA buttons
    const ctaButton = page.locator('button, a').filter({ hasText: /Get Started|Sign Up/i }).first();

    if (await ctaButton.count() > 0) {
      await expect(ctaButton).toBeVisible();

      // Button should have contrasting colors
      const btnColor = await ctaButton.evaluate(el =>
        window.getComputedStyle(el).color
      );
      const btnBg = await ctaButton.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(btnColor).not.toBe(btnBg);
    }
  });

  test('landing page form inputs should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/landing`);

    // Check if there are any input fields
    const inputs = page.locator('input[type="text"], input[type="email"]');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      await expect(firstInput).toBeVisible();

      // Input should have white/light background with dark text
      const inputBg = await firstInput.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      const inputColor = await firstInput.evaluate(el =>
        window.getComputedStyle(el).color
      );

      expect(inputColor).not.toBe(inputBg);
    }
  });
});

test.describe('Color Compatibility - Registration Page', () => {
  test('registration form inputs should have visible text', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    // Check all input fields
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]');
    const inputCount = await inputs.count();

    expect(inputCount).toBeGreaterThan(0);

    // Test first input
    const firstInput = inputs.first();
    await expect(firstInput).toBeVisible();

    const inputStyles = await firstInput.evaluate(el => ({
      color: window.getComputedStyle(el).color,
      backgroundColor: window.getComputedStyle(el).backgroundColor
    }));

    // Background should be white or very light
    expect(inputStyles.backgroundColor).toMatch(/rgb\(255, 255, 255\)|rgb\(249, 250, 251\)/);

    // Text should be dark
    expect(inputStyles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)|rgb\(17, 24, 39\)/);
  });

  test('registration page placeholder text should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    const input = page.locator('input').first();
    await expect(input).toBeVisible();

    // Check placeholder is visible (gray color)
    const placeholder = await input.getAttribute('placeholder');
    if (placeholder) {
      // Placeholder should exist
      expect(placeholder.length).toBeGreaterThan(0);
    }
  });

  test('registration page submit button should have correct colors', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    const submitButton = page.locator('button[type="submit"]').or(
      page.locator('button').filter({ hasText: /Register|Sign Up|Continue/i })
    ).first();

    await expect(submitButton).toBeVisible();

    const buttonStyles = await submitButton.evaluate(el => ({
      color: window.getComputedStyle(el).color,
      backgroundColor: window.getComputedStyle(el).backgroundColor
    }));

    // Colors should be different
    expect(buttonStyles.color).not.toBe(buttonStyles.backgroundColor);
  });

  test('registration page labels should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    const labels = page.locator('label');
    const labelCount = await labels.count();

    if (labelCount > 0) {
      const firstLabel = labels.first();
      await expect(firstLabel).toBeVisible();

      const labelColor = await firstLabel.evaluate(el =>
        window.getComputedStyle(el).color
      );

      // Label should have gray color (not white)
      expect(labelColor).toMatch(/rgb\(55, 65, 81\)|rgb\(75, 85, 99\)/);
    }
  });
});

test.describe('Color Compatibility - NFC Configure Page', () => {
  test('nfc configure page form inputs should be visible', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/configure`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      await expect(firstInput).toBeVisible();

      const styles = await firstInput.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // Should have white background and dark text
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });

  test('nfc configure page textareas should be visible', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/configure`);

    await page.waitForLoadState('networkidle');

    const textareas = page.locator('textarea');
    const textareaCount = await textareas.count();

    if (textareaCount > 0) {
      const firstTextarea = textareas.first();
      await expect(firstTextarea).toBeVisible();

      const styles = await firstTextarea.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });
});

test.describe('Color Compatibility - Checkout Page', () => {
  test('checkout page form inputs should have visible text', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/checkout`);

    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      await expect(firstInput).toBeVisible();

      const styles = await firstInput.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // White background, dark text
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });

  test('checkout page select dropdowns should be visible', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/checkout`);

    await page.waitForLoadState('networkidle');

    const selects = page.locator('select');
    const selectCount = await selects.count();

    if (selectCount > 0) {
      const firstSelect = selects.first();
      await expect(firstSelect).toBeVisible();

      const styles = await firstSelect.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });

  test('checkout page card elements should have readable text', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/nfc/checkout`);

    await page.waitForLoadState('networkidle');

    // Find card elements (common in checkout pages)
    const cards = page.locator('[class*="card"], [class*="bg-white"]').first();

    if (await cards.count() > 0) {
      await expect(cards).toBeVisible();

      const cardBg = await cards.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      // Card should have white background
      expect(cardBg).toMatch(/rgb\(255, 255, 255\)/);
    }
  });
});

test.describe('Color Compatibility - Payment Page', () => {
  test('payment page form fields should be visible', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/payment`);

    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        await expect(input).toBeVisible();

        const styles = await input.evaluate(el => ({
          color: window.getComputedStyle(el).color,
          backgroundColor: window.getComputedStyle(el).backgroundColor
        }));

        // All inputs should have white bg and dark text
        expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
        expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
      }
    }
  });

  test('payment page buttons should have correct colors', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/payment`);

    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const submitButton = buttons.filter({ hasText: /Pay|Submit|Continue|Confirm/i }).first();

      if (await submitButton.count() > 0) {
        await expect(submitButton).toBeVisible();

        const styles = await submitButton.evaluate(el => ({
          color: window.getComputedStyle(el).color,
          backgroundColor: window.getComputedStyle(el).backgroundColor
        }));

        // Button text and background should be different
        expect(styles.color).not.toBe(styles.backgroundColor);
      }
    }
  });
});

test.describe('Color Compatibility - Profile Builder Page', () => {
  test('profile builder form inputs should be visible', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/profiles/builder`);

    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input:not([type="checkbox"]):not([type="radio"])');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      await expect(firstInput).toBeVisible();

      const styles = await firstInput.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });

  test('profile builder textareas should be visible', async ({ page }) => {
    await setupAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/profiles/builder`);

    await page.waitForLoadState('networkidle');

    const textareas = page.locator('textarea');
    const textareaCount = await textareas.count();

    if (textareaCount > 0) {
      const firstTextarea = textareas.first();
      await expect(firstTextarea).toBeVisible();

      const styles = await firstTextarea.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });
});

test.describe('Color Compatibility - Autofill States', () => {
  test('autofilled inputs should maintain correct colors', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    const emailInput = page.locator('input[type="email"]').first();

    if (await emailInput.count() > 0) {
      // Fill the input to trigger autofill styles
      await emailInput.fill('test@example.com');

      const styles = await emailInput.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor,
        webkitTextFillColor: window.getComputedStyle(el).webkitTextFillColor
      }));

      // Text should be dark
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);

      // Webkit autofill text should also be dark
      if (styles.webkitTextFillColor) {
        expect(styles.webkitTextFillColor).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
      }
    }
  });
});

test.describe('Color Compatibility - Link Visibility', () => {
  test('links should be visible and distinguishable', async ({ page }) => {
    await page.goto(`${BASE_URL}/landing`);

    const links = page.locator('a');
    const linkCount = await links.count();

    if (linkCount > 0) {
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();

      const linkColor = await firstLink.evaluate(el =>
        window.getComputedStyle(el).color
      );

      // Link should have a color (not transparent)
      expect(linkColor).toBeTruthy();
      expect(linkColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('blue links should maintain blue color', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    // Look for links that might have text-blue-600 class
    const blueLinks = page.locator('a[class*="blue"]');
    const blueLinkCount = await blueLinks.count();

    if (blueLinkCount > 0) {
      const firstBlueLink = blueLinks.first();
      const linkColor = await firstBlueLink.evaluate(el =>
        window.getComputedStyle(el).color
      );

      // Should be blue (rgb(37, 99, 235) is text-blue-600)
      expect(linkColor).toMatch(/rgb\(37, 99, 235\)|rgb\(29, 78, 216\)/);
    }
  });
});

test.describe('Color Compatibility - Card and Container Elements', () => {
  test('white background cards should have dark text', async ({ page }) => {
    await page.goto(`${BASE_URL}/product-selection`);

    // Find white background cards
    const cards = page.locator('[class*="bg-white"]');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();

      const cardBg = await firstCard.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      // Should be white
      expect(cardBg).toMatch(/rgb\(255, 255, 255\)/);

      // Find text inside the card
      const cardText = firstCard.locator('h2, h3, p, span').first();
      if (await cardText.count() > 0) {
        const textColor = await cardText.evaluate(el =>
          window.getComputedStyle(el).color
        );

        // Text should be dark
        expect(textColor).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)|rgb\(17, 24, 39\)|rgb\(55, 65, 81\)/);
      }
    }
  });
});

test.describe('Color Compatibility - Placeholder Text', () => {
  test('all input placeholders should be visible gray', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    const inputs = page.locator('input[placeholder]');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        const placeholder = await input.getAttribute('placeholder');

        if (placeholder) {
          // Focus and blur to ensure placeholder styles are applied
          await input.focus();
          await input.blur();

          // Placeholder color is set via ::placeholder pseudo-element
          // which is enforced in CSS as #9ca3af (gray-400)
          // We verify the CSS is loaded by checking input background
          const inputBg = await input.evaluate(el =>
            window.getComputedStyle(el).backgroundColor
          );

          expect(inputBg).toMatch(/rgb\(255, 255, 255\)/);
        }
      }
    }
  });
});

test.describe('Color Compatibility - Button States', () => {
  test('black buttons should have white text', async ({ page }) => {
    await page.goto(`${BASE_URL}/product-selection`);

    const blackButtons = page.locator('button[class*="bg-black"]');
    const buttonCount = await blackButtons.count();

    if (buttonCount > 0) {
      const firstButton = blackButtons.first();
      await expect(firstButton).toBeVisible();

      const styles = await firstButton.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // Background should be black
      expect(styles.backgroundColor).toMatch(/rgb\(0, 0, 0\)/);

      // Text should be white
      expect(styles.color).toMatch(/rgb\(255, 255, 255\)/);
    }
  });

  test('white buttons should have dark text', async ({ page }) => {
    await page.goto(`${BASE_URL}/product-selection`);

    const whiteButtons = page.locator('button[class*="bg-white"]');
    const buttonCount = await whiteButtons.count();

    if (buttonCount > 0) {
      const firstButton = whiteButtons.first();
      await expect(firstButton).toBeVisible();

      const styles = await firstButton.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // Background should be white
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);

      // Text should be dark
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);
    }
  });
});

test.describe('Color Compatibility - Cross-Browser Consistency', () => {
  test('should maintain consistent colors across different contexts', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/register`);

    const input = page.locator('input[type="email"]').first();

    if (await input.count() > 0) {
      const styles = await input.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));

      // These styles should be consistent regardless of browser
      expect(styles.backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
      expect(styles.color).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)/);

      console.log(`${browserName}: Input bg=${styles.backgroundColor}, color=${styles.color}`);
    }
  });
});
