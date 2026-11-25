import { test, expect } from '@playwright/test'
import type { Page, BrowserContext } from '@playwright/test'

import { login } from '../helpers/login'
import {
  seedTestUser,
  cleanupTestUser,
  testUser,
} from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page
  let context: BrowserContext

  test.beforeAll(async ({ browser, baseURL }) => {
    await seedTestUser()

    context = await browser.newContext({
      baseURL,
    })

    page = await context.newPage()

    await login({
      page,
      user: testUser,
      serverURL: baseURL,
    })
  })

  test.afterAll(async () => {
    try {
      await context?.close()
    } finally {
      await cleanupTestUser()
    }
  })

  test('can navigate to dashboard', async () => {
    await page.goto('/admin')

    await expect(page).toHaveURL('/admin')

    const dashboardArtifact = page
      .locator('span[title="Dashboard"]')
      .first()

    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto(
      '/admin/collections/users',
    )

    await expect(page).toHaveURL(
      /\/admin\/collections\/users\/?(\?.*)?$/,
    )

    const listViewArtifact = page
      .locator('h1', { hasText: 'Users' })
      .first()

    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to create view', async () => {
    await page.goto(
      '/admin/collections/users/create',
    )

    await expect(page).toHaveURL(
      /\/admin\/collections\/users\/create\/?$/,
    )

    const emailField = page.locator('input[name="email"]')

    await expect(emailField).toBeVisible()
  })
})
