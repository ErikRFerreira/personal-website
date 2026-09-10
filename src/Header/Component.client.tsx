'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false)

    if (restoreFocus) {
      window.setTimeout(() => toggleRef.current?.focus(), 0)
    }
  }, [])

  const closeMenuAfterNavigation = useCallback(() => {
    window.setTimeout(() => closeMenu(false), 0)
  }, [closeMenu])

  useEffect(() => {
    setHeaderTheme(null)
    setMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const mobileBreakpoint = window.matchMedia('(width >= 40rem)')
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu(false)
    }

    mobileBreakpoint.addEventListener('change', handleBreakpointChange)
    return () => mobileBreakpoint.removeEventListener('change', handleBreakpointChange)
  }, [closeMenu])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
    }, 0)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab') return

      const links = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || [],
      )
      const focusableElements = toggleRef.current ? [toggleRef.current, ...links] : links

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [closeMenu, menuOpen])

  return (
    <>
      <header
        className={[
          'top-0 left-0 z-20 w-full transition-all duration-300',
          scrolled || menuOpen
            ? 'fixed bg-site-surface-deep/95 text-site-text-primary shadow-lg backdrop-blur-md'
            : 'absolute bg-black/10 backdrop-blur-sm text-white',
        ].join(' ')}
        style={{ height: 'var(--header-height)' }}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="container relative z-10 flex h-full items-center justify-between">
          <Link aria-label="Home" href="/" onClick={() => menuOpen && closeMenuAfterNavigation()}>
            <Logo className="hidden sm:flex" />
            <span
              aria-hidden="true"
              className="font-serif text-sm font-light tracking-[0.18em] uppercase sm:hidden"
            >
              EF
            </span>
          </Link>
          <HeaderNav className="hidden sm:flex" data={data} />
          <button
            ref={toggleRef}
            aria-controls="mobile-header-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="relative flex size-11 items-center justify-center text-site-text-primary sm:hidden"
            data-state={menuOpen ? 'open' : 'closed'}
            onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            type="button"
          >
            <span className="relative block h-5 w-6" aria-hidden="true">
              <span
                className={[
                  'mobile-header-toggle-line absolute top-0.5 left-0 h-px w-full bg-current transition-transform duration-300',
                  menuOpen ? 'translate-y-2 rotate-45' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'mobile-header-toggle-line absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current transition-opacity duration-200',
                  menuOpen ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
              />
              <span
                className={[
                  'mobile-header-toggle-line absolute bottom-0.5 left-0 h-px w-full bg-current transition-transform duration-300',
                  menuOpen ? '-translate-y-2 -rotate-45' : '',
                ].join(' ')}
              />
            </span>
          </button>
        </div>
      </header>
      <div
        ref={menuRef}
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
        aria-modal="true"
        className={[
          'mobile-header-menu fixed inset-0 z-10 flex min-h-svh bg-site-surface-deep px-6 pt-[calc(var(--header-height)+2rem)] pb-6 text-site-text-primary transition-transform duration-300 ease-out sm:hidden',
          menuOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full',
        ].join(' ')}
        data-state={menuOpen ? 'open' : 'closed'}
        data-testid="mobile-header-menu"
        id="mobile-header-menu"
        inert={!menuOpen}
        role="dialog"
      >
        <HeaderNav
          className="w-full flex-col items-center gap-8"
          data={data}
          linkClassName="justify-center text-xl font-normal"
          onNavigate={closeMenuAfterNavigation}
          renderCtasAsLinks
        />
      </div>
    </>
  )
}
