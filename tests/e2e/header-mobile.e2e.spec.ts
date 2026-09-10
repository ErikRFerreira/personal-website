import { expect, test } from '@playwright/test'

test.describe('responsive header navigation', () => {
  test('opens, dismisses, and navigates from the mobile menu', async ({ page }) => {
    test.setTimeout(60_000)
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

    const toggle = page.locator('button[aria-controls="mobile-header-menu"]')
    const menu = page.getByTestId('mobile-header-menu')

    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(menu).toHaveAttribute('data-state', 'closed')

    await toggle.click()

    await expect(toggle).toHaveAccessibleName('Close menu')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(menu).toHaveAttribute('data-state', 'open')
    await expect(menu.getByRole('link').first()).toBeFocused()
    expect(
      await menu
        .getByRole('navigation')
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).rowGap)),
    ).toBeGreaterThanOrEqual(32)
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
    await expect
      .poll(async () => (await menu.boundingBox())?.x)
      .toBe(0)
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
        ),
      )
      .toBe(true)

    await page.keyboard.press('Escape')
    await expect(menu).toHaveAttribute('data-state', 'closed')
    await expect(toggle).toBeFocused()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')

    await toggle.click()
    const internalLink = menu.locator('a[href^="/"]:not([href="/"])').first()
    const destination = await internalLink.getAttribute('href')
    await internalLink.click()

    await expect(page).toHaveURL(new RegExp(`${destination?.replaceAll('/', '\\/')}/?$`), {
      timeout: 15_000,
    })
    await expect(menu).toHaveAttribute('data-state', 'closed')
  })

  test('uses the desktop navigation at the small breakpoint and above', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1024 })
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden()
    await expect(page.locator('header nav')).toBeVisible()
    await expect(page.getByTestId('mobile-header-menu')).toBeHidden()
  })

  test('removes the drawer transition when reduced motion is requested', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

    const menu = page.getByTestId('mobile-header-menu')
    await page.getByRole('button', { name: 'Open menu' }).click()

    await expect
      .poll(() => menu.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toBe('0s')
  })
})
