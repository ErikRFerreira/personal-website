import type { Block } from 'payload'

export const AboutProtocol: Block = {
  slug: 'aboutProtocol',
  interfaceName: 'AboutProtocolBlock',
  labels: { singular: 'About Protocol', plural: 'About Protocols' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    {
      name: 'principles',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Enter the quote without surrounding quotation marks.',
      },
    },
  ],
}
