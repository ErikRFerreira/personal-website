import type { Len } from '@/payload-types'

type Props = {
  printOptions?: Len['printOptions'] | null
}

const euroFormatter = new Intl.NumberFormat('en-IE', {
  currency: 'EUR',
  currencyDisplay: 'symbol',
  style: 'currency',
})

export function LensPurchaseOptions({ printOptions }: Props) {
  const prints = (printOptions ?? []).filter((option) => option.size.trim())

  if (prints.length === 0) return null

  return (
    <section className="mt-20 pt-10 md:mt-24" data-testid="lens-purchase-options">
      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="site-meta-label text-site-accent">Available formats</p>
          <h2 className="mt-1 text-[1.3125rem] leading-tight font-bold tracking-[-0.02em] text-site-text-primary md:text-3xl">
            Purchase options
          </h2>
        </div>
        <p className="site-meta-label text-site-text-muted">Print available</p>
      </header>

      <div className="relative overflow-hidden border border-site-border-subtle bg-site-surface-elevated/65 p-5 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)] sm:p-7 lg:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-site-glow-accent blur-3xl"
        />
        <div className="relative">
          <div data-testid="lens-print-options">
            <h3 className="site-meta-label text-site-text-secondary">Print</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {prints.map((option, index) => (
                <li
                  className="flex min-h-24 flex-col justify-between border border-site-border-subtle bg-site-surface-deep/55 p-4 transition-colors hover:border-site-border-active"
                  key={option.id ?? `${option.size}-${index}`}
                >
                  <div>
                    <p className="font-mono text-sm font-semibold text-site-text-primary">
                      {option.size}
                    </p>
                    {option.material && (
                      <p className="mt-1 text-xs leading-relaxed text-site-text-muted">
                        {option.material}
                      </p>
                    )}
                  </div>
                  {option.price != null && (
                    <p className="mt-4 font-mono text-xs font-semibold text-site-accent tabular-nums">
                      {euroFormatter.format(option.price)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
