import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Len } from '@/payload-types'

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
