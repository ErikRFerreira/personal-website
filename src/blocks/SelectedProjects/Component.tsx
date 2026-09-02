import type { Project } from '@/payload-types'
import DefaultSection from '@/components/DefaultSection'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { getRevealDelay } from '@/utilities/getRevealDelay'
import { ProjectRow } from './ProjectRow'
import LazyShapeGrid from '@/components/ShapeGrid/Lazy'

type SelectedProjectsProps = {
  eyebrow?: string | null
  label?: string | null
  intro?: string | null
  projects?: (number | Project)[] | null
}

export function SelectedProjectsBlock({ eyebrow, label, intro, projects }: SelectedProjectsProps) {
  const selectedProjects = projects?.filter(
    (project): project is Project => typeof project === 'object' && project !== null,
  )

  if (!selectedProjects?.length) return null

  return (
    <DefaultSection
      eyebrow={eyebrow}
      label={label}
      intro={intro}
      bgColor="var(--site-surface-base)"
      className="relative overflow-hidden"
      revealHeader
    >
      <LazyShapeGrid
        speed={0.3}
        squareSize={40}
        direction="diagonal"
        borderColor="var(--site-border-subtle)"
        hoverFillColor="var(--site-surface-elevated)"
        shape="square"
        hoverTrailAmount={0}
      />
      {selectedProjects.map((project, index) => (
        <RevealOnScroll
          className="relative z-2"
          delay={getRevealDelay(index, 75, 225)}
          key={project.id}
          revealName="project-row"
        >
          <ProjectRow project={project} index={index} />
        </RevealOnScroll>
      ))}
    </DefaultSection>
  )
}
