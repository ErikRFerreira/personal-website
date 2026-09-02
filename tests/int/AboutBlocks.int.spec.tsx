import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/RichText', () => ({
  default: () => <div>Story body</div>,
}))

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, revealName }: { children: ReactNode; revealName?: string }) => (
    <div data-reveal-name={revealName}>{children}</div>
  ),
}))

vi.mock('@/components/BlurText', () => ({
  default: ({ text }: { text?: string }) => <span>{text}</span>,
}))

import { AboutDisciplinesBlock } from '@/blocks/AboutDisciplines/Component'
import { AboutHeroBlock } from '@/blocks/AboutHero/Component'
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
        <AboutHeroBlock
          blockType="aboutHero"
          image={1}
          imageLabel="Profile image"
          intro="Developer and diver"
          name="Erik Ferreira"
        />
        <AboutStoryBlock blockType="aboutStory" body={storyBody} heading="Calculated Descent" />
        <AboutDisciplinesBlock
          blockType="aboutDisciplines"
          items={[
            {
              title: 'Digital Products',
              description: 'Product systems',
              icon: 2,
              tags: [{ tag: 'TypeScript' }],
            },
          ]}
        />
        <AboutProtocolBlock
          blockType="aboutProtocol"
          heading="The Protocol"
          principles={[{ text: 'Build useful things', quote: 'Utility first.' }]}
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

    expect(screen.getByRole('heading', { name: 'Erik Ferreira' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Calculated Descent' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Digital Products' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'The Protocol' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Current chapter' })).not.toBeNull()
    expect(screen.getByText('Active')).not.toBeNull()
  })
})
