import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFile } from 'node:fs/promises'

import { FormBlock, type FormBlockType } from '@/blocks/Form/Component'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/components/RevealOnScroll', () => ({
  RevealOnScroll: ({
    children,
    className,
    revealName,
  }: {
    children: ReactNode
    className?: string
    revealName?: string
  }) => (
    <div className={className} data-reveal-name={revealName}>
      {children}
    </div>
  ),
}))

vi.mock('@/components/Media', () => ({
  Media: () => <div data-testid="contact-avatar" />,
}))

vi.mock('@/components/RichText', () => ({
  default: () => <div data-testid="rich-text" />,
}))

vi.mock('ogl', () => ({
  Color: class {},
  Mesh: class {},
  Program: class {},
  Renderer: class {
    constructor() {
      throw new Error('WebGL is unavailable in jsdom')
    }
  },
  Triangle: class {},
}))

afterEach(cleanup)

const contactForm = {
  confirmationMessage: {
    root: {
      children: [],
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  confirmationType: 'message',
  fields: [
    {
      blockType: 'text',
      label: 'Full Name',
      name: 'fullname',
      required: true,
      width: 50,
    },
    {
      blockType: 'email',
      label: 'Email Address',
      name: 'email',
      required: true,
      width: 50,
    },
    {
      blockType: 'textarea',
      label: 'Your Message',
      name: 'message',
      width: 100,
    },
  ],
  id: 'contact-form',
  submitButtonLabel: 'Send Message',
  title: 'Contact Form',
} as unknown as FormBlockType['form']

const renderContact = () =>
  render(
    <FormBlock
      ctaLabel="Send Message"
      enableIntro={false}
      eyebrow="Contact"
      form={contactForm}
      heading="Start the conversation"
      introText="Discuss a project, a photograph, or a dive."
      layout="contact"
      quickAccessCard={{
        avatar: null,
        email: 'erik.rocha.ferreira@gmail.com',
        jobTitle: 'Diver',
        location: 'Panglao, Philippines',
        name: 'Erik Ferreira',
        responseTime: 'Usually replies within a day.',
        tags: [{ id: 'web', label: 'Web' }],
      }}
    />,
  )

describe('contact form layout', () => {
  it('uses the compact shared composition while preserving the underline form', async () => {
    const { container, getByLabelText, getByRole, getByText } = renderContact()

    expect(container.querySelector('section')?.classList.contains('site-section-compact')).toBe(true)
    expect(container.querySelector('.site-container')?.classList.contains('pb-24')).toBe(false)
    expect(getByText('Contact').classList.contains('site-section-label')).toBe(true)
    expect(container.querySelector('.contact-form')).not.toBeNull()

    const nameField = getByLabelText(/Full Name/) as HTMLInputElement
    expect(nameField.name).toBe('fullname')
    expect(nameField.closest('.form-field')?.getAttribute('style')).toContain(
      '--form-field-width: 50%',
    )

    const submit = getByRole('button', { name: 'Send Message' })
    expect(submit.classList.contains('specular-button')).toBe(true)
    expect(submit.classList.contains('specular-button--md')).toBe(true)
    expect(submit.getAttribute('type')).toBe('submit')

    const css = await readFile('src/blocks/Form/Form.css', 'utf8')
    expect(css).toContain('font-size: 0.75rem')
    expect(css).toContain('border-bottom: 1px solid var(--site-border-control)')
  })

  it('keeps useful profile details without decorative tags or spotlight behavior', () => {
    const { container, getByRole, getByText, queryByText } = renderContact()

    const card = getByRole('complementary', { name: 'Contact details' })
    expect(card.hasAttribute('data-contact-card')).toBe(true)
    expect(card.classList.contains('card-spotlight')).toBe(false)
    expect(getByText('Erik Ferreira')).not.toBeNull()
    expect(getByText('Diver')).not.toBeNull()
    expect(getByText('Panglao, Philippines')).not.toBeNull()
    expect(getByText('Usually replies within a day.')).not.toBeNull()
    expect(
      getByRole('link', { name: 'erik.rocha.ferreira@gmail.com' }).getAttribute('href'),
    ).toBe('mailto:erik.rocha.ferreira@gmail.com')
    expect(queryByText('Web')).toBeNull()
    expect(container.querySelector('.animate-ping')).toBeNull()
  })
})
