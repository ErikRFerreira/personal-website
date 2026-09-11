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
  const commercialPrompt =
    commercialLicensingText?.trim() || 'Need commercial, editorial, or promotional rights?'
  const showLicensing = Boolean(licenseDescription)
  const showCommercialInquiry = Boolean(commercialLicensingEnabled && !digitalPurchaseEnabled)

  if (!fullStory && !showLicensing) return null

  return (
    <section className="site-container py-14 md:py-16 lg:py-20" data-testid="lens-long-form">
      <div>
        {fullStory && (
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-12">
            <header className="lg:col-span-4">
              <h2 className="text-[1.3125rem] leading-tight font-medium tracking-[0.01em] text-site-text-primary md:text-2xl">
                Story Behind the Shot
              </h2>
            </header>
            <RichText
              className="max-w-2xl text-sm leading-[1.75] text-site-text-secondary lg:col-span-8 lg:col-start-5 lg:text-base [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-site-accent [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-site-text-primary [&_p]:mb-4 [&_p:last-child]:mb-0"
              data={fullStory}
              enableGutter={false}
            />
          </div>
        )}

        {showLicensing && (
          <div
            className={`${fullStory ? 'mt-10 md:mt-12' : ''} grid gap-4 border-t border-site-border-subtle pt-6 sm:pt-8 lg:grid-cols-12 lg:gap-12`}
          >
            <h2 className="site-meta-label text-site-accent lg:col-span-4">Licensing</h2>
            <div className="max-w-2xl lg:col-span-8 lg:col-start-5">
              <p className="site-body-small text-site-text-secondary">{licenseDescription}</p>
              {showCommercialInquiry && (
                <p className="mt-3 text-xs leading-relaxed text-site-text-muted">
                  {commercialPrompt}{' '}
                  <Link
                    className="text-site-text-secondary underline decoration-site-border-control underline-offset-2 transition-colors hover:text-site-accent"
                    href="/contact"
                  >
                    Request a license
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
