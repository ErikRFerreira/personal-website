import { RevealOnScroll } from '@/components/RevealOnScroll'
import SpotlightCard from '@/components/SpotlightCard'
import type { ProjectPrinciplesBlock as ProjectPrinciplesBlockProps } from '@/payload-types'
import { getRevealDelay } from '@/utilities/getRevealDelay'

export function ProjectPrinciplesBlock({
  description,
  eyebrow,
  items,
  title,
}: ProjectPrinciplesBlockProps) {
  const heading = title?.trim()
  const principles = items?.filter((item) => item.title?.trim() && item.description?.trim())

  if (!heading || !principles?.length) return null

  return (
    <section aria-label={heading} className="site-container" data-project-principles="true">
      <RevealOnScroll revealName="project-principles-heading">
        <div className="border-t border-site-border-subtle pt-6">
          {eyebrow?.trim() && (
            <p className="site-section-label text-site-accent">{eyebrow.trim()}</p>
          )}
          <h2 className="mt-3 max-w-3xl text-3xl leading-tight font-bold tracking-[-0.03em] text-site-text-primary md:text-4xl">
            {heading}
          </h2>
          {description?.trim() && (
            <p className="mt-4 max-w-3xl text-base leading-[1.75] text-site-text-secondary md:text-lg">
              {description.trim()}
            </p>
          )}
        </div>
      </RevealOnScroll>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((item, index) => (
          <RevealOnScroll
            className="h-full [&>div]:h-full"
            delay={getRevealDelay(index, 75, 150)}
            key={item.id ?? `${item.title}-${index}`}
            revealName="project-principle-card"
          >
            <SpotlightCard
              className="h-full rounded-site-card! border-site-border-subtle! bg-site-surface-elevated/70! p-(--site-card-padding)!"
              spotlightColor="rgb(0 242 255 / 8%)"
            >
              <article className="relative z-10 flex h-full flex-col">
                {item.label?.trim() && (
                  <p className="site-meta-label text-site-accent">{item.label.trim()}</p>
                )}
                <h3
                  className={`${item.label?.trim() ? 'mt-8' : ''} text-xl leading-tight font-semibold tracking-[-0.025em] text-site-text-primary md:text-2xl`}
                >
                  {item.title.trim()}
                </h3>
                <p className="mt-4 text-base leading-[1.7] text-site-text-secondary">
                  {item.description.trim()}
                </p>
              </article>
            </SpotlightCard>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
