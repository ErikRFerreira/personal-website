import { Media } from '@/components/Media'
import { GalleryImage } from '@/components/GalleryImage'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import RichText from '@/components/RichText'
import type { Media as MediaType, Project } from '@/payload-types'
import { cn } from '@/utilities/ui'

type GalleryEntry = NonNullable<Project['gallery']>[number]
type ResolvedEntry = Omit<GalleryEntry, 'image'> & { image: MediaType }

export function ProjectGallery({ project }: { project: Project }) {
  const entries = (project.gallery ?? []).filter(
    (entry): entry is ResolvedEntry =>
      typeof entry.image === 'object' &&
      entry.image !== null &&
      Boolean(entry.image.url?.trim()) &&
      (!entry.image.mimeType || entry.image.mimeType.startsWith('image/')),
  )

  if (!entries.length) return null

  return (
    <section aria-label="Project gallery" className="site-container">
      <RevealOnScroll revealName="project-gallery-heading">
        <div className="mb-8 flex flex-col gap-4 border-t border-site-border-subtle pt-6 md:mb-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span aria-hidden="true" className="h-0.5 w-2.5 bg-site-accent" />
            <h2 className="font-mono text-xs font-bold tracking-wider text-site-text-primary uppercase">
              Project Gallery
            </h2>
            {project.gallerySubtitle?.trim() && (
              <>
                <span aria-hidden="true" className="hidden text-site-text-muted md:inline">
                  /
                </span>
                <p className="font-mono text-xs text-site-text-secondary">
                  {project.gallerySubtitle.trim()}
                </p>
              </>
            )}
          </div>
          <p className="shrink-0 font-mono text-xs tracking-widest text-site-text-muted uppercase">
            {String(entries.length).padStart(2, '0')} {entries.length === 1 ? 'Screen' : 'Screens'}
          </p>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:gap-y-24">
        {entries.map((entry, index) => {
          const split = entry.layout === 'split'
          const image = {
            ...entry.image,
            alt: entry.image.alt?.trim() || entry.title,
            width: entry.image.width || 1600,
            height: entry.image.height || 900,
          }

          const caption = (
            <figcaption className={cn('min-w-0', split && 'lg:col-start-1 lg:row-start-1')}>
              <p className="font-mono text-xs tracking-widest text-site-accent uppercase">
                Screen {String(index + 1).padStart(2, '0')}
              </p>
              <h3
                className={cn(
                  'mt-2 leading-tight font-bold tracking-tight text-site-text-primary break-words',
                  split ? 'text-2xl' : 'text-xl md:text-2xl',
                )}
              >
                {entry.title}
              </h3>
              {entry.description && (
                <RichText
                  className={cn('mt-3', entry.layout === 'full' && 'max-w-2xl mx-0')}
                  data={entry.description}
                  enableGutter={false}
                />
              )}
            </figcaption>
          )

          return (
            <RevealOnScroll
              className={cn('min-w-0', entry.layout !== 'half' && 'lg:col-span-2')}
              key={entry.id ?? index}
              revealName={`project-gallery-screen-${index + 1}`}
            >
              <figure
                className={cn(
                  'grid min-w-0 gap-6',
                  split &&
                    'items-center gap-8 border-t border-site-border-subtle pt-14 lg:grid-cols-2 lg:gap-12',
                )}
                data-gallery-layout={entry.layout}
              >
                {split && caption}
                <GalleryImage
                  image={image}
                  title={entry.title}
                  className={cn(
                    'flex min-w-0 items-center justify-center rounded border border-site-border-subtle bg-site-surface-elevated p-6 md:p-10',
                    entry.layout === 'half' && 'lg:h-[584px] lg:p-8',
                    split && 'lg:col-start-2 lg:row-start-1',
                  )}
                >
                  <Media
                    htmlElement={null}
                    imgClassName={cn(
                      'mx-auto block h-auto w-auto max-w-full object-contain',
                      entry.layout === 'half'
                        ? 'max-h-[640px] lg:max-h-[520px]'
                        : split
                          ? 'max-h-[600px]'
                          : 'max-h-[640px]',
                    )}
                    pictureClassName="block min-w-0 max-w-full"
                    loading="lazy"
                    resource={image}
                    size={
                      entry.layout === 'full'
                        ? '(min-width: 1440px) 1264px, (min-width: 768px) calc(100vw - 11rem), calc(100vw - 6rem)'
                        : '(min-width: 1440px) 576px, (min-width: 1024px) calc(50vw - 9rem), calc(100vw - 6rem)'
                    }
                  />
                </GalleryImage>
                {!split && caption}
              </figure>
            </RevealOnScroll>
          )
        })}
      </div>
    </section>
  )
}
