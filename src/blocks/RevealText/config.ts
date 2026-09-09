import type { Block } from 'payload'

export const RevealText: Block = {
  slug: 'revealText',
  interfaceName: 'RevealTextBlock',
  labels: {
    singular: 'Reveal Text',
    plural: 'Reveal Text',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'supportingText',
      type: 'text',
      defaultValue: 'Different tools. Same instinct for perspective.',
      required: true,
    },
  ],
}
