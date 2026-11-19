import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useCatalog } from './CatalogContext.jsx'
import { readStoredCart, writeStoredCart } from '../lib/cartStorage.js'
import { reconcileCart } from '../lib/cartReconciliation.js'
import { validateStockQuantity } from '../lib/businessRules.js'
import { CART_STORAGE_KEY } from '../lib/storage.js'

const CartContext = createContext(null)

function cartItemsAreEqual(first, second) {
  if (first.length !== second.length) return false
  return first.every(
    (item, index) =>
      item.productId === second[index].productId && item.quantity === second[index].quantity,
  )
}

export function CartProvider({ children }) {
  const { products, status, catalogVersion } = useCatalog()
  const [initialCart] = useState(() => readStoredCart())
  const [items, setItems] = useState(initialCart.items)
  const [notices, setNotices] = useState(() => {
    if (initialCart.corrupted) {
      return [
        {
          type: 'storage',
          message: 'We could not read your saved cart, so it was reset. You can add products again.',
        },
      ]
    }
    if (initialCart.invalidEntries) {
      return [
        {
          type: 'storage',
          message: 'Some saved cart entries were invalid and were ignored.',
        },
      ]
    }
    return []
  })
  const [isValidated, setIsValidated] = useState(false)
  const itemsRef = useRef(items)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // Re-check saved selections whenever the catalogue finishes loading or its
  // stock changes (including the labelled availability demo scenario).
  useEffect(() => {
    if (status !== 'success') return

    const result = reconcileCart(itemsRef.current, products)
    setItems((previous) => (cartItemsAreEqual(previous, result.items) ? previous : result.items))
    // Keep the one-off "saved cart was corrupt" warning until the customer has
    // seen it, but replace reconciliation messages whenever stock changes.
    setNotices((previous) => [
      ...previous.filter((notice) => notice.type === 'storage'),
      ...result.notices,
    ])
    setIsValidated(true)
  }, [status, catalogVersion, products])

  useEffect(() => {
    if (!isValidated) return
    writeStoredCart(items)
  }, [items, isValidated])

  // Keeps two open tabs reasonably consistent without storing customer details.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== CART_STORAGE_KEY) return
      const stored = readStoredCart()
      setItems(stored.items)
      if (stored.corrupted) {
        setNotices([
          {
            type: 'storage',
            message: 'The saved cart from another tab was invalid and has been reset.',
          },
        ])
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const findProduct = useCallback(
    (productId) => products.find((product) => product.id === productId) ?? null,
    [products],
  )

  const addToCart = useCallback(
    (productId, quantity = 1) => {
      const product = findProduct(productId)
      if (!product) {
        return { ok: false, message: 'This product could not be found. Reload the catalogue and try again.' }
      }

      const existingQuantity = items.find((item) => item.productId === productId)?.quantity ?? 0
      const requestedTotal = existingQuantity + quantity
      const check = validateStockQuantity(product.stock, requestedTotal)

      if (!check.ok) {
        return {
          ok: false,
          message:
            check.code === 'INSUFFICIENT_STOCK' && existingQuantity > 0
              ? `You already have ${existingQuantity} in your cart. Only ${product.stock} ${
                  product.stock === 1 ? 'unit is' : 'units are'
                } available.`
              : check.message,
        }
      }

      setItems((previous) => {
        const existing = previous.find((item) => item.productId === productId)
        if (existing) {
          return previous.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
          )
        }
        return [...previous, { productId, quantity }]
      })

      return {
        ok: true,
        message: `${product.name} was added to your cart.`,
      }
    },
    [findProduct, items],
  )

  const updateQuantity = useCallback(
    (productId, nextQuantity) => {
      const product = findProduct(productId)
      if (!product) {
        return { ok: false, message: 'This product is no longer available.' }
      }

      if (nextQuantity < 1) {
        return { ok: false, message: 'Use Remove to take this product out of your cart.' }
      }

      const check = validateStockQuantity(product.stock, nextQuantity)
      if (!check.ok) {
        return { ok: false, message: check.message }
      }

      setItems((previous) =>
        previous.map((item) => (item.productId === productId ? { ...item, quantity: nextQuantity } : item)),
      )

      return { ok: true, message: `Quantity updated to ${nextQuantity}.` }
    },
    [findProduct],
  )

  const removeFromCart = useCallback((productId) => {
    setItems((previous) => previous.filter((item) => item.productId !== productId))
    return { ok: true, message: 'Product removed from your cart.' }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setNotices([])
  }, [])

  const dismissNotices = useCallback(() => setNotices([]), [])

  const cartLines = useMemo(
    () =>
      items
        .map((item) => {
          const product = findProduct(item.productId)
          if (!product) return null
          return {
            ...item,
            product,
            lineTotal: product.price * item.quantity,
          }
        })
        .filter(Boolean),
    [items, findProduct],
  )

  const subtotal = useMemo(
    () => cartLines.reduce((total, line) => total + line.lineTotal, 0),
    [cartLines],
  )
  const itemCount = useMemo(
    () => cartLines.reduce((total, line) => total + line.quantity, 0),
    [cartLines],
  )

  const value = useMemo(
    () => ({
      items,
      cartLines,
      itemCount,
      subtotal,
      notices,
      isValidated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      dismissNotices,
    }),
    [
      items,
      cartLines,
      itemCount,
      subtotal,
      notices,
      isValidated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      dismissNotices,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider.')
  }
  return context
}
