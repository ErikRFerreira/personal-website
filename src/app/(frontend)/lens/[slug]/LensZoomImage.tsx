'use client'

import Image from 'next/image'
import { useState, type PointerEvent } from 'react'

import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import styles from './LensZoomImage.module.css'

type LensZoomImageProps = {
  imageUrl?: string | null
  photo: Media
  title: string
}

export function LensZoomImage({ imageUrl, photo, title }: LensZoomImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [source, setSource] = useState(imageUrl || photo.url)
  const objectPosition = `${photo.focalX ?? 50}% ${photo.focalY ?? 50}%`

  const canZoom = (event: PointerEvent<HTMLDivElement>) => {
    return (
      event.pointerType === 'mouse' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
  }

  const updateZoomOrigin = (event: PointerEvent<HTMLDivElement>) => {
    if (!canZoom(event)) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    event.currentTarget.style.setProperty('--lens-zoom-x', `${Math.max(0, Math.min(100, x))}%`)
    event.currentTarget.style.setProperty('--lens-zoom-y', `${Math.max(0, Math.min(100, y))}%`)
    setIsZoomed(true)
  }

  const resetZoom = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--lens-zoom-x', '50%')
    event.currentTarget.style.setProperty('--lens-zoom-y', '50%')
    setIsZoomed(false)
  }

  if (!source) return null

  return (
    <div
      className={`${styles.zoomRoot} absolute inset-0 overflow-hidden [--lens-zoom-x:50%] [--lens-zoom-y:50%]`}
      data-zoomed={isZoomed ? 'true' : 'false'}
      onPointerEnter={updateZoomOrigin}
      onPointerLeave={resetZoom}
      onPointerMove={updateZoomOrigin}
    >
      <Image
        alt={photo.alt?.trim() || title}
        className={`object-contain opacity-95 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isZoomed ? 'scale-[3]' : 'scale-100'
        }`}
        fill
        onError={() => {
          if (photo.url && source !== photo.url) setSource(photo.url)
        }}
        priority
        quality={75}
        sizes="(max-width: 767px) calc(100vw - 3rem), 60vw"
        src={getMediaUrl(source, photo.updatedAt)}
        style={{
          objectPosition,
          transformOrigin: 'var(--lens-zoom-x) var(--lens-zoom-y)',
        }}
      />

      <div
        className={`${styles.zoomHint} site-caption pointer-events-none absolute right-4 bottom-4 z-30 text-site-text-muted uppercase`}
      >
        Hover to enlarge
      </div>
    </div>
  )
}
