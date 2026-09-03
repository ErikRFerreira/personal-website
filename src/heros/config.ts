import type {
  Field,
  TextareaFieldValidation,
  TextFieldSingleValidation,
  UploadFieldSingleValidation,
} from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

const requiredForProfileHero =
  (label: string): TextFieldSingleValidation =>
  (value, { siblingData }) => {
    if ((siblingData as { type?: string })?.type === 'profileHero' && !value?.trim()) {
      return `${label} is required for Profile Hero`
    }

    return true
  }

const profileIntroRequired: TextareaFieldValidation = (value, { siblingData }) => {
  if ((siblingData as { type?: string })?.type === 'profileHero' && !value?.trim()) {
    return 'Introduction is required for Profile Hero'
  }

  return true
}

const profileImageRequired: UploadFieldSingleValidation = (value, { siblingData }) => {
  if ((siblingData as { type?: string })?.type === 'profileHero' && !value) {
    return 'Image is required for Profile Hero'
  }

  return true
}

const requiredForProfileImageStack =
  (label: string): TextFieldSingleValidation =>
  (value, { siblingData }) => {
    const data = siblingData as { enableImageStack?: boolean; type?: string }

    if (data?.type === 'profileHero' && data.enableImageStack && !value?.trim()) {
      return `${label} is required when the image stack is enabled`
    }

    return true
  }

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
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
        { label: 'Profile Hero', value: 'profileHero' },
      ],
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'profileHero',
      },
      label: 'Name',
      validate: requiredForProfileHero('Name'),
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'profileHero',
      },
      label: 'Introduction',
      validate: profileIntroRequired,
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'profileHero'].includes(type),
        description:
          'Main hero image. When the Profile Hero image stack is enabled, this is the Diver card.',
      },
      label: 'Primary hero image',
      relationTo: 'media',
      validate: profileImageRequired,
    },
    {
      name: 'imageLabel',
      type: 'text',
      admin: {
        condition: (_, { enableImageStack, type } = {}) =>
          type === 'profileHero' && !enableImageStack,
      },
      label: 'Image label',
    },
    {
      name: 'enableImageStack',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'profileHero',
        description: 'Show the interactive Diver / Developer image stack.',
      },
      defaultValue: false,
      label: 'Enable image stack',
    },
    {
      name: 'stackPrimaryLabel',
      type: 'text',
      admin: {
        condition: (_, { enableImageStack, type } = {}) =>
          type === 'profileHero' && Boolean(enableImageStack),
      },
      defaultValue: '01 / DIVER',
      label: 'Primary image label',
      validate: requiredForProfileImageStack('Primary image label'),
    },
    {
      name: 'secondaryMedia',
      type: 'upload',
      admin: {
        condition: (_, { enableImageStack, type } = {}) =>
          type === 'profileHero' && Boolean(enableImageStack),
        description: 'Uses the built-in developer artwork when left empty.',
      },
      label: 'Developer image',
      relationTo: 'media',
    },
    {
      name: 'stackSecondaryLabel',
      type: 'text',
      admin: {
        condition: (_, { enableImageStack, type } = {}) =>
          type === 'profileHero' && Boolean(enableImageStack),
      },
      defaultValue: '02 / DEVELOPER',
      label: 'Secondary image label',
      validate: requiredForProfileImageStack('Secondary image label'),
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        condition: (_, { type } = {}) => type !== 'profileHero',
      },
      label: false,
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { type } = {}) => type !== 'profileHero',
          initCollapsed: true,
        },
        maxRows: 2,
      },
    }),
  ],
  label: false,
}
