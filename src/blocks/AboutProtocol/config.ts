import type { Block } from 'payload'

export const AboutProtocol: Block = {
  slug: 'aboutProtocol',
  interfaceName: 'AboutProtocolBlock',
  labels: { singular: 'About Protocol', plural: 'About Protocols' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'principles',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'quote', type: 'textarea', required: true },
      ],
    },
  ],
}
