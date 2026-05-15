import type { Project } from '@/payload-types'
import { Tag } from '@/components/Tag'

type Props = {
  project: Project
  index: number
}

function ProjectCard({ project, index }: Props) {
  const image = typeof project.image === 'object' && project.image !== null ? project.image : null

  return (
    <article className="portfolio-card group grid overflow-hidden md:grid-cols-2">
      <div className={['p-8 md:p-12', index % 2 === 1 ? 'md:order-2' : ''].join(' ')}>
        <h3 className="portfolio-card-title mb-4">{project.title}</h3>

        {project.description && (
          <p className="portfolio-body-sm mb-6 max-w-md">{project.description}</p>
        )}

        {project.role && <p className="portfolio-meta mb-3">Role: {project.role}</p>}

        {Array.isArray(project.tech) && (
          <div className="mb-8 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <Tag key={tech.id}>{tech.techName}</Tag>
            ))}
          </div>
        )}

        <a
          href={`/projects/${project.slug}`}
          className="portfolio-cta-text portfolio-focus-ring portfolio-transition inline-flex items-center text-portfolio-text-primary hover:text-portfolio-accent"
        >
          View Case Study
          <span className="ml-2">{'\u2192'}</span>
        </a>
      </div>

      <div className="relative min-h-72 overflow-hidden bg-portfolio-elevated">
        {image?.url && (
          <>
            <img
              src={image.url}
              alt={image.alt ?? project.title}
              className="portfolio-transition h-full min-h-72 w-full object-cover group-hover:scale-[1.02]"
            />
            <div className="portfolio-overlay-readable pointer-events-none absolute inset-0 opacity-70" />
          </>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
