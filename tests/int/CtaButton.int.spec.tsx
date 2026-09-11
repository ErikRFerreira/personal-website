import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { FormEvent } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Header } from '@/payload-types'
import { CtaButton } from '@/components/CtaButton'
import { HeaderNav } from '@/Header/Nav'

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

describe('shared CTA', () => {
  it('uses the standard contact-form size and retains native form semantics', () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault())
    const { getByRole, rerender } = render(
      <form onSubmit={onSubmit}>
        <CtaButton type="submit">
          Send message
        </CtaButton>
      </form>,
    )

    const submitButton = getByRole('button', { name: 'Send message' })
    expect(submitButton.classList.contains('specular-button--md')).toBe(true)
    expect(submitButton.getAttribute('type')).toBe('submit')

    fireEvent.click(submitButton)
    expect(onSubmit).toHaveBeenCalledTimes(1)

    rerender(
      <form onSubmit={onSubmit}>
        <CtaButton disabled type="submit">
          Send message
        </CtaButton>
      </form>,
    )

    fireEvent.click(getByRole('button', { name: 'Send message' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('uses the standard size for links unless the header variant is requested', () => {
    render(
      <div>
        <CtaButton label="View project" type="custom" url="/projects/example" />
        <CtaButton label="Contact" type="custom" url="/contact" variant="header" />
      </div>,
    )

    expect(
      screen.getByRole('link', { name: 'View project' }).classList.contains('specular-button--md'),
    ).toBe(true)
    expect(
      screen.getByRole('link', { name: 'Contact' }).classList.contains('specular-button--sm'),
    ).toBe(true)
  })

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

})
