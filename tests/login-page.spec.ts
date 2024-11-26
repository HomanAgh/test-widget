import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {
  test('should display login page', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3000/auth');

    // Check if the login form is visible
    await expect(page.locator('h1')).toHaveText('Login');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should login and redirect to player page', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3000/auth');

    // Fill in the login form
    await page.fill('input[type="text"]', 'admin'); // Example username
    await page.fill('input[type="password"]', 'password123'); // Example password

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify redirection to /player
    await expect(page).toHaveURL('http://localhost:3000/player');
    await expect(page.locator('h1')).toHaveText('Player Search');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3000/auth');

    // Fill in the login form with invalid credentials
    await page.fill('input[type="text"]', 'invalidUser');
    await page.fill('input[type="password"]', 'wrongPassword');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify error message is displayed
    await expect(page.locator('p')).toHaveText('Invalid credentials');
    await expect(page).toHaveURL('http://localhost:3000/auth'); // Ensure no redirection
  });
});
