import { describe, expect, it } from 'vitest'

import { Lens } from '@/collections/Lens'
import { Series } from '@/collections/Series'

function getLensContentFields() {
  const tabsField = Lens.fields.find((field) => field.type === 'tabs')
  if (!tabsField || tabsField.type !== 'tabs') throw new Error('Lens content tabs are missing.')

  const contentTab = tabsField.tabs.find((tab) => 'fields' in tab && tab.label === 'Content')
  if (!contentTab || !('fields' in contentTab)) throw new Error('Lens content tab is missing.')

  return contentTab.fields
}

describe('Lens taxonomy schema', () => {
  it('uses a managed collection and shared categories instead of manual related photos', () => {
    const fields = getLensContentFields()

    expect(fields.find((field) => 'name' in field && field.name === 'series')).toMatchObject({
      label: 'Collection',
      relationTo: 'series',
      type: 'relationship',
    })
    expect(fields.find((field) => 'name' in field && field.name === 'categories')).toMatchObject({
      hasMany: true,
      relationTo: 'categories',
      type: 'relationship',
    })
    expect(
      fields.find((field) => 'name' in field && field.name === 'relatedPhotos'),
    ).toBeUndefined()
  })

  it('exposes Lens collections publicly while protecting mutations', async () => {
    expect(Series.labels).toEqual({ plural: 'Lens Collections', singular: 'Lens Collection' })
    expect(
      Series.fields.find((field) => 'name' in field && field.name === 'coverImage'),
    ).toMatchObject({ relationTo: 'media', type: 'upload' })

    expect(await Series.access?.read?.({} as never)).toBe(true)
    expect(await Series.access?.create?.({ req: { user: null } } as never)).toBe(false)
    expect(await Series.access?.create?.({ req: { user: { id: 1 } } } as never)).toBe(true)
  })
})
