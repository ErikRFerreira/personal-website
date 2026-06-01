/**
 * @file Lens photo detail page.
 * Renders a full-page view for a single lens photo, including a hero image,
 * technical metadata, print options, full story accordion, and related photos.
 *
 * Supports Next.js static generation at build time (via generateStaticParams)
 * and Payload draft-mode preview for editors.
 */
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

/**
 * Generates static params for all published lens photos to enable static generation of their pages.
 *
 * @returns An array of objects containing the slug for each published lens photo, used to generate static pages.
 * @remarks This function fetches all published lens photos from the Payload CMS and extracts their slugs to create the necessary parameters for static page generation in Next.js.
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/generating-static-params
 */
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all published lens photos to get their slugs for static generation
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

  // Map the fetched photos to an array of params objects containing only the slug
  return photos.docs.map(({ slug }) => {
    return { slug }
  })
}

/** Route params passed by Next.js to the page. `params` is a Promise in the App Router (Next.js 15+). */
type Args = {
  params: Promise<{
    slug?: string
  }>
}

/**
 * Lens photo detail page component.
 *
 * Awaits the route params, URL-decodes the slug, and fetches the matching
 * lens document from Payload. Renders a structured layout composed of:
 * - `LensHero`          — full-width hero image
 * - `LensTechnicalMeta` — camera/EXIF metadata
 * - `LensPrintOptions`  — sticky right-column print acquisition panel
 * - `LensAccordion`     — expandable full story and licensing sections
 * - `LensRelatedPhotos` — related photos from the same series
 *
 * Returns a plain fallback div when no matching document is found.
 */
export default async function LensPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  // Decode URL-encoded characters (e.g. spaces, special chars) in the slug
  const decodedSlug = decodeURIComponent(slug)

  const lens = await queryLensBySlug({ slug: decodedSlug })

  if (!lens) {
    return <div>Lens photo not found</div>
  }

  // `photo` is a relationship field — Payload populates it as an object at depth >= 1.
  // Guard against the unpopulated case where it would be a plain ID string.
  const photo = typeof lens.photo === 'object' ? (lens.photo as MediaType) : null

  // Build a breadcrumb string from available contextual fields, separated by " // "
  // e.g. "Tokyo Series // Shibuya // 2024"
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

/**
 * Fetches a single lens document by its slug.
 *
 * Wrapped in React's `cache()` so that multiple calls with the same slug
 * within a single render pass share one database round-trip.
 *
 * Draft-mode behaviour:
 * - When draft mode is active (Payload preview), `overrideAccess: true` is used
 *   so editors can see unpublished documents, and the `status` filter is omitted.
 * - When draft mode is inactive (public), `overrideAccess: false` enforces access
 *   control and restricts results to published documents only.
 *
 * `depth: 2` ensures relationship fields (e.g. `photo`, `relatedPhotos`) are
 * fully populated rather than returned as bare IDs.
 *
 * @returns The matching `Len` document, or `null` if not found.
 */
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
