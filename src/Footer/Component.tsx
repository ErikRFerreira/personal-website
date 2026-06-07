import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-card text-white" data-theme="dark">
      <div className="container py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-6">
        {/* Left: brand */}
        <Link href="/" className="flex items-center">
          <Logo className="text-white" />
        </Link>

        {/* Right: nav links + copyright grouped */}
        <div className="flex flex-col gap-4 md:items-end">
          <nav className="flex flex-row flex-wrap gap-x-6 gap-y-2">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="relative pb-px text-white/60 hover:text-white text-xs tracking-widest uppercase transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>

          <p className="text-white/50 text-[0.6rem] tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Erik Ferreira. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
