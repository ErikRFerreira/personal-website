import { RevealOnScroll } from '@/components/RevealOnScroll'
import RichText from '@/components/RichText'
import type { Project } from '@/payload-types'
import { hasProjectContent } from './ProjectDetail'

export function ProjectOverview({ project }: { project: Project }) {
  if (!project.content || !hasProjectContent(project.content)) return null

  return (
    <RevealOnScroll className="site-container" revealName="project-overview">
      <section
        aria-label="Project context and purpose"
        className="mx-auto max-w-2xl"
        data-project-content="true"
      >
        <span className="site-section-label mb-4 block text-site-accent">
          Project Context &amp; Purpose
        </span>
        <RichText data={project.content} enableGutter={false} />
      </section>
    </RevealOnScroll>
  )
}
