import type { Project } from '@/payload-types'
import { Tag } from '@/components/Tag'

type Props = {
  project: Project
  index: number
}

export function ProjectRow({ project, index }: Props) {
  const image = typeof project.image === 'object' && project.image !== null ? project.image : null
  const isEven = index % 2 === 0
  const indexLabel = String(index + 1).padStart(2, '0')

  return (
    <div className={index > 0 ? 'border-t border-site-border-subtle pt-12 md:pt-16' : ''}>
      <div className="mb-7 flex max-w-[31.625rem] items-center gap-4">
        <span className="font-mono text-[0.6875rem] leading-none font-bold tracking-[0.18em] text-site-accent uppercase">
          {indexLabel}
        </span>
        <div className="h-px w-full max-w-[25.125rem] bg-site-accent/40" />
      </div>

      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,31.625rem)_minmax(0,1fr)] md:gap-12 lg:gap-16">
        <div className={['flex flex-col', !isEven ? 'md:order-2' : ''].join(' ')}>
          <h3 className="mb-6 max-w-[27rem] text-[2.5rem] leading-[0.98] font-extrabold text-[#dfe4ff] md:text-[2.875rem]">
            {project.title}
          </h3>

          {project.description && (
            <p className="mb-8 max-w-[27.25rem] text-lg leading-[1.6] text-[#a9b1c9]">
              {project.description}
            </p>
          )}

          {Array.isArray(project.metrics) && project.metrics.length > 0 && (
            <div className="mb-7 grid max-w-[31.625rem] grid-cols-1 rounded-lg border border-site-border-subtle bg-transparent px-6 py-5 sm:grid-cols-2 sm:gap-8">
              {project.metrics.slice(0, 2).map((metric, i) => (
                <div key={metric.id ?? i} className="flex min-w-0 flex-col gap-2 py-2">
                  <span className="text-[0.6875rem] leading-[1.2] font-bold tracking-[0.18em] text-[#b3bbd3] uppercase">
                    {metric.label}
                  </span>
                  <span
                    className={[
                      'text-[1.375rem] leading-[1.25] font-extrabold',
                      i === 0 ? 'text-site-accent' : 'text-[#dfe4ff]',
                    ].join(' ')}
                  >
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {Array.isArray(project.tech) && project.tech.length > 0 && (
            <div className="mb-9 flex flex-wrap gap-2.5">
              {project.tech.map((tech) => (
                <Tag
                  key={tech.id}
                  className="bg-[#182036] px-4 py-2 text-[0.6875rem] tracking-[0.08em] text-[#b8c0d6]"
                >
                  {tech.techName}
                </Tag>
              ))}
            </div>
          )}

          <a
            href={`/projects/${project.slug}`}
            className="inline-flex items-center text-sm font-bold tracking-[0.01em] text-site-text-primary transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-out hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-site-border-active focus-visible:shadow-[0_0_0_4px_var(--site-glow-accent)] motion-reduce:transition-none"
          >
            Read Case Study
            <span className="ml-2">&rarr;</span>
          </a>
        </div>

        <div
          className={[
            'relative aspect-[16/10] min-h-64 overflow-hidden rounded-lg bg-site-surface-elevated md:min-h-0',
            !isEven ? 'md:order-1' : '',
          ].join(' ')}
        >
          {image?.url && (
            <img
              src={image.url}
              alt={image.alt ?? project.title}
              className="h-full w-full object-cover transition-transform duration-200 ease-out hover:scale-[1.02] motion-reduce:transition-none"
            />
          )}
        </div>
      </div>
    </div>
  )
}
