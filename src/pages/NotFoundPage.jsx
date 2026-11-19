import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, ShoppingBag } from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { EmptyState } from '../components/ui/EmptyState.jsx'

export function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <div className="container-shell py-12 lg:py-20">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="font-display text-[7rem] font-semibold leading-none text-brand-blue sm:text-[10rem]" aria-hidden="true">
            404
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-brand-charcoal">
            This page took a wrong turn
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-brand-charcoal/60">
            The address may be mistyped, or the page may no longer exist. The catalogue, cart, and delivery
            rules are all still a click away.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to the shop
            </Link>
            <Link
              to="/about"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal transition hover:border-brand-charcoal/30"
            >
              <Compass aria-hidden="true" className="h-4 w-4" />
              About Cartly
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <EmptyState
            icon={ShoppingBag}
            title="Looking for something?"
            description="Search the catalogue by product name, brand, or category from the shop page."
            action={
              <Link
                to="/"
                className="inline-flex h-11 items-center rounded-xl bg-brand-blue px-4 text-sm font-bold text-brand-charcoal"
              >
                Open the catalogue
              </Link>
            }
          />
        </div>
      </div>
    </div>
  )
}
