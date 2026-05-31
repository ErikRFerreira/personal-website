import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Len, Media as MediaType } from '@/payload-types'
import { LensHero } from './LensHero'
import { LensTechnicalMeta } from './LensTechnicalMeta'
import { LensPrintOptions } from './LensPrintOptions'
import { LensAccordion } from './LensAccordion'
import { LensRelatedPhotos } from './LensRelatedPhotos'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const photos = await payload.find({
    collection: 'lens',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return photos.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function LensPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const lens = await queryLensBySlug({ slug: decodedSlug })

  if (!lens) {
    return <div>Lens photo not found</div>
  }

  const photo = typeof lens.photo === 'object' ? (lens.photo as MediaType) : null
  const breadcrumb = [lens.series, lens.location, lens.year].filter(Boolean).join(' // ')

  return (
    <div className="portfolio-section" style={{ paddingBlock: 0 }}>
      {/* Full-width hero image */}
      {photo && <LensHero photo={photo} />}

      {/* Main content */}
      <div className="portfolio-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-12 xl:gap-16 items-start">
          {/* Left column */}
          <div>
            {/* Breadcrumb + series link */}
            <div className="flex items-center justify-between mb-6">
              {breadcrumb && (
                <span
                  className="portfolio-eyebrow"
                  style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 600 }}
                >
                  {breadcrumb}
                </span>
              )}
              {lens.series && (
                <a
                  href="/lens"
                  className="text-[var(--portfolio-text-muted)] hover:text-[var(--portfolio-accent)] portfolio-transition"
                  style={{ fontSize: '11px', letterSpacing: '0.08em', textDecoration: 'none' }}
                >
                  View Full Series
                </a>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-[var(--portfolio-text-primary)] font-bold"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: '1.15',
                letterSpacing: '-0.02em',
              }}
            >
              {lens.title}
            </h1>

            {/* Cyan divider */}
            <div
              className="mt-5 mb-6"
              style={{ height: '2px', width: '3rem', background: 'var(--portfolio-accent)' }}
            />

            {/* Intro / caption */}
            {lens.intro && (
              <p
                className="text-[var(--portfolio-text-secondary)] leading-relaxed"
                style={{ fontSize: '1rem', lineHeight: '1.7' }}
              >
                {lens.intro}
              </p>
            )}

            {/* Technical metadata */}
            {lens.technicalMetadata && (
              <LensTechnicalMeta metadata={lens.technicalMetadata} location={lens.location} />
            )}
          </div>

          {/* Right column — print acquisition */}
          <div className="md:sticky md:top-24">
            <LensPrintOptions printOptions={lens.printOptions} />
          </div>
        </div>

        {/* Accordion */}
        <div className="mt-12 md:mt-16">
          <LensAccordion fullStory={lens.fullStory} licensingText={lens.licensingText} />
        </div>
      </div>

      {/* Related photos */}
      <LensRelatedPhotos series={lens.series} relatedPhotos={lens.relatedPhotos} />
    </div>
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
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft
          ? []
          : [
              {
                status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return result.docs?.[0] || null
})
