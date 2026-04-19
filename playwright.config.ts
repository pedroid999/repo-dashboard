import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev --filter dashboard',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
})
