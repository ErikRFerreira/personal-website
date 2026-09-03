import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { AboutTimelineBlock as AboutTimelineBlockType, Media } from '@/payload-types'

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({
    children,
    delay,
    revealName,
  }: {
    children: ReactNode
    delay?: number
    revealName?: string
  }) => (
    <div data-reveal-delay={delay ?? 0} data-reveal-name={revealName}>
      {children}
    </div>
  ),
}))

vi.mock('@/components/Media', () => ({
  Media: ({ resource }: { resource: Media }) => (
    <div data-media-id={resource.id} data-testid="about-timeline-media" />
  ),
}))

import { AboutTimelineBlock } from '@/blocks/AboutTimeline/Component'

const media = (id: number, alt: string): Media => ({
  id,
  alt,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  url: `/media/${id}.webp`,
  width: 1600,
  height: 900,
})

const milestones: AboutTimelineBlockType['milestones'] = [
  {
    id: 'first',
    year: '2018',
    description: 'Initial system exposure.',
    image: media(10, 'First dive'),
    metadata: [{ label: 'Origin', value: 'Brazil' }],
  },
  {
    id: 'middle',
    year: '2022',
    title: 'Instructor Certification',
    description: 'Formalizing pedagogical frameworks.',
    image: media(20, 'Instructor training'),
    metadata: [
      { label: 'Origin', value: 'Portugal' },
      { label: 'Focus', value: 'Teaching' },
    ],
  },
  {
    id: 'latest',
    year: 'Now',
    title: 'Current chapter',
    description: 'Building reliable products.',
    image: media(30, 'Current work'),
    metadata: [
      { label: 'Classification', value: 'Technical Diver / Dev' },
      { label: 'Status', value: 'Active' },
    ],
  },
]

describe('AboutTimelineBlock', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('starts on the latest milestone and renders its dossier', () => {
    render(
      <AboutTimelineBlock
        blockType="aboutTimeline"
        eyebrow="Logbook / chronology"
        milestones={milestones}
      />,
    )

    const latestButton = screen.getByRole('button', { name: /Current chapter/ })
    const scrollRegion = screen.getByRole('region', { name: 'Timeline milestones' })

    expect(latestButton.getAttribute('aria-pressed')).toBe('true')
    expect(latestButton.getAttribute('data-state')).toBe('active')
    expect(screen.getByTestId('about-timeline-media').getAttribute('data-media-id')).toBe('30')
    expect(
      screen.getByText('Active').closest('[data-highlighted]')?.getAttribute('data-highlighted'),
    ).toBe('true')
    expect(screen.getByTestId('about-timeline-status-icon')).not.toBeNull()
    expect(scrollRegion.getAttribute('tabindex')).toBe('0')
    expect(screen.getByTestId('about-timeline-progress')).not.toBeNull()
  })

  it('updates the active image and metadata when a milestone is selected', async () => {
    render(
      <AboutTimelineBlock
        blockType="aboutTimeline"
        eyebrow="Logbook / chronology"
        milestones={milestones}
      />,
    )

    const middleButton = screen.getByRole('button', { name: /Instructor Certification/ })
    fireEvent.click(middleButton)

    await waitFor(() => {
      expect(screen.getByTestId('about-timeline-media').getAttribute('data-media-id')).toBe('20')
    })

    expect(middleButton.getAttribute('aria-pressed')).toBe('true')
    expect(
      screen.getByText('Teaching').closest('[data-highlighted]')?.getAttribute('data-highlighted'),
    ).toBe('true')
    expect(screen.queryByTestId('about-timeline-status-icon')).toBeNull()
    expect(middleButton.textContent).toContain(
      'Instructor Certification. Formalizing pedagogical frameworks.',
    )
  })

  it('falls back safely when a media relationship is not populated', () => {
    render(
      <AboutTimelineBlock
        blockType="aboutTimeline"
        milestones={[
          {
            year: '2018',
            description: 'Initial system exposure.',
            image: 10,
            metadata: [{ label: 'Focus', value: 'Foundations' }],
          },
        ]}
      />,
    )

    expect(screen.getByTestId('about-timeline-image-placeholder')).not.toBeNull()
    expect(screen.queryByTestId('about-timeline-media')).toBeNull()
    expect(screen.queryByTestId('about-timeline-status-icon')).toBeNull()
  })

  it('staggers entry reveals and keeps every milestone keyboard reachable', () => {
    const { container } = render(
      <AboutTimelineBlock blockType="aboutTimeline" milestones={milestones} />,
    )

    const milestoneReveals = [
      ...container.querySelectorAll('[data-reveal-name="about-timeline-milestone"]'),
    ]

    expect(milestoneReveals.map((element) => element.getAttribute('data-reveal-delay'))).toEqual([
      '0',
      '90',
      '180',
    ])
    expect(within(screen.getByRole('list')).getAllByRole('button')).toHaveLength(3)
  })
})
