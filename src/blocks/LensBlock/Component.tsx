import type { LensBlock, Len } from '@/payload-types'
import DefaultSection from '@/components/DefaultSection'
import Link from 'next/dist/client/link'

export function LensBlockComponent({ eyebrow, label, photos }: LensBlock) {
  // Filter out any non-object or null entries from the photos array
  const resolvedPhotos = photos?.filter((p): p is Len => typeof p === 'object' && p !== null)

  if (!resolvedPhotos?.length) return null

  return (
    <DefaultSection eyebrow={eyebrow} label={label}>
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
        {resolvedPhotos.map((item) => {
          const photo = typeof item.photo === 'object' && item.photo !== null ? item.photo : null
          const photoUrl = photo?.url
          const photoAlt = photo?.alt ?? item.title
          const slug = typeof item.slug === 'string' ? item.slug : ''

          return (
            <Link
              key={item.id}
              href={`/lens/${item.slug}`}
              className="group mb-4 block break-inside-avoid overflow-hidden rounded-lg"
            >
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt={photoAlt}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </Link>
          )
        })}
      </div>
    </DefaultSection>
  )
}
