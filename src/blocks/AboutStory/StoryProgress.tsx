'use client'

import { RevealOnScroll } from '@/components/RevealOnScroll'
import ScrollReveal from '@/components/ScrollReveal'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type StoryProgressProps = {
  body: ReactNode
  eyebrow?: string | null
  heading: string
}

export function StoryProgress({ body, eyebrow, heading }: StoryProgressProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 25%'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 28,
    mass: 0.25,
    stiffness: 180,
  })
  const progress = shouldReduceMotion ? scrollYProgress : smoothProgress
  const markerPosition = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <section
      aria-labelledby="about-story-heading"
      className="relative overflow-hidden bg-site-surface-deep py-[var(--site-section-space-mobile)] text-site-text-primary md:py-[var(--site-section-space-tablet)] lg:py-[var(--site-section-space-desktop)]"
      data-theme="dark"
      ref={sectionRef}
    >
      <div className="site-container flex justify-center">
        <div className="relative w-full max-w-[40rem] py-8 pl-8 sm:pl-12">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 w-px bg-site-border-subtle"
            data-testid="about-story-vertical-track"
          >
            <motion.div
              className="absolute inset-0 origin-top bg-site-accent"
              data-testid="about-story-vertical-progress"
              style={{ scaleY: progress }}
            />
            <motion.div
              className="absolute -left-[0.21875rem] h-2 w-2 -translate-y-1/2 bg-site-accent shadow-[0_0_1rem_var(--site-glow-accent)]"
              data-testid="about-story-progress-marker"
              style={{ top: markerPosition }}
            />
          </div>

          {eyebrow && (
            <RevealOnScroll delay={0} revealName="about-story-eyebrow">
              <p className="mb-5 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.2em] text-site-accent uppercase">
                {eyebrow}
              </p>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={80} revealName="about-story-heading">
            <h2
              className="text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-site-text-primary"
              id="about-story-heading"
            >
              {heading}
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={160} revealName="about-story-horizontal-progress">
            <div
              aria-hidden="true"
              className="mt-8 mb-12 h-px w-full overflow-hidden bg-site-border-subtle md:mt-10 md:mb-16"
              data-testid="about-story-horizontal-track"
            >
              <motion.div
                className="h-full w-full origin-left bg-site-accent"
                data-testid="about-story-horizontal-progress"
                style={{ scaleX: progress }}
              />
            </div>
          </RevealOnScroll>

          <ScrollReveal
            as="div"
            baseOpacity={0.1}
            baseRotation={0}
            blurStrength={4}
            containerClassName="about-story-body-reveal"
            enableBlur
          >
            {body}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
