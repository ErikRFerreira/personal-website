import { cn } from '@/utilities/ui'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { SectionHeading } from '@/components/SectionHeading'

type Props = {
  eyebrow?: string | null
  label?: string | null
  intro?: string | null
  bgColor?: string | null
  className?: string
  children: React.ReactNode
  revealHeader?: boolean
}

function DefaultSection({
  eyebrow,
  label,
  intro,
  bgColor,
  className,
  children,
  revealHeader = false,
}: Props) {
  const header = (
    <header className={cn('relative z-10', intro && 'mb-12 max-w-[42rem]')}>
      <SectionHeading title={eyebrow} label={label} className={intro ? 'mb-0' : undefined} />

      {intro && (
        <p
          className={cn(
            'border-l-2 border-site-accent pl-6 text-base leading-[1.75] text-site-text-secondary md:text-lg',
            (eyebrow || label) && 'mt-8',
          )}
        >
          {intro}
        </p>
      )}
    </header>
  )

  return (
    <section
      className={cn('site-section', className)}
      data-theme="dark"
      style={{ backgroundColor: bgColor || 'var(--site-surface-base)' }}
    >
      <div className="site-container">
        {revealHeader ? (
          <RevealOnScroll revealName="section-heading">{header}</RevealOnScroll>
        ) : (
          header
        )}

        <div className="flex flex-col gap-(--site-card-gap)">{children}</div>
      </div>
    </section>
  )
}

export default DefaultSection
