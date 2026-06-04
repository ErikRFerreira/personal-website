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

      {isDev && (
        <div className="portfolio-hero__system" aria-hidden="true">
          <div className="portfolio-hero__system-grid" />

          <svg
            className="portfolio-hero__system-lines"
            focusable="false"
            preserveAspectRatio="none"
            viewBox="0 0 640 460"
          >
            <path
              className="portfolio-hero__system-line portfolio-hero__system-line--primary"
              d="M54 294 H178 L236 236 H356 L432 160 H586"
              pathLength={1}
            />
            <path
              className="portfolio-hero__system-line portfolio-hero__system-line--secondary"
              d="M118 126 H244 L318 202 H496"
              pathLength={1}
            />
            <path
              className="portfolio-hero__system-line portfolio-hero__system-line--tertiary"
              d="M166 366 H292 L366 292 H532"
              pathLength={1}
            />
          </svg>

          <span className="portfolio-hero__system-node portfolio-hero__system-node--source" />
          <span className="portfolio-hero__system-node portfolio-hero__system-node--cache" />
          <span className="portfolio-hero__system-node portfolio-hero__system-node--edge" />
          <span className="portfolio-hero__system-node portfolio-hero__system-node--deploy" />

          <div className="portfolio-hero__code-card">
            <span className="portfolio-hero__code-label">deploy-pipeline.ts</span>
            <pre>
              <code>{`type ReleaseTarget = 'edge' | 'api' | 'cms';

const checks = ['typed', 'cached', 'secure'] as const;

export async function ship(target: ReleaseTarget) {
  const build = await pipeline.verify({
    target,
    checks,
    preview: true,
  });

  return build.ready ? deploy(target) : rollback();
}`}</code>
            </pre>
          </div>

          <div className="portfolio-hero__status-chip">
            <span className="portfolio-hero__status-dot" />
            System online
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
