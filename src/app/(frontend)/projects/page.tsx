import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import ArchiveHeader from '@/components/ArchiveHeader'
import { ProjectArchiveItem } from '@/components/ProjectArchiveItem'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: '-year',
    select: {
      description: true,
      image: true,
      slug: true,
      tech: true,
      title: true,
      type: true,
      year: true,
    },
  })

  return (
    <main className="site-section pt-28 md:pt-36">
      <div className="site-container pbe-24">
        <ArchiveHeader
          title="Projects"
          subtitle="A collection of digital products built with thoughtful design and robust engineering."
        />

        <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
          {projects.docs.map((project) => (
            <ProjectArchiveItem key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Projects | Erik Fereira',
    description: 'A collection of digital products built by Erik Fereira.',
  }
}
