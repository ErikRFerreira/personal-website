import type { AboutStoryBlock, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type AboutArgs = {
  heroImage: Pick<Media, 'id'>
  timelineImages: [Pick<Media, 'id'>, Pick<Media, 'id'>, Pick<Media, 'id'>]
}

const paragraph = (text: string): AboutStoryBlock['body'] => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

export const about = ({
  heroImage,
  timelineImages,
}: AboutArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'about',
  _status: 'published',
  title: 'About',
  hero: {
    type: 'profileHero',
    name: 'Erik Ferreira',
    intro: 'Developer, diver, and photographer building digital products and documenting life underwater.',
    media: heroImage.id,
    imageLabel: 'Profile image',
  },
  layout: [
    {
      blockType: 'aboutStory',
      eyebrow: 'Background',
      heading: 'The Calculated Descent',
      body: paragraph(
        'A starter introduction connecting thoughtful software engineering, diving, and underwater photography. Replace this copy with the final approved story in Payload.',
      ),
    },
    {
      blockType: 'capabilities',
      eyebrow: 'Operating system',
      items: [
        {
          title: 'Digital Products',
          description: 'Architecting resilient front-end ecosystems and scalable applications.',
          icon: heroImage.id,
          tags: [{ tag: 'React' }, { tag: 'Next.js' }, { tag: 'Payload' }],
        },
        {
          title: 'Diving',
          description: 'Exploration and instruction grounded in technical practice and safety.',
          icon: heroImage.id,
          tags: [{ tag: 'Technical' }, { tag: 'Instruction' }],
        },
        {
          title: 'Photography',
          description: 'Documenting remote environments above and below the surface.',
          icon: heroImage.id,
          tags: [{ tag: 'Underwater' }, { tag: 'Travel' }],
        },
      ],
    },
    {
      blockType: 'aboutProtocol',
      eyebrow: 'Principles',
      heading: 'The Protocol',
      principles: [
        { text: 'Build things that actually get used.', quote: 'Utility is the first measure.' },
        { text: 'Understand the system, not just the interface.', quote: 'Context shapes every decision.' },
        { text: 'Know when convention can be challenged.', quote: 'Follow protocol when protocol matters.' },
      ],
    },
    {
      blockType: 'aboutTimeline',
      eyebrow: 'Logbook / chronology',
      milestones: [
        {
          year: '2018',
          title: 'First descent',
          description: 'A representative starting point for the editable About timeline.',
          image: timelineImages[0].id,
          metadata: [{ label: 'Focus', value: 'Foundations' }],
        },
        {
          year: '2022',
          title: 'Systems and exploration',
          description: 'Digital product work and underwater practice began informing one another.',
          image: timelineImages[1].id,
          metadata: [{ label: 'Primary interest', value: 'Technical craft' }],
        },
        {
          year: 'Now',
          title: 'Current chapter',
          description: 'Building reliable products and documenting environments with intention.',
          image: timelineImages[2].id,
          metadata: [{ label: 'Status', value: 'Active' }],
        },
      ],
    },
    {
      blockType: 'cta',
      richText: paragraph('Have something interesting in mind?'),
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Initiate contact',
            url: '/contact',
          },
        },
      ],
    },
  ],
  meta: {
    title: 'About | Erik Ferreira',
    description: 'About Erik Ferreira: developer, diver, and photographer.',
  },
})
