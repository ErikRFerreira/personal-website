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
          className="site-caption flex h-full w-full items-center justify-center px-6 text-center text-site-text-muted uppercase"
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
          className="site-meta-label text-site-text-muted"
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

export function ProjectRow({ project, index }: Props) {
  const labels = getProjectLabels(project, index)
  const imageOnRight = index % 2 === 0

  return (
    <article
      className="group grid grid-cols-12 items-center gap-8 lg:gap-10"
      data-project-card="true"
      data-project-layout={imageOnRight ? 'image-right' : 'image-left'}
    >
      <div
        className={`relative order-1 col-span-12 lg:col-span-7 ${imageOnRight ? 'lg:order-2' : 'lg:order-1'}`}
        data-project-frame="true"
      >
        <div
          aria-hidden="true"
          className={`absolute -top-3 z-20 h-12 w-12 border-t border-site-border-active/70 ${
            imageOnRight
              ? '-right-3 border-r'
              : '-left-3 border-l'
          }`}
          data-project-corner={imageOnRight ? 'top-right' : 'top-left'}
        />
        <ProjectImage project={project} sizes="(max-width: 1023px) 100vw, 58vw" />
      </div>

      <div
        className={`order-2 col-span-12 flex flex-col gap-6 lg:col-span-5 ${
          imageOnRight ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'
        }`}
        data-project-content="true"
      >
        <div className="space-y-3">
          <p className="site-section-label text-site-accent opacity-70">
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
