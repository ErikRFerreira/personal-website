import type { Block } from 'payload'

export const ProjectPrinciples: Block = {
  slug: 'projectPrinciples',
  interfaceName: 'ProjectPrinciplesBlock',
  labels: {
    singular: 'Project Principles',
    plural: 'Project Principles',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
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
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      required: true,
      admin: {
        description: 'Three concise principles are recommended.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
        },
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
      ],
    },
  ],
}
