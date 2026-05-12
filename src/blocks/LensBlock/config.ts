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
      defaultValue: '02 — Lens',
    },
    {
      name: 'label',
      type: 'text',
      defaultValue: 'Visual Diary',
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
