import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utilities/ui'

export type DetailInfoVariant = 'editorial' | 'project'

type DetailInfoPanelProps = ComponentPropsWithoutRef<'div'> & {
  variant?: DetailInfoVariant
}

export function DetailInfoPanel({
  className,
  variant = 'project',
  ...props
}: DetailInfoPanelProps) {
  return (
    <div
      className={cn(
        'overflow-hidden',
        variant === 'project' &&
          'border border-site-border-subtle/70 bg-site-surface-elevated/55 shadow-[0_0.75rem_2rem_rgba(0,0,0,0.12)] backdrop-blur-sm',
        variant === 'editorial' &&
          'border-y border-site-border-subtle/70 bg-site-surface-elevated/25',
        className,
      )}
      data-detail-info-panel="true"
      data-detail-info-variant={variant}
      {...props}
    />
  )
}

type DetailInfoSectionProps = ComponentPropsWithoutRef<'section'> & {
  divided?: boolean
  title?: string
  titleClassName?: string
}

export function DetailInfoSection({
  children,
  className,
  divided = false,
  title,
  titleClassName,
  ...props
}: DetailInfoSectionProps) {
  return (
    <section
      className={cn(
        'px-5 py-5 sm:px-6',
        divided && 'border-t border-site-border-subtle/70',
        className,
      )}
      data-detail-info-divided={divided ? 'true' : undefined}
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
  technical?: boolean
  value: ReactNode
  wide?: boolean
}

export function DetailMetaItem({
  className,
  label,
  technical = false,
  value,
  wide = false,
  ...props
}: DetailMetaItemProps) {
  return (
    <div
      className={cn(
        'min-w-0',
        wide && 'col-span-2',
        className,
      )}
      {...props}
    >
      <dt className="site-field-label text-site-text-muted">{label}</dt>
      <dd
        className={cn(
          'mt-1 [overflow-wrap:anywhere] text-site-text-primary',
          technical
            ? 'site-field-value'
            : 'font-sans text-sm leading-[1.55] font-normal tracking-[-0.005em]',
        )}
        data-detail-meta-technical={technical ? 'true' : undefined}
      >
        {value}
      </dd>
    </div>
  )
}

type DetailActionProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> & {
  emphasis?: 'primary' | 'secondary'
  external?: boolean
  href: string
  variant?: DetailInfoVariant
}

export function DetailAction({
  children,
  className,
  emphasis = 'primary',
  external = false,
  rel,
  target,
  variant = 'project',
  ...props
}: DetailActionProps) {
  return (
    <Link
      className={cn(
        'inline-flex min-h-11 min-w-0 items-center justify-center px-4 py-3 text-center font-mono text-[0.75rem] leading-tight font-bold tracking-[0.08em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-border-active',
        emphasis === 'primary' &&
          variant === 'project' &&
          'border border-site-border-control bg-site-surface-base/65 text-site-text-primary hover:border-site-border-active hover:bg-site-accent/5 hover:text-site-accent',
        emphasis === 'primary' &&
          variant === 'editorial' &&
          'border border-site-border-active bg-site-accent/8 text-site-accent hover:bg-site-accent/14',
        emphasis === 'secondary' &&
          'border border-site-border-subtle bg-transparent text-site-text-secondary hover:border-site-border-control hover:text-site-text-primary',
        className,
      )}
      data-detail-action-emphasis={emphasis}
      data-detail-action-variant={variant}
      rel={external ? 'noopener noreferrer' : rel}
      target={external ? '_blank' : target}
      {...props}
    >
      {children}
    </Link>
  )
}
