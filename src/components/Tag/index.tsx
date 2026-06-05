import { cn } from '@/utilities/ui'
import type { ComponentProps } from 'react'

type Props = ComponentProps<'span'>

export function Tag({ className, ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[0.6875rem] font-bold tracking-[0.12em] text-site-accent uppercase',
        className,
      )}
      {...props}
    />
  )
}
