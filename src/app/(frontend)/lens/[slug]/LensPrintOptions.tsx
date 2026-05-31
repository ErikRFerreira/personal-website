import React from 'react'

type PrintOption = {
  id?: string | null
  size: string
  material?: string | null
  price?: number | null
}

type Props = {
  printOptions?: PrintOption[] | null
}

export const LensPrintOptions: React.FC<Props> = ({ printOptions }) => {
  const hasPrintOptions = printOptions && printOptions.length > 0

  return (
    <div
      className="border border-[var(--portfolio-border-subtle)] flex flex-col"
      style={{ background: 'var(--portfolio-surface-elevated)' }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[var(--portfolio-border-subtle)]">
        <span
          className="portfolio-eyebrow"
          style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 600 }}
        >
          Acquire a Print
        </span>
      </div>

      {/* Print options list */}
      <div className="flex flex-col divide-y divide-[var(--portfolio-border-subtle)]">
        {hasPrintOptions ? (
          printOptions.map((option, i) => (
            <div
              key={option.id ?? i}
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[var(--portfolio-border-subtle)] transition-colors duration-150"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[var(--portfolio-text-primary)] text-sm font-medium">
                  {option.size}
                </span>
                {option.material && (
                  <span className="text-[var(--portfolio-text-muted)]" style={{ fontSize: '11px' }}>
                    {option.material}
                  </span>
                )}
              </div>
              {option.price != null && (
                <span className="text-[var(--portfolio-text-primary)] text-sm font-semibold tabular-nums">
                  ${option.price.toLocaleString()}
                </span>
              )}
            </div>
          ))
        ) : (
          <>
            <PrintOptionPlaceholder
              label="Standard Collector"
              sub="24×36″ · Open Edition"
              price={1200}
            />
            <PrintOptionPlaceholder
              label="Exhibition Format"
              sub="40×60″ · Edition of 25"
              price={2850}
            />
            <PrintOptionPlaceholder
              label="Limited Edition (1 of 5)"
              sub="80×90″ · Museum Acrylic Mount"
              price={6400}
            />
          </>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-4 text-[var(--portfolio-accent-foreground)] font-semibold uppercase tracking-widest cursor-not-allowed"
          style={{
            background: 'var(--portfolio-accent)',
            fontSize: '13px',
            letterSpacing: '0.1em',
            borderRadius: 0,
          }}
          disabled
          aria-disabled="true"
        >
          <MailIcon />
          Request Print
        </button>
        <div className="flex flex-col gap-1 text-center">
          <span
            className="text-[var(--portfolio-text-muted)] uppercase tracking-widest"
            style={{ fontSize: '10px', fontWeight: 600 }}
          >
            Signed certificate of authenticity included
          </span>
          <span
            className="text-[var(--portfolio-text-muted)] uppercase tracking-widest"
            style={{ fontSize: '10px' }}
          >
            Secure art-grade packaging · Worldwide tracking
          </span>
        </div>
      </div>
    </div>
  )
}

function PrintOptionPlaceholder({
  label,
  sub,
  price,
}: {
  label: string
  sub: string
  price: number
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[var(--portfolio-border-subtle)] transition-colors duration-150">
      <div className="flex flex-col gap-0.5">
        <span className="text-[var(--portfolio-text-primary)] text-sm font-medium">{label}</span>
        <span className="text-[var(--portfolio-text-muted)]" style={{ fontSize: '11px' }}>
          {sub}
        </span>
      </div>
      <span className="text-[var(--portfolio-text-primary)] text-sm font-semibold tabular-nums">
        ${price.toLocaleString()}
      </span>
    </div>
  )
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="0" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
