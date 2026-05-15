import React from 'react'
import type { AboutIntroBlock as AboutIntroBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export function AboutIntroBlock({
  heading,
  bio,
  bioSecondParagraph,
  socialLinks,
  bioPageLink,
  ctaHeading,
  ctaDescription,
  ctaLink,
}: AboutIntroBlockProps) {
  return (
    <section className="portfolio-section" data-theme="dark">
      <div className="portfolio-container">
        {/* Top zone: bio left, connect right */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[3fr_2fr]">
          {/* Left: heading + bio */}
          <div>
            {heading && (
              <h2 className="portfolio-card-title mb-6">{heading}</h2>
            )}
            <div className="portfolio-body-sm space-y-4">
              {bio && <p>{bio}</p>}
              {bioSecondParagraph && <p>{bioSecondParagraph}</p>}
            </div>
          </div>

          {/* Right: connect section */}
          <div className="flex flex-col items-start gap-6 md:items-end">
            <div className="flex flex-col items-start gap-3 md:items-end">
              <p className="portfolio-eyebrow text-portfolio-text-muted">Connect</p>
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex gap-6">
                  {socialLinks.map(({ label, url }, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-focus-ring portfolio-transition text-sm text-portfolio-text-primary hover:text-portfolio-accent"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              )}
              {bioPageLink?.url || bioPageLink?.reference ? (
                <CMSLink
                  type={bioPageLink.type}
                  newTab={bioPageLink.newTab}
                  url={bioPageLink.url}
                  label={bioPageLink.label}
                  appearance="inline"
                  className="portfolio-focus-ring portfolio-transition text-sm font-medium text-portfolio-accent hover:text-portfolio-accent-hover"
                >
                  {bioPageLink.label ?? 'Read full bio'} →
                </CMSLink>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom CTA card */}
        <div className="portfolio-card mt-16 p-10 text-center md:p-14">
          <div className="mx-auto max-w-md">
            {/* Envelope icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-4 h-8 w-8 text-portfolio-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>

            {ctaHeading && <h3 className="portfolio-card-title">{ctaHeading}</h3>}
            {ctaDescription && (
              <p className="portfolio-body-sm mt-3">{ctaDescription}</p>
            )}
            {(ctaLink?.url || ctaLink?.reference) && (
              <div className="mt-8">
                <CMSLink
                  type={ctaLink.type}
                  newTab={ctaLink.newTab}
                  url={ctaLink.url}
                  label={ctaLink.label}
                  appearance="default"
                  className="px-8 py-3"
                >
                  {ctaLink.label ?? 'Get in touch'}
                </CMSLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutIntroBlock
