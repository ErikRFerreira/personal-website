import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { defaultLexical } from '../../fields/defaultLexical'
import { slugField } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Lens: CollectionConfig = {
  slug: 'lens',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'photo', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Main Image',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'series',
              type: 'relationship',
              relationTo: 'series',
              label: 'Collection',
              admin: {
                description: 'Group this photo in a managed Lens collection',
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Categories',
              admin: {
                description: 'Classify this photo with shared site taxonomy terms',
              },
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Short Intro Text',
              admin: {
                description: 'A brief caption or teaser shown in listings',
              },
            },
            {
              name: 'fullStory',
              type: 'richText',
              label: 'Full Story / Description',
              editor: defaultLexical,
            },
            {
              name: 'location',
              type: 'text',
              label: 'Location',
            },
            {
              name: 'year',
              type: 'number',
              label: 'Year',
              admin: {
                description: 'Year the photo was taken',
              },
            },
            {
              name: 'technicalMetadata',
              type: 'group',
              label: 'Technical Metadata',
              fields: [
                { name: 'camera', type: 'text', label: 'Camera' },
                { name: 'lens', type: 'text', label: 'Lens' },
                { name: 'aperture', type: 'text', label: 'Aperture (e.g. f/2.8)' },
                { name: 'shutterSpeed', type: 'text', label: 'Shutter Speed (e.g. 1/500s)' },
                { name: 'iso', type: 'number', label: 'ISO' },
                { name: 'focalLength', type: 'text', label: 'Focal Length (e.g. 50mm)' },
              ],
            },
            {
              name: 'printOptions',
              type: 'array',
              label: 'Print Options',
              admin: {
                description: 'Available print sizes and pricing',
              },
              fields: [
                { name: 'size', type: 'text', label: 'Size (e.g. 8×10″)', required: true },
                { name: 'material', type: 'text', label: 'Material (e.g. Fine Art Paper)' },
                { name: 'price', type: 'number', label: 'Price (EUR)' },
              ],
            },
            {
              name: 'licensingText',
              type: 'textarea',
              label: 'Licensing / Usage Text',
              admin: {
                description: 'Usage rights, licensing terms, or copyright notice',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'archiveFormat',
      type: 'select',
      label: 'Archive Format',
      options: [
        { label: 'Auto (from image)', value: 'auto' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'Landscape', value: 'landscape' },
        { label: 'Square', value: 'square' },
        { label: 'Panorama', value: 'panorama' },
      ],
      defaultValue: 'auto',
      required: true,
      admin: {
        description:
          'Override the archive crop and frame shape, or use the uploaded image dimensions.',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Published Status',
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
  ],
}
