// @vitest-environment node
import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { chromium } from '@playwright/test'
import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'
import { expect, it, vi } from 'vitest'
import { ProjectDetail } from '@/app/(frontend)/projects/[slug]/ProjectDetail'
import projectStyles from '@/app/(frontend)/projects/[slug]/ProjectDetail.module.css'
import { Footer } from '@/Footer/Component'
import { SelectedProjectsBlock } from '@/blocks/SelectedProjects/Component'
import { AboutIntroBlock } from '@/blocks/AboutIntro/Component'
import type { Project } from '@/payload-types'

vi.mock('@/components/ShapeGrid/Lazy', () => ({ default: () => null }))
vi.mock('@/utilities/getGlobals', () => ({ getCachedGlobal: () => async () => ({ navItems: [] }) }))
vi.mock('@/blocks/Code/Component', () => ({ CodeBlock: () => null }))
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
    fill,
  }: {
    src: string
    alt: string
    width: number
    height: number
    className: string
    fill?: boolean
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : undefined}
    />
  ),
}))

it('lays out mixed screenshots without cropping or overflow and respects reduced motion', async () => {
  const layouts = ['full', 'half', 'half', 'half', 'full', 'split'] as const
  const project: Project = {
    id: 1,
    title: 'Preview',
    slug: 'preview',
    status: 'published',
    createdAt: '',
    updatedAt: '',
    gallerySubtitle: 'Core interfaces and workflows',
    gallery: layouts.map((layout, index) => {
      const landscape = index === 4 || index === 2
      const width = landscape ? 1440 : 390
      const height = landscape ? 900 : 844
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#102a30"/><rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="12" fill="none" stroke="#00f2ff"/><text x="40" y="100" fill="#f2f2ef" font-size="30">Screen ${index + 1}</text></svg>`
      return {
        id: String(index),
        title: `Interface ${index + 1}`,
        layout,
        image: {
          id: index + 1,
          createdAt: '',
          updatedAt: '',
          width,
          height,
          mimeType: 'image/svg+xml',
          url: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
        },
        description: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'A clear explanation of the interface and the workflow it supports. '.repeat(
                      index === 5 ? 8 : 2,
                    ),
                    format: 0,
                    detail: 0,
                    mode: 'normal',
                    style: '',
                  },
                ],
              },
            ],
          },
        },
      }
    }),
  }
  const cssPath = path.resolve('src/app/(frontend)/globals.css')
  const css = await postcss([tailwindcss()]).process(await readFile(cssPath, 'utf8'), {
    from: cssPath,
  })
  const fade = await readFile('src/components/RevealOnScroll/fade.css', 'utf8')
  project.description =
    'A focused product for dependable calculations, clear records, and readable workflows.'
  project.role = 'Product Design and Development'
  project.type = 'mobile-app'
  project.year = 2026
  project.tech = [
    { techName: 'React Native, Expo, TypeScript, NativeWind, AsyncStorage, Internationalization' },
  ]
  project.links = [{ label: 'View project', url: 'https://example.com' }]
  project.image = project.gallery![4].image
  project.showcaseImage = project.gallery![4].image
  project.showcaseTitle = 'Product interface'
  project.showcaseSubtitle = 'Designed for clarity'
  const paragraph = project.gallery![0].description.root.children[0]
  project.content = {
    root: {
      ...project.gallery![0].description.root,
      children: [
        { ...paragraph, type: 'heading', tag: 'h2' },
        paragraph,
        { type: 'quote', version: 1, children: paragraph.children },
        paragraph,
      ],
    },
  }
  const buttonCss = await readFile('src/components/SpecularButton/SpecularButton.css', 'utf8')
  const pageCss = (
    await readFile('src/app/(frontend)/projects/[slug]/ProjectDetail.module.css', 'utf8')
  )
    .replaceAll('.page', `.${projectStyles.page}`)
    .replaceAll('.sections', `.${projectStyles.sections}`)
    .replace(':global(.payload-richtext)', '.payload-richtext')
  const markup = renderToStaticMarkup(
    <>
      <ProjectDetail
        project={project}
        nextProject={{
          id: 2,
          slug: 'next',
          title: 'A longer project name for testing navigation wrapping',
        }}
      />
      {await Footer()}
    </>,
  )
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await mkdir('test-results', { recursive: true })
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.setContent(
        `<html data-theme="dark"><head><style>${css.css}\n${fade}\n${buttonCss}\n${pageCss}\nbody { background: var(--site-surface-deep); --font-geist-sans: Arial; --font-geist-mono: monospace; }</style></head><body>${markup}</body></html>`,
      )
      await page
        .locator('img')
        .evaluateAll(async (images) =>
          Promise.all(images.map((image) => (image as HTMLImageElement).decode())),
        )
      const figures = await page.locator('[data-gallery-layout]').evaluateAll((nodes) =>
        nodes.map((node) => {
          const { x, y, width, height } = node.getBoundingClientRect()
          return { x, y, width, height }
        }),
      )
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      if (width >= 1024) {
        expect(figures[1].y).toBe(figures[2].y)
        expect(figures[2].x).toBeGreaterThan(figures[1].x)
        expect(figures[3].x).toBe(figures[1].x)
        expect(figures[4].y).toBeGreaterThan(figures[3].y + figures[3].height)
      } else {
        for (let index = 1; index < figures.length; index++)
          expect(figures[index].y).toBeGreaterThan(figures[index - 1].y)
      }
      const imageMetrics = await page.locator('[data-gallery-layout] img').evaluateAll((nodes) =>
        nodes.map((node) => {
          const image = node as HTMLImageElement
          const rect = image.getBoundingClientRect()
          return {
            width: rect.width,
            height: rect.height,
            ratio: image.naturalWidth / image.naturalHeight,
          }
        }),
      )
      for (const image of imageMetrics) {
        expect(image.height).toBeLessThanOrEqual(640)
        expect(image.width / image.height).toBeCloseTo(image.ratio, 2)
      }
      if (width >= 1024) {
        const pairedCaptions = await page
          .locator('[data-gallery-layout="half"] figcaption')
          .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().y))
        expect(pairedCaptions[0]).toBe(pairedCaptions[1])
      }
      const stack = page
        .locator('dl > div')
        .filter({ has: page.locator('dt', { hasText: 'Stack' }) })
      const metadata = page.locator('dl')
      expect((await stack.boundingBox())!.width).toBe((await metadata.boundingBox())!.width)
      const context = page.locator('[data-project-content]')
      expect((await context.boundingBox())!.width).toBeLessThanOrEqual(672)
      expect(
        await context.locator('blockquote').evaluate((node) => ({
          border: getComputedStyle(node).borderLeftWidth,
          background: getComputedStyle(node).backgroundColor,
          inset: getComputedStyle(node).paddingLeft,
        })),
      ).toEqual({ border: '1px', background: 'rgba(0, 0, 0, 0)', inset: '20px' })
      const expectedGap = width < 768 ? 72 : width < 1024 ? 96 : 120
      const sections = await page.locator('article > *').evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect()
          return { top: rect.top, bottom: rect.bottom }
        }),
      )
      expect(sections[1].top - sections[0].bottom).toBe(width < 1024 ? 40 : 56)
      for (let index = 2; index < sections.length; index++) {
        expect(sections[index].top - sections[index - 1].bottom).toBeCloseTo(expectedGap, 0)
      }
      const backLink = page.getByRole('link', { name: 'Back to Projects', exact: true })
      await backLink.focus()
      expect(await backLink.evaluate((node) => getComputedStyle(node).outlineWidth)).toBe('2px')
      const nextLink = page.getByRole('link', { name: /Next Project/ })
      await nextLink.focus()
      expect(await nextLink.evaluate((node) => getComputedStyle(node).outlineWidth)).toBe('2px')
      await nextLink.evaluate((node) => (node as HTMLElement).blur())
      const split = page.locator('[data-gallery-layout="split"]')
      expect(await split.evaluate((node) => node.firstElementChild?.tagName)).toBe('FIGCAPTION')
      const caption = await split.locator('figcaption').boundingBox()
      const image = await split.locator('img').boundingBox()
      if (width >= 1024) expect(caption!.x).toBeLessThan(image!.x)
      else expect(caption!.y + caption!.height).toBeLessThan(image!.y)
      await page.screenshot({
        path: `test-results/project-details-${process.env.PROJECT_PREVIEW_PHASE || 'refined'}-${width}.png`,
        fullPage: true,
      })
    }
    const referenceMarkup = renderToStaticMarkup(
      <>
        <SelectedProjectsBlock projects={[project]} />
        <AboutIntroBlock
          blockType="aboutIntro"
          eyebrow="About"
          headlineLineOne="Thoughtful design."
          headlineLineTwo="Dependable implementation."
          bio={project.description}
          portrait={project.gallery![0].image}
        />
      </>,
    )
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.setContent(
      `<html data-theme="dark"><head><style>${css.css}\n${fade}\n${buttonCss}\nbody { --font-geist-sans: Arial; --font-geist-mono: monospace; }</style></head><body>${referenceMarkup}</body></html>`,
    )
    await page.screenshot({
      path: 'test-results/project-details-site-reference.png',
      fullPage: true,
    })
    const minimalProject = {
      ...project,
      title: 'A long project title to check narrow screen wrapping',
      image: null,
      showcaseImage: null,
      content: null,
      gallery: [],
    }
    await page.setViewportSize({ width: 390, height: 900 })
    await page.setContent(
      `<html data-theme="dark"><head><style>${css.css}\n${fade}\n${buttonCss}\n${pageCss}</style></head><body>${renderToStaticMarkup(<ProjectDetail project={minimalProject} />)}</body></html>`,
    )
    expect(await page.locator('article > *').count()).toBe(2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const remaining = await page
      .locator('article > *')
      .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()))
    expect(remaining[1].top - remaining[0].bottom).toBeCloseTo(72, 0)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page
      .locator('.reveal-on-scroll')
      .evaluateAll((nodes) =>
        nodes.forEach((node) => node.setAttribute('data-reveal-state', 'hidden')),
      )
    expect(
      await page
        .locator('.reveal-on-scroll')
        .evaluateAll((nodes) =>
          nodes.every(
            (node) =>
              getComputedStyle(node).opacity === '1' &&
              getComputedStyle(node).transitionDuration === '0s',
          ),
        ),
    ).toBe(true)
  } finally {
    await browser.close()
  }
}, 60000)
