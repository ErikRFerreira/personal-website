import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req: { user } }) => {
      if (user) return true

      return {
        status: {
          equals: 'published',
        },
      }
    },
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'type', 'year', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: '',
      admin: {
        description: 'A URL-friendly identifier for the project (e.g., "my-awesome-project")',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'role',
              type: 'text',
            },
            {
              name: 'tech',
              type: 'array',
              label: 'Tech Stack',
              fields: [
                {
                  name: 'techName',
                  type: 'text',
                },
              ],
            },
            {
              name: 'links',
              type: 'array',
              label: 'Links',
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
              name: 'metrics',
              type: 'array',
              label: 'Metrics',
              maxRows: 2,
              admin: {
                description:
                  'Up to 2 stat boxes shown on the project row (e.g., "STRATEGIC OUTCOME" / "+40% Conversion").',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Stat category label (e.g., "STRATEGIC OUTCOME")',
                  },
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Stat value (e.g., "+40% Conversion")',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'image',
              type: 'upload',
              label: 'Featured Image',
              relationTo: 'media',
            },
            {
              name: 'showcaseTitle',
              type: 'text',
              label: 'Showcase Title',
              admin: {
                description: 'Heading shown above the showcase image (e.g., "MOD Calc").',
              },
            },
            {
              name: 'showcaseSubtitle',
              type: 'text',
              label: 'Showcase Subtitle',
              admin: {
                description:
                  'Small caption under the showcase title (e.g., "Maximum Operating Depth").',
              },
            },
            {
              name: 'showcaseImage',
              type: 'upload',
              label: 'Showcase Image',
              relationTo: 'media',
              admin: {
                description: 'Main image shown in the showcase section.',
              },
            },
            {
              name: 'showcaseCaption',
              type: 'text',
              label: 'Showcase Caption',
              admin: {
                description: 'Optional small caption shown under the showcase image.',
              },
            },
          ],
        },
        {
          label: 'Gallery',
          fields: [
            { name: 'gallerySubtitle', type: 'text', label: 'Gallery Subtitle' },
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Screen', plural: 'Screens' },
              admin: {
                description:
                  'Drag screens to reorder them. Consecutive half-width screens share a row on desktop.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  filterOptions: { mimeType: { contains: 'image/' } },
                },
                { name: 'title', type: 'text', required: true },
                {
                  name: 'description',
                  type: 'richText',
                  required: true,
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => [
                      ...rootFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h4'] }),
                      OrderedListFeature(),
                      UnorderedListFeature(),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ],
                  }),
                },
                {
                  name: 'layout',
                  type: 'select',
                  required: true,
                  defaultValue: 'full',
                  options: [
                    { label: 'Full width', value: 'full' },
                    { label: 'Half width', value: 'half' },
                    { label: 'Image beside text', value: 'split' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: false,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Web App', value: 'web-app' },
        { label: 'Mobile App', value: 'mobile-app' },
        { label: 'Open Source', value: 'open-source' },
        { label: 'Design', value: 'design' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'year',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'The year the project was completed or started.',
      },
    },
  ],
}
