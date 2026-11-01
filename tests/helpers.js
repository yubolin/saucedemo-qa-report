exports.login = async (page, user = 'standard_user') => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(user);
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
};
