import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'default',
      label: 'Layout',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Contact', value: 'contact' },
      ],
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
      admin: {
        condition: (_, { layout }) => layout !== 'contact',
      },
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro, layout }) => Boolean(enableIntro) && layout !== 'contact',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    // ── Contact layout fields ────────────────────────────────────────────────
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      admin: {
        condition: (_, { layout }) => layout === 'contact',
        description: 'Small label above the heading (e.g. "Contact")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        condition: (_, { layout }) => layout === 'contact',
      },
    },
    {
      name: 'introText',
      type: 'textarea',
      label: 'Intro Text',
      admin: {
        condition: (_, { layout }) => layout === 'contact',
        description: 'Short paragraph below the heading',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
      admin: {
        condition: (_, { layout }) => layout === 'contact',
        description: "Overrides the form's own submit button label",
      },
    },
    {
      name: 'quickAccessCard',
      type: 'group',
      label: 'Quick Access Card',
      admin: {
        condition: (_, { layout }) => layout === 'contact',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'jobTitle',
          type: 'text',
          label: 'Job Title',
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Avatar',
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Interest Tags',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'responseTime',
          type: 'text',
          label: 'Response Time Note',
          admin: {
            description: 'e.g. "Response typically within 24 hours."',
          },
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
