import type { Payload } from 'payload'

import type { Len } from '@/payload-types'

export async function findRelatedLensPhotos({
  collectionID,
  currentPhotoID,
  payload,
}: {
  collectionID: number
  currentPhotoID: number
  payload: Payload
}): Promise<Len[]> {
  const result = await payload.find({
    collection: 'lens',
    depth: 1,
    limit: 3,
    overrideAccess: false,
    pagination: false,
    sort: '-createdAt',
    where: {
      and: [
        { series: { equals: collectionID } },
        { id: { not_equals: currentPhotoID } },
        { status: { equals: 'published' } },
      ],
    },
  })

  return result.docs
}
