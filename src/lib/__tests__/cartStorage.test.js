import test, { afterEach, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { CART_STORAGE_KEY } from '../storage.js'
import { readStoredCart, writeStoredCart } from '../cartStorage.js'

function createStorage(initialValue) {
  let value = initialValue
  return {
    getItem: () => value,
    setItem: (_key, nextValue) => {
      value = nextValue
    },
    removeItem: () => {
      value = null
    },
    read: () => value,
  }
}

let storage

beforeEach(() => {
  storage = createStorage(null)
  globalThis.window = { localStorage: storage }
})

afterEach(() => {
  delete globalThis.window
})

test('an empty cart is reported without an error', () => {
  assert.deepEqual(readStoredCart(), { items: [], corrupted: false, invalidEntries: false })
})

test('a valid stored cart is read back as IDs and quantities only', () => {
  writeStoredCart([{ productId: 'headphones', quantity: 2, name: 'must not be saved' }])

  const saved = JSON.parse(storage.read())
  assert.deepEqual(saved.items, [{ productId: 'headphones', quantity: 2 }])
  assert.deepEqual(readStoredCart(), {
    items: [{ productId: 'headphones', quantity: 2 }],
    corrupted: false,
    invalidEntries: false,
  })
})

test('corrupt JSON is reported instead of crashing', () => {
  globalThis.window = { localStorage: createStorage('{not valid json') }

  assert.deepEqual(readStoredCart(), { items: [], corrupted: true, invalidEntries: false })
})

test('a wrong stored shape is reported as corrupt', () => {
  globalThis.window = { localStorage: createStorage(JSON.stringify({ items: 'nope' })) }

  assert.deepEqual(readStoredCart(), { items: [], corrupted: true, invalidEntries: false })
})

test('invalid entries are skipped and flagged', () => {
  globalThis.window = {
    localStorage: createStorage(
      JSON.stringify({
        items: [
          { productId: 'headphones', quantity: 2 },
          { productId: 'speaker', quantity: 0 },
          { productId: 7, quantity: 1 },
          { productId: 'keyboard', quantity: 100 },
        ],
      }),
    ),
  }

  assert.deepEqual(readStoredCart(), {
    items: [{ productId: 'headphones', quantity: 2 }],
    corrupted: false,
    invalidEntries: true,
  })
})

test('storage access failures are handled as corrupt data', () => {
  globalThis.window = {
    localStorage: {
      getItem() {
        throw new Error('storage blocked')
      },
    },
  }

  assert.deepEqual(readStoredCart(), { items: [], corrupted: true, invalidEntries: false })
})

test('writeStoredCart uses the documented namespaced key', () => {
  writeStoredCart([{ productId: 'headphones', quantity: 1 }])

  assert.match(CART_STORAGE_KEY, /^cartly:cart:/)
  assert.equal(JSON.parse(storage.read()).version, 1)
})
