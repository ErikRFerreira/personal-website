import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can load homepage', async ({ page }) => {
    const browserErrors: string[] = []
    page.on('pageerror', (error) => browserErrors.push(error.message))

    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Payload Website Template/)
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
    await expect(heading).not.toHaveText('')

    const blocks = page.locator('[data-block-type]')
    const blockCount = await blocks.count()

    if (blockCount > 1) {
      await expect(blocks.nth(1)).toHaveAttribute('data-deferred', 'true')
      await blocks.last().scrollIntoViewIfNeeded()
    }

    expect(browserErrors).toEqual([])
  })
})
