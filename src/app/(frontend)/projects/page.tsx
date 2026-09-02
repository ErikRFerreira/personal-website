import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import ArchiveHeader from '@/components/ArchiveHeader'
import { ProjectArchiveItem } from '@/components/ProjectArchiveItem'
import LazyShapeGrid from '@/components/ShapeGrid/Lazy'
import { formatProjectsArchiveDetail } from './formatArchiveDetail'

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
  const projectCount = projects.docs.length
  const archiveDetail = formatProjectsArchiveDetail(projectCount)

  return (
    <main className="site-section pt-28 md:pt-36 relative">
      <div className="absolute inset-0 z-1 overflow-hidden h-full">
        <LazyShapeGrid
          speed={0.3}
          squareSize={40}
          direction="diagonal"
          borderColor="var(--site-border-subtle)"
          hoverFillColor="var(--site-surface-elevated)"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>
      <div className="site-container pbe-24 relative z-2">
        <ArchiveHeader
          detail={archiveDetail}
          title="Projects"
          subtitle="A collection of digital products built with thoughtful design and robust engineering."
        />

        <div className="flex flex-col">
          {projects.docs.map((project, index) => (
            <ProjectArchiveItem
              index={index}
              key={project.id}
              project={project}
              total={projectCount}
            />
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
