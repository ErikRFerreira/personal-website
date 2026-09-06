import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import ArchiveHeader from '@/components/ArchiveHeader'
import { LensArchive } from '@/components/LensArchive'

export const dynamic = 'force-static'
export const revalidate = 600

async function Page() {
  const payload = await getPayload({ config: configPromise })

  const [photos, lensTaxonomies] = await Promise.all([
    payload.find({
      collection: 'lens',
      depth: 1,
      limit: 5,
      overrideAccess: false,
      page: 1,
      sort: ['-year', '-createdAt'],
      select: {
        archiveFormat: true,
        location: true,
        photo: true,
        series: true,
        slug: true,
        technicalMetadata: true,
        title: true,
        year: true,
      },
      where: {
        status: {
          equals: 'published',
        },
      },
    }),
    payload.find({
      collection: 'lens',
      depth: 1,
      limit: 0,
      overrideAccess: false,
      pagination: false,
      select: {
        categories: true,
        series: true,
      },
      where: {
        status: {
          equals: 'published',
        },
      },
    }),
  ])

  const categoryOptions = new Map<number, { count: number; label: string }>()
  const collectionOptions = new Map<number, string>()

  for (const photo of lensTaxonomies.docs) {
    for (const category of photo.categories ?? []) {
      if (typeof category === 'object') {
        const option = categoryOptions.get(category.id)
        categoryOptions.set(category.id, {
          count: (option?.count ?? 0) + 1,
          label: category.title,
        })
      }
    }

    if (typeof photo.series === 'object' && photo.series !== null) {
      collectionOptions.set(photo.series.id, photo.series.name)
    }
  }

  const categories = Array.from(categoryOptions, ([id, option]) => ({ id, ...option })).sort(
    (a, b) => a.label.localeCompare(b.label),
  )
  const collections = Array.from(collectionOptions, ([id, label]) => ({ id, label })).sort((a, b) =>
    a.label.localeCompare(b.label),
  )

  return (
    <main className="site-section bg-site-surface-photo pt-28 md:pt-36">
      <div className="site-container pb-24">
        <ArchiveHeader
          title="Lens"
          subtitle="Photography from below the surface and beyond. A quiet exploration of the mysterious depths and the silent giants that inhabit them."
        />

        <LensArchive
          categories={categories}
          collections={collections}
          docs={photos.docs}
          hasNextPage={photos.hasNextPage}
          nextPage={photos.nextPage ?? null}
          totalDocs={photos.totalDocs}
        />
      </div>
    </main>
  )
}

export default Page

export function generateMetadata(): Metadata {
  return {
    title: 'Lens | Erik Fereira',
    description: 'Photography from below the surface and beyond by Erik Fereira.',
  }
}
