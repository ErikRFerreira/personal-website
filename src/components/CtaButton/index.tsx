'use client'

import { getCMSLinkHref, type CMSLinkType } from '@/components/Link'
import SpecularButton, { type ButtonSize } from '@/components/SpecularButton'

export type CtaButtonProps = Omit<CMSLinkType, 'size'> & {
  size?: ButtonSize
}

export function CtaButton({
  children,
  className,
  label,
  newTab,
  size = 'lg',
  ...link
}: CtaButtonProps) {
  const href = getCMSLinkHref(link)

  if (!href) return null

  return (
    <SpecularButton
      href={href}
      className={className}
      rel={newTab ? 'noopener noreferrer' : undefined}
      target={newTab ? '_blank' : undefined}
      size={size}
      radius={18}
      tint="#121212"
      tintOpacity={0.78}
      hoverTint="#11d9e8"
      hoverTintOpacity={0.12}
      borderColor="rgb(255 255 255 / 18%)"
      blur={0}
      textColor="#f2f2ef"
      focusColor="#11d9e8"
      lineColor="#11d9e8"
      baseColor="#666666"
      intensity={1}
      shineSize={10}
      shineFade={40}
      thickness={1}
      speed={0.35}
      followMouse
      proximity={250}
      autoAnimate={false}
    >
      {label}
      {children}
    </SpecularButton>
  )
}

export default CtaButton
