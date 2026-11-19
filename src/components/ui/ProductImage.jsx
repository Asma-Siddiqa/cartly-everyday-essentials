import { useState } from 'react'
import { ImageOff } from 'lucide-react'

/**
 * Shows a useful, non-colour-only fallback if a product photo fails to load.
 * The failure is handled locally so one broken image never breaks the page.
 */
export function ProductImage({ src, alt, className = '', imageClassName = '', eager = false }) {
  const [hasFailed, setHasFailed] = useState(false)

  if (hasFailed || !src) {
    return (
      <div
        role="img"
        aria-label={`${alt}. Image unavailable.`}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-blue-soft via-white to-brand-cream p-4 text-center ${className}`}
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-navy shadow-sm">
          <ImageOff aria-hidden="true" className="h-6 w-6" />
        </span>
        <span className="text-xs font-semibold text-brand-charcoal/70">Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setHasFailed(true)}
      className={`${className} ${imageClassName}`}
    />
  )
}
