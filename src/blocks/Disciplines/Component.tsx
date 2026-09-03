import { AccentHexagon } from '@/components/AccentHexagon'
import { Media } from '@/components/Media'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import SpotlightCard from '@/components/SpotlightCard'
import type { DisciplinesBlock as DisciplinesBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { getRevealDelay } from '@/utilities/getRevealDelay'
import { DisciplinesParallax } from './DisciplinesParallax'

type DisciplinesProps = DisciplinesBlockProps & {
  label?: string | null
}

const cardMinHeights = [
  'min-h-[26rem] md:min-h-[28rem]',
  'min-h-64 md:min-h-72',
  'min-h-56 md:min-h-64',
]

export function DisciplinesBlock({ eyebrow, items, label }: DisciplinesProps) {
  const cards = items

  if (!cards?.length) return null

  const heading = eyebrow?.trim() || label?.trim() || 'Operational Vectors'

  return (
    <section
      aria-labelledby="disciplines-heading"
      className="disciplines-section relative overflow-hidden bg-site-surface-deep py-[var(--site-section-space-mobile)] text-site-text-primary md:py-[var(--site-section-space-tablet)] lg:py-[var(--site-section-space-desktop)]"
      data-theme="dark"
    >
      <div className="site-container">
        <RevealOnScroll revealName="disciplines-heading">
          <div className="mb-16 flex items-center gap-4 md:mb-24">
            <AccentHexagon />
            <h2
              className="shrink-0 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.2em] text-site-accent uppercase"
              id="disciplines-heading"
            >
              {heading}
            </h2>
            <div aria-hidden="true" className="h-px flex-1 bg-site-border-subtle" />
          </div>
        </RevealOnScroll>

        <DisciplinesParallax>
          {cards.slice(0, 3).map(({ title, description, icon, tags }, index) => {
            const hasPopulatedIcon = typeof icon === 'object' && icon !== null

            return (
              <RevealOnScroll
                delay={getRevealDelay(index, 100, 200)}
                key={title}
                revealName="discipline-card"
              >
                <SpotlightCard className="discipline-card group">
                  <article
                    className={cn('relative z-10 flex flex-col', cardMinHeights[index])}
                    data-discipline-index={index + 1}
                  >
                    <div className="mb-14 flex items-start justify-between md:mb-16">
                      <span className="font-mono text-[0.6875rem] leading-none font-bold tracking-[0.16em] text-site-text-muted">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {hasPopulatedIcon ? (
                        <Media
                          alt=""
                          htmlElement={null}
                          imgClassName="h-7 w-7 object-contain opacity-70 transition-[filter,opacity] duration-300 group-hover:opacity-100"
                          resource={icon}
                          size="28px"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 border border-site-border-control"
                        />
                      )}
                    </div>

                    <h3 className="text-2xl leading-tight font-semibold tracking-[-0.025em] text-site-text-primary md:text-3xl">
                      {title}
                    </h3>
                    <p className="mt-5 text-base leading-[1.75] text-site-text-secondary">
                      {description}
                    </p>

                    {tags && tags.length > 0 && (
                      <ul
                        aria-label={`${title} tags`}
                        className="mt-auto flex flex-wrap gap-2 pt-10"
                      >
                        {tags.map(({ tag }, tagIndex) => (
                          <li
                            className="border border-site-border-subtle bg-site-surface-base/60 px-3 py-2 font-mono text-[0.625rem] leading-none font-semibold tracking-[0.08em] text-site-text-primary"
                            key={`${tag}-${tagIndex}`}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </SpotlightCard>
              </RevealOnScroll>
            )
          })}
        </DisciplinesParallax>
      </div>
    </section>
  )
}

export default DisciplinesBlock
