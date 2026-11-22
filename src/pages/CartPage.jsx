import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, RefreshCw, ShieldCheck, ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useCatalog } from '../context/CatalogContext.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { formatPKR } from '../lib/businessRules.js'
import { CartLineItem } from '../components/cart/CartLineItem.jsx'
import { OrderSummary } from '../components/cart/OrderSummary.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { StatusMessage } from '../components/ui/StatusMessage.jsx'

export function CartPage() {
  usePageTitle('Your cart')
  const { status, retry } = useCatalog()
  const {
    items,
    cartLines,
    itemCount,
    subtotal,
    notices,
    dismissNotices,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  if (status === 'loading') {
    return (
      <div className="container-shell py-12">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal/65" role="status">
          <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" />
          Restoring your saved cart and current stock…
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="container-shell py-12">
        <EmptyState
          icon={AlertTriangle}
          eyebrow="Catalogue unavailable"
          title="We can't verify your cart right now"
          description="Saved cart items must be checked against current products and stock. Reload the catalogue before continuing."
          action={
            <button
              type="button"
              onClick={retry}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Retry loading
            </button>
          }
          secondaryAction={
            <Link
              to="/"
              className="inline-flex h-11 items-center rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal"
            >
              Back to shop
            </Link>
          }
        />
      </div>
    )
  }

  if (itemCount === 0) {
    return (
      <div className="container-shell py-10 lg:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">Your selection</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-brand-charcoal">Your cart</h1>

        {notices.length > 0 && (
          <div className="mt-5 space-y-2">
            {notices.map((notice, index) => (
              <StatusMessage key={`${notice.type}-${index}`} tone="warning">
                {notice.message}
              </StatusMessage>
            ))}
            <button
              type="button"
              onClick={dismissNotices}
              className="text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2 hover:decoration-brand-navy"
            >
              Dismiss cart notices
            </button>
          </div>
        )}

        <div className="mt-7">
          <EmptyState
            icon={ShoppingCart}
            eyebrow="Nothing here yet"
            title="Your cart is empty"
            description="Browse the catalogue, add something useful, and your quantities will stay saved on this device."
            action={
              <Link
                to="/"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
              >
                <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                Browse products
              </Link>
            }
            secondaryAction={
              <Link
                to="/about#rules"
                className="inline-flex h-11 items-center rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal"
              >
                Delivery rules
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container-shell py-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">Your selection</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-brand-charcoal">Your cart</h1>
          <p className="mt-1 text-sm text-brand-charcoal/60">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · subtotal {formatPKR(subtotal)}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-brand-navy transition hover:bg-brand-blue-soft focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      {notices.length > 0 && (
        <div className="mt-5 space-y-2">
          {notices.map((notice, index) => (
            <StatusMessage key={`${notice.type}-${index}`} tone="warning">
              {notice.message}
            </StatusMessage>
          ))}
          <button
            type="button"
            onClick={dismissNotices}
            className="text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2 hover:decoration-brand-navy"
          >
            Dismiss cart notices
          </button>
        </div>
      )}

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-labelledby="cart-items-heading"
          className="rounded-3xl border border-brand-charcoal/10 bg-white p-5 shadow-card sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-charcoal/10 pb-4">
            <h2 id="cart-items-heading" className="font-display text-xl font-semibold text-brand-charcoal">
              Cart items
            </h2>
            {!showClearConfirm ? (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-brand-charcoal/55 transition hover:bg-red-50 hover:text-red-800"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Clear cart
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Confirm clearing the cart">
                <span className="text-xs font-semibold text-brand-charcoal/70">Remove every item?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearCart()
                    setShowClearConfirm(false)
                  }}
                  className="inline-flex h-9 items-center rounded-lg bg-red-700 px-3 text-xs font-bold text-white transition hover:bg-red-800"
                >
                  Yes, clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="inline-flex h-9 items-center rounded-lg border border-brand-charcoal/15 px-3 text-xs font-bold text-brand-charcoal"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <ul className="divide-y divide-brand-charcoal/10">
            {cartLines.map((line) => (
              <CartLineItem
                key={line.productId}
                line={line}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </ul>
        </section>

        <div className="lg:sticky lg:top-40">
          <OrderSummary lines={cartLines} subtotal={subtotal}>
            <Link
              to="/checkout"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-blue/80 focus-visible:outline-none"
            >
              Proceed to checkout
            </Link>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-brand-charcoal/55">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
              Cash on delivery — no card details required.
            </p>
          </OrderSummary>

          <div className="mt-4 rounded-2xl border border-brand-charcoal/10 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/50">Before checkout</p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-brand-charcoal/65">
              <li>Stock is checked again when you place the order.</li>
              <li>Only Islamabad and Rawalpindi service areas are eligible.</li>
              <li>Delivery is free once the product subtotal reaches Rs. 2,000.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
