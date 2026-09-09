import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useNearViewport } from '@/hooks/useNearViewport'

let intersectionCallback: IntersectionObserverCallback
const disconnect = vi.fn()
const observe = vi.fn()
const removeMotionListener = vi.fn()

function Probe() {
  const { isNearViewport, prefersReducedMotion, ref } = useNearViewport()

  return (
    <div
      data-near={String(isNearViewport)}
      data-reduced-motion={String(prefersReducedMotion)}
      ref={ref}
    />
  )
}

describe('useNearViewport', () => {
  beforeEach(() => {
    disconnect.mockReset()
    observe.mockReset()
    removeMotionListener.mockReset()

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (callback: IntersectionObserverCallback) {
        intersectionCallback = callback
        return { disconnect, observe, unobserve: vi.fn(), takeRecords: vi.fn(), root: null }
      }),
    )

    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        removeEventListener: removeMotionListener,
        removeListener: vi.fn(),
      })),
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('stays deferred until the observed element approaches the viewport', () => {
    const { container } = render(<Probe />)
    const probe = container.firstElementChild

    expect(probe?.getAttribute('data-near')).toBe('false')
    expect(observe).toHaveBeenCalledTimes(1)

    act(() => {
      intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as never)
    })

    expect(probe?.getAttribute('data-near')).toBe('true')
    expect(disconnect).toHaveBeenCalled()
  })

  it('does not observe effects when reduced motion is requested', async () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      removeEventListener: removeMotionListener,
      removeListener: vi.fn(),
    })

    const { container } = render(<Probe />)

    await act(async () => undefined)

    expect(container.firstElementChild?.getAttribute('data-reduced-motion')).toBe('true')
    expect(observe).not.toHaveBeenCalled()
  })

  it('cleans up its observer and motion listener on unmount', () => {
    const { unmount } = render(<Probe />)

    unmount()

    expect(disconnect).toHaveBeenCalled()
    expect(removeMotionListener).toHaveBeenCalled()
  })
})
