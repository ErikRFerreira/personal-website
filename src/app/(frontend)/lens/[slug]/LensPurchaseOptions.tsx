import type { Len } from '@/payload-types'

type Props = {
  digitalDownload?: Len['digitalDownload'] | null
  printOptions?: Len['printOptions'] | null
}

const euroFormatter = new Intl.NumberFormat('en-IE', {
  currency: 'EUR',
  currencyDisplay: 'symbol',
  style: 'currency',
})

export function LensPurchaseOptions({ digitalDownload, printOptions }: Props) {
  const prints = (printOptions ?? []).filter((option) => option.size.trim())
  const hasDigitalDownload = digitalDownload?.available === true

  if (prints.length === 0 && !hasDigitalDownload) return null

  return (
    <section className="mt-20 pt-10 md:mt-24" data-testid="lens-purchase-options">
      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="site-meta-label text-site-accent">
            Available formats
          </p>
          <h2 className="mt-1 text-[1.3125rem] leading-tight font-bold tracking-[-0.02em] text-site-text-primary md:text-3xl">
            Purchase options
          </h2>
        </div>
        <p className="site-meta-label text-site-text-muted">
          {prints.length > 0 && hasDigitalDownload
            ? 'Print and digital available'
            : prints.length > 0
              ? 'Print available'
              : 'Digital available'}
        </p>
      </header>

      <div className="relative overflow-hidden border border-site-border-subtle bg-site-surface-elevated/65 p-5 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)] sm:p-7 lg:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-site-glow-accent blur-3xl"
        />
        <div
          className={`relative grid gap-8 ${prints.length > 0 && hasDigitalDownload ? 'lg:grid-cols-[2fr_1fr]' : ''}`}
        >
          {prints.length > 0 && (
            <div data-testid="lens-print-options">
              <h3 className="site-meta-label text-site-text-secondary">
                Print
              </h3>
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
          )}

          {hasDigitalDownload && (
            <div
              className={
                prints.length > 0
                  ? 'border-t border-site-border-subtle pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8'
                  : ''
              }
              data-testid="lens-digital-download"
            >
              <h3 className="site-meta-label text-site-text-secondary">
                Digital download
              </h3>
              <div className="mt-4 border border-site-border-subtle bg-site-surface-deep/55 p-4">
                <div className="flex min-h-16 items-end justify-between gap-6">
                  <div>
                    <span
                      aria-hidden="true"
                      className="mb-3 block size-1.5 rounded-full bg-site-accent shadow-[0_0_0.75rem_var(--site-accent)]"
                    />
                    <p className="text-sm font-medium text-site-text-primary">Available</p>
                  </div>
                  {digitalDownload.price != null && (
                    <p className="font-mono text-sm font-semibold text-site-accent tabular-nums">
                      {euroFormatter.format(digitalDownload.price)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
