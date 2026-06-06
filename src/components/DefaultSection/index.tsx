import { cn } from '@/utilities/ui'
import { SectionHeading } from '@/components/SectionHeading'

type Props = {
  eyebrow?: string | null
  label?: string | null
  bgColor?: string | null
  className?: string
  children: React.ReactNode
}

function DefaultSection({ eyebrow, label, bgColor, className, children }: Props) {
  return (
    <section
      className={cn('site-section', className)}
      data-theme="dark"
      style={{ backgroundColor: bgColor || 'var(--site-surface-base)' }}
    >
      <div className="site-container">
        <SectionHeading title={eyebrow} label={label} />

        <div className="flex flex-col gap-(--site-card-gap)">{children}</div>
      </div>
    </section>
  )
}

export default DefaultSection
