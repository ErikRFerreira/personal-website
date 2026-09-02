'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType } from '@/payload-types'
import { CtaButton } from '@/components/CtaButton'
import { CMSLink, getCMSLinkHref } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <nav className="flex gap-6 items-center">
      {navItems.map(({ link, isCta }, i) => {
        if (isCta) return <CtaButton key={i} {...link} size="sm" />

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
            )}
          />
        )
      })}
    </nav>
  )
}
