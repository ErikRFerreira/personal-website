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
  metadata: TechnicalMetadata
  location?: string | null
}

type MetaCell = {
  label: string
  value: string | number | null | undefined
}

const MetaCell: React.FC<MetaCell> = ({ label, value }) => {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1 py-4 px-4">
      <span
        className="text-[var(--portfolio-text-muted)] uppercase tracking-widest"
        style={{ fontSize: '10px', fontWeight: 600, lineHeight: 1 }}
      >
        {label}
      </span>
      <span className="text-[var(--portfolio-text-primary)] text-sm font-medium">{value}</span>
    </div>
  )
}

export const LensTechnicalMeta: React.FC<Props> = ({ metadata, location }) => {
  const cells: MetaCell[] = [
    { label: 'Camera', value: metadata.camera },
    { label: 'Lens', value: metadata.lens },
    { label: 'Aperture', value: metadata.aperture },
    { label: 'Shutter', value: metadata.shutterSpeed },
    { label: 'ISO', value: metadata.iso },
    { label: 'Focal Length', value: metadata.focalLength },
    { label: 'Location', value: location },
  ].filter((c) => Boolean(c.value))

  if (cells.length === 0) return null

  return (
    <div
      className="border border-[var(--portfolio-border-subtle)] mt-8"
      style={{ background: 'var(--portfolio-surface-elevated)' }}
    >
      <div className="grid grid-cols-3 divide-x divide-y divide-[var(--portfolio-border-subtle)]">
        {cells.map((cell) => (
          <MetaCell key={cell.label} label={cell.label} value={cell.value} />
        ))}
      </div>
    </div>
  )
}
