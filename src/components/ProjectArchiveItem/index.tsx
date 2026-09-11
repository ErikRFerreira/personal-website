'use client'

import { CtaButton } from '@/components/CtaButton'
import type { Project } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type ArchiveProject = Pick<
  Project,
  'description' | 'image' | 'slug' | 'tech' | 'title' | 'type' | 'year'
>

type ProjectArchiveItemProps = {
  index: number
  project: ArchiveProject
  total: number
}

const projectTypeLabels: Partial<Record<NonNullable<Project['type']>, string>> = {
  design: 'Design',
  'mobile-app': 'Mobile App',
  'open-source': 'Open Source',
  other: 'Other',
  'web-app': 'Web App',
}

function formatIndex(value: number) {
  return String(value).padStart(2, '0')
}

function getProjectMetadata(project: ArchiveProject, index: number, total: number) {
  const type = project.type ? projectTypeLabels[project.type] : null
  const typeCode = type?.toUpperCase().replaceAll(' ', '_')

  return [`${formatIndex(index + 1)} / ${formatIndex(total)}`, typeCode, project.year]
    .filter(Boolean)
    .join(' // ')
}

function ProjectImage({ project }: { project: ArchiveProject }) {
  const image = typeof project.image === 'object' && project.image !== null ? project.image : null

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden bg-site-surface-elevated"
      data-project-media="true"
    >
      {image?.url ? (
        <Image
          alt={image.alt || project.title}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          decoding="async"
          fill
          loading="lazy"
          quality={75}
          sizes="(max-width: 1023px) 100vw, 58vw"
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

function ProjectTechnologies({ tech }: { tech: ArchiveProject['tech'] }) {
  const technologies = tech?.filter(
    (item): item is NonNullable<typeof item> & { techName: string } => Boolean(item.techName),
  )

  if (!technologies?.length) return null

  return (
    <div
      className="mb-4 flex min-w-0 max-w-full flex-wrap gap-x-6 gap-y-2"
      data-project-technologies="true"
    >
      {technologies.map((item, techIndex) => (
        <span
          className="site-meta-label max-w-full break-words text-site-text-muted"
          key={item.id ?? `${item.techName}-${techIndex}`}
        >
          {item.techName}
        </span>
      ))}
    </div>
  )
}

export function ProjectArchiveItem({ index, project, total }: ProjectArchiveItemProps) {
  const articleRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const imageOnRight = index % 2 === 0
  const metadata = getProjectMetadata(project, index, total)

  useEffect(() => {
    const article = articleRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!article || motionQuery.matches || typeof IntersectionObserver === 'undefined') {
      const timeout = window.setTimeout(() => setIsVisible(true), 0)
      return () => window.clearTimeout(timeout)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8%', threshold: 0.08 },
    )

    observer.observe(article)
    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={articleRef}
      className={`group grid min-w-0 max-w-full grid-cols-1 items-center gap-8 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none lg:grid-cols-12 lg:gap-10 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      data-project-card="true"
      data-project-layout={imageOnRight ? 'image-right' : 'image-left'}
    >
      <div
        className={`relative order-1 col-span-1 min-w-0 max-w-full lg:col-span-7 ${
          imageOnRight ? 'lg:order-2' : 'lg:order-1'
        }`}
        data-project-frame="true"
      >
        <div
          aria-hidden="true"
          className={`absolute -top-3 z-20 h-12 w-12 border-t border-site-border-active/70 ${
            imageOnRight ? 'right-0 border-r lg:-right-3' : 'left-0 border-l lg:-left-3'
          }`}
          data-project-corner={imageOnRight ? 'top-right' : 'top-left'}
        />
        <ProjectImage project={project} />
      </div>

      <div
        className={`order-2 col-span-1 flex min-w-0 max-w-full flex-col gap-6 lg:col-span-5 ${
          imageOnRight ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'
        }`}
        data-project-content="true"
      >
        <div className="min-w-0 max-w-full space-y-3">
          <p
            className="site-section-label max-w-full break-words text-site-accent opacity-70"
            data-project-index="true"
          >
            {metadata}
          </p>
          <h2 className="max-w-full break-words text-[2.1875rem] leading-[0.98] font-extrabold tracking-[-0.035em] text-site-text-primary md:text-[3rem]">
            {project.title}
          </h2>
        </div>

        {project.description && (
          <p className="max-w-md break-words text-sm leading-[1.7] text-site-text-secondary md:text-lg">
            {project.description}
          </p>
        )}

        <ProjectTechnologies tech={project.tech} />
        <CtaButton
          className="w-full md:w-max"
          label="Read Case Study"
          type="custom"
          url={`/projects/${project.slug}`}
        >
          <span aria-hidden="true">&rarr;</span>
        </CtaButton>
      </div>
    </article>
  )
}
