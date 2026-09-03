import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Media as MediaType } from '@/payload-types'

vi.mock('@/components/BlurText', () => ({
  default: ({ text }: { text?: string }) => <span>{text}</span>,
}))

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, revealName }: { children: ReactNode; revealName?: string }) => (
    <div data-reveal-name={revealName}>{children}</div>
  ),
}))

vi.mock('@/components/Media', () => ({
  Media: ({ priority }: { priority?: boolean }) => (
    <span aria-hidden="true" data-priority={String(priority)} data-testid="about-media" />
  ),
}))

import { AboutHero } from '@/heros/AboutHero'

afterEach(cleanup)

const profileImage = {
  id: 10,
  alt: 'Erik Ferreira diving underwater',
  createdAt: '2026-09-03T00:00:00.000Z',
  updatedAt: '2026-09-03T00:00:00.000Z',
} as MediaType

describe('AboutHero', () => {
  it('renders the editorial CMS content with one priority image', () => {
    const { container } = render(
      <AboutHero
        imageLabel="PROFILE / 01"
        intro="Developer, diver and photographer"
        media={profileImage}
        name="ABOUT ME"
        type="aboutHero"
      />,
    )

    expect(screen.getByRole('heading', { name: 'ABOUT ME' })).not.toBeNull()
    expect(screen.getByText('Developer, diver and photographer')).not.toBeNull()
    expect(screen.getByText('PROFILE / 01')).not.toBeNull()
    expect(screen.getAllByTestId('about-media')).toHaveLength(1)
    expect(screen.getByTestId('about-media').getAttribute('data-priority')).toBe('true')
    expect(screen.getByTestId('about-hero').getAttribute('data-has-image')).toBe('true')
    expect(screen.getByTestId('about-hero-image-frame')).not.toBeNull()
    expect(screen.getByTestId('about-hero-offset-frame')).not.toBeNull()
    const textLayer = container.querySelector('[data-about-hero-text]')
    const imageLayer = container.querySelector('[data-about-hero-image-layer]')
    const headingWords = [...container.querySelectorAll('[data-about-heading-word]')]

    expect(textLayer).not.toBeNull()
    expect(imageLayer).not.toBeNull()

    if (!textLayer || !imageLayer) throw new Error('About hero layers were not rendered')

    expect(
      textLayer.compareDocumentPosition(imageLayer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(imageLayer.className).toContain('lg:w-[72%]')
    expect(headingWords.map((word) => word.textContent)).toEqual(['ABOUT', 'ME'])
    headingWords.forEach((word) => expect(word.className).toContain('whitespace-nowrap'))
    expect(container.querySelector('[data-reveal-name="about-hero-image"]')).not.toBeNull()
    expect(container.querySelector('[data-reveal-name="about-hero-rule"]')).not.toBeNull()
    expect(container.querySelector('[data-reveal-name="about-hero-intro"]')).not.toBeNull()
    expect(container.querySelector('[data-reveal-name="about-hero-image-label"]')).not.toBeNull()
  })

  it('keeps the framed fallback when the media relationship is not populated', () => {
    render(
      <AboutHero
        intro="Developer, diver and photographer"
        media={10}
        name="ABOUT ME"
        type="aboutHero"
      />,
    )

    expect(screen.queryByTestId('about-media')).toBeNull()
    expect(screen.getByTestId('about-hero').getAttribute('data-has-image')).toBe('false')
    expect(screen.getByTestId('about-hero-image-frame')).not.toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })
})
