import Link from 'next/link'

import {
  DetailAction,
  DetailInfoPanel,
  DetailInfoSection,
  DetailMetaGrid,
  DetailMetaItem,
} from '@/components/DetailInfo'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import type { Project } from '@/payload-types'
import { formatProjectType, isSafeExternalURL } from './ProjectDetail'

function ProjectMetadata({ project }: { project: Project }) {
  const technologies = project.tech
    ?.map(({ techName }) => techName?.trim())
    .filter((techName): techName is string => Boolean(techName))
  const type = formatProjectType(project.type)
  const cells = [
    project.role?.trim() ? { label: 'Role', value: project.role.trim(), wide: true } : null,
    type ? { label: 'Type', value: type } : null,
    project.year ? { label: 'Year', value: String(project.year) } : null,
    technologies && technologies.length > 0
      ? { label: 'Stack', value: technologies.join(', '), wide: true }
      : null,
  ].filter((cell): cell is { label: string; value: string; wide?: boolean } => Boolean(cell))
  const links = project.links?.filter(({ label, url }) =>
    Boolean(label.trim() && url.trim() && isSafeExternalURL(url.trim())),
  )

  if (cells.length === 0 && !links?.length) return null

  return (
    <aside aria-label="Project metadata">
      <DetailInfoPanel variant="project">
        {cells.length > 0 && (
          <DetailInfoSection>
            <DetailMetaGrid>
              {cells.map(({ label, value, wide }) => (
                <DetailMetaItem key={label} label={label} value={value} wide={wide} />
              ))}
            </DetailMetaGrid>
          </DetailInfoSection>
        )}

        {links && links.length > 0 && (
          <DetailInfoSection
            className="flex flex-wrap gap-3 py-4"
            data-project-external-links="true"
            divided
          >
            {links.map(({ id, label, url }, index) => (
              <DetailAction
                className={index === 0 ? 'w-full' : 'flex-1'}
                emphasis={index === 0 ? 'primary' : 'secondary'}
                external
                href={url.trim()}
                key={id ?? `${label}-${index}`}
                variant="project"
              >
                <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
              </DetailAction>
            ))}
          </DetailInfoSection>
        )}
      </DetailInfoPanel>
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

        <div className="mt-8 grid grid-cols-12 items-start gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:mt-10 lg:gap-x-10">
          <div className="col-span-12 min-w-0 lg:col-span-7">
            <h1 className="max-w-[13ch] text-[clamp(2rem,4.375vw,3.28125rem)] leading-[1.05] font-black tracking-[-0.03em] text-site-text-primary md:text-[clamp(2.25rem,5vw,3.5rem)]">
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
