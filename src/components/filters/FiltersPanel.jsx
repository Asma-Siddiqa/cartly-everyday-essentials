import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { formatPKR } from '../../lib/businessRules.js'

const selectClass =
  'mt-1.5 h-11 w-full rounded-xl border border-brand-charcoal/15 bg-white px-3 text-sm font-medium text-brand-charcoal outline-none transition focus:border-brand-blue-strong focus:ring-4 focus:ring-brand-blue/30'
const inputClass =
  'mt-1.5 h-11 w-full rounded-xl border border-brand-charcoal/15 bg-white px-3 text-sm font-medium text-brand-charcoal outline-none transition placeholder:text-brand-charcoal/40 focus:border-brand-blue-strong focus:ring-4 focus:ring-brand-blue/30'

export function FiltersPanel({
  categories,
  filters,
  onChange,
  onClear,
  activeFilterCount,
  priceError,
  resultCount,
  totalCount,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        aria-controls="product-filters"
        className="mb-3 inline-flex h-11 w-full items-center justify-between rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal shadow-sm transition hover:border-brand-charcoal/30 lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition ${mobileOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <aside
        id="product-filters"
        aria-label="Product filters"
        className={`${mobileOpen ? 'block' : 'hidden'} rounded-2xl border border-brand-charcoal/10 bg-white p-5 shadow-card lg:sticky lg:top-40 lg:block`}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-brand-charcoal">Filters</h2>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg px-2 py-1 text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2 transition hover:decoration-brand-navy"
            >
              Clear all
            </button>
          )}
        </div>

        <p className="mt-1 text-xs text-brand-charcoal/55">
          Showing <strong className="text-brand-charcoal">{resultCount}</strong> of {totalCount} products
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="filter-category" className="text-xs font-bold uppercase tracking-[0.14em] text-brand-charcoal/60">
              Category
            </label>
            <select
              id="filter-category"
              value={filters.category}
              onChange={(event) => onChange('category', event.target.value)}
              className={selectClass}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-availability" className="text-xs font-bold uppercase tracking-[0.14em] text-brand-charcoal/60">
              Availability
            </label>
            <select
              id="filter-availability"
              value={filters.availability}
              onChange={(event) => onChange('availability', event.target.value)}
              className={selectClass}
            >
              <option value="all">All products</option>
              <option value="in-stock">In stock only</option>
              <option value="out-of-stock">Out of stock only</option>
            </select>
          </div>

          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-[0.14em] text-brand-charcoal/60">
              Price range (PKR)
            </legend>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="filter-min-price" className="text-[0.7rem] font-semibold text-brand-charcoal/55">
                  Minimum
                </label>
                <input
                  id="filter-min-price"
                  type="number"
                  min="0"
                  step="50"
                  inputMode="numeric"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(event) => onChange('minPrice', event.target.value)}
                  aria-invalid={Boolean(priceError)}
                  aria-describedby={priceError ? 'price-filter-error' : undefined}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="filter-max-price" className="text-[0.7rem] font-semibold text-brand-charcoal/55">
                  Maximum
                </label>
                <input
                  id="filter-max-price"
                  type="number"
                  min="0"
                  step="50"
                  inputMode="numeric"
                  placeholder="10,000"
                  value={filters.maxPrice}
                  onChange={(event) => onChange('maxPrice', event.target.value)}
                  aria-invalid={Boolean(priceError)}
                  aria-describedby={priceError ? 'price-filter-error' : undefined}
                  className={inputClass}
                />
              </div>
            </div>
            {priceError ? (
              <p id="price-filter-error" role="alert" className="mt-2 text-xs font-semibold text-red-800">
                {priceError}
              </p>
            ) : (
              <p className="mt-2 text-xs text-brand-charcoal/50">Leave either field blank for no limit.</p>
            )}
          </fieldset>
        </div>

        <div className="mt-6 rounded-2xl bg-brand-blue-soft p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-navy">Delivery note</p>
          <p className="mt-1.5 text-xs leading-relaxed text-brand-charcoal/70">
            Orders below Rs. 2,000 add Rs. 150 delivery. Rs. 2,000 and above are delivered free.
          </p>
        </div>
      </aside>
    </div>
  )
}

export function ActiveFilterChips({ query, filters, onRemove, onClearAll }) {
  const chips = []

  if (query.trim()) {
    chips.push({ key: 'query', label: `Search: “${query.trim()}”` })
  }
  if (filters.category !== 'all') {
    chips.push({ key: 'category', label: filters.category })
  }
  if (filters.availability !== 'all') {
    chips.push({
      key: 'availability',
      label: filters.availability === 'in-stock' ? 'In stock' : 'Out of stock',
    })
  }
  if (filters.minPrice !== '' || filters.maxPrice !== '') {
    const priceLabel = (value) => {
      if (value === '') return 'Any'
      const number = Number(value)
      return Number.isFinite(number) && number >= 0 ? formatPKR(number) : 'Invalid'
    }
    chips.push({ key: 'price', label: `Price: ${priceLabel(filters.minPrice)} – ${priceLabel(filters.maxPrice)}` })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      <span className="text-xs font-bold uppercase tracking-wide text-brand-charcoal/50">Active:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-brand-charcoal/15 bg-white px-3 text-xs font-semibold text-brand-charcoal transition hover:border-brand-charcoal/30 hover:bg-brand-blue-soft focus-visible:outline-none"
          aria-label={`Remove filter: ${chip.label}`}
        >
          {chip.label}
          <X aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-lg px-2 py-1 text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2 hover:decoration-brand-navy"
      >
        Clear all
      </button>
    </div>
  )
}
