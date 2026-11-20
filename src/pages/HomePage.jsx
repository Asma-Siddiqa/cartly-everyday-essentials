import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Filter,
  MapPin,
  RefreshCw,
  SearchX,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import { PRODUCTS } from '../data/products.js'
import { useCatalog } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { filterAndSortProducts } from '../lib/search.js'
import { formatPKR, FREE_DELIVERY_THRESHOLD } from '../lib/businessRules.js'
import { SearchAutocomplete } from '../components/search/SearchAutocomplete.jsx'
import { ProductGrid, ProductGridSkeleton } from '../components/product/ProductGrid.jsx'
import { ProductImage } from '../components/ui/ProductImage.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { StatusMessage } from '../components/ui/StatusMessage.jsx'
import { FiltersPanel } from '../components/filters/FiltersPanel.jsx'
import { ActiveFilterChips } from '../components/filters/FiltersPanel.jsx'

const FILTER_DEFAULTS = {
  category: 'all',
  availability: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'featured',
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: highest first' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

const FEATURED = PRODUCTS.find((product) => product.id === 'aurora-anc-headphones')

export function HomePage() {
  usePageTitle('Shop everyday essentials')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, status, error, isEmptyCatalogue, retry, resetDemo, demo } = useCatalog()
  const { addToCart } = useCart()
  const { ids: compareIds, toggleCompare } = useCompare()

  const query = searchParams.get('q') ?? ''
  const filters = {
    category: searchParams.get('category') ?? FILTER_DEFAULTS.category,
    availability: searchParams.get('availability') ?? FILTER_DEFAULTS.availability,
    minPrice: searchParams.get('min') ?? FILTER_DEFAULTS.minPrice,
    maxPrice: searchParams.get('max') ?? FILTER_DEFAULTS.maxPrice,
    sort: searchParams.get('sort') ?? FILTER_DEFAULTS.sort,
  }

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  )

  const priceError = useMemo(() => {
    const min = filters.minPrice === '' ? null : Number(filters.minPrice)
    const max = filters.maxPrice === '' ? null : Number(filters.maxPrice)
    if (min !== null && (!Number.isFinite(min) || min < 0)) return 'Enter a minimum price of zero or more.'
    if (max !== null && (!Number.isFinite(max) || max < 0)) return 'Enter a maximum price of zero or more.'
    if (min !== null && max !== null && min > max) return 'Minimum price cannot be greater than maximum price.'
    return ''
  }, [filters.minPrice, filters.maxPrice])

  const results = useMemo(
    () =>
      filterAndSortProducts(products, {
        query,
        category: filters.category,
        availability: filters.availability,
        // An invalid price range is reported below; keep the other filters
        // usable instead of silently showing a confusing empty result.
        minPrice: priceError ? '' : filters.minPrice,
        maxPrice: priceError ? '' : filters.maxPrice,
        sort: filters.sort,
      }),
    [
      products,
      query,
      filters.category,
      filters.availability,
      filters.minPrice,
      filters.maxPrice,
      filters.sort,
      priceError,
    ],
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (query.trim()) count += 1
    if (filters.category !== 'all') count += 1
    if (filters.availability !== 'all') count += 1
    if (filters.minPrice !== '' || filters.maxPrice !== '') count += 1
    return count
  }, [query, filters.category, filters.availability, filters.minPrice, filters.maxPrice])

  function updateParam(key, value, defaultValue = '') {
    const next = new URLSearchParams(searchParams)
    if (!value || value === defaultValue) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  function updateFilters(name, value) {
    if (name === 'minPrice') updateParam('min', value, '')
    else if (name === 'maxPrice') updateParam('max', value, '')
    else updateParam(name, value, FILTER_DEFAULTS[name])
  }

  function clearAllFilters() {
    setSearchParams({}, { replace: true })
  }

  function removeFilter(key) {
    const next = new URLSearchParams(searchParams)
    if (key === 'query') next.delete('q')
    else if (key === 'price') {
      next.delete('min')
      next.delete('max')
    } else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  function scrollToCatalogue() {
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSearchSubmit(value) {
    updateParam('q', value.trim(), '')
    scrollToCatalogue()
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-brand-blue/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-brand-sun/30 blur-3xl" aria-hidden="true" />
        <div className="container-shell relative grid items-center gap-10 py-12 lg:grid-cols-[1.06fr_0.94fr] lg:py-20">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-blue-strong/20 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-navy">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              Islamabad &amp; Rawalpindi delivery
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-brand-charcoal sm:text-5xl lg:text-6xl">
              Everyday essentials.
              <span className="relative mt-1 block text-brand-navy">
                Zero guesswork.
                <span className="absolute -bottom-2 left-0 h-3 w-40 -rotate-1 rounded-full bg-brand-blue/50 sm:w-56" aria-hidden="true" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-charcoal/65 sm:text-lg">
              Thoughtful tech, study, and lifestyle picks for campus life — with stock, delivery charges, and
              free-delivery eligibility shown before you add anything to your cart.
            </p>

            <div className="mt-7 max-w-xl">
              <SearchAutocomplete
                products={products}
                value={query}
                onChange={(value) => updateParam('q', value, '')}
                onSubmit={handleSearchSubmit}
                onProductSelect={(product) => navigate(`/products/${product.id}`)}
                placeholder="Try “headphones”, “audio”, or “Soundwave”"
                idPrefix="home-hero"
              />
              <p className="mt-2 text-xs text-brand-charcoal/50">
                Search by product name, brand, or category. Suggestions update as you type.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToCatalogue}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-charcoal px-5 text-sm font-bold text-white transition hover:bg-brand-ink focus-visible:outline-none"
              >
                Browse the catalogue
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
              <Link
                to="/about#rules"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-brand-charcoal/15 bg-white px-5 text-sm font-bold text-brand-charcoal transition hover:border-brand-charcoal/30 hover:bg-brand-blue-soft focus-visible:outline-none"
              >
                How delivery works
              </Link>
            </div>

            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-3 border-t border-brand-charcoal/10 pt-5">
              <div>
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-charcoal/45">Delivery</dt>
                <dd className="mt-1 text-sm font-bold text-brand-charcoal">1–3 working days</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-charcoal/45">Free over</dt>
                <dd className="mt-1 text-sm font-bold text-brand-charcoal">{formatPKR(FREE_DELIVERY_THRESHOLD)}</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-charcoal/45">Price display</dt>
                <dd className="mt-1 text-sm font-bold text-brand-charcoal">All in PKR</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute inset-6 rotate-3 rounded-[2.5rem] bg-brand-blue" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-white p-3 shadow-lift">
              <Link to={`/products/${FEATURED.id}`} className="block overflow-hidden rounded-[1.6rem]">
                <ProductImage
                  src={FEATURED.image}
                  alt="Aurora ANC Wireless Headphones photographed on a bright yellow background"
                  className="aspect-square w-full object-cover"
                  eager
                />
              </Link>
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand-blue-strong">This week’s pick</p>
                  <p className="mt-0.5 font-display text-lg font-semibold text-brand-charcoal">Aurora headphones</p>
                </div>
                <p className="rounded-full bg-brand-charcoal px-3 py-1.5 text-sm font-bold text-white">{formatPKR(FEATURED.price)}</p>
              </div>
            </div>

            <div className="absolute -right-2 top-8 rounded-2xl border border-brand-charcoal/10 bg-white px-3 py-2.5 shadow-card sm:-right-5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-brand-charcoal">
                <Truck aria-hidden="true" className="h-4 w-4 text-brand-navy" />
                Free delivery
              </p>
              <p className="mt-0.5 text-[0.65rem] text-brand-charcoal/55">On this item alone</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Cartly service promises" className="border-y border-brand-charcoal/10 bg-white">
        <div className="container-shell grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: 'Free over Rs. 2,000', text: 'Rs. 150 below the threshold' },
            { icon: MapPin, title: 'Local delivery', text: 'Explicit Islamabad & Rawalpindi areas' },
            { icon: SearchX, title: 'Stock you can trust', text: 'Availability shown before adding' },
            { icon: ShoppingBag, title: 'Simulated checkout', text: 'No payment is collected' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-blue-soft text-brand-navy">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-brand-charcoal">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-brand-charcoal/55">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="catalogue" className="container-shell scroll-mt-48 lg:scroll-mt-36 py-10 lg:py-14" aria-labelledby="catalogue-heading">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-blue-strong">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              The catalogue
            </p>
            <h2 id="catalogue-heading" className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
              Find your next everyday favourite
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/60">
              Search, combine filters, and sort by price or rating. Every control updates the same result list.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <label htmlFor="sort-products" className="text-xs font-bold uppercase tracking-[0.14em] text-brand-charcoal/55">
              Sort products
            </label>
            <select
              id="sort-products"
              value={filters.sort}
              onChange={(event) => updateParam('sort', event.target.value, FILTER_DEFAULTS.sort)}
              className="mt-1.5 h-11 w-full rounded-xl border border-brand-charcoal/15 bg-white px-3 text-sm font-medium text-brand-charcoal outline-none focus:border-brand-blue-strong focus:ring-4 focus:ring-brand-blue/30"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2" aria-label="Browse categories">
          <button
            type="button"
            onClick={() => updateParam('category', 'all', 'all')}
            aria-pressed={filters.category === 'all'}
            className={`inline-flex h-9 items-center rounded-full border px-3.5 text-xs font-bold transition focus-visible:outline-none ${
              filters.category === 'all'
                ? 'border-brand-charcoal bg-brand-charcoal text-white'
                : 'border-brand-charcoal/15 bg-white text-brand-charcoal hover:border-brand-charcoal/30'
            }`}
          >
            All products
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => updateParam('category', category, 'all')}
              aria-pressed={filters.category === category}
              className={`inline-flex h-9 items-center rounded-full border px-3.5 text-xs font-bold transition focus-visible:outline-none ${
                filters.category === category
                  ? 'border-brand-charcoal bg-brand-charcoal text-white'
                  : 'border-brand-charcoal/15 bg-white text-brand-charcoal hover:border-brand-charcoal/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <ActiveFilterChips
            query={query}
            filters={filters}
            onRemove={removeFilter}
            onClearAll={clearAllFilters}
          />
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <FiltersPanel
            categories={categories}
            filters={filters}
            onChange={updateFilters}
            onClear={clearAllFilters}
            activeFilterCount={activeFilterCount}
            priceError={priceError}
            resultCount={results.length}
            totalCount={products.length}
          />

          <div className="min-w-0">
            {status === 'loading' && (
              <div aria-busy="true" aria-live="polite">
                <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-charcoal/65">
                  <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Loading the Cartly catalogue…
                </p>
                <ProductGridSkeleton />
              </div>
            )}

            {status === 'error' && (
              <EmptyState
                icon={AlertTriangle}
                eyebrow="Loading problem"
                title="The catalogue didn't load"
                description={error ?? 'Something went wrong while loading products.'}
                action={
                  <button
                    type="button"
                    onClick={retry}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink focus-visible:outline-none"
                  >
                    <RefreshCw aria-hidden="true" className="h-4 w-4" />
                    Retry loading
                  </button>
                }
                secondaryAction={
                  <Link
                    to="/about"
                    className="inline-flex h-11 items-center rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal transition hover:border-brand-charcoal/30"
                  >
                    Visit the About page
                  </Link>
                }
              />
            )}

            {status === 'success' && isEmptyCatalogue && (
              <EmptyState
                icon={ShoppingBag}
                eyebrow="Empty catalogue"
                title="There are no products in the catalogue right now"
                description={
                  demo.emptyCatalogue
                    ? 'The empty-catalogue demo is active. This is different from a search with no matches — the dataset itself has no records.'
                    : 'The local catalogue returned no records. Reload the standard demo data or try again.'
                }
                action={
                  <button
                    type="button"
                    onClick={demo.emptyCatalogue ? resetDemo : retry}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink focus-visible:outline-none"
                  >
                    <RefreshCw aria-hidden="true" className="h-4 w-4" />
                    {demo.emptyCatalogue ? 'Restore the catalogue' : 'Reload catalogue'}
                  </button>
                }
              />
            )}

            {status === 'success' && !isEmptyCatalogue && (
              <>
                {priceError && (
                  <StatusMessage tone="error" className="mb-4">
                    {priceError} Price filtering is paused until the range is corrected; the other filters
                    still apply.
                  </StatusMessage>
                )}

                {results.length === 0 ? (
                  <EmptyState
                    icon={SearchX}
                    eyebrow="No matching results"
                    title="No products match these choices"
                    description={`The catalogue has ${products.length} products, but none match ${
                      query.trim() ? `“${query.trim()}”` : 'the current filters'
                    }. Try removing a filter, widening the price range, or searching for a brand such as Soundwave.`}
                    action={
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
                      >
                        <Filter aria-hidden="true" className="h-4 w-4" />
                        Clear search and filters
                      </button>
                    }
                  />
                ) : (
                  <>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-brand-charcoal/60" role="status">
                        <strong className="text-brand-charcoal">{results.length}</strong>{' '}
                        {results.length === 1 ? 'product' : 'products'}
                        {query.trim() ? ` for “${query.trim()}”` : ''}
                      </p>
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={clearAllFilters}
                          className="text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2 hover:decoration-brand-navy"
                        >
                          Reset all
                        </button>
                      )}
                    </div>
                    <ProductGrid
                      products={results}
                      onAddToCart={addToCart}
                      onToggleCompare={toggleCompare}
                      compareIds={compareIds}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container-shell pb-14" aria-labelledby="improvements-heading">
        <div className="overflow-hidden rounded-3xl bg-brand-charcoal px-6 py-8 text-white sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">Built for clarity</p>
              <h2 id="improvements-heading" className="mt-2 font-display text-3xl font-semibold tracking-tight">
                Three fixes you can feel
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Cartly's discovery and checkout experience responds to three frontend problems investigated in
                comparable retail sites.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { number: '01', title: 'Helpful search', text: 'Name, brand, and category suggestions while typing.' },
                { number: '02', title: 'Delivery up front', text: 'Fees, free-delivery gap, and eligible areas on each product.' },
                { number: '03', title: 'Real filters', text: 'Price range, availability, category, and two-way sorting.' },
              ].map((item) => (
                <div key={item.number} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold text-brand-blue">{item.number}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
