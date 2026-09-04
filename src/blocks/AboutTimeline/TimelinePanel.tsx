import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { getMilestoneKey, type Milestone } from './types'

type TimelinePanelProps = {
  activeIndex: number
  activeMilestone: Milestone
  headingId: string
  panelId: string
}

export function TimelinePanel({
  activeIndex,
  activeMilestone,
  headingId,
  panelId,
}: TimelinePanelProps) {
  const shouldReduceMotion = useReducedMotion()
  const populatedImage =
    typeof activeMilestone.image === 'object' && activeMilestone.image !== null
      ? (activeMilestone.image as MediaType)
      : null

  return (
    <div
      aria-labelledby={`${headingId}-milestone-${activeIndex}`}
      aria-live="polite"
      className="overflow-hidden border border-site-border-subtle bg-site-surface-elevated"
      id={panelId}
      role="region"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          key={getMilestoneKey(activeMilestone, activeIndex)}
          transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: 'easeOut' }}
        >
          <p className="sr-only">
            Selected timeline entry: {activeMilestone.year}
            {activeMilestone.title ? `, ${activeMilestone.title}` : ''}
          </p>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-site-surface-photo">
            {populatedImage ? (
              <Media
                fill
                imgClassName="object-cover [filter:grayscale(1)]"
                pictureClassName="block h-full w-full"
                resource={populatedImage}
                size="(max-width: 1023px) calc(100vw - 3rem), min(58vw, 52rem)"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,var(--site-surface-elevated),var(--site-surface-deep))]"
                data-testid="about-timeline-image-placeholder"
              >
                <span className="font-mono text-[0.625rem] font-bold tracking-[0.18em] text-site-text-muted uppercase">
                  Image unavailable
                </span>
              </div>
            )}
          </div>

          {activeMilestone.metadata && activeMilestone.metadata.length > 0 && (
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              {activeMilestone.metadata.map(({ id, label, value }, index) => {
                const isHighlighted = index === activeMilestone.metadata!.length - 1
                const isStatus = label.trim().toLowerCase() === 'status'

                return (
                  <div
                    className={cn(
                      'border-t border-site-border-subtle px-5 py-4 sm:px-6',
                      index % 2 === 0 && 'sm:border-r',
                      isHighlighted && 'bg-site-accent/5',
                    )}
                    data-highlighted={isHighlighted ? 'true' : undefined}
                    key={id ?? `${label}-${index}`}
                  >
                    <dt
                      className={cn(
                        'font-mono text-[0.625rem] leading-none font-bold tracking-[0.16em] uppercase',
                        isHighlighted ? 'text-site-accent' : 'text-site-text-muted',
                      )}
                    >
                      {label}
                    </dt>
                    <dd
                      className={cn(
                        'mt-2 flex items-center gap-2 text-sm font-medium',
                        isHighlighted ? 'text-site-accent' : 'text-site-text-primary',
                      )}
                    >
                      {isHighlighted && isStatus && (
                        <CheckCircle2
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0"
                          data-testid="about-timeline-status-icon"
                          strokeWidth={2}
                        />
                      )}
                      {value}
                    </dd>
                  </div>
                )
              })}
            </dl>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
