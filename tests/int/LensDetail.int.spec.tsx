import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { CSSProperties } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Payload } from 'payload'

import { LensAccordion } from '@/app/(frontend)/lens/[slug]/LensAccordion'
import { LensCategoryChips } from '@/app/(frontend)/lens/[slug]/LensCategoryChips'
import { LensPrintOptions } from '@/app/(frontend)/lens/[slug]/LensPrintOptions'
import { LensRelatedPhotos } from '@/app/(frontend)/lens/[slug]/LensRelatedPhotos'
import { LensTechnicalMeta } from '@/app/(frontend)/lens/[slug]/LensTechnicalMeta'
import { LensZoomImage } from '@/app/(frontend)/lens/[slug]/LensZoomImage'
import { findRelatedLensPhotos } from '@/app/(frontend)/lens/[slug]/queries'
import type { Len, Media, Series } from '@/payload-types'

vi.mock('next/image', () => ({
  default: ({ alt, src, style }: { alt: string; src: string; style?: CSSProperties }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} style={style} />
  ),
}))

vi.mock('@/components/RichText', () => ({
  default: () => <div>Rich story content</div>,
}))

function makeMedia(id = 1): Media {
  return {
    alt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    height: 800,
    id,
    updatedAt: '2026-01-01T00:00:00.000Z',
    url: `/media/photo-${id}.jpg`,
    width: 1200,
  }
}

function makeSeries(): Series {
  return {
    createdAt: '2026-01-01T00:00:00.000Z',
    id: 4,
    name: 'Philippines',
    slug: 'philippines',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

function makeLens(id = 1): Len {
  return {
    archiveFormat: 'auto',
    createdAt: `2026-01-0${id}T00:00:00.000Z`,
    id,
    photo: makeMedia(id),
    slug: `photo-${id}`,
    status: 'published',
    title: `Photo ${id}`,
    updatedAt: `2026-01-0${id}T00:00:00.000Z`,
  }
}

describe('Lens detail components', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: true,
        media: '(hover: hover) and (pointer: fine)',
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      }),
    )
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows only the compact disabled CTA when print variants are absent', () => {
    render(<LensPrintOptions />)

    expect(
      screen.getByRole('button', { name: 'Print purchases coming soon' }).hasAttribute('disabled'),
    ).toBe(true)
    expect(screen.queryByText('Standard Collector')).toBeNull()
    expect(screen.queryByText('Authenticity guaranteed')).toBeNull()
  })

  it('updates material and EUR price when a print variant is selected', () => {
    render(
      <LensPrintOptions
        printOptions={[
          { id: 'small', material: 'Fine art paper', price: 750, size: '40 × 60 cm' },
          { id: 'large', material: 'Aluminium', price: 1250, size: '60 × 90 cm' },
        ]}
      />,
    )

    expect(screen.getByText('€750.00')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '60 × 90 cm, Aluminium' }))
    expect(screen.getByText('€1,250.00')).not.toBeNull()
    expect(screen.getByText('Aluminium')).not.toBeNull()
  })

  it('renders only populated technical cells and preserves numeric zero', () => {
    render(<LensTechnicalMeta metadata={{ aperture: 'f/2.8', iso: 0 }} />)

    expect(screen.getByText('Aperture')).not.toBeNull()
    expect(screen.getByText('f/2.8')).not.toBeNull()
    expect(screen.getByText('ISO')).not.toBeNull()
    expect(screen.getByText('0')).not.toBeNull()
    expect(screen.queryByText('Camera')).toBeNull()
  })

  it('renders only categories supplied by Payload', () => {
    const { container, rerender } = render(<LensCategoryChips categories={[]} />)
    expect(container.innerHTML).toBe('')

    rerender(
      <LensCategoryChips
        categories={[
          {
            createdAt: '2026-01-01T00:00:00.000Z',
            id: 2,
            slug: 'underwater',
            title: 'Underwater',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ]}
      />,
    )
    expect(screen.getByText('Underwater')).not.toBeNull()
  })

  it('omits empty long-form and related sections without placeholders', () => {
    const { container, rerender } = render(<LensAccordion />)
    expect(container.innerHTML).toBe('')

    rerender(<LensRelatedPhotos collection={makeSeries()} photos={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders only populated long-form rows and no shipping copy', () => {
    render(<LensAccordion licensingText="Editorial use only." />)

    expect(screen.getByRole('button', { name: 'Licensing' })).not.toBeNull()
    expect(screen.queryByText('Shipping & Returns')).toBeNull()
    expect(screen.queryByText('Story Behind the Shot')).toBeNull()
  })

  it('zooms around the pointer and resets on pointer leave', () => {
    const { container } = render(<LensZoomImage photo={makeMedia()} title="Fallback title" />)
    const zoomRoot = container.querySelector<HTMLElement>('[data-zoomed]')
    expect(zoomRoot).not.toBeNull()

    vi.spyOn(zoomRoot!, 'getBoundingClientRect').mockReturnValue({
      bottom: 100,
      height: 100,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    fireEvent.pointerMove(zoomRoot!, { clientX: 50, clientY: 75, pointerType: 'mouse' })
    expect(zoomRoot?.dataset.zoomed).toBe('true')
    expect(zoomRoot?.style.getPropertyValue('--lens-zoom-x')).toBe('25%')
    expect(zoomRoot?.style.getPropertyValue('--lens-zoom-y')).toBe('75%')

    fireEvent.pointerLeave(zoomRoot!, { pointerType: 'mouse' })
    expect(zoomRoot?.dataset.zoomed).toBe('false')
  })
})

describe('findRelatedLensPhotos', () => {
  it('queries the newest three published photos in the same collection', async () => {
    const docs = [makeLens(3), makeLens(2), makeLens(1)]
    const find = vi.fn().mockResolvedValue({ docs })

    const result = await findRelatedLensPhotos({
      collectionID: 4,
      currentPhotoID: 9,
      payload: { find } as unknown as Payload,
    })

    expect(result).toEqual(docs)
    expect(find).toHaveBeenCalledWith({
      collection: 'lens',
      depth: 1,
      limit: 3,
      overrideAccess: false,
      pagination: false,
      sort: '-createdAt',
      where: {
        and: [
          { series: { equals: 4 } },
          { id: { not_equals: 9 } },
          { status: { equals: 'published' } },
        ],
      },
    })
  })
})
