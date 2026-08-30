import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Header } from '@/payload-types'
import { HeaderNav } from '@/Header/Nav'
import { HeroPanel } from '@/heros/PortfolioHero/HeroPanel'

vi.mock('ogl', () => ({
  Color: class {},
  Mesh: class {},
  Program: class {},
  Renderer: class {
    constructor() {
      throw new Error('WebGL is unavailable in jsdom')
    }
  },
  Triangle: class {},
}))

afterEach(cleanup)

describe('shared CTA links', () => {
  it('renders only flagged header items with the compact specular CTA', () => {
    const data = {
      navItems: [
        {
          isCta: false,
          link: { label: 'Work', type: 'custom', url: '/projects' },
        },
        {
          isCta: true,
          link: {
            label: 'About',
            reference: { relationTo: 'pages', value: { slug: 'about' } },
            type: 'reference',
          },
        },
        {
          isCta: true,
          link: { label: 'Contact', newTab: true, type: 'custom', url: '/contact' },
        },
      ],
    } as Header

    const { getByRole } = render(<HeaderNav data={data} />)
    const standardLink = getByRole('link', { name: 'Work' })
    const referenceCta = getByRole('link', { name: 'About' })
    const ctaLink = getByRole('link', { name: 'Contact' })

    expect(standardLink.classList.contains('specular-button')).toBe(false)
    expect(referenceCta.classList.contains('specular-button')).toBe(true)
    expect(referenceCta.getAttribute('href')).toBe('/about')
    expect(ctaLink.classList.contains('specular-button')).toBe(true)
    expect(ctaLink.classList.contains('specular-button--sm')).toBe(true)
    expect(ctaLink.getAttribute('href')).toBe('/contact')
    expect(ctaLink.getAttribute('target')).toBe('_blank')
    expect(ctaLink.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders both hero CTA variants as medium specular links', () => {
    const handlers = {
      onPanelFocus: vi.fn(),
      onPanelLeave: vi.fn(),
    }
    const { getByRole, rerender } = render(
      <HeroPanel
        {...handlers}
        headingLevel="h1"
        link={{ label: 'Explore Lens', type: 'custom', url: '/lens' }}
        playbackActive={false}
        side="lens"
      />,
    )

    const lensCta = getByRole('link', { name: 'Explore Lens' })
    expect(lensCta.classList.contains('specular-button--md')).toBe(true)
    expect(lensCta.getAttribute('href')).toBe('/lens')
    expect(lensCta.querySelector('svg')).not.toBeNull()

    rerender(<HeroPanel {...handlers} headingLevel="h2" playbackActive={false} side="dev" />)

    const devCta = getByRole('link', { name: 'See Dev Work' })
    expect(devCta.classList.contains('specular-button--md')).toBe(true)
    expect(devCta.getAttribute('href')).toBe('/projects')
  })
})
