import React from 'react'

import type { HomeBioBlock as HomeBioBlockProps, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { CtaButton } from '@/components/CtaButton'
import { RevealOnScroll } from '@/components/RevealOnScroll'

export function HomeBio({ eyebrow, name, roles, bio, portrait, email, cta }: HomeBioBlockProps) {
  return (
    <section
      className="site-section relative overflow-hidden text-site-text-primary"
      data-theme="dark"
      style={{ backgroundColor: 'var(--site-surface-deep)' }}
    >
      <div className="site-container">
        <RevealOnScroll revealName="home-bio">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-site-border-subtle bg-[color-mix(in_srgb,var(--site-surface-elevated)_88%,transparent)] p-8 sm:p-10 md:p-12 lg:p-14">
            {/* Ambient top-right teal blur glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-site-accent/5 blur-3xl"
            />

            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-10 lg:gap-12">
              {/* Portrait column */}
              <div className="flex shrink-0 justify-center">
                <div className="relative flex items-center justify-center">
                  {/* Rotating dashed ring */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2.5 rounded-full border border-dashed border-site-accent/40 opacity-60 animate-[spin_20s_linear_infinite] motion-reduce:animate-none"
                  />
                  {/* Avatar border ring */}
                  <div className="relative h-44 w-44 shrink-0 rounded-full border-2 border-site-accent/70 p-1.5 shadow-[0_0_2rem_var(--site-glow-accent)] sm:h-52 sm:w-52 md:h-56 md:w-56">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-site-surface-deep">
                      {portrait ? (
                        <Media
                          resource={portrait as MediaType}
                          fill
                          imgClassName="object-cover object-top filter grayscale contrast-125 transition-[filter] duration-300"
                          size="(max-width: 768px) 208px, 224px"
                        />
                      ) : (
                        <div className="h-full w-full bg-site-surface-deep" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text & action column */}
              <div className="flex flex-1 flex-col items-start justify-center gap-5 text-left">
                <div>
                  {eyebrow && (
                    <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-[0.2em] text-site-accent md:text-sm">
                      {eyebrow}
                    </span>
                  )}

                  <h2 className="text-3xl font-black tracking-tight text-site-text-primary sm:text-4xl md:text-5xl">
                    {name}
                  </h2>

                  {roles && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-site-text-muted md:text-sm">
                      {roles}
                    </p>
                  )}
                </div>

                {bio && (
                  <p className="text-base font-light leading-relaxed text-site-text-secondary md:text-lg">
                    {bio}
                  </p>
                )}

                <div className="mt-1 flex flex-wrap items-center gap-6 sm:gap-8">
                  {cta?.url && cta?.label && (
                    <CtaButton type="custom" url={cta.url} label={cta.label} />
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="font-mono text-xs font-medium uppercase tracking-widest text-site-accent border-b border-site-accent/30 pb-0.5 transition-colors duration-200 hover:border-site-accent hover:text-site-accent-hover md:text-sm"
                    >
                      {email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default HomeBio
