import { Link } from 'react-router-dom'
import { Check, MapPin, Truck } from 'lucide-react'
import { DELIVERY_AREAS, DELIVERY_ESTIMATE, SERVICE_CITIES } from '../../data/deliveryAreas.js'
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  formatPKR,
  getDeliveryFee,
} from '../../lib/businessRules.js'
import { useCart } from '../../context/CartContext.jsx'

export function DeliveryPanel({ product }) {
  const { subtotal } = useCart()
  const itemDeliveryFee = getDeliveryFee(product.price)
  const itemGap = Math.max(0, FREE_DELIVERY_THRESHOLD - product.price)
  const cartFee = getDeliveryFee(subtotal)
  const cartGap = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)

  return (
    <section
      aria-labelledby="delivery-heading"
      className="rounded-2xl border border-brand-blue-strong/20 bg-brand-blue-soft p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-navy shadow-sm">
          <Truck aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 id="delivery-heading" className="font-display text-lg font-semibold text-brand-charcoal">
            Delivery, clearly priced
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-brand-charcoal/70">
            {itemDeliveryFee === 0
              ? 'This item alone qualifies for free delivery.'
              : `${formatPKR(DELIVERY_FEE)} delivery if this is the only item. Add ${formatPKR(itemGap)} more to reach ${formatPKR(FREE_DELIVERY_THRESHOLD)} and get free delivery.`}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-white/80 p-3">
          <dt className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-charcoal/50">
            Delivery charge
          </dt>
          <dd className="mt-1 font-bold text-brand-charcoal">
            {formatPKR(DELIVERY_FEE)} below {formatPKR(FREE_DELIVERY_THRESHOLD)}
            <span className="block text-xs font-medium text-brand-charcoal/60">
              Free at {formatPKR(FREE_DELIVERY_THRESHOLD)} and above
            </span>
          </dd>
        </div>
        <div className="rounded-xl bg-white/80 p-3">
          <dt className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-charcoal/50">
            Estimated arrival
          </dt>
          <dd className="mt-1 font-bold text-brand-charcoal">
            {product.deliveryEstimate}
            <span className="block text-xs font-medium text-brand-charcoal/60">{DELIVERY_ESTIMATE}</span>
          </dd>
        </div>
      </dl>

      {subtotal > 0 && (
        <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs leading-relaxed text-brand-charcoal/75">
          <strong>Your current cart subtotal:</strong> {formatPKR(subtotal)}.{' '}
          {cartFee === 0
            ? 'Your cart already qualifies for free delivery.'
            : `Add ${formatPKR(cartGap)} more for free delivery.`}
        </p>
      )}

      <div className="mt-4 rounded-xl border border-brand-blue-strong/15 bg-white/70 p-3">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/55">
          <MapPin aria-hidden="true" className="h-4 w-4" />
          Supported delivery areas
        </p>
        <p className="mt-1 text-xs leading-relaxed text-brand-charcoal/65">
          We deliver only to these listed areas in Islamabad and Rawalpindi. The checkout will reject any
          other city or area.
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2">
            View all supported areas
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {SERVICE_CITIES.map((city) => (
              <div key={city}>
                <p className="text-xs font-bold text-brand-charcoal">{city}</p>
                <ul className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-[0.7rem] text-brand-charcoal/65">
                  {DELIVERY_AREAS[city].map((area) => (
                    <li key={area} className="flex items-start gap-1">
                      <Check aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
        <Link
          to="/about#rules"
          className="mt-2 inline-block text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2 hover:decoration-brand-navy"
        >
          Read the delivery rules
        </Link>
      </div>
    </section>
  )
}
