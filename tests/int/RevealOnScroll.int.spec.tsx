import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RevealOnScroll } from '@/components/RevealOnScroll'
import { getRevealDelay } from '@/utilities/getRevealDelay'

const observer = {
  callback: undefined as IntersectionObserverCallback | undefined,
  disconnect: vi.fn(),
  instances: 0,
  observe: vi.fn(),
  options: undefined as IntersectionObserverInit | undefined,
}

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    observer.callback = callback
    observer.options = options
    observer.instances += 1
  }

  disconnect = observer.disconnect
  observe = observer.observe
  takeRecords = vi.fn(() => [])
  unobserve = vi.fn()
}

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  )
}

describe('RevealOnScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    observer.callback = undefined
    observer.instances = 0
    observer.options = undefined
    mockReducedMotion(false)
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('caps the block stagger delays', () => {
    expect([0, 1, 2, 3, 4].map((index) => getRevealDelay(index, 90, 270))).toEqual([
      0, 90, 180, 270, 270,
    ])
    expect(getRevealDelay(8, 75, 225)).toBe(225)
    expect(getRevealDelay(4, 75, 300)).toBe(300)
  })

  it('reveals once with the archive motion settings and configured delay', () => {
    const { getByTestId } = render(
      <RevealOnScroll delay={180} revealName="test-item">
        <span data-testid="content">Content</span>
      </RevealOnScroll>,
    )

    const content = getByTestId('content')
    const reveal = content.parentElement as HTMLDivElement

    expect(reveal.getAttribute('data-reveal-name')).toBe('test-item')
    expect(reveal.getAttribute('data-reveal-state')).toBe('hidden')
    expect(reveal.className).toContain('translate-y-6')
    expect(reveal.className).toContain('opacity-0')
    expect(reveal.className).toContain('duration-700')
    expect(reveal.style.getPropertyValue('--reveal-delay')).toBe('180ms')
    expect(observer.options).toEqual({
      rootMargin: '0px 0px -8%',
      threshold: 0.08,
    })
    expect(observer.observe).toHaveBeenCalledWith(reveal)

    act(() => {
      observer.callback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver,
      )
    })

    expect(reveal.getAttribute('data-reveal-state')).toBe('visible')
    expect(reveal.className).toContain('translate-y-0')
    expect(reveal.className).toContain('opacity-100')
    expect(observer.disconnect).toHaveBeenCalledTimes(1)

    act(() => {
      observer.callback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver,
      )
    })

    expect(reveal.getAttribute('data-reveal-state')).toBe('visible')
  })

  it('renders immediately when reduced motion is requested', () => {
    mockReducedMotion(true)

    const { getByTestId } = render(
      <RevealOnScroll>
        <span data-testid="content">Content</span>
      </RevealOnScroll>,
    )

    expect(getByTestId('content').parentElement?.getAttribute('data-reveal-state')).toBe('visible')
    expect(observer.instances).toBe(0)
  })

  it('renders immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    const { getByTestId } = render(
      <RevealOnScroll>
        <span data-testid="content">Content</span>
      </RevealOnScroll>,
    )

    expect(getByTestId('content').parentElement?.getAttribute('data-reveal-state')).toBe('visible')
  })
})
