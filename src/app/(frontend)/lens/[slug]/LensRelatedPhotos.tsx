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
    <section className="site-section py-20">
      <div className="site-container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] leading-[1.2] font-semibold tracking-[0.12em] text-site-accent uppercase">
              From the Same Collection
            </span>
            {series && (
              <h2 className="text-3xl leading-tight font-bold text-site-text-primary">{series}</h2>
            )}
          </div>
          <Link
            href="/lens"
            className="text-sm tracking-[0.04em] text-site-text-secondary transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-out hover:text-site-text-primary motion-reduce:transition-none"
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
      <div className="relative aspect-[4/3] overflow-hidden">
        {photoMedia ? (
          <Media
            resource={photoMedia}
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-site-surface-elevated" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-site-overlay-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        {photo.series && (
          <span className="font-mono text-[10px] leading-[1.2] font-semibold tracking-[0.12em] text-site-accent uppercase">
            {photo.series}
          </span>
        )}
        <span className="text-sm font-medium text-site-text-primary">{photo.title}</span>
      </div>
    </Link>
  )
}

function PlaceholderCard() {
  return (
    <div>
      <div className="aspect-[4/3] w-full border border-site-border-subtle bg-site-surface-elevated" />
      <div className="mt-3 flex flex-col gap-2">
        <div className="h-2 w-20 rounded-none bg-site-border-subtle" />
        <div className="h-3 w-32 rounded-none bg-site-surface-elevated" />
      </div>
    </div>
  )
}
