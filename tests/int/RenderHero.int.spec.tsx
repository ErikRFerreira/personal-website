import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/heros/HighImpact', () => ({ HighImpactHero: () => <div>High Impact</div> }))
vi.mock('@/heros/LowImpact', () => ({ LowImpactHero: () => <div>Low Impact</div> }))
vi.mock('@/heros/MediumImpact', () => ({ MediumImpactHero: () => <div>Medium Impact</div> }))
vi.mock('@/heros/ProfileHero', () => ({
  ProfileHero: ({ name }: { name?: string | null }) => <div>Profile: {name}</div>,
}))

import { RenderHero } from '@/heros/RenderHero'

describe('RenderHero', () => {
  it('selects Profile Hero', () => {
    render(
      <RenderHero
        type="profileHero"
        intro="Developer and diver"
        media={10}
        name="Erik Ferreira"
      />,
    )

    expect(screen.getByText('Profile: Erik Ferreira')).not.toBeNull()
  })
})
