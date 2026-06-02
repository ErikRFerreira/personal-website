'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-6 items-center">
      {navItems.map(({ link, isCta }, i) => (
        <CMSLink
          key={i}
          {...link}
          appearance={isCta ? 'inline' : 'link'}
          className={
            isCta
              ? 'border border-current rounded-full px-4 py-1.5 text-sm leading-none transition-colors duration-200 hover:border-[var(--portfolio-accent)] hover:text-[var(--portfolio-accent)]'
              : 'transition-colors duration-200 hover:text-[var(--portfolio-accent)]'
          }
        />
      ))}
    </nav>
  )
}
