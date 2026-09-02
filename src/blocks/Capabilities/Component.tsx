import { Media } from '@/components/Media'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import SpotlightCard from '@/components/SpotlightCard'
import type { CapabilitiesBlock as CapabilitiesBlockProps } from '@/payload-types'
import { getRevealDelay } from '@/utilities/getRevealDelay'
import { Hexagon } from 'lucide-react'
import { CapabilitiesParallax } from './CapabilitiesParallax'

type CapabilitiesProps = CapabilitiesBlockProps & {
  capabilities?:
    | {
        name: string
        description: string
        icon: CapabilitiesBlockProps['items'][number]['icon']
      }[]
    | null
  label?: string | null
}

export function CapabilitiesBlock({
  capabilities: legacyCapabilities,
  eyebrow,
  items,
  label,
}: CapabilitiesProps) {
  const cards = Array.isArray(items)
    ? items
    : legacyCapabilities?.map(({ name, ...capability }) => ({
        ...capability,
        tags: null,
        title: name,
      }))

  if (!cards?.length) return null

  const heading = eyebrow?.trim() || label?.trim() || 'Operational Vectors'

  return (
    <section
      aria-labelledby="capabilities-heading"
      className="capabilities-section relative overflow-hidden bg-site-surface-deep py-[var(--site-section-space-mobile)] text-site-text-primary md:py-[var(--site-section-space-tablet)] lg:py-[var(--site-section-space-desktop)]"
      data-theme="dark"
    >
      <div className="site-container">
        <RevealOnScroll revealName="capabilities-heading">
          <div className="mb-16 flex items-center gap-4 md:mb-24">
            <Hexagon
              aria-hidden="true"
              className="h-4 w-4 shrink-0 fill-current text-site-accent"
              strokeWidth={1.5}
            />
            <h2
              className="shrink-0 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.2em] text-site-accent uppercase"
              id="capabilities-heading"
            >
              {heading}
            </h2>
            <div aria-hidden="true" className="h-px flex-1 bg-site-border-subtle" />
          </div>
        </RevealOnScroll>

        <CapabilitiesParallax>
          {cards.slice(0, 3).map(({ title, description, icon, tags }, index) => {
            const hasPopulatedIcon = typeof icon === 'object' && icon !== null

            return (
              <RevealOnScroll
                className="h-full [&>div]:h-full"
                delay={getRevealDelay(index, 100, 200)}
                key={title}
                revealName="capability-card"
              >
                <SpotlightCard className="capability-card group">
                  <article
                    className="relative z-10 flex h-full min-h-80 flex-col"
                    data-capability-index={index + 1}
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
                      <ul aria-label={`${title} tags`} className="mt-auto flex flex-wrap gap-2 pt-10">
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
        </CapabilitiesParallax>
      </div>
    </section>
  )
}

export default CapabilitiesBlock
