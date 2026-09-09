import { RevealOnScroll } from '@/components/RevealOnScroll'
import { cn } from '@/utilities/ui'
import { getRevealDelay } from '@/utilities/getRevealDelay'
import { OperationalVectorsParallax } from './OperationalVectorsParallax'

export type OperationalVector = {
  description: string
  tags?:
    | {
        id?: string | null
        tag: string
      }[]
    | null
  title: string
}

type OperationalVectorsProps = {
  cards: OperationalVector[]
  heading: string
  headingId: string
  revealName: 'capability-card' | 'discipline-card'
  sectionClassName: string
}

const cardMinHeights = [
  'min-h-72 md:min-h-[28rem]',
  'min-h-72 md:min-h-[22rem]',
  'min-h-72 md:min-h-[20rem]',
]

const cardPositions = ['lead', 'middle', 'closing'] as const

export function OperationalVectors({
  cards,
  heading,
  headingId,
  revealName,
  sectionClassName,
}: OperationalVectorsProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        sectionClassName,
        'about-vectors-section relative overflow-hidden bg-site-surface-deep text-site-text-primary',
      )}
      data-theme="dark"
      data-testid="operational-vectors"
    >
      <div className="site-container">
        <RevealOnScroll revealName={`${revealName}-heading`}>
          <div className="mb-16 flex items-center gap-5 md:mb-20">
            <h2 className="site-section-label shrink-0" id={headingId}>
              {heading}
            </h2>
            <div aria-hidden="true" className="h-px flex-1 bg-site-border-subtle" />
          </div>
        </RevealOnScroll>

        <OperationalVectorsParallax>
          {cards.slice(0, 3).map(({ title, description, tags }, index) => (
            <RevealOnScroll
              className="h-full"
              delay={getRevealDelay(index, 100, 200)}
              key={`${title}-${index}`}
              revealName={revealName}
            >
              <article
                className={cn(
                  'flex flex-col border border-site-border-subtle bg-site-surface-elevated/90 p-(--site-card-padding)',
                  cardMinHeights[index],
                )}
                data-operational-vector-card
                data-vector-index={index + 1}
                data-vector-position={cardPositions[index]}
              >
                <span className="font-mono text-xs leading-none font-bold tracking-[0.16em] text-site-text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="mt-14 text-2xl leading-tight font-semibold tracking-[-0.025em] text-site-text-primary md:text-3xl">
                  {title}
                </h3>
                <p className="mt-5 text-base leading-[1.75] text-site-text-secondary">
                  {description}
                </p>

                {tags && tags.length > 0 && (
                  <ul aria-label={`${title} tags`} className="mt-auto flex flex-wrap gap-2 pt-10">
                    {tags.map(({ id, tag }, tagIndex) => (
                      <li
                        className="border border-site-border-subtle bg-site-surface-base/60 px-3 py-2 font-mono text-xs leading-none font-semibold tracking-[0.08em] text-site-text-primary"
                        key={id ?? `${tag}-${tagIndex}`}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </RevealOnScroll>
          ))}
        </OperationalVectorsParallax>
      </div>
    </section>
  )
}
