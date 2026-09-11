'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType } from '@/payload-types'
import { CtaButton } from '@/components/CtaButton'
import { CMSLink, getCMSLinkHref } from '@/components/Link'
import { cn } from '@/utilities/ui'

interface HeaderNavProps {
  className?: string
  ctaClassName?: string
  data: HeaderType
  linkClassName?: string
  onNavigate?: () => void
  renderCtasAsLinks?: boolean
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  className,
  ctaClassName,
  data,
  linkClassName,
  onNavigate,
  renderCtasAsLinks = false,
}) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <nav
      className={cn('flex items-center gap-3 sm:gap-6 lg:gap-10', className)}
      onClick={(event) => {
        if ((event.target as Element).closest('a')) onNavigate?.()
      }}
    >
      {navItems.map(({ link, isCta }, i) => {
        if (isCta && !renderCtasAsLinks) {
          return <CtaButton key={i} {...link} className={ctaClassName} variant="header" />
        }

        const href = getCMSLinkHref(link)
        const isActive =
          !!href && href !== '/' && (pathname === href || pathname?.startsWith(`${href}/`))

        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={cn(
              'transition-colors duration-200 hover:text-site-accent',
              isActive ? 'text-site-accent' : 'text-site-text-primary',
              linkClassName,
            )}
          />
        )
      })}
    </nav>
  )
}
