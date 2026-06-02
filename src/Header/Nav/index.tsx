'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

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
              ? 'border border-current rounded-[6px] px-4 py-1.5 text-sm leading-none'
              : undefined
          }
        />
      ))}
    </nav>
  )
}
