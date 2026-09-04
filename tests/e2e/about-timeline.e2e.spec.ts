import { expect, test } from '@playwright/test'

test.describe('About timeline', () => {
  test('keeps the LineSidebar independently scrollable with a visible left scrollbar', async ({
    page,
  }) => {
    test.setTimeout(60_000)
    const browserErrors: string[] = []
    page.on('pageerror', (error) => browserErrors.push(error.message))
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' })

    const timeline = page.getByTestId('about-timeline')
    const scrollRegion = page.getByTestId('about-timeline-scroll-region')
    const navigation = page.getByRole('navigation', { name: 'Timeline milestone navigation' })
    const buttons = navigation.getByRole('button')

    await expect(timeline).toBeVisible()
    await timeline.scrollIntoViewIfNeeded()
    await expect(scrollRegion).toHaveAttribute('data-lenis-prevent', 'true')
    expect(await buttons.count()).toBeGreaterThan(5)

    const initialState = await scrollRegion.evaluate((element) => {
      const styles = getComputedStyle(element)
      const webkitScrollbar = getComputedStyle(element, '::-webkit-scrollbar')

      return {
        canScroll: element.scrollHeight > element.clientHeight,
        contentDirection: getComputedStyle(element.firstElementChild!).direction,
        direction: styles.direction,
        scrollTop: element.scrollTop,
        scrollbarVisible:
          styles.scrollbarWidth !== 'none' &&
          webkitScrollbar.display !== 'none' &&
          Number.parseFloat(webkitScrollbar.width) > 0,
      }
    })

    expect(initialState.canScroll).toBe(true)
    expect(initialState.direction).toBe('rtl')
    expect(initialState.contentDirection).toBe('ltr')
    expect(initialState.scrollbarVisible).toBe(true)
    await page.waitForTimeout(500)
    expect(browserErrors).toEqual([])
    await expect
      .poll(() => scrollRegion.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(0)
    const initialScrollTop = await scrollRegion.evaluate((element) => element.scrollTop)
    await expect(buttons.last()).toHaveAttribute('aria-pressed', 'true')
    await expect(buttons.last().locator('.scroll-reveal-word')).toHaveCount(0)
    expect(
      await buttons
        .last()
        .locator('.line-sidebar__text')
        .evaluate((element) => getComputedStyle(element).filter),
    ).toBe('none')

    const pageScrollBefore = await page.evaluate(() => window.scrollY)
    await scrollRegion.hover()
    await page.mouse.wheel(0, -400)
    await expect
      .poll(() => scrollRegion.evaluate((element) => element.scrollTop))
      .toBeLessThan(initialScrollTop)
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - pageScrollBefore)).toBeLessThan(2)

    await scrollRegion.evaluate((element) => {
      element.scrollTop = 0
    })
    await buttons.first().click()

    const panelId = await buttons.first().getAttribute('aria-controls')
    const firstButtonId = await buttons.first().getAttribute('id')

    if (!panelId || !firstButtonId) throw new Error('Timeline ARIA relationship is incomplete')

    await expect(buttons.first()).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator(`[id="${panelId}"]`)).toHaveAttribute(
      'aria-labelledby',
      firstButtonId,
    )

    await page.setViewportSize({ height: 844, width: 390 })
    await page.reload({ waitUntil: 'domcontentloaded' })

    const mobileButton = page
      .getByRole('navigation', { name: 'Timeline milestone navigation' })
      .getByRole('button')
      .first()
    const mobileGeometry = await mobileButton.evaluate((element) => ({
      buttonHeight: element.getBoundingClientRect().height,
      markerWidth: Number.parseFloat(
        getComputedStyle(element.querySelector('.line-sidebar__marker')!).width,
      ),
    }))

    expect(mobileGeometry.buttonHeight).toBeGreaterThanOrEqual(44)
    expect(mobileGeometry.markerWidth).toBeLessThanOrEqual(44)
  })
})
