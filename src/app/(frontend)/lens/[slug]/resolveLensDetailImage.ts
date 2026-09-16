import type { Media } from '@/payload-types'

export type ResolvedLensDetailImage = {
  height?: number | null
  url?: string | null
  width?: number | null
}

const detailSizeOrder = ['xlarge', 'large', 'medium', 'small'] as const

function hasUsableImage(
  image: ResolvedLensDetailImage | null | undefined,
): image is ResolvedLensDetailImage {
  return (
    Boolean(image?.url) &&
    typeof image?.width === 'number' &&
    Number.isFinite(image.width) &&
    image.width > 0 &&
    typeof image.height === 'number' &&
    Number.isFinite(image.height) &&
    image.height > 0
  )
}

/**
 * Selects the largest generated, aspect-preserving rendition available for a
 * Lens detail page. The intentionally cropped `square` and `og` sizes are not
 * candidates. Older media without generated sizes falls back to the original.
 */
export function resolveLensDetailImage(photo: Media): ResolvedLensDetailImage {
  for (const size of detailSizeOrder) {
    const candidate = photo.sizes?.[size]
    if (hasUsableImage(candidate)) return candidate
  }

  return photo
}
