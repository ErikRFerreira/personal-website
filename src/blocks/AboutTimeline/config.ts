import type { Block } from 'payload'

export const AboutTimeline: Block = {
  slug: 'aboutTimeline',
  interfaceName: 'AboutTimelineBlock',
  labels: { singular: 'About Timeline', plural: 'About Timelines' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'milestones',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'metadata',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
