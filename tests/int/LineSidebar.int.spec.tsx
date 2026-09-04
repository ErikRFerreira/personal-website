import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import LineSidebar from '@/components/LineSidebar'

describe('LineSidebar', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders accessible buttons and supports uncontrolled selection', () => {
    const onItemClick = vi.fn()

    render(
      <LineSidebar
        ariaLabel="Timeline navigation"
        controlsId="timeline-panel"
        defaultActive={0}
        getItemId={(index) => `timeline-item-${index}`}
        indexLabels={['2020', '2024']}
        items={['Started', 'Shipped']}
        onItemClick={onItemClick}
      />,
    )

    const navigation = screen.getByRole('navigation', { name: 'Timeline navigation' })
    const buttons = within(navigation).getAllByRole('button')

    expect(buttons[0].id).toBe('timeline-item-0')
    expect(buttons[0].getAttribute('aria-controls')).toBe('timeline-panel')
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true')
    expect(buttons[0].textContent).toContain('2020')

    fireEvent.click(buttons[1])

    expect(onItemClick).toHaveBeenCalledWith(1, 'Shipped')
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true')
    expect(buttons[1].tabIndex).toBe(0)
  })

  it('keeps controlled selection external and renders custom item content', () => {
    const onItemClick = vi.fn()
    const { rerender } = render(
      <LineSidebar
        activeIndex={1}
        items={['Started', 'Shipped']}
        onItemClick={onItemClick}
        renderItem={(label) => <strong>{label}</strong>}
      />,
    )

    let buttons = screen.getAllByRole('button')
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true')
    expect(buttons[1].querySelector('strong')?.textContent).toBe('Shipped')

    fireEvent.click(buttons[0])
    expect(onItemClick).toHaveBeenCalledWith(0, 'Started')
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true')

    rerender(
      <LineSidebar
        activeIndex={0}
        items={['Started', 'Shipped']}
        onItemClick={onItemClick}
        renderItem={(label) => <strong>{label}</strong>}
      />,
    )

    buttons = screen.getAllByRole('button')
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true')
  })
})
