'use client'

import type { Page } from '@/payload-types'
import { MoveHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { HeroPanel, type PortfolioHeroSide } from './HeroPanel'
import { useMediaQuery } from './useMediaQuery'

import './styles.css'

const fallbackPositioningLine =
  'Software engineering and visual storytelling shaped by depth, precision, and perspective.'

export function PortfolioHero({
  eyebrow,
  headline,
  description,
  links,
  media,
  positioningLine,
  rightDescription,
  rightEyebrow,
  rightHeadline,
  rightMedia,
  rightVideoUrl,
  videoUrl,
}: Page['hero']) {
  const { setHeaderTheme } = useHeaderTheme()
  const [activePanel, setActivePanel] = useState<PortfolioHeroSide | null>(null)
  const canUseHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const allowHoverPlayback = canUseHover && !prefersReducedMotion

  const handlePanelFocus = (side: PortfolioHeroSide) => {
    if (!allowHoverPlayback) return

    setActivePanel(side)
  }

  const handlePanelLeave = () => {
    setActivePanel(null)
  }

  useEffect(() => {
    setHeaderTheme('dark')
  })

  useEffect(() => {
    if (!allowHoverPlayback) {
      setActivePanel(null)
    }
  }, [allowHoverPlayback])

  return (
    <section className="portfolio-hero" data-theme="dark">
      <div className="portfolio-hero__stage">
        <HeroPanel
          description={description}
          eyebrow={eyebrow || 'Visual Narrator'}
          headingLevel="h1"
          headline={headline || 'Framing Perspective.'}
          link={Array.isArray(links) ? links[0]?.link : undefined}
          media={media}
          onPanelFocus={handlePanelFocus}
          onPanelLeave={handlePanelLeave}
          playbackActive={allowHoverPlayback && activePanel === 'lens'}
          side="lens"
          videoSrc={videoUrl}
        />

        <HeroPanel
          description={rightDescription}
          eyebrow={rightEyebrow || 'Software Engineer'}
          headingLevel="h2"
          headline={rightHeadline || 'Engineering Scale.'}
          link={Array.isArray(links) ? links[1]?.link : undefined}
          media={rightMedia}
          onPanelFocus={handlePanelFocus}
          onPanelLeave={handlePanelLeave}
          playbackActive={allowHoverPlayback && activePanel === 'dev'}
          side="dev"
          videoSrc={rightVideoUrl}
        />

        <div className="portfolio-hero__divider" aria-hidden="true" />
        <div className="portfolio-hero__affordance" aria-hidden="true">
          <MoveHorizontal />
        </div>
      </div>

      <p className="portfolio-hero__positioning">{positioningLine || fallbackPositioningLine}</p>
    </section>
  )
}
