import { describe, expect, it } from 'vitest'

import { home } from '@/endpoints/seed/home'
import type { Media } from '@/payload-types'

describe('home page seed', () => {
  it('uses Profile Hero with the shared profile content', () => {
    const heroImage = { id: 10 } as Media
    const page = home({ heroImage, metaImage: { id: 20 } as Media })

    expect(page.hero).toEqual({
      type: 'profileHero',
      name: 'Erik Ferreira',
      intro:
        'Developer, diver, and photographer building digital products and documenting life underwater.',
      media: 10,
      enableImageStack: true,
      stackPrimaryLabel: '01 / DIVER',
      stackSecondaryLabel: '02 / DEVELOPER',
    })
  })
})
