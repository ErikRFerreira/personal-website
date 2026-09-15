import React from 'react'

import { DetailInfoSection, DetailMetaGrid, DetailMetaItem } from '@/components/DetailInfo'

type TechnicalMetadata = {
  camera?: string | null
  lens?: string | null
  aperture?: string | null
  shutterSpeed?: string | null
  iso?: number | null
  focalLength?: string | null
}

type Props = {
  metadata?: TechnicalMetadata | null
}

type MetaCell = {
  label: string
  value: string | number | null | undefined
  wide?: boolean
}

export const LensTechnicalMeta: React.FC<Props> = ({ metadata }) => {
  const cells: MetaCell[] = [
    { label: 'Aperture', value: metadata?.aperture },
    { label: 'Shutter', value: metadata?.shutterSpeed },
    { label: 'ISO', value: metadata?.iso },
    { label: 'Focal Length', value: metadata?.focalLength },
    { label: 'Camera', value: metadata?.camera, wide: true },
    { label: 'Lens', value: metadata?.lens, wide: true },
  ].filter((cell) => cell.value != null && cell.value !== '')

  if (cells.length === 0) return null

  return (
    <DetailInfoSection
      className="py-3.5"
      title="Capture details"
      data-testid="lens-technical-metadata"
    >
      <DetailMetaGrid className="mt-4">
        {cells.map((cell) => (
          <DetailMetaItem
            className={cell.wide ? 'sm:col-span-1' : undefined}
            key={cell.label}
            technical
            {...cell}
          />
        ))}
      </DetailMetaGrid>
    </DetailInfoSection>
  )
}
