import React from 'react'

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
  location?: string | null
}

type MetaCell = {
  label: string
  value: string | number | null | undefined
}

const MetaCell: React.FC<MetaCell> = ({ label, value }) => {
  if (value == null || value === '') return null

  return (
    <div className="flex min-h-28 flex-col justify-between border border-site-border-subtle bg-site-surface-elevated/70 p-4">
      <span className="font-mono text-[0.625rem] leading-none font-bold tracking-[0.16em] text-site-text-muted uppercase">
        {label}
      </span>
      <div>
        <span className="text-xl leading-none font-bold text-site-text-primary">{value}</span>
        <div className="mt-2 h-0.5 w-8 bg-site-accent" />
      </div>
    </div>
  )
}

export const LensTechnicalMeta: React.FC<Props> = ({ metadata, location }) => {
  const cells: MetaCell[] = [
    { label: 'Camera', value: metadata?.camera },
    { label: 'Lens', value: metadata?.lens },
    { label: 'Aperture', value: metadata?.aperture },
    { label: 'Shutter', value: metadata?.shutterSpeed },
    { label: 'ISO', value: metadata?.iso },
    { label: 'Focal Length', value: metadata?.focalLength },
    { label: 'Location', value: location },
  ].filter((cell) => cell.value != null && cell.value !== '')

  if (cells.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3" data-testid="lens-technical-metadata">
      {cells.map((cell) => (
        <MetaCell key={cell.label} label={cell.label} value={cell.value} />
      ))}
    </div>
  )
}
