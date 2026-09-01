import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Series: CollectionConfig = {
  slug: 'series',
  labels: {
    singular: 'Lens Collection',
    plural: 'Lens Collections',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'updatedAt'],
    group: 'Photography',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'A brief description of the series or collection',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      admin: {
        description: 'An optional image representing the series or collection',
      },
    },
    slugField({ fieldToUse: 'name' }),
  ],
}
