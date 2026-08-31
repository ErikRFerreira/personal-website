import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { CSSProperties, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  formatLensArchiveCaption,
  LensArchive,
  resolveLensArchiveFormat,
  type LensArchivePhoto,
} from '@/components/LensArchive'
import type { Media } from '@/payload-types'

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, src, style }: { alt: string; src: string; style?: CSSProperties }) => (
    <img alt={alt} src={src} style={style} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

type ObserverRecord = {
  callback: IntersectionObserverCallback
  element?: Element
}

const observers: ObserverRecord[] = []

function makeMedia(id: number, overrides: Partial<Media> = {}): Media {
  return {
    alt: `Photo ${id}`,
    createdAt: '2026-01-01T00:00:00.000Z',
    height: 800,
    id,
    updatedAt: '2026-01-01T00:00:00.000Z',
    url: `/media/photo-${id}.jpg`,
    width: 1200,
    ...overrides,
  }
}

function makePhoto(id: number, overrides: Partial<LensArchivePhoto> = {}): LensArchivePhoto {
  return {
    archiveFormat: 'auto',
    id,
    location: 'Red Sea',
    photo: makeMedia(id),
    series: 'Underwater',
    slug: `photo-${id}`,
    title: `Photo ${id}`,
    year: 2025,
    ...overrides,
  }
}

describe('LensArchive', () => {
  beforeEach(() => {
    observers.length = 0

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      }),
    )

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (callback: IntersectionObserverCallback) {
        const record: ObserverRecord = { callback }
        observers.push(record)

        return {
          disconnect: vi.fn(),
          observe: vi.fn((element: Element) => {
            record.element = element
          }),
          takeRecords: vi.fn(),
          unobserve: vi.fn(),
        }
      }),
    )
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('formats captions without leaving empty separators', () => {
    expect(formatLensArchiveCaption(makePhoto(1))).toBe('Underwater · Red Sea, 2025')
    expect(
      formatLensArchiveCaption(makePhoto(2, { location: null, series: null, year: 2024 })),
    ).toBe('2024')
    expect(
      formatLensArchiveCaption(makePhoto(3, { location: 'Cenote', series: ' ', year: null })),
    ).toBe('Cenote')
  })

  it('detects image orientation and respects an editorial override', () => {
    expect(
      resolveLensArchiveFormat(makePhoto(1, { photo: makeMedia(1, { height: 1200, width: 800 }) })),
    ).toBe('portrait')
    expect(
      resolveLensArchiveFormat(makePhoto(2, { photo: makeMedia(2, { height: 600, width: 1600 }) })),
    ).toBe('panorama')
    expect(
      resolveLensArchiveFormat(
        makePhoto(3, {
          archiveFormat: 'square',
          photo: makeMedia(3, { height: 1200, width: 800 }),
        }),
      ),
    ).toBe('square')
  })

  it('swaps the first pair layout when portrait and landscape order is reversed', () => {
    const photos = [
      makePhoto(1, {
        photo: makeMedia(1, { focalX: 25, focalY: 75, height: 1200, width: 800 }),
      }),
      makePhoto(2, { photo: makeMedia(2, { height: 800, width: 1200 }) }),
    ]

    const { container } = render(<LensArchive docs={photos} hasNextPage={false} nextPage={null} />)
    const articles = container.querySelectorAll('article')

    expect(articles[0].classList.contains('md:col-span-4')).toBe(true)
    expect(articles[0].classList.contains('md:mt-20')).toBe(true)
    expect(articles[1].classList.contains('md:col-span-8')).toBe(true)
    expect(articles[1].classList.contains('md:mt-20')).toBe(false)
    expect(articles[0].querySelector('[data-archive-format="portrait"]')).not.toBeNull()
    expect(articles[1].querySelector('[data-archive-format="landscape"]')).not.toBeNull()
    expect(screen.getByRole('img', { name: 'Photo 1' }).style.objectPosition).toBe('25% 75%')
  })

  it('renders the five-item editorial pattern with accessible links and alt fallbacks', () => {
    const photos = Array.from({ length: 5 }, (_, index) =>
      makePhoto(index + 1, index === 0 ? { photo: { ...makeMedia(1), alt: null } } : {}),
    )

    const { container } = render(<LensArchive docs={photos} hasNextPage={false} nextPage={null} />)

    const articles = container.querySelectorAll('article')
    expect(articles).toHaveLength(5)
    expect(articles[0].classList.contains('md:col-span-8')).toBe(true)
    expect(articles[1].classList.contains('md:col-span-4')).toBe(true)
    expect(articles[1].classList.contains('md:mt-20')).toBe(true)
    expect(articles[2].classList.contains('md:col-span-12')).toBe(true)
    expect(articles[3].classList.contains('md:col-span-6')).toBe(true)
    expect(articles[4].classList.contains('md:col-span-6')).toBe(true)
    expect(articles[4].classList.contains('md:mt-30')).toBe(true)
    expect(container.querySelectorAll('[data-archive-frame="true"]')).toHaveLength(3)
    expect(articles[2].querySelector('[data-archive-frame="true"]')).not.toBeNull()
    expect(articles[3].querySelector('[data-archive-frame="true"]')).toBeNull()
    expect(screen.getByRole('img', { name: 'Photo 1' })).not.toBeNull()
    expect(screen.getByRole('link', { name: /Photo 3/i }).getAttribute('href')).toBe(
      '/lens/photo-3',
    )
  })

  it('loads one page per sentinel intersection and appends new photographs', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ docs: [makePhoto(2)], hasNextPage: false, nextPage: null }),
      ok: true,
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<LensArchive docs={[makePhoto(1)]} hasNextPage nextPage={2} />)

    const sentinelObserver = observers.find(({ element }) => element?.tagName === 'DIV')
    expect(sentinelObserver).toBeDefined()

    act(() => {
      sentinelObserver?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
      sentinelObserver?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 2, name: 'Photo 2' })).not.toBeNull(),
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/next/lens?page=2')
  })

  it('offers a retry after a loading failure', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({
        json: async () => ({ docs: [makePhoto(2)], hasNextPage: false, nextPage: null }),
        ok: true,
      })
    vi.stubGlobal('fetch', fetchMock)

    render(<LensArchive docs={[makePhoto(1)]} hasNextPage nextPage={2} />)

    const sentinelObserver = observers.find(({ element }) => element?.tagName === 'DIV')
    act(() => {
      sentinelObserver?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    const retry = await screen.findByRole('button', { name: 'Retry loading photographs' })
    fireEvent.click(retry)

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 2, name: 'Photo 2' })).not.toBeNull(),
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
