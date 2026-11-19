import { PRODUCTS } from '../data/products.js'
import { DEMO_CONFIG } from '../config/demo.js'

const SOLD_OUT_PRODUCT_IDS = new Set([
  'aurora-anc-headphones',
  'clickcraft-mechanical-keyboard',
  'pulse-mini-speaker',
  'orbit-smartwatch-s2',
])

/**
 * Applies a clearly labelled demo availability scenario to a copy of the
 * catalogue. The React app always uses this loader, so changed availability is
 * visible on the listing, details, cart, and checkout pages.
 */
export function applyAvailabilityScenario(products, scenario = 'standard') {
  return products.map((product) => {
    if (scenario === 'limited') {
      return { ...product, stock: product.stock > 0 ? Math.min(product.stock, 2) : 0 }
    }

    if (scenario === 'sold-out') {
      return {
        ...product,
        stock: SOLD_OUT_PRODUCT_IDS.has(product.id) ? 0 : product.stock,
      }
    }

    return { ...product }
  })
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

/**
 * Asynchronous mock loader — deliberately simulates latency and failure.
 * It never calls an external API. `shouldFail` is consumed once by the caller,
 * which is why the Retry button recovers on the next request.
 */
export async function getProducts({
  scenario = DEMO_CONFIG.defaultAvailabilityScenario,
  emptyCatalogue = DEMO_CONFIG.defaultEmptyCatalogue,
  shouldFail = false,
} = {}) {
  await wait(DEMO_CONFIG.loaderDelayMs)

  if (shouldFail) {
    throw new Error('The catalogue could not be loaded. This was a simulated network failure.')
  }

  if (emptyCatalogue) return []

  return applyAvailabilityScenario(PRODUCTS, scenario)
}
