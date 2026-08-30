import type { Project } from '@/payload-types'
import DefaultSection from '@/components/DefaultSection'
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
      bgColor="var(--site-surface-deep)"
      className="relative overflow-hidden"
    >
      <LazyShapeGrid
        speed={0.3}
        squareSize={40}
        direction="diagonal"
        borderColor="#2F293A"
        hoverFillColor="#222"
        shape="square"
        hoverTrailAmount={0}
      />
      {selectedProjects.map((project, index) => (
        <div className="relative z-2" key={project.id}>
          <ProjectRow key={project.id} project={project} index={index} />
        </div>
      ))}
    </DefaultSection>
  )
}
