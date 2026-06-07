import React from 'react'

import type { AboutIntroBlock as AboutIntroBlockProps, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export function AboutIntroBlock({
  eyebrow,
  headlineLineOne,
  headlineLineTwo,
  bio,
  bioSecondParagraph,
  socialLinks,
  portrait,
}: AboutIntroBlockProps) {
  return (
    <section
      className="site-section"
      data-theme="dark"
      style={{
        background:
          'radial-gradient(ellipse 70% 60% at 5% 15%, rgb(0 120 255 / 0.05) 0%, transparent 55%), var(--site-surface-deep)',
      }}
    >
      <div className="site-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          {/* ── Left column ── */}
          <div>
            {eyebrow && (
              <p className="mb-5 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-site-accent">
                {eyebrow}
              </p>
            )}

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-site-text-primary md:text-5xl lg:text-6xl xl:text-[4.5rem]">
              {headlineLineOne && <span className="block">{headlineLineOne}</span>}
              {headlineLineTwo && <span className="block">{headlineLineTwo}</span>}
            </h2>

            {(bio || bioSecondParagraph) && (
              <div className="mt-6 max-w-prose space-y-4 text-base leading-[1.75] text-site-text-secondary">
                {bio && <p>{bio}</p>}
                {bioSecondParagraph && <p>{bioSecondParagraph}</p>}
              </div>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-8">
                <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-site-text-muted">
                  Connect
                </p>
                <div className="mt-3 flex flex-wrap gap-6">
                  {socialLinks.map(({ label, url }, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative text-sm text-site-text-primary transition-colors duration-200 hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-site-border-active"
                    >
                      {label}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-px w-0 bg-site-accent transition-[width] duration-200 group-hover:w-full"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — portrait ── */}
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-(--site-radius-card) border border-site-border-subtle bg-site-surface-elevated">
              {portrait ? (
                <Media
                  resource={portrait as MediaType}
                  fill
                  imgClassName="object-cover object-top"
                  priority
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-site-text-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] opacity-40">
                    Portrait Placeholder
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutIntroBlock
