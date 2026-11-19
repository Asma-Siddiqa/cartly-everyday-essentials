import { AlertTriangle, PackageCheck, PackageX, Sparkles } from 'lucide-react'

export function StockBadge({ stock, className = '' }) {
  if (stock <= 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-brand-charcoal/10 px-2.5 py-1 text-xs font-bold text-brand-charcoal ${className}`}>
        <PackageX aria-hidden="true" className="h-3.5 w-3.5" />
        Out of stock
      </span>
    )
  }

  if (stock <= 3) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-950 ${className}`}>
        <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
        Only {stock} left
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-950 ${className}`}>
      <PackageCheck aria-hidden="true" className="h-3.5 w-3.5" />
      In stock
    </span>
  )
}

export function CategoryBadge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-brand-blue-soft px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-brand-navy ${className}`}>
      <Sparkles aria-hidden="true" className="h-3 w-3" />
      {children}
    </span>
  )
}
