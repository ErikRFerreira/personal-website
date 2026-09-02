import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, revealName }: { children: ReactNode; revealName?: string }) => (
    <div data-reveal-name={revealName}>{children}</div>
  ),
}))

vi.mock('@/components/Media', () => ({
  Media: () => <span aria-hidden="true" data-testid="capability-icon" />,
}))

import { CapabilitiesBlock } from '@/blocks/Capabilities/Component'
import type { Media } from '@/payload-types'

afterEach(cleanup)

const capabilityIcon = {
  id: 2,
  alt: '',
  createdAt: '2026-09-02T00:00:00.000Z',
  filename: 'capability.svg',
  height: 28,
  mimeType: 'image/svg+xml',
  updatedAt: '2026-09-02T00:00:00.000Z',
  url: '/media/capability.svg',
  width: 28,
} as Media

describe('CapabilitiesBlock', () => {
  it('renders three staggered cards with icons, numbering, and tags', () => {
    render(
      <CapabilitiesBlock
        blockType="capabilities"
        eyebrow="Operational Vectors"
        items={[
          {
            title: 'Digital Products',
            description: 'Product systems',
            icon: capabilityIcon,
            tags: [{ tag: 'TypeScript' }],
          },
          {
            title: 'Diving',
            description: 'Technical profiles',
            icon: capabilityIcon,
            tags: [{ tag: 'Sidemount' }],
          },
          {
            title: 'Photography',
            description: 'Remote environments',
            icon: capabilityIcon,
            tags: [{ tag: 'Underwater' }],
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Operational Vectors' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Digital Products' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Diving' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Photography' })).not.toBeNull()
    expect(screen.getAllByTestId('capability-icon')).toHaveLength(3)
    expect(screen.getByText('01')).not.toBeNull()
    expect(screen.getByText('02')).not.toBeNull()
    expect(screen.getByText('03')).not.toBeNull()
    expect(screen.getByText('TypeScript')).not.toBeNull()
    expect(document.querySelectorAll('.card-spotlight.capability-card')).toHaveLength(3)
    expect(document.querySelectorAll('[data-reveal-name="capability-card"]')).toHaveLength(3)
    expect(document.querySelectorAll('[data-parallax-card]')).toHaveLength(3)
  })

  it('uses the default heading and icon fallback for an unpopulated relationship', () => {
    render(
      <CapabilitiesBlock
        blockType="capabilities"
        eyebrow=" "
        items={[{ title: 'Engineering', description: 'Product systems', icon: 2 }]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Operational Vectors' })).not.toBeNull()
    expect(screen.queryByTestId('capability-icon')).toBeNull()
    expect(document.querySelector('[data-capability-index="1"]')).not.toBeNull()
  })

  it('renders legacy CMS data safely until the migration is applied', () => {
    const legacyProps = {
      blockType: 'capabilities',
      capabilities: [
        {
          name: 'Product Engineering',
          description: 'Reliable product systems',
          icon: capabilityIcon,
        },
      ],
      label: 'What I Do',
    } as unknown as Parameters<typeof CapabilitiesBlock>[0]

    render(<CapabilitiesBlock {...legacyProps} />)

    expect(screen.getByRole('heading', { name: 'What I Do' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Product Engineering' })).not.toBeNull()
  })
})
