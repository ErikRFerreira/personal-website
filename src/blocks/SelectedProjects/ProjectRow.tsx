import type { Project } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'
import Link from 'next/link'

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

export function ProjectRow({ project, index }: Props) {
  const image = typeof project.image === 'object' && project.image !== null ? project.image : null
  const isEven = index % 2 === 0
  const metadata = [project.type ? projectTypeLabels[project.type] : null, project.year]
    .filter(Boolean)
    .join(' // ')

  return (
    <article
      className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10"
      data-project-card="true"
    >
      <div
        className={[
          'relative order-2 flex flex-col gap-6 overflow-hidden border border-site-border-subtle bg-site-surface-elevated p-6 md:p-8 lg:col-span-5',
          isEven ? 'lg:order-1' : 'lg:order-2',
        ].join(' ')}
        data-project-content="true"
      >
        <div
          aria-hidden="true"
          className={[
            'absolute inset-y-0 w-2 origin-top scale-y-0 bg-site-accent transition-transform duration-500 group-hover:scale-y-100 group-focus-within:scale-y-100 motion-reduce:transition-none',
            isEven ? 'left-0' : 'right-0',
          ].join(' ')}
          data-project-accent={isEven ? 'left' : 'right'}
        />

        {metadata && (
          <p className="font-mono text-[0.6875rem] leading-none font-bold tracking-[0.18em] text-site-accent uppercase">
            {metadata}
          </p>
        )}

        <h3 className="text-[2.5rem] leading-[0.98] font-extrabold tracking-[-0.035em] text-site-text-primary md:text-[2.875rem]">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-base leading-[1.7] text-site-text-secondary md:text-lg">
            {project.description}
          </p>
        )}

        {Array.isArray(project.tech) && project.tech.length > 0 && (
          <div className="mt-1 grid grid-cols-2 gap-2" data-project-technologies="true">
            {project.tech.map((tech, techIndex) => (
              <span
                className="border border-site-border-subtle p-2 text-center font-mono text-[0.6875rem] leading-tight font-semibold tracking-[0.08em] text-site-text-primary uppercase"
                key={tech.id ?? `${tech.techName}-${techIndex}`}
              >
                {tech.techName}
              </span>
            ))}
          </div>
        )}

        <Link
          className="mt-2 inline-flex w-max items-center gap-2 font-mono text-sm font-semibold tracking-[0.08em] text-site-accent uppercase transition-colors duration-200 hover:text-site-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active motion-reduce:transition-none"
          href={`/projects/${project.slug}`}
        >
          Read Case Study
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div
        className={[
          'order-1 border border-site-border-subtle bg-site-surface-base p-3 md:p-4 lg:col-span-7',
          isEven ? 'lg:order-2' : 'lg:order-1',
        ].join(' ')}
        data-project-frame="true"
      >
        <div className="relative aspect-[16/10] overflow-hidden border border-site-border-subtle bg-site-surface-elevated">
          {image?.url ? (
            <Image
              alt={image.alt ?? project.title}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
              decoding="async"
              fill
              loading="lazy"
              quality={75}
              sizes="(max-width: 767px) 100vw, 50vw"
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
        </div>
      </div>
    </article>
  )
}
