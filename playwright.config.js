const { defineConfig } = require('@playwright/test');

// Smoke tests against the real production build: run `npm run build` first,
// then `npm run test:e2e` — the config serves public/ via `gatsby serve`.
// Environments with a pre-installed browser can skip `playwright install`
// by pointing CHROMIUM_PATH at the executable.
module.exports = defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:9000',
    launchOptions: process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {},
  },
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:9000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
