import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  ProjectDetail,
  formatProjectType,
  getNextProject,
  hasProjectContent,
} from '@/app/(frontend)/projects/[slug]/ProjectDetail'
import type { Media, Project } from '@/payload-types'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/Media', () => ({
  Media: ({ resource }: { resource: Media }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={resource.alt ?? ''} src={resource.url ?? ''} />
  ),
}))

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/components/RichText', () => ({
  default: () => <p>Rendered case study content</p>,
}))

vi.mock('@/components/ShapeGrid/Lazy', () => ({
  default: () => <div data-testid="project-grid" />,
}))

function makeMedia(id: number, overrides: Partial<Media> = {}): Media {
  return {
    alt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    height: 900,
    id,
    updatedAt: '2026-01-01T00:00:00.000Z',
    url: `/media/project-${id}.jpg`,
    width: 1600,
    ...overrides,
  }
}

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    content: {
      root: {
        children: [
          {
            children: [
              {
                text: 'Case study body',
                type: 'text',
                version: 1,
              },
            ],
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    description: 'A focused description of the project.',
    detailBlocks: [
      {
        blockType: 'projectPrinciples',
        eyebrow: 'Engineering approach',
        items: [
          {
            description: 'The product remains dependable.',
            id: 'reliability',
            label: '01',
            title: 'Reliability',
          },
        ],
        title: 'Project principles',
      },
    ],
    id: 1,
    image: makeMedia(1),
    links: [
      { id: 'live', label: 'Live Site', url: 'https://example.com' },
      { id: 'unsafe', label: 'Unsafe Site', url: 'javascript:alert(1)' },
    ],
    role: 'Product Engineer',
    showcaseCaption: 'Interface detail',
    showcaseImage: makeMedia(2),
    slug: 'project-one',
    status: 'published',
    tech: [
      { id: 'next', techName: 'Next.js' },
      { id: 'payload', techName: 'Payload' },
    ],
    title: 'Project One',
    type: 'web-app',
    updatedAt: '2026-01-01T00:00:00.000Z',
    year: 2026,
    ...overrides,
  }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ProjectDetail', () => {
  it('renders the complete case study composition and safe external links', () => {
    const nextProject = { id: 2, slug: 'project-two', title: 'Project Two' }
    render(<ProjectDetail nextProject={nextProject} project={makeProject()} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Project One' })).not.toBeNull()
    expect(screen.getByText('A focused description of the project.')).not.toBeNull()
    expect(screen.getByRole('complementary', { name: 'Project metadata' })).not.toBeNull()
    expect(screen.getByText('Product Engineer')).not.toBeNull()
    expect(screen.getByText('Web App')).not.toBeNull()
    expect(screen.getByText('2026')).not.toBeNull()
    expect(screen.getByText(/Next\.js/)).not.toBeNull()
    expect(screen.getByText(/Payload/)).not.toBeNull()
    expect(screen.getByText('Rendered case study content')).not.toBeNull()
    expect(screen.getByText('Interface detail')).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Project principles' })).not.toBeNull()

    const featuredImage = screen.getByRole('img', { name: 'Project One' })
    const showcaseImage = screen.getByRole('img', { name: 'Interface detail' })
    expect(featuredImage).not.toBeNull()
    expect(showcaseImage).not.toBeNull()

    const externalLink = screen.getByRole('link', { name: /Live Site/i })
    expect(externalLink.getAttribute('href')).toBe('https://example.com')
    expect(externalLink.getAttribute('target')).toBe('_blank')
    expect(externalLink.getAttribute('rel')).toBe('noopener noreferrer')
    expect(externalLink.classList.contains('specular-button--md')).toBe(true)
    expect(externalLink.className).not.toContain('font-mono')
    expect(externalLink.className).not.toContain('uppercase')
    expect(screen.queryByRole('link', { name: /Unsafe Site/i })).toBeNull()

    expect(screen.getByRole('link', { name: /Project Two/i }).getAttribute('href')).toBe(
      '/projects/project-two',
    )
  })

  it('omits unresolved and empty optional sections without placeholders', () => {
    render(
      <ProjectDetail
        project={makeProject({
          content: {
            root: {
              children: [],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },
          description: null,
          detailBlocks: [],
          image: 41,
          links: [],
          role: null,
          showcaseImage: 42,
          tech: [],
          type: null,
          year: null,
        })}
      />,
    )

    expect(screen.queryByRole('complementary', { name: 'Project metadata' })).toBeNull()
    expect(screen.queryByTestId('project-featured-image')).toBeNull()
    expect(screen.queryByText('Rendered case study content')).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Project principles' })).toBeNull()
    expect(screen.queryByText('Next Project')).toBeNull()
    expect(screen.getAllByRole('link', { name: /Back|All Projects/i })).toHaveLength(2)
  })

  it('places project detail blocks after the showcase and before the gallery', () => {
    const project = makeProject()
    const { container } = render(
      <ProjectDetail
        project={{
          ...project,
          gallery: [
            {
              description: project.content!,
              id: 'calculator-screen',
              image: makeMedia(3),
              layout: 'full',
              title: 'Calculator screen',
            },
          ],
        }}
      />,
    )

    const showcase = container.querySelector('[data-project-showcase="true"]')
    const principles = container.querySelector('[data-project-principles="true"]')
    const gallery = container.querySelector('section[aria-label="Project gallery"]')

    expect(showcase).not.toBeNull()
    expect(principles).not.toBeNull()
    expect(gallery).not.toBeNull()
    expect(showcase?.compareDocumentPosition(principles as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(principles?.compareDocumentPosition(gallery as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })
})

describe('project detail formatting and navigation', () => {
  const projects = [
    { id: 1, slug: 'one', title: 'One' },
    { id: 2, slug: 'two', title: 'Two' },
    { id: 3, slug: 'three', title: 'Three' },
  ]

  it('formats project type labels consistently with the archive', () => {
    expect(formatProjectType('web-app')).toBe('Web App')
    expect(formatProjectType('open-source')).toBe('Open Source')
    expect(formatProjectType(null)).toBeUndefined()
  })

  it('selects the following project and wraps the final project to the first', () => {
    expect(getNextProject(1, projects)).toEqual(projects[1])
    expect(getNextProject(3, projects)).toEqual(projects[0])
  })

  it('avoids self-navigation and unknown current projects', () => {
    expect(getNextProject(1, [projects[0]])).toBeNull()
    expect(getNextProject(99, projects)).toBeNull()
  })

  it('distinguishes meaningful rich text from an empty editor state', () => {
    expect(hasProjectContent(makeProject().content)).toBe(true)
    expect(
      hasProjectContent({
        root: {
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      }),
    ).toBe(false)
  })
})
