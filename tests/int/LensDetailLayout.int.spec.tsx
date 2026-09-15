// @vitest-environment node
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import tailwindcss from '@tailwindcss/postcss'
import { chromium } from '@playwright/test'
import postcss from 'postcss'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'

import { LensCategoryChips } from '@/app/(frontend)/lens/[slug]/LensCategoryChips'
import { LensDigitalPurchase } from '@/app/(frontend)/lens/[slug]/LensDigitalPurchase'
import { LensHero } from '@/app/(frontend)/lens/[slug]/LensHero'
import { LensTechnicalMeta } from '@/app/(frontend)/lens/[slug]/LensTechnicalMeta'
import zoomStyles from '@/app/(frontend)/lens/[slug]/LensZoomImage.module.css'
import { DetailInfoPanel, DetailInfoSection } from '@/components/DetailInfo'
import frameStyles from '@/components/LensPhotoFrame/LensPhotoFrame.module.css'
import type { Category, Media } from '@/payload-types'

vi.mock('next/image', () => ({
  default: ({ alt, className, src, style }: { alt: string; className: string; src: string; style: object }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={className}
      src={src}
      style={{ height: '100%', inset: 0, position: 'absolute', width: '100%', ...style }}
    />
  ),
}))

function scopeModuleCSS(source: string, classes: Record<string, string>) {
  return Object.entries(classes).reduce(
    (css, [localName, scopedName]) => css.replaceAll(`.${localName}`, `.${scopedName}`),
    source,
  )
}

it('balances and stacks the Lens detail header at shared review widths', async () => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1067" height="1600"><rect width="100%" height="100%" fill="#0b171b"/><circle cx="540" cy="650" r="380" fill="#196879"/><path d="M0 1250 Q350 980 620 1220 T1067 1080 V1600 H0Z" fill="#050809"/></svg>'
  const photo: Media = {
    alt: 'Diver beneath the surface',
    createdAt: '',
    height: 1600,
    id: 1,
    mimeType: 'image/svg+xml',
    updatedAt: '',
    url: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    width: 1067,
  }
  const categories: Category[] = [
    { createdAt: '', id: 1, slug: 'underwater', title: 'Underwater', updatedAt: '' },
  ]
  const technicalMetadata = {
    aperture: 'f/2.8',
    camera: 'Sony A7R V underwater housing',
    focalLength: '90mm',
    iso: 640,
    lens: 'Sony FE 90mm F2.8 Macro G OSS',
    shutterSpeed: '1/250s',
  }
  const markup = renderToStaticMarkup(
    <main className="lens-detail-page detail-page bg-site-surface-deep text-site-text-primary">
      <section className="site-container py-12">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_clamp(22rem,28vw,26rem)] lg:gap-10 xl:gap-14">
          <LensHero
            photo={photo}
            title="Between Light and Water"
          />
          <aside className="w-full min-w-0" data-testid="lens-primary-info">
            <DetailInfoPanel variant="editorial">
              <DetailInfoSection className="py-4">
                <LensCategoryChips categories={categories} />
                <h1 className="mt-3 text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] md:text-4xl xl:text-[2.5rem]">
                  Between Light and Water
                </h1>
                <p className="site-caption mt-3 text-site-text-muted uppercase">
                  Anilao, Philippines · 2026
                </p>
                <p className="mt-5 text-[0.9375rem] leading-[1.7] text-site-text-secondary md:text-base">
                  A quiet encounter below the surface, photographed in shifting natural light.
                </p>
              </DetailInfoSection>
              <LensTechnicalMeta metadata={technicalMetadata} />
              <LensDigitalPurchase
                commercialLicensingEnabled
                digitalCheckoutUrl="https://example.com/checkout"
                digitalCurrency="EUR"
                digitalDimensions="7952 × 5304 px"
                digitalFileSize="24 MB"
                digitalFormat="JPEG"
                digitalLicenseType="Personal use"
                digitalPrice={45}
                digitalPurchaseEnabled
              />
            </DetailInfoPanel>
          </aside>
        </div>
      </section>
    </main>,
  )
  const cssPath = path.resolve('src/app/(frontend)/globals.css')
  const css = await postcss([tailwindcss()]).process(await readFile(cssPath, 'utf8'), {
    from: cssPath,
  })
  const frameCSS = scopeModuleCSS(
    await readFile('src/components/LensPhotoFrame/LensPhotoFrame.module.css', 'utf8'),
    frameStyles,
  )
  const zoomCSS = scopeModuleCSS(
    await readFile('src/app/(frontend)/lens/[slug]/LensZoomImage.module.css', 'utf8'),
    zoomStyles,
  )
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage()
    await mkdir('test-results', { recursive: true })

    for (const viewport of [
      { height: 900, width: 1440 },
      { height: 1024, width: 768 },
      { height: 844, width: 390 },
    ]) {
      await page.setViewportSize(viewport)
      await page.setContent(
        `<html data-theme="dark"><head><style>${css.css}\n${frameCSS}\n${zoomCSS}\nbody { margin: 0; --font-geist-sans: Arial; --font-geist-mono: monospace; }</style></head><body>${markup}</body></html>`,
      )

      const frame = page.locator('[data-detail-frame="true"]')
      const info = page.getByTestId('lens-primary-info')
      const panel = info.locator('[data-detail-info-panel="true"]')
      const technical = page.getByTestId('lens-technical-metadata')
      const purchase = page.getByTestId('lens-digital-purchase')
      const zoomHint = page.locator('[data-lens-zoom-hint="true"]')

      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      expect(
        await technical.evaluate((node) =>
          Boolean(node.closest('[data-detail-info-panel="true"]')),
        ),
      ).toBe(true)
      expect(
        await purchase.evaluate((node) =>
          Boolean(node.closest('[data-detail-info-panel="true"]')),
        ),
      ).toBe(true)

      const frameBounds = await frame.boundingBox()
      const panelBounds = await panel.boundingBox()
      expect(frameBounds).not.toBeNull()
      expect(panelBounds).not.toBeNull()
      expect(await frame.getAttribute('data-photo-frame-variant')).toBe('editorial')
      expect(await frame.textContent()).not.toContain('Between Light and Water')
      expect(await frame.textContent()).not.toContain('Anilao')
      expect(await frame.textContent()).not.toContain('Sony A7R V')
      expect(await frame.textContent()).not.toContain('Erik')
      expect(await frame.evaluate((node, hint) => node.contains(hint), await zoomHint.elementHandle())).toBe(false)
      expect(
        await frame.evaluate((node) => getComputedStyle(node, '::before').content),
      ).toBe('none')
      expect(frameBounds!.width / frameBounds!.height).toBeCloseTo(1067 / 1600, 2)

      if (viewport.width >= 1024) {
        expect(Math.abs(frameBounds!.y - panelBounds!.y)).toBeLessThanOrEqual(1)
        expect(panelBounds!.height / frameBounds!.height).toBeGreaterThanOrEqual(0.85)
        expect(panelBounds!.height / frameBounds!.height).toBeLessThanOrEqual(1.16)
      } else {
        expect(panelBounds!.y).toBeGreaterThanOrEqual(frameBounds!.y + frameBounds!.height)
      }

      await page.screenshot({
        fullPage: true,
        path: `test-results/detail-header-lens-${viewport.width}.png`,
      })
    }
  } finally {
    await browser.close()
  }
}, 60_000)
