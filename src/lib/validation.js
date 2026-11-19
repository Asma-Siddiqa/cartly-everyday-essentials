import { DELIVERY_AREAS, SERVICE_CITIES } from '../data/deliveryAreas.js'
import { isSupportedArea } from './businessRules.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/

export const CHECKOUT_INITIAL_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  area: '',
}

function normalisePhone(phone) {
  return phone.replace(/[\s()-]/g, '').replace(/^\+/, '')
}

export function validateCheckoutForm(values) {
  const errors = {}
  const fullName = values.fullName.trim()
  const email = values.email.trim()
  const phone = values.phone.trim()
  const address = values.address.trim()

  if (!fullName) {
    errors.fullName = 'Enter your full name.'
  } else if (fullName.length < 3) {
    errors.fullName = 'Your name must be at least 3 characters.'
  } else if (!NAME_PATTERN.test(fullName)) {
    errors.fullName = 'Use letters, spaces, apostrophes, or hyphens only.'
  }

  if (!email) {
    errors.email = 'Enter your email address.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email, for example name@example.com.'
  }

  const normalisedPhone = normalisePhone(phone)
  if (!phone) {
    errors.phone = 'Enter your mobile number.'
  } else if (!/^(?:0|92)3\d{9}$/.test(normalisedPhone)) {
    errors.phone = 'Use a Pakistani mobile number, for example 0300 1234567.'
  }

  if (!address) {
    errors.address = 'Enter your delivery address.'
  } else if (address.length < 10) {
    errors.address = 'Add a little more detail (at least 10 characters).'
  }

  if (!values.city) {
    errors.city = 'Choose your city.'
  } else if (!SERVICE_CITIES.includes(values.city)) {
    errors.city = 'Cartly currently delivers only in Islamabad and Rawalpindi.'
  }

  if (!values.area) {
    errors.area = 'Choose your delivery area.'
  } else if (values.city && !isSupportedArea(values.city, values.area)) {
    errors.area = `That area is not in our ${values.city} delivery zone yet. Choose a listed area.`
  } else if (!values.city) {
    errors.area = 'Choose a city before choosing an area.'
  }

  return errors
}

export function getAreasForCity(city) {
  return DELIVERY_AREAS[city] ?? []
}
