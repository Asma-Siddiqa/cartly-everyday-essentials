import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  PackageCheck,
  Scale,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { DemoControls } from '../components/demo/DemoControls.jsx'
import { DELIVERY_AREAS, SERVICE_CITIES, UNSUPPORTED_AREA_OPTION } from '../data/deliveryAreas.js'
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  formatPKR,
} from '../lib/businessRules.js'

const profile = [
  {
    label: 'Business identity',
    value: 'Cartly — a local online retailer',
    detail:
      'A curated shop for practical tech, study, home, and lifestyle products. The catalogue contains 13 locally priced products with stock and delivery details.',
  },
  {
    label: 'Primary audience',
    value: 'Students and young professionals',
    detail:
      'People setting up a hostel room, commuting across the twin cities, or buying useful gifts without wading through marketplace clutter.',
  },
  {
    label: 'Operating area',
    value: 'Selected areas of Islamabad and Rawalpindi',
    detail:
      'Delivery is limited to the explicit area list below. The checkout rejects unsupported cities and areas rather than accepting every location.',
  },
  {
    label: 'Main customer task',
    value: 'Find, compare, and order everyday essentials',
    detail:
      'Browse, search, combine filters, compare up to three products, build a cart, and complete a delivery checkout.',
  },
  {
    label: 'Business goal',
    value: 'A transparent, low-surprise purchase',
    detail:
      'Show stock and delivery costs before checkout so customers can make a confident decision and complete the order without unexpected conditions.',
  },
]

export function AboutPage() {
  usePageTitle('About Cartly')
  const [searchParams] = useSearchParams()
  const showTestControls = searchParams.has('test')

  return (
    <div>
      <section className="relative overflow-hidden border-b border-brand-charcoal/10 bg-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl" aria-hidden="true" />
        <div className="container-shell relative py-12 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue-strong">About the shop</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-brand-charcoal sm:text-5xl">
            Useful things, chosen carefully for life between campus and the city.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-charcoal/65">
            Cartly is an Islamabad–Rawalpindi retailer built around the details that make online
            shopping easy: finding the right product, knowing what delivery will cost, and knowing
            which areas we serve.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
            >
              <ShoppingBag aria-hidden="true" className="h-4 w-4" />
              Shop the catalogue
            </Link>
            <a
              href="#rules"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal transition hover:border-brand-charcoal/30 hover:bg-brand-blue-soft"
            >
              Read our customer policies
            </a>
          </div>
        </div>
      </section>

      <section className="container-shell py-12" aria-labelledby="profile-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">Business profile</p>
            <h2 id="profile-heading" className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
              Why shop with Cartly
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-brand-charcoal/55">
            Local data, local prices, local delivery. Every product record has a stable ID, stock count, PKR
            price, rating, image, and delivery estimate.
          </p>
        </div>

        <dl className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {profile.map((item) => (
            <div key={item.label} className="rounded-2xl border border-brand-charcoal/10 bg-white p-5 shadow-card">
              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-brand-charcoal/45">
                {item.label}
              </dt>
              <dd className="mt-2 font-display text-xl font-semibold text-brand-charcoal">{item.value}</dd>
              <dd className="mt-2 text-sm leading-relaxed text-brand-charcoal/60">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="rules" className="scroll-mt-48 lg:scroll-mt-36 border-y border-brand-charcoal/10 bg-white py-12" aria-labelledby="rules-heading">
        <div className="container-shell">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">Customer policies</p>
          <h2 id="rules-heading" className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
            Good to know before you order
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-charcoal/60">
            Clear, simple policies on stock, delivery areas, and charges — so there are no surprises at checkout.
          </p>

          <div className="mt-7 grid gap-5 xl:grid-cols-3">
            <article className="rounded-3xl border border-brand-charcoal/10 bg-brand-cream p-5" aria-labelledby="stock-rule">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-blue-soft text-brand-navy">
                <PackageCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 id="stock-rule" className="mt-4 font-display text-xl font-semibold text-brand-charcoal">
                1. Stock availability
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/65">
                A customer can order between 1 unit and the currently available stock. Zero-stock products
                cannot be added. The quantity controls stop at the available limit, and your cart is checked
                again when you place the order.
              </p>
              <dl className="mt-4 space-y-2 text-xs">
                <div>
                  <dt className="font-bold uppercase tracking-wide text-brand-charcoal/45">Where you'll see it</dt>
                  <dd className="mt-0.5 text-brand-charcoal/65">Product card badge, product page quantity area, cart stock note.</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-wide text-brand-charcoal/45">Example</dt>
                  <dd className="mt-0.5 text-brand-charcoal/65">With 4 in stock, you can order up to 4. Asking for more shows “Only 4 units are available.”</dd>
                </div>
              </dl>
              <Link to="/products/hydra-steel-bottle" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2">
                See an out-of-stock product
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </article>

            <article className="rounded-3xl border border-brand-charcoal/10 bg-brand-cream p-5" aria-labelledby="area-rule">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-900">
                <MapPin aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 id="area-rule" className="mt-4 font-display text-xl font-semibold text-brand-charcoal">
                2. Delivery eligibility
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/65">
                Delivery is available only in the listed {SERVICE_CITIES.join(' and ')} areas.
                Please choose a supported city and area at checkout.
              </p>
              <dl className="mt-4 space-y-2 text-xs">
                <div>
                  <dt className="font-bold uppercase tracking-wide text-brand-charcoal/45">Where you'll see it</dt>
                  <dd className="mt-0.5 text-brand-charcoal/65">Product delivery panel, checkout area list, and error messages.</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-wide text-brand-charcoal/45">Example</dt>
                  <dd className="mt-0.5 text-brand-charcoal/65">F-11 in Islamabad is supported. “{UNSUPPORTED_AREA_OPTION}” and areas outside our list are not.</dd>
                </div>
              </dl>
              <a href="#delivery" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy underline decoration-brand-navy/30 underline-offset-2">
                View the supported areas
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </article>

            <article className="rounded-3xl border border-brand-charcoal/10 bg-brand-cream p-5" aria-labelledby="price-rule">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-900">
                <CircleDollarSign aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 id="price-rule" className="mt-4 font-display text-xl font-semibold text-brand-charcoal">
                3. Delivery pricing
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/65">
                Product subtotals below {formatPKR(FREE_DELIVERY_THRESHOLD)} add {formatPKR(DELIVERY_FEE)}
                delivery. At {formatPKR(FREE_DELIVERY_THRESHOLD)} or more, delivery is free. The same total
                appears on the product page, in your cart, and at checkout.
              </p>
              <dl className="mt-4 space-y-2 text-xs">
                <div>
                  <dt className="font-bold uppercase tracking-wide text-brand-charcoal/45">Where you'll see it</dt>
                  <dd className="mt-0.5 text-brand-charcoal/65">Product panel, free-delivery note, cart summary, checkout total.</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-wide text-brand-charcoal/45">Example</dt>
                  <dd className="mt-0.5 text-brand-charcoal/65">
                    {formatPKR(1999)} → {formatPKR(150)} fee · {formatPKR(2000)} → free · {formatPKR(2001)} → free.
                  </dd>
                </div>
              </dl>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy">
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
                Calculated automatically at checkout
              </span>
            </article>
          </div>

          <div id="delivery" className="mt-8 scroll-mt-48 lg:scroll-mt-36 rounded-3xl border border-brand-blue-strong/20 bg-brand-blue-soft p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h3 className="font-display text-2xl font-semibold text-brand-charcoal">Supported delivery areas</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/65">
                  These are the areas we currently serve. Please choose one from this list when you check out.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy">
                  <Truck aria-hidden="true" className="h-4 w-4" />
                  Estimated delivery: 1–3 working days after confirmation
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {SERVICE_CITIES.map((city) => (
                  <div key={city} className="rounded-2xl bg-white/80 p-4">
                    <h4 className="text-sm font-bold text-brand-charcoal">{city}</h4>
                    <ul className="mt-2 grid grid-cols-1 gap-1 text-xs text-brand-charcoal/65 min-[420px]:grid-cols-2">
                      {DELIVERY_AREAS[city].map((area) => (
                        <li key={area} className="flex items-start gap-1">
                          <Check aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="compare" className="container-shell scroll-mt-48 lg:scroll-mt-36 py-12" aria-labelledby="compare-heading">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">Product comparison</p>
            <h2 id="compare-heading" className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
              Compare up to three products without losing your place
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/60">
              The compare tray keeps a shortlist visible while you browse. Open it for a side-by-side view of
              price, rating, stock, brand, and delivery. Your compare list is stored locally in this browser,
              just like the cart, and never includes customer details.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
              >
                <Scale aria-hidden="true" className="h-4 w-4" />
                Start comparing
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-4 shadow-card">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-700" />
              <p className="mt-3 text-sm font-bold text-brand-charcoal">Clear selection</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-charcoal/60">
                Selected products are clearly marked so you always know what's on your shortlist.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-4 shadow-card">
              <XCircle aria-hidden="true" className="h-5 w-5 text-brand-charcoal/50" />
              <p className="mt-3 text-sm font-bold text-brand-charcoal">Clear limit</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-charcoal/60">
                The tray shows your count, up to three products. Remove one to add another.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-4 shadow-card">
              <Scale aria-hidden="true" className="h-5 w-5 text-brand-navy" />
              <p className="mt-3 text-sm font-bold text-brand-charcoal">Side-by-side details</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-charcoal/60">
                Compare price, rating, stock, brand, and delivery — the details that help you decide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {showTestControls && (
        <section className="container-shell pb-12" aria-labelledby="test-controls-heading">
          <h2 id="test-controls-heading" className="sr-only">Testing controls</h2>
          <DemoControls />
        </section>
      )}
    </div>
  )
}
