'use client'

import LineSidebar from '@/components/LineSidebar'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const [isScrollable, setIsScrollable] = useState(false)
  const itemLabels = useMemo(
    () => milestones.map((milestone) => milestone.title?.trim() || milestone.description),
    [milestones],
  )

  useEffect(() => {
    const updateScrollableState = () => setIsScrollable(window.innerWidth >= 768)

    updateScrollableState()
    window.addEventListener('resize', updateScrollableState)

    return () => window.removeEventListener('resize', updateScrollableState)
  }, [])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current

    if (!scrollContainer || !isScrollable) return
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
  }, [isScrollable, milestones.length])

  return (
    <div
      aria-label="Timeline milestones"
      className="about-timeline-scroll-region max-h-none touch-auto overflow-visible overscroll-auto px-3 md:max-h-[28rem] md:touch-pan-y md:overflow-y-auto md:overscroll-contain lg:max-h-[32rem]"
      {...(isScrollable ? { 'data-lenis-prevent': 'true' } : {})}
      data-testid="about-timeline-scroll-region"
      ref={scrollContainerRef}
      role="region"
      tabIndex={isScrollable ? 0 : undefined}
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
