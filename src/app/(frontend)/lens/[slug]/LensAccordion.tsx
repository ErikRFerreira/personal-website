'use client'

import React, { useState } from 'react'
import RichText from '@/components/RichText'
import type { Len } from '@/payload-types'

type Props = {
  fullStory?: Len['fullStory']
  licensingText?: string | null
}

type Panel = 'story' | 'shipping' | 'licensing'

export const LensAccordion: React.FC<Props> = ({ fullStory, licensingText }) => {
  const [open, setOpen] = useState<Panel | null>(null)

  const toggle = (panel: Panel) => setOpen((prev) => (prev === panel ? null : panel))

  return (
    <div className="border-t border-site-border-subtle">
      <AccordionRow
        label="Story Behind the Shot"
        isOpen={open === 'story'}
        onToggle={() => toggle('story')}
        disabled={!fullStory}
      >
        {fullStory && (
          <RichText
            data={fullStory}
            enableGutter={false}
            className="text-sm leading-relaxed text-site-text-secondary [&_p]:mb-3 [&_p:last-child]:mb-0"
          />
        )}
      </AccordionRow>

      <AccordionRow
        label="Shipping & Returns"
        isOpen={open === 'shipping'}
        onToggle={() => toggle('shipping')}
      >
        <div className="space-y-3 text-sm leading-relaxed text-site-text-secondary">
          <p>
            All prints are carefully packaged with acid-free tissue and rigid backing boards before
            being placed in custom-fit tubes or flat boxes. We use art-grade materials throughout to
            ensure your piece arrives in pristine condition.
          </p>
          <p>
            Shipping typically takes{' '}
            <strong className="text-site-text-primary">5–10 business days</strong> for standard
            destinations. Expedited options are available upon request. All orders include full
            tracking and insurance coverage.
          </p>
          <p>
            If your print arrives damaged, contact us within 48 hours with photos of the packaging
            and artwork. We will arrange a replacement or full refund at no additional cost.
          </p>
        </div>
      </AccordionRow>

      <AccordionRow
        label="Licensing"
        isOpen={open === 'licensing'}
        onToggle={() => toggle('licensing')}
        disabled={!licensingText}
      >
        {licensingText && (
          <p className="text-sm leading-relaxed text-site-text-secondary">{licensingText}</p>
        )}
      </AccordionRow>
    </div>
  )
}

type RowProps = {
  label: string
  isOpen: boolean
  onToggle: () => void
  disabled?: boolean
  children?: React.ReactNode
}

function AccordionRow({ label, isOpen, onToggle, disabled, children }: RowProps) {
  return (
    <div className="border-b border-site-border-subtle">
      <button
        type="button"
        onClick={disabled ? undefined : onToggle}
        className={[
          'flex w-full items-center justify-between py-5 text-left transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-out motion-reduce:transition-none',
          disabled ? 'cursor-default' : 'cursor-pointer',
        ].join(' ')}
        aria-expanded={isOpen}
      >
        <span className="text-[11px] font-semibold tracking-[0.12em] text-site-text-secondary uppercase">
          {label}
        </span>
        {!disabled && (
          <ChevronIcon
            className={[
              'shrink-0 text-site-accent transition-transform duration-200',
              isOpen ? 'rotate-180' : 'rotate-0',
            ].join(' ')}
          />
        )}
      </button>
      {isOpen && !disabled && <div className="pb-6">{children}</div>}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
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
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
