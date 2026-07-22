import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PPL_E2E_BASE_URL || 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  webServer: process.env.PPL_E2E_EXTERNAL === '1' ? undefined : {
    command: 'node tests/serve-dist.mjs',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
