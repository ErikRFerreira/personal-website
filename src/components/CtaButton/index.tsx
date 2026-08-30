'use client'

import { getCMSLinkHref, type CMSLinkType } from '@/components/Link'
import SpecularButton, { type ButtonSize } from '@/components/SpecularButton'
import type { MouseEventHandler, ReactNode } from 'react'

type CtaButtonLinkProps = Omit<CMSLinkType, 'size'> & {
  size?: ButtonSize
}

type CtaButtonActionProps = {
  children?: ReactNode
  className?: string
  disabled?: boolean
  form?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  size?: ButtonSize
  type: 'button' | 'submit' | 'reset'
}

export type CtaButtonProps = CtaButtonLinkProps | CtaButtonActionProps

const CTA_APPEARANCE = {
  radius: 18,
  tint: '#121212',
  tintOpacity: 0.78,
  hoverTint: '#11d9e8',
  hoverTintOpacity: 0.12,
  borderColor: 'rgb(255 255 255 / 18%)',
  blur: 0,
  textColor: '#f2f2ef',
  focusColor: '#11d9e8',
  lineColor: '#11d9e8',
  baseColor: '#666666',
  intensity: 1,
  shineSize: 10,
  shineFade: 40,
  thickness: 1,
  speed: 0.35,
  followMouse: true,
  proximity: 250,
  autoAnimate: false,
} as const

const isActionButton = (props: CtaButtonProps): props is CtaButtonActionProps =>
  props.type === 'button' || props.type === 'submit' || props.type === 'reset'

export function CtaButton(props: CtaButtonProps) {
  if (isActionButton(props)) {
    const { children, className, disabled, form, onClick, size = 'lg', type } = props

    return (
      <SpecularButton
        {...CTA_APPEARANCE}
        className={className}
        disabled={disabled}
        form={form}
        onClick={onClick}
        size={size}
        type={type}
      >
        {children}
      </SpecularButton>
    )
  }

  const { children, className, label, newTab, size = 'lg', ...link } = props
  const href = getCMSLinkHref(link)

  if (!href) return null

  return (
    <SpecularButton
      {...CTA_APPEARANCE}
      href={href}
      className={className}
      rel={newTab ? 'noopener noreferrer' : undefined}
      target={newTab ? '_blank' : undefined}
      size={size}
    >
      {label}
      {children}
    </SpecularButton>
  )
}

export default CtaButton
