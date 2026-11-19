import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useCatalog } from './CatalogContext.jsx'
import { MAX_COMPARE_ITEMS, readStoredCompareIds, writeStoredCompareIds } from '../lib/compareStorage.js'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const { products, status, catalogVersion } = useCatalog()
  const [ids, setIds] = useState(() => readStoredCompareIds())

  useEffect(() => {
    writeStoredCompareIds(ids)
  }, [ids])

  // Remove saved IDs that no longer exist after a catalogue reload.
  useEffect(() => {
    if (status !== 'success') return
    const validIds = new Set(products.map((product) => product.id))
    setIds((previous) => {
      const next = previous.filter((id) => validIds.has(id))
      return next.length === previous.length ? previous : next
    })
  }, [status, catalogVersion, products])

  const toggleCompare = useCallback(
    (productId) => {
      if (ids.includes(productId)) {
        setIds((previous) => previous.filter((id) => id !== productId))
        return { ok: true, message: 'Removed from your compare list.' }
      }

      if (ids.length >= MAX_COMPARE_ITEMS) {
        return {
          ok: false,
          message: `You can compare up to ${MAX_COMPARE_ITEMS} products at a time. Remove one to add another.`,
        }
      }

      setIds((previous) => (previous.includes(productId) ? previous : [...previous, productId]))
      return { ok: true, message: 'Added to your compare list.' }
    },
    [ids],
  )

  const removeCompare = useCallback((productId) => {
    setIds((previous) => previous.filter((id) => id !== productId))
  }, [])

  const clearCompare = useCallback(() => setIds([]), [])

  const comparedProducts = useMemo(
    () => ids.map((id) => products.find((product) => product.id === id)).filter(Boolean),
    [ids, products],
  )

  const value = useMemo(
    () => ({
      ids,
      comparedProducts,
      maxCompareItems: MAX_COMPARE_ITEMS,
      toggleCompare,
      removeCompare,
      clearCompare,
    }),
    [ids, comparedProducts, toggleCompare, removeCompare, clearCompare],
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used inside a CompareProvider.')
  }
  return context
}
