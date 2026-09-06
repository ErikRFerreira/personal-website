import type { CSSProperties } from 'react'
import Link from 'next/link'
import styles from './ProjectDetail.module.css'

import { Media } from '@/components/Media'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import LazyShapeGrid from '@/components/ShapeGrid/Lazy'
import type { Media as MediaType, Project } from '@/payload-types'
import { ProjectHeader } from './ProjectHeader'
import { ProjectOverview } from './ProjectOverview'
import { ProjectShowcase } from './ProjectShowcase'
import { ProjectGallery } from './ProjectGallery'

export type ProjectNavigationItem = Pick<Project, 'id' | 'slug' | 'title'>

type ProjectDetailProps = {
  nextProject?: ProjectNavigationItem | null
  project: Project
}

const projectTypeLabels: Partial<Record<NonNullable<Project['type']>, string>> = {
  design: 'Design',
  'mobile-app': 'Mobile App',
  'open-source': 'Open Source',
  other: 'Other',
  'web-app': 'Web App',
}

export function formatProjectType(type: Project['type']) {
  return type ? projectTypeLabels[type] : undefined
}

export function getNextProject(currentProjectID: Project['id'], projects: ProjectNavigationItem[]) {
  if (projects.length <= 1) return null

  const currentIndex = projects.findIndex(({ id }) => id === currentProjectID)
  if (currentIndex === -1) return null

  return projects[(currentIndex + 1) % projects.length] ?? null
}

export function isSafeExternalURL(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function getImageStyle(image: MediaType): CSSProperties {
  const width = image.width ?? 0
  const height = image.height ?? 0

  return { aspectRatio: width > 0 && height > 0 ? width / height : 16 / 9 }
}

function hasMeaningfulRichTextNode(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false

  const richTextNode = node as Record<string, unknown>
  if (typeof richTextNode.text === 'string' && richTextNode.text.trim()) return true
  if (richTextNode.type === 'horizontalrule') return true

  return Array.isArray(richTextNode.children)
    ? richTextNode.children.some(hasMeaningfulRichTextNode)
    : false
}

export function hasProjectContent(content: Project['content']) {
  return content?.root.children.some(hasMeaningfulRichTextNode) ?? false
}

export function ProjectImage({
  image,
  alt,
  priority = false,
  sizes,
}: {
  alt: string
  image: MediaType
  priority?: boolean
  sizes: string
}) {
  const resource = { ...image, alt: image.alt?.trim() || alt }

  return (
    <Media
      fill
      imgClassName="object-cover"
      pictureClassName="block h-full w-full"
      priority={priority}
      resource={resource}
      size={sizes}
    />
  )
}

export function ProjectDetail({ nextProject, project }: ProjectDetailProps) {
  const featuredImage =
    typeof project.image === 'object' && project.image !== null && project.image.url
      ? project.image
      : null

  return (
    <main
      className={`${styles.page} relative isolate overflow-hidden bg-site-surface-deep pt-[var(--header-height)] text-site-text-primary`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(62rem,92svh)] overflow-hidden opacity-45"
      >
        <LazyShapeGrid
          borderColor="var(--site-border-subtle)"
          direction="diagonal"
          hoverFillColor="var(--site-surface-elevated)"
          hoverTrailAmount={0}
          shape="square"
          speed={0.2}
          squareSize={40}
        />
      </div>

      <article className={`${styles.sections} relative z-10`}>
        <ProjectHeader project={project} />

        {featuredImage && (
          <RevealOnScroll className="site-container" revealName="project-featured-image">
            <div
              className="relative w-full overflow-hidden bg-site-surface-elevated"
              data-project-featured-image="true"
              style={getImageStyle(featuredImage)}
            >
              <ProjectImage
                alt={project.title}
                image={featuredImage}
                priority
                sizes="(min-width: 1440px) 1344px, (min-width: 1024px) calc(100vw - 6rem), (min-width: 768px) calc(100vw - 4rem), calc(100vw - 3rem)"
              />
            </div>
          </RevealOnScroll>
        )}

        <ProjectOverview project={project} />

        <ProjectShowcase project={project} />

        <ProjectGallery project={project} />

        <nav
          aria-label="Project navigation"
          className="site-container pb-12 md:pb-16"
          data-project-navigation="true"
        >
          <div className="grid gap-10 border-t border-site-border-subtle pt-10 md:grid-cols-2 md:items-end md:pt-12">
            <Link
              className="group min-w-0 max-w-full w-fit break-words focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
              href="/projects"
            >
              <span className="font-mono text-[0.625rem] font-bold tracking-[0.16em] text-site-text-muted uppercase">
                &larr; Back
              </span>
              <span className="mt-2 block text-lg md:text-xl leading-tight font-bold tracking-[-0.025em] text-site-text-primary transition-colors duration-200 group-hover:text-site-accent">
                All Projects
              </span>
            </Link>

            {nextProject && (
              <Link
                className="group min-w-0 max-w-full w-fit break-words focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active md:ml-auto md:text-right"
                href={`/projects/${nextProject.slug}`}
              >
                <span className="font-mono text-[0.625rem] font-bold tracking-[0.16em] text-site-accent uppercase">
                  Next Project &rarr;
                </span>
                <span className="mt-2 block text-xl leading-tight font-bold tracking-[-0.025em] text-site-text-primary transition-colors duration-200 group-hover:text-site-accent md:text-2xl">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </main>
  )
}
