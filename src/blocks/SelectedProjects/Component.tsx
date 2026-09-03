import type { Project } from '@/payload-types'
import { AccentHexagon } from '@/components/AccentHexagon'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import LazyShapeGrid from '@/components/ShapeGrid/Lazy'
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
      className="site-section relative isolate overflow-hidden text-site-text-primary"
      data-selected-projects="true"
      data-theme="dark"
      style={{ backgroundColor: 'var(--site-surface-deep)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        data-selected-projects-grid="true"
      >
        <LazyShapeGrid
          borderColor="var(--site-border-control)"
          direction="diagonal"
          hoverFillColor="var(--site-surface-elevated)"
          hoverTrailAmount={0}
          shape="square"
          speed={0.2}
          squareSize={40}
        />
      </div>

      <div className="site-container relative z-10">
        <RevealOnScroll revealName="section-heading">
          <div className="mb-16 flex items-center gap-4">
            <AccentHexagon />
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
