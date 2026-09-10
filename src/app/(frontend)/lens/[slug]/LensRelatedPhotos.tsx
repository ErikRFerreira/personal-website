import { Media } from '@/components/Media'
import Link from 'next/link'

import type { Len, Media as MediaType, Series } from '@/payload-types'

type Props = {
  collection: Series
  photos: Len[]
}

export const LensRelatedPhotos: React.FC<Props> = ({ collection, photos }) => {
  if (photos.length === 0) return null

  return (
    <section className="pb-20 md:pb-24 border-t border-site-border-subtle pt-10">
      <div className="site-container pt-10">
        <div className="mb-10 flex items-end justify-between gap-8">
          <div className="flex flex-col gap-2">
            <span className="site-meta-label text-site-accent">
              Related Lens photographs
            </span>
            <h2 className="text-[1.3125rem] leading-tight font-bold text-site-text-primary md:text-2xl">
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
      <div className="relative aspect-[16/10] overflow-hidden border border-site-border-subtle bg-site-surface-elevated transition-colors duration-300 group-hover:border-site-border-active">
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
      <div className="flex flex-col gap-1 border-x border-b border-site-border-subtle bg-site-surface-elevated/55 px-4 py-3 transition-colors duration-300 group-hover:border-site-border-active">
        <span className="site-meta-label text-site-accent">
          {collectionName}
        </span>
        <span className="text-sm font-medium text-site-text-primary">{photo.title}</span>
      </div>
    </Link>
  )
}
