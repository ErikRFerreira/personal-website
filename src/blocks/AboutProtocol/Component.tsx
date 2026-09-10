import type { AboutProtocolBlock as AboutProtocolBlockProps } from '@/payload-types'

import { RevealOnScroll } from '@/components/RevealOnScroll'
import { getRevealDelay } from '@/utilities/getRevealDelay'
import { ProtocolParallax } from './ProtocolParallax'

const defaultDescription =
  'A practical framework for building reliable systems, navigating uncertainty, and knowing when conventions deserve to be challenged.'

export function AboutProtocolBlock({
  description,
  heading,
  principles,
  quote,
}: AboutProtocolBlockProps) {
  const displayDescription = description?.trim() || defaultDescription
  const displayQuote = quote?.trim() ?? ''

  return (
    <section
      aria-labelledby="about-protocol-heading"
      className="relative overflow-hidden bg-site-surface-deep py-[var(--site-section-space-mobile)] text-site-text-primary md:py-[var(--site-section-space-tablet)] lg:py-[var(--site-section-space-desktop)]"
      data-theme="dark"
      data-testid="about-protocol"
    >
      <div className="site-container">
        <RevealOnScroll revealName="about-protocol-heading">
          <h2
            className="text-[clamp(2.4375rem,5.25vw,4.15625rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-site-text-primary md:text-[clamp(2.75rem,6vw,4.75rem)]"
            id="about-protocol-heading"
          >
            {heading}
          </h2>
          <p
            className="mt-6 max-w-3xl text-sm leading-[1.75] text-site-text-secondary md:text-lg"
            data-testid="about-protocol-description"
          >
            {displayDescription}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={80} revealName="about-protocol-divider">
          <div aria-hidden="true" className="mt-10 h-px w-full bg-site-border-subtle md:mt-14" />
        </RevealOnScroll>

        <ProtocolParallax
          principles={
            <ul className="space-y-8 md:space-y-10" data-testid="about-protocol-principles">
              {principles.map(({ id, text }, index) => (
                <li key={id ?? `${text}-${index}`}>
                  <RevealOnScroll
                    delay={getRevealDelay(index, 100, 200)}
                    revealName="about-protocol-principle"
                  >
                    <div className="group flex items-start gap-6">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] h-3 w-3 shrink-0 bg-site-text-muted/45 transition-[background-color,box-shadow,transform] duration-300 ease-out group-hover:scale-110 group-hover:bg-site-accent group-hover:shadow-[0_0_0.875rem_var(--site-glow-accent)] motion-reduce:transform-none motion-reduce:transition-none"
                      />
                      <p className="text-sm leading-[1.7] text-site-text-primary md:text-lg">
                        {text}
                      </p>
                    </div>
                  </RevealOnScroll>
                </li>
              ))}
            </ul>
          }
          quote={
            <RevealOnScroll delay={180} revealName="about-protocol-quote">
              <blockquote
                className="group relative flex min-h-52 w-full items-center justify-center border border-transparent bg-transparent px-8 py-12 text-center transition-[background-color,border-color,box-shadow,color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:-translate-y-1 focus-visible:border-site-border-active focus-visible:bg-site-surface-elevated/55 focus-visible:shadow-site-glow focus-visible:outline-none motion-reduce:transform-none motion-reduce:transition-none md:min-h-56 md:px-12"
                data-testid="about-protocol-quote"
                tabIndex={0}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-site-border-active/40 transition-colors duration-500 group-focus-visible:border-site-accent motion-reduce:transition-none"
                />
                <p className="max-w-[32rem] text-[clamp(1.3125rem,2.625vw,1.875rem)] leading-[1.35] font-medium tracking-[-0.025em] text-site-text-secondary italic transition-colors duration-500 group-focus-visible:text-site-accent motion-reduce:transition-none md:text-[clamp(1.5rem,3vw,2.125rem)]">
                  &ldquo;{displayQuote}&rdquo;
                </p>
                <span
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 h-8 w-8 border-r-2 border-b-2 border-site-border-active/40 transition-colors duration-500 group-focus-visible:border-site-accent motion-reduce:transition-none"
                />
              </blockquote>
            </RevealOnScroll>
          }
        />
      </div>
    </section>
  )
}

export default AboutProtocolBlock
