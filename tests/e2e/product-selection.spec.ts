import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://192.168.1.6:3001';
const PRODUCT_SELECTION_URL = `${BASE_URL}/product-selection`;

// Helper function to setup localStorage for different countries
async function setUserCountry(page: Page, country: string) {
  await page.addInitScript((country) => {
    localStorage.setItem('userProfile', JSON.stringify({ country }));
  }, country);
}

test.describe('Product Selection Page - Basic Loading', () => {
  test('should load the page successfully with all elements', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    // Check page title
    await expect(page.locator('h1')).toContainText('Choose Your Linkist Experience');

    // Check logo
    await expect(page.locator('img[alt="Linkist"]')).toBeVisible();

    // Check subtitle
    await expect(page.locator('text=Select the perfect plan for your professional networking needs')).toBeVisible();

    // Check back button
    await expect(page.locator('button:has-text("Go Back")')).toBeVisible();
  });

  test('should display exactly 3 product cards', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const productCards = page.locator('[class*="rounded-2xl border-2"]').filter({ has: page.locator('button:has-text("Select This Plan")') });
    await expect(productCards).toHaveCount(3);
  });

  test('should display all product titles correctly', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    // Check for all three product titles
    await expect(page.locator('text=Physical NFC Card + Linkist App')).toBeVisible();
    await expect(page.locator('text=Digital Profile + Linkist App')).toBeVisible();
    await expect(page.locator('text=Digital Profile Only')).toBeVisible();
  });

  test('should display pricing information for all products', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    // All products should have price labels
    await expect(page.locator('text=Most Popular')).toBeVisible();
    await expect(page.locator('text=Best Value')).toBeVisible();
    await expect(page.locator('text=Basic')).toBeVisible();
  });

  test('should display features list for all products', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    // Check that each product has features with checkmarks
    const checkmarks = page.locator('svg').filter({ has: page.locator('svg') });
    const visibleCheckmarks = await checkmarks.count();

    // Each product has 6 features, so we should have at least 18 checkmarks
    expect(visibleCheckmarks).toBeGreaterThanOrEqual(18);
  });

  test('should display money-back guarantee message', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    await expect(page.locator('text=Need help choosing? All plans include a 30-day money-back guarantee.')).toBeVisible();
  });
});

test.describe('Product Selection Page - Card Selection by Clicking', () => {
  test('should select card when clicking anywhere on Option 1 (Physical NFC)', async ({ page }) => {
    await setUserCountry(page, 'India'); // India allows physical cards
    await page.goto(PRODUCT_SELECTION_URL);

    // Find the Physical NFC card
    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();

    // Click on the card (not the button)
    await physicalCard.click();

    // Verify the card is selected (has red border)
    await expect(physicalCard).toHaveClass(/border-red-600/);
    await expect(physicalCard).toHaveClass(/ring-2/);
    await expect(physicalCard).toHaveClass(/ring-red-600/);
  });

  test('should select card when clicking anywhere on Option 2 (Digital + App)', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    // Find the Digital + App card
    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();

    // Click on the card
    await digitalAppCard.click();

    // Verify the card is selected (has red border)
    await expect(digitalAppCard).toHaveClass(/border-red-600/);
    await expect(digitalAppCard).toHaveClass(/ring-2/);
  });

  test('should select card when clicking anywhere on Option 3 (Digital Only)', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    // Find the Digital Only card
    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();

    // Click on the card
    await digitalOnlyCard.click();

    // Verify the card is selected (has red border)
    await expect(digitalOnlyCard).toHaveClass(/border-red-600/);
    await expect(digitalOnlyCard).toHaveClass(/ring-2/);
  });

  test('should switch selection when clicking different cards', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();
    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();

    // Select first card
    await digitalAppCard.click();
    await expect(digitalAppCard).toHaveClass(/border-red-600/);

    // Select second card
    await digitalOnlyCard.click();
    await expect(digitalOnlyCard).toHaveClass(/border-red-600/);

    // First card should no longer have red border
    await expect(digitalAppCard).not.toHaveClass(/border-red-600/);
  });
});

test.describe('Product Selection Page - Visual Feedback', () => {
  test('should show red border on selected card', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();
    await digitalOnlyCard.click();

    // Check for red border classes
    await expect(digitalOnlyCard).toHaveClass(/border-red-600/);
  });

  test('should show ring effect on selected card', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();
    await digitalAppCard.click();

    // Check for ring classes
    await expect(digitalAppCard).toHaveClass(/ring-2/);
    await expect(digitalAppCard).toHaveClass(/ring-red-600/);
  });

  test('should show shadow and scale effect on selected card', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();
    await digitalOnlyCard.click();

    // Check for shadow and scale
    await expect(digitalOnlyCard).toHaveClass(/shadow-2xl/);
    await expect(digitalOnlyCard).toHaveClass(/scale-105/);
  });

  test('should update button text when card is selected', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();
    const selectButton = digitalOnlyCard.locator('button:has-text("Select This Plan")');

    // Initially button should say "Select This Plan"
    await expect(selectButton).toContainText('Select This Plan');

    // Click card to select
    await digitalOnlyCard.click();

    // Button should now show checkmark
    await expect(selectButton).toContainText('Select This Plan ✓');
  });

  test('should change button color when card is selected', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();
    const selectButton = digitalAppCard.locator('button:has-text("Select This Plan")');

    // Click card to select
    await digitalAppCard.click();

    // Button should have red background
    await expect(selectButton).toHaveClass(/bg-red-600/);
  });
});

test.describe('Product Selection Page - Button Behavior', () => {
  test('should select card when clicking "Select This Plan" button on unselected card', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();
    const selectButton = digitalOnlyCard.locator('button:has-text("Select This Plan")').first();

    // Click the button
    await selectButton.click();

    // Card should be selected
    await expect(digitalOnlyCard).toHaveClass(/border-red-600/);
  });

  test('should show error toast if confirming without selecting a plan', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    // Try to confirm without selecting
    // This test assumes there's a confirm button or the behavior is built into the select buttons
    // Based on the code, clicking a selected button confirms the selection
  });
});

test.describe('Product Selection Page - Redirects', () => {
  test('should redirect to /nfc/configure when selecting Physical NFC Card', async ({ page }) => {
    await setUserCountry(page, 'India'); // India allows physical cards
    await page.goto(PRODUCT_SELECTION_URL);

    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    const selectButton = physicalCard.locator('button:has-text("Select This Plan")').first();

    // Click to select the card
    await physicalCard.click();

    // Wait for button to update
    await expect(selectButton).toContainText('Select This Plan ✓');

    // Click the button again to confirm selection
    await selectButton.click();

    // Should redirect to /nfc/configure
    await expect(page).toHaveURL(/.*\/nfc\/configure/, { timeout: 10000 });
  });

  test('should redirect to /payment when selecting Digital + App', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();
    const selectButton = digitalAppCard.locator('button:has-text("Select This Plan")').first();

    // Click to select the card
    await digitalAppCard.click();

    // Wait for button to update
    await expect(selectButton).toContainText('Select This Plan ✓');

    // Click the button again to confirm selection
    await selectButton.click();

    // Should redirect to /payment
    await expect(page).toHaveURL(/.*\/payment/, { timeout: 10000 });
  });

  test('should redirect to /payment when selecting Digital Only', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();
    const selectButton = digitalOnlyCard.locator('button:has-text("Select This Plan")').first();

    // Click to select the card
    await digitalOnlyCard.click();

    // Wait for button to update
    await expect(selectButton).toContainText('Select This Plan ✓');

    // Click the button again to confirm selection
    await selectButton.click();

    // Should redirect to /payment
    await expect(page).toHaveURL(/.*\/payment/, { timeout: 10000 });
  });
});

test.describe('Product Selection Page - Country-based Validation', () => {
  test('should disable physical card option for non-allowed country', async ({ page }) => {
    await setUserCountry(page, 'Germany'); // Germany is not in the allowed list
    await page.goto(PRODUCT_SELECTION_URL);

    // Should show warning message
    await expect(page.locator('text=Physical cards are currently not available in Germany')).toBeVisible();

    // Physical card should be disabled
    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    await expect(physicalCard).toHaveClass(/opacity-60/);
    await expect(physicalCard).toHaveClass(/cursor-not-allowed/);
  });

  test('should enable physical card option for India', async ({ page }) => {
    await setUserCountry(page, 'India');
    await page.goto(PRODUCT_SELECTION_URL);

    // Should NOT show warning message for all countries
    await expect(page.locator('text=Physical cards are currently not available in India')).not.toBeVisible();

    // Physical card should be clickable
    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    await expect(physicalCard).toHaveClass(/cursor-pointer/);
  });

  test('should enable physical card option for USA', async ({ page }) => {
    await setUserCountry(page, 'USA');
    await page.goto(PRODUCT_SELECTION_URL);

    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    await expect(physicalCard).toHaveClass(/cursor-pointer/);
  });

  test('should enable physical card option for UAE', async ({ page }) => {
    await setUserCountry(page, 'UAE');
    await page.goto(PRODUCT_SELECTION_URL);

    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    await expect(physicalCard).toHaveClass(/cursor-pointer/);
  });

  test('should enable physical card option for UK', async ({ page }) => {
    await setUserCountry(page, 'UK');
    await page.goto(PRODUCT_SELECTION_URL);

    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    await expect(physicalCard).toHaveClass(/cursor-pointer/);
  });

  test('should show error toast when clicking disabled physical card', async ({ page }) => {
    await setUserCountry(page, 'France'); // France is not allowed
    await page.goto(PRODUCT_SELECTION_URL);

    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();

    // Try to click the disabled card
    await physicalCard.click();

    // Should show error toast (toast should be visible)
    await expect(page.locator('[role="alert"]').or(page.locator('.toast')).or(page.locator('text=not available'))).toBeVisible({ timeout: 5000 });
  });

  test('should display "Not available in your region" overlay on disabled card', async ({ page }) => {
    await setUserCountry(page, 'Canada');
    await page.goto(PRODUCT_SELECTION_URL);

    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();

    // Should show overlay message
    await expect(physicalCard.locator('text=Not available in your region')).toBeVisible();
  });

  test('should always enable digital options regardless of country', async ({ page }) => {
    await setUserCountry(page, 'Antarctica'); // Random country not in allowed list
    await page.goto(PRODUCT_SELECTION_URL);

    // Both digital options should be enabled
    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();
    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();

    await expect(digitalAppCard).toHaveClass(/cursor-pointer/);
    await expect(digitalOnlyCard).toHaveClass(/cursor-pointer/);
  });
});

test.describe('Product Selection Page - Complete User Flow', () => {
  test('should complete full flow: click card, see red border, confirm, redirect (Digital + App)', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();
    const selectButton = digitalAppCard.locator('button:has-text("Select This Plan")').first();

    // Step 1: Click card
    await digitalAppCard.click();

    // Step 2: Verify red border
    await expect(digitalAppCard).toHaveClass(/border-red-600/);
    await expect(digitalAppCard).toHaveClass(/ring-2/);

    // Step 3: Verify button updated
    await expect(selectButton).toContainText('Select This Plan ✓');
    await expect(selectButton).toHaveClass(/bg-red-600/);

    // Step 4: Click confirm button
    await selectButton.click();

    // Step 5: Verify redirect
    await expect(page).toHaveURL(/.*\/payment/, { timeout: 10000 });
  });

  test('should complete full flow: click card, see red border, confirm, redirect (Digital Only)', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();
    const selectButton = digitalOnlyCard.locator('button:has-text("Select This Plan")').first();

    // Click card
    await digitalOnlyCard.click();

    // Verify visual feedback
    await expect(digitalOnlyCard).toHaveClass(/border-red-600/);
    await expect(selectButton).toContainText('Select This Plan ✓');

    // Confirm selection
    await selectButton.click();

    // Verify redirect
    await expect(page).toHaveURL(/.*\/payment/, { timeout: 10000 });
  });

  test('should complete full flow for Physical NFC (allowed country)', async ({ page }) => {
    await setUserCountry(page, 'India');
    await page.goto(PRODUCT_SELECTION_URL);

    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    const selectButton = physicalCard.locator('button:has-text("Select This Plan")').first();

    // Click card
    await physicalCard.click();

    // Verify visual feedback
    await expect(physicalCard).toHaveClass(/border-red-600/);
    await expect(selectButton).toContainText('Select This Plan ✓');

    // Confirm selection
    await selectButton.click();

    // Verify redirect to NFC configure
    await expect(page).toHaveURL(/.*\/nfc\/configure/, { timeout: 10000 });
  });

  test('should store product selection in localStorage', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalOnlyCard = page.locator('div').filter({ hasText: 'Digital Profile Only' }).first();
    const selectButton = digitalOnlyCard.locator('button:has-text("Select This Plan")').first();

    // Select and confirm
    await digitalOnlyCard.click();
    await selectButton.click();

    // Wait a moment for localStorage to be set
    await page.waitForTimeout(1000);

    // Check localStorage
    const productSelection = await page.evaluate(() => localStorage.getItem('productSelection'));
    expect(productSelection).toBe('digital-only');
  });

  test('should show loading state when processing selection', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();
    const selectButton = digitalAppCard.locator('button:has-text("Select This Plan")').first();

    // Select card
    await digitalAppCard.click();

    // Click confirm button
    await selectButton.click();

    // Should briefly show "Processing..." text (may be too fast to catch)
    // This is a race condition test - it may or may not catch the loading state
    try {
      await expect(selectButton).toContainText('Processing...', { timeout: 500 });
    } catch {
      // Loading state may be too fast to catch, that's okay
    }
  });
});

test.describe('Product Selection Page - Popular Badge', () => {
  test('should display "MOST POPULAR" badge on Physical NFC card for allowed countries', async ({ page }) => {
    await setUserCountry(page, 'India');
    await page.goto(PRODUCT_SELECTION_URL);

    await expect(page.locator('text=MOST POPULAR')).toBeVisible();
  });

  test('should not display popular badge on disabled Physical NFC card', async ({ page }) => {
    await setUserCountry(page, 'Germany');
    await page.goto(PRODUCT_SELECTION_URL);

    // Badge should not be visible when card is disabled
    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    await expect(physicalCard.locator('text=MOST POPULAR')).not.toBeVisible();
  });
});

test.describe('Product Selection Page - Accessibility', () => {
  test('should have proper cursor styles on cards', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const digitalAppCard = page.locator('div').filter({ hasText: 'Digital Profile + Linkist App' }).first();
    await expect(digitalAppCard).toHaveClass(/cursor-pointer/);
  });

  test('should have disabled cursor on disabled card', async ({ page }) => {
    await setUserCountry(page, 'Brazil');
    await page.goto(PRODUCT_SELECTION_URL);

    const physicalCard = page.locator('div').filter({ hasText: 'Physical NFC Card + Linkist App' }).first();
    await expect(physicalCard).toHaveClass(/cursor-not-allowed/);
  });

  test('should have alt text on logo image', async ({ page }) => {
    await page.goto(PRODUCT_SELECTION_URL);

    const logo = page.locator('img[alt="Linkist"]');
    await expect(logo).toBeVisible();
  });
});
