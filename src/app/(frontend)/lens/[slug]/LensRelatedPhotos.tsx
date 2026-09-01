import Link from 'next/link'

import { Media } from '@/components/Media'
import type { Len, Media as MediaType, Series } from '@/payload-types'

type Props = {
  collection: Series
  photos: Len[]
}

export const LensRelatedPhotos: React.FC<Props> = ({ collection, photos }) => {
  if (photos.length === 0) return null

  return (
    <section className="bg-site-surface-deep py-16 md:py-20">
      <div className="site-container">
        <div className="mb-10 flex items-end justify-between gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[0.6875rem] leading-[1.2] font-semibold tracking-[0.12em] text-site-accent uppercase">
              From the same collection
            </span>
            <h2 className="text-3xl leading-tight font-bold text-site-text-primary">
              {collection.name}
            </h2>
          </div>
          <Link
            className="text-sm tracking-[0.04em] text-site-text-secondary transition-colors duration-200 hover:text-site-text-primary"
            href="/lens"
          >
            View all photographs
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {photos.map((photo) => (
            <RelatedPhotoCard collectionName={collection.name} key={photo.id} photo={photo} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedPhotoCard({ collectionName, photo }: { collectionName: string; photo: Len }) {
  const photoMedia = typeof photo.photo === 'object' ? (photo.photo as MediaType) : null

  return (
    <Link
      className="group block focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-site-border-active"
      href={`/lens/${photo.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-site-surface-elevated">
        {photoMedia && (
          <Media
            fill
            htmlElement={null}
            imgClassName="object-cover opacity-75 grayscale saturate-0 brightness-75 contrast-110 transition-[transform,filter,opacity] duration-700 ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 group-hover:saturate-100 group-hover:brightness-100 group-hover:contrast-100 motion-reduce:transform-none motion-reduce:transition-none"
            pictureClassName="relative block size-full"
            resource={photoMedia}
            size="(max-width: 767px) calc(100vw - 3rem), 33vw"
          />
        )}
        <div className="absolute inset-0 bg-site-overlay-dark opacity-25 transition-opacity duration-700 ease-out group-hover:opacity-0 motion-reduce:transition-none" />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <span className="font-mono text-[0.625rem] leading-[1.2] font-semibold tracking-[0.12em] text-site-accent uppercase">
          {collectionName}
        </span>
        <span className="text-sm font-medium text-site-text-primary">{photo.title}</span>
      </div>
    </Link>
  )
}
