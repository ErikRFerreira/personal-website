'use client'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ArrowRight } from 'lucide-react'

type PortfolioHeroLink = NonNullable<Page['hero']['links']>[number]['link']

export type PortfolioHeroSide = 'lens' | 'dev'

export type HeroPanelProps = {
  description?: string | null
  eyebrow?: string | null
  headline?: string | null
  headingLevel: 'h1' | 'h2'
  link?: PortfolioHeroLink
  media?: Page['hero']['media']
  onPanelFocus: (side: PortfolioHeroSide) => void
  onPanelLeave: () => void
  playbackActive: boolean
  side: PortfolioHeroSide
  videoSrc?: string | null
}

export function HeroPanel({
  description,
  eyebrow,
  headline,
  headingLevel,
  link,
  media,
  onPanelFocus,
  onPanelLeave,
  playbackActive,
  side,
  videoSrc,
}: HeroPanelProps) {
  const isLens = side === 'lens'
  const isDev = side === 'dev'
  const hasMediaResource = Boolean(videoSrc) || Boolean(media && typeof media === 'object')
  const shouldRenderMedia = isLens && hasMediaResource
  const HeadingTag = headingLevel
  const ctaLink: PortfolioHeroLink | undefined = isDev
    ? {
        appearance: link?.appearance || 'default',
        label: 'See Dev Work',
        newTab: false,
        type: 'custom',
        url: '/projects',
      }
    : link

  return (
    <section
      className={`portfolio-hero__panel portfolio-hero__panel--${side}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onPanelLeave()
        }
      }}
      onFocus={() => onPanelFocus(side)}
      onMouseEnter={() => onPanelFocus(side)}
      onMouseLeave={onPanelLeave}
    >
      {shouldRenderMedia && (
        <Media
          fill
          className="portfolio-hero__media"
          imgClassName="portfolio-hero__visual portfolio-hero__image"
          priority
          resource={media}
          size="(max-width: 767px) 100vw, 60vw"
          videoClassName="portfolio-hero__visual portfolio-hero__video"
          playWhenActive
          videoPlaybackActive={playbackActive}
          videoSrc={videoSrc}
        />
      )}

      <div className="portfolio-hero__panel-content">
        {eyebrow && <p className="portfolio-hero__eyebrow">{eyebrow}</p>}
        {headline && <HeadingTag className="portfolio-hero__headline">{headline}</HeadingTag>}

        {(description || ctaLink) && (
          <div className="portfolio-hero__reveal">
            {description && <p className="portfolio-hero__description">{description}</p>}

            {ctaLink && (
              <CMSLink
                {...ctaLink}
                appearance={ctaLink.appearance === 'outline' ? 'outline' : 'default'}
                className={`portfolio-hero__cta portfolio-hero__cta--${side}`}
              >
                <ArrowRight aria-hidden="true" />
              </CMSLink>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
