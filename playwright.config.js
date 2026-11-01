const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({ testDir: 'tests', retries: 1, reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'https://www.saucedemo.com', screenshot: 'only-on-failure', trace: 'retain-on-failure' } });
