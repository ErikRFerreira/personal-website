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

  it('keeps commerce optional and separates digital downloads from print variants', () => {
    const fields = getLensContentFields()
    const printOptions = fields.find((field) => 'name' in field && field.name === 'printOptions')
    const archiveFormat = Lens.fields.find(
      (field) => 'name' in field && field.name === 'archiveFormat',
    )

    expect(printOptions).toMatchObject({ type: 'array' })
    expect(
      fields.find((field) => 'name' in field && field.name === 'digitalPurchaseEnabled'),
    ).toMatchObject({
      defaultValue: false,
      type: 'checkbox',
    })
    expect(
      fields.find((field) => 'name' in field && field.name === 'digitalCurrency'),
    ).toMatchObject({
      defaultValue: 'EUR',
      options: [{ value: 'EUR' }, { value: 'USD' }, { value: 'GBP' }],
      type: 'select',
    })
    expect(
      fields.find((field) => 'name' in field && field.name === 'digitalLicenseType'),
    ).toMatchObject({ defaultValue: 'Personal use', type: 'text' })
    expect(
      fields.find((field) => 'name' in field && field.name === 'commercialLicensingEnabled'),
    ).toMatchObject({ defaultValue: true, type: 'checkbox' })

    for (const name of [
      'digitalPrice',
      'digitalCheckoutUrl',
      'digitalFormat',
      'digitalDimensions',
      'digitalFileSize',
      'digitalLicenseDescription',
      'commercialLicensingText',
    ]) {
      const field = fields.find((candidate) => 'name' in candidate && candidate.name === name)
      expect(field).toBeDefined()
      expect(field).not.toHaveProperty('required')
      expect(field).toMatchObject({ admin: { condition: expect.any(Function) } })
    }

    expect(
      fields.find((field) => 'name' in field && field.name === 'digitalDownload'),
    ).toBeUndefined()
    expect(
      fields.find((field) => 'name' in field && field.name === 'licensingText'),
    ).toBeUndefined()
    expect(archiveFormat).toMatchObject({ defaultValue: 'auto', type: 'select' })
    expect(archiveFormat).not.toHaveProperty('required')

    for (const name of ['title', 'photo', 'status']) {
      expect(Lens.fields.find((field) => 'name' in field && field.name === name)).toMatchObject({
        required: true,
      })
    }

    const slugRow = Lens.fields.find(
      (field) =>
        field.type === 'row' &&
        field.fields.some((child) => 'name' in child && child.name === 'slug'),
    )
    expect(
      slugRow?.type === 'row'
        ? slugRow.fields.find((field) => 'name' in field && field.name === 'slug')
        : undefined,
    ).toMatchObject({ required: true, type: 'text' })
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
