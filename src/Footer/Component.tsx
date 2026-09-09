import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-site-surface-footer text-site-text-primary" data-theme="dark">
      <div className="container py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-6">
        {/* Left: brand */}
        <Link href="/" className="flex items-center">
          <Logo className="text-site-text-primary" />
        </Link>

        {/* Right: nav links + copyright grouped */}
        <div className="flex flex-col gap-4 md:items-end">
          <nav className="flex flex-row flex-wrap gap-x-6 gap-y-2">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="relative pb-px text-xs tracking-widest text-site-text-secondary uppercase transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:text-site-text-primary hover:after:w-full"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>

          <p className="text-[0.6rem] tracking-widest text-site-text-muted uppercase">
            &copy; {new Date().getFullYear()} Erik Ferreira. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
