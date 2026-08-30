'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CtaButton } from '@/components/CtaButton'
import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-6 items-center">
      {navItems.map(({ link, isCta }, i) =>
        isCta ? (
          <CtaButton key={i} {...link} size="sm" />
        ) : (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="text-site-text-primary transition-colors duration-200 hover:text-site-accent"
          />
        ),
      )}
    </nav>
  )
}
