import { beforeEach, describe, expect, it, vi } from 'vitest'

const cacheMocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/cache', () => cacheMocks)

import { revalidateDelete, revalidatePage } from '@/collections/Pages/hooks/revalidatePage'

const request = {
  context: {},
  payload: { logger: { info: vi.fn() } },
}

describe('page revalidation', () => {
  beforeEach(() => {
    cacheMocks.revalidatePath.mockReset()
    cacheMocks.revalidateTag.mockReset()
    request.payload.logger.info.mockReset()
  })

  it('invalidates the homepage paths and cache tag after publishing', () => {
    revalidatePage({
      doc: { _status: 'published', slug: 'home' },
      previousDoc: { _status: 'draft', slug: 'home' },
      req: request,
    } as never)

    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/')
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/home')
    expect(cacheMocks.revalidateTag).toHaveBeenCalledWith('page_home', 'max')
  })

  it('invalidates both current and previous slugs after a rename', () => {
    revalidatePage({
      doc: { _status: 'published', slug: 'new-slug' },
      previousDoc: { _status: 'published', slug: 'old-slug' },
      req: request,
    } as never)

    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/new-slug')
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/old-slug')
    expect(cacheMocks.revalidateTag).toHaveBeenCalledWith('page_new-slug', 'max')
    expect(cacheMocks.revalidateTag).toHaveBeenCalledWith('page_old-slug', 'max')
  })

  it('invalidates the page data after deletion', () => {
    revalidateDelete({ doc: { slug: 'about' }, req: request } as never)

    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/about')
    expect(cacheMocks.revalidateTag).toHaveBeenCalledWith('page_about', 'max')
  })
})
