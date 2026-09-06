import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { GalleryImage } from '@/components/GalleryImage'
import type { Media } from '@/payload-types'

vi.mock('@/components/Media', () => ({
  Media: ({ resource }: { resource: Media }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={resource.alt ?? ''} src={resource.url ?? ''} />
  ),
}))

vi.mock('@/components/CtaButton', () => ({
  CtaButton: ({ children, ...props }: { children: ReactNode; onClick?: () => void }) => (
    <button {...props}>{children}</button>
  ),
}))

const image: Media = {
  alt: 'Calculator screen',
  createdAt: '2026-01-01T00:00:00.000Z',
  height: 844,
  id: 1,
  mimeType: 'image/png',
  updatedAt: '2026-01-01T00:00:00.000Z',
  url: '/calculator.png',
  width: 390,
}

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
})

describe('GalleryImage', () => {
  it('opens an accessible modal and locks page scrolling', async () => {
    render(
      <GalleryImage image={image} title="Calculator">
        <img alt="Thumbnail" src="/thumbnail.png" />
      </GalleryImage>,
    )

    const trigger = screen.getByRole('button', { name: 'View Calculator full size' })
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    fireEvent.click(trigger)

    const dialog = await screen.findByRole('dialog', { name: 'Calculator' })
    expect(dialog.hasAttribute('open')).toBe(true)
    expect(screen.getByRole('img', { name: 'Calculator screen' })).not.toBeNull()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('closes from its specular close action and restores scrolling', async () => {
    render(
      <GalleryImage image={image} title="Calculator">
        <span>Thumbnail</span>
      </GalleryImage>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Calculator full size' }))
    const dialog = await screen.findByRole('dialog', { name: 'Calculator' })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    await waitFor(() => expect(dialog.hasAttribute('open')).toBe(false))
    expect(document.body.style.overflow).toBe('')
  })

  it('synchronizes state when the native dialog is dismissed', async () => {
    render(
      <GalleryImage image={image} title="Calculator">
        <span>Thumbnail</span>
      </GalleryImage>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'View Calculator full size' }))
    const dialog = await screen.findByRole('dialog', { name: 'Calculator' })
    ;(dialog as HTMLDialogElement).close()

    await waitFor(() => expect(screen.queryByRole('img', { name: 'Calculator screen' })).toBeNull())
    expect(document.body.style.overflow).toBe('')
  })
})
