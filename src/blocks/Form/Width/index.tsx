import * as React from 'react'

import { cn } from '@/utilities/ui'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const style = {
    '--form-field-width': width ? `${width}%` : '100%',
  } as React.CSSProperties

  return (
    <div className={cn('form-field', className)} style={style}>
      {children}
    </div>
  )
}
