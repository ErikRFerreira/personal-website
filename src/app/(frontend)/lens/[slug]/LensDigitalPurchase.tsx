import Link from 'next/link'

import {
  DetailAction,
  DetailInfoSection,
  DetailMetaGrid,
  DetailMetaItem,
} from '@/components/DetailInfo'
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
    <DetailInfoSection
      className="py-5"
      data-testid="lens-digital-purchase"
      divided
      title="Available as digital download"
    >
      {(digitalPrice != null || format) && (
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-5 gap-y-2">
          {digitalPrice != null && (
            <div className="flex items-baseline gap-2">
              <p className="font-sans text-[2rem] leading-none font-semibold tracking-[-0.04em] text-site-text-primary tabular-nums">
                {formatPrice(digitalPrice, currency)}
              </p>
              <p className="site-caption text-site-text-muted uppercase">{currency}</p>
            </div>
          )}
          {format && (
            <p className="text-sm leading-relaxed text-site-text-secondary">
              {getFormatLabel(format)}
            </p>
          )}
        </div>
      )}

      {details.length > 0 && (
        <DetailMetaGrid className="mt-4 sm:grid-cols-3">
          {details.map(({ label, value }) => (
            <DetailMetaItem key={label} label={label} technical value={value} />
          ))}
        </DetailMetaGrid>
      )}

      {checkoutUrl && (
        <DetailAction
          className="mt-5 w-full"
          external
          href={checkoutUrl}
          variant="editorial"
        >
          Buy digital download
        </DetailAction>
      )}

      {commercialLicensingEnabled && (
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
    </DetailInfoSection>
  )
}
