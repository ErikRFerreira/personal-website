'use client'

import { useState } from 'react'

import RichText from '@/components/RichText'
import type { Len } from '@/payload-types'

type Props = {
  fullStory?: Len['fullStory']
  licensingText?: string | null
}

type Panel = 'story' | 'licensing'

export const LensAccordion: React.FC<Props> = ({ fullStory, licensingText }) => {
  const [open, setOpen] = useState<Panel | null>(null)
  const toggle = (panel: Panel) => setOpen((previous) => (previous === panel ? null : panel))

  if (!fullStory && !licensingText) return null

  return (
    <div className="border-t border-site-border-subtle" data-testid="lens-long-form">
      {fullStory && (
        <AccordionRow
          isOpen={open === 'story'}
          label="Story Behind the Shot"
          onToggle={() => toggle('story')}
        >
          <RichText
            className="text-sm leading-relaxed text-site-text-secondary [&_p]:mb-3 [&_p:last-child]:mb-0"
            data={fullStory}
            enableGutter={false}
          />
        </AccordionRow>
      )}

      {licensingText && (
        <AccordionRow
          isOpen={open === 'licensing'}
          label="Licensing"
          onToggle={() => toggle('licensing')}
        >
          <p className="text-sm leading-relaxed text-site-text-secondary">{licensingText}</p>
        </AccordionRow>
      )}
    </div>
  )
}

type RowProps = {
  children: React.ReactNode
  isOpen: boolean
  label: string
  onToggle: () => void
}

function AccordionRow({ children, isOpen, label, onToggle }: RowProps) {
  return (
    <div className="border-b border-site-border-subtle">
      <button
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between py-5 text-left transition-colors duration-200 motion-reduce:transition-none"
        onClick={onToggle}
        type="button"
      >
        <span className="text-[0.6875rem] font-semibold tracking-[0.12em] text-site-text-secondary uppercase">
          {label}
        </span>
        <ChevronIcon
          className={`shrink-0 text-site-accent transition-transform duration-200 motion-reduce:transition-none ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      {isOpen && <div className="pb-6">{children}</div>}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
