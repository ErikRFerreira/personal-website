import React from 'react'

import type { HomeBioBlock as HomeBioBlockProps, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { CtaButton } from '@/components/CtaButton'
import { RevealOnScroll } from '@/components/RevealOnScroll'

export function HomeBio({ eyebrow, name, roles, bio, portrait, email, cta }: HomeBioBlockProps) {
  return (
    <section
      className="site-section"
      data-theme="dark"
      style={{ backgroundColor: 'var(--site-surface-deep)' }}
    >
      <div className="site-container">
        <RevealOnScroll
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12"
          revealName="home-bio"
        >
          {/* ── Text column ── */}
          <div className="order-2 flex flex-col items-start lg:order-1 lg:col-span-7">
            {eyebrow && (
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-site-accent">
                {eyebrow}
              </h2>
            )}

            <h3 className="mb-10 text-4xl font-black leading-tight tracking-tight text-site-text-primary lg:text-6xl">
              {name}
            </h3>

            <div className="mb-12 space-y-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-site-accent">
                {roles}
              </p>
              <p className="max-w-2xl text-xl font-light leading-relaxed text-site-text-secondary">
                {bio}
              </p>
            </div>

            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-8">
                <CtaButton type="custom" url={cta.url} label={cta.label} />
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-medium uppercase tracking-widest text-site-text-primary transition-colors hover:text-site-accent"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* ── Image column ── */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-(--site-radius-card) border border-site-border-subtle bg-site-surface-elevated">
              {portrait ? (
                <Media
                  resource={portrait as MediaType}
                  fill
                  imgClassName="object-cover object-top"
                  size="(max-width: 1023px) 384px, 40vw"
                />
              ) : (
                <div className="h-full w-full bg-site-surface-elevated" />
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default HomeBio
