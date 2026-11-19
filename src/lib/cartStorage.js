import { CART_STORAGE_KEY, readJson, writeJson } from './storage.js'

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0
}

/**
 * Reads only non-sensitive cart data: product IDs and quantities.
 * Corrupted data never crashes the app; it is reported to the caller instead.
 */
export function readStoredCart() {
  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!rawValue) return { items: [], corrupted: false, invalidEntries: false }

    const parsed = JSON.parse(rawValue)
    if (!parsed || !Array.isArray(parsed.items)) {
      return { items: [], corrupted: true, invalidEntries: false }
    }

    const validItems = []
    let invalidEntries = false

    parsed.items.forEach((item) => {
      if (
        item &&
        typeof item.productId === 'string' &&
        isPositiveInteger(item.quantity) &&
        item.quantity <= 99
      ) {
        validItems.push({ productId: item.productId, quantity: item.quantity })
      } else {
        invalidEntries = true
      }
    })

    return { items: validItems, corrupted: false, invalidEntries }
  } catch {
    return { items: [], corrupted: true, invalidEntries: false }
  }
}

export function writeStoredCart(items) {
  return writeJson(CART_STORAGE_KEY, {
    version: 1,
    savedAt: new Date().toISOString(),
    items: items.map(({ productId, quantity }) => ({ productId, quantity })),
  })
}

export function clearStoredCart() {
  return writeJson(CART_STORAGE_KEY, { version: 1, savedAt: new Date().toISOString(), items: [] })
}

export { readJson }
