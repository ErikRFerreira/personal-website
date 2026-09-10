'use client'

import { ChevronDown } from 'lucide-react'
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

export type LensFilterOption = {
  count?: number
  id: number
  label: string
}

type LensArchiveProps = LensArchivePage & {
  categories?: LensFilterOption[]
  collections?: LensFilterOption[]
  totalDocs?: number
}

export function buildLensArchiveURL(page: number, category: string, collection: string): string {
  const searchParams = new URLSearchParams({ page: String(page) })
  if (category) searchParams.set('category', category)
  if (collection) searchParams.set('collection', collection)
  return `/next/lens?${searchParams.toString()}`
}

export function resolveLensArchiveFormat(
  photo: Pick<LensArchivePhoto, 'archiveFormat' | 'photo'>,
): ResolvedLensFormat {
  if (photo.archiveFormat && photo.archiveFormat !== 'auto') return photo.archiveFormat

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
  categories = [],
  collections = [],
  docs: initialDocs,
  hasNextPage: initialHasNext,
  nextPage: initialNextPage,
  totalDocs = initialDocs.length,
}: LensArchiveProps) {
  const [docs, setDocs] = useState(initialDocs)
  const [hasNextPage, setHasNextPage] = useState(initialHasNext)
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterError, setFilterError] = useState(false)
  const [category, setCategory] = useState('')
  const [collection, setCollection] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const inFlightRef = useRef(false)
  const requestRef = useRef(0)
  const abortRef = useRef<AbortController>(null)

  const requestFilteredPage = useCallback(async (nextCategory: string, nextCollection: string) => {
    const requestID = ++requestRef.current
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    inFlightRef.current = true
    setIsFiltering(true)
    setError(null)
    setFilterError(false)

    try {
      const response = await fetch(buildLensArchiveURL(1, nextCategory, nextCollection), {
        signal: controller.signal,
      })
      if (!response.ok) throw new Error('The photographs could not be filtered.')

      const page = (await response.json()) as LensArchivePage
      if (requestRef.current !== requestID) return

      setDocs(page.docs)
      setHasNextPage(page.hasNextPage)
      setNextPage(page.nextPage)
    } catch (filterError) {
      if (controller.signal.aborted || requestRef.current !== requestID) return
      setError(
        filterError instanceof Error
          ? filterError.message
          : 'The photographs could not be filtered.',
      )
      setFilterError(true)
    } finally {
      if (requestRef.current === requestID) {
        inFlightRef.current = false
        setIsFiltering(false)
      }
    }
  }, [])

  const changeCategory = (value: string) => {
    setCategory(value)
    void requestFilteredPage(value, collection)
  }

  const changeCollection = (value: string) => {
    setCollection(value)
    void requestFilteredPage(category, value)
  }

  const loadMore = useCallback(async () => {
    if (!hasNextPage || nextPage === null || inFlightRef.current) return

    inFlightRef.current = true
    setIsLoading(true)
    setError(null)
    setFilterError(false)
    const requestID = ++requestRef.current

    try {
      const response = await fetch(buildLensArchiveURL(nextPage, category, collection))
      if (!response.ok) throw new Error('The next photographs could not be loaded.')

      const page = (await response.json()) as LensArchivePage
      if (requestRef.current !== requestID) return

      setDocs((current) => {
        const knownIDs = new Set(current.map(({ id }) => id))
        return [...current, ...page.docs.filter(({ id }) => !knownIDs.has(id))]
      })
      setHasNextPage(page.hasNextPage)
      setNextPage(page.nextPage)
    } catch (loadError) {
      if (requestRef.current !== requestID) return
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'The next photographs could not be loaded.',
      )
    } finally {
      if (requestRef.current === requestID) {
        inFlightRef.current = false
        setIsLoading(false)
      }
    }
  }, [category, collection, hasNextPage, nextPage])

  useEffect(() => () => abortRef.current?.abort(), [])

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
      {(categories.length > 0 || collections.length > 0) && (
        <div
          aria-label="Filter photographs"
          className="-mt-8 mb-12 flex flex-col gap-5 border-b border-site-border-subtle pb-6 md:-mt-12 md:mb-16 lg:flex-row lg:items-center lg:gap-8"
          role="group"
        >
          {categories.length > 0 && (
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                aria-pressed={category === ''}
                className={`site-meta-label h-8 shrink-0 rounded-full border px-4 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-site-border-active disabled:cursor-wait disabled:opacity-60 ${
                  category === ''
                    ? 'border-site-accent bg-site-accent text-site-accent-foreground'
                    : 'border-site-border-subtle text-site-text-secondary hover:border-site-border-control hover:text-site-text-primary'
                }`}
                disabled={isFiltering}
                onClick={() => changeCategory('')}
                type="button"
              >
                All <span className="opacity-70">[{String(totalDocs).padStart(2, '0')}]</span>
              </button>

              {categories.map((option) => (
                <button
                  aria-label={`Filter by ${option.label} category`}
                  aria-pressed={category === String(option.id)}
                  className={`site-meta-label h-8 shrink-0 rounded-full border px-4 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-site-border-active disabled:cursor-wait disabled:opacity-60 ${
                    category === String(option.id)
                      ? 'border-site-accent bg-site-accent text-site-accent-foreground'
                      : 'border-site-border-subtle text-site-text-secondary hover:border-site-border-control hover:text-site-text-primary'
                  }`}
                  disabled={isFiltering}
                  key={option.id}
                  onClick={() => changeCategory(String(option.id))}
                  type="button"
                >
                  {option.label}{' '}
                  <span className="opacity-60">[{String(option.count ?? 0).padStart(2, '0')}]</span>
                </button>
              ))}
            </div>
          )}

          {collections.length > 0 && (
            <label className="flex shrink-0 items-center gap-3">
              <span className="site-meta-label font-bold text-site-text-muted">
                Collection
              </span>
              <span className="relative w-48 sm:w-52">
                <select
                  className="site-meta-label h-8 w-full appearance-none rounded-full border border-site-border-subtle bg-site-surface-elevated/65 pr-9 pl-4 font-bold text-site-text-primary transition-colors hover:border-site-border-control focus:border-site-border-active focus:outline-none disabled:cursor-wait disabled:opacity-60"
                  disabled={isFiltering}
                  onChange={(event) => changeCollection(event.target.value)}
                  value={collection}
                >
                  <option value="">All collections</option>
                  {collections.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-site-accent"
                />
              </span>
            </label>
          )}
        </div>
      )}

      <div aria-busy={isFiltering} className={isFiltering ? 'opacity-45' : undefined}>
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
          <p className="text-sm text-site-text-secondary md:text-base">
            {category || collection
              ? 'No photographs match these filters.'
              : 'No photographs have been published yet.'}
          </p>
        )}
      </div>

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
            onClick={() =>
              filterError ? void requestFilteredPage(category, collection) : void loadMore()
            }
            type="button"
          >
            Retry loading photographs
          </button>
        )}
      </div>
    </>
  )
}
