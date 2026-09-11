import configPromise from '@payload-config'
import { ArrowLeft } from 'lucide-react'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Category, Media, Series } from '@/payload-types'
import { LensCategoryChips } from './LensCategoryChips'
import { LensDigitalPurchase } from './LensDigitalPurchase'
import { LensEditorial } from './LensEditorial'
import { LensHero } from './LensHero'
import { LensPurchaseOptions } from './LensPurchaseOptions'
import { LensRelatedPhotos } from './LensRelatedPhotos'
import { LensTechnicalMeta } from './LensTechnicalMeta'
import { findRelatedLensPhotos } from './queries'

export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const photos = await payload.find({
    collection: 'lens',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    where: { status: { equals: 'published' } },
  })

  return photos.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function LensPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const lens = await queryLensBySlug({ slug: decodeURIComponent(slug) })

  if (!lens) notFound()

  const photo = typeof lens.photo === 'object' ? (lens.photo as Media) : null
  if (!photo) notFound()

  const collection =
    typeof lens.series === 'object' && lens.series !== null ? (lens.series as Series) : null
  const categories = (lens.categories ?? []).filter(
    (category): category is Category => typeof category === 'object' && category !== null,
  )
  const relatedPhotos = collection
    ? await findRelatedLensPhotos({
        collectionID: collection.id,
        currentPhotoID: lens.id,
        payload: await getPayload({ config: configPromise }),
      })
    : []
  const context = [lens.location?.trim(), lens.year].filter(Boolean).join(' · ')
  const hasLongForm = Boolean(
    lens.fullStory || lens.digitalPurchaseEnabled || lens.digitalLicenseDescription,
  )

  return (
    <main className="lens-detail-page relative isolate overflow-hidden bg-site-surface-deep pt-[var(--header-height)] text-site-text-primary">
      <div aria-hidden="true" className="lens-ambient-layer lens-ambient-layer--detail" />

      <div className="relative z-10">
        <section className="site-container pt-8 pb-6 md:pt-12 md:pb-10">
          <Link
            className="site-meta-label inline-flex items-center gap-2 text-site-text-muted transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
            href="/lens"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Back to Lens archive
          </Link>

          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_clamp(22rem,28vw,26rem)] lg:gap-10 xl:gap-14">
            <div className="min-w-0">
              <LensHero
                location={lens.location}
                metadata={lens.technicalMetadata}
                photo={photo}
                title={lens.title}
                year={lens.year}
              />
            </div>

            <aside className="w-full min-w-0" data-testid="lens-primary-info">
              <header className="pb-5">
                <LensCategoryChips categories={categories} />

                <h1 className="mt-3 text-[2rem] leading-[1.02] font-extrabold tracking-[-0.04em] text-site-text-primary md:text-4xl xl:text-[2.75rem]">
                  {lens.title}
                </h1>

                {context && (
                  <p className="site-caption mt-3 text-site-text-muted uppercase">{context}</p>
                )}

                {lens.intro && (
                  <p className="site-body-small mt-4 text-site-text-secondary">{lens.intro}</p>
                )}
              </header>

              <LensTechnicalMeta metadata={lens.technicalMetadata} />

              <LensDigitalPurchase
                commercialLicensingEnabled={lens.commercialLicensingEnabled}
                commercialLicensingText={lens.commercialLicensingText}
                digitalCheckoutUrl={lens.digitalCheckoutUrl}
                digitalCurrency={lens.digitalCurrency}
                digitalDimensions={lens.digitalDimensions}
                digitalFileSize={lens.digitalFileSize}
                digitalFormat={lens.digitalFormat}
                digitalLicenseType={lens.digitalLicenseType}
                digitalPrice={lens.digitalPrice}
                digitalPurchaseEnabled={lens.digitalPurchaseEnabled}
              />
            </aside>
          </div>

          <LensPurchaseOptions printOptions={lens.printOptions} />
        </section>

        {hasLongForm && (
          <LensEditorial
            commercialLicensingEnabled={lens.commercialLicensingEnabled}
            commercialLicensingText={lens.commercialLicensingText}
            digitalLicenseDescription={lens.digitalLicenseDescription}
            digitalPurchaseEnabled={lens.digitalPurchaseEnabled}
            fullStory={lens.fullStory}
          />
        )}

        {collection && <LensRelatedPhotos collection={collection} photos={relatedPhotos} />}
      </div>
    </main>
  )
}

const queryLensBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'lens',
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft ? [] : [{ status: { equals: 'published' as const } }]),
      ],
    },
  })

  return result.docs[0] ?? null
})
