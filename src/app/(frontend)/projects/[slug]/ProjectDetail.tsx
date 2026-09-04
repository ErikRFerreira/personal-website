import type { CSSProperties } from 'react'
import Link from 'next/link'

import { CtaButton } from '@/components/CtaButton'
import { Media } from '@/components/Media'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import RichText from '@/components/RichText'
import LazyShapeGrid from '@/components/ShapeGrid/Lazy'
import type { Media as MediaType, Project } from '@/payload-types'

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

function isSafeExternalURL(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function getImageStyle(image: MediaType): CSSProperties {
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

  if (rows.length === 0 && !technologies?.length && !links?.length) return null

  return (
    <aside
      className="border-t border-site-border-subtle pt-6 lg:mt-2"
      aria-label="Project metadata"
    >
      {(rows.length > 0 || technologies?.length) && (
        <dl className="space-y-5">
          {rows.map(({ label, value }) => (
            <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4" key={label}>
              <dt className="font-mono text-[0.625rem] leading-[1.5] font-bold tracking-[0.16em] text-site-accent uppercase">
                {label}
              </dt>
              <dd className="text-sm leading-[1.55] text-site-text-primary">{value}</dd>
            </div>
          ))}

          {technologies && technologies.length > 0 && (
            <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4">
              <dt className="font-mono text-[0.625rem] leading-[1.5] font-bold tracking-[0.16em] text-site-accent uppercase">
                Stack
              </dt>
              <dd className="flex flex-wrap gap-x-2 gap-y-1 text-sm leading-[1.55] text-site-text-secondary">
                {technologies.map((technology, index) => (
                  <span key={`${technology}-${index}`}>
                    {technology}
                    {index < technologies.length - 1 && ','}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      )}

      {links && links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3" data-project-external-links="true">
          {links.map(({ id, label, url }, index) => (
            <CtaButton
              className="w-max font-mono uppercase"
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

function ProjectImage({
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
  const gallery =
    project.gallery?.flatMap(({ caption, id, image }) =>
      typeof image === 'object' && image !== null && image.url
        ? [{ caption: caption?.trim(), id, image }]
        : [],
    ) ?? []
  const hasContent = hasProjectContent(project.content)

  return (
    <main className="relative isolate overflow-hidden bg-site-surface-deep pt-[var(--header-height)] text-site-text-primary">
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

      <article className="relative z-10">
        <header className="site-container pt-14 pb-14 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24">
          <Link
            className="group inline-flex items-center gap-3 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.16em] text-site-text-secondary uppercase transition-colors duration-200 hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
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

          <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-16 md:gap-x-6 lg:gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="max-w-[13ch] text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.9] font-black tracking-[-0.055em] text-site-text-primary">
                {project.title}
              </h1>

              {project.description && (
                <p className="mt-8 max-w-3xl text-lg leading-[1.7] font-light text-site-text-secondary md:text-xl">
                  {project.description}
                </p>
              )}
            </div>

            <div className="col-span-12 lg:col-span-4 lg:pl-8 xl:pl-14">
              <ProjectMetadata project={project} />
            </div>
          </div>
        </header>

        {featuredImage && (
          <RevealOnScroll className="site-container" revealName="project-featured-image">
            <div className="group relative mr-3 mb-3 border-l border-site-border-subtle md:mr-4 md:mb-4">
              <div
                aria-hidden="true"
                className="absolute -right-3 -bottom-3 z-20 h-12 w-12 border-r border-b border-site-border-active/70 md:-right-4 md:-bottom-4"
              />
              <div
                className="relative w-full overflow-hidden bg-site-surface-elevated"
                data-project-featured-image="true"
                style={getImageStyle(featuredImage)}
              >
                <ProjectImage
                  alt={project.title}
                  image={featuredImage}
                  priority
                  sizes="(max-width: 1535px) calc(100vw - 3rem), 84rem"
                />
              </div>
            </div>
          </RevealOnScroll>
        )}

        {project.content && hasContent && (
          <section
            aria-label="Project case study"
            className="site-container py-20 md:py-28 lg:py-36"
            data-project-content="true"
          >
            <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 lg:gap-x-8">
              <RevealOnScroll
                className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-7 lg:col-start-3"
                revealName="project-content"
              >
                <RichText
                  className="text-base leading-[1.8] text-site-text-secondary md:text-lg [&_a]:text-site-accent [&_a]:underline [&_a]:decoration-site-border-active [&_a]:underline-offset-4 [&_a:hover]:text-site-accent-hover [&_blockquote]:my-10 [&_blockquote]:border-l [&_blockquote]:border-site-accent [&_blockquote]:pl-6 [&_blockquote]:text-site-text-primary [&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:text-[clamp(2rem,4vw,3.5rem)] [&_h2]:leading-[1] [&_h2]:font-extrabold [&_h2]:tracking-[-0.04em] [&_h2]:text-site-text-primary [&_h3]:mt-12 [&_h3]:mb-5 [&_h3]:text-2xl [&_h3]:leading-[1.1] [&_h3]:font-bold [&_h3]:tracking-[-0.025em] [&_h3]:text-site-text-primary [&_h4]:mt-10 [&_h4]:mb-4 [&_h4]:font-mono [&_h4]:text-xs [&_h4]:font-bold [&_h4]:tracking-[0.16em] [&_h4]:text-site-accent [&_h4]:uppercase [&_hr]:my-12 [&_hr]:border-site-border-subtle [&_li]:pl-2 [&_ol]:my-7 [&_ol]:space-y-3 [&_ol]:pl-6 [&_p]:mb-7 [&_strong]:font-semibold [&_strong]:text-site-text-primary [&_ul]:my-7 [&_ul]:list-square [&_ul]:space-y-3 [&_ul]:pl-6"
                  data={project.content}
                  enableGutter={false}
                  enableProse={false}
                />
              </RevealOnScroll>
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="site-container pb-20 md:pb-28 lg:pb-36" data-project-gallery="true">
            <RevealOnScroll revealName="project-gallery-heading">
              <div className="mb-12 flex items-center gap-4 md:mb-16">
                <h2 className="shrink-0 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.2em] text-site-accent uppercase">
                  Project Gallery
                </h2>
                <div aria-hidden="true" className="h-px flex-1 bg-site-border-subtle" />
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-12 gap-x-4 gap-y-14 md:gap-x-6 md:gap-y-20 lg:gap-x-8 lg:gap-y-28">
              {gallery.map(({ caption, id, image }, index) => (
                <RevealOnScroll
                  className={`col-span-12 md:col-span-6 lg:col-span-5 ${index % 2 === 1 ? 'lg:col-start-8' : 'lg:col-start-1'}`}
                  delay={Math.min(index * 75, 225)}
                  key={id ?? `${image.id}-${index}`}
                  revealName="project-gallery-image"
                >
                  <figure>
                    <div
                      className="relative w-full overflow-hidden border border-site-border-subtle bg-site-surface-elevated"
                      style={getImageStyle(image)}
                    >
                      <ProjectImage
                        alt={caption || `${project.title} gallery image ${index + 1}`}
                        image={image}
                        sizes="(max-width: 1023px) calc(100vw - 3rem), 67.5rem"
                      />
                    </div>
                    {caption && (
                      <figcaption className="mt-4 font-mono text-[0.625rem] leading-[1.5] font-semibold tracking-[0.12em] text-site-text-muted uppercase">
                        {caption}
                      </figcaption>
                    )}
                  </figure>
                </RevealOnScroll>
              ))}
            </div>
          </section>
        )}

        <nav
          aria-label="Project navigation"
          className="site-container pb-20 md:pb-28"
          data-project-navigation="true"
        >
          <div className="grid gap-10 border-t border-site-border-subtle pt-10 md:grid-cols-2 md:items-end md:pt-12">
            <Link
              className="group w-fit focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
              href="/projects"
            >
              <span className="font-mono text-[0.625rem] font-bold tracking-[0.16em] text-site-accent uppercase">
                &larr; Back
              </span>
              <span className="mt-2 block text-2xl leading-tight font-bold tracking-[-0.025em] text-site-text-primary transition-colors duration-200 group-hover:text-site-accent">
                All Projects
              </span>
            </Link>

            {nextProject && (
              <Link
                className="group w-fit focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active md:ml-auto md:text-right"
                href={`/projects/${nextProject.slug}`}
              >
                <span className="font-mono text-[0.625rem] font-bold tracking-[0.16em] text-site-accent uppercase">
                  Next Project &rarr;
                </span>
                <span className="mt-2 block text-2xl leading-tight font-bold tracking-[-0.025em] text-site-text-primary transition-colors duration-200 group-hover:text-site-accent md:text-3xl">
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
