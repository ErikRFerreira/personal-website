import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/RichText', () => ({
  default: () => <div>Story body</div>,
}))

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

vi.mock('@/components/ScrollReveal', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/BlurText', () => ({
  default: ({ text }: { text?: string }) => <span>{text}</span>,
}))

vi.mock('@/components/Media', () => ({
  Media: () => <span aria-hidden="true" data-testid="discipline-icon" />,
}))

vi.mock('@/blocks/AboutProtocol/ProtocolParallax', () => ({
  ProtocolParallax: ({ principles, quote }: { principles: ReactNode; quote: ReactNode }) => (
    <div data-testid="about-protocol-content">
      {principles}
      {quote}
    </div>
  ),
}))

import { AboutProtocolBlock } from '@/blocks/AboutProtocol/Component'
import { AboutStoryBlock } from '@/blocks/AboutStory/Component'
import { AboutTimelineBlock } from '@/blocks/AboutTimeline/Component'
import type { AboutStoryBlock as AboutStoryBlockType } from '@/payload-types'

const storyBody: AboutStoryBlockType['body'] = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Story body', version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}

describe('About block placeholders', () => {
  it('renders CMS-backed headings and collection content', () => {
    render(
      <>
        <AboutStoryBlock
          blockType="aboutStory"
          body={storyBody}
          eyebrow="Background"
          heading="Calculated Descent"
        />
        <AboutProtocolBlock
          blockType="aboutProtocol"
          heading="The Protocol"
          principles={[
            { text: 'Build things that actually get used.' },
            { text: 'Understand the system, not just the interface.' },
            { text: 'Know when convention can be challenged.' },
          ]}
          quote="Follow protocol when protocol matters."
        />
        <AboutTimelineBlock
          blockType="aboutTimeline"
          milestones={[
            {
              year: 'Now',
              title: 'Current chapter',
              description: 'Active work',
              image: 3,
              metadata: [{ label: 'Status', value: 'Active' }],
            },
          ]}
        />
      </>,
    )

    expect(screen.getByRole('heading', { name: 'Calculated Descent' })).not.toBeNull()
    expect(screen.getByText('Background')).not.toBeNull()
    expect(screen.getByText('Story body')).not.toBeNull()
    expect(screen.getByTestId('about-story-horizontal-progress')).not.toBeNull()
    expect(screen.getByTestId('about-story-vertical-progress')).not.toBeNull()
    expect(screen.getByTestId('about-story-progress-marker')).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'The Protocol' })).not.toBeNull()
    expect(screen.getByTestId('about-protocol-principles').children).toHaveLength(3)
    expect(screen.getAllByRole('blockquote')).toHaveLength(1)
    expect(screen.getByText('\u201cFollow protocol when protocol matters.\u201d')).not.toBeNull()
    expect(
      [...document.querySelectorAll('[data-reveal-name="about-protocol-principle"]')].map(
        (element) => element.getAttribute('data-reveal-delay'),
      ),
    ).toEqual(['0', '100', '200'])
    expect(
      document
        .querySelector('[data-reveal-name="about-protocol-quote"]')
        ?.getAttribute('data-reveal-delay'),
    ).toBe('180')
    expect(screen.getByRole('button', { name: /Current chapter/ })).not.toBeNull()
    expect(screen.getByText('Active')).not.toBeNull()
  })
})
