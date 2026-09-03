'use client'

import { Media } from '@/components/Media'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import type {
  AboutTimelineBlock as AboutTimelineBlockProps,
  Media as MediaType,
} from '@/payload-types'
import { cn } from '@/utilities/ui'
import { CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useMemo, useState } from 'react'

type Milestone = AboutTimelineBlockProps['milestones'][number]

const getMilestoneKey = (milestone: Milestone, index: number) =>
  milestone.id ?? `${milestone.year}-${index}`

const titleSeparator = (title: string) => (/\p{P}$/u.test(title) ? ' ' : '. ')

export function AboutTimelineBlock({ eyebrow, milestones }: AboutTimelineBlockProps) {
  const headingId = useId()
  const panelId = useId()
  const shouldReduceMotion = useReducedMotion()
  const milestoneKeys = useMemo(
    () => milestones.map((milestone, index) => getMilestoneKey(milestone, index)),
    [milestones],
  )
  const [activeKey, setActiveKey] = useState(() => milestoneKeys.at(-1))

  if (milestones.length === 0) return null

  const resolvedActiveKey =
    activeKey && milestoneKeys.includes(activeKey) ? activeKey : milestoneKeys.at(-1)
  const activeIndex = Math.max(0, milestoneKeys.indexOf(resolvedActiveKey ?? ''))
  const activeMilestone = milestones[activeIndex] ?? milestones[milestones.length - 1]
  const progress = milestones.length > 1 ? activeIndex / (milestones.length - 1) : 0
  const populatedImage =
    typeof activeMilestone.image === 'object' && activeMilestone.image !== null
      ? (activeMilestone.image as MediaType)
      : null
  const activeButtonId = `${headingId}-milestone-${activeIndex}`

  return (
    <section
      aria-labelledby={headingId}
      className="relative overflow-hidden bg-site-surface-deep py-[var(--site-section-space-mobile)] text-site-text-primary md:py-[var(--site-section-space-tablet)] lg:py-[var(--site-section-space-desktop)]"
      data-theme="dark"
      data-testid="about-timeline"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-[clamp(3rem,5vw,5rem)]">
          <div className="lg:col-span-5">
            <RevealOnScroll revealName="about-timeline-heading">
              <h2
                className="mb-10 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.2em] text-site-accent uppercase md:mb-12"
                id={headingId}
              >
                {eyebrow || 'Timeline'}
              </h2>
            </RevealOnScroll>

            <div
              aria-label="Timeline milestones"
              className="max-h-[28rem] overflow-y-auto overscroll-contain pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:max-h-[32rem]"
              data-testid="about-timeline-scroll-region"
              role="region"
              tabIndex={0}
            >
              <div className="relative ml-1">
                <div
                  aria-hidden="true"
                  className="absolute top-2 bottom-2 left-[0.21875rem] w-px bg-site-border-subtle"
                >
                  <motion.div
                    animate={{ scaleY: progress }}
                    className="absolute inset-0 origin-top bg-site-accent"
                    data-testid="about-timeline-progress"
                    initial={false}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                </div>

                <ol className="relative space-y-11 py-1 md:space-y-14">
                  {milestones.map((milestone, index) => {
                    const key = milestoneKeys[index]
                    const isActive = index === activeIndex
                    const isComplete = index < activeIndex
                    const buttonId = `${headingId}-milestone-${index}`

                    return (
                      <li className="relative" key={key}>
                        <RevealOnScroll
                          delay={Math.min(index * 90, 270)}
                          revealName="about-timeline-milestone"
                        >
                          <button
                            aria-controls={panelId}
                            aria-pressed={isActive}
                            className="group relative block w-full cursor-pointer pl-10 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
                            data-state={isActive ? 'active' : isComplete ? 'complete' : 'upcoming'}
                            id={buttonId}
                            onClick={() => setActiveKey(key)}
                            type="button"
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                'absolute top-[0.1875rem] left-0 z-10 h-2 w-2 transition-[background-color,border-color,box-shadow,transform] duration-300 motion-reduce:transition-none',
                                isActive &&
                                  'scale-110 border border-site-accent bg-site-accent shadow-[0_0_0.875rem_var(--site-glow-accent)]',
                                isComplete && 'border border-site-text-muted bg-site-text-muted',
                                !isActive &&
                                  !isComplete &&
                                  'border border-site-border-active bg-site-surface-deep group-hover:bg-site-accent/20',
                              )}
                            />
                            <span
                              className={cn(
                                'block font-mono text-xs leading-none font-bold tracking-[0.14em] uppercase transition-colors duration-300 motion-reduce:transition-none',
                                isActive
                                  ? 'text-site-accent'
                                  : 'text-site-text-secondary group-hover:text-site-text-primary',
                              )}
                            >
                              {milestone.year}
                            </span>
                            <span
                              className={cn(
                                'mt-2 block text-sm leading-[1.65] transition-colors duration-300 motion-reduce:transition-none sm:text-base',
                                isActive
                                  ? 'text-site-text-primary'
                                  : 'text-site-text-secondary group-hover:text-site-text-primary',
                              )}
                            >
                              {milestone.title && (
                                <span className="font-medium text-site-text-primary">
                                  {milestone.title}
                                  {titleSeparator(milestone.title)}
                                </span>
                              )}
                              {milestone.description}
                            </span>
                          </button>
                        </RevealOnScroll>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <RevealOnScroll delay={160} revealName="about-timeline-panel">
              <div
                aria-labelledby={activeButtonId}
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
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutTimelineBlock
