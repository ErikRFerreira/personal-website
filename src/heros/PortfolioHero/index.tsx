import type { Page } from '@/payload-types'

export function PortfolioHero({ eyebrow, headline, description, scrollLabel }: Page['hero']) {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 text-center">
        {eyebrow && <p className="text-sm uppercase text-gray-500 mb-2">{eyebrow}</p>}
        {headline && <h1 className="text-4xl font-bold mb-4">{headline}</h1>}
        {description && <p className="text-lg text-gray-700 mb-8">{description}</p>}
        {scrollLabel && <span className="text-sm text-gray-500">{scrollLabel}</span>}
      </div>
    </section>
  )
}
