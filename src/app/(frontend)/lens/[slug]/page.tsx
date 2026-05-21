import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Len } from '@/payload-types'

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

  return (
    <main className="pt-24 pb-24">
      <h1>{lens.title}</h1>
    </main>
  )
}

const queryLensBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'lens',
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
