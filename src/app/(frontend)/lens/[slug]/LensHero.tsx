import React from 'react'

import type { Len, Media as MediaType } from '@/payload-types'
import { formatLensFrameTechnical, LensPhotoFrame } from '@/components/LensPhotoFrame'
import { LensZoomImage } from './LensZoomImage'

type Props = {
  collectionName?: string | null
  location?: string | null
  metadata?: Len['technicalMetadata'] | null
  photo: MediaType
  title: string
  year?: number | null
}

export const LensHero: React.FC<Props> = ({
  collectionName,
  location,
  metadata,
  photo,
  title,
  year,
}) => {
  const context = [collectionName, location?.trim()].filter(Boolean).join(' / ')
  const { primary, secondary } = formatLensFrameTechnical(metadata)

  return (
    <LensPhotoFrame
      className="h-full w-full max-w-5xl"
      context={context}
      data-detail-frame="true"
      photoTitle={title}
      stageClassName="absolute inset-x-[4%] top-[7%] bottom-[9%] md:inset-x-[5%]"
      technicalPrimary={primary}
      technicalSecondary={secondary}
      year={year}
    >
      <LensZoomImage photo={photo} title={title} />
    </LensPhotoFrame>
  )
}
