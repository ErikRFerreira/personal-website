import { SectionHeading } from '@/components/SectionHeading'

type Props = {
  eyebrow?: string | null
  label?: string | null
  children: React.ReactNode
}

function DefaultSection({ eyebrow, label, children }: Props) {
  return (
    <section className="portfolio-section" data-theme="dark">
      <div className="portfolio-container">
        <SectionHeading title={eyebrow} label={label} />

        <div className="flex flex-col gap-[var(--portfolio-card-gap)]">{children}</div>
      </div>
    </section>
  )
}

export default DefaultSection
