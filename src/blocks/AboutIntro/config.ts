import type { Block } from 'payload'

import { link } from '@/fields/link'

export const AboutIntro: Block = {
  slug: 'aboutIntro',
  interfaceName: 'AboutIntroBlock',
  labels: {
    singular: 'About Intro',
    plural: 'About Intros',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'The Intersection of Logic & Art',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio (first paragraph)',
    },
    {
      name: 'bioSecondParagraph',
      type: 'textarea',
      label: 'Bio (second paragraph)',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    link({
      appearances: false,
      overrides: {
        name: 'bioPageLink',
        label: 'Read Full Bio Link',
      },
    }),
    {
      name: 'ctaHeading',
      type: 'text',
      required: true,
      defaultValue: "Let's build something.",
    },
    {
      name: 'ctaDescription',
      type: 'text',
      defaultValue:
        'Currently open for new senior development roles and select freelance engineering projects.',
    },
    link({
      appearances: false,
      overrides: {
        name: 'ctaLink',
        label: 'CTA Link',
      },
    }),
  ],
}
