'use client'

import type { Project } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type ProjectArchiveItemProps = {
  project: Pick<Project, 'description' | 'image' | 'slug' | 'tech' | 'title' | 'type' | 'year'>
}

const projectTypeLabels: Partial<Record<NonNullable<Project['type']>, string>> = {
  design: 'Design',
  'mobile-app': 'Mobile App',
  'open-source': 'Open Source',
  other: 'Other',
  'web-app': 'Web App',
}

export function ProjectArchiveItem({ project }: ProjectArchiveItemProps) {
  const articleRef = useRef<HTMLElement>(null)
  const imageFrameRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const image = typeof project.image === 'object' && project.image !== null ? project.image : null
  const technologies = project.tech
    ?.map(({ techName }) => techName)
    .filter((techName): techName is string => Boolean(techName))
    .join(', ')

  useEffect(() => {
    const article = articleRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!article || motionQuery.matches) {
      setIsVisible(true)
      return
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

  useEffect(() => {
    const frame = imageFrameRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!frame || motionQuery.matches) return

    let animationFrame = 0

    const updateParallax = () => {
      const bounds = frame.parentElement?.getBoundingClientRect()
      if (!bounds) return

      const viewportHeight = window.innerHeight
      const progress = (viewportHeight - bounds.top) / (viewportHeight + bounds.height)
      const offset = Math.max(-8, Math.min(8, (0.5 - progress) * 16))
      frame.style.transform = `translate3d(0, ${offset}px, 0)`
    }

    const requestUpdate = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [image])

  return (
    <article
      ref={articleRef}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <Link
        className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
        href={`/projects/${project.slug}`}
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-site-surface-elevated">
          <div ref={imageFrameRef} className="absolute -inset-y-3 inset-x-0 will-change-transform">
            {image?.url && (
              <Image
                alt={image.alt || project.title}
                className="object-cover opacity-80 transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-hover:opacity-100 motion-reduce:transition-none"
                fill
                quality={75}
                sizes="(max-width: 1535px) calc(100vw - 3rem), 84rem"
                src={getMediaUrl(image.url, image.updatedAt)}
              />
            )}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--site-surface-base),transparent_45%)] opacity-50" />
        </div>

        <div className="mt-5 flex flex-col items-start justify-between gap-5 md:mt-6 md:flex-row md:gap-10">
          <div className="max-w-3xl flex-1">
            <h2 className="text-[1.75rem] leading-[1.08] font-extrabold tracking-[-0.035em] text-site-text-primary transition-colors duration-200 group-hover:text-site-accent md:text-[2.25rem]">
              {project.title}
            </h2>
            {project.description && (
              <p className="mt-3 text-sm leading-[1.65] text-site-text-secondary transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-[#cbd5e1] md:text-base motion-reduce:transform-none motion-reduce:transition-none">
                {project.description}
              </p>
            )}
          </div>

          {(project.year || project.type || technologies) && (
            <dl className="flex shrink-0 flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] leading-[1.35] font-bold tracking-[0.12em] uppercase md:w-48 md:flex-col md:items-end md:gap-1.5 md:text-right">
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
              {technologies && (
                <div>
                  <dt className="sr-only">Technologies</dt>
                  <dd className="text-site-text-secondary">{technologies}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </Link>
    </article>
  )
}
