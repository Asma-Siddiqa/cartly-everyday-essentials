import { ProductCard } from './ProductCard.jsx'

export function ProductGrid({ products, onAddToCart, onToggleCompare, compareIds = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[480px]:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleCompare={onToggleCompare}
          isCompared={compareIds.includes(product.id)}
        />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[480px]:gap-5 lg:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-brand-charcoal/10 bg-white shadow-card">
          <div className="aspect-[4/3] animate-soft-pulse bg-brand-blue-soft" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 animate-soft-pulse rounded-full bg-brand-charcoal/10" />
            <div className="h-5 w-4/5 animate-soft-pulse rounded-full bg-brand-charcoal/10" />
            <div className="h-3 w-2/5 animate-soft-pulse rounded-full bg-brand-charcoal/10" />
            <div className="h-10 animate-soft-pulse rounded-xl bg-brand-charcoal/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
