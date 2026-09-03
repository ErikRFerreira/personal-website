/* eslint-disable @next/next/no-img-element */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Media } from '@/payload-types'

const motionState = vi.hoisted(() => ({ reduced: false }))

vi.mock('motion/react', () => ({
  motion: {
    figure: ({
      animate,
      children,
      initial: _initial,
      transition,
      ...props
    }: ComponentPropsWithoutRef<'figure'> & {
      animate: Record<string, unknown>
      children: ReactNode
      initial: boolean
      transition: Record<string, unknown>
    }) => (
      <figure
        {...props}
        data-motion-rotate={String(animate.rotate)}
        data-motion-x={String(animate.x)}
        data-transition-duration={String(transition.duration ?? 'spring')}
      >
        {children}
      </figure>
    ),
  },
}))

vi.mock('@/components/Media', () => ({
  Media: ({ resource }: { resource: Media }) => (
    <img alt={resource.alt || ''} data-testid="cms-hero-image" />
  ),
}))

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

import { HeroImageStack } from '@/heros/ProfileHero/HeroImageStack'

const diverMedia = {
  id: 10,
  alt: 'Erik scuba diving beside a reef',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
} as Media

afterEach(() => {
  cleanup()
  motionState.reduced = false
  vi.unstubAllGlobals()
})

function mockReducedMotion() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      matches: motionState.reduced,
      removeEventListener: vi.fn(),
    })),
  )
}

describe('HeroImageStack', () => {
  it('starts with Diver active and swaps both cards when clicked', () => {
    mockReducedMotion()
    render(<HeroImageStack diverMedia={diverMedia} />)

    const stack = screen.getByTestId('hero-image-stack')
    const control = screen.getByRole('button', { name: /Show Developer image/i })

    expect(stack.getAttribute('data-active-card')).toBe('diver')
    expect(stack.className).toContain('[--hero-stack-offset-x:12px]')
    expect(stack.className).toContain('md:[--hero-stack-offset-x:28px]')
    expect(screen.getByText('01 / DIVER')).not.toBeNull()
    expect(screen.getByText('02 / DEVELOPER')).not.toBeNull()
    expect(screen.getByAltText('Erik scuba diving beside a reef')).not.toBeNull()
    expect(
      screen.getByAltText('Software development workspace displaying project source code'),
    ).not.toBeNull()
    expect(
      document.querySelector('[data-card-identity="diver"]')?.getAttribute('data-card-state'),
    ).toBe('front')
    expect(document.querySelector('[data-card-identity="developer"]')?.className).toContain(
      'border-site-border-active/50',
    )
    expect(
      document
        .querySelector('[data-card-identity="developer"]')
        ?.getAttribute('data-motion-rotate'),
    ).toBe('1.75')
    expect(document.querySelectorAll('[data-hero-image-scrim]')).toHaveLength(2)
    expect(document.querySelector('[data-hero-image-scrim]')?.className).toContain('md:block')

    fireEvent.click(control)

    expect(stack.getAttribute('data-active-card')).toBe('developer')
    expect(screen.getByRole('button', { name: /Show Diver image/i })).not.toBeNull()
    expect(screen.getByText('Developer image active')).not.toBeNull()
    expect(
      document.querySelector('[data-card-identity="developer"]')?.getAttribute('data-card-state'),
    ).toBe('front')
  })

  it('uses CMS developer media and supplies meaningful fallback alt text', () => {
    const developerMedia = {
      id: 11,
      alt: '',
      createdAt: '2026-09-02T00:00:00.000Z',
      updatedAt: '2026-09-02T00:00:00.000Z',
    } as Media

    mockReducedMotion()
    render(<HeroImageStack developerMedia={developerMedia} diverMedia={diverMedia} />)

    expect(screen.getAllByTestId('cms-hero-image')).toHaveLength(2)
    expect(screen.getByAltText('Erik Ferreira working as a software developer')).not.toBeNull()
    expect(
      screen.queryByAltText('Software development workspace displaying project source code'),
    ).toBeNull()
  })

  it('disables card movement when reduced motion is requested', () => {
    motionState.reduced = true
    mockReducedMotion()

    render(<HeroImageStack diverMedia={diverMedia} />)

    expect(screen.getByTestId('hero-image-stack').getAttribute('data-reduced-motion')).toBe('true')
    document.querySelectorAll('[data-transition-duration]').forEach((card) => {
      expect(card.getAttribute('data-transition-duration')).toBe('0')
    })
  })
})
