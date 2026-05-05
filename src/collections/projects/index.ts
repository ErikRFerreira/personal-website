import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
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
      name: 'role',
      type: 'text',
    },
    {
      name: 'tech',
      type: 'array',
      label: 'Tech Stack',
      fields: [
        {
          name: 'techName',
          type: 'text',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'A URL-friendly identifier for the project (e.g., "my-awesome-project")',
      },
    },
  ],
}
