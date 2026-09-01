'use client'

import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

type PrintOption = {
  id?: string | null
  material?: string | null
  price?: number | null
  size: string
}

type Props = {
  printOptions?: PrintOption[] | null
}

const euroFormatter = new Intl.NumberFormat('en-IE', {
  currency: 'EUR',
  currencyDisplay: 'symbol',
  style: 'currency',
})

export const LensPrintOptions: React.FC<Props> = ({ printOptions }) => {
  const options = printOptions ?? []
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedOption = options[selectedIndex]

  if (!selectedOption) {
    return (
      <div className="border-t border-site-border-subtle pt-6" data-testid="lens-print-options">
        <ComingSoonButton />
      </div>
    )
  }

  return (
    <div
      className="space-y-6 border-t border-site-border-subtle pt-6"
      data-testid="lens-print-options"
    >
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[0.625rem] font-bold tracking-[0.16em] text-site-text-muted uppercase">
            Print edition
          </p>
          <p className="mt-1 text-sm text-site-text-secondary">Available print variant</p>
        </div>

        {selectedOption.price != null && (
          <p className="shrink-0 text-xl font-bold text-site-text-primary tabular-nums">
            {euroFormatter.format(selectedOption.price)}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 font-mono text-[0.625rem] font-bold tracking-[0.16em] text-site-text-muted uppercase">
          Dimensions
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {options.map((option, index) => (
            <button
              aria-label={option.material ? `${option.size}, ${option.material}` : option.size}
              aria-pressed={selectedIndex === index}
              className={`min-h-12 border px-3 py-2 text-center text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-border-active ${
                selectedIndex === index
                  ? 'border-site-accent bg-site-accent/10 text-site-text-primary'
                  : 'border-site-border-subtle text-site-text-secondary hover:border-site-border-active hover:text-site-text-primary'
              }`}
              key={option.id ?? `${option.size}-${index}`}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              {option.size}
            </button>
          ))}
        </div>
      </fieldset>

      {selectedOption.material && (
        <div>
          <p className="font-mono text-[0.625rem] font-bold tracking-[0.16em] text-site-text-muted uppercase">
            Material / finish
          </p>
          <p className="mt-2 border-b border-site-border-subtle pb-3 text-sm text-site-text-primary">
            {selectedOption.material}
          </p>
        </div>
      )}

      <ComingSoonButton />
    </div>
  )
}

function ComingSoonButton() {
  return (
    <button
      aria-disabled="true"
      className="flex w-full cursor-not-allowed items-center justify-center gap-2 bg-site-accent/55 px-4 py-4 text-xs font-bold tracking-[0.12em] text-site-accent-foreground uppercase"
      disabled
      type="button"
    >
      <ShoppingCart aria-hidden="true" className="size-4" />
      Print purchases coming soon
    </button>
  )
}
