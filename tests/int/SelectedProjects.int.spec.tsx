import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, revealName }: { children: ReactNode; revealName?: string }) => (
    <div data-reveal-name={revealName}>{children}</div>
  ),
}))

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
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
  it('renders the compact heading and real project content in the new card composition', () => {
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
    expect(screen.getByText('Web App // 2026')).not.toBeNull()
    expect(screen.getByText('A focused description of the project.')).not.toBeNull()
    expect(screen.getByText('Next.js')).not.toBeNull()
    expect(screen.getByText('TypeScript')).not.toBeNull()
    expect(screen.queryByText('Performance')).toBeNull()
    expect(screen.queryByText('99')).toBeNull()
    expect(screen.getByRole('link', { name: /Read Case Study/i }).getAttribute('href')).toBe(
      '/projects/project-one',
    )
    expect(screen.getByRole('img', { name: 'Project dashboard' })).not.toBeNull()
    expect(container.querySelector('[data-project-technologies="true"]')).not.toBeNull()
  })

  it('alternates desktop ordering and accent placement while keeping media first on mobile', () => {
    const { container } = render(
      <SelectedProjectsBlock
        projects={[
          makeProject(),
          makeProject({ id: 2, image: null, slug: 'project-two', title: 'Project Two' }),
        ]}
      />,
    )

    const cards = container.querySelectorAll('[data-project-card="true"]')
    const firstContent = cards[0]?.querySelector('[data-project-content="true"]')
    const secondContent = cards[1]?.querySelector('[data-project-content="true"]')

    expect(firstContent?.className).toContain('order-2')
    expect(firstContent?.className).toContain('lg:order-1')
    expect(secondContent?.className).toContain('order-2')
    expect(secondContent?.className).toContain('lg:order-2')
    expect(cards[0]?.querySelector('[data-project-accent="left"]')).not.toBeNull()
    expect(cards[1]?.querySelector('[data-project-accent="right"]')).not.toBeNull()
    expect(screen.getByRole('img', { name: 'Project Two preview unavailable' })).not.toBeNull()
    expect(container.querySelector('[data-project-image-placeholder="true"]')).not.toBeNull()
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
