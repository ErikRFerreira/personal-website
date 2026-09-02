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
    expect(page.hero).toEqual({ type: 'none' })
    expect(page.layout.map(({ blockType }) => blockType)).toEqual([
      'aboutHero',
      'aboutStory',
      'aboutDisciplines',
      'aboutProtocol',
      'aboutTimeline',
      'cta',
    ])

    const hero = page.layout[0]
    const timeline = page.layout[4]
    const cta = page.layout[5]

    expect(hero).toMatchObject({ blockType: 'aboutHero', image: 10 })
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
