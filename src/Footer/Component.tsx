import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-card text-white border-t-2 border-violet-500">
      <div className="container py-20 md:py-28 flex flex-col h-full">
        {/* Top row: nav links aligned right */}
        <div className="flex justify-end mb-auto">
          <nav className="flex flex-col md:flex-row gap-6 items-end md:items-center">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-white/70 hover:text-white text-xs tracking-widest uppercase transition-colors"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>

        {/* Bottom row: logo left, copyright right */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-24">
          <Link href="/" className="flex items-center">
            <Logo className="text-white" />
          </Link>

          <p className="text-white/40 text-[0.6rem] tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Erik Ferreira. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
