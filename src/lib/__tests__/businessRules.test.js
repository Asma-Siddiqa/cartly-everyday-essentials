import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  calculateOrderTotals,
  formatPKR,
  getAmountUntilFreeDelivery,
  getDeliveryFee,
  isSupportedArea,
  validateStockQuantity,
} from '../businessRules.js'

test('stock rule accepts an ordinary quantity', () => {
  const result = validateStockQuantity(8, 2)

  assert.equal(result.ok, true)
  assert.equal(result.code, 'OK')
  assert.equal(result.available, 8)
  assert.equal(result.requested, 2)
})

test('stock rule accepts exactly the available stock', () => {
  const result = validateStockQuantity(4, 4)

  assert.equal(result.ok, true)
  assert.equal(result.code, 'OK')
  assert.equal(result.requested, 4)
  assert.equal(result.available, 4)
})

test('stock rule rejects one unit above the available stock', () => {
  const result = validateStockQuantity(4, 5)

  assert.equal(result.ok, false)
  assert.equal(result.code, 'INSUFFICIENT_STOCK')
  assert.match(result.message, /Only 4 units are available/)
})

test('zero-stock products cannot be ordered', () => {
  const result = validateStockQuantity(0, 1)

  assert.equal(result.ok, false)
  assert.equal(result.code, 'OUT_OF_STOCK')
  assert.equal(result.available, 0)
})

test('stock rule rejects zero, negative, fractional, and non-numeric quantities', () => {
  for (const quantity of [0, -1, 1.5, 'two', null, undefined]) {
    const result = validateStockQuantity(5, quantity)
    assert.equal(result.ok, false)
    assert.equal(result.code, 'INVALID_QUANTITY')
  }
})

test('delivery is charged below Rs. 2,000 and free at the threshold', () => {
  assert.equal(DELIVERY_FEE, 150)
  assert.equal(FREE_DELIVERY_THRESHOLD, 2000)
  assert.equal(getDeliveryFee(1999), 150)
  assert.equal(getDeliveryFee(2000), 0)
  assert.equal(getDeliveryFee(2001), 0)
})

test('delivery fee handles zero and invalid subtotals defensively', () => {
  assert.equal(getDeliveryFee(0), DELIVERY_FEE)
  assert.equal(getDeliveryFee(-50), DELIVERY_FEE)
  assert.equal(getDeliveryFee(Number.NaN), DELIVERY_FEE)
  assert.equal(getDeliveryFee('1500'), DELIVERY_FEE)
})

test('free-delivery gap reaches zero at Rs. 2,000', () => {
  assert.equal(getAmountUntilFreeDelivery(1999), 1)
  assert.equal(getAmountUntilFreeDelivery(2000), 0)
  assert.equal(getAmountUntilFreeDelivery(2500), 0)
})

test('order totals include the correct delivery fee at each boundary', () => {
  assert.deepEqual(calculateOrderTotals(1999), {
    subtotal: 1999,
    deliveryFee: 150,
    total: 2149,
    amountUntilFreeDelivery: 1,
    qualifiesForFreeDelivery: false,
  })

  assert.deepEqual(calculateOrderTotals(2000), {
    subtotal: 2000,
    deliveryFee: 0,
    total: 2000,
    amountUntilFreeDelivery: 0,
    qualifiesForFreeDelivery: true,
  })

  assert.deepEqual(calculateOrderTotals(2001), {
    subtotal: 2001,
    deliveryFee: 0,
    total: 2001,
    amountUntilFreeDelivery: 0,
    qualifiesForFreeDelivery: true,
  })
})

test('supported city and area combinations are accepted', () => {
  assert.equal(isSupportedArea('Islamabad', 'F-11'), true)
  assert.equal(isSupportedArea('Rawalpindi', 'Saddar'), true)
  assert.equal(isSupportedArea('Islamabad', '  f-11  '), true)
})

test('unsupported, mistyped, or missing city/area combinations are rejected', () => {
  assert.equal(isSupportedArea('Islamabad', 'Saddar'), false)
  assert.equal(isSupportedArea('Rawalpindi', 'F-11'), false)
  assert.equal(isSupportedArea('Lahore', 'F-11'), false)
  assert.equal(isSupportedArea('Islamabad', 'Other / not listed'), false)
  assert.equal(isSupportedArea('Islamabad', ''), false)
  assert.equal(isSupportedArea('', 'F-11'), false)
  assert.equal(isSupportedArea(undefined, undefined), false)
})

test('prices are formatted as whole-rupee PKR values', () => {
  assert.equal(formatPKR(8499), 'Rs. 8,499')
  assert.equal(formatPKR(2000), 'Rs. 2,000')
  assert.equal(formatPKR(Number.NaN), 'Rs. 0')
})
