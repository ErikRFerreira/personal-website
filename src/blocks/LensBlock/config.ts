import type { Block } from 'payload'

export const LensBlock: Block = {
  slug: 'lensBlock',
  interfaceName: 'LensBlock',
  labels: {
    singular: 'Lens Block',
    plural: 'Lens Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Visual Storytelling',
    },
    {
      name: 'label',
      type: 'text',
      defaultValue: '01 — Lens',
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'A curated selection of moments frozen in time, spanning architectural geometry, natural landscapes, and the silent depths of the ocean.',
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'lens',
      hasMany: true,
      required: true,
      admin: {
        description: 'Choose which photos should appear in this block.',
      },
    },
  ],
}
