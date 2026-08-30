import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  cache: new Map<string, unknown>(),
  find: vi.fn(),
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({ default: Promise.resolve({}) }))

vi.mock('payload', () => ({
  getPayload: mocks.getPayload,
}))

vi.mock('next/cache', () => ({
  unstable_cache: (callback: () => Promise<unknown>, keyParts: string[]) => async () => {
    const key = JSON.stringify(keyParts)

    if (!mocks.cache.has(key)) {
      mocks.cache.set(key, await callback())
    }

    return mocks.cache.get(key)
  },
}))

import { getPageBySlug } from '@/utilities/getPageBySlug'

describe('getPageBySlug', () => {
  beforeEach(() => {
    mocks.cache.clear()
    mocks.find.mockReset()
    mocks.getPayload.mockReset()
    mocks.getPayload.mockResolvedValue({ find: mocks.find })
    mocks.find.mockResolvedValue({ docs: [{ id: 1, slug: 'home' }] })
  })

  it('reuses published reads and enforces public access', async () => {
    await getPageBySlug({ draft: false, slug: 'home' })
    await getPageBySlug({ draft: false, slug: 'home' })

    expect(mocks.find).toHaveBeenCalledTimes(1)
    expect(mocks.find).toHaveBeenCalledWith(
      expect.objectContaining({ draft: false, overrideAccess: false }),
    )
  })

  it('never caches draft preview reads', async () => {
    await getPageBySlug({ draft: true, slug: 'home' })
    await getPageBySlug({ draft: true, slug: 'home' })

    expect(mocks.find).toHaveBeenCalledTimes(2)
    expect(mocks.find).toHaveBeenCalledWith(
      expect.objectContaining({ draft: true, overrideAccess: true }),
    )
  })
})
