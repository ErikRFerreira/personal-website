import { Block } from 'payload'

export const Capabilities: Block = {
  slug: 'capabilities',
  interfaceName: 'CapabilitiesBlock',
  labels: {
    singular: 'Capabilities',
    plural: 'Capabilities',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: '03 - Capabilities',
    },
    {
      name: 'label',
      type: 'text',
      defaultValue: 'What I Do',
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'From polished interfaces to robust backend systems, I build thoughtful, reliable digital products from end to end.',
    },
    {
      name: 'capabilities',
      type: 'array',
      fields: [
        {
          name: 'name',
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
      ],
    },
  ],
}
