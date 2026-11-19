import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEMO_CONFIG } from '../config/demo.js'
import { getProducts } from '../services/productService.js'

const CatalogContext = createContext(null)

const initialRequest = {
  requestId: 0,
  scenario: DEMO_CONFIG.defaultAvailabilityScenario,
  emptyCatalogue: DEMO_CONFIG.defaultEmptyCatalogue,
  shouldFail: false,
}

export function CatalogProvider({ children }) {
  const [request, setRequest] = useState(initialRequest)
  const [catalog, setCatalog] = useState({
    products: [],
    status: 'loading',
    error: null,
    catalogVersion: 0,
    isEmptyCatalogue: false,
  })

  useEffect(() => {
    let cancelled = false

    setCatalog((previous) => ({ ...previous, status: 'loading', error: null }))

    getProducts({
      scenario: request.scenario,
      emptyCatalogue: request.emptyCatalogue,
      shouldFail: request.shouldFail,
    })
      .then((products) => {
        if (cancelled) return
        setCatalog((previous) => ({
          products,
          status: 'success',
          error: null,
          catalogVersion: previous.catalogVersion + 1,
          isEmptyCatalogue: request.emptyCatalogue,
        }))
      })
      .catch((error) => {
        if (cancelled) return
        setCatalog((previous) => ({
          products: [],
          status: 'error',
          error: error instanceof Error ? error.message : 'The catalogue could not be loaded.',
          catalogVersion: previous.catalogVersion,
          isEmptyCatalogue: false,
        }))
      })

    // Prevents a late promise from updating state after this request is replaced.
    return () => {
      cancelled = true
    }
  }, [request])

  const requestChange = useCallback((changes) => {
    setRequest((previous) => ({
      ...previous,
      ...changes,
      requestId: previous.requestId + 1,
      shouldFail: false,
    }))
  }, [])

  const retry = useCallback(() => {
    setRequest((previous) => ({
      ...previous,
      requestId: previous.requestId + 1,
      shouldFail: false,
    }))
  }, [])

  const simulateLoadFailure = useCallback(() => {
    setRequest((previous) => ({
      ...previous,
      requestId: previous.requestId + 1,
      shouldFail: true,
    }))
  }, [])

  const setAvailabilityScenario = useCallback(
    (scenario) => {
      requestChange({ scenario })
    },
    [requestChange],
  )

  const setEmptyCatalogue = useCallback(
    (emptyCatalogue) => {
      requestChange({ emptyCatalogue })
    },
    [requestChange],
  )

  const resetDemo = useCallback(() => {
    setRequest((previous) => ({
      ...initialRequest,
      requestId: previous.requestId + 1,
    }))
  }, [])

  const value = useMemo(
    () => ({
      ...catalog,
      demo: {
        scenario: request.scenario,
        emptyCatalogue: request.emptyCatalogue,
        shouldFail: request.shouldFail,
      },
      retry,
      simulateLoadFailure,
      setAvailabilityScenario,
      setEmptyCatalogue,
      resetDemo,
    }),
    [catalog, request, retry, simulateLoadFailure, setAvailabilityScenario, setEmptyCatalogue, resetDemo],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) {
    throw new Error('useCatalog must be used inside a CatalogProvider.')
  }
  return context
}
