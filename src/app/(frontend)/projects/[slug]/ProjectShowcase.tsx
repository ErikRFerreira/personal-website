import { RevealOnScroll } from '@/components/RevealOnScroll'
import type { Project } from '@/payload-types'
import { getImageStyle, ProjectImage } from './ProjectDetail'

export function ProjectShowcase({ project }: { project: Project }) {
  const showcaseImage =
    typeof project.showcaseImage === 'object' && project.showcaseImage !== null
      ? project.showcaseImage
      : null

  if (!showcaseImage?.url) return null

  const showcaseTitle = project.showcaseTitle?.trim()
  const showcaseSubtitle = project.showcaseSubtitle?.trim()
  const showcaseCaption = project.showcaseCaption?.trim()

  return (
    <RevealOnScroll className="site-container" revealName="project-showcase">
      <section data-project-showcase="true">
        {showcaseTitle && (
          <div className="mb-6 flex flex-col items-center text-center md:mb-8">
            <h2 className="text-[1.3125rem] leading-tight font-bold tracking-tight text-site-text-primary uppercase md:text-3xl">
              {showcaseTitle}
            </h2>
            {showcaseSubtitle && (
              <p className="site-caption mt-1 text-site-text-muted uppercase">
                {showcaseSubtitle}
              </p>
            )}
          </div>
        )}

        <figure>
          <div
            className="relative w-full overflow-hidden rounded border border-site-border-subtle bg-site-surface-elevated"
            style={getImageStyle(showcaseImage)}
          >
            <ProjectImage
              alt={showcaseCaption || project.title}
              image={showcaseImage}
              sizes="(max-width: 1023px) calc(100vw - 3rem), 67.5rem"
            />
          </div>
          {showcaseCaption && (
            <figcaption className="site-caption mt-4 text-site-text-muted uppercase">
              {showcaseCaption}
            </figcaption>
          )}
        </figure>
      </section>
    </RevealOnScroll>
  )
}
