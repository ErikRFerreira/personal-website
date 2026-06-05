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
    <section className="site-section" data-theme="dark">
      <div className="site-container">
        {/* Top zone: bio left, connect right */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[3fr_2fr]">
          {/* Left: heading + bio */}
          <div>
            {heading && (
              <h2 className="mb-6 text-2xl leading-tight font-bold text-site-text-primary md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
            <div className="space-y-4 text-sm leading-[1.7] text-site-text-secondary">
              {bio && <p>{bio}</p>}
              {bioSecondParagraph && <p>{bioSecondParagraph}</p>}
            </div>
          </div>

          {/* Right: connect section */}
          <div className="flex flex-col items-start gap-6 md:items-end">
            <div className="flex flex-col items-start gap-3 md:items-end">
              <p className="font-mono text-[0.6875rem] leading-[1.2] font-bold tracking-[0.18em] text-site-text-muted uppercase">
                Connect
              </p>
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex gap-6">
                  {socialLinks.map(({ label, url }, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-site-text-primary transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-out hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-site-border-active focus-visible:shadow-[0_0_0_4px_var(--site-glow-accent)] motion-reduce:transition-none"
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
                  className="text-sm font-medium text-site-accent transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-out hover:text-site-accent-hover focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-site-border-active focus-visible:shadow-[0_0_0_4px_var(--site-glow-accent)] motion-reduce:transition-none"
                >
                  {bioPageLink.label ?? 'Read full bio'} →
                </CMSLink>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom CTA card */}
        <div className="rounded-site-card mt-16 border border-site-border-subtle bg-site-surface-elevated p-10 text-center md:p-14">
          <div className="mx-auto max-w-md">
            {/* Envelope icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-4 h-8 w-8 text-site-accent"
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

            {ctaHeading && (
              <h3 className="text-2xl leading-tight font-bold text-site-text-primary md:text-4xl lg:text-5xl">
                {ctaHeading}
              </h3>
            )}
            {ctaDescription && (
              <p className="mt-3 text-sm leading-[1.7] text-site-text-secondary">
                {ctaDescription}
              </p>
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
