import { Star } from 'lucide-react'

export function StarRating({ rating, reviewCount, showLabel = true, size = 'sm' }) {
  const filledStars = Math.round(rating)
  const starSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= filledStars ? 'fill-brand-sun text-brand-sun' : 'fill-transparent text-brand-charcoal/25'
            }`}
            strokeWidth={1.8}
          />
        ))}
      </span>
      <span className={showLabel ? 'text-sm font-semibold text-brand-charcoal' : 'sr-only'}>
        {rating.toFixed(1)} out of 5
      </span>
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-brand-charcoal/60">({reviewCount})</span>
      )}
    </div>
  )
}
