'use client'

import { ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { useState, type PointerEvent } from 'react'

import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import styles from './LensZoomImage.module.css'

type LensZoomImageProps = {
  photo: Media
  title: string
}

export function LensZoomImage({ photo, title }: LensZoomImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
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

  if (!photo.url) return null

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
        priority
        quality={75}
        sizes="(max-width: 767px) calc(100vw - 3rem), 60vw"
        src={getMediaUrl(photo.url, photo.updatedAt)}
        style={{
          objectPosition,
          transformOrigin: 'var(--lens-zoom-x) var(--lens-zoom-y)',
        }}
      />

      <div
        className={`${styles.zoomHint} pointer-events-none absolute right-4 bottom-4 z-30 items-center gap-2 border border-site-border-subtle bg-site-surface-deep/75 px-3 py-2 font-mono text-[0.625rem] font-bold tracking-[0.14em] text-site-accent uppercase backdrop-blur-md`}
      >
        <ZoomIn aria-hidden="true" className="size-3.5" />
        Hover to enlarge
      </div>
    </div>
  )
}
