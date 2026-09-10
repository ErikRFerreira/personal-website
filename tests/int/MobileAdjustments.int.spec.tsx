import { cleanup, render, screen } from '@testing-library/react'
import { readFile } from 'node:fs/promises'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/components/ScrollReveal', () => ({
  default: ({
    children,
    containerClassName,
  }: {
    children: ReactNode
    containerClassName?: string
  }) => <div className={containerClassName}>{children}</div>,
}))

vi.mock('@/components/Media', () => ({
  Media: () => <span aria-hidden="true" data-testid="mobile-adjustment-media" />,
}))

vi.mock('@/components/CtaButton', () => ({
  CtaButton: ({ label }: { label?: string }) => <span>{label}</span>,
}))

vi.mock('@/utilities/getGlobals', () => ({
  getCachedGlobal: () => async () => ({
    navItems: [{ link: { label: 'Projects', type: 'custom', url: '/projects' } }],
  }),
}))

vi.mock('@/components/Link', () => ({
  CMSLink: ({ className, label, url }: { className?: string; label: string; url: string }) => (
    <a className={className} href={url}>
      {label}
    </a>
  ),
}))

vi.mock('@/components/Logo/Logo', () => ({
  Logo: () => <span>Erik Ferreira</span>,
}))

import { DisciplinesBlock } from '@/blocks/Disciplines/Component'
import HomeBio from '@/blocks/HomeBio/Component'
import { RevealText } from '@/blocks/RevealText/Component'
import { Footer } from '@/Footer/Component'

afterEach(cleanup)

describe('mobile layout adjustments', () => {
  it('centers the taller footer on mobile and restores desktop alignment', async () => {
    const { container } = render(await Footer())
    const layout = container.querySelector('footer > div')
    const nav = screen.getByRole('navigation')

    expect(layout?.className).toContain('items-center')
    expect(layout?.className).toContain('py-20')
    expect(layout?.className).toContain('md:items-end')
    expect(layout?.className).toContain('md:py-16')
    expect(nav.className).toContain('justify-center')
    expect(nav.className).toContain('md:justify-end')
  })

  it('centers HomeBio content below the tablet breakpoint', () => {
    const props = {
      bio: 'Developer, diver, and photographer.',
      blockType: 'homeBio',
      cta: { label: 'About me', url: '/about' },
      email: 'erik@example.com',
      name: 'Erik Ferreira',
      roles: 'Developer / Diver',
    } as Parameters<typeof HomeBio>[0]

    const { container } = render(<HomeBio {...props} />)
    const card = container.querySelector('[data-home-bio-card="true"]')
    const content = container.querySelector('[data-home-bio-content="true"]')
    const actions = container.querySelector('[data-home-bio-actions="true"]')

    expect(card?.className).toContain('px-8')
    expect(card?.className).toContain('py-12')
    expect(card?.className).toContain('sm:px-14')
    expect(card?.className).toContain('sm:py-14')
    expect(card?.className).toContain('md:p-12')
    expect(content?.className).toContain('items-center')
    expect(content?.className).toContain('text-center')
    expect(content?.className).toContain('md:items-start')
    expect(content?.className).toContain('md:text-left')
    expect(actions?.className).toContain('mt-4')
    expect(actions?.className).toContain('justify-center')
    expect(actions?.className).toContain('md:justify-start')
    expect(container.querySelector('section')).not.toBeNull()
  })

  it('uses compact mobile spacing for RevealText and restores it at md', () => {
    const props = {
      blockType: 'revealText',
      text: 'Different tools, one perspective.',
    } as Parameters<typeof RevealText>[0]

    const { container } = render(<RevealText {...props} />)
    const section = container.querySelector('section')

    expect(section?.className).toContain('py-32')
    expect(section?.className).toContain('md:py-64')
    expect(section?.className).toContain('lg:py-80')
  })

  it('gives all discipline cards equal mobile sizing without changing md heights', () => {
    const props = {
      blockType: 'disciplines',
      eyebrow: 'Disciplines',
      items: [
        { description: 'Product systems', title: 'Engineering' },
        { description: 'Technical profiles', title: 'Diving' },
        { description: 'Remote environments', title: 'Photography' },
      ],
    } as Parameters<typeof DisciplinesBlock>[0]

    const { container } = render(<DisciplinesBlock {...props} />)
    const cards = [...container.querySelectorAll('[data-discipline-index]')]

    expect(cards).toHaveLength(3)
    cards.forEach((card) => expect(card.className).toContain('min-h-[26rem]'))
    expect(cards[0].className).toContain('md:min-h-[28rem]')
    expect(cards[1].className).toContain('md:min-h-72')
    expect(cards[2].className).toContain('md:min-h-64')
    expect(container.querySelector('.auto-rows-fr')?.className).toContain('md:auto-rows-auto')
  })

  it('keeps the archive and About spacing changes below md only', async () => {
    const [projectsPage, lensPage, aboutHero, formCSS] = await Promise.all([
      readFile('src/app/(frontend)/projects/page.tsx', 'utf8'),
      readFile('src/app/(frontend)/lens/page.tsx', 'utf8'),
      readFile('src/heros/AboutHero/index.tsx', 'utf8'),
      readFile('src/blocks/Form/Form.css', 'utf8'),
    ])

    expect(projectsPage).toContain('pt-36! md:pt-36!')
    expect(lensPage).toContain('pt-36! md:pt-36!')
    expect(aboutHero).toContain('pt-[calc(var(--header-height)+6rem)]')
    expect(aboutHero).toContain('md:pt-[calc(var(--header-height)+5rem)]')
    expect(formCSS).toContain('width: 100%')
    expect(formCSS).toContain('max-width: var(--form-field-width, 100%)')
  })
})
