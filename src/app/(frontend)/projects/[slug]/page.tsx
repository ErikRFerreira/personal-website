import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import type { Project } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ProjectDetail, getNextProject, type ProjectNavigationItem } from './ProjectDetail'

export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return projects.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const [project, navigationProjects] = await Promise.all([
    queryProjectBySlug(decodedSlug),
    queryProjectNavigation(),
  ])

  if (!project) notFound()

  return (
    <ProjectDetail nextProject={getNextProject(project.id, navigationProjects)} project={project} />
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const project = await queryProjectBySlug(decodedSlug)

  if (!project) return {}

  const title = `${project.title} | Projects | Erik Fereira`
  const description = project.description ?? undefined
  const featuredImage =
    typeof project.image === 'object' && project.image !== null && project.image.url
      ? project.image
      : null
  const featuredImageURL = featuredImage?.url ?? undefined
  const url = `/projects/${project.slug}`

  return {
    alternates: {
      canonical: url,
    },
    description,
    openGraph: mergeOpenGraph({
      description: description ?? '',
      images: featuredImageURL
        ? [{ alt: featuredImage?.alt ?? project.title, url: featuredImageURL }]
        : undefined,
      title,
      url,
    }),
    title,
  }
}

const queryProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
  })

  return result.docs[0] ?? null
})

const queryProjectNavigation = cache(async (): Promise<ProjectNavigationItem[]> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    sort: ['-year', '-createdAt'],
    select: {
      slug: true,
      title: true,
    },
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return result.docs
})
