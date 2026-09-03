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

import { LensBlockComponent } from '@/blocks/LensBlock/Component'
import type { Len, Media } from '@/payload-types'

afterEach(cleanup)

const photo = {
  alt: 'Whale shark underwater',
  createdAt: '2026-09-02T00:00:00.000Z',
  height: 1200,
  id: 11,
  updatedAt: '2026-09-02T00:00:00.000Z',
  url: '/media/whale-shark.jpg',
  width: 1800,
} as Media

const lensItem = {
  archiveFormat: 'landscape',
  createdAt: '2026-09-02T00:00:00.000Z',
  id: 4,
  photo,
  slug: 'whale-shark',
  status: 'published',
  title: 'Whale Shark',
  updatedAt: '2026-09-02T00:00:00.000Z',
} as Len

describe('LensBlockComponent', () => {
  it('adds the shared accent hexagon to the Lens eyebrow', () => {
    const { container } = render(
      <LensBlockComponent
        blockType="lensBlock"
        eyebrow="Through the Lens"
        label="Field Notes"
        photos={[lensItem]}
      />,
    )

    expect(screen.getByText('Through the Lens')).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Field Notes' })).not.toBeNull()
    expect(container.querySelector('[data-accent-hexagon="true"]')).not.toBeNull()
    expect(screen.getByRole('link', { name: /Whale Shark/i }).getAttribute('href')).toBe(
      '/lens/whale-shark',
    )
  })
})
