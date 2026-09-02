import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import ArchiveHeader from '@/components/ArchiveHeader'
import { LensArchive } from '@/components/LensArchive'

export const dynamic = 'force-static'
export const revalidate = 600

async function Page() {
  const payload = await getPayload({ config: configPromise })

  const photos = await payload.find({
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
  })

  return (
    <main className="site-section bg-site-surface-photo pt-28 md:pt-36">
      <div className="site-container pb-24">
        <ArchiveHeader
          title="Lens"
          subtitle="Photography from below the surface and beyond. A quiet exploration of the mysterious depths and the silent giants that inhabit them."
        />

        <LensArchive
          docs={photos.docs}
          hasNextPage={photos.hasNextPage}
          nextPage={photos.nextPage ?? null}
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
