import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const meta = doc?.meta as
    | (NonNullable<Page['meta'] | Post['meta']> & {
        image?: Media | Config['db']['defaultIDType'] | null
      })
    | undefined

  const ogImage = getImageURL(meta?.image)

  const title = meta?.title
    ? meta.title + ' | Erik Fereira - Developer & Photographer'
    : 'Erik Fereira - Developer & Photographer'

  return {
    description: meta?.description,
    openGraph: mergeOpenGraph({
      description: meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
