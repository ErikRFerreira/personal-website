import type { Category } from '@/payload-types'

export function LensCategoryChips({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 pt-1" data-testid="lens-categories">
      {categories.map((category) => (
        <span
          className="border border-site-border-subtle bg-site-surface-deep/35 px-3 py-2 font-mono text-[0.5625rem] font-semibold tracking-[0.12em] text-site-text-secondary uppercase"
          key={category.id}
        >
          {category.title}
        </span>
      ))}
    </div>
  )
}
