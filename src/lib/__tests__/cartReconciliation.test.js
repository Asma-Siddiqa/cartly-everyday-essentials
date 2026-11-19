import test from 'node:test'
import assert from 'node:assert/strict'
import { reconcileCart } from '../cartReconciliation.js'

const products = [
  { id: 'headphones', name: 'Aurora Headphones', stock: 4 },
  { id: 'speaker', name: 'Pulse Speaker', stock: 0 },
  { id: 'keyboard', name: 'ClickCraft Keyboard', stock: 2 },
]

test('a valid saved cart is restored unchanged', () => {
  const result = reconcileCart([{ productId: 'headphones', quantity: 2 }], products)

  assert.deepEqual(result.items, [{ productId: 'headphones', quantity: 2 }])
  assert.deepEqual(result.notices, [])
})

test('a removed product is dropped with an explanation', () => {
  const result = reconcileCart([{ productId: 'retired-product', quantity: 1 }], products)

  assert.deepEqual(result.items, [])
  assert.equal(result.notices.length, 1)
  assert.match(result.notices[0].message, /no longer in the Cartly catalogue/)
})

test('a product that became out of stock is removed with an explanation', () => {
  const result = reconcileCart([{ productId: 'speaker', quantity: 1 }], products)

  assert.deepEqual(result.items, [])
  assert.equal(result.notices.length, 1)
  assert.match(result.notices[0].message, /out of stock/)
})

test('a quantity above current stock is reduced to the limit', () => {
  const result = reconcileCart([{ productId: 'headphones', quantity: 9 }], products)

  assert.deepEqual(result.items, [{ productId: 'headphones', quantity: 4 }])
  assert.equal(result.notices[0].type, 'adjusted')
  assert.match(result.notices[0].message, /reduced from 9 to 4/)
})

test('duplicate saved entries are grouped before stock is checked', () => {
  const result = reconcileCart(
    [
      { productId: 'keyboard', quantity: 1 },
      { productId: 'keyboard', quantity: 2 },
    ],
    products,
  )

  assert.deepEqual(result.items, [{ productId: 'keyboard', quantity: 2 }])
  assert.equal(result.notices[0].type, 'adjusted')
})

test('malformed saved entries are ignored safely', () => {
  const result = reconcileCart(
    [
      null,
      { productId: 42, quantity: 1 },
      { productId: 'headphones', quantity: 1.5 },
      { productId: 'headphones', quantity: -2 },
      { productId: 'headphones', quantity: 1 },
    ],
    products,
  )

  assert.deepEqual(result.items, [{ productId: 'headphones', quantity: 1 }])
  assert.deepEqual(result.notices, [])
})
