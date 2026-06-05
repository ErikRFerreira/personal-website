import { SectionHeading } from '@/components/SectionHeading'

type Props = {
  eyebrow?: string | null
  label?: string | null
  children: React.ReactNode
}

function DefaultSection({ eyebrow, label, children }: Props) {
  return (
    <section className="site-section" data-theme="dark">
      <div className="site-container">
        <SectionHeading title={eyebrow} label={label} />

        <div className="flex flex-col gap-[var(--site-card-gap)]">{children}</div>
      </div>
    </section>
  )
}

export default DefaultSection
