import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { CSSProperties } from 'react'
import type { Payload } from 'payload'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LensCategoryChips } from '@/app/(frontend)/lens/[slug]/LensCategoryChips'
import { LensDigitalPurchase } from '@/app/(frontend)/lens/[slug]/LensDigitalPurchase'
import { LensEditorial } from '@/app/(frontend)/lens/[slug]/LensEditorial'
import { LensPurchaseOptions } from '@/app/(frontend)/lens/[slug]/LensPurchaseOptions'
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

  it('omits print purchasing when no print format is offered', () => {
    const { container } = render(<LensPurchaseOptions />)
    expect(container.innerHTML).toBe('')
  })

  it('lists real print variants and prices without purchase actions', () => {
    render(
      <LensPurchaseOptions
        printOptions={[
          { id: 'small', material: 'Fine art paper', price: 750, size: '40 × 60 cm' },
          { id: 'large', material: 'Aluminium', price: 1250, size: '60 × 90 cm' },
        ]}
      />,
    )

    expect(screen.getByText('€750.00')).not.toBeNull()
    expect(screen.getByText('€1,250.00')).not.toBeNull()
    expect(screen.getByText('Aluminium')).not.toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('only renders digital purchasing when it is enabled', () => {
    const { rerender } = render(
      <LensDigitalPurchase digitalPrice={95} digitalPurchaseEnabled={false} />,
    )

    expect(screen.queryByTestId('lens-digital-purchase')).toBeNull()

    rerender(<LensDigitalPurchase digitalPurchaseEnabled />)
    expect(screen.getByTestId('lens-digital-purchase')).not.toBeNull()
    expect(screen.getByText('Available as digital download')).not.toBeNull()
    expect(screen.queryByRole('link', { name: /buy digital download/i })).toBeNull()
  })

  it('renders populated digital metadata, checkout, and commercial inquiry', () => {
    render(
      <LensDigitalPurchase
        commercialLicensingEnabled
        commercialLicensingText="Commercial use or publication?"
        digitalCheckoutUrl="https://example.com/checkout"
        digitalCurrency="EUR"
        digitalDimensions="5568 × 3712 px"
        digitalFileSize="18 MB"
        digitalFormat="JPEG"
        digitalLicenseType="Personal use"
        digitalPrice={18}
        digitalPurchaseEnabled
      />,
    )

    expect(screen.getByText('€18')).not.toBeNull()
    expect(screen.getByText('EUR')).not.toBeNull()
    expect(screen.getByText('Full-resolution JPEG')).not.toBeNull()
    expect(screen.getByText('5568 × 3712 px')).not.toBeNull()
    expect(screen.getByText('18 MB')).not.toBeNull()
    expect(screen.getByText('Personal use')).not.toBeNull()

    const checkout = screen.getByRole('link', { name: /buy digital download/i })
    const purchaseSection = screen.getByTestId('lens-digital-purchase')
    const contentOrder = [
      'Available as digital download',
      '€18',
      'Full-resolution JPEG',
      '5568 × 3712 px',
      '18 MB',
      'Personal use',
      'Buy digital download',
      'Commercial use or publication?',
      'Request a license',
    ].map((content) => purchaseSection.textContent?.indexOf(content) ?? -1)

    expect(contentOrder.every((position) => position >= 0)).toBe(true)
    expect(contentOrder).toEqual([...contentOrder].sort((a, b) => a - b))
    expect(checkout.getAttribute('href')).toBe('https://example.com/checkout')
    expect(checkout.getAttribute('target')).toBe('_blank')
    expect(checkout.getAttribute('rel')).toBe('noopener noreferrer')
    expect(screen.getByRole('link', { name: 'Request a license' }).getAttribute('href')).toBe(
      '/contact',
    )
  })

  it('omits empty digital metadata without leaving empty rows', () => {
    render(
      <LensDigitalPurchase
        commercialLicensingEnabled={false}
        digitalCurrency="GBP"
        digitalPrice={18.5}
        digitalPurchaseEnabled
      />,
    )

    expect(screen.getByText('£18.50')).not.toBeNull()
    expect(screen.queryByText('Dimensions')).toBeNull()
    expect(screen.queryByText('File size')).toBeNull()
    expect(screen.queryByText('License')).toBeNull()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('keeps print and digital purchase areas independent', () => {
    render(
      <>
        <LensDigitalPurchase digitalPrice={45} digitalPurchaseEnabled />
        <LensPurchaseOptions printOptions={[{ size: '30 × 40 cm' }]} />
      </>,
    )

    expect(screen.getByTestId('lens-print-options')).not.toBeNull()
    expect(screen.getByTestId('lens-digital-purchase')).not.toBeNull()
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
    const { container, rerender } = render(<LensEditorial />)
    expect(container.innerHTML).toBe('')

    rerender(<LensRelatedPhotos collection={makeSeries()} photos={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders licensing without empty story or marketplace copy', () => {
    render(<LensEditorial digitalLicenseDescription="Editorial use only." />)

    expect(screen.getByRole('heading', { name: 'Licensing' })).not.toBeNull()
    expect(screen.getByText('Editorial use only.')).not.toBeNull()
    expect(screen.queryByText('Shipping & Returns')).toBeNull()
    expect(screen.queryByText('Story Behind the Shot')).toBeNull()
  })

  it('uses the restrained licensing fallback without duplicating the purchase inquiry', () => {
    const { rerender } = render(<LensEditorial commercialLicensingEnabled digitalPurchaseEnabled />)

    expect(
      screen.getByText(
        'Digital purchases include a personal-use license. Copyright remains with the photographer. Commercial, editorial and promotional use requires a separate license.',
      ),
    ).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'Request a license' })).toBeNull()

    rerender(
      <LensEditorial
        commercialLicensingEnabled
        digitalLicenseDescription="Editorial use only."
        digitalPurchaseEnabled={false}
      />,
    )
    expect(screen.getByRole('link', { name: 'Request a license' }).getAttribute('href')).toBe(
      '/contact',
    )
    expect(
      screen.getByText('Need commercial, editorial, or promotional rights?', { exact: false }),
    ).not.toBeNull()
  })

  it('renders one commercial inquiry when purchase and editorial licensing are both shown', () => {
    render(
      <>
        <LensDigitalPurchase commercialLicensingEnabled digitalPurchaseEnabled />
        <LensEditorial commercialLicensingEnabled digitalPurchaseEnabled />
      </>,
    )

    expect(screen.getAllByRole('link', { name: 'Request a license' })).toHaveLength(1)
  })

  it('shows the story as expanded editorial content', () => {
    render(<LensEditorial fullStory={{ root: {} } as Len['fullStory']} />)

    expect(screen.getByRole('heading', { name: 'Story Behind the Shot' })).not.toBeNull()
    expect(screen.getByText('Rich story content')).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Story Behind the Shot' })).toBeNull()
  })

  it('shows story and licensing together in the editorial section', () => {
    render(
      <LensEditorial
        digitalLicenseDescription="Personal use only."
        fullStory={{ root: {} } as Len['fullStory']}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Story Behind the Shot' })).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Licensing' })).not.toBeNull()
    expect(screen.getByText('Personal use only.')).not.toBeNull()
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
