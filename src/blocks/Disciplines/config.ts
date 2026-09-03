import type { Block } from 'payload'

export const Disciplines: Block = {
  slug: 'disciplines',
  interfaceName: 'DisciplinesBlock',
  labels: {
    singular: 'Disciplines',
    plural: 'Disciplines',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: {
              equals: 'image/svg+xml',
            },
          },
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
