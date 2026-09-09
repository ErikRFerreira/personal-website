import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/heros/HighImpact', () => ({ HighImpactHero: () => <div>High Impact</div> }))
vi.mock('@/heros/LowImpact', () => ({ LowImpactHero: () => <div>Low Impact</div> }))
vi.mock('@/heros/MediumImpact', () => ({ MediumImpactHero: () => <div>Medium Impact</div> }))
vi.mock('@/heros/ProfileHero', () => ({
  ProfileHero: ({ name }: { name?: string | null }) => <div>Profile: {name}</div>,
}))
vi.mock('@/heros/AboutHero', () => ({
  AboutHero: ({ name }: { name?: string | null }) => <div>About: {name}</div>,
}))

import { RenderHero } from '@/heros/RenderHero'

afterEach(cleanup)

describe('RenderHero', () => {
  it('selects Profile Hero', () => {
    render(
      <RenderHero type="profileHero" intro="Developer and diver" media={10} name="Erik Ferreira" />,
    )

    expect(screen.getByText('Profile: Erik Ferreira')).not.toBeNull()
  })

  it('selects About Hero', () => {
    render(
      <RenderHero
        type="aboutHero"
        intro="Developer, diver and photographer"
        media={10}
        name="ABOUT ME"
      />,
    )

    expect(screen.getByText('About: ABOUT ME')).not.toBeNull()
    expect(screen.queryByText(/Profile:/)).toBeNull()
  })
})
