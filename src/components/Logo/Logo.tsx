import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <div className={clsx('flex flex-col items-center leading-none select-none', className)}>
      <span className="font-serif text-base tracking-[0.18em] uppercase font-light">
        Erik Ferreira
      </span>
      <span className="font-sans text-[0.4rem] tracking-[0.28em] uppercase mt-[0.35em]">
        Developer&nbsp;•&nbsp;Photographer
      </span>
    </div>
  )
}
