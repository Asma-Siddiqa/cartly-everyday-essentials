import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  RefreshCw,
  Scale,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { useCatalog } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { formatPKR } from '../lib/businessRules.js'
import { ProductImage } from '../components/ui/ProductImage.jsx'
import { StarRating } from '../components/ui/StarRating.jsx'
import { CategoryBadge, StockBadge } from '../components/ui/StockBadge.jsx'
import { QuantityStepper } from '../components/ui/QuantityStepper.jsx'
import { StatusMessage } from '../components/ui/StatusMessage.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { DeliveryPanel } from '../components/product/DeliveryPanel.jsx'
import { ProductGrid } from '../components/product/ProductGrid.jsx'

function DetailSkeleton() {
  return (
    <div className="container-shell py-10" aria-busy="true" aria-live="polite">
      <p className="mb-6 flex items-center gap-2 text-sm font-semibold text-brand-charcoal/65">
        <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" />
        Loading product details…
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square animate-soft-pulse rounded-3xl bg-brand-blue-soft" />
        <div className="space-y-4">
          <div className="h-4 w-28 animate-soft-pulse rounded-full bg-brand-charcoal/10" />
          <div className="h-10 w-4/5 animate-soft-pulse rounded-full bg-brand-charcoal/10" />
          <div className="h-4 w-2/5 animate-soft-pulse rounded-full bg-brand-charcoal/10" />
          <div className="h-28 animate-soft-pulse rounded-2xl bg-brand-charcoal/10" />
          <div className="h-12 animate-soft-pulse rounded-xl bg-brand-charcoal/10" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailsPage() {
  const { id } = useParams()
  const { products, status, error, retry } = useCatalog()
  const { addToCart, items } = useCart()
  const { ids: compareIds, toggleCompare } = useCompare()
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState(null)

  const product = useMemo(() => products.find((item) => item.id === id) ?? null, [products, id])
  usePageTitle(product ? product.name : 'Product details')

  useEffect(() => {
    setQuantity(1)
    setFeedback(null)
  }, [id])

  useEffect(() => {
    if (!product) return
    setQuantity((current) => Math.min(Math.max(1, current), Math.max(1, product.stock)))
  }, [product])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    const sameCategory = products.filter(
      (item) => item.id !== product.id && item.category === product.category,
    )
    if (sameCategory.length >= 3) return sameCategory.slice(0, 3)
    const fallback = products
      .filter((item) => item.id !== product.id && !sameCategory.some((related) => related.id === item.id))
      .sort((a, b) => b.rating - a.rating)
    return [...sameCategory, ...fallback].slice(0, 3)
  }, [product, products])

  if (status === 'loading') return <DetailSkeleton />

  if (status === 'error') {
    return (
      <div className="container-shell py-12">
        <EmptyState
          icon={AlertTriangle}
          eyebrow="Load error"
          title="We couldn't load this product"
          description={error ?? 'The catalogue request failed. Please try again.'}
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

  if (!product) {
    return (
      <div className="container-shell py-12">
        <EmptyState
          icon={ShoppingBag}
          eyebrow="Product not found"
          title="We couldn't find that product"
          description={`The product ID “${id}” does not match anything in the current Cartly catalogue. It may have been removed or the link may be mistyped.`}
          action={
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Browse all products
            </Link>
          }
          secondaryAction={
            <Link
              to="/about"
              className="inline-flex h-11 items-center rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal"
            >
              Learn about Cartly
            </Link>
          }
        />
      </div>
    )
  }

  const isOutOfStock = product.stock <= 0
  const quantityInCart = items.find((item) => item.productId === product.id)?.quantity ?? 0
  const isCompared = compareIds.includes(product.id)

  function handleAddToCart() {
    const result = addToCart(product.id, quantity)
    setFeedback({ tone: result.ok ? 'success' : 'error', message: result.message })
    if (result.ok) setQuantity(1)
  }

  function handleCompare() {
    const result = toggleCompare(product.id)
    setFeedback({ tone: result.ok ? 'info' : 'error', message: result.message })
  }

  return (
    <div className="container-shell py-6 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-brand-charcoal/55">
        <Link to="/" className="rounded hover:text-brand-navy hover:underline">
          Shop
        </Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        <Link
          to={`/?category=${encodeURIComponent(product.category)}`}
          className="rounded hover:text-brand-navy hover:underline"
        >
          {product.category}
        </Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="line-clamp-1 text-brand-charcoal" aria-current="page">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        <div>
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-charcoal/10 bg-white p-3 shadow-card">
            <ProductImage
              src={product.image}
              alt={`${product.name} by ${product.brand}`}
              className="aspect-square w-full rounded-[1.55rem] object-cover"
              eager
            />
            <div className="absolute left-6 top-6 flex flex-wrap gap-2">
              <CategoryBadge>{product.category}</CategoryBadge>
              {product.badge && (
                <span className="rounded-full bg-brand-charcoal px-2.5 py-1 text-[0.68rem] font-bold text-white">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/50">
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-emerald-700" />
                Checked stock
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                {isOutOfStock ? 'Currently unavailable' : `${product.stock} ready to ship`}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/50">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-brand-blue-strong" />
                Local delivery
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-charcoal">Islamabad &amp; Rawalpindi</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">{product.brand}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-brand-charcoal sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="lg" />
            <StockBadge stock={product.stock} />
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <p className="font-display text-4xl font-semibold text-brand-charcoal">{formatPKR(product.price)}</p>
            <p className="pb-1 text-xs font-medium text-brand-charcoal/55">Inclusive of all taxes</p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-brand-charcoal/70 sm:text-base">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-brand-charcoal/75">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                  <Check aria-hidden="true" className="h-3 w-3" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-brand-charcoal/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-brand-charcoal">
                  {isOutOfStock ? 'Out of stock' : `Quantity (${product.stock} available)`}
                </p>
                <p className="mt-0.5 text-xs text-brand-charcoal/55">
                  {isOutOfStock
                    ? 'This product cannot be added until stock returns.'
                    : 'Exactly the available stock is allowed.'}
                </p>
                {quantityInCart > 0 && (
                  <p className="mt-1 text-xs font-semibold text-brand-navy">
                    You currently have {quantityInCart} in your cart.
                  </p>
                )}
              </div>
              <QuantityStepper
                value={quantity}
                max={Math.max(1, product.stock)}
                min={1}
                onChange={setQuantity}
                disabled={isOutOfStock}
                label="Product quantity"
              />
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-blue/80 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-brand-charcoal/10 disabled:text-brand-charcoal/45"
              >
                <ShoppingBag aria-hidden="true" className="h-5 w-5" />
                {isOutOfStock ? 'Out of stock' : 'Add to cart'}
              </button>
              <button
                type="button"
                onClick={handleCompare}
                aria-pressed={isCompared}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition focus-visible:outline-none ${
                  isCompared
                    ? 'border-brand-charcoal bg-brand-charcoal text-white'
                    : 'border-brand-charcoal/15 bg-white text-brand-charcoal hover:border-brand-charcoal/30 hover:bg-brand-blue-soft'
                }`}
              >
                <Scale aria-hidden="true" className="h-4 w-4" />
                {isCompared ? 'In compare list' : 'Compare'}
              </button>
            </div>

            {feedback && (
              <StatusMessage
                tone={feedback.tone}
                className="mt-3"
                dismissible
                onDismiss={() => setFeedback(null)}
              >
                {feedback.message}
                {feedback.tone === 'success' && (
                  <Link to="/cart" className="ml-2 inline-flex items-center gap-1 font-bold underline underline-offset-2">
                    View cart <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                )}
              </StatusMessage>
            )}
          </div>

          <div className="mt-5">
            <DeliveryPanel product={product} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue-strong">Keep exploring</p>
              <h2 id="related-heading" className="mt-1 font-display text-2xl font-semibold text-brand-charcoal sm:text-3xl">
                You might also like
              </h2>
            </div>
            <Link
              to={`/?category=${encodeURIComponent(product.category)}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-4 hover:decoration-brand-navy"
            >
              More in {product.category}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5">
            <ProductGrid
              products={relatedProducts}
              onAddToCart={addToCart}
              onToggleCompare={toggleCompare}
              compareIds={compareIds}
            />
          </div>
        </section>
      )}
    </div>
  )
}
