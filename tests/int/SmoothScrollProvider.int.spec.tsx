import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  destroy: vi.fn(),
  lenisOptions: undefined as unknown,
  raf: vi.fn(),
  scrollCallback: undefined as (() => void) | undefined,
  tickerAdd: vi.fn(),
  tickerCallback: undefined as ((time: number) => void) | undefined,
  tickerLagSmoothing: vi.fn(),
  tickerRemove: vi.fn(),
  triggerRefresh: vi.fn(),
  triggerUpdate: vi.fn(),
  unsubscribe: vi.fn(),
}))

vi.mock('lenis', () => ({
  default: class LenisMock {
    constructor(options: unknown) {
      mocks.lenisOptions = options
    }

    destroy = mocks.destroy
    raf = mocks.raf

    on(_event: string, callback: () => void) {
      mocks.scrollCallback = callback
      return mocks.unsubscribe
    }
  },
}))

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    ticker: {
      add: (callback: (time: number) => void) => {
        mocks.tickerCallback = callback
        mocks.tickerAdd(callback)
      },
      lagSmoothing: mocks.tickerLagSmoothing,
      remove: mocks.tickerRemove,
    },
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    refresh: mocks.triggerRefresh,
    update: mocks.triggerUpdate,
  },
}))

import { SmoothScrollProvider } from '@/providers/SmoothScroll'

describe('SmoothScrollProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.lenisOptions = undefined
    mocks.scrollCallback = undefined
    mocks.tickerCallback = undefined
  })

  it('synchronizes subtle desktop smoothing with ScrollTrigger and cleans up', () => {
    const { getByText, unmount } = render(
      <SmoothScrollProvider>
        <div>Public site</div>
      </SmoothScrollProvider>,
    )

    expect(getByText('Public site')).toBeTruthy()
    expect(mocks.lenisOptions).toEqual({
      anchors: true,
      autoRaf: false,
      lerp: 0.1,
      respectReducedMotion: true,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: false,
    })

    mocks.tickerCallback?.(1.5)
    expect(mocks.raf).toHaveBeenCalledWith(1500)

    mocks.scrollCallback?.()
    expect(mocks.triggerUpdate).toHaveBeenCalledTimes(1)
    expect(mocks.triggerRefresh).toHaveBeenCalledTimes(1)
    expect(mocks.tickerLagSmoothing).toHaveBeenCalledWith(0)

    unmount()

    expect(mocks.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mocks.tickerRemove).toHaveBeenCalledWith(mocks.tickerCallback)
    expect(mocks.tickerLagSmoothing).toHaveBeenLastCalledWith(500, 33)
    expect(mocks.destroy).toHaveBeenCalledTimes(1)
  })
})
