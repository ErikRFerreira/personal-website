'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Expand, X } from 'lucide-react'
import { CtaButton } from '@/components/CtaButton'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import styles from './styles.module.css'

type Props = {
  children: ReactNode
  className?: string
  image: MediaType
  title: string
}

export function GalleryImage({ children, className, image, title }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return

    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <button
        aria-label={`View ${title} full size`}
        aria-haspopup="dialog"
        className={cn(
          'group relative w-full cursor-zoom-in text-left transition-colors duration-200 hover:border-site-border-active focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-accent motion-reduce:transition-none',
          className,
        )}
        onClick={() => setOpen(true)}
        type="button"
      >
        {children}
        <Expand
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 h-4 w-4 text-site-text-muted opacity-60 transition-[color,opacity] duration-200 group-hover:text-site-accent group-hover:opacity-100 group-focus-visible:text-site-accent group-focus-visible:opacity-100 motion-reduce:transition-none"
        />
      </button>

      <dialog
        aria-label={title}
        className={styles.modal}
        data-lenis-prevent
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const rect = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          ) {
            event.currentTarget.close()
          }
        }}
        onClose={() => setOpen(false)}
        ref={dialogRef}
      >
        {open && (
          <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-site-border-subtle px-4 py-3 md:px-6">
              <p className="min-w-0 text-sm font-medium text-site-text-primary break-words">
                {title}
              </p>
              <CtaButton
                className="shrink-0"
                onClick={() => dialogRef.current?.close()}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
                Close
              </CtaButton>
            </div>
            <div className="relative min-h-0 flex-1 overflow-auto p-4 md:p-6">
              <Media
                imgClassName="mx-auto block h-auto max-h-[calc(100dvh-10rem)] w-auto max-w-full object-contain"
                pictureClassName="block"
                loading="eager"
                resource={image}
                size="(min-width: 1536px) 1440px, calc(100vw - 5rem)"
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
