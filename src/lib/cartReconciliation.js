/**
 * Reconciles a saved cart with the current catalogue.
 * Invalid products are removed; excessive quantities are reduced to available
 * stock; every change produces a human-readable notice for the cart page.
 */
export function reconcileCart(storedItems, products) {
  const productMap = new Map(products.map((product) => [product.id, product]))
  const groupedItems = new Map()

  storedItems.forEach((item) => {
    if (
      !item ||
      typeof item.productId !== 'string' ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return
    }
    const existing = groupedItems.get(item.productId) ?? 0
    groupedItems.set(item.productId, Math.min(existing + item.quantity, 99))
  })

  const items = []
  const notices = []

  groupedItems.forEach((quantity, productId) => {
    const product = productMap.get(productId)

    if (!product) {
      notices.push({
        type: 'removed',
        message: 'A saved product is no longer in the Cartly catalogue and was removed from your cart.',
      })
      return
    }

    if (product.stock <= 0) {
      notices.push({
        type: 'removed',
        message: `${product.name} is now out of stock and was removed from your cart.`,
      })
      return
    }

    if (quantity > product.stock) {
      notices.push({
        type: 'adjusted',
        message: `${product.name} was reduced from ${quantity} to ${product.stock} because only ${product.stock} remain in stock.`,
      })
      items.push({ productId, quantity: product.stock })
      return
    }

    items.push({ productId, quantity })
  })

  return { items, notices }
}
