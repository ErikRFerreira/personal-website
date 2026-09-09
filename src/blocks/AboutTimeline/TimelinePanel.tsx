import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
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
          <div className="group relative aspect-[16/9] w-full overflow-hidden bg-site-surface-photo">
            {populatedImage ? (
              <Media
                fill
                imgClassName="object-cover [filter:grayscale(1)] transition-[filter] duration-700 ease-out group-hover:[filter:grayscale(0)] motion-reduce:transition-none"
                pictureClassName="block h-full w-full"
                resource={populatedImage}
                size="(max-width: 1023px) calc(100vw - 3rem), min(58vw, 52rem)"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,var(--site-surface-elevated),var(--site-surface-deep))]"
                data-testid="about-timeline-image-placeholder"
              >
                <span className="site-meta-label text-site-text-muted">Image unavailable</span>
              </div>
            )}
          </div>

          <div className="border-t border-site-border-subtle px-5 py-5 sm:px-6 sm:py-6">
            <p
              className="text-base leading-relaxed text-site-text-secondary"
              data-testid="about-timeline-description"
            >
              {activeMilestone.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
