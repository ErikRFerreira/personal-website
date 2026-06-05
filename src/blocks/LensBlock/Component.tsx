import type { LensBlock, Len } from '@/payload-types'
import Link from 'next/link'

export function LensBlockComponent({ eyebrow, label, intro, photos }: LensBlock) {
  const resolvedPhotos = photos?.filter((p): p is Len => typeof p === 'object' && p !== null)

  if (!resolvedPhotos?.length) return null

  return (
    <section
      className="relative overflow-hidden bg-[#0C1324] py-[var(--site-section-space-mobile)] text-site-text-primary md:py-[var(--site-section-space-tablet)] lg:py-[var(--site-section-space-desktop)]"
      data-theme="dark"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_at_top,rgba(0,242,255,0.16)_0%,rgba(20,48,76,0.26)_34%,rgba(12,19,36,0)_72%)]"
        aria-hidden="true"
      />

      <div className="site-container relative z-10">
        <header className="mb-16 max-w-[42rem] md:mb-24">
          {eyebrow && (
            <p className="mb-5 font-mono text-[0.6875rem] leading-[1.2] font-bold tracking-[0.24em] text-site-accent uppercase">
              {eyebrow}
            </p>
          )}

          {label && (
            <h2 className="text-[3rem] leading-[0.95] font-extrabold tracking-normal text-[#dfe4ff] md:text-[4.5rem]">
              {label}
            </h2>
          )}

          {intro && (
            <p className="mt-8 border-l-2 border-site-accent pl-6 text-base leading-[1.75] text-[#b7c0d5] md:text-lg">
              {intro}
            </p>
          )}
        </header>

        <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {resolvedPhotos.map((item) => {
            const photo = typeof item.photo === 'object' && item.photo !== null ? item.photo : null
            const photoUrl = photo?.url
            const photoAlt = photo?.alt ?? item.title
            const location = item.location?.trim()
            const slug = typeof item.slug === 'string' ? item.slug : ''

            if (!photoUrl) return null

            return (
              <Link
                key={item.id}
                href={`/lens/${slug}`}
                className="group mb-12 block break-inside-avoid focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-site-border-active"
              >
                <div className="overflow-hidden rounded-lg bg-site-surface-elevated">
                  <img
                    src={photoUrl}
                    alt={photoAlt}
                    className="w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>

                <div className="mt-4 flex min-w-0 items-start justify-between gap-4">
                  <h3 className="min-w-0 text-base leading-[1.25] font-extrabold text-[#dfe4ff] transition-colors duration-200 group-hover:text-site-accent">
                    {item.title}
                  </h3>

                  {location && (
                    <p className="shrink-0 pt-1 font-mono text-[0.625rem] leading-[1.2] font-bold tracking-[0.18em] text-site-accent uppercase">
                      {location}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
