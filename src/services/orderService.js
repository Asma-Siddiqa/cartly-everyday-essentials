import { ORDER_STORAGE_KEY, readJson, writeJson } from '../lib/storage.js'
import { DEMO_CONFIG } from '../config/demo.js'

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

function createOrderId() {
  const timePart = Date.now().toString(36).toUpperCase().slice(-5)
  const randomPart = Math.random().toString(36).toUpperCase().slice(2, 5)
  return `CRT-${timePart}-${randomPart}`
}

function isValidStoredOrder(order) {
  if (!order || typeof order !== 'object' || typeof order.id !== 'string') return false
  if (!Array.isArray(order.items)) return false
  if (!Number.isFinite(order.subtotal) || !Number.isFinite(order.deliveryFee) || !Number.isFinite(order.total)) {
    return false
  }

  return order.items.every(
    (item) =>
      item &&
      typeof item.productId === 'string' &&
      typeof item.name === 'string' &&
      Number.isFinite(item.quantity) &&
      Number.isFinite(item.unitPrice) &&
      Number.isFinite(item.lineTotal),
  )
}

export function getStoredOrders() {
  const parsed = readJson(ORDER_STORAGE_KEY, [])
  // A hand-edited or partially corrupt saved order must never crash the
  // confirmation route; only complete snapshots are treated as orders.
  return Array.isArray(parsed) ? parsed.filter(isValidStoredOrder) : []
}

export function getOrderById(orderId) {
  return getStoredOrders().find((order) => order.id === orderId) ?? null
}

/**
 * Simulated order. The stored snapshot intentionally excludes name, email,
 * phone, and street address; only non-sensitive order details are persisted.
 */
export async function placeSimulatedOrder({ items, totals, city, area }) {
  await wait(DEMO_CONFIG.orderDelayMs)

  const placedAt = new Date().toISOString()
  const estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  const order = {
    id: createOrderId(),
    placedAt,
    estimatedDelivery,
    city,
    area,
    items: items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      lineTotal: item.product.price * item.quantity,
    })),
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
  }

  const saved = writeJson(ORDER_STORAGE_KEY, [order, ...getStoredOrders()].slice(0, 10))
  if (!saved) {
    throw new Error('The confirmation could not be saved in this browser. Please check browser storage settings.')
  }

  return order
}
