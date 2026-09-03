import { describe, expect, it } from 'vitest'

import { about } from '@/endpoints/seed/about'

describe('about page seed', () => {
  it('creates the published About page with the intended block order and media', () => {
    const page = about({
      heroImage: { id: 10 },
      timelineImages: [{ id: 20 }, { id: 21 }, { id: 22 }],
    })

    expect(page.slug).toBe('about')
    expect(page._status).toBe('published')
    expect(page.hero).toEqual({
      type: 'aboutHero',
      name: 'ABOUT ME',
      intro:
        'Developer, diver and photographer working across software, underwater environments and visual documentation.',
      media: 10,
      imageLabel: 'PROFILE / 01',
    })
    expect(page.layout.map(({ blockType }) => blockType)).toEqual([
      'aboutStory',
      'capabilities',
      'aboutProtocol',
      'aboutTimeline',
      'cta',
    ])

    const timeline = page.layout[3]
    const cta = page.layout[4]

    expect(timeline).toMatchObject({
      blockType: 'aboutTimeline',
      milestones: [{ image: 20 }, { image: 21 }, { image: 22 }],
    })
    expect(cta).toMatchObject({
      blockType: 'cta',
      links: [{ link: { label: 'Initiate contact', url: '/contact' } }],
    })
  })
})
