import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  tsconfig: './tsconfig.playwright.json',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
    env: {
      NODE_ENV: 'development',
    },
  },
});
