import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProjectGallery } from '@/app/(frontend)/projects/[slug]/ProjectGallery'
import type { Media, Project } from '@/payload-types'

// Gallery prose uses standard Lexical nodes, not embedded code-block admin controls.
vi.mock('@/blocks/Code/Component', () => ({ CodeBlock: () => null }))

vi.mock('@/components/Media', () => ({
  Media: ({ resource }: { resource: Media }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={resource.alt ?? ''} src={resource.url ?? ''} />
  ),
}))
vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

type Entry = NonNullable<Project['gallery']>[number]
export function galleryEntry(title: string, layout: Entry['layout'] = 'full'): Entry {
  return {
    id: title,
    title,
    layout,
    image: {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      url: '/screen.png',
      mimeType: 'image/png',
      width: 390,
      height: 844,
    },
    description: {
      root: {
        type: 'root',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        children: [
          {
            type: 'paragraph',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'text',
                version: 1,
                text: `How ${title} works.`,
                format: 1,
                detail: 0,
                mode: 'normal',
                style: '',
              },
            ],
          },
        ],
      },
    },
  }
}
function project(gallery: Project['gallery'], gallerySubtitle?: string): Project {
  return {
    id: 1,
    title: 'Example',
    slug: 'example',
    status: 'published',
    createdAt: '',
    updatedAt: '',
    gallery,
    gallerySubtitle,
  }
}

afterEach(cleanup)

describe('ProjectGallery', () => {
  it('preserves mixed layout order, numbering, and rich-text formatting', () => {
    const entries = [
      galleryEntry('Calculator'),
      galleryEntry('Label', 'half'),
      galleryEntry('History', 'half'),
      galleryEntry('Settings', 'split'),
      galleryEntry('Extra', 'half'),
    ]
    render(<ProjectGallery project={project(entries, 'Core interfaces')} />)
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(entries.map(({ title }) => title))
    expect(screen.getByText('05 Screens')).not.toBeNull()
    expect(screen.getByText('Screen 05')).not.toBeNull()
    expect(screen.getByText('Core interfaces')).not.toBeNull()
    expect(screen.getByText('How Settings works.').closest('strong')).not.toBeNull()
  })

  it('filters unresolved, missing-URL and non-image media before counting and numbering', () => {
    const valid = galleryEntry('Valid')
    const image = valid.image as Media
    render(
      <ProjectGallery
        project={project([
          { ...galleryEntry('Unresolved'), image: 42 },
          { ...galleryEntry('No URL'), image: { ...image, url: '' } },
          { ...galleryEntry('Video'), image: { ...image, mimeType: 'video/mp4' } },
          valid,
        ])}
      />,
    )
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getByText('01 Screen')).not.toBeNull()
    expect(screen.getByText('Screen 01')).not.toBeNull()
    expect(screen.queryByText('Screen 02')).toBeNull()
  })

  it('uses media alt text and falls back to the entry title for blank alt text', () => {
    const entry = galleryEntry('Title fallback')
    render(
      <ProjectGallery
        project={project([
          {
            ...entry,
            id: 'first',
            image: { ...(entry.image as Media), alt: 'Specific screen description' },
          },
          { ...entry, id: 'second', image: { ...(entry.image as Media), alt: '  ' } },
        ])}
      />,
    )
    expect(screen.getByRole('img', { name: 'Specific screen description' })).not.toBeNull()
    expect(screen.getByRole('img', { name: 'Title fallback' })).not.toBeNull()
  })

  it.each([undefined, [], [{ ...galleryEntry('Unavailable'), image: 99 }]])(
    'omits an empty gallery',
    (gallery) => {
      const { container } = render(<ProjectGallery project={project(gallery)} />)
      expect(container.innerHTML).toBe('')
    },
  )
})
