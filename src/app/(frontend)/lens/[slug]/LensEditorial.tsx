import RichText from '@/components/RichText'

import type { Len } from '@/payload-types'

type Props = {
  fullStory?: Len['fullStory']
  licensingText?: string | null
}

export function LensEditorial({ fullStory, licensingText }: Props) {
  if (!fullStory && !licensingText) return null

  return (
    <section
      className="site-container py-20 md:py-24"
      data-testid="lens-long-form"
    >
      <div className="flex items-center gap-4 pt-10">
        <p className="site-meta-label shrink-0 text-site-accent">
          Field perspective
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-site-border-subtle" />
      </div>
      <div>
        {fullStory && (
          <div className="grid gap-8 py-10 lg:grid-cols-12 lg:gap-12 lg:py-12">
            <header className="lg:col-span-4">
              <h2 className="font-serif text-2xl leading-tight font-medium tracking-[0.01em] text-site-text-primary">
                Story Behind the Shot
              </h2>
            </header>
            <RichText
              className="max-w-3xl text-sm leading-[1.8] text-site-text-secondary lg:col-span-8 lg:col-start-5 lg:text-base [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-site-accent [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-site-text-primary [&_p]:mb-5 [&_p:last-child]:mb-0"
              data={fullStory}
              enableGutter={false}
            />
          </div>
        )}

        {licensingText && (
          <div className="grid gap-4 border border-site-border-subtle bg-site-surface-elevated/65 p-5 sm:p-6 lg:grid-cols-[minmax(12rem,0.7fr)_minmax(0,2fr)] lg:gap-12">
            <h2 className="site-meta-label text-site-accent">
              Licensing
            </h2>
            <p className="site-body-small max-w-3xl text-site-text-secondary">
              {licensingText}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
