import React, { type CSSProperties } from 'react'

import type { Len, Media as MediaType } from '@/payload-types'
import { formatLensFrameTechnical, LensPhotoFrame } from '@/components/LensPhotoFrame'
import { LensZoomImage } from './LensZoomImage'
import { resolveLensDetailImage } from './resolveLensDetailImage'

type Props = {
  location?: string | null
  metadata?: Len['technicalMetadata'] | null
  photo: MediaType
  title: string
  year?: number | null
}

export const LensHero: React.FC<Props> = ({
  location,
  metadata,
  photo,
  title,
  year,
}) => {
  const { primary, secondary } = formatLensFrameTechnical(metadata)
  const image = resolveLensDetailImage(photo)
  const hasValidDimensions =
    typeof image.width === 'number' &&
    Number.isFinite(image.width) &&
    image.width > 0 &&
    typeof image.height === 'number' &&
    Number.isFinite(image.height) &&
    image.height > 0
  const width = hasValidDimensions ? image.width! : 4
  const height = hasValidDimensions ? image.height! : 3
  const aspectRatio = width / height
  const isPortrait = aspectRatio < 1

  // The detail frame reserves 10% of its width horizontally and 16% vertically
  // for its technical labels. Convert the desired portrait height cap back into
  // a maximum frame width so the complete frame stays within the viewport.
  const frameAspectRatio = 1 / (0.16 + 0.9 / aspectRatio)
  const frameStyle = {
    '--lens-detail-portrait-max-width': isPortrait
      ? `min(100%, ${72 * frameAspectRatio}svh, ${46 * frameAspectRatio}rem)`
      : '100%',
  } as CSSProperties

  return (
    <LensPhotoFrame
      className={`w-full ${isPortrait ? 'lg:mx-auto lg:max-w-[var(--lens-detail-portrait-max-width)]' : ''}`}
      context={location?.trim()}
      data-detail-frame="true"
      photoTitle={title}
      stageClassName="relative mx-[4%] mt-[7%] mb-[9%] md:mx-[5%]"
      stageStyle={{ aspectRatio: `${width} / ${height}` }}
      style={frameStyle}
      technicalPrimary={primary}
      technicalSecondary={secondary}
      year={year}
    >
      <LensZoomImage imageUrl={image.url} photo={photo} title={title} />
    </LensPhotoFrame>
  )
}
