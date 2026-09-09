import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ProjectPrinciplesBlock } from '@/blocks/ProjectPrinciples/Component'
import { ProjectPrinciples } from '@/blocks/ProjectPrinciples/config'
import { Projects } from '@/collections/Projects'
import type { ProjectPrinciplesBlock as ProjectPrinciplesBlockProps } from '@/payload-types'

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({
    children,
    className,
    revealName,
  }: {
    children: ReactNode
    className?: string
    revealName?: string
  }) => (
    <div className={className} data-reveal-name={revealName}>
      {children}
    </div>
  ),
}))

afterEach(cleanup)

const block: ProjectPrinciplesBlockProps = {
  blockType: 'projectPrinciples',
  eyebrow: 'ENGINEERING APPROACH',
  title: 'Built for clarity and reliability',
  description: 'A short introduction to the decisions behind the product.',
  items: [
    {
      id: 'offline',
      label: '01',
      title: 'Offline by Design',
      description: 'Core calculations remain available without a network connection.',
    },
    {
      id: 'reliable',
      label: null,
      title: 'Reliable Calculation Layer',
      description: 'Critical calculation logic remains testable and predictable.',
    },
    {
      id: 'cross-platform',
      label: '03',
      title: 'Cross-Platform by Default',
      description: 'A shared TypeScript codebase supports mobile platforms.',
    },
  ],
}

describe('ProjectPrinciples Payload block', () => {
  it('is registered in the Projects detail blocks field with concise item limits', () => {
    const tabs = Projects.fields.find((field) => field.type === 'tabs')
    if (!tabs || tabs.type !== 'tabs') throw new Error('Projects tabs field is missing.')

    const contentTab = tabs.tabs.find((tab) => 'label' in tab && tab.label === 'Content')
    if (!contentTab || !('fields' in contentTab)) throw new Error('Content tab is missing.')

    const detailBlocks = contentTab.fields.find(
      (field) => 'name' in field && field.name === 'detailBlocks',
    )
    expect(detailBlocks?.type).toBe('blocks')
    if (!detailBlocks || detailBlocks.type !== 'blocks') {
      throw new Error('Project detail blocks field is missing.')
    }
    expect(detailBlocks.blocks).toContain(ProjectPrinciples)

    const items = ProjectPrinciples.fields.find(
      (field) => 'name' in field && field.name === 'items',
    )
    expect(items).toMatchObject({ maxRows: 6, minRows: 1, required: true, type: 'array' })
  })
})

describe('ProjectPrinciplesBlock', () => {
  it('renders editable content as equal-height responsive spotlight cards', () => {
    const { container } = render(<ProjectPrinciplesBlock {...block} />)

    expect(screen.getByText('ENGINEERING APPROACH')).not.toBeNull()
    expect(
      screen.getByRole('heading', { name: 'Built for clarity and reliability' }),
    ).not.toBeNull()
    expect(screen.getByText(block.description!)).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Offline by Design' })).not.toBeNull()
    expect(screen.queryByText('02')).toBeNull()

    const grid = container.querySelector('[data-project-principles] > div:last-child')
    expect(grid?.className).toContain('grid-cols-1')
    expect(grid?.className).toContain('md:grid-cols-2')
    expect(grid?.className).toContain('lg:grid-cols-3')

    const revealWrappers = container.querySelectorAll('[data-reveal-name="project-principle-card"]')
    const cards = container.querySelectorAll('.card-spotlight')
    expect(revealWrappers).toHaveLength(3)
    expect(
      Array.from(revealWrappers).every((wrapper) => wrapper.classList.contains('h-full')),
    ).toBe(true)
    expect(cards).toHaveLength(3)

    fireEvent.mouseMove(cards[0]!, { clientX: 12, clientY: 18 })
    expect((cards[0] as HTMLElement).style.getPropertyValue('--spotlight-color')).toBe(
      'rgb(0 242 255 / 8%)',
    )
  })

  it('omits incomplete runtime data without adding placeholder content', () => {
    const { container, rerender } = render(
      <ProjectPrinciplesBlock
        {...block}
        description={null}
        eyebrow={null}
        items={[{ description: ' ', title: 'Incomplete' }]}
      />,
    )

    expect(container.querySelector('[data-project-principles]')).toBeNull()

    rerender(<ProjectPrinciplesBlock {...block} title=" " />)
    expect(container.querySelector('[data-project-principles]')).toBeNull()
  })
})
