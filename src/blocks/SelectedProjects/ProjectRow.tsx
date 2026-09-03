import { CtaButton } from '@/components/CtaButton'
import type { Project } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'

type Props = {
  project: Project
  index: number
}

const projectTypeLabels: Partial<Record<NonNullable<Project['type']>, string>> = {
  design: 'Design',
  'mobile-app': 'Mobile App',
  'open-source': 'Open Source',
  other: 'Other',
  'web-app': 'Web App',
}

function getProjectLabels(project: Project, index: number) {
  const number = String(index + 1).padStart(2, '0')
  const type = project.type ? projectTypeLabels[project.type] : null
  const typeCode = type?.toUpperCase().replaceAll(' ', '_')

  return {
    metadata: [typeCode, project.year].filter(Boolean).join(' // '),
    number,
  }
}

function ProjectImage({ project, sizes }: { project: Project; sizes: string }) {
  const image = typeof project.image === 'object' && project.image !== null ? project.image : null

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-site-surface-elevated">
      {image?.url ? (
        <Image
          alt={image.alt ?? project.title}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          decoding="async"
          fill
          loading="lazy"
          quality={75}
          sizes={sizes}
          src={getMediaUrl(image.url, image.updatedAt)}
        />
      ) : (
        <div
          aria-label={`${project.title} preview unavailable`}
          className="flex h-full w-full items-center justify-center px-6 text-center font-mono text-[0.6875rem] font-semibold tracking-[0.16em] text-site-text-muted uppercase"
          data-project-image-placeholder="true"
          role="img"
        >
          Preview unavailable
        </div>
      )}
      {image?.url && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-site-surface-deep/25 opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-0 motion-reduce:transition-none"
          data-project-image-overlay="true"
        />
      )}
    </div>
  )
}

function ProjectTechnologies({ tech }: { tech: Project['tech'] }) {
  if (!Array.isArray(tech) || tech.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2" data-project-technologies="true">
      {tech.map((item, techIndex) => (
        <span
          className="font-mono text-[0.625rem] leading-none font-semibold tracking-[0.12em] text-site-text-muted uppercase"
          key={item.id ?? `${item.techName}-${techIndex}`}
        >
          {item.techName}
        </span>
      ))}
    </div>
  )
}

function ProjectCta({ project }: { project: Project }) {
  return (
    <CtaButton
      className="w-max font-mono uppercase"
      label="Read Case Study"
      size="sm"
      type="custom"
      url={`/projects/${project.slug}`}
    >
      <span aria-hidden="true">&rarr;</span>
    </CtaButton>
  )
}

function WideProject({ project, index }: Props) {
  const labels = getProjectLabels(project, index)

  return (
    <article
      className="group flex flex-col gap-10 lg:gap-12"
      data-project-card="true"
      data-project-layout="wide"
    >
      <div className="grid grid-cols-12 items-end gap-4 md:gap-6 lg:gap-8">
        <div
          className="relative col-span-12 border-l border-site-border-subtle lg:col-span-10"
          data-project-frame="true"
        >
          <div
            aria-hidden="true"
            className="absolute -right-3 -bottom-3 z-20 h-12 w-12 border-r border-b border-site-border-active/70"
            data-project-corner="bottom-right"
          />
          <ProjectImage project={project} sizes="(max-width: 1023px) 100vw, 75vw" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
        <div
          className="col-span-12 flex flex-col gap-6 lg:col-span-6 lg:col-start-2"
          data-project-content="true"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl leading-none font-semibold text-site-accent">
              {labels.number}
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-site-border-active/50" />
            {labels.metadata && (
              <span className="font-mono text-[0.6875rem] leading-none font-bold tracking-[0.18em] text-site-accent uppercase">
                {labels.metadata}
              </span>
            )}
          </div>

          <h3 className="text-[2.5rem] leading-[0.98] font-extrabold tracking-[-0.035em] text-site-text-primary md:text-[3rem]">
            {project.title}
          </h3>

          {project.description && (
            <p className="text-base leading-[1.7] text-site-text-secondary md:text-lg">
              {project.description}
            </p>
          )}

          <ProjectTechnologies tech={project.tech} />
          <ProjectCta project={project} />
        </div>
      </div>
    </article>
  )
}

function OffsetProject({ project, index }: Props) {
  const labels = getProjectLabels(project, index)

  return (
    <article
      className="group grid grid-cols-12 items-start gap-8 lg:gap-10"
      data-project-card="true"
      data-project-layout="offset"
    >
      <div className="relative order-1 col-span-12 lg:col-span-8" data-project-frame="true">
        <div
          aria-hidden="true"
          className="absolute -top-3 -left-3 z-20 h-12 w-12 border-t border-l border-site-border-active/70"
          data-project-corner="top-left"
        />
        <ProjectImage project={project} sizes="(max-width: 1023px) 100vw, 66vw" />
      </div>

      <div
        className="order-2 col-span-12 flex flex-col gap-7 lg:col-span-4 lg:mt-24 lg:pl-12"
        data-project-content="true"
      >
        <div className="space-y-3">
          <p className="font-mono text-[0.6875rem] leading-none font-bold tracking-[0.18em] text-site-accent uppercase opacity-70">
            {[labels.number, labels.metadata].filter(Boolean).join(' // ')}
          </p>
          <h3 className="text-[2.5rem] leading-[0.98] font-extrabold tracking-[-0.035em] text-site-text-primary md:text-[3rem]">
            {project.title}
          </h3>
        </div>

        {project.description && (
          <p className="max-w-md text-base leading-[1.7] text-site-text-secondary md:text-lg">
            {project.description}
          </p>
        )}

        <ProjectTechnologies tech={project.tech} />
        <ProjectCta project={project} />
      </div>
    </article>
  )
}

export function ProjectRow(props: Props) {
  return props.index === 0 ? <WideProject {...props} /> : <OffsetProject {...props} />
}
