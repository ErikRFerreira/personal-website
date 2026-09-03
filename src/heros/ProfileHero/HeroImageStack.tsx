'use client'

import NextImage from 'next/image'
import { motion } from 'motion/react'
import { useState, useSyncExternalStore } from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

type HeroIdentity = 'developer' | 'diver'

type HeroImageStackProps = {
  developerMedia?: MediaType | null
  diverMedia: MediaType
  primaryLabel?: string | null
  secondaryLabel?: string | null
}

const identityName: Record<HeroIdentity, string> = {
  developer: 'Developer',
  diver: 'Diver',
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery)
  mediaQuery.addEventListener('change', callback)

  return () => mediaQuery.removeEventListener('change', callback)
}

function getReducedMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches
}

export function HeroImageStack({
  developerMedia,
  diverMedia,
  primaryLabel = '01 / DIVER',
  secondaryLabel = '02 / DEVELOPER',
}: HeroImageStackProps) {
  const [activeIdentity, setActiveIdentity] = useState<HeroIdentity>('diver')
  const shouldReduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false,
  )
  const nextIdentity: HeroIdentity = activeIdentity === 'diver' ? 'developer' : 'diver'

  const accessibleDiverMedia: MediaType = {
    ...diverMedia,
    alt: diverMedia.alt?.trim() || 'Erik Ferreira diving underwater',
  }
  const accessibleDeveloperMedia = developerMedia
    ? {
        ...developerMedia,
        alt: developerMedia.alt?.trim() || 'Erik Ferreira working as a software developer',
      }
    : null

  const cards: Array<{
    identity: HeroIdentity
    label: string
    media?: MediaType | null
  }> = [
    {
      identity: 'developer',
      label: secondaryLabel?.trim() || '02 / DEVELOPER',
      media: accessibleDeveloperMedia,
    },
    {
      identity: 'diver',
      label: primaryLabel?.trim() || '01 / DIVER',
      media: accessibleDiverMedia,
    },
  ]

  return (
    <div
      className="relative aspect-4/5 w-full [--hero-stack-offset-x:12px] [--hero-stack-offset-y:14px] md:h-[min(43rem,68svh)] md:aspect-auto md:[--hero-stack-offset-x:28px] md:[--hero-stack-offset-y:24px]"
      data-active-card={activeIdentity}
      data-reduced-motion={shouldReduceMotion ? 'true' : 'false'}
      data-testid="hero-image-stack"
    >
      {cards.map(({ identity, label, media }) => {
        const isActive = identity === activeIdentity

        return (
          <motion.figure
            animate={{
              rotate: isActive ? 0 : 1.75,
              scale: isActive ? 1 : 0.96,
              x: isActive ? '0px' : 'var(--hero-stack-offset-x)',
              y: isActive ? '0px' : 'var(--hero-stack-offset-y)',
            }}
            className={`absolute inset-0 overflow-hidden border bg-site-surface-elevated ${
              isActive
                ? 'border-site-border-subtle shadow-[0_1rem_2.5rem_rgb(0_0_0/0.28)]'
                : 'border-site-border-active/50 shadow-[0_1.4rem_3.5rem_rgb(0_0_0/0.42)]'
            }`}
            data-card-identity={identity}
            data-card-state={isActive ? 'front' : 'back'}
            initial={false}
            key={identity}
            style={{ zIndex: isActive ? 2 : 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { damping: 28, mass: 0.7, stiffness: 260, type: 'spring' }
            }
          >
            {media ? (
              <Media
                alt={media.alt || undefined}
                fill
                imgClassName={`object-cover transition-[filter,opacity,scale] duration-700 ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                  isActive
                    ? '[filter:grayscale(1)] group-hover:scale-[1.015] group-hover:[filter:grayscale(0)]'
                    : 'opacity-90 [filter:grayscale(1)]'
                }`}
                pictureClassName="block h-full w-full"
                resource={media}
                size="(max-width: 767px) calc(100vw - 3rem), 67vw"
              />
            ) : (
              <NextImage
                alt="Software development workspace displaying project source code"
                className={`object-cover transition-[filter,opacity,scale] duration-700 ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                  isActive
                    ? '[filter:grayscale(1)] group-hover:scale-[1.015] group-hover:[filter:grayscale(0)]'
                    : 'opacity-90 [filter:grayscale(1)]'
                }`}
                fill
                sizes="(max-width: 767px) calc(100vw - 3rem), 67vw"
                src="/images/hero-code-bg.svg"
              />
            )}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[40%] bg-gradient-to-r from-site-surface-deep/90 via-site-surface-deep/50 to-transparent md:block"
              data-hero-image-scrim
            />

            <figcaption className="absolute right-3 bottom-3 z-20 border border-site-border-active bg-site-surface-deep/90 px-3 py-2 font-mono text-[0.625rem] leading-none font-bold tracking-[0.16em] text-site-accent uppercase backdrop-blur-sm md:right-4 md:bottom-4">
              {label}
            </figcaption>
          </motion.figure>
        )
      })}

      <button
        aria-label={`Show ${identityName[nextIdentity]} image. ${identityName[activeIdentity]} image is currently active.`}
        className="absolute inset-0 z-30 cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active focus-visible:shadow-[0_0_0_4px_var(--site-glow-accent)]"
        data-testid="hero-image-stack-control"
        onClick={() => setActiveIdentity(nextIdentity)}
        type="button"
      />

      <p aria-live="polite" className="sr-only">
        {identityName[activeIdentity]} image active
      </p>
    </div>
  )
}
