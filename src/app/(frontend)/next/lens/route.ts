import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: Request): Promise<Response> {
  const rawPage = new URL(request.url).searchParams.get('page') ?? '1'

  if (!/^\d+$/.test(rawPage) || Number(rawPage) < 1) {
    return Response.json({ error: 'Page must be a positive integer.' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
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
      where: {
        status: {
          equals: 'published',
        },
      },
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
