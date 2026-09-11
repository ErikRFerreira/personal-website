import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { Len } from '@/payload-types'

type Props = Pick<
  Len,
  | 'commercialLicensingEnabled'
  | 'commercialLicensingText'
  | 'digitalCheckoutUrl'
  | 'digitalCurrency'
  | 'digitalDimensions'
  | 'digitalFileSize'
  | 'digitalFormat'
  | 'digitalLicenseType'
  | 'digitalPrice'
  | 'digitalPurchaseEnabled'
>

const currencyLocales: Record<NonNullable<Len['digitalCurrency']>, string> = {
  EUR: 'en-IE',
  GBP: 'en-GB',
  USD: 'en-US',
}

function formatPrice(price: number, currency: NonNullable<Len['digitalCurrency']>) {
  return new Intl.NumberFormat(currencyLocales[currency], {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    style: 'currency',
  }).format(price)
}

function getFormatLabel(format: string) {
  return format.toLowerCase().includes('resolution') ? format : `Full-resolution ${format}`
}

export function LensDigitalPurchase({
  commercialLicensingEnabled,
  commercialLicensingText,
  digitalCheckoutUrl,
  digitalCurrency,
  digitalDimensions,
  digitalFileSize,
  digitalFormat,
  digitalLicenseType,
  digitalPrice,
  digitalPurchaseEnabled,
}: Props) {
  if (!digitalPurchaseEnabled) return null

  const checkoutUrl = digitalCheckoutUrl?.trim()
  const currency = digitalCurrency ?? 'EUR'
  const format = digitalFormat?.trim()
  const dimensions = digitalDimensions?.trim()
  const fileSize = digitalFileSize?.trim()
  const licenseType = digitalLicenseType?.trim()
  const commercialPrompt =
    commercialLicensingText?.trim() || 'Need commercial, editorial, or promotional rights?'
  const details = [
    { label: 'Dimensions', value: dimensions },
    { label: 'File size', value: fileSize },
    { label: 'License', value: licenseType },
  ].filter((detail): detail is { label: string; value: string } => Boolean(detail.value))

  return (
    <section
      className="border-t border-site-border-subtle pt-5"
      data-testid="lens-digital-purchase"
    >
      <h2 className="site-eyebrow text-site-accent">Available as digital download</h2>

      {(digitalPrice != null || format) && (
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-5 gap-y-2">
          {digitalPrice != null && (
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-[-0.04em] text-site-text-primary tabular-nums">
                {formatPrice(digitalPrice, currency)}
              </p>
              <p className="site-caption text-site-text-muted uppercase">{currency}</p>
            </div>
          )}
          {format && (
            <p className="site-caption text-site-text-secondary">{getFormatLabel(format)}</p>
          )}
        </div>
      )}

      {details.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-site-border-subtle pt-4">
          {details.map(({ label, value }) => (
            <div className="min-w-0" key={label}>
              <dt className="site-field-label text-site-text-muted">{label}</dt>
              <dd className="site-field-value mt-1 text-site-text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {checkoutUrl && (
        <a
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-site-text-primary px-4 py-3 font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-site-surface-deep uppercase transition-colors hover:bg-site-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-border-active"
          href={checkoutUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Buy digital download
          <ArrowRight aria-hidden="true" className="size-3" />
        </a>
      )}

      {commercialLicensingEnabled && (
        <p className="site-caption mt-3 text-center leading-relaxed text-site-text-muted">
          {commercialPrompt}{' '}
          <Link
            className="text-site-text-secondary underline decoration-site-border-control underline-offset-2 transition-colors hover:text-site-accent"
            href="/contact"
          >
            Request a license
          </Link>
        </p>
      )}
    </section>
  )
}
