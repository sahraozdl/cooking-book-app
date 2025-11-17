import { test, expect } from '@playwright/test';

const CATEGORY_ID = '1dStWuGTEokpH097KbpZ';
const FILTER_NAME = 'Categories';
const CATEGORY_NAME = 'Starter';

test.describe('Navbar Filters Integration Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders recipes matching filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click();

    await page.getByTestId(`${FILTER_NAME}`).click();

    const starterCheckbox = page.getByTestId(`filter-${CATEGORY_ID}`);
    await starterCheckbox.waitFor({ state: 'visible' });
    await starterCheckbox.check();
    await page.keyboard.press('Escape');

    const entries = page.locator('[data-testid="entry-card"]');
    await entries.first().waitFor({ state: 'attached' });

    const fullRecipeLink = entries.first().getByTestId('view-full-recipe-link');
    await fullRecipeLink.waitFor({ state: 'visible' });

    await fullRecipeLink.click();

    await expect(page.locator(`text=${CATEGORY_NAME}`)).toBeVisible();
  });
});
