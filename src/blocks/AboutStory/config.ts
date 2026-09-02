import type { Block } from 'payload'

export const AboutStory: Block = {
  slug: 'aboutStory',
  interfaceName: 'AboutStoryBlock',
  labels: {
    singular: 'About Story',
    plural: 'About Stories',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
  ],
}
