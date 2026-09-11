import type { Category } from '@/payload-types'

export function LensCategoryChips({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1" data-testid="lens-categories">
      <span aria-hidden="true" className="h-px w-6 bg-site-accent" />
      {categories.map((category) => (
        <span className="site-eyebrow text-site-accent" key={category.id}>
          {category.title}
        </span>
      ))}
    </div>
  )
}
