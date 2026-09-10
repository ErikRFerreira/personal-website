import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProjectArchiveItem } from '@/components/ProjectArchiveItem'
import type { Media, Project } from '@/payload-types'

vi.mock('next/image', () => ({
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className={className} src={src} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

type ArchiveProject = Pick<
  Project,
  'description' | 'image' | 'slug' | 'tech' | 'title' | 'type' | 'year'
>

function makeMedia(overrides: Partial<Media> = {}): Media {
  return {
    alt: 'Project preview',
    createdAt: '2026-01-01T00:00:00.000Z',
    height: 900,
    id: 1,
    updatedAt: '2026-01-01T00:00:00.000Z',
    url: '/media/project.jpg',
    width: 1600,
    ...overrides,
  }
}

function makeProject(overrides: Partial<ArchiveProject> = {}): ArchiveProject {
  return {
    description: 'A focused description of the project.',
    image: makeMedia(),
    slug: 'project-one',
    tech: [{ id: 'react', techName: 'React' }],
    title: 'Project One',
    type: 'web-app',
    year: 2026,
    ...overrides,
  }
}

describe('ProjectArchiveItem', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      }),
    )
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the first project with its image on the right and content first on desktop', () => {
    const { container } = render(
      <ProjectArchiveItem index={0} project={makeProject()} total={3} />,
    )

    const card = container.querySelector('[data-project-card="true"]')
    const frame = container.querySelector('[data-project-frame="true"]')
    const content = container.querySelector('[data-project-content="true"]')

    expect(card?.getAttribute('data-project-layout')).toBe('image-right')
    expect(frame?.className).toContain('order-1')
    expect(frame?.className).toContain('lg:order-2')
    expect(content?.className).toContain('order-2')
    expect(content?.className).toContain('lg:order-1')
    expect(container.querySelector('[data-project-corner="top-right"]')).not.toBeNull()
  })

  it('alternates the second project and renders complete archive metadata and technologies', () => {
    const technologies = ['Next.js', 'TypeScript', 'PostgreSQL']
    const { container } = render(
      <ProjectArchiveItem
        index={1}
        project={makeProject({
          tech: technologies.map((techName) => ({ techName })),
          type: 'mobile-app',
        })}
        total={4}
      />,
    )

    expect(
      container.querySelector('[data-project-card="true"]')?.getAttribute('data-project-layout'),
    ).toBe('image-left')
    expect(container.querySelector('[data-project-frame="true"]')?.className).toContain(
      'lg:order-1',
    )
    expect(container.querySelector('[data-project-content="true"]')?.className).toContain(
      'lg:order-2',
    )
    expect(container.querySelector('[data-project-corner="top-left"]')).not.toBeNull()
    expect(screen.getByText('02 / 04 // MOBILE_APP // 2026')).not.toBeNull()
    expect(technologies.every((technology) => screen.getByText(technology))).toBe(true)
  })

  it('uses the fixed media treatment, image alt fallback, and CTA-only navigation', () => {
    const { container } = render(
      <ProjectArchiveItem
        index={0}
        project={makeProject({ image: makeMedia({ alt: null }) })}
        total={1}
      />,
    )

    const media = container.querySelector('[data-project-media="true"]')
    const image = screen.getByRole('img', { name: 'Project One' })
    const overlay = container.querySelector('[data-project-image-overlay="true"]')
    const links = screen.getAllByRole('link')

    expect(media?.className).toContain('aspect-[16/10]')
    expect(image.className).toContain('group-hover:scale-105')
    expect(image.className).toContain('motion-reduce:transform-none')
    expect(overlay?.className).toContain('group-hover:opacity-0')
    expect(links).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Read Case Study/i }).getAttribute('href')).toBe(
      '/projects/project-one',
    )
  })

  it('keeps the two-column media frame and shows a placeholder without an image', () => {
    const { container } = render(
      <ProjectArchiveItem index={0} project={makeProject({ image: null })} total={3} />,
    )

    expect(container.querySelector('[data-project-media="true"]')).not.toBeNull()
    expect(container.querySelector('[data-project-frame="true"]')).not.toBeNull()
    expect(screen.getByRole('img', { name: 'Project One preview unavailable' })).not.toBeNull()
    expect(screen.getByText('Preview unavailable')).not.toBeNull()
    expect(container.querySelector('article')?.className).toContain(
      'motion-reduce:transition-none',
    )
  })
})
