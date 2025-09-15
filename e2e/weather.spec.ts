import { test, expect } from '@playwright/test';

test.describe('Weather App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/'); // adjust port if different
  });

  test('should render search bar and allow typing', async ({ page }) => {
    const input = page.getByPlaceholder('Enter city name');
    await expect(input).toBeVisible();

    await input.fill('Wellington');
    await expect(input).toHaveValue('Wellington');
  });

  test('should search and display weather card', async ({ page }) => {
    await page.getByPlaceholder('Enter city name').fill('Wellington');
    await page.getByRole('button', { name: 'Search' }).click();

    // Wait for weather card
    const weatherCard = page.getByTestId('weather-card');
    await expect(weatherCard).toBeVisible({ timeout: 15000 });

    // Location heading should show city
    await expect(weatherCard.getByRole('heading')).toContainText('Wellington');
  });

  test('should change selected day when clicking DayTile', async ({ page }) => {
    await page.getByPlaceholder('Enter city name').fill('Wellington');
    await page.getByRole('button', { name: 'Search' }).click();

    const weatherCard = page.getByTestId('weather-card');
    await expect(weatherCard).toBeVisible({ timeout: 15000 });

    const tiles = page.getByTestId('day-tile');
    const count = await tiles.count();
    expect(count).toBeGreaterThan(1);

    const firstTile = tiles.first();
    await firstTile.click();

    // Verify the active style is applied
    await expect(firstTile).toHaveClass(/bg-\[#507487\]/);
  });

  test('should show error if API fails', async ({ page }) => {
    // Intercept API to simulate error
    await page.route('**/current**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ success: false, error: { info: 'API down' } }),
      });
    });

    await page.getByPlaceholder('Enter city name').fill('NowhereLand');
    await page.getByRole('button', { name: 'Search' }).click();

    // Expect error message visible
    await expect(page.getByText(/API down/i)).toBeVisible();
  });
});
