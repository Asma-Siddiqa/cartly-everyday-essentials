/*
 * Cartly only delivers to the areas explicitly listed here. "Other / not listed"
 * is a UI-only option used to demonstrate the unsupported-area rule; it is not
 * a supported area and must never be added to these arrays.
 */
export const SERVICE_CITIES = ['Islamabad', 'Rawalpindi']

export const DELIVERY_AREAS = {
  Islamabad: [
    'Blue Area',
    'DHA Phase II',
    'E-11',
    'F-6',
    'F-7',
    'F-8',
    'F-10',
    'F-11',
    'G-9',
    'G-10',
    'G-11',
    'I-8',
  ],
  Rawalpindi: [
    'Saddar',
    'Satellite Town',
    'Chaklala Scheme 3',
    'Shamsabad',
    'Gulraiz',
    'Bahria Town Phase 7',
    'DHA Phase 1',
    'Adiala Road',
  ],
}

export const UNSUPPORTED_AREA_OPTION = 'Other / not listed'

export const DELIVERY_ESTIMATE = '1–3 working days after order confirmation'
