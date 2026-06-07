import type { Block } from 'payload'

import { link } from '@/fields/link'

export const InitiateProject: Block = {
  slug: 'initiateProject',
  interfaceName: 'InitiateProjectBlock',
  labels: {
    singular: 'Initiate Project',
    plural: 'Initiate Project Blocks',
  },
  fields: [
    {
      name: 'eyebrowText',
      type: 'text',
      defaultValue: '@',
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Initiate Project.',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        "Available for technical leadership roles and specialized visual commissions. Let's discuss architecture and aesthetics.",
      required: true,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Get in touch',
      required: true,
    },
    link({
      appearances: ['default'],
      disableLabel: true,
      overrides: {
        name: 'ctaLink',
        label: 'CTA link',
      },
    }),
    {
      name: 'partnershipNote',
      type: 'text',
      defaultValue: 'ACCEPTING SELECT PARTNERSHIPS FOR 2024',
    },
  ],
}
