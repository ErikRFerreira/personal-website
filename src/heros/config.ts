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

const requiredForProfileHero = (label: string): TextFieldSingleValidation =>
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
      name: 'imageLabel',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'profileHero',
      },
      label: 'Image label',
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
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'profileHero'].includes(type),
      },
      relationTo: 'media',
      validate: profileImageRequired,
    },
  ],
  label: false,
}
