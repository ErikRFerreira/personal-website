import configPromise from '@payload-config'
import { ArrowLeft } from 'lucide-react'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Category, Media, Series } from '@/payload-types'
import { LensCategoryChips } from './LensCategoryChips'
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
  const context = [lens.location?.trim(), lens.year].filter(Boolean).join(' / ')
  const hasLongForm = Boolean(lens.fullStory || lens.licensingText)

  return (
    <main className="lens-detail-page relative isolate overflow-hidden bg-site-surface-base pt-[var(--header-height)] text-site-text-primary">
      <div aria-hidden="true" className="lens-ambient-layer lens-ambient-layer--detail" />

      <div className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pt-8 pb-6 md:px-10 md:pt-12 md:pb-10">
          <Link
            className="inline-flex items-center gap-2 font-mono text-[0.625rem] font-semibold tracking-[0.12em] text-site-text-muted uppercase transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
            href="/lens"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Back to Lens archive
          </Link>

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <LensHero
                collectionName={collection?.name}
                location={lens.location}
                metadata={lens.technicalMetadata}
                photo={photo}
                title={lens.title}
                year={lens.year}
              />
            </div>

            <aside className="space-y-6 lg:col-span-4 lg:pt-1" data-testid="lens-primary-info">
              <header>
                {collection && (
                  <div className="mb-5 flex items-center gap-3">
                    <span aria-hidden="true" className="h-px w-6 bg-site-accent" />
                    <p className="font-mono text-[0.625rem] font-semibold tracking-[0.16em] text-site-accent uppercase">
                      {collection.name}
                    </p>
                  </div>
                )}

                <h1 className="text-4xl leading-[1.02] font-extrabold tracking-[-0.04em] text-site-text-primary xl:text-5xl">
                  {lens.title}
                </h1>

                {context && (
                  <p className="mt-4 font-mono text-[0.625rem] font-semibold tracking-[0.1em] text-site-text-muted uppercase">
                    {context}
                  </p>
                )}

                {lens.intro && (
                  <p className="mt-6 text-sm leading-[1.75] text-site-text-secondary xl:text-base">
                    {lens.intro}
                  </p>
                )}
              </header>

              <LensTechnicalMeta metadata={lens.technicalMetadata} />
              <LensCategoryChips categories={categories} />
            </aside>
          </div>

          <LensPurchaseOptions
            digitalDownload={lens.digitalDownload}
            printOptions={lens.printOptions}
          />
        </section>

        {hasLongForm && (
          <LensEditorial fullStory={lens.fullStory} licensingText={lens.licensingText} />
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
