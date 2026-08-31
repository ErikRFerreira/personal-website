import type { Block } from 'payload'

export const HomeBio: Block = {
  slug: 'homeBio',
  interfaceName: 'HomeBioBlock',
  labels: {
    singular: 'Home Bio',
    plural: 'Home Bio Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'The Architect & The Explorer',
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      defaultValue: 'Erik Ferreira',
    },
    {
      name: 'roles',
      type: 'text',
      label: 'Roles',
      required: true,
      defaultValue: 'Software Engineer · Scuba Instructor · Underwater Photographer',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      required: true,
      admin: {
        description: 'Keep this concise — ideally 2–3 sentences.',
      },
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      label: 'Portrait',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          defaultValue: 'Get in touch',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          defaultValue: '/contact',
        },
      ],
    },
  ],
}
