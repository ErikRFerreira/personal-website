import type { Field, TextFieldSingleValidation, UploadFieldSingleValidation } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

const validateHTTPSVideoURL = (value?: null | string): string | true => {
  if (!value) return true

  try {
    return new URL(value).protocol === 'https:' ? true : 'Video URL must use HTTPS'
  } catch {
    return 'Video URL must be an absolute HTTPS URL'
  }
}

const validateVideoURL: TextFieldSingleValidation = (value) => validateHTTPSVideoURL(value)

const validateRightVideoURL: TextFieldSingleValidation = (value, { siblingData }) => {
  const urlValidation = validateHTTPSVideoURL(value)

  if (urlValidation !== true) return urlValidation

  if (value && !(siblingData as { rightMedia?: unknown })?.rightMedia) {
    return 'Select right media to use as the video fallback'
  }

  return true
}

const validateRightMedia: UploadFieldSingleValidation = (value, { siblingData }) => {
  if ((siblingData as { rightVideoUrl?: unknown })?.rightVideoUrl && !value) {
    return 'Select right media to use as the video fallback'
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
      name: 'rightEyebrow',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
      },
      defaultValue: 'Software Engineer',
      label: 'Right eyebrow',
    },
    {
      name: 'rightHeadline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
      },
      defaultValue: 'Engineering Scale.',
      label: 'Right headline',
    },
    {
      name: 'rightDescription',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
      },
      label: 'Right description',
    },
    {
      name: 'positioningLine',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
      },
      defaultValue:
        'Software engineering and visual storytelling shaped by depth, precision, and perspective.',
      label: 'Positioning line',
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
        description:
          'For Portfolio Hero CDN videos, select an image to use as the poster and fallback.',
      },
      relationTo: 'media',
      required: false,
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
        description: 'Optional public HTTPS URL for a CDN-hosted MP4 or WebM video.',
      },
      label: 'Video URL',
      validate: validateVideoURL,
    },
    {
      name: 'rightMedia',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
        description:
          'Select an image to use as the poster and fallback for a right-panel CDN video.',
      },
      label: 'Right media',
      relationTo: 'media',
      validate: validateRightMedia,
    },
    {
      name: 'rightVideoUrl',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'portfolioHero',
        description: 'Optional public HTTPS URL for a CDN-hosted MP4 or WebM video.',
      },
      label: 'Right video URL',
      validate: validateRightVideoURL,
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
