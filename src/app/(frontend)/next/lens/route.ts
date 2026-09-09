import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'

function parseFilterID(value: string | null): number | null | undefined {
  if (value === null || value === '') return null
  if (!/^\d+$/.test(value) || Number(value) < 1) return undefined
  return Number(value)
}

export async function GET(request: Request): Promise<Response> {
  const searchParams = new URL(request.url).searchParams
  const rawPage = searchParams.get('page') ?? '1'
  const category = parseFilterID(searchParams.get('category'))
  const collection = parseFilterID(searchParams.get('collection'))

  if (!/^\d+$/.test(rawPage) || Number(rawPage) < 1) {
    return Response.json({ error: 'Page must be a positive integer.' }, { status: 400 })
  }

  if (category === undefined || collection === undefined) {
    return Response.json({ error: 'Filters must use valid IDs.' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const filters: Where[] = [{ status: { equals: 'published' } }]

    if (category !== null) filters.push({ categories: { in: [category] } })
    if (collection !== null) filters.push({ series: { equals: collection } })

    const photos = await payload.find({
      collection: 'lens',
      depth: 1,
      limit: 5,
      overrideAccess: false,
      page: Number(rawPage),
      sort: ['-year', '-createdAt'],
      select: {
        archiveFormat: true,
        location: true,
        photo: true,
        series: true,
        slug: true,
        technicalMetadata: true,
        title: true,
        year: true,
      },
      where: { and: filters },
    })

    return Response.json({
      docs: photos.docs,
      hasNextPage: photos.hasNextPage,
      nextPage: photos.nextPage ?? null,
    })
  } catch (error) {
    console.error('Unable to load the Lens archive page.', error)
    return Response.json({ error: 'Unable to load photographs.' }, { status: 500 })
  }
}
