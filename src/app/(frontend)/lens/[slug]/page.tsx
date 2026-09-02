import configPromise from '@payload-config'
import { Layers3 } from 'lucide-react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Category, Media, Series } from '@/payload-types'
import { LensAccordion } from './LensAccordion'
import { LensCategoryChips } from './LensCategoryChips'
import { LensHero } from './LensHero'
import { LensPrintOptions } from './LensPrintOptions'
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
    <main className="lens-detail-page relative isolate overflow-hidden bg-site-surface-photo pt-[var(--header-height)] text-site-text-primary">
      <div aria-hidden="true" className="lens-ambient-layer lens-ambient-layer--detail" />

      <div className="relative z-10">
        <section className="md:grid md:min-h-[calc(100svh-var(--header-height))] md:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)]">
          <div className="relative flex h-[62svh] min-h-[28rem] items-center justify-center overflow-hidden p-4 sm:p-6 md:h-[calc(100svh-var(--header-height))] md:p-8 xl:p-12">
            <LensHero
              collectionName={collection?.name}
              location={lens.location}
              metadata={lens.technicalMetadata}
              photo={photo}
              title={lens.title}
              year={lens.year}
            />
          </div>

          <aside className="mx-4 mt-4 mb-6 overflow-hidden border border-site-border-subtle bg-site-surface-base/80 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)] backdrop-blur-xl sm:mx-6 md:mx-0 md:my-6 md:h-[calc(100svh-var(--header-height)-3rem)] md:overflow-y-auto md:rounded-r-none md:border-r-0 md:shadow-[-1.5rem_0_4rem_rgba(0,0,0,0.14)]">
            <div className="mx-auto max-w-2xl space-y-8 px-6 py-10 sm:px-8 md:px-9 md:py-12 xl:px-12">
              <header>
                {collection && (
                  <div className="mb-4 flex items-center gap-2 font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-site-accent uppercase">
                    <Layers3 aria-hidden="true" className="size-4" />
                    <span>{collection.name}</span>
                  </div>
                )}

                <h1 className="text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-site-text-primary lg:text-5xl">
                  {lens.title}
                </h1>

                {context && (
                  <p className="mt-4 font-mono text-[0.6875rem] font-semibold tracking-[0.1em] text-site-text-muted uppercase">
                    {context}
                  </p>
                )}

                {lens.intro && (
                  <p className="mt-6 text-base leading-[1.75] text-site-text-secondary">
                    {lens.intro}
                  </p>
                )}
              </header>

              <LensTechnicalMeta metadata={lens.technicalMetadata} location={lens.location} />
              <LensPrintOptions printOptions={lens.printOptions} />

              <LensCategoryChips categories={categories} />
            </div>
          </aside>
        </section>

        {hasLongForm && (
          <section className="site-container py-14 md:py-20">
            <LensAccordion fullStory={lens.fullStory} licensingText={lens.licensingText} />
          </section>
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
