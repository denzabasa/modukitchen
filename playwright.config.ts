import { defineConfig, devices } from '@playwright/test'
import { loadTestEnvironment } from './tests/helpers/testEnv'

loadTestEnvironment()

const baseURL = 'http://localhost:3001'

export default defineConfig({
  testDir: './tests/e2e',

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
    },
  ],

  webServer: {
    command: 'pnpm dev --port 3001',
    reuseExistingServer: false,
    url: baseURL,
    timeout: 120_000,
    env: {
      DATABASE_URL: process.env.DATABASE_URL!,
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET!,
    },
  },
})
