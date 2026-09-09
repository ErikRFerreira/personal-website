import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const gsapMocks = vi.hoisted(() => ({
  context: vi.fn((callback: () => void) => {
    callback()
    return { revert: vi.fn() }
  }),
  fromTo: vi.fn(),
  registerPlugin: vi.fn(),
}))

vi.mock('gsap', () => ({
  gsap: gsapMocks,
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}))

import ScrollReveal from '@/components/ScrollReveal'

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    }),
  )
}

describe('ScrollReveal', () => {
  beforeEach(() => {
    gsapMocks.context.mockClear()
    gsapMocks.fromTo.mockClear()
    stubReducedMotion(false)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('retains its heading default and tokenizes plain strings', () => {
    const { container } = render(<ScrollReveal>Reveal these words</ScrollReveal>)

    expect(screen.getByRole('heading', { name: 'Reveal these words' })).not.toBeNull()
    expect(container.querySelectorAll('.scroll-reveal-word')).toHaveLength(3)
    expect(gsapMocks.fromTo).toHaveBeenCalledTimes(3)
  })

  it('accepts pre-tokenized content in a div and skips a zero rotation tween', () => {
    const { container } = render(
      <ScrollReveal as="div" baseRotation={0}>
        <p>
          <span className="word scroll-reveal-word">Existing</span> content
        </p>
      </ScrollReveal>,
    )

    expect(container.querySelector('[data-scroll-reveal="true"]')?.tagName).toBe('DIV')
    expect(screen.getByText('Existing')).not.toBeNull()
    expect(gsapMocks.fromTo).toHaveBeenCalledTimes(2)
  })

  it('leaves words visible and unblurred when reduced motion is requested', () => {
    stubReducedMotion(true)
    const { container } = render(<ScrollReveal>Always visible</ScrollReveal>)
    const word = container.querySelector<HTMLElement>('.scroll-reveal-word')

    expect(gsapMocks.context).not.toHaveBeenCalled()
    expect(gsapMocks.fromTo).not.toHaveBeenCalled()
    expect(word?.style.opacity).toBe('')
    expect(word?.style.filter).toBe('')
  })
})
