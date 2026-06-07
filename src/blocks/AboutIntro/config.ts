import type { Block } from 'payload'

export const AboutIntro: Block = {
  slug: 'aboutIntro',
  interfaceName: 'AboutIntroBlock',
  labels: {
    singular: 'About Intro',
    plural: 'About Intros',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'THE ARCHITECT & THE EXPLORER',
    },
    {
      name: 'headlineLineOne',
      type: 'text',
      label: 'Headline — Line 1',
      required: true,
      defaultValue: 'Precision in code.',
    },
    {
      name: 'headlineLineTwo',
      type: 'text',
      label: 'Headline — Line 2',
      defaultValue: 'Calm in the deep.',
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
    {
      name: 'portrait',
      type: 'upload',
      label: 'Portrait',
      relationTo: 'media',
    },
  ],
}
