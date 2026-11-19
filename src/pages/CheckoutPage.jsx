import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Check,
  ChevronRight,
  LockKeyhole,
  MapPin,
  RefreshCw,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useCatalog } from '../context/CatalogContext.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import {
  CHECKOUT_INITIAL_VALUES,
  getAreasForCity,
  validateCheckoutForm,
} from '../lib/validation.js'
import {
  calculateOrderTotals,
  formatPKR,
  isSupportedArea,
  validateStockQuantity,
} from '../lib/businessRules.js'
import {
  DELIVERY_AREAS,
  SERVICE_CITIES,
  UNSUPPORTED_AREA_OPTION,
} from '../data/deliveryAreas.js'
import { placeSimulatedOrder } from '../services/orderService.js'
import { OrderSummary } from '../components/cart/OrderSummary.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { StatusMessage } from '../components/ui/StatusMessage.jsx'
import { Spinner } from '../components/ui/Spinner.jsx'

const FIELD_LABELS = {
  fullName: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  address: 'Delivery address',
  city: 'City',
  area: 'Area',
}

const inputClass =
  'mt-1.5 h-11 w-full rounded-xl border border-brand-charcoal/15 bg-white px-3 text-sm font-medium text-brand-charcoal outline-none transition placeholder:text-brand-charcoal/40 focus:border-brand-blue-strong focus:ring-4 focus:ring-brand-blue/30 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/40'

export function CheckoutPage() {
  usePageTitle('Checkout')
  const navigate = useNavigate()
  const { status, retry } = useCatalog()
  const { cartLines, itemCount, subtotal, clearCart } = useCart()
  const [values, setValues] = useState(CHECKOUT_INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [blurred, setBlurred] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderError, setOrderError] = useState('')
  const summaryRef = useRef(null)

  const totals = calculateOrderTotals(subtotal)
  const areaOptions = getAreasForCity(values.city)
  const errorEntries = Object.entries(errors)

  function showError(field) {
    return Boolean((submitted || blurred[field]) && errors[field])
  }

  function handleChange(field, value) {
    const nextValues = { ...values, [field]: value }
    if (field === 'city') nextValues.area = ''

    setValues(nextValues)

    if (submitted || blurred[field]) {
      setErrors(validateCheckoutForm(nextValues))
    }
  }

  function handleBlur(field) {
    setBlurred((previous) => ({ ...previous, [field]: true }))
    setErrors(validateCheckoutForm(values))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isPlacing) return

    setSubmitted(true)
    setOrderError('')
    const nextErrors = validateCheckoutForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        summaryRef.current?.focus()
        summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return
    }

    if (cartLines.length === 0) {
      setOrderError('Your cart is empty. Add a product before placing an order.')
      return
    }

    for (const line of cartLines) {
      const stockCheck = validateStockQuantity(line.product.stock, line.quantity)
      if (!stockCheck.ok) {
        setOrderError(
          `${line.product.name}: ${stockCheck.message} Update the quantity in your cart before checking out.`,
        )
        return
      }
    }

    if (!isSupportedArea(values.city, values.area)) {
      setOrderError('The selected city and area are not in Cartly’s delivery zone. Choose a supported area to continue.')
      return
    }

    setIsPlacing(true)
    try {
      const order = await placeSimulatedOrder({
        items: cartLines,
        totals,
        city: values.city,
        area: values.area,
      })
      clearCart()
      navigate(`/order-confirmation/${order.id}`, { replace: true })
    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : 'The simulated order could not be placed. Please try again.',
      )
    } finally {
      setIsPlacing(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container-shell py-12">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal/65" role="status">
          <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" />
          Loading checkout…
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="container-shell py-12">
        <EmptyState
          icon={AlertTriangle}
          eyebrow="Catalogue unavailable"
          title="Checkout needs current stock and prices"
          description="Reload the catalogue before continuing so your selections and delivery fee can be verified."
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
            <Link to="/" className="inline-flex h-11 items-center rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal">
              Back to shop
            </Link>
          }
        />
      </div>
    )
  }

  if (itemCount === 0) {
    return (
      <div className="container-shell py-12">
        <EmptyState
          icon={ShoppingBag}
          eyebrow="Checkout"
          title="Your cart is empty"
          description="Add at least one product before entering delivery details."
          action={
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-charcoal px-4 text-sm font-bold text-white transition hover:bg-brand-ink"
            >
              Browse products
            </Link>
          }
          secondaryAction={
            <Link to="/cart" className="inline-flex h-11 items-center rounded-xl border border-brand-charcoal/15 bg-white px-4 text-sm font-bold text-brand-charcoal">
              View cart
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-shell py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-brand-charcoal/55">
        <Link to="/cart" className="hover:text-brand-navy hover:underline">Cart</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="text-brand-charcoal" aria-current="page">Checkout</span>
      </nav>

      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">Almost there</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-brand-charcoal">Checkout</h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/60">
          Enter delivery details, review the calculated total, and place a simulated order. No payment is collected.
        </p>
      </div>

      {submitted && errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 focus:outline-none focus:ring-4 focus:ring-red-200"
        >
          <h2 className="flex items-center gap-2 text-sm font-bold text-red-950">
            <AlertTriangle aria-hidden="true" className="h-4 w-4" />
            Check the highlighted fields
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-red-900">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a href={`#checkout-${field}`} className="underline decoration-red-400 underline-offset-2 hover:decoration-red-800">
                  {FIELD_LABELS[field]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {orderError && (
        <StatusMessage tone="error" className="mt-4" dismissible onDismiss={() => setOrderError('')}>
          {orderError}{' '}
          <Link to="/cart" className="font-bold underline underline-offset-2">
            Review your cart
          </Link>
        </StatusMessage>
      )}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form id="checkout-form" noValidate onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="rounded-3xl border border-brand-charcoal/10 bg-white p-5 shadow-card sm:p-6">
            <legend className="flex items-center gap-2 px-1 font-display text-xl font-semibold text-brand-charcoal">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-blue-soft text-brand-navy">
                <Check aria-hidden="true" className="h-4 w-4" />
              </span>
              Contact details
            </legend>
            <p className="mt-1 text-xs leading-relaxed text-brand-charcoal/55">
              Used only to demonstrate validation in this session. These values are not saved to local storage.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="checkout-fullName" className="text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/60">
                  Full name <span aria-hidden="true" className="text-red-700">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <input
                  id="checkout-fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={values.fullName}
                  onChange={(event) => handleChange('fullName', event.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  aria-invalid={showError('fullName')}
                  aria-describedby={showError('fullName') ? 'checkout-fullName-error' : undefined}
                  placeholder="e.g. Ayesha Khan"
                  className={inputClass}
                />
                {showError('fullName') && (
                  <p id="checkout-fullName-error" className="mt-1.5 text-xs font-semibold text-red-800">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-email" className="text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/60">
                  Email address <span aria-hidden="true" className="text-red-700">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={showError('email')}
                  aria-describedby={showError('email') ? 'checkout-email-error' : undefined}
                  placeholder="name@example.com"
                  className={inputClass}
                />
                {showError('email') && (
                  <p id="checkout-email-error" className="mt-1.5 text-xs font-semibold text-red-800">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-phone" className="text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/60">
                  Phone number <span aria-hidden="true" className="text-red-700">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={values.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  onBlur={() => handleBlur('phone')}
                  aria-invalid={showError('phone')}
                  aria-describedby={showError('phone') ? 'checkout-phone-error' : 'checkout-phone-hint'}
                  placeholder="0300 1234567"
                  className={inputClass}
                />
                {showError('phone') ? (
                  <p id="checkout-phone-error" className="mt-1.5 text-xs font-semibold text-red-800">
                    {errors.phone}
                  </p>
                ) : (
                  <p id="checkout-phone-hint" className="mt-1.5 text-xs text-brand-charcoal/50">
                    Pakistani mobile, e.g. 0300 1234567 or +92 300 1234567.
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border border-brand-charcoal/10 bg-white p-5 shadow-card sm:p-6">
            <legend className="flex items-center gap-2 px-1 font-display text-xl font-semibold text-brand-charcoal">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-blue-soft text-brand-navy">
                <MapPin aria-hidden="true" className="h-4 w-4" />
              </span>
              Delivery details
            </legend>
            <p className="mt-1 text-xs leading-relaxed text-brand-charcoal/55">
              Cartly delivers only to the listed areas in Islamabad and Rawalpindi.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="checkout-address" className="text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/60">
                  Delivery address <span aria-hidden="true" className="text-red-700">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <textarea
                  id="checkout-address"
                  name="address"
                  rows="3"
                  autoComplete="street-address"
                  required
                  value={values.address}
                  onChange={(event) => handleChange('address', event.target.value)}
                  onBlur={() => handleBlur('address')}
                  aria-invalid={showError('address')}
                  aria-describedby={showError('address') ? 'checkout-address-error' : undefined}
                  placeholder="House / flat, street, landmark"
                  className={`${inputClass} h-auto min-h-24 resize-y py-3`}
                />
                {showError('address') && (
                  <p id="checkout-address-error" className="mt-1.5 text-xs font-semibold text-red-800">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="checkout-city" className="text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/60">
                    City <span aria-hidden="true" className="text-red-700">*</span>
                    <span className="sr-only"> (required)</span>
                  </label>
                  <select
                    id="checkout-city"
                    name="city"
                    required
                    value={values.city}
                    onChange={(event) => handleChange('city', event.target.value)}
                    onBlur={() => handleBlur('city')}
                    aria-invalid={showError('city')}
                    aria-describedby={showError('city') ? 'checkout-city-error' : undefined}
                    className={inputClass}
                  >
                    <option value="">Choose a city</option>
                    {SERVICE_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                    <option value="Other city">Other city (not serviceable)</option>
                  </select>
                  {showError('city') && (
                    <p id="checkout-city-error" className="mt-1.5 text-xs font-semibold text-red-800">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-area" className="text-xs font-bold uppercase tracking-[0.12em] text-brand-charcoal/60">
                    Area <span aria-hidden="true" className="text-red-700">*</span>
                    <span className="sr-only"> (required)</span>
                  </label>
                  <select
                    id="checkout-area"
                    name="area"
                    required
                    value={values.area}
                    onChange={(event) => handleChange('area', event.target.value)}
                    onBlur={() => handleBlur('area')}
                    disabled={areaOptions.length === 0}
                    aria-invalid={showError('area')}
                    aria-describedby={showError('area') ? 'checkout-area-error' : 'checkout-area-hint'}
                    className={`${inputClass} disabled:cursor-not-allowed disabled:bg-brand-charcoal/[0.04] disabled:text-brand-charcoal/40`}
                  >
                    <option value="">{areaOptions.length === 0 ? 'Choose a city first' : 'Choose an area'}</option>
                    {areaOptions.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                    {areaOptions.length > 0 && (
                      <option value={UNSUPPORTED_AREA_OPTION}>{UNSUPPORTED_AREA_OPTION}</option>
                    )}
                  </select>
                  {showError('area') ? (
                    <p id="checkout-area-error" className="mt-1.5 text-xs font-semibold text-red-800">
                      {errors.area}
                    </p>
                  ) : (
                    <p id="checkout-area-hint" className="mt-1.5 text-xs text-brand-charcoal/50">
                      Only listed areas can proceed. “{UNSUPPORTED_AREA_OPTION}” is rejected as a demo.
                    </p>
                  )}
                </div>
              </div>

              <details className="rounded-xl bg-brand-cream p-3">
                <summary className="cursor-pointer text-xs font-bold text-brand-navy">
                  View supported areas
                </summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {SERVICE_CITIES.map((city) => (
                    <div key={city}>
                      <p className="text-xs font-bold text-brand-charcoal">{city}</p>
                      <p className="mt-1 text-[0.7rem] leading-relaxed text-brand-charcoal/60">
                        {DELIVERY_AREAS[city].join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </fieldset>

          <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-4">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-brand-charcoal/60">
              <LockKeyhole aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy" />
              <span>
                <strong className="text-brand-charcoal">Simulated order.</strong> No card details or payment are
                requested. Name, email, phone, and street address remain in memory for this session and are not
                written to local storage.
              </span>
            </p>
          </div>
        </form>

        <div className="lg:sticky lg:top-40">
          <OrderSummary lines={cartLines} subtotal={subtotal} title="Review and total" compact>
            <div className="rounded-xl bg-brand-cream p-3 text-xs leading-relaxed text-brand-charcoal/65">
              <p className="flex items-center gap-1.5 font-bold text-brand-charcoal">
                <Truck aria-hidden="true" className="h-4 w-4 text-brand-navy" />
                Delivering to
              </p>
              <p className="mt-1">
                {values.area && values.city ? `${values.area}, ${values.city}` : 'Choose a city and area'}
              </p>
              <p className="mt-1">Estimated delivery: 1–3 working days after confirmation</p>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={isPlacing}
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-blue/80 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
            >
              {isPlacing ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Placing simulated order…
                </>
              ) : (
                <>
                  Place simulated order
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-2 text-center text-[0.7rem] text-brand-charcoal/50">
              Calculated total: <strong>{formatPKR(totals.total)}</strong>
            </p>
          </OrderSummary>
        </div>
      </div>
    </div>
  )
}
