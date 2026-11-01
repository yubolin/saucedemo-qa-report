const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');
const prices = async (page) => (await page.locator('.inventory_item_price').allTextContents()).map((p) => Number(p.slice(1)));
test.beforeEach(async ({ page }) => login(page));
test('shows 6 products', async ({ page }) => { await expect(page.locator('.inventory_item')).toHaveCount(6); });
test('sorts by price low to high', async ({ page }) => {
  await page.locator('[data-test=product-sort-container]').selectOption('lohi');
  const p = await prices(page); expect(p).toEqual([...p].sort((a, b) => a - b));
});
test('sorts by name Z to A', async ({ page }) => {
  await page.locator('[data-test=product-sort-container]').selectOption('za');
  const n = await page.locator('.inventory_item_name').allTextContents();
  expect(n).toEqual([...n].sort().reverse());
});
test('add and remove items updates cart badge', async ({ page }) => {
  await page.locator('[data-test^=add-to-cart]').first().click();
  await page.locator('[data-test^=add-to-cart]').first().click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  await page.locator('[data-test^=remove]').first().click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});
test('complete checkout with correct total', async ({ page }) => {
  await page.locator('[data-test=add-to-cart-sauce-labs-backpack]').click();
  await page.locator('[data-test=add-to-cart-sauce-labs-bike-light]').click();
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('First Name').fill('Ann');
  await page.getByPlaceholder('Last Name').fill('Lee');
  await page.getByPlaceholder('Zip/Postal Code').fill('100085');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $39.98');
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});
test('checkout requires first name', async ({ page }) => {
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('[data-test=error]')).toContainText('First Name is required');
});
