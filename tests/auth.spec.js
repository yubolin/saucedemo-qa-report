const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');
test('standard user can log in and log out', async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/inventory/);
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByText('Logout').click();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
test('locked out user sees an error', async ({ page }) => {
  await login(page, 'locked_out_user');
  await expect(page.locator('[data-test=error]')).toContainText('locked out');
});
test('empty credentials are rejected', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('[data-test=error]')).toContainText('Username is required');
});
test('inventory is protected without a session', async ({ page }) => {
  await page.goto('/inventory.html');
  await expect(page.locator('[data-test=error]')).toContainText('when you are logged in');
});
