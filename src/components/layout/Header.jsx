import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Scale, ShoppingCart, X } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useCompare } from '../../context/CompareContext.jsx'
import { SearchAutocomplete } from '../search/SearchAutocomplete.jsx'
import { Logo } from '../ui/Logo.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-xl px-3 py-2 text-sm font-bold transition focus-visible:outline-none ${
    isActive
      ? 'bg-brand-blue-soft text-brand-navy'
      : 'text-brand-charcoal/70 hover:bg-brand-blue-soft/70 hover:text-brand-charcoal'
  }`

export function Header() {
  const { products } = useCatalog()
  const { itemCount } = useCart()
  const { ids: compareIds } = useCompare()
  const navigate = useNavigate()
  const location = useLocation()
  const [headerQuery, setHeaderQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  function submitSearch(query) {
    const trimmed = query.trim()
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/')
    setHeaderQuery('')
  }

  const cartLabel = `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-brand-charcoal text-white">
        <div className="container-shell flex min-h-9 flex-wrap items-center justify-center gap-x-2 gap-y-1 py-2 text-center text-[0.7rem] font-semibold tracking-wide sm:text-xs">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-blue" aria-hidden="true" />
          <span>Free delivery on orders of Rs. 2,000 or more</span>
          <span className="hidden text-white/45 sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="text-white/75">Islamabad &amp; Rawalpindi only</span>
        </div>
      </div>

      <header className="border-b border-brand-charcoal/10 bg-brand-cream/95 backdrop-blur">
        <div className="container-shell">
          <div className="flex min-h-[4.5rem] items-center gap-4 py-3">
            <Logo />

            <nav aria-label="Main navigation" className="ml-4 hidden items-center gap-1 md:flex">
              <NavLink to="/" end className={navLinkClass}>
                Shop
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About Cartly
              </NavLink>
            </nav>

            <div className="ml-auto hidden max-w-md flex-1 lg:block">
              <SearchAutocomplete
                products={products}
                value={headerQuery}
                onChange={setHeaderQuery}
                onSubmit={submitSearch}
                onProductSelect={(product) => {
                  navigate(`/products/${product.id}`)
                  setHeaderQuery('')
                }}
                placeholder="Search products, brands, categories…"
                idPrefix="header"
                size="sm"
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5 lg:ml-3">
              <Link
                to="/about#compare"
                className="relative hidden h-11 w-11 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-blue-soft focus-visible:outline-none sm:inline-flex"
                aria-label={`Compare list, ${compareIds.length} products`}
                title="How comparison works"
              >
                <Scale aria-hidden="true" className="h-5 w-5" />
                {compareIds.length > 0 && (
                  <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-charcoal px-1 text-[0.65rem] font-bold text-white">
                    {compareIds.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative inline-flex h-11 items-center gap-2 rounded-xl bg-brand-blue px-3 text-sm font-bold text-brand-charcoal transition hover:bg-brand-blue/80 focus-visible:outline-none sm:px-4"
                aria-label={cartLabel}
              >
                <ShoppingCart aria-hidden="true" className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-charcoal px-1 text-[0.68rem] font-bold text-white">
                  {itemCount}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-blue-soft focus-visible:outline-none md:hidden"
              >
                {mobileMenuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="pb-3 lg:hidden">
            <SearchAutocomplete
              products={products}
              value={headerQuery}
              onChange={setHeaderQuery}
              onSubmit={submitSearch}
              onProductSelect={(product) => {
                navigate(`/products/${product.id}`)
                setHeaderQuery('')
              }}
              placeholder="Search products, brands, categories…"
              idPrefix="header-mobile"
              size="sm"
            />
          </div>

          {mobileMenuOpen && (
            <nav
              id="mobile-menu"
              aria-label="Mobile navigation"
              className="border-t border-brand-charcoal/10 pb-4 pt-3 md:hidden"
            >
              <ul className="grid gap-1">
                <li>
                  <NavLink to="/" end className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                    Shop all products
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/cart" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                    Cart ({itemCount})
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                    About Cartly
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about#rules" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                    Delivery rules
                  </NavLink>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
    </div>
  )
}
