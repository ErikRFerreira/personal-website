import type { Project } from '@/payload-types'
import DefaultSection from '@/components/DefaultSection'
import ProjectCard from '@/components/ProjectCard'

type SelectedProjectsProps = {
  eyebrow?: string | null
  label?: string | null
  projects?: (number | Project)[] | null
}

export function SelectedProjectsBlock({ eyebrow, label, projects }: SelectedProjectsProps) {
  const selectedProjects = projects?.filter(
    (project): project is Project => typeof project === 'object' && project !== null,
  )

  if (!selectedProjects?.length) return null

  return (
    <DefaultSection eyebrow={eyebrow} label={label}>
      {selectedProjects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </DefaultSection>
  )
}
