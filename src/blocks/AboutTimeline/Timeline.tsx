'use client'

import LineSidebar from '@/components/LineSidebar'
import { useEffect, useMemo, useRef } from 'react'

import { type Milestone } from './types'
import './Timeline.css'

type TimelineProps = {
  activeIndex: number
  headingId: string
  milestones: Milestone[]
  onMilestoneSelect: (index: number) => void
  panelId: string
}

export function Timeline({
  activeIndex,
  headingId,
  milestones,
  onMilestoneSelect,
  panelId,
}: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemLabels = useMemo(
    () => milestones.map((milestone) => milestone.title?.trim() || milestone.description),
    [milestones],
  )

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current

    if (!scrollContainer) return
    let disposed = false

    const positionInitialItem = () => {
      if (disposed) return

      const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight

      if (maxScrollTop <= 0) return

      scrollContainer.scrollTop = maxScrollTop
    }

    positionInitialItem()
    const animationFrame = requestAnimationFrame(positionInitialItem)
    const settleTimer = window.setTimeout(positionInitialItem, 750)
    void document.fonts?.ready.then(positionInitialItem)

    return () => {
      disposed = true
      cancelAnimationFrame(animationFrame)
      window.clearTimeout(settleTimer)
    }
  }, [milestones.length])

  return (
    <div
      aria-label="Timeline milestones"
      className="about-timeline-scroll-region max-h-[28rem] touch-pan-y overflow-y-auto overscroll-contain px-3 lg:max-h-[32rem]"
      data-lenis-prevent
      data-testid="about-timeline-scroll-region"
      ref={scrollContainerRef}
      role="region"
      tabIndex={0}
    >
      <LineSidebar
        accentColor="var(--site-accent)"
        activeIndex={activeIndex}
        ariaLabel="Timeline milestone navigation"
        className="py-1"
        controlsId={panelId}
        fontSize={1}
        getItemId={(index) => `${headingId}-milestone-${index}`}
        indexLabels={milestones.map((milestone) => milestone.year)}
        itemGap={24}
        items={itemLabels}
        markerColor="var(--site-border-active)"
        markerGap={12}
        markerLength={60}
        maxShift={24}
        onItemClick={(index) => onMilestoneSelect(index)}
        proximityRadius={88}
        textColor="var(--site-text-secondary)"
        tickScale={0.45}
      />
    </div>
  )
}
