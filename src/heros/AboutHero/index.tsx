import BlurText from '@/components/BlurText'
import { Media } from '@/components/Media'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import type { Page } from '@/payload-types'

export function AboutHero({ name, intro, media, imageLabel }: Page['hero']) {
  const heading = name?.trim()
  const headingWords = heading?.split(/\s+/).filter(Boolean) ?? []
  const populatedImage = typeof media === 'object' && media !== null ? media : null
  const hasPopulatedImage = Boolean(populatedImage)

  if (!heading || !intro) return null

  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative isolate overflow-hidden bg-site-surface-deep text-site-text-primary"
      data-has-image={hasPopulatedImage}
      data-theme="dark"
      data-testid="about-hero"
    >
      <div className="site-container relative z-10 pt-[calc(var(--header-height)+4rem)] pb-20 md:pt-[calc(var(--header-height)+5rem)] md:pb-28 lg:pt-[calc(var(--header-height)+6rem)] lg:pb-32">
        <div className="relative z-20 max-w-[72rem]" data-about-hero-text>
          <h1
            aria-label={heading}
            className="text-[clamp(4.75rem,24vw,7.5rem)] leading-[0.78] font-black tracking-[-0.065em] text-site-text-primary uppercase md:text-[clamp(7rem,13vw,11.5rem)]"
            id="about-hero-heading"
          >
            <span className="flex flex-col items-start md:flex-row md:gap-x-[0.2em]">
              {headingWords.map((word, index) => (
                <span
                  className="block whitespace-nowrap"
                  data-about-heading-word
                  key={`${word}-${index}`}
                >
                  <BlurText
                    animateBy="letters"
                    ariaHidden
                    as="span"
                    className="!flex-nowrap"
                    delay={55}
                    direction="bottom"
                    rootMargin="0px 0px -5%"
                    startDelay={index * 180}
                    stepDuration={0.32}
                    text={word}
                    threshold={0.05}
                  />
                </span>
              ))}
            </span>
          </h1>

          <RevealOnScroll delay={520} revealName="about-hero-rule">
            <div aria-hidden="true" className="mt-9 h-px w-24 bg-site-accent md:mt-11" />
          </RevealOnScroll>

          <RevealOnScroll delay={640} revealName="about-hero-intro">
            <p className="mt-7 max-w-2xl text-lg leading-[1.65] font-light text-site-text-secondary sm:text-xl lg:text-[1.375rem]">
              {intro}
            </p>
          </RevealOnScroll>
        </div>

        <div
          className="relative z-10 mt-14 ml-auto w-full md:mt-20 md:w-[86%] lg:mt-24 lg:w-[72%]"
          data-about-hero-image-layer
        >
          <RevealOnScroll className="h-full w-full" delay={860} revealName="about-hero-image">
            <div className="group relative mr-4 mb-4 md:mr-5 md:mb-5">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-4 translate-y-4 border border-site-border-active/45 md:translate-x-5 md:translate-y-5"
                data-testid="about-hero-offset-frame"
              />
              <div
                className="relative aspect-4/3 w-full overflow-hidden border border-site-border-subtle bg-site-surface-elevated md:aspect-2/1 lg:aspect-[16/7]"
                data-testid="about-hero-image-frame"
              >
                {populatedImage ? (
                  <Media
                    fill
                    imgClassName="object-cover [filter:grayscale(1)] transition-[filter,scale] duration-700 ease-out group-hover:scale-[1.015] group-hover:[filter:grayscale(0)] motion-reduce:scale-100 motion-reduce:transition-none"
                    pictureClassName="block h-full w-full"
                    priority
                    resource={populatedImage}
                    size="(max-width: 767px) calc(100vw - 4rem), (max-width: 1023px) 86vw, min(72vw, 64rem)"
                  />
                ) : (
                  <div className="h-full w-full bg-site-surface-elevated" />
                )}
              </div>

              {imageLabel && (
                <RevealOnScroll
                  className="absolute right-3 bottom-3 z-20 md:right-4 md:bottom-4"
                  delay={1020}
                  revealName="about-hero-image-label"
                >
                  <p className="border border-site-border-active bg-site-surface-deep/90 px-3 py-2 font-mono text-[0.625rem] leading-none font-bold tracking-[0.16em] text-site-accent uppercase backdrop-blur-sm">
                    {imageLabel}
                  </p>
                </RevealOnScroll>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
