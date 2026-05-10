import type { Project } from '@/payload-types'

type Props = {
  project: Project
  index: number
}

function ProjectCard({ project, index }: Props) {
  const image = typeof project.image === 'object' && project.image !== null ? project.image : null

  return (
    <article className="grid overflow-hidden rounded-lg border border-white/10 bg-slate-900 md:grid-cols-2">
      <div className={['p-8 md:p-12', index % 2 === 1 ? 'md:order-2' : ''].join(' ')}>
        <h3 className="mb-4 text-2xl font-bold md:text-3xl">{project.title}</h3>

        {project.description && (
          <p className="mb-6 max-w-md text-sm leading-6 text-blue-100">{project.description}</p>
        )}

        {project.role && <p className="mb-3 text-xs font-semibold">Role: {project.role}</p>}

        {Array.isArray(project.tech) && (
          <div className="mb-8 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech.id}
                className="rounded bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase text-cyan-300"
              >
                {tech.techName}
              </span>
            ))}
          </div>
        )}

        <a
          href={`/projects/${project.slug}`}
          className="inline-flex items-center text-sm font-bold text-white hover:text-cyan-300"
        >
          View Case Study
          <span className="ml-2">→</span>
        </a>
      </div>

      <div className="min-h-72 bg-slate-800">
        {image?.url && (
          <img
            src={image.url}
            alt={image.alt ?? project.title}
            className="h-full min-h-72 w-full object-cover"
          />
        )}
      </div>
    </article>
  )
}

export default ProjectCard
