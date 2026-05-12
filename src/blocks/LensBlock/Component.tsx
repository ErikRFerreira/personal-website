import type { LensBlock, Len } from '@/payload-types'
import DefaultSection from '@/components/DefaultSection'

export function LensBlockComponent({ eyebrow, label, photos }: LensBlock) {
  const resolvedPhotos = photos?.filter((p): p is Len => typeof p === 'object' && p !== null)

  if (!resolvedPhotos?.length) return null

  return (
    <DefaultSection eyebrow={eyebrow} label={label}>
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
        {resolvedPhotos.map((item) => {
          const photo = typeof item.photo === 'object' && item.photo !== null ? item.photo : null
          const photoUrl = photo?.url
          const photoAlt = photo?.alt ?? item.title

          return (
            <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-lg">
              {photoUrl && <img src={photoUrl} alt={photoAlt} className="w-full object-cover" />}
            </div>
          )
        })}
      </div>
    </DefaultSection>
  )
}
