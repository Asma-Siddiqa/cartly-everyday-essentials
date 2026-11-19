import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Trash2 } from 'lucide-react'
import { formatPKR } from '../../lib/businessRules.js'
import { ProductImage } from '../ui/ProductImage.jsx'
import { QuantityStepper } from '../ui/QuantityStepper.jsx'
import { StockBadge } from '../ui/StockBadge.jsx'

export function CartLineItem({ line, onUpdateQuantity, onRemove }) {
  const [feedback, setFeedback] = useState(null)
  const { product, quantity, lineTotal } = line

  function handleQuantityChange(nextQuantity) {
    const result = onUpdateQuantity(product.id, nextQuantity)
    setFeedback(result.ok ? null : result.message)
  }

  function handleRemove() {
    const result = onRemove(product.id)
    setFeedback(result.ok ? null : result.message)
  }

  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <div className="flex gap-3 sm:gap-4">
        <Link
          to={`/products/${product.id}`}
          className="shrink-0 overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-brand-blue-soft"
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            className="h-24 w-24 object-cover sm:h-32 sm:w-32"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-charcoal/45">
                {product.brand}
              </p>
              <h3 className="mt-0.5 font-display text-lg font-semibold leading-snug text-brand-charcoal">
                <Link
                  to={`/products/${product.id}`}
                  className="rounded underline-offset-4 hover:text-brand-navy hover:underline focus-visible:outline-none"
                >
                  {product.name}
                </Link>
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <StockBadge stock={product.stock} />
                <span className="text-xs text-brand-charcoal/55">{formatPKR(product.price)} each</span>
              </div>
            </div>
            <p className="shrink-0 text-sm font-bold text-brand-charcoal">{formatPKR(lineTotal)}</p>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
            <div>
              <QuantityStepper
                value={quantity}
                max={product.stock}
                onChange={handleQuantityChange}
                label={`Quantity for ${product.name}`}
                size="sm"
              />
              <p className="mt-1 text-[0.7rem] text-brand-charcoal/50">
                {quantity >= product.stock
                  ? `Maximum available stock (${product.stock}) reached.`
                  : `Up to ${product.stock} available.`}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-brand-charcoal/60 transition hover:bg-red-50 hover:text-red-800 focus-visible:outline-none"
              aria-label={`Remove ${product.name} from cart`}
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Remove
            </button>
          </div>

          {feedback && (
            <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-red-800">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {feedback}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}
