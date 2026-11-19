import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, CheckCircle2, Scale, ShoppingBag, Truck } from 'lucide-react'
import { ProductImage } from '../ui/ProductImage.jsx'
import { StarRating } from '../ui/StarRating.jsx'
import { CategoryBadge, StockBadge } from '../ui/StockBadge.jsx'
import { formatPKR, getDeliveryFee, DELIVERY_FEE } from '../../lib/businessRules.js'

export function ProductCard({ product, onAddToCart, onToggleCompare, isCompared = false }) {
  const [feedback, setFeedback] = useState(null)

  const deliveryFee = getDeliveryFee(product.price)
  const isOutOfStock = product.stock <= 0

  function handleAdd() {
    const result = onAddToCart(product.id, 1)
    setFeedback({ tone: result.ok ? 'success' : 'error', message: result.message })
  }

  function handleCompare() {
    const result = onToggleCompare(product.id)
    setFeedback({ tone: result.ok ? 'info' : 'error', message: result.message })
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-charcoal/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative overflow-hidden bg-brand-blue-soft">
        <Link to={`/products/${product.id}`} aria-label={`View details for ${product.name}`} className="block">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <CategoryBadge>{product.category}</CategoryBadge>
          <button
            type="button"
            onClick={handleCompare}
            aria-pressed={isCompared}
            aria-label={isCompared ? `Remove ${product.name} from compare list` : `Add ${product.name} to compare list`}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
            className={`pointer-events-auto grid h-9 w-9 place-items-center rounded-full border shadow-sm transition focus-visible:outline-none ${
              isCompared
                ? 'border-brand-charcoal bg-brand-charcoal text-brand-blue'
                : 'border-white/70 bg-white/95 text-brand-charcoal hover:bg-brand-blue-soft'
            }`}
          >
            <Scale aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        {product.badge && (
          <span className="absolute bottom-3 left-3 rounded-full bg-brand-charcoal px-2.5 py-1 text-[0.68rem] font-bold text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-brand-charcoal/45">
            {product.brand}
          </p>
          <StockBadge stock={product.stock} />
        </div>

        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-brand-charcoal">
          <Link
            to={`/products/${product.id}`}
            className="rounded underline-offset-4 transition hover:text-brand-navy hover:underline focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-charcoal/60">
          {product.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-lg font-extrabold tracking-tight text-brand-charcoal">{formatPKR(product.price)}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-brand-charcoal/55">
                <Truck aria-hidden="true" className="h-3.5 w-3.5" />
                {deliveryFee === 0 ? 'Free delivery on this item' : `${formatPKR(DELIVERY_FEE)} delivery`}
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-3 text-sm font-bold text-brand-charcoal transition hover:bg-brand-blue/80 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-brand-charcoal/10 disabled:text-brand-charcoal/45"
            >
              <ShoppingBag aria-hidden="true" className="h-4 w-4" />
              {isOutOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
            <Link
              to={`/products/${product.id}`}
              className="grid h-10 w-10 place-items-center rounded-xl border border-brand-charcoal/15 bg-white text-brand-charcoal transition hover:border-brand-charcoal/30 hover:bg-brand-blue-soft focus-visible:outline-none"
              aria-label={`More information about ${product.name}`}
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          {feedback && (
            <p
              role={feedback.tone === 'error' ? 'alert' : 'status'}
              className={`mt-2 flex items-start gap-1.5 text-xs font-semibold leading-snug ${
                feedback.tone === 'error' ? 'text-red-800' : feedback.tone === 'success' ? 'text-emerald-800' : 'text-brand-navy'
              }`}
            >
              {feedback.tone === 'error' ? (
                <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              ) : (
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
