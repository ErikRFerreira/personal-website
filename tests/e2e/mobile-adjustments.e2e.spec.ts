import { expect, test, type Page } from '@playwright/test'

const expectNoHorizontalOverflow = async (page: Page) => {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
      ),
    )
    .toBe(true)
}

test.describe('mobile layout refinements', () => {
  test('applies the mobile composition through 767px', async ({ page }) => {
    test.setTimeout(120_000)

    for (const width of [390, 767]) {
      await page.setViewportSize({ height: 900, width })
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })

      const profileFrame = page.getByTestId('profile-hero-media-frame')
      const expectedProfileHeight = Math.min(240, Math.max(192, width * 0.55))
      await expect(profileFrame).toBeVisible()
      await expect
        .poll(() => profileFrame.evaluate((element) => element.getBoundingClientRect().height))
        .toBeCloseTo(expectedProfileHeight, 0)

      const footerLayout = page.locator('footer > .container')
      await expect
        .poll(() =>
          footerLayout.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).paddingTop),
          ),
        )
        .toBe(80)
      await expect
        .poll(() => footerLayout.evaluate((element) => getComputedStyle(element).textAlign))
        .toBe('center')

      const homeBioContent = page.locator('[data-home-bio-content="true"]')
      if (await homeBioContent.count()) {
        await expect
          .poll(() => homeBioContent.evaluate((element) => getComputedStyle(element).textAlign))
          .toBe('center')
      }

      const revealSection = page.locator('[data-block-type="revealText"] > section').first()
      if (await revealSection.count()) {
        await expect
          .poll(() =>
            revealSection.evaluate((element) =>
              Number.parseFloat(getComputedStyle(element).paddingTop),
            ),
          )
          .toBe(128)
      }

      const disciplineCards = page.locator('[data-discipline-index]')
      if ((await disciplineCards.count()) > 1) {
        const heights = await disciplineCards.evaluateAll((cards) =>
          cards.map((card) => card.getBoundingClientRect().height),
        )
        expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1)
      }

      await expectNoHorizontalOverflow(page)

      await page.goto('http://localhost:3000/contact', { waitUntil: 'domcontentloaded' })
      const contactForm = page.locator('.contact-form').first()
      const contactFields = contactForm.locator('.form-field')
      await expect(contactFields.first()).toBeVisible()
      const formWidth = await contactForm.evaluate(
        (element) => element.getBoundingClientRect().width,
      )
      const fieldWidths = await contactFields.evaluateAll((fields) =>
        fields.map((field) => field.getBoundingClientRect().width),
      )
      fieldWidths.forEach((fieldWidth) => expect(fieldWidth).toBeCloseTo(formWidth, 0))
      await expectNoHorizontalOverflow(page)

      await page.goto('http://localhost:3000/projects', { waitUntil: 'domcontentloaded' })
      await expect
        .poll(() =>
          page
            .locator('main')
            .evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingTop)),
        )
        .toBe(144)

      await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' })
      await expect
        .poll(() =>
          page
            .getByTestId('about-hero')
            .locator('.site-container')
            .evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingTop)),
        )
        .toBe(157)
      await expectNoHorizontalOverflow(page)
    }
  })

  test('restores tablet sizing at 768px', async ({ page }) => {
    test.setTimeout(60_000)
    await page.setViewportSize({ height: 900, width: 768 })
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })

    await expect
      .poll(() =>
        page
          .getByTestId('profile-hero-media-frame')
          .evaluate((element) => element.getBoundingClientRect().height),
      )
      .toBeGreaterThan(240)
    await expect
      .poll(() =>
        page
          .locator('footer > .container')
          .evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingTop)),
      )
      .toBe(64)

    const revealSection = page.locator('[data-block-type="revealText"] > section').first()
    if (await revealSection.count()) {
      await expect
        .poll(() =>
          revealSection.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).paddingTop),
          ),
        )
        .toBe(256)
    }

    await page.goto('http://localhost:3000/contact', { waitUntil: 'domcontentloaded' })
    const contactForm = page.locator('.contact-form').first()
    const firstField = contactForm.locator('.form-field').first()
    const formWidth = await contactForm.evaluate((element) => element.getBoundingClientRect().width)
    const fieldWidth = await firstField.evaluate((element) => element.getBoundingClientRect().width)
    expect(fieldWidth).toBeCloseTo(formWidth * 0.5, 0)

    await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' })
    await expect
      .poll(() =>
        page
          .getByTestId('about-hero')
          .locator('.site-container')
          .evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingTop)),
      )
      .toBe(141)
  })
})
