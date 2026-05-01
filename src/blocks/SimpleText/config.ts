import type { Block } from 'payload'

export const SimpleText: Block = {
  slug: 'simpleText',
  interfaceName: 'SimpleTextBlock',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
  ],
}
