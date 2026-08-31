'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { LensArchiveItem, type LensArchivePhoto, type ResolvedLensFormat } from './LensArchiveItem'

export {
  formatLensArchiveCaption,
  type LensArchivePhoto,
  type ResolvedLensFormat,
} from './LensArchiveItem'

type LensArchivePage = {
  docs: LensArchivePhoto[]
  hasNextPage: boolean
  nextPage: number | null
}

type LensArchiveProps = LensArchivePage

export function resolveLensArchiveFormat(
  photo: Pick<LensArchivePhoto, 'archiveFormat' | 'photo'>,
): ResolvedLensFormat {
  if (photo.archiveFormat !== 'auto') return photo.archiveFormat

  const image = typeof photo.photo === 'object' && photo.photo !== null ? photo.photo : null
  const width = image?.width ?? 0
  const height = image?.height ?? 0

  if (width <= 0 || height <= 0) return 'landscape'

  const ratio = width / height
  if (ratio >= 1.9) return 'panorama'
  if (ratio <= 0.82) return 'portrait'
  if (ratio >= 0.9 && ratio <= 1.1) return 'square'
  return 'landscape'
}

export function LensArchive({
  docs: initialDocs,
  hasNextPage: initialHasNext,
  nextPage: initialNextPage,
}: LensArchiveProps) {
  const [docs, setDocs] = useState(initialDocs)
  const [hasNextPage, setHasNextPage] = useState(initialHasNext)
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const inFlightRef = useRef(false)

  const loadMore = useCallback(async () => {
    if (!hasNextPage || nextPage === null || inFlightRef.current) return

    inFlightRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/next/lens?page=${nextPage}`)
      if (!response.ok) throw new Error('The next photographs could not be loaded.')

      const page = (await response.json()) as LensArchivePage

      setDocs((current) => {
        const knownIDs = new Set(current.map(({ id }) => id))
        return [...current, ...page.docs.filter(({ id }) => !knownIDs.has(id))]
      })
      setHasNextPage(page.hasNextPage)
      setNextPage(page.nextPage)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'The next photographs could not be loaded.',
      )
    } finally {
      inFlightRef.current = false
      setIsLoading(false)
    }
  }, [hasNextPage, nextPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage || error || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore()
      },
      { rootMargin: '600px 0px', threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [error, hasNextPage, loadMore])

  return (
    <>
      {docs.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-20 md:grid-cols-12 md:gap-y-28 lg:gap-x-8 lg:gap-y-32">
          {docs.map((photo, index) => {
            const format = resolveLensArchiveFormat(photo)
            const pairedPhoto = index < 2 ? docs[index === 0 ? 1 : 0] : undefined
            const pairedFormat = pairedPhoto ? resolveLensArchiveFormat(pairedPhoto) : undefined

            return (
              <LensArchiveItem
                format={format}
                index={index}
                key={photo.id}
                pairedFormat={pairedFormat}
                photo={photo}
              />
            )
          })}
        </div>
      ) : (
        <p className="text-base text-site-text-secondary">
          No photographs have been published yet.
        </p>
      )}

      <div
        aria-live="polite"
        className="mt-24 flex min-h-12 items-center justify-center md:mt-32"
        ref={sentinelRef}
      >
        {isLoading && (
          <div
            aria-label="Loading more photographs"
            className="h-12 w-12 animate-spin rounded-full border-2 border-site-accent/20 border-t-site-accent motion-reduce:animate-none"
            role="status"
          />
        )}

        {error && (
          <button
            className="text-sm font-semibold text-site-accent transition-colors hover:text-site-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active"
            onClick={() => void loadMore()}
            type="button"
          >
            Retry loading photographs
          </button>
        )}
      </div>
    </>
  )
}
