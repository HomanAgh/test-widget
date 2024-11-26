import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {
  test('should redirect unauthenticated users from / to /auth', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveURL('http://localhost:3000/auth');
    await expect(page.locator('h1')).toHaveText('Login');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await expect(page.locator('h1')).toHaveText('Login');
    await expect(page.locator('form')).toBeVisible();
  });

  test('should login and redirect to home page', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.fill('input[type="text"]', 'admin'); // Example username
    await page.fill('input[type="password"]', 'password123'); // Example password
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/home');
    await expect(page.locator('h1')).toHaveText('Welcome to the Home Page');
  });

  test('should navigate from home page to player search', async ({ page }) => {
    // Assume user is logged in
    await page.goto('http://localhost:3000/home');
    await page.click('button:has-text("Go to Player Search")');
    await expect(page).toHaveURL('http://localhost:3000/player');
    await expect(page.locator('h1')).toHaveText('Player Search');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.fill('input[type="text"]', 'invalidUser');
    await page.fill('input[type="password"]', 'wrongPassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('p')).toHaveText('Invalid credentials');
    await expect(page).toHaveURL('http://localhost:3000/auth'); // Ensure no redirection
  });
});
