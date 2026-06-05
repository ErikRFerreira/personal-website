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
    <div className="flex flex-col border border-site-border-subtle bg-site-surface-elevated">
      {/* Header */}
      <div className="border-b border-site-border-subtle px-6 pt-6 pb-4">
        <span className="font-mono text-[11px] leading-[1.2] font-semibold tracking-[0.12em] text-site-accent uppercase">
          Acquire a Print
        </span>
      </div>

      {/* Print options list */}
      <div className="flex flex-col divide-y divide-site-border-subtle">
        {hasPrintOptions ? (
          printOptions.map((option, i) => (
            <div
              key={option.id ?? i}
              className="flex cursor-pointer items-center justify-between px-6 py-4 transition-colors duration-150 hover:bg-site-border-subtle"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-site-text-primary">{option.size}</span>
                {option.material && (
                  <span className="text-[11px] text-site-text-muted">{option.material}</span>
                )}
              </div>
              {option.price != null && (
                <span className="text-sm font-semibold text-site-text-primary tabular-nums">
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
      <div className="flex flex-col gap-4 px-6 pt-5 pb-6">
        <button
          type="button"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-none bg-site-accent py-4 text-[13px] font-semibold tracking-[0.1em] text-site-accent-foreground uppercase"
          disabled
          aria-disabled="true"
        >
          <MailIcon />
          Request Print
        </button>
        <div className="flex flex-col gap-1 text-center">
          <span className="text-[10px] font-semibold tracking-widest text-site-text-muted uppercase">
            Signed certificate of authenticity included
          </span>
          <span className="text-[10px] tracking-widest text-site-text-muted uppercase">
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
    <div className="flex cursor-pointer items-center justify-between px-6 py-4 transition-colors duration-150 hover:bg-site-border-subtle">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-site-text-primary">{label}</span>
        <span className="text-[11px] text-site-text-muted">{sub}</span>
      </div>
      <span className="text-sm font-semibold text-site-text-primary tabular-nums">
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
