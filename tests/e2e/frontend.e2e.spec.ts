import { test, expect } from '@playwright/test'

test.describe('ModuKitchen Frontend', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('can load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(
      /ModuKitchen \| Kitchens Designed for Living/,
    )

    await expect(
      page.getByRole('heading', { level: 1 }),
    ).toContainText('Beautiful kitchens,')

    await expect(
      page.getByRole('heading', { level: 1 }),
    ).toContainText('designed for living.')
  })

  test('displays the design system', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Our colour palette',
      }),
    ).toBeVisible()
  })

  test('can navigate to the design system', async ({ page }) => {
    await page
      .getByRole('link', {
        name: 'Explore our design system',
      })
      .click()

    await expect(page).toHaveURL(/#design-system$/)
  })

  test('provides access to the CMS dashboard', async ({ page }) => {
    await expect(
      page.getByRole('link', {
        name: 'CMS Dashboard',
      }),
    ).toHaveAttribute('href', '/admin')
  })
})
