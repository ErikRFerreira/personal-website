'use client'

import type { Project } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

type ProjectArchiveItemProps = {
  index: number
  project: Pick<Project, 'description' | 'image' | 'slug' | 'tech' | 'title' | 'type' | 'year'>
  total: number
}

const projectTypeLabels: Partial<Record<NonNullable<Project['type']>, string>> = {
  design: 'Design',
  'mobile-app': 'Mobile App',
  'open-source': 'Open Source',
  other: 'Other',
  'web-app': 'Web App',
}

const MIN_MEDIA_ASPECT = 4 / 3
const MAX_MEDIA_ASPECT = 21 / 9

function formatIndex(value: number) {
  return String(value).padStart(2, '0')
}

export function ProjectArchiveItem({ index, project, total }: ProjectArchiveItemProps) {
  const articleRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const image = typeof project.image === 'object' && project.image !== null ? project.image : null
  const technologies = project.tech
    ?.map(({ techName }) => techName)
    .filter((techName): techName is string => Boolean(techName))
  const rawAspectRatio = image?.width && image.height ? image.width / image.height : 16 / 9
  const mediaAspectRatio = Math.min(MAX_MEDIA_ASPECT, Math.max(MIN_MEDIA_ASPECT, rawAspectRatio))
  const mediaStyle = { aspectRatio: mediaAspectRatio } as CSSProperties
  const indexLabel = `${formatIndex(index + 1)} / ${formatIndex(total)}`
  const hasMetadata = Boolean(project.year || project.type || technologies?.length)

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
      className={`${index > 0 ? 'mt-20 pt-20 md:mt-28 md:pt-28 lg:mt-36 lg:pt-32' : ''} ${
        index % 2 === 1 ? 'lg:w-[92%] lg:self-end' : ''
      } transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <Link
        className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
        href={`/projects/${project.slug}`}
      >
        {image?.url && (
          <div
            className="relative w-full overflow-hidden bg-site-surface-elevated"
            data-project-media="true"
            style={mediaStyle}
          >
            <div className="absolute inset-0">
              <Image
                alt={image.alt || project.title}
                className="object-cover opacity-85 transition-[transform,opacity] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.02] group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:will-change-auto"
                fill
                quality={75}
                sizes="(max-width: 1535px) calc(100vw - 3rem), 84rem"
                src={getMediaUrl(image.url, image.updatedAt)}
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--site-surface-base),transparent_45%)] opacity-40 transition-opacity duration-500 group-hover:opacity-20 motion-reduce:transition-none" />
          </div>
        )}

        <div className={image?.url ? 'mt-5 md:mt-6' : ''}>
          <div className="mb-5 flex items-center gap-4 md:mb-6">
            <span
              className="shrink-0 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.18em] text-site-accent uppercase"
              data-project-index="true"
            >
              {indexLabel}
            </span>
            <span className="h-px w-12 bg-site-accent/40 transition-[width,background-color] duration-300 ease-out group-hover:w-20 group-hover:bg-site-accent/70 motion-reduce:transition-none" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(14rem,0.8fr)] lg:gap-12 xl:gap-16">
            <div className="max-w-3xl">
              <h2 className="text-[1.75rem] leading-[1.08] font-extrabold tracking-[-0.035em] text-site-text-primary transition-colors duration-200 group-hover:text-site-accent md:text-[2.25rem]">
                {project.title}
              </h2>
              {project.description && (
                <p className="mt-3 text-sm leading-[1.65] text-site-text-secondary transition-colors duration-200 group-hover:text-site-text-primary md:text-base">
                  {project.description}
                </p>
              )}
            </div>

            {hasMetadata && (
              <dl className="min-w-0 font-mono text-[0.6875rem] leading-[1.5] font-bold tracking-[0.1em] uppercase lg:pt-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {project.year && (
                    <div>
                      <dt className="sr-only">Year</dt>
                      <dd className="text-site-accent">{project.year}</dd>
                    </div>
                  )}
                  {project.type && (
                    <div>
                      <dt className="sr-only">Project type</dt>
                      <dd className="text-site-text-primary">{projectTypeLabels[project.type]}</dd>
                    </div>
                  )}
                </div>

                {technologies && technologies.length > 0 && (
                  <div className="mt-3">
                    <dt className="sr-only">Technologies</dt>
                    <dd className="flex flex-wrap gap-x-1.5 gap-y-1 text-site-text-secondary transition-colors duration-200 group-hover:text-site-text-primary">
                      {technologies.map((technology, technologyIndex) => (
                        <span
                          className="whitespace-nowrap"
                          key={`${technology}-${technologyIndex}`}
                        >
                          {technology}
                          {technologyIndex < technologies.length - 1 && ','}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
