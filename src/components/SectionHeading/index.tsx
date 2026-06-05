import { cn } from '@/utilities/ui'

type Props = {
  title?: string | null
  label?: string | null
  className?: string
}

export function SectionHeading({ title, label, className }: Props) {
  if (!title && !label) return null

  return (
    <div className={cn('mb-12 flex flex-col gap-4 pb-4', className)}>
      {label && (
        <p className="font-mono text-[0.6875rem] font-bold leading-[1.2] tracking-[0.18em] text-site-accent uppercase">
          {label}
        </p>
      )}
      {title && (
        <h2 className="text-2xl leading-[1.08] font-bold text-site-text-primary md:text-6xl">
          {title}
        </h2>
      )}
    </div>
  )
}
