import { render, screen } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/blocks/Banner/Component', () => ({
  BannerBlock: () => null,
}))

vi.mock('@/blocks/CallToAction/Component', () => ({
  CallToActionBlock: () => null,
}))

vi.mock('@/blocks/Code/Component', () => ({
  CodeBlock: () => null,
}))

vi.mock('@/blocks/MediaBlock/Component', () => ({
  MediaBlock: () => null,
}))

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, revealName }: { children: ReactNode; revealName?: string }) => (
    <div data-reveal-name={revealName}>{children}</div>
  ),
}))

vi.mock('@/components/ScrollReveal', () => ({
  default: ({
    as = 'h3',
    baseRotation,
    children,
  }: {
    as?: 'div' | 'h3'
    baseRotation?: number
    children: ReactNode
  }) =>
    createElement(
      as,
      {
        'data-base-rotation': baseRotation,
        'data-testid': 'story-scroll-reveal',
      },
      children,
    ),
}))

import { AboutStoryBlock } from '@/blocks/AboutStory/Component'
import type { AboutStoryBlock as AboutStoryBlockType } from '@/payload-types'

const storyBody = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 1,
            mode: 'normal',
            style: '',
            text: 'First bold paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Linked second paragraph',
                version: 1,
              },
            ],
            direction: 'ltr',
            fields: {
              linkType: 'custom',
              newTab: false,
              url: '/contact',
            },
            format: '',
            id: 'story-link',
            indent: 0,
            version: 3,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
} as AboutStoryBlockType['body']

describe('AboutStory word reveal', () => {
  it('uses one prose-friendly reveal while preserving rich-text semantics', () => {
    const { container } = render(
      <AboutStoryBlock
        blockType="aboutStory"
        body={storyBody}
        eyebrow="Background"
        heading="The Calculated Descent"
      />,
    )

    const reveal = screen.getByTestId('story-scroll-reveal')
    const link = screen.getByRole('link', { name: 'Linked second paragraph' })

    expect(reveal.tagName).toBe('DIV')
    expect(reveal.getAttribute('data-base-rotation')).toBe('0')
    expect(container.querySelectorAll('[data-testid="story-scroll-reveal"]')).toHaveLength(1)
    expect(container.querySelectorAll('.scroll-reveal-word')).toHaveLength(6)
    expect(screen.getByText('First').closest('strong')).not.toBeNull()
    expect(link.getAttribute('href')).toBe('/contact')
    expect(link.querySelectorAll('.scroll-reveal-word')).toHaveLength(3)
    expect(screen.getAllByRole('heading')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'The Calculated Descent' })).not.toBeNull()
  })
})
