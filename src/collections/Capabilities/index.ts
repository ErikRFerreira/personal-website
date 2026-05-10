import type { CollectionConfig } from 'payload'

export const Capabilities: CollectionConfig<'capabilities'> = {
  slug: 'capabilities',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: {
          equals: 'image/svg+xml',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: '',
      admin: {
        description: 'A URL-friendly identifier for the capability (e.g., "web-development")',
      },
    },
  ],
}
