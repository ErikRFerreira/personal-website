import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const animationState = vi.hoisted(() => ({
  fromTo: vi.fn(),
  to: vi.fn(),
}))

vi.mock('gsap', () => ({
  gsap: {
    fromTo: animationState.fromTo,
    to: animationState.to,
  },
}))

vi.mock('ogl', () => {
  class Renderer {
    gl: Record<string, unknown>

    constructor() {
      const canvas = document.createElement('canvas')
      this.gl = {
        canvas,
        clearColor: vi.fn(),
        deleteProgram: vi.fn(),
        deleteTexture: vi.fn(),
        getExtension: vi.fn(() => null),
      }
    }

    render() {}

    setSize(width: number, height: number) {
      const canvas = this.gl.canvas as HTMLCanvasElement
      canvas.width = width
      canvas.height = height
    }
  }

  class Program {
    program = {}
    uniforms: Record<string, { value: unknown }>

    constructor(_gl: unknown, options: { uniforms: Record<string, { value: unknown }> }) {
      this.uniforms = options.uniforms
    }
  }

  class Texture {
    image?: unknown
    texture = {}
  }

  return {
    Mesh: class {},
    Program,
    Renderer,
    Texture,
    Triangle: class {},
  }
})

import MorphSlider from '@/components/MorphSlider'

const items = [
  { alt: 'Erik diving underwater', caption: '01 / DIVER', image: '/diver.jpg' },
  { alt: 'Erik writing software', caption: '02 / DEVELOPER', image: '/developer.jpg' },
]

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      disconnect() {}
      observe() {}
    },
  )
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 1),
  )
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    })),
  )

  animationState.fromTo.mockImplementation(
    (target: { value: number }, _from: unknown, options: { onComplete?: () => void }) => {
      target.value = 1
      options.onComplete?.()
      return { kill: vi.fn() }
    },
  )
  animationState.to.mockImplementation(
    (target: { value: number }, options: { onComplete?: () => void; value: number }) => {
      target.value = options.value
      options.onComplete?.()
      return { kill: vi.fn() }
    },
  )
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe('MorphSlider', () => {
  it('supports arrow and keyboard navigation while updating captions and announcements', () => {
    render(<MorphSlider items={items} showIndicators={false} />)

    expect(screen.getByText('01 / DIVER').className).toContain('is-active')
    expect(screen.getByText('Slide 1 of 2: 01 / DIVER: Erik diving underwater')).not.toBeNull()
    expect(screen.queryByRole('tablist')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))

    expect(screen.getByText('02 / DEVELOPER').className).toContain('is-active')
    expect(screen.getByText('Slide 2 of 2: 02 / DEVELOPER: Erik writing software')).not.toBeNull()

    fireEvent.keyDown(screen.getByRole('group', { name: 'Image morph slider' }), {
      key: 'ArrowLeft',
    })

    expect(screen.getByText('01 / DIVER').className).toContain('is-active')
  })

  it('shortens transitions when reduced motion is requested', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: true,
        removeEventListener: vi.fn(),
      })),
    )

    render(<MorphSlider duration={1.1} items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))

    expect(animationState.fromTo).toHaveBeenCalledWith(
      expect.anything(),
      { value: 0 },
      expect.objectContaining({ duration: 0.4 }),
    )
  })
})
