import test from 'node:test'
import assert from 'node:assert/strict'
import { CHECKOUT_INITIAL_VALUES, getAreasForCity, validateCheckoutForm } from '../validation.js'

const validValues = {
  fullName: 'Ayesha Khan',
  email: 'ayesha@example.com',
  phone: '0300 1234567',
  address: 'House 12, Street 4, F-11',
  city: 'Islamabad',
  area: 'F-11',
}

test('a complete, supported checkout form is valid', () => {
  assert.deepEqual(validateCheckoutForm(validValues), {})
  assert.deepEqual(validateCheckoutForm({ ...validValues, phone: '+92 300 1234567' }), {})
})

test('empty fields produce specific validation messages', () => {
  const errors = validateCheckoutForm(CHECKOUT_INITIAL_VALUES)

  assert.equal(errors.fullName, 'Enter your full name.')
  assert.equal(errors.email, 'Enter your email address.')
  assert.equal(errors.phone, 'Enter your mobile number.')
  assert.equal(errors.address, 'Enter your delivery address.')
  assert.equal(errors.city, 'Choose your city.')
  assert.equal(errors.area, 'Choose your delivery area.')
})

test('invalid email, phone, name, and address formats are rejected', () => {
  const errors = validateCheckoutForm({
    ...validValues,
    fullName: 'A1',
    email: 'not-an-email',
    phone: '12345',
    address: 'short',
  })

  assert.match(errors.fullName, /at least 3 characters/)
  assert.match(errors.email, /valid email/)
  assert.match(errors.phone, /Pakistani mobile/)
  assert.match(errors.address, /at least 10 characters/)
})

test('unsupported cities and areas are rejected', () => {
  const cityErrors = validateCheckoutForm({ ...validValues, city: 'Other city', area: '' })
  assert.match(cityErrors.city, /only in Islamabad and Rawalpindi/)

  const areaErrors = validateCheckoutForm({ ...validValues, area: 'Other / not listed' })
  assert.match(areaErrors.area, /not in our Islamabad delivery zone/)
})

test('an area cannot be accepted when its city is missing', () => {
  const errors = validateCheckoutForm({ ...validValues, city: '', area: 'F-11' })

  assert.equal(errors.city, 'Choose your city.')
  assert.equal(errors.area, 'Choose a city before choosing an area.')
})

test('validation does not mutate the controlled form values', () => {
  const values = { ...validValues, email: 'broken' }
  const snapshot = { ...values }

  validateCheckoutForm(values)

  assert.deepEqual(values, snapshot)
})

test('area options are available only for supported cities', () => {
  assert.ok(getAreasForCity('Islamabad').includes('F-11'))
  assert.ok(getAreasForCity('Rawalpindi').includes('Saddar'))
  assert.deepEqual(getAreasForCity('Lahore'), [])
})
