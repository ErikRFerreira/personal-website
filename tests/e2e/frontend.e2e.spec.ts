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

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await expect(page).toHaveTitle(/Erik Fereira - Developer & Photographer/)
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
    await expect(heading).not.toHaveText('')
    await expect(page.locator('html')).toHaveClass(/lenis/)

    await page.mouse.wheel(0, 1000)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

    const wheelTo = async (selector: string) => {
      const target = page.locator(selector).first()
      const delta = await target.evaluate(
        (element) => element.getBoundingClientRect().top - window.innerHeight * 0.2,
      )

      await page.mouse.wheel(0, delta)
      await expect
        .poll(() =>
          target.evaluate((element) => {
            const rect = element.getBoundingClientRect()
            return rect.top < window.innerHeight && rect.bottom > 0
          }),
        )
        .toBe(true)
    }

    const expectReveal = async (selector: string) => {
      const target = page.locator(selector).first()
      if (!(await target.count())) return

      await wheelTo(selector)
      await expect(target).toHaveAttribute('data-reveal-state', 'visible')
    }

    const blocks = page.locator('[data-block-type]')
    const blockCount = await blocks.count()

    if (blockCount > 1) {
      await expect(blocks.nth(1)).toHaveAttribute('data-deferred', 'true')
    }

    await expectReveal('[data-block-type="selectedProjects"] [data-reveal-name="section-heading"]')
    await expectReveal('[data-block-type="selectedProjects"] [data-reveal-name="project-row"]')

    const projectLink = page
      .locator('[data-block-type="selectedProjects"] [data-reveal-name="project-row"] a')
      .first()
    if (await projectLink.count()) {
      await expect(projectLink).toHaveAttribute('href', /\/projects\//)
      await projectLink.hover()
    }

    await expectReveal('[data-block-type="capabilities"] [data-reveal-name="section-heading"]')
    await expectReveal('[data-block-type="capabilities"] [data-reveal-name="capability-card"]')

    const capabilityCard = page
      .locator('[data-block-type="capabilities"] .custom-spotlight-card')
      .first()
    if (await capabilityCard.count()) {
      await capabilityCard.hover()
      await expect(capabilityCard).toBeVisible()
    }

    const capabilityBlocks = page.locator('[data-block-type="capabilities"]')
    for (let index = 0; index < (await capabilityBlocks.count()); index += 1) {
      const capabilityBlock = capabilityBlocks.nth(index)
      const nextBlockType = await capabilityBlock.evaluate((element) =>
        element.nextElementSibling?.getAttribute('data-block-type'),
      )

      if (nextBlockType === 'revealText') {
        await expect(capabilityBlock).toHaveAttribute('data-transition-to', 'revealText')
      } else {
        await expect(capabilityBlock).not.toHaveAttribute('data-transition-to')
      }
    }

    const revealText = page.locator('[data-block-type="revealText"]')
    if (await revealText.count()) {
      await wheelTo('[data-block-type="revealText"]')
      await expect(revealText.locator('.word').first()).toBeVisible()

      const transitionClearance = await revealText.first().evaluate((element) => {
        const content = element.querySelector('section > div')
        const nextBlock = element.nextElementSibling

        if (!content || nextBlock?.getAttribute('data-block-type') !== 'lensBlock') return null

        return nextBlock.getBoundingClientRect().top - content.getBoundingClientRect().bottom
      })

      if (transitionClearance !== null) {
        expect(transitionClearance).toBeGreaterThanOrEqual(0)
      }
    }

    const lensBlock = page.locator('[data-block-type="lensBlock"]')
    if (await lensBlock.count()) {
      for (let index = 0; index < (await lensBlock.count()); index += 1) {
        const lens = lensBlock.nth(index)
        const previousBlockType = await lens.evaluate((element) =>
          element.previousElementSibling?.getAttribute('data-block-type'),
        )

        if (previousBlockType === 'revealText') {
          await expect(lens).toHaveAttribute('data-transition-from', 'revealText')
        } else {
          await expect(lens).not.toHaveAttribute('data-transition-from')
        }
      }

      await expectReveal('[data-block-type="lensBlock"] [data-reveal-name="section-heading"]')
      await expectReveal('[data-block-type="lensBlock"] [data-reveal-name="lens-photo"]')

      const lensLink = lensBlock.locator('[data-reveal-name="lens-photo"] a').first()
      await expect(lensLink).toHaveAttribute('href', /\/lens\//)
      await lensLink.hover({ force: true })

      const ambientLayer = lensBlock.first().locator('.lens-ambient-layer')
      await expect(ambientLayer).toHaveAttribute('aria-hidden', 'true')
      await expect(lensBlock.locator('canvas')).toHaveCount(0)
      await expect
        .poll(() => ambientLayer.evaluate((element) => getComputedStyle(element).animationName))
        .toBe('lens-ambient-pulse')

      await page.emulateMedia({ reducedMotion: 'reduce' })
      await expect
        .poll(() => ambientLayer.evaluate((element) => getComputedStyle(element).animationName))
        .toBe('none')
      await page.emulateMedia({ reducedMotion: 'no-preference' })
    }

    expect(browserErrors).toEqual([])
  })

  test('keeps Payload Admin on native scrolling', async ({ page }) => {
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' })

    await expect(page.locator('html')).not.toHaveClass(/lenis/)
  })
})
