import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HeaderClient } from '@/Header/Component.client'
import type { Header } from '@/payload-types'

const navigation = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
}))

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

const headerData = {
  navItems: [
    { isCta: false, link: { label: 'Work', type: 'custom', url: '/projects' } },
    { isCta: false, link: { label: 'About', type: 'custom', url: '/about' } },
    { isCta: true, link: { label: 'Inquire', type: 'custom', url: '/contact' } },
  ],
} as Header

let breakpointListener: ((event: MediaQueryListEvent) => void) | undefined

beforeEach(() => {
  navigation.pathname = '/'
  breakpointListener = undefined
  vi.stubGlobal('matchMedia', (query: string) => ({
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      breakpointListener = listener
    },
    dispatchEvent: () => true,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
  }))
})

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
  vi.unstubAllGlobals()
})

describe('mobile header navigation', () => {
  it('opens accessibly, locks scrolling, traps focus, and closes with Escape', async () => {
    render(<HeaderClient data={headerData} />)

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    const menu = screen.getByTestId('mobile-header-menu')

    expect(toggle.getAttribute('aria-controls')).toBe('mobile-header-menu')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(toggle.getAttribute('data-state')).toBe('closed')
    expect(menu.getAttribute('aria-hidden')).toBe('true')

    fireEvent.click(toggle)

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(toggle.getAttribute('data-state')).toBe('open')
    expect(toggle.getAttribute('aria-label')).toBe('Close menu')
    expect(menu.getAttribute('aria-hidden')).toBe('false')
    expect(document.body.style.overflow).toBe('hidden')
    expect(within(menu).getByRole('link', { name: 'Inquire' }).classList).not.toContain(
      'specular-button',
    )
    await waitFor(() =>
      expect(document.activeElement).toBe(within(menu).getByRole('link', { name: 'Work' })),
    )

    const links = within(menu).getAllByRole('link')
    links[links.length - 1].focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(toggle)

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(toggle.getAttribute('aria-expanded')).toBe('false'))
    await waitFor(() => expect(document.activeElement).toBe(toggle))
    expect(document.body.style.overflow).toBe('')
  })

  it('closes after navigation and when crossing the desktop breakpoint', async () => {
    render(<HeaderClient data={headerData} />)

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    const menu = screen.getByTestId('mobile-header-menu')

    fireEvent.click(toggle)
    fireEvent.click(within(menu).getByRole('link', { name: 'About' }))
    await waitFor(() => expect(menu.getAttribute('data-state')).toBe('closed'))
    expect(document.body.style.overflow).toBe('')

    fireEvent.click(toggle)
    breakpointListener?.({ matches: true } as MediaQueryListEvent)
    await waitFor(() => expect(menu.getAttribute('data-state')).toBe('closed'))
  })

  it('closes when the current pathname changes', async () => {
    const { rerender } = render(<HeaderClient data={headerData} />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    navigation.pathname = '/about'
    rerender(<HeaderClient data={headerData} />)

    await waitFor(() =>
      expect(screen.getByTestId('mobile-header-menu').getAttribute('data-state')).toBe('closed'),
    )
  })
})
