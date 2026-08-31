'use client'

import { Aperture, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import type { Len } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import styles from './LensArchive.module.css'

export type LensArchivePhoto = Pick<
  Len,
  | 'archiveFormat'
  | 'id'
  | 'location'
  | 'photo'
  | 'series'
  | 'slug'
  | 'technicalMetadata'
  | 'title'
  | 'year'
>

export type ResolvedLensFormat = Exclude<Len['archiveFormat'], 'auto'>

type LensArchiveItemProps = {
  format: ResolvedLensFormat
  index: number
  pairedFormat?: ResolvedLensFormat
  photo: LensArchivePhoto
}

const slots = [
  { columns: 'md:col-span-8', offset: '' },
  { columns: 'md:col-span-4', offset: 'md:mt-20' },
  { columns: 'md:col-span-12', offset: '' },
  { columns: 'md:col-span-6', offset: '' },
  { columns: 'md:col-span-6', offset: 'md:mt-30' },
] as const

const formatPresentations: Record<ResolvedLensFormat, { aspect: string; stage: string }> = {
  landscape: {
    aspect: 'aspect-[16/9]',
    stage: 'absolute inset-x-[5%] top-[7%] bottom-[9%] md:inset-x-[10%]',
  },
  panorama: {
    aspect: 'aspect-[21/9]',
    stage: 'absolute inset-x-[4%] top-[7%] bottom-[9%] md:inset-x-[8%]',
  },
  portrait: {
    aspect: 'aspect-[3/4]',
    stage: 'absolute inset-x-[4%] top-[7%] bottom-[8%] md:inset-x-[5%]',
  },
  square: {
    aspect: 'aspect-square',
    stage: 'absolute inset-[5%]',
  },
}

export function formatLensArchiveCaption(
  photo: Pick<LensArchivePhoto, 'location' | 'series' | 'year'>,
): string {
  const subject = photo.series?.trim()
  const placeAndYear = [photo.location?.trim(), photo.year].filter(Boolean).join(', ')

  return [subject, placeAndYear].filter(Boolean).join(' · ')
}

function resolveSlot(index: number, format: ResolvedLensFormat, pairedFormat?: ResolvedLensFormat) {
  const slot = slots[index % slots.length]
  let columns: string = slot.columns
  let offset: string = slot.offset

  if (index < 2 && pairedFormat) {
    if (format === 'panorama' || pairedFormat === 'panorama') {
      columns = 'md:col-span-12'
      offset = ''
    } else if ((format === 'portrait') !== (pairedFormat === 'portrait')) {
      columns = format === 'portrait' ? 'md:col-span-4' : 'md:col-span-8'
      offset = format === 'portrait' ? 'md:mt-20' : ''
    }
  }

  if (index === 2) {
    if (format === 'portrait') columns = 'md:col-span-5 md:col-start-4'
    if (format === 'square') columns = 'md:col-span-8 md:col-start-3'
  }

  return {
    columns,
    large: columns.includes('col-span-8') || columns.includes('col-span-12'),
    offset,
    presentation: formatPresentations[format],
  }
}

export function LensArchiveItem({ format, index, pairedFormat, photo }: LensArchiveItemProps) {
  const articleRef = useRef<HTMLElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const layout = resolveSlot(index, format, pairedFormat)
  const hasArchiveFrame = index < 3
  const caption = formatLensArchiveCaption(photo)
  const image = typeof photo.photo === 'object' && photo.photo !== null ? photo.photo : null
  const objectPosition = `${image?.focalX ?? 50}% ${image?.focalY ?? 50}%`
  const archiveContext = [photo.series?.trim(), photo.location?.trim()].filter(Boolean).join(' / ')
  const technicalPrimary = [
    photo.technicalMetadata?.camera?.trim(),
    photo.technicalMetadata?.lens?.trim(),
    photo.technicalMetadata?.aperture?.trim(),
    photo.technicalMetadata?.shutterSpeed?.trim(),
  ]
    .filter(Boolean)
    .join(' · ')
  const technicalSecondary = [
    photo.technicalMetadata?.iso ? `ISO ${photo.technicalMetadata.iso}` : null,
    photo.technicalMetadata?.focalLength?.trim(),
  ]
    .filter(Boolean)
    .join(' · ')
  const staggered = index % slots.length === 1 || index % slots.length === 4
  const revealStyle = {
    '--lens-reveal-delay': staggered ? '125ms' : '0ms',
  } as CSSProperties

  useEffect(() => {
    const article = articleRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!article || motionQuery.matches || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8%', threshold: 0.08 },
    )

    observer.observe(article)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const frame = parallaxRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!layout.large || !frame || motionQuery.matches) return

    let animationFrame = 0

    const updateParallax = () => {
      const bounds = frame.parentElement?.getBoundingClientRect()
      if (!bounds) return

      const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)
      const offset = Math.max(-8, Math.min(8, (0.5 - progress) * 16))
      frame.style.transform = `translate3d(0, ${offset}px, 0)`
    }

    const requestUpdate = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [layout.large])

  if (!image?.url) return null

  return (
    <article
      className={`${layout.columns} ${layout.offset} transition-[opacity,transform] duration-700 delay-[var(--lens-reveal-delay)] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      ref={articleRef}
      style={revealStyle}
    >
      <Link
        className="group block focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-site-border-active"
        href={`/lens/${photo.slug}`}
      >
        {hasArchiveFrame ? (
          <div
            className={`${styles.technicalFrame} relative w-full overflow-hidden ${layout.presentation.aspect}`}
            data-archive-frame="true"
            data-archive-format={format}
          >
            <div className={`${styles.imageStage} ${layout.presentation.stage}`}>
              <div
                className={
                  layout.large
                    ? 'absolute -inset-y-3 inset-x-0 will-change-transform'
                    : 'absolute inset-0'
                }
                ref={parallaxRef}
              >
                <Image
                  alt={image.alt?.trim() || photo.title}
                  className="object-cover opacity-90 transition-[transform,opacity] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.02] group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:will-change-auto"
                  fill
                  quality={75}
                  sizes={
                    layout.columns === 'md:col-span-12'
                      ? '(max-width: 767px) calc(84vw - 3rem), (max-width: 1535px) 76vw, 64rem'
                      : layout.columns === 'md:col-span-8'
                        ? '(max-width: 767px) calc(84vw - 3rem), 47vw'
                        : '(max-width: 767px) calc(90vw - 3rem), 45vw'
                  }
                  src={getMediaUrl(image.url, image.updatedAt)}
                  style={{ objectPosition }}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-black/10 opacity-60" />

            <div className={`${styles.frameLabel} absolute top-[2.4%] left-3 z-30 md:left-4`}>
              <span>{archiveContext || 'Field Study'}</span>
              {photo.year && <span className="text-white/35"> / {photo.year}</span>}
            </div>

            <div
              className={`${styles.frameLabel} absolute top-[2.1%] right-3 z-30 hidden items-center gap-1.5 sm:flex md:right-4`}
            >
              <Aperture aria-hidden="true" className="size-3.5" />
              <span className="leading-[0.9]">
                Erik
                <br />
                Ferreira
              </span>
            </div>

            <div className={`${styles.frameLabel} absolute bottom-[2.7%] left-3 z-30 md:left-4`}>
              {photo.title}
            </div>

            {layout.large && (technicalPrimary || technicalSecondary) && (
              <div
                className={`${styles.frameLabel} absolute right-3 bottom-[2.1%] z-30 hidden max-w-[55%] text-right sm:block md:right-4`}
              >
                {technicalPrimary && <div>{technicalPrimary}</div>}
                {technicalSecondary && <div className="text-white/40">{technicalSecondary}</div>}
              </div>
            )}

            <span className="absolute right-4 bottom-[14%] z-30 flex translate-y-2 items-center gap-1.5 font-mono text-[0.625rem] font-bold tracking-[0.18em] text-site-accent uppercase opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none md:right-5">
              View <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </span>
          </div>
        ) : (
          <div
            className={`relative w-full overflow-hidden bg-site-surface-elevated ${layout.presentation.aspect}`}
            data-archive-format={format}
          >
            <div
              className={
                layout.large
                  ? 'absolute -inset-y-3 inset-x-0 will-change-transform'
                  : 'absolute inset-0'
              }
              ref={parallaxRef}
            >
              <Image
                alt={image.alt?.trim() || photo.title}
                className="object-cover opacity-90 transition-[transform,opacity] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.02] group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:will-change-auto"
                fill
                quality={75}
                sizes={
                  layout.columns === 'md:col-span-12'
                    ? '(max-width: 767px) calc(100vw - 3rem), (max-width: 1535px) calc(100vw - 4rem), 84rem'
                    : layout.columns === 'md:col-span-8'
                      ? '(max-width: 767px) calc(100vw - 3rem), 66vw'
                      : '(max-width: 767px) calc(100vw - 3rem), 50vw'
                }
                src={getMediaUrl(image.url, image.updatedAt)}
                style={{ objectPosition }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-site-surface-base/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" />
            <span className="absolute right-5 bottom-5 flex translate-y-2 items-center gap-1.5 font-mono text-[0.625rem] font-bold tracking-[0.18em] text-site-accent uppercase opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none md:right-6 md:bottom-6">
              View <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </span>
          </div>
        )}

        <div className="mt-5 md:mt-6">
          <h2 className="text-base leading-tight font-extrabold text-site-text-primary transition-colors duration-200 group-hover:text-site-accent">
            {photo.title}
          </h2>
          {caption && (
            <p className="mt-2 font-mono text-[0.625rem] leading-[1.5] font-semibold tracking-[0.08em] text-site-text-muted transition-colors duration-200 group-hover:text-site-text-secondary">
              {caption}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
