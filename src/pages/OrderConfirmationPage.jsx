import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  XCircle,
} from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { formatPKR } from '../lib/businessRules.js'
import { getOrderById } from '../services/orderService.js'
import { EmptyState } from '../components/ui/EmptyState.jsx'

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium' }).format(date)
}

export function OrderConfirmationPage() {
  const { id } = useParams()
  const order = getOrderById(id)
  usePageTitle(order ? 'Order confirmed' : 'Order not found')

  if (!order) {
    return (
      <div className="container-shell py-12">
        <EmptyState
          icon={XCircle}
          eyebrow="Order not found"
          title="We couldn't find that order"
          description={`The reference “${id}” is not stored in this browser. Confirmation pages are available only on the device that placed the simulated order.`}
          action={
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to shop
            </Link>
          }
          secondaryAction={
            <Link
              to="/cart"
              className="inline-flex h-11 items-center rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal"
            >
              View cart
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-shell py-8 lg:py-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-charcoal px-6 py-10 text-white sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            Simulated order confirmed
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Thank you — your order is in.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            This confirms a simulated Cartly order. No payment was collected and no courier has been booked.
            Keep the reference below for the assignment demonstration.
          </p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">Order reference</dt>
              <dd className="mt-1 font-mono text-base font-bold text-brand-blue">{order.id}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">Placed</dt>
              <dd className="mt-1 font-semibold">{formatDate(order.placedAt)}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">Total</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">{formatPKR(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-3xl border border-brand-charcoal/10 bg-white p-5 shadow-card sm:p-6" aria-labelledby="ordered-items-heading">
          <h2 id="ordered-items-heading" className="font-display text-xl font-semibold text-brand-charcoal">
            Ordered items
          </h2>
          <ul className="mt-4 divide-y divide-brand-charcoal/10 border-y border-brand-charcoal/10">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-start justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-brand-charcoal">{item.name}</p>
                  <p className="mt-0.5 text-xs text-brand-charcoal/55">
                    Qty {item.quantity} × {formatPKR(item.unitPrice)}
                  </p>
                </div>
                <p className="shrink-0 font-bold text-brand-charcoal">{formatPKR(item.lineTotal)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-brand-charcoal/65">Product subtotal</dt>
              <dd className="font-semibold">{formatPKR(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-brand-charcoal/65">Delivery fee</dt>
              <dd className={`font-semibold ${order.deliveryFee === 0 ? 'text-emerald-800' : ''}`}>
                {order.deliveryFee === 0 ? 'Free' : formatPKR(order.deliveryFee)}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-brand-charcoal/10 pt-3">
              <dt className="font-bold text-brand-charcoal">Final total</dt>
              <dd className="font-display text-2xl font-semibold">{formatPKR(order.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
            >
              Continue shopping
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-11 items-center rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal transition hover:border-brand-charcoal/30"
            >
              Print confirmation
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-brand-charcoal/10 bg-white p-5 shadow-card" aria-labelledby="delivery-details-heading">
            <h2 id="delivery-details-heading" className="font-display text-xl font-semibold text-brand-charcoal">
              Delivery details
            </h2>
            <div className="mt-3 space-y-3 text-sm">
              <p className="flex items-start gap-2 text-brand-charcoal/75">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy" />
                <span>
                  <strong className="block text-brand-charcoal">{order.area}</strong>
                  {order.city}, Pakistan
                </span>
              </p>
              <p className="flex items-start gap-2 text-brand-charcoal/75">
                <Truck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy" />
                <span>
                  <strong className="block text-brand-charcoal">Estimated arrival</strong>
                  {formatDate(order.estimatedDelivery)}
                </span>
              </p>
            </div>
            <p className="mt-4 rounded-xl bg-brand-blue-soft p-3 text-xs leading-relaxed text-brand-charcoal/70">
              This confirmation stores only the order items, totals, city, and area in this browser. Your name,
              email, phone, and street address were not saved.
            </p>
          </section>

          <section className="rounded-3xl border border-brand-charcoal/10 bg-white p-5 shadow-card" aria-labelledby="next-steps-heading">
            <h2 id="next-steps-heading" className="font-display text-xl font-semibold text-brand-charcoal">
              What would happen next
            </h2>
            <ol className="mt-3 space-y-3 text-sm text-brand-charcoal/70">
              <li className="flex gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                  <Check aria-hidden="true" className="h-3 w-3" />
                </span>
                A real store would confirm stock and pack the order.
              </li>
              <li className="flex gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                  <PackageCheck aria-hidden="true" className="h-3 w-3" />
                </span>
                The courier would deliver within 1–3 working days.
              </li>
              <li className="flex gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck aria-hidden="true" className="h-3 w-3" />
                </span>
                Payment would be collected on delivery.
              </li>
            </ol>
            <p className="mt-3 text-xs font-semibold text-brand-charcoal/50">
              These steps are illustrative only. Nothing has been shipped.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
