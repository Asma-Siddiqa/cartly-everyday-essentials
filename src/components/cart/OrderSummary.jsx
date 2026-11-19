import { Link } from 'react-router-dom'
import { Truck } from 'lucide-react'
import { calculateOrderTotals, formatPKR, FREE_DELIVERY_THRESHOLD } from '../../lib/businessRules.js'

export function OrderSummary({
  lines = [],
  subtotal = 0,
  title = 'Order summary',
  compact = false,
  children,
}) {
  const totals = calculateOrderTotals(subtotal)
  const progress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100))

  return (
    <section
      aria-labelledby="order-summary-heading"
      className="rounded-3xl border border-brand-charcoal/10 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="order-summary-heading" className="font-display text-xl font-semibold text-brand-charcoal">
          {title}
        </h2>
        <Truck aria-hidden="true" className="h-5 w-5 text-brand-navy" />
      </div>

      <div className="mt-4 rounded-xl bg-brand-blue-soft p-3">
        {totals.amountUntilFreeDelivery > 0 ? (
          <p className="text-xs leading-relaxed text-brand-charcoal/75">
            Add <strong className="text-brand-charcoal">{formatPKR(totals.amountUntilFreeDelivery)}</strong> more to
            unlock free delivery.
          </p>
        ) : (
          <p className="text-xs font-semibold leading-relaxed text-emerald-900">
            {subtotal > 0 ? 'Free delivery unlocked for this order.' : `Free delivery applies at ${formatPKR(FREE_DELIVERY_THRESHOLD)} and above.`}
          </p>
        )}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" aria-hidden="true">
          <div
            className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-emerald-600' : 'bg-brand-blue-strong'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {lines.length > 0 && !compact && (
        <ul className="mt-4 divide-y divide-brand-charcoal/10 border-y border-brand-charcoal/10">
          {lines.map((line) => (
            <li key={line.productId} className="flex items-start justify-between gap-3 py-2.5 text-sm">
              <span className="min-w-0 text-brand-charcoal/75">
                <span className="font-semibold text-brand-charcoal">{line.product.name}</span>
                <span className="block text-xs text-brand-charcoal/50">Qty {line.quantity}</span>
              </span>
              <span className="shrink-0 font-semibold text-brand-charcoal">{formatPKR(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}

      {compact && lines.length > 0 && (
        <p className="mt-3 text-xs text-brand-charcoal/55">
          {lines.reduce((count, line) => count + line.quantity, 0)} items in this order
        </p>
      )}

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-brand-charcoal/65">Product subtotal</dt>
          <dd className="font-semibold text-brand-charcoal">{formatPKR(totals.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-brand-charcoal/65">Delivery fee</dt>
          <dd className={`font-semibold ${totals.deliveryFee === 0 ? 'text-emerald-800' : 'text-brand-charcoal'}`}>
            {totals.deliveryFee === 0 ? 'Free' : formatPKR(totals.deliveryFee)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-brand-charcoal/10 pt-3 text-base">
          <dt className="font-bold text-brand-charcoal">Final total</dt>
          <dd className="font-display text-2xl font-semibold text-brand-charcoal">{formatPKR(totals.total)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-[0.7rem] leading-relaxed text-brand-charcoal/50">
        Delivery is free at a product subtotal of {formatPKR(FREE_DELIVERY_THRESHOLD)} or more. Orders below that
        add {formatPKR(150)}.
      </p>

      {children && <div className="mt-4">{children}</div>}

      {lines.length > 0 && (
        <Link
          to="/"
          className="mt-3 inline-flex text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2 hover:decoration-brand-navy"
        >
          Continue shopping
        </Link>
      )}
    </section>
  )
}
