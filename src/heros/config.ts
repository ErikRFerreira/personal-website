import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Portfolio Hero',
          value: 'portfolioHero',
        },
      ],
      required: true,
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
      },
      label: 'Eyebrow',
    },
    {
      name: 'headline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
      },
      label: 'Headline',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
      },
      label: 'Description',
    },
    {
      name: 'richText',
      type: 'richText',
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
      // Only show the rich text editor for non-portfolio hero types
      admin: {
        condition: (_, { type } = {}) => type !== 'portfolioHero',
      },
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'portfolioHero'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'scrollLabel',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
      },
      label: 'Scroll label',
    },
  ],
  label: false,
}
