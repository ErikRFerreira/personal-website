import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utilities/ui'

type DetailInfoPanelProps = ComponentPropsWithoutRef<'div'>

export function DetailInfoPanel({ className, ...props }: DetailInfoPanelProps) {
  return (
    <div
      className={cn(
        'overflow-hidden border border-site-border-subtle bg-site-surface-elevated/80 shadow-[0_1rem_2.5rem_rgba(0,0,0,0.16)] backdrop-blur-sm',
        className,
      )}
      data-detail-info-panel="true"
      {...props}
    />
  )
}

type DetailInfoSectionProps = ComponentPropsWithoutRef<'section'> & {
  title?: string
  titleClassName?: string
}

export function DetailInfoSection({
  children,
  className,
  title,
  titleClassName,
  ...props
}: DetailInfoSectionProps) {
  return (
    <section
      className={cn(
        'border-t border-site-border-subtle px-5 py-5 first:border-t-0 sm:px-6',
        className,
      )}
      {...props}
    >
      {title && (
        <h2 className={cn('site-eyebrow text-site-accent', titleClassName)}>{title}</h2>
      )}
      {children}
    </section>
  )
}

type DetailMetaGridProps = ComponentPropsWithoutRef<'dl'>

export function DetailMetaGrid({ className, ...props }: DetailMetaGridProps) {
  return <dl className={cn('grid grid-cols-2 gap-x-5 gap-y-4', className)} {...props} />
}

type DetailMetaItemProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  label: string
  value: ReactNode
  wide?: boolean
}

export function DetailMetaItem({
  className,
  label,
  value,
  wide = false,
  ...props
}: DetailMetaItemProps) {
  return (
    <div
      className={cn(
        'min-w-0 border-t border-site-border-subtle pt-3',
        wide && 'col-span-2',
        className,
      )}
      {...props}
    >
      <dt className="site-field-label text-site-text-muted">{label}</dt>
      <dd className="site-field-value mt-1 [overflow-wrap:anywhere] text-site-text-primary">
        {value}
      </dd>
    </div>
  )
}

type DetailActionProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> & {
  emphasis?: 'primary' | 'secondary'
  external?: boolean
  href: string
}

export function DetailAction({
  children,
  className,
  emphasis = 'primary',
  external = false,
  rel,
  target,
  ...props
}: DetailActionProps) {
  return (
    <Link
      className={cn(
        'inline-flex min-h-11 min-w-0 items-center justify-center px-4 py-3 text-center font-mono text-[0.75rem] leading-tight font-bold tracking-[0.08em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-border-active',
        emphasis === 'primary'
          ? 'bg-site-text-primary text-site-surface-deep hover:bg-site-accent'
          : 'border border-site-border-control bg-site-surface-deep/35 text-site-text-primary hover:border-site-border-active hover:text-site-accent',
        className,
      )}
      rel={external ? 'noopener noreferrer' : rel}
      target={external ? '_blank' : target}
      {...props}
    >
      {children}
    </Link>
  )
}
