import React, { type CSSProperties } from 'react'

import type { Media as MediaType } from '@/payload-types'
import { LensPhotoFrame } from '@/components/LensPhotoFrame'
import { LensZoomImage } from './LensZoomImage'

type Props = {
  photo: MediaType
  title: string
}

export const LensHero: React.FC<Props> = ({ photo, title }) => {
  const width = photo.width ?? 0
  const height = photo.height ?? 0
  const aspectRatio = width > 0 && height > 0 ? width / height : 4 / 3
  const portraitWidth = `${aspectRatio * 78}svh`
  const portraitMaxWidth = `${aspectRatio * 48}rem`
  const frameWidth = aspectRatio < 1 ? `min(100%, ${portraitWidth}, ${portraitMaxWidth})` : '100%'
  const wrapperStyle = {
    width: frameWidth,
  } satisfies CSSProperties
  const frameStyle = {
    aspectRatio,
    width: '100%',
  } satisfies CSSProperties

  return (
    <div className="flex w-full justify-center">
      <div className="group max-w-full" style={wrapperStyle}>
        <LensPhotoFrame
          className="w-full"
          data-detail-frame="true"
          photoTitle={title}
          stageClassName="absolute inset-1 sm:inset-2"
          style={frameStyle}
          variant="editorial"
        >
          <LensZoomImage photo={photo} title={title} />
        </LensPhotoFrame>
        <p
          aria-hidden="true"
          className="mt-2 text-right font-mono text-[0.625rem] tracking-[0.06em] text-site-text-muted uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-40 motion-reduce:transition-none"
          data-lens-zoom-hint="true"
        >
          Hover to enlarge
        </p>
      </div>
    </div>
  )
}
