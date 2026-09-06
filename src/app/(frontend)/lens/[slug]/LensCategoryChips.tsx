import type { Category } from '@/payload-types'

export function LensCategoryChips({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1" data-testid="lens-categories">
      <span aria-hidden="true" className="h-px w-6 bg-site-accent" />
      {categories.map((category) => (
        <span
          className="font-mono text-[0.625rem] font-semibold tracking-[0.16em] text-site-accent uppercase"
          key={category.id}
        >
          {category.title}
        </span>
      ))}
    </div>
  )
}
