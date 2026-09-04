'use client'

import { RevealOnScroll } from '@/components/RevealOnScroll'
import type { AboutTimelineBlock as AboutTimelineBlockProps } from '@/payload-types'
import { useId, useMemo, useState } from 'react'

import { Timeline } from './Timeline'
import { TimelinePanel } from './TimelinePanel'
import { getMilestoneKey } from './types'

export function AboutTimelineBlock({ eyebrow, milestones }: AboutTimelineBlockProps) {
  const headingId = useId()
  const panelId = useId()
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

            <Timeline
              activeIndex={activeIndex}
              headingId={headingId}
              milestones={milestones}
              onMilestoneSelect={(index) => setActiveKey(milestoneKeys[index])}
              panelId={panelId}
            />
          </div>

          <div className="lg:col-span-7">
            <RevealOnScroll delay={160} revealName="about-timeline-panel">
              <TimelinePanel
                activeIndex={activeIndex}
                activeMilestone={activeMilestone}
                headingId={headingId}
                panelId={panelId}
              />
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutTimelineBlock
