import { DELIVERY_AREAS, SERVICE_CITIES } from '../data/deliveryAreas.js'

export const DELIVERY_FEE = 150
export const FREE_DELIVERY_THRESHOLD = 2000

const currencyFormatter = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0,
})

export function formatPKR(amount) {
  return `Rs. ${currencyFormatter.format(Number.isFinite(amount) ? amount : 0)}`
}

/**
 * Stock rule.
 * - At least one unit must be requested.
 * - Zero stock cannot be ordered.
 * - Exactly the available stock is allowed.
 * - One unit above the available stock is rejected.
 */
export function validateStockQuantity(stock, requestedQuantity) {
  const available = Number.isInteger(Number(stock)) && Number(stock) >= 0 ? Number(stock) : 0
  const requested = Number(requestedQuantity)

  if (!Number.isInteger(requested) || requested < 1) {
    return {
      ok: false,
      code: 'INVALID_QUANTITY',
      available,
      message: 'Choose at least one unit.',
    }
  }

  if (available === 0) {
    return {
      ok: false,
      code: 'OUT_OF_STOCK',
      available,
      message: 'This product is currently out of stock.',
    }
  }

  if (requested > available) {
    return {
      ok: false,
      code: 'INSUFFICIENT_STOCK',
      available,
      message: `Only ${available} ${available === 1 ? 'unit is' : 'units are'} available.`,
    }
  }

  return {
    ok: true,
    code: 'OK',
    available,
    requested,
    message: '',
  }
}

/**
 * Delivery pricing rule.
 * Orders below Rs. 2,000 cost Rs. 150; Rs. 2,000 or more is free.
 * Invalid negative/NaN subtotals are treated as zero for defensive rendering.
 */
export function getDeliveryFee(subtotal) {
  const safeSubtotal = Number.isFinite(Number(subtotal)) && Number(subtotal) > 0 ? Number(subtotal) : 0
  return safeSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}

export function getAmountUntilFreeDelivery(subtotal) {
  const safeSubtotal = Number.isFinite(Number(subtotal)) && Number(subtotal) > 0 ? Number(subtotal) : 0
  return Math.max(0, FREE_DELIVERY_THRESHOLD - safeSubtotal)
}

export function calculateOrderTotals(subtotal) {
  const safeSubtotal = Number.isFinite(Number(subtotal)) && Number(subtotal) > 0 ? Number(subtotal) : 0
  const deliveryFee = getDeliveryFee(safeSubtotal)
  const amountUntilFreeDelivery = getAmountUntilFreeDelivery(safeSubtotal)

  return {
    subtotal: safeSubtotal,
    deliveryFee,
    total: safeSubtotal + deliveryFee,
    amountUntilFreeDelivery,
    qualifiesForFreeDelivery: deliveryFee === 0 && safeSubtotal > 0,
  }
}

/**
 * Delivery eligibility rule.
 * City and area must both appear in the explicit local service-area data.
 */
export function isSupportedArea(city, area) {
  if (typeof city !== 'string' || typeof area !== 'string') return false
  if (!SERVICE_CITIES.includes(city)) return false

  return DELIVERY_AREAS[city].some(
    (supportedArea) => supportedArea.toLowerCase() === area.trim().toLowerCase(),
  )
}

export function getDeliveryLabel(subtotal) {
  return getDeliveryFee(subtotal) === 0 ? 'Free delivery' : `${formatPKR(DELIVERY_FEE)} delivery`
}
