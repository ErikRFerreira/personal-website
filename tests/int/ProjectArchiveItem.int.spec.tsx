import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatProjectsArchiveDetail } from '@/app/(frontend)/projects/formatArchiveDetail'
import { ProjectArchiveItem } from '@/components/ProjectArchiveItem'
import type { Media, Project } from '@/payload-types'

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
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

  it('renders a linked, text-led composition without reserving media space', () => {
    const { container } = render(
      <ProjectArchiveItem index={0} project={makeProject({ image: null })} total={3} />,
    )

    expect(container.querySelector('[data-project-media="true"]')).toBeNull()
    expect(screen.getByRole('link', { name: /Project One/i }).getAttribute('href')).toBe(
      '/projects/project-one',
    )
    expect(container.querySelector('[data-project-index="true"]')?.textContent).toBe('01 / 03')
  })

  it('clamps media aspect ratios and falls back to 16:9 dimensions', () => {
    const { container, rerender } = render(
      <ProjectArchiveItem
        index={0}
        project={makeProject({ image: makeMedia({ height: 600, width: 1800 }) })}
        total={1}
      />,
    )

    const getAspectRatio = () =>
      (container.querySelector('[data-project-media="true"]') as HTMLElement).style.aspectRatio

    expect(getAspectRatio()).toBe(String(21 / 9))

    rerender(
      <ProjectArchiveItem
        index={0}
        project={makeProject({ image: makeMedia({ height: 1200, width: 800 }) })}
        total={1}
      />,
    )
    expect(getAspectRatio()).toBe(String(4 / 3))

    rerender(
      <ProjectArchiveItem
        index={0}
        project={makeProject({ image: makeMedia({ height: null, width: null }) })}
        total={1}
      />,
    )
    expect(getAspectRatio()).toBe(String(16 / 9))
  })

  it('uses the title as image alt fallback and keeps technologies separately wrappable', () => {
    const technologies = ['Next.js', 'React', 'TypeScript', 'PostgreSQL']
    const { container } = render(
      <ProjectArchiveItem
        index={1}
        project={makeProject({
          image: makeMedia({ alt: null }),
          tech: technologies.map((techName) => ({ techName })),
        })}
        total={4}
      />,
    )

    expect(screen.getByRole('img', { name: 'Project One' })).not.toBeNull()
    expect(container.querySelector('article')?.className).toContain('lg:w-[92%]')
    expect(screen.getByText('02 / 04')).not.toBeNull()
    expect(technologies.every((technology) => screen.getByText(new RegExp(technology)))).toBe(true)
  })

  it('formats singular and plural archive details', () => {
    expect(formatProjectsArchiveDetail(1)).toBe('Selected work / 01 project')
    expect(formatProjectsArchiveDetail(3)).toBe('Selected work / 03 projects')
  })
})
