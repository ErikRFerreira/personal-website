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
    <div>
      {/* Row divider — no border-t on first row since section heading already provides it */}
      <div
        className={[
          'mb-8 flex items-center gap-4 pt-4',
          index > 0 ? 'border-t border-portfolio-border-subtle' : '',
        ].join(' ')}
      >
        <span className="portfolio-eyebrow">{indexLabel} —</span>
        <div className="flex-1" />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-8 md:grid-cols-2 md:gap-[var(--portfolio-card-gap)]">
        {/* Text content — order changes on alternating rows */}
        <div className={['flex flex-col justify-center', !isEven ? 'md:order-2' : ''].join(' ')}>
          <h3 className="portfolio-card-title mb-4">{project.title}</h3>

          {project.description && (
            <p className="portfolio-body-sm mb-6 max-w-md">{project.description}</p>
          )}

          {/* Metrics stat boxes */}
          {Array.isArray(project.metrics) && project.metrics.length > 0 && (
            <div className="mb-8 flex gap-3">
              {project.metrics.slice(0, 2).map((metric, i) => (
                <div
                  key={metric.id ?? i}
                  className="flex min-w-0 flex-1 flex-col rounded-lg border border-portfolio-border-subtle bg-portfolio-elevated p-4"
                >
                  <span className="portfolio-meta mb-1">{metric.label}</span>
                  <span
                    className={[
                      'text-lg font-bold leading-tight',
                      i === 0 ? 'text-portfolio-accent' : 'text-portfolio-text-primary',
                    ].join(' ')}
                  >
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tech tags */}
          {Array.isArray(project.tech) && project.tech.length > 0 && (
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
            View Project
            <span className="ml-2">&rarr;</span>
          </a>
        </div>

        {/* Image */}
        <div
          className={[
            'relative min-h-72 overflow-hidden bg-portfolio-elevated',
            !isEven ? 'md:order-1' : '',
          ].join(' ')}
        >
          {image?.url && (
            <>
              <img
                src={image.url}
                alt={image.alt ?? project.title}
                className="portfolio-transition h-full min-h-72 w-full object-cover hover:scale-[1.02]"
              />
              <div className="portfolio-overlay-readable pointer-events-none absolute inset-0 opacity-70" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
