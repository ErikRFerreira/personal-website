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

vi.mock('@/components/MorphSlider', () => ({
  default: ({
    autoplay,
    className,
    items,
    loop,
    radius,
    showControls,
    showIndicators,
    startIndex,
  }: {
    autoplay?: boolean
    className?: string
    items: Array<{ alt?: string; caption?: string; image: string }>
    loop?: boolean
    radius?: number
    showControls?: boolean
    showIndicators?: boolean
    startIndex?: number
  }) => (
    <div
      className={className}
      data-autoplay={String(autoplay)}
      data-items={JSON.stringify(items)}
      data-loop={String(loop)}
      data-radius={radius}
      data-show-controls={String(showControls)}
      data-show-indicators={String(showIndicators)}
      data-start-index={startIndex}
      data-testid="profile-morph-slider"
    >
      {items.map((item) => item.caption).join(' ')}
    </div>
  ),
}))

import { ProfileHero } from '@/heros/ProfileHero'
import type { Media } from '@/payload-types'

afterEach(cleanup)

const profileImage = {
  id: 10,
  alt: 'Erik Ferreira',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
  url: '/media/diver.jpg',
} as Media

const developerImage = {
  id: 11,
  alt: 'Erik writing software',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
  url: '/media/developer.jpg',
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
    expect(container.querySelector('[data-parallax-text]')).not.toBeNull()
    expect(container.querySelector('[data-parallax-image]')).not.toBeNull()
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

  it('renders MorphSlider only when explicitly enabled with a populated primary image', () => {
    const { rerender } = render(
      <ProfileHero
        enableImageStack
        intro="Developer and diver"
        media={profileImage}
        name="Erik Ferreira"
        secondaryMedia={developerImage}
        stackPrimaryLabel="01 / DIVER"
        stackSecondaryLabel="02 / DEVELOPER"
        type="profileHero"
      />,
    )

    const slider = screen.getByTestId('profile-morph-slider')
    const items = JSON.parse(slider.getAttribute('data-items') || '[]')

    expect(items).toEqual([
      {
        alt: 'Erik Ferreira',
        caption: '01 / DIVER',
        image: '/media/diver.jpg?2026-09-02T00%3A00%3A00.000Z',
      },
      {
        alt: 'Erik writing software',
        caption: '02 / DEVELOPER',
        image: '/media/developer.jpg?2026-09-02T00%3A00%3A00.000Z',
      },
    ])
    expect(slider.className).toContain('profile-hero-morph-slider')
    expect(slider.getAttribute('data-autoplay')).toBe('false')
    expect(slider.getAttribute('data-loop')).toBe('true')
    expect(slider.getAttribute('data-radius')).toBe('0')
    expect(slider.getAttribute('data-show-controls')).toBe('true')
    expect(slider.getAttribute('data-show-indicators')).toBe('false')
    expect(slider.getAttribute('data-start-index')).toBe('0')
    expect(screen.getByText(/01 \/ DIVER/)).not.toBeNull()
    expect(screen.queryByTestId('profile-media')).toBeNull()

    rerender(
      <ProfileHero
        enableImageStack
        intro="Developer and diver"
        media={10}
        name="Erik Ferreira"
        type="profileHero"
      />,
    )

    expect(screen.queryByTestId('profile-morph-slider')).toBeNull()
  })

  it('uses the built-in developer artwork and accessible defaults when secondary media is empty', () => {
    const { rerender } = render(
      <ProfileHero
        enableImageStack
        intro="Developer and diver"
        media={{ ...profileImage, alt: '' }}
        name="Erik Ferreira"
        type="profileHero"
      />,
    )

    const slider = screen.getByTestId('profile-morph-slider')
    const items = JSON.parse(slider.getAttribute('data-items') || '[]')

    expect(items[0].alt).toBe('Erik Ferreira diving underwater')
    expect(items[1]).toEqual({
      alt: 'Software development workspace displaying project source code',
      caption: '02 / DEVELOPER',
      image: '/images/hero-code-bg.svg',
    })

    rerender(
      <ProfileHero
        enableImageStack
        intro="Developer and diver"
        media={profileImage}
        name="Erik Ferreira"
        secondaryMedia={{ ...developerImage, alt: '' }}
        type="profileHero"
      />,
    )

    const cmsItems = JSON.parse(
      screen.getByTestId('profile-morph-slider').getAttribute('data-items') || '[]',
    )
    expect(cmsItems[1].alt).toBe('Erik Ferreira working as a software developer')
  })
})
