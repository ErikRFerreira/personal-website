import BlurText from '@/components/BlurText'
import { Media } from '@/components/Media'
import { RevealOnScroll } from '@/components/RevealOnScroll'

import { ProfileHeroParallax } from './ProfileHeroParallax'

import type { Page } from '@/payload-types'

export function ProfileHero({ name, intro, media, imageLabel }: Page['hero']) {
  const nameParts = name?.trim().split(/\s+/).filter(Boolean) ?? []
  const hasPopulatedImage = typeof media === 'object' && media !== null

  if (!name || !intro) return null

  return (
    <section
      aria-labelledby="profile-hero-heading"
      className="relative isolate min-h-[80svh] overflow-hidden bg-site-surface-deep text-site-text-primary"
      data-has-image={hasPopulatedImage}
      data-theme="dark"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 left-0 hidden border-t border-site-border-subtle md:block"
      />

      <div className="site-container relative z-10 flex min-h-[80svh] items-center py-20 md:py-28 lg:py-36">
        <ProfileHeroParallax
          imageContent={
            <RevealOnScroll className="h-full w-full" delay={980} revealName="profile-hero-image">
              <div className="group relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 border border-site-border-active/25"
                />
                <div className="relative aspect-4/5 w-full overflow-hidden bg-site-surface-elevated md:h-[min(43rem,68svh)] md:aspect-auto">
                  {hasPopulatedImage ? (
                    <Media
                      fill
                      imgClassName="object-cover [filter:grayscale(1)] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.015] group-hover:[filter:grayscale(0)] motion-reduce:transform-none motion-reduce:transition-none"
                      pictureClassName="block h-full w-full"
                      resource={media}
                      size="(max-width: 767px) calc(100vw - 3rem), 67vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-site-surface-elevated" />
                  )}
                </div>

                {imageLabel && (
                  <RevealOnScroll
                    className="absolute right-3 bottom-3 z-20 md:right-4 md:bottom-4"
                    delay={1140}
                    revealName="profile-hero-image-label"
                  >
                    <p className="border border-site-border-active bg-site-surface-deep/90 px-3 py-2 font-mono text-[0.625rem] leading-none font-bold tracking-[0.16em] text-site-accent uppercase backdrop-blur-sm">
                      {imageLabel}
                    </p>
                  </RevealOnScroll>
                )}
              </div>
            </RevealOnScroll>
          }
          textContent={
            <>
              <h1
                aria-label={name}
                className="text-[clamp(4rem,17vw,7rem)] leading-[0.78] font-black tracking-[-0.065em] text-site-text-primary uppercase sm:text-[clamp(5rem,14vw,8rem)] md:text-[clamp(6rem,10vw,10rem)]"
                id="profile-hero-heading"
              >
                {nameParts.map((part, index) => (
                  <BlurText
                    animateBy="letters"
                    ariaHidden
                    as="span"
                    delay={55}
                    direction="bottom"
                    key={`${part}-${index}`}
                    rootMargin="0px 0px -5%"
                    startDelay={index * 180}
                    stepDuration={0.32}
                    text={part}
                    threshold={0.05}
                  />
                ))}
              </h1>

              <RevealOnScroll delay={160} revealName="profile-hero-rule">
                <div aria-hidden="true" className="mt-8 h-px w-24 bg-site-accent md:mt-10" />
              </RevealOnScroll>

              <RevealOnScroll delay={320} revealName="profile-hero-intro">
                <p className="mt-8 max-w-2xl text-lg leading-[1.65] font-light text-site-text-secondary sm:text-xl md:mt-10 md:text-2xl">
                  {intro}
                </p>
              </RevealOnScroll>
            </>
          }
        />
      </div>
    </section>
  )
}
