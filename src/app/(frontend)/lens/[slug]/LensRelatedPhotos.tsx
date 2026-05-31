import React from 'react'
import Link from 'next/link'

import type { Len, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = {
  series?: string | null
  relatedPhotos?: (number | Len)[] | null
}

export const LensRelatedPhotos: React.FC<Props> = ({ series, relatedPhotos }) => {
  const photos = (relatedPhotos ?? []).filter((p): p is Len => typeof p === 'object')
  const showPlaceholders = photos.length === 0

  return (
    <section className="portfolio-section py-20">
      <div className="portfolio-container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <span
              className="portfolio-eyebrow"
              style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 600 }}
            >
              From the Same Collection
            </span>
            {series && (
              <h2
                className="text-[var(--portfolio-text-primary)] font-bold"
                style={{ fontSize: '32px', lineHeight: '1.2' }}
              >
                {series}
              </h2>
            )}
          </div>
          <Link
            href="/lens"
            className="text-[var(--portfolio-text-secondary)] hover:text-[var(--portfolio-text-primary)] portfolio-transition text-sm"
            style={{ letterSpacing: '0.04em' }}
          >
            Explore Collection
          </Link>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showPlaceholders ? (
            <>
              <PlaceholderCard />
              <PlaceholderCard />
              <PlaceholderCard />
            </>
          ) : (
            photos.slice(0, 3).map((photo) => <RelatedPhotoCard key={photo.id} photo={photo} />)
          )}
        </div>
      </div>
    </section>
  )
}

function RelatedPhotoCard({ photo }: { photo: Len }) {
  const photoMedia = typeof photo.photo === 'object' ? (photo.photo as MediaType) : null

  return (
    <Link href={`/lens/${photo.slug}`} className="group block">
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {photoMedia ? (
          <Media
            resource={photoMedia}
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[var(--portfolio-surface-elevated)]" />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'var(--portfolio-overlay-image-dark)' }}
        />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        {photo.series && (
          <span
            className="portfolio-eyebrow"
            style={{ fontSize: '10px', letterSpacing: '0.12em', fontWeight: 600 }}
          >
            {photo.series}
          </span>
        )}
        <span className="text-[var(--portfolio-text-primary)] text-sm font-medium">
          {photo.title}
        </span>
      </div>
    </Link>
  )
}

function PlaceholderCard() {
  return (
    <div>
      <div
        className="w-full bg-[var(--portfolio-surface-elevated)] border border-[var(--portfolio-border-subtle)]"
        style={{ aspectRatio: '4/3' }}
      />
      <div className="mt-3 flex flex-col gap-2">
        <div className="h-2 w-20 bg-[var(--portfolio-border-subtle)] rounded-none" />
        <div className="h-3 w-32 bg-[var(--portfolio-surface-elevated)] rounded-none" />
      </div>
    </div>
  )
}
