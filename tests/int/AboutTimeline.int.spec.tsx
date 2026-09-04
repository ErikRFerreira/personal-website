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
  ...Array.from({ length: 8 }, (_, index) => ({
    id: `chapter-${index + 3}`,
    year: String(2023 + index),
    title: `Chapter ${index + 3}`,
    description: `Timeline chapter ${index + 3}.`,
    image: media(40 + index, `Timeline chapter ${index + 3}`),
    metadata: [{ label: 'Focus', value: `Chapter ${index + 3}` }],
  })),
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
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(880)
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
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('starts on the latest milestone and renders its dossier', async () => {
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
    expect(screen.getByTestId('about-timeline-media').getAttribute('data-media-id')).toBe('30')
    expect(
      screen.getByText('Active').closest('[data-highlighted]')?.getAttribute('data-highlighted'),
    ).toBe('true')
    expect(screen.getByTestId('about-timeline-status-icon')).not.toBeNull()
    expect(scrollRegion.getAttribute('tabindex')).toBe('0')
    expect(scrollRegion.hasAttribute('data-lenis-prevent')).toBe(true)
    expect(scrollRegion.classList.contains('about-timeline-scroll-region')).toBe(true)
    expect(scrollRegion.querySelector('[data-scroll-reveal="true"]')).toBeNull()
    await waitFor(() => expect((scrollRegion as HTMLElement).scrollTop).toBe(880))
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
    expect(middleButton.textContent).toBe('2022Instructor Certification')
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

  it('renders every milestone as keyboard-reachable LineSidebar navigation', () => {
    render(<AboutTimelineBlock blockType="aboutTimeline" milestones={milestones} />)

    const navigation = screen.getByRole('navigation', {
      name: 'Timeline milestone navigation',
    })
    const buttons = within(navigation).getAllByRole('button')

    expect(buttons).toHaveLength(11)
    expect(buttons.every((button) => button.tabIndex === 0)).toBe(true)
    expect(buttons[0].id).toMatch(/-milestone-0$/)
    expect(buttons[10].getAttribute('aria-pressed')).toBe('true')
    expect(within(navigation).getAllByText(/Chapter|Current chapter/)).toHaveLength(9)
  })
})
