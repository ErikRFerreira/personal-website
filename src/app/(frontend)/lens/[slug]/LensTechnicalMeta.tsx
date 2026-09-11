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
}

type MetaCell = {
  label: string
  value: string | number | null | undefined
  wide?: boolean
}

const MetaCell: React.FC<MetaCell> = ({ label, value, wide }) => {
  if (value == null || value === '') return null

  return (
    <div className={`min-w-0 border-t border-site-border-subtle pt-3 ${wide ? 'col-span-2' : ''}`}>
      <dt className="site-meta-label text-site-text-muted">{label}</dt>
      <dd
        className="mt-1 truncate font-mono text-xs font-medium text-site-text-primary"
        title={String(value)}
      >
        {value}
      </dd>
    </div>
  )
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
    <section
      className="border border-site-border-subtle bg-site-surface-elevated/80 p-4 shadow-[0_1rem_2.5rem_rgba(0,0,0,0.16)] backdrop-blur-sm"
      data-testid="lens-technical-metadata"
    >
      <h2 className="site-meta-label flex items-center gap-2 text-site-accent">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-site-accent" />
        Technical capture profile
      </h2>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-3">
        {cells.map((cell) => (
          <MetaCell key={cell.label} {...cell} />
        ))}
      </dl>
    </section>
  )
}
