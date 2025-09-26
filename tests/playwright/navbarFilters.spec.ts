import { test, expect } from '@playwright/test';

test('NavbarFilters renders and allows interaction', async ({ page }) => {
  await page.setContent(`
    <div data-testid="navbar-filters">
      <label>
        <input type="checkbox" id="breakfast" /> Breakfast
      </label>
      <label>
        <input type="checkbox" id="lunch" /> Lunch
      </label>
    </div>
  `);
  const filterSection = page.getByTestId('navbar-filters');
  await expect(filterSection).toBeVisible();

  const breakfastCheckbox = page.getByLabel('Breakfast');
  await breakfastCheckbox.check();
  await expect(breakfastCheckbox).toBeChecked();

  const lunchCheckbox = page.getByLabel('Lunch');
  await lunchCheckbox.check();
  await expect(lunchCheckbox).toBeChecked();
});
