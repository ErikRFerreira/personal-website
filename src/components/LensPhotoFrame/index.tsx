import { Aperture } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

import type { Len } from '@/payload-types'
import styles from './LensPhotoFrame.module.css'

type LensPhotoFrameProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  children: ReactNode
  context?: string | null
  overlay?: ReactNode
  photoTitle: string
  stageClassName: string
  technicalPrimary?: string | null
  technicalSecondary?: string | null
  year?: number | null
}

export function formatLensFrameTechnical(metadata?: Len['technicalMetadata'] | null) {
  if (!metadata) return { primary: '', secondary: '' }

  return {
    primary: [metadata.camera, metadata.lens, metadata.aperture, metadata.shutterSpeed]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(' · '),
    secondary: [metadata.iso != null ? `ISO ${metadata.iso}` : null, metadata.focalLength?.trim()]
      .filter(Boolean)
      .join(' · '),
  }
}

export function LensPhotoFrame({
  children,
  className = '',
  context,
  overlay,
  photoTitle,
  stageClassName,
  technicalPrimary,
  technicalSecondary,
  year,
  ...props
}: LensPhotoFrameProps) {
  const hasContext = Boolean(context || year)

  return (
    <div className={`${styles.technicalFrame} relative overflow-hidden ${className}`} {...props}>
      <div className={`${styles.imageStage} ${stageClassName}`}>{children}</div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-black/10 opacity-60" />

      {hasContext && (
        <div className={`${styles.frameLabel} absolute top-[2.4%] left-3 z-30 md:left-4`}>
          {context && <span>{context}</span>}
          {context && year && <span className="text-white/35"> / </span>}
          {year && <span className="text-white/35">{year}</span>}
        </div>
      )}

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
        {photoTitle}
      </div>

      {(technicalPrimary || technicalSecondary) && (
        <div
          className={`${styles.frameLabel} absolute right-3 bottom-[2.1%] z-30 hidden max-w-[55%] text-right sm:block md:right-4`}
        >
          {technicalPrimary && <div>{technicalPrimary}</div>}
          {technicalSecondary && <div className="text-white/40">{technicalSecondary}</div>}
        </div>
      )}

      {overlay}
    </div>
  )
}
