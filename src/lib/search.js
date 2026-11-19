/**
 * Text search across the fields customers actually use to identify a product:
 * name, brand, category, and curated keywords.
 */
export function searchProducts(products, query) {
  const normalisedQuery = query.trim().toLowerCase()
  if (!normalisedQuery) return products

  const terms = normalisedQuery.split(/\s+/).filter(Boolean)

  return products
    .map((product) => {
      const name = product.name.toLowerCase()
      const brand = product.brand.toLowerCase()
      const category = product.category.toLowerCase()
      const keywords = (product.keywords ?? '').toLowerCase()
      const haystack = `${name} ${brand} ${category} ${keywords}`

      if (!terms.every((term) => haystack.includes(term))) return null

      let score = 0
      if (name.startsWith(normalisedQuery)) score += 8
      if (name.includes(normalisedQuery)) score += 5
      if (brand === normalisedQuery) score += 4
      if (brand.includes(normalisedQuery)) score += 3
      if (category.includes(normalisedQuery)) score += 2
      if (keywords.includes(normalisedQuery)) score += 1

      return { product, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .map(({ product }) => product)
}

function parsePriceBound(value) {
  if (value === '' || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

export function filterAndSortProducts(
  products,
  { query = '', category = 'all', availability = 'all', minPrice = '', maxPrice = '', sort = 'featured' } = {},
) {
  const min = parsePriceBound(minPrice)
  const max = parsePriceBound(maxPrice)
  let result = searchProducts(products, query)

  if (category !== 'all') {
    result = result.filter((product) => product.category === category)
  }

  if (availability === 'in-stock') {
    result = result.filter((product) => product.stock > 0)
  } else if (availability === 'out-of-stock') {
    result = result.filter((product) => product.stock === 0)
  }

  if (min !== null) {
    result = result.filter((product) => product.price >= min)
  }

  if (max !== null) {
    result = result.filter((product) => product.price <= max)
  }

  const sorted = [...result]

  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'rating-desc':
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      break
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      sorted.sort((a, b) => b.rating - a.rating || Number(Boolean(b.badge)) - Number(Boolean(a.badge)))
  }

  return sorted
}

export function getSearchSuggestions(products, query, limit = 5) {
  if (query.trim().length < 2) return []
  return searchProducts(products, query).slice(0, limit)
}
