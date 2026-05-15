import { cn } from '@/utilities/ui'

type Props = {
  title?: string | null
  label?: string | null
  className?: string
}

export function SectionHeading({ title, label, className }: Props) {
  if (!title && !label) return null

  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-4 border-b border-portfolio-border-subtle pb-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      {title && <h2 className="portfolio-section-heading">{title}</h2>}
      {label && <p className="portfolio-eyebrow">{label}</p>}
    </div>
  )
}
