/*
 * Demo settings are intentionally centralised and documented in the README.
 * The Home page exposes labelled controls; nothing here depends on a backend.
 */
export const DEMO_CONFIG = {
  loaderDelayMs: 650,
  orderDelayMs: 850,
  defaultAvailabilityScenario: 'standard',
  defaultEmptyCatalogue: false,
}

export const AVAILABILITY_SCENARIOS = [
  {
    value: 'standard',
    label: 'Standard stock',
    description: 'The stock levels defined in the local product data.',
  },
  {
    value: 'limited',
    label: 'Low stock',
    description: 'Every in-stock product is limited to at most two units.',
  },
  {
    value: 'sold-out',
    label: 'Several items sold out',
    description: 'Four popular products are marked out of stock.',
  },
]
