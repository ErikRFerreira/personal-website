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
  media?: Page['hero']['media'] | Page['hero']['rightMedia']
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
  const HeadingTag = headingLevel

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
      {(videoSrc || (media && typeof media === 'object')) && (
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

      {!isLens && !videoSrc && (!media || typeof media !== 'object') && (
        <div className="portfolio-hero__system" aria-hidden="true">
          <div className="portfolio-hero__code-card">
            <span className="portfolio-hero__code-label">project-filter.tsx</span>
            <pre>
              <code>{`'use client';

import { useState } from 'react';

export function ProjectFilter({ projects }: Props) {
  const [active, setActive] = useState('all');

  const visible = projects.filter(({ tech }) =>
    active === 'all' ||
    tech?.some(({ techName }) => techName === active)
  );

  return (
    <ProjectGrid projects={visible} onFilter={setActive} />
  );
}`}</code>
            </pre>
          </div>
        </div>
      )}

      <div className="portfolio-hero__panel-content">
        {eyebrow && <p className="portfolio-hero__eyebrow">{eyebrow}</p>}
        {headline && <HeadingTag className="portfolio-hero__headline">{headline}</HeadingTag>}

        {(description || link) && (
          <div className="portfolio-hero__reveal">
            {description && <p className="portfolio-hero__description">{description}</p>}

            {link && (
              <CMSLink
                {...link}
                appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                className="portfolio-hero__cta"
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
