import RichText from '@/components/RichText'
import Link from 'next/link'

import type { Len } from '@/payload-types'

type Props = {
  commercialLicensingEnabled?: Len['commercialLicensingEnabled']
  commercialLicensingText?: Len['commercialLicensingText']
  digitalLicenseDescription?: Len['digitalLicenseDescription']
  digitalPurchaseEnabled?: Len['digitalPurchaseEnabled']
  fullStory?: Len['fullStory']
}

const defaultLicenseDescription =
  'Digital purchases include a personal-use license. Copyright remains with the photographer. Commercial, editorial and promotional use requires a separate license.'

export function LensEditorial({
  commercialLicensingEnabled,
  commercialLicensingText,
  digitalLicenseDescription,
  digitalPurchaseEnabled,
  fullStory,
}: Props) {
  const customLicenseDescription = digitalLicenseDescription?.trim()
  const licenseDescription =
    customLicenseDescription || (digitalPurchaseEnabled ? defaultLicenseDescription : null)
  const commercialPrompt = commercialLicensingText?.trim() || 'Commercial use or publication?'
  const showLicensing = Boolean(licenseDescription)

  if (!fullStory && !showLicensing) return null

  return (
    <section className="site-container py-20 md:py-24" data-testid="lens-long-form">
      <div>
        {fullStory && (
          <div className="grid gap-8 py-10 lg:grid-cols-12 lg:gap-12 lg:py-12">
            <header className="lg:col-span-4">
              <h2 className="text-[1.3125rem] leading-tight font-medium tracking-[0.01em] text-site-text-primary md:text-2xl">
                Story Behind the Shot:
              </h2>
            </header>
            <RichText
              className="max-w-3xl text-sm leading-[1.8] text-site-text-secondary lg:col-span-8 lg:col-start-5 lg:text-base [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-site-accent [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-site-text-primary [&_p]:mb-5 [&_p:last-child]:mb-0"
              data={fullStory}
              enableGutter={false}
            />
          </div>
        )}

        {showLicensing && (
          <div className="grid gap-4 border border-site-border-subtle bg-site-surface-elevated/65 p-5 sm:p-6 lg:grid-cols-[minmax(12rem,0.7fr)_minmax(0,2fr)] lg:gap-12">
            <h2 className="site-meta-label text-site-accent">Licensing</h2>
            <div className="max-w-3xl">
              <p className="site-body-small text-site-text-secondary">{licenseDescription}</p>
              {commercialLicensingEnabled && (
                <p className="mt-3 text-xs leading-relaxed text-site-text-muted">
                  {commercialPrompt}{' '}
                  <Link
                    className="text-site-text-secondary underline decoration-site-border-control underline-offset-2 transition-colors hover:text-site-accent"
                    href="/contact"
                  >
                    Inquire
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
