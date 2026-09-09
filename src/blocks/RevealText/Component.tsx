import ScrollReveal from '@/components/ScrollReveal'
import type { RevealTextBlock as RevealTextBlockProps } from '@/payload-types'

const defaultSupportingText = 'Different tools. Same instinct for perspective.'

export function RevealText({ text, supportingText }: RevealTextBlockProps) {
  if (!text) return null

  return (
    <section className="relative flex w-full items-center justify-center bg-site-surface-deep px-6 py-64 text-center lg:py-80">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-12">
        <ScrollReveal
          baseOpacity={0.1}
          baseRotation={3}
          blurStrength={4}
          containerClassName="text-3xl font-medium leading-relaxed tracking-tight text-site-text-primary lg:text-5xl"
          enableBlur
        >
          {text}
        </ScrollReveal>

        <p className="text-sm font-bold uppercase tracking-[0.2em] text-site-text-secondary">
          {supportingText || defaultSupportingText}
        </p>
      </div>
    </section>
  )
}
