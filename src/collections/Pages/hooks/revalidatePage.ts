import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'
import { getPageCacheTag } from '../../../utilities/cacheTags'

export const getPagePaths = (slug?: string | null) => {
  if (slug === 'home') return ['/', '/home']
  if (!slug) return []

  return [`/${slug}`]
}

const revalidatePageSlug = (slug?: string | null) => {
  if (!slug) return

  getPagePaths(slug).forEach((path) => revalidatePath(path))
  revalidateTag(getPageCacheTag(slug), 'max')
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const paths = getPagePaths(doc.slug)

      paths.forEach((path) => {
        payload.logger.info(`Revalidating page at path: ${path}`)
      })

      revalidatePageSlug(doc.slug)
      revalidateTag('pages-sitemap', 'max')
    }

    // Invalidate a previously published path when it is unpublished or renamed.
    if (
      previousDoc?._status === 'published' &&
      (doc._status !== 'published' || previousDoc.slug !== doc.slug)
    ) {
      const oldPaths = getPagePaths(previousDoc.slug)

      oldPaths.forEach((oldPath) => {
        payload.logger.info(`Revalidating old page at path: ${oldPath}`)
      })

      revalidatePageSlug(previousDoc.slug)
      revalidateTag('pages-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePageSlug(doc?.slug)
    revalidateTag('pages-sitemap', 'max')
  }

  return doc
}
