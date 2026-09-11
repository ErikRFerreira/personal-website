import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CtaButton } from '@/components/CtaButton'
import { RevealOnScroll } from '@/components/RevealOnScroll'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <section
      aria-label="Call to action"
      className="site-section relative isolate overflow-hidden border-b border-site-border-subtle bg-site-surface-deep!"
      data-theme="dark"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 52% 72% at 50% 54%, color-mix(in srgb, var(--site-accent) 7%, transparent) 0%, color-mix(in srgb, var(--site-accent) 2%, transparent) 42%, transparent 74%)',
        }}
      />

      <div className="site-container flex min-h-[18rem] items-center justify-center md:min-h-[21rem]">
        <div className="flex w-full max-w-4xl flex-col items-center text-center">
          {richText && (
            <RevealOnScroll revealName="cta-copy">
              <RichText
                className="text-balance text-[clamp(2rem,4.375vw,4.15625rem)] leading-[0.98] font-bold tracking-[-0.045em] text-site-text-primary md:text-[clamp(2.25rem,5vw,4.75rem)] [&_h1]:m-0 [&_h1]:text-[inherit] [&_h1]:leading-[inherit] [&_h1]:font-[inherit] [&_h2]:m-0 [&_h2]:text-[inherit] [&_h2]:leading-[inherit] [&_h2]:font-[inherit] [&_h3]:m-0 [&_h3]:text-[inherit] [&_h3]:leading-[inherit] [&_h3]:font-[inherit] [&_h4]:m-0 [&_h4]:text-[inherit] [&_h4]:leading-[inherit] [&_h4]:font-[inherit] [&_p]:m-0"
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            </RevealOnScroll>
          )}

          {links && links.length > 0 && (
            <RevealOnScroll className="mt-10 md:mt-12" delay={120} revealName="cta-links">
              <div className="flex flex-wrap items-center justify-center gap-4">
                {links.map(({ id, link }, index) => (
                  <CtaButton
                    {...link}
                    key={id ?? index}
                  >
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </CtaButton>
                ))}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>
    </section>
  )
}
