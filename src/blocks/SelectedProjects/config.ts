import { Block } from 'payload'

export const SelectedProjects: Block = {
  slug: 'selectedProjects',
  interfaceName: 'SelectedProjectsBlock',
  labels: {
    singular: 'Selected Projects',
    plural: 'Selected Projects',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: '01 — Code',
    },
    {
      name: 'label',
      type: 'text',
      defaultValue: 'Selected Works',
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      required: true,
      admin: {
        description: 'Choose which projects should appear in this block.',
      },
    },
  ],
}
