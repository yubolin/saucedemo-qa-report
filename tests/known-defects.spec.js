// Regression checks that document defects found during exploratory testing.
// They are marked test.fail(): they pass while the bug is present and will flag when it gets fixed.
const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');
test('BUG-01 problem_user: product images should be unique', async ({ page }) => {
  test.fail();
  await login(page, 'problem_user');
  const srcs = await page.locator('.inventory_item_img img').evaluateAll((a) => a.map((i) => i.getAttribute('src')));
  expect(new Set(srcs).size).toBe(6);
});
test('BUG-03 problem_user: last name field keeps typed value', async ({ page }) => {
  test.fail();
  await login(page, 'problem_user');
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('First Name').fill('Ann');
  await page.getByPlaceholder('Last Name').fill('Lee');
  await expect(page.getByPlaceholder('Last Name')).toHaveValue('Lee');
});
test('BUG-06 standard_user: checkout with empty cart should be blocked', async ({ page }) => {
  test.fail();
  await login(page);
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/cart/);
});
