import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/BlurText', () => ({
  default: ({ text }: { text?: string }) => <span>{text}</span>,
}))

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, revealName }: { children: ReactNode; revealName?: string }) => (
    <div data-reveal-name={revealName}>{children}</div>
  ),
}))

vi.mock('@/components/Media', () => ({
  Media: () => <span aria-hidden="true" data-testid="profile-media" />,
}))

import { ProfileHero } from '@/heros/ProfileHero'
import type { Media } from '@/payload-types'

afterEach(cleanup)

const profileImage = {
  id: 10,
  alt: 'Erik Ferreira',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
} as Media

describe('ProfileHero', () => {
  it('renders profile content and a populated image', () => {
    const { container } = render(
      <ProfileHero
        type="profileHero"
        imageLabel="Profile image"
        intro="Developer and diver"
        media={profileImage}
        name="Erik Ferreira"
      />,
    )

    expect(screen.getByRole('heading', { name: 'Erik Ferreira' })).not.toBeNull()
    expect(screen.getByText('Developer and diver')).not.toBeNull()
    expect(screen.getByText('Profile image')).not.toBeNull()
    expect(screen.getByTestId('profile-media')).not.toBeNull()
    expect(container.querySelector('section')?.getAttribute('data-has-image')).toBe('true')
    expect(container.querySelector('[data-reveal-name="profile-hero-image"]')).not.toBeNull()
  })

  it('renders the image fallback when the relationship is not populated', () => {
    const { container } = render(
      <ProfileHero
        type="profileHero"
        intro="Developer and diver"
        media={10}
        name="Erik Ferreira"
      />,
    )

    expect(screen.queryByTestId('profile-media')).toBeNull()
    expect(container.querySelector('section')?.getAttribute('data-has-image')).toBe('false')
  })
})
