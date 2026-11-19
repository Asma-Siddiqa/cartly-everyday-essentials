export const CART_STORAGE_KEY = 'cartly:cart:v1'
export const ORDER_STORAGE_KEY = 'cartly:orders:v1'
export const COMPARE_STORAGE_KEY = 'cartly:compare:v1'

export function readJson(key, fallbackValue) {
  try {
    const rawValue = window.localStorage.getItem(key)
    if (!rawValue) return fallbackValue
    return JSON.parse(rawValue)
  } catch {
    return fallbackValue
  }
}

export function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStoredValue(key) {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}
