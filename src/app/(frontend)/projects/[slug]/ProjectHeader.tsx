import Link from 'next/link'

import { CtaButton } from '@/components/CtaButton'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import type { Project } from '@/payload-types'
import { formatProjectType, isSafeExternalURL } from './ProjectDetail'

function ProjectMetadata({ project }: { project: Project }) {
  const technologies = project.tech
    ?.map(({ techName }) => techName?.trim())
    .filter((techName): techName is string => Boolean(techName))
  const type = formatProjectType(project.type)
  const rows = [
    project.role?.trim() ? { label: 'Role', value: project.role.trim() } : null,
    type ? { label: 'Type', value: type } : null,
    project.year ? { label: 'Year', value: String(project.year) } : null,
  ].filter((row): row is { label: string; value: string } => Boolean(row))
  const links = project.links?.filter(({ label, url }) =>
    Boolean(label.trim() && url.trim() && isSafeExternalURL(url.trim())),
  )

  const stack =
    technologies && technologies.length > 0
      ? { label: 'Stack', value: technologies.join(', ') }
      : null
  const cells = [...rows, stack].filter((cell): cell is { label: string; value: string } =>
    Boolean(cell),
  )

  if (cells.length === 0 && !links?.length) return null

  return (
    <aside
      className="border-t border-site-border-subtle pt-6 lg:mt-2"
      aria-label="Project metadata"
    >
      {cells.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
          {cells.map(({ label, value }) => (
            <div key={label} className={label === 'Stack' ? 'col-span-2 min-w-0' : 'min-w-0'}>
              <dt className="site-meta-label mb-1.5 text-site-text-muted">
                {label}
              </dt>
              <dd className="text-sm leading-[1.55] break-words text-site-text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {links && links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3" data-project-external-links="true">
          {links.map(({ id, label, url }, index) => (
            <CtaButton
              className="w-fit max-w-full font-mono break-words whitespace-normal uppercase"
              key={id ?? `${label}-${index}`}
              label={label}
              newTab
              size="sm"
              type="custom"
              url={url}
            >
              <span aria-hidden="true">&#8599;</span>
            </CtaButton>
          ))}
        </div>
      )}
    </aside>
  )
}

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="site-container pt-10 md:pt-14 lg:pt-16">
      <RevealOnScroll revealName="project-header">
        <Link
          className="site-section-label group inline-flex items-center gap-3 text-site-text-secondary transition-colors duration-200 hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
          href="/projects"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
          >
            &larr;
          </span>
          Back to Projects
        </Link>

        <div className="mt-8 grid grid-cols-12 gap-x-4 gap-y-12 lg:mt-10 md:gap-x-6 lg:gap-x-8">
          <div className="col-span-12 min-w-0 lg:col-span-7">
            <h1 className="max-w-[13ch] text-[clamp(2rem,4.375vw,3.28125rem)] leading-[1.05] font-black tracking-[-0.03em] text-site-text-primary md:text-[clamp(2.25rem,5vw,3.75rem)]">
              {project.title}
            </h1>

            {project.description && (
              <p className="mt-6 max-w-xl text-sm leading-[1.7] font-light text-site-text-secondary md:text-lg">
                {project.description}
              </p>
            )}
          </div>

          <div className="col-span-12 min-w-0 lg:col-span-5">
            <ProjectMetadata project={project} />
          </div>
        </div>
      </RevealOnScroll>
    </header>
  )
}
