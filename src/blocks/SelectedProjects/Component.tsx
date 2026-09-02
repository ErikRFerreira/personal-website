import type { Project } from '@/payload-types'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { getRevealDelay } from '@/utilities/getRevealDelay'
import { ProjectRow } from './ProjectRow'

type SelectedProjectsProps = {
  eyebrow?: string | null
  label?: string | null
  intro?: string | null
  projects?: (number | Project)[] | null
}

export function SelectedProjectsBlock({ eyebrow, label, projects }: SelectedProjectsProps) {
  const selectedProjects = projects?.filter(
    (project): project is Project => typeof project === 'object' && project !== null,
  )
  const heading =
    [eyebrow?.trim(), label?.trim()].filter(Boolean).join(' // ') || 'Selected Projects'

  if (!selectedProjects?.length) return null

  return (
    <section
      className="site-section relative overflow-hidden bg-site-surface-base text-site-text-primary"
      data-selected-projects="true"
      data-theme="dark"
    >
      <div className="site-container">
        <RevealOnScroll revealName="section-heading">
          <div className="mb-16 flex items-center gap-4">
            <h2 className="shrink-0 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.2em] text-site-accent uppercase">
              {heading}
            </h2>
            <div aria-hidden="true" className="h-px flex-1 bg-site-border-subtle" />
          </div>
        </RevealOnScroll>

        <div className="flex flex-col gap-24 lg:gap-32">
          {selectedProjects.map((project, index) => (
            <RevealOnScroll
              delay={getRevealDelay(index, 75, 225)}
              key={project.id}
              revealName="project-row"
            >
              <ProjectRow project={project} index={index} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
