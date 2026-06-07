import React from 'react'

import { CMSLink } from '@/components/Link'
import type { Page, Post } from '@/payload-types'

type InitiateProjectBlockProps = {
  eyebrowText?: string | null
  heading?: string | null
  description?: string | null
  ctaLabel?: string | null
  ctaLink?: {
    appearance?: 'default' | 'outline' | null
    newTab?: boolean | null
    reference?: {
      relationTo: 'pages' | 'posts'
      value: Page | Post | string | number
    } | null
    type?: 'custom' | 'reference' | null
    url?: string | null
  } | null
  partnershipNote?: string | null
}

export function InitiateProjectBlock({
  eyebrowText,
  heading,
  description,
  ctaLabel,
  ctaLink,
  partnershipNote,
}: InitiateProjectBlockProps) {
  return (
    <section
      className="site-section relative overflow-hidden border-y border-site-border-subtle"
      data-theme="dark"
      style={{ backgroundColor: 'var(--site-surface-deep)' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 64% 48% at 50% 46%, rgb(0 242 255 / 0.09) 0%, rgb(0 242 255 / 0.03) 34%, transparent 72%)',
        }}
      />

      <div className="site-container relative z-10">
        <div className="mx-auto flex w-full max-w-176 flex-col items-center text-center">
          {eyebrowText && (
            <p className="text-site-accent font-mono text-[2.25rem] leading-none font-semibold">
              {eyebrowText}
            </p>
          )}

          {heading && (
            <h2 className="mt-4 text-[2.75rem] leading-[0.95] font-extrabold tracking-[-0.03em] text-site-text-primary sm:text-[3.4rem] md:text-[4.2rem]">
              {heading}
            </h2>
          )}

          {description && (
            <p className="mt-7 max-w-160 text-[1.125rem] leading-[1.7] text-site-text-secondary">
              {description}
            </p>
          )}

          {ctaLink && ctaLabel && (
            <CMSLink
              {...ctaLink}
              className="mt-12 min-h-14 min-w-56 rounded-xl px-10 text-[1.75rem] font-bold tracking-[-0.02em] text-site-accent-foreground shadow-[0_0_0_1px_var(--site-border-active),0_0_2.25rem_var(--site-glow-accent)] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-out hover:scale-[1.015] hover:bg-site-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active motion-reduce:transform-none motion-reduce:transition-none"
              label={ctaLabel}
              size="lg"
            />
          )}

          {partnershipNote && (
            <p className="mt-14 font-mono text-[0.7rem] leading-[1.2] font-bold tracking-[0.28em] text-site-text-secondary uppercase">
              {partnershipNote}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
