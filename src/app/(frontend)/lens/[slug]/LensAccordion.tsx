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
    <div className="border-t border-[var(--portfolio-border-subtle)]">
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
            className="text-[var(--portfolio-text-secondary)] text-sm leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0"
          />
        )}
      </AccordionRow>

      <AccordionRow
        label="Shipping & Returns"
        isOpen={open === 'shipping'}
        onToggle={() => toggle('shipping')}
      >
        <div className="text-[var(--portfolio-text-secondary)] text-sm leading-relaxed space-y-3">
          <p>
            All prints are carefully packaged with acid-free tissue and rigid backing boards before
            being placed in custom-fit tubes or flat boxes. We use art-grade materials throughout to
            ensure your piece arrives in pristine condition.
          </p>
          <p>
            Shipping typically takes{' '}
            <strong className="text-[var(--portfolio-text-primary)]">5–10 business days</strong> for
            standard destinations. Expedited options are available upon request. All orders include
            full tracking and insurance coverage.
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
          <p className="text-[var(--portfolio-text-secondary)] text-sm leading-relaxed">
            {licensingText}
          </p>
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
    <div className="border-b border-[var(--portfolio-border-subtle)]">
      <button
        type="button"
        onClick={disabled ? undefined : onToggle}
        className="w-full flex items-center justify-between py-5 text-left portfolio-transition"
        style={{ cursor: disabled ? 'default' : 'pointer' }}
        aria-expanded={isOpen}
      >
        <span
          className="text-[var(--portfolio-text-secondary)] uppercase tracking-widest"
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em' }}
        >
          {label}
        </span>
        {!disabled && (
          <ChevronIcon
            className="shrink-0 transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        )}
      </button>
      {isOpen && !disabled && <div className="pb-6">{children}</div>}
    </div>
  )
}

function ChevronIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--portfolio-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
