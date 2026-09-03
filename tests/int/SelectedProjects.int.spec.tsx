import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('ogl', () => ({
  Color: class {},
  Mesh: class {},
  Program: class {},
  Renderer: class {
    constructor() {
      throw new Error('WebGL is unavailable in jsdom')
    }
  },
  Triangle: class {},
}))

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, revealName }: { children: ReactNode; revealName?: string }) => (
    <div data-reveal-name={revealName}>{children}</div>
  ),
}))

vi.mock('@/components/ShapeGrid/Lazy', () => ({
  default: () => <div data-shape-grid="true" />,
}))

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

import { SelectedProjectsBlock } from '@/blocks/SelectedProjects/Component'
import type { Media, Project } from '@/payload-types'

afterEach(cleanup)

const projectImage = {
  alt: 'Project dashboard',
  createdAt: '2026-09-02T00:00:00.000Z',
  height: 900,
  id: 7,
  updatedAt: '2026-09-02T00:00:00.000Z',
  url: '/media/project.jpg',
  width: 1600,
} as Media

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    createdAt: '2026-09-02T00:00:00.000Z',
    description: 'A focused description of the project.',
    id: 1,
    image: projectImage,
    metrics: [{ label: 'Performance', value: '99', id: 'performance' }],
    slug: 'project-one',
    status: 'completed',
    tech: [
      { id: 'next', techName: 'Next.js' },
      { id: 'typescript', techName: 'TypeScript' },
    ],
    title: 'Project One',
    type: 'web-app',
    updatedAt: '2026-09-02T00:00:00.000Z',
    year: 2026,
    ...overrides,
  } as Project
}

describe('SelectedProjectsBlock', () => {
  it('renders the compact heading and real project content in the wide composition', () => {
    const { container } = render(
      <SelectedProjectsBlock
        eyebrow="01"
        intro="This intro is intentionally hidden."
        label="Selected Work"
        projects={[makeProject()]}
      />,
    )

    expect(screen.getByRole('heading', { name: '01 // Selected Work' })).not.toBeNull()
    expect(screen.queryByText('This intro is intentionally hidden.')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Project One' })).not.toBeNull()
    expect(screen.getByText('WEB_APP // 2026')).not.toBeNull()
    expect(screen.getByText('A focused description of the project.')).not.toBeNull()
    expect(screen.getByText('Next.js')).not.toBeNull()
    expect(screen.getByText('TypeScript')).not.toBeNull()
    expect(screen.queryByText('Performance')).toBeNull()
    expect(screen.queryByText('99')).toBeNull()
    expect(screen.getByRole('link', { name: /Read Case Study/i }).getAttribute('href')).toBe(
      '/projects/project-one',
    )
    expect(
      screen.getByRole('link', { name: /Read Case Study/i }).classList.contains('specular-button'),
    ).toBe(true)
    expect(screen.getByRole('img', { name: 'Project dashboard' })).not.toBeNull()
    expect(container.querySelector('[data-project-technologies="true"]')).not.toBeNull()
    expect(
      container.querySelector('[data-selected-projects="true"]')?.getAttribute('style'),
    ).toContain('background-color: var(--site-surface-deep)')
    expect(container.querySelector('[data-selected-projects-grid="true"]')?.className).toContain(
      'opacity-60',
    )
    expect(container.querySelector('[data-shape-grid="true"]')).not.toBeNull()
    expect(container.querySelector('[data-accent-hexagon="true"]')).not.toBeNull()
    const projectImage = screen.getByRole('img', { name: 'Project dashboard' })
    const imageOverlay = container.querySelector('[data-project-image-overlay="true"]')

    expect(projectImage.className).toContain('transition-transform')
    expect(projectImage.className).toContain('group-hover:scale-105')
    expect(projectImage.className).toContain('duration-700')
    expect(projectImage.className).not.toContain('grayscale')
    expect(imageOverlay?.className).toContain('bg-site-surface-deep/25')
    expect(imageOverlay?.className).toContain('group-hover:opacity-0')
  })

  it('uses the wide layout first and the offset layout thereafter without reordering projects', () => {
    const { container } = render(
      <SelectedProjectsBlock
        projects={[
          makeProject(),
          makeProject({ id: 2, image: null, slug: 'project-two', title: 'Project Two' }),
        ]}
      />,
    )

    const cards = container.querySelectorAll('[data-project-card="true"]')
    const firstFrame = cards[0]?.querySelector('[data-project-frame="true"]')
    const firstContent = cards[0]?.querySelector('[data-project-content="true"]')
    const secondFrame = cards[1]?.querySelector('[data-project-frame="true"]')
    const secondContent = cards[1]?.querySelector('[data-project-content="true"]')

    expect(cards[0]?.getAttribute('data-project-layout')).toBe('wide')
    expect(cards[1]?.getAttribute('data-project-layout')).toBe('offset')
    expect(cards[0]?.querySelector('h3')?.textContent).toBe('Project One')
    expect(cards[1]?.querySelector('h3')?.textContent).toBe('Project Two')
    expect(cards[0]?.querySelector('[data-project-corner="bottom-right"]')).not.toBeNull()
    expect(cards[1]?.querySelector('[data-project-corner="top-left"]')).not.toBeNull()
    expect(container.querySelector('[data-project-reference]')).toBeNull()
    expect(container.querySelector('[data-project-marker]')).toBeNull()
    expect(firstFrame?.compareDocumentPosition(firstContent as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(secondFrame?.className).toContain('order-1')
    expect(secondContent?.className).toContain('order-2')
    expect(screen.getByRole('img', { name: 'Project Two preview unavailable' })).not.toBeNull()
    expect(container.querySelector('[data-project-image-placeholder="true"]')).not.toBeNull()
  })

  it('keeps every project after the first in the offset composition', () => {
    const { container } = render(
      <SelectedProjectsBlock
        projects={[
          makeProject(),
          makeProject({ id: 2, slug: 'project-two', title: 'Project Two' }),
          makeProject({ id: 3, slug: 'project-three', title: 'Project Three' }),
        ]}
      />,
    )

    const cards = container.querySelectorAll('[data-project-card="true"]')

    expect(Array.from(cards, (card) => card.getAttribute('data-project-layout'))).toEqual([
      'wide',
      'offset',
      'offset',
    ])
  })

  it('uses heading fallback and safely handles sparse or unpopulated project data', () => {
    const { container, rerender } = render(
      <SelectedProjectsBlock
        eyebrow=" "
        label=""
        projects={[
          12,
          makeProject({ description: null, image: 7, tech: [], type: null, year: null }),
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Selected Projects' })).not.toBeNull()
    expect(container.querySelector('[data-project-technologies="true"]')).toBeNull()
    expect(screen.queryByText(/Web App/)).toBeNull()

    rerender(<SelectedProjectsBlock projects={[12]} />)
    expect(container.querySelector('[data-selected-projects="true"]')).toBeNull()
  })
})
