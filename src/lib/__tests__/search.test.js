import test from 'node:test'
import assert from 'node:assert/strict'
import { filterAndSortProducts, getSearchSuggestions, searchProducts } from '../search.js'

const products = [
  {
    id: 'headphones',
    name: 'Aurora ANC Headphones',
    brand: 'Soundwave',
    category: 'Audio',
    price: 8499,
    rating: 4.6,
    reviewCount: 218,
    stock: 8,
    keywords: 'wireless over ear study',
    badge: 'Best seller',
  },
  {
    id: 'speaker',
    name: 'Pulse Mini Speaker',
    brand: 'Soundwave',
    category: 'Audio',
    price: 2299,
    rating: 4.2,
    reviewCount: 142,
    stock: 5,
    keywords: 'bluetooth portable',
    badge: null,
  },
  {
    id: 'bottle',
    name: 'Hydra Steel Bottle',
    brand: 'Terra',
    category: 'Lifestyle',
    price: 1250,
    rating: 4.3,
    reviewCount: 88,
    stock: 0,
    keywords: 'insulated water',
    badge: null,
  },
  {
    id: 'keyboard',
    name: 'ClickCraft Keyboard',
    brand: 'KeyForge',
    category: 'Tech Accessories',
    price: 6750,
    rating: 4.7,
    reviewCount: 184,
    stock: 4,
    keywords: 'mechanical wireless',
    badge: "Editor's pick",
  },
]

test('search matches product name, brand, category, and keywords', () => {
  assert.deepEqual(searchProducts(products, 'aurora').map((product) => product.id), ['headphones'])
  assert.deepEqual(searchProducts(products, 'soundwave').map((product) => product.id), [
    'headphones',
    'speaker',
  ])
  assert.deepEqual(searchProducts(products, 'audio').map((product) => product.id), [
    'headphones',
    'speaker',
  ])
  assert.deepEqual(searchProducts(products, 'insulated').map((product) => product.id), ['bottle'])
})

test('search is case-insensitive and supports multiple terms', () => {
  assert.deepEqual(searchProducts(products, 'WIRELESS SOUNDWAVE').map((product) => product.id), ['headphones'])
})

test('an empty query returns the original list and a no-match query returns none', () => {
  assert.equal(searchProducts(products, '').length, products.length)
  assert.equal(searchProducts(products, '   ').length, products.length)
  assert.deepEqual(searchProducts(products, 'not-a-real-product'), [])
})

test('filters combine with search', () => {
  const result = filterAndSortProducts(products, {
    query: 'soundwave',
    category: 'Audio',
    availability: 'in-stock',
    minPrice: '2000',
    maxPrice: '3000',
  })

  assert.deepEqual(result.map((product) => product.id), ['speaker'])
})

test('availability filters distinguish in-stock and out-of-stock records', () => {
  assert.deepEqual(
    filterAndSortProducts(products, { availability: 'out-of-stock' }).map((product) => product.id),
    ['bottle'],
  )
  assert.equal(filterAndSortProducts(products, { availability: 'in-stock' }).length, 3)
})

test('price bounds are inclusive and ignore invalid bounds', () => {
  assert.deepEqual(
    filterAndSortProducts(products, { minPrice: '2299', maxPrice: '2299' }).map((product) => product.id),
    ['speaker'],
  )

  assert.equal(filterAndSortProducts(products, { minPrice: '-5', maxPrice: 'abc' }).length, products.length)
})

test('price sorting works in both directions', () => {
  assert.deepEqual(
    filterAndSortProducts(products, { sort: 'price-asc' }).map((product) => product.price),
    [1250, 2299, 6750, 8499],
  )
  assert.deepEqual(
    filterAndSortProducts(products, { sort: 'price-desc' }).map((product) => product.price),
    [8499, 6750, 2299, 1250],
  )
})

test('rating sorting places the highest-rated product first', () => {
  assert.equal(filterAndSortProducts(products, { sort: 'rating-desc' })[0].id, 'keyboard')
})

test('quick suggestions require two characters and respect the limit', () => {
  assert.deepEqual(getSearchSuggestions(products, 'a'), [])
  assert.equal(getSearchSuggestions(products, 'sou', 2).length, 2)
})
