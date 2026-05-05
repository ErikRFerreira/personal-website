import type { Project } from '@/payload-types'

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
    <section className="bg-slate-950 px-6 py-16 text-white md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{eyebrow}</h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">{label}</p>
        </div>

        <div className="space-y-10">
          {selectedProjects.map((project, index) => (
            <article
              key={project.id}
              className="grid overflow-hidden rounded-lg border border-white/10 bg-slate-900 md:grid-cols-2"
            >
              <div className={['p-8 md:p-12', index % 2 === 1 ? 'md:order-2' : ''].join(' ')}>
                <h3 className="mb-4 text-2xl font-bold md:text-3xl">{project.title}</h3>

                {project.description && (
                  <p className="mb-6 max-w-md text-sm leading-6 text-blue-100">
                    {project.description}
                  </p>
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
                {/* Render project image here once you confirm your Media type shape */}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
