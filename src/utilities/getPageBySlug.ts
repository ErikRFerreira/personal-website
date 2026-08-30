import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { getPageCacheTag } from './cacheTags'

type Page = RequiredDataFromCollectionSlug<'pages'>

type FindPageBySlugArgs = {
  draft: boolean
  slug: string
}

const findPageBySlug = async ({ draft, slug }: FindPageBySlugArgs): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    // Draft preview is an authenticated administrative view. Published reads
    // should continue to respect the collection's public access rules.
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}

const getCachedPublishedPageBySlug = (slug: string) =>
  unstable_cache(() => findPageBySlug({ draft: false, slug }), ['page', slug], {
    tags: [getPageCacheTag(slug)],
  })

export const getPageBySlug = ({ draft, slug }: FindPageBySlugArgs) => {
  if (draft) {
    return findPageBySlug({ draft: true, slug })
  }

  return getCachedPublishedPageBySlug(slug)()
}
