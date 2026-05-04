'use client'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { useEffect } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'

import './styles.css'

export function PortfolioHero({
  eyebrow,
  headline,
  description,
  links,
  media,
  scrollLabel,
}: Page['hero']) {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <section className="portfolio-hero" data-theme="dark">
      <div className="portfolio-hero__content">
        <div className="portfolio-hero__copy">
          {eyebrow && <p className="portfolio-hero__eyebrow">{eyebrow}</p>}

          {headline && <h1 className="portfolio-hero__headline">{headline}</h1>}

          {description && <p className="portfolio-hero__description">{description}</p>}

          {/*Payload array fields can be null, undefined, or an array. This guards before .map(). */}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="portfolio-hero__links">
              {links.map(({ link }, index) => (
                <li key={index}>
                  <CMSLink
                    {...link}
                    appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                    className={
                      link.appearance === 'outline'
                        ? 'portfolio-hero__link portfolio-hero__link--outline'
                        : 'portfolio-hero__link portfolio-hero__link--primary'
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          {scrollLabel && (
            <div className="portfolio-hero__scroll" aria-hidden="true">
              <span>{scrollLabel}</span>
            </div>
          )}
        </div>
      </div>

      <div className="portfolio-hero__media-panel" aria-hidden={!media}>
        {media && typeof media === 'object' && (
          <Media
            fill
            className="portfolio-hero__media"
            imgClassName="portfolio-hero__image"
            priority
            resource={media}
            size="(max-width: 767px) 100vw, 46vw"
          />
        )}
      </div>
    </section>
  )
}
