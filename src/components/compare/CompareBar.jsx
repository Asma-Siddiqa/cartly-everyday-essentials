import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Scale, Trash2, X } from 'lucide-react'
import { useCompare } from '../../context/CompareContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { ProductImage } from '../ui/ProductImage.jsx'
import { StarRating } from '../ui/StarRating.jsx'
import { StockBadge } from '../ui/StockBadge.jsx'
import { StatusMessage } from '../ui/StatusMessage.jsx'
import { formatPKR, getDeliveryFee } from '../../lib/businessRules.js'

function CompareDialog({ open, onClose }) {
  const dialogRef = useRef(null)
  const { comparedProducts, removeCompare, clearCompare, maxCompareItems } = useCompare()
  const { addToCart } = useCart()
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (!open) setFeedback(null)
  }, [open])

  function handleAdd(productId) {
    const result = addToCart(productId, 1)
    setFeedback({ tone: result.ok ? 'success' : 'error', message: result.message })
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      aria-labelledby="compare-dialog-title"
      className="w-[min(64rem,calc(100%-1.5rem))] max-h-[90vh] overflow-y-auto rounded-3xl border border-brand-charcoal/10 bg-brand-cream p-0 text-brand-charcoal shadow-lift backdrop:bg-brand-charcoal/60 backdrop:backdrop-blur-sm"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-brand-charcoal/10 bg-brand-cream/95 px-5 py-4 backdrop-blur sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">Side by side</p>
          <h2 id="compare-dialog-title" className="mt-1 font-display text-2xl font-semibold">
            Compare your picks
          </h2>
          <p className="mt-1 text-xs text-brand-charcoal/60">
            Up to {maxCompareItems} products. Prices and stock reflect the current catalogue.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close comparison"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-charcoal transition hover:bg-brand-blue-soft focus-visible:outline-none"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 py-5 sm:px-7">
        {comparedProducts.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-brand-charcoal/65">
            Your compare list is empty. Add products from the catalogue to compare them here.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-brand-charcoal/10 bg-white">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <caption className="sr-only">Comparison of selected Cartly products</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-28 border-b border-brand-charcoal/10 p-3 text-xs uppercase tracking-wide text-brand-charcoal/50">
                      Product
                    </th>
                    {comparedProducts.map((product) => (
                      <th key={product.id} scope="col" className="min-w-44 border-b border-l border-brand-charcoal/10 p-3 align-top">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => removeCompare(product.id)}
                            aria-label={`Remove ${product.name} from comparison`}
                            className="absolute right-0 top-0 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-brand-charcoal/60 shadow-sm transition hover:bg-red-50 hover:text-red-700"
                          >
                            <X aria-hidden="true" className="h-3.5 w-3.5" />
                          </button>
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            className="aspect-square w-full overflow-hidden rounded-xl bg-brand-blue-soft object-cover"
                          />
                          <Link
                            to={`/products/${product.id}`}
                            onClick={onClose}
                            className="mt-3 block font-bold leading-snug text-brand-charcoal underline-offset-4 hover:underline"
                          >
                            {product.name}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="border-b border-brand-charcoal/10 p-3 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50">Price</th>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="border-b border-l border-brand-charcoal/10 p-3 font-bold text-brand-navy">
                        {formatPKR(product.price)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="border-b border-brand-charcoal/10 p-3 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50">Rating</th>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="border-b border-l border-brand-charcoal/10 p-3">
                        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="border-b border-brand-charcoal/10 p-3 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50">Availability</th>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="border-b border-l border-brand-charcoal/10 p-3">
                        <StockBadge stock={product.stock} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="border-b border-brand-charcoal/10 p-3 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50">Brand</th>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="border-b border-l border-brand-charcoal/10 p-3 text-brand-charcoal/75">
                        {product.brand}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="border-b border-brand-charcoal/10 p-3 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50">Delivery</th>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="border-b border-l border-brand-charcoal/10 p-3 text-brand-charcoal/75">
                        {product.deliveryEstimate} ·{' '}
                        {getDeliveryFee(product.price) === 0 ? 'free alone' : 'fee may apply'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="p-3 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50">Action</th>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="border-l border-brand-charcoal/10 p-3">
                        <button
                          type="button"
                          onClick={() => handleAdd(product.id)}
                          disabled={product.stock <= 0}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-blue px-3 text-xs font-bold text-brand-charcoal transition hover:bg-brand-blue/80 disabled:cursor-not-allowed disabled:bg-brand-charcoal/10 disabled:text-brand-charcoal/45"
                        >
                          {product.stock > 0 ? 'Add to cart' : 'Unavailable'}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {feedback && (
              <StatusMessage tone={feedback.tone} className="mt-4" dismissible onDismiss={() => setFeedback(null)}>
                {feedback.message}
              </StatusMessage>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearCompare}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-brand-charcoal/15 bg-white px-3 text-xs font-bold text-brand-charcoal transition hover:border-brand-charcoal/30"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Clear comparison
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}

export function CompareBar() {
  const { ids, comparedProducts, clearCompare, maxCompareItems } = useCompare()
  const [dialogOpen, setDialogOpen] = useState(false)

  if (ids.length === 0) {
    return <CompareDialog open={false} onClose={() => setDialogOpen(false)} />
  }

  return (
    <>
      <aside
        aria-label="Product comparison tray"
        className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-brand-charcoal px-3 py-2.5 text-white shadow-lift sm:inset-x-6 sm:px-4"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-blue sm:flex">
            <Scale aria-hidden="true" className="h-4 w-4" />
            Compare
          </span>
          <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            {comparedProducts.map((product) => (
              <li
                key={product.id}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-semibold"
              >
                <span className="hidden max-w-28 truncate sm:inline">{product.name}</span>
                <span className="sm:hidden">{product.brand}</span>
              </li>
            ))}
          </ul>
          <span className="text-xs text-white/55" aria-live="polite">
            {ids.length}/{maxCompareItems}
          </span>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-blue px-3 text-xs font-bold text-brand-charcoal transition hover:bg-brand-blue/80 focus-visible:outline-none"
          >
            Compare
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={clearCompare}
            className="grid h-9 w-9 place-items-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Clear comparison list"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </aside>
      <CompareDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
