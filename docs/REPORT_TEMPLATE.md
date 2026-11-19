# Cartly — Assignment 02 Report Source

> **Instructions:** Copy this outline into a word processor and export a single PDF. Replace every bracketed placeholder with the student's real details. Add the reference-site screenshots captured from the live sites. Do not submit this file as-is.

## 1. Student and project details

| Field | Value |
| --- | --- |
| Student name | [Your Full Name] |
| Roll number | [Roll Number] |
| Section | [Section] |
| Course | CS4032 Web Programming — Assignment 02 |
| Semester | Fall 2026 |
| Business name | Cartly |
| Public repository | [GitHub repository URL] |
| Deployed website | [Deployment URL] |
| Final commit hash | [Final commit hash] |
| Date | [Submission date] |

## 2. Business profile

| Element | Detail |
| --- | --- |
| Business identity | Cartly — a fictional local online retailer for practical tech, study, home, and lifestyle products |
| Offering | 13 local products across audio, tech, bags, stationery, home, footwear, and lifestyle categories |
| Primary audience | Students and young professionals in Islamabad and Rawalpindi |
| Operating area | Explicitly listed areas of Islamabad and Rawalpindi only |
| Main customer task | Browse, search, compare, add to a cart, and complete a simulated delivery checkout |
| Business goal | A transparent, low-surprise purchase with stock and delivery costs visible before checkout |

**Design identity.** Primary blue `#72AEFE` with dark charcoal `#2A2D34`, locally bundled Fraunces/Plus Jakarta Sans fonts, card-based product presentation, and a warm neutral page background. The layout is authored with Tailwind utilities and project components; no page template or UI kit is used.

## 3. Operating rules

### Rule 1 — Stock limit

- **Condition:** quantity must be at least 1 and no greater than current stock; zero-stock products cannot be ordered.
- **Communication:** stock badge, product details, quantity limit, cart and checkout checks.
- **Response:** add/quantity actions are blocked or clamped; invalid checkout is prevented.
- **Boundary:** stock 4 accepts 4, rejects 5; stock 0 rejects 1.
- **Code:** `src/lib/businessRules.js` → `validateStockQuantity`.

### Rule 2 — Supported delivery areas

- **Condition:** city must be Islamabad or Rawalpindi and the area must appear in the explicit supported-area list.
- **Communication:** product delivery panel, cart reminder, city/area selector, validation messages.
- **Response:** unsupported or empty city/area fails validation and blocks order placement.
- **Boundary:** Islamabad + F-11 accepted; Islamabad + Saddar or Lahore + F-11 rejected.
- **Code:** `src/data/deliveryAreas.js`; `src/lib/businessRules.js` → `isSupportedArea`.

### Rule 3 — Delivery pricing

- **Condition:** subtotal below Rs. 2,000 pays Rs. 150; subtotal at or above Rs. 2,000 is free.
- **Communication:** product panel, cart progress, checkout summary, confirmation.
- **Response:** fee is calculated from the current cart and included in the total.
- **Boundary:** Rs. 1,999 → Rs. 150; Rs. 2,000 → Rs. 0; Rs. 2,001 → Rs. 0.
- **Code:** `src/lib/businessRules.js` → `getDeliveryFee`, `calculateOrderTotals`.

## 4. Reference-site investigation

### Problem 1 — Weak search suggestions (eXtra)

- **URL:** <https://www.extra.com/>
- **Screenshot:** [insert `docs/reference/01-extra-search.png`]
- **Task:** identify a product while typing.
- **Observed difficulty:** [summarise the captured interface state; keep observations separate from inference].
- **Possible business consequence:** extra steps and weaker discovery can reduce progression to product pages.
- **Cartly improvement:** ranked autocomplete over name/brand/category/keywords with keyboard selection.
- **Matching evidence:** `docs/screenshots/02-search-autocomplete-1280.jpg`.

### Problem 2 — Delivery information appears too late (Ann Taylor)

- **URL:** <https://www.anntaylor.com/>
- **Screenshot:** [insert `docs/reference/02-ann-taylor-shipping.png`]
- **Task:** judge delivered cost and destination eligibility before adding an item.
- **Observed difficulty:** [summarise the captured interface state].
- **Possible business consequence:** late fees or eligibility can cause abandonment or wasted effort.
- **Cartly improvement:** delivery panel before add-to-cart; repeated in cart/checkout; unsupported areas blocked.
- **Matching evidence:** `docs/screenshots/03-product-details-1280.jpg`.

### Problem 3 — Insufficient listing filters (Tesco)

- **URL:** <https://www.tesco.com/groceries/>
- **Screenshot:** [insert `docs/reference/03-tesco-filters.png`]
- **Task:** narrow a listing by price range and availability, then sort by price.
- **Observed difficulty:** [summarise the captured interface state].
- **Possible business consequence:** budget shoppers may miss affordable options or abandon the list.
- **Cartly improvement:** combined search/category/availability/min-max price plus price, rating, and name sorting; URL persistence; mobile filter drawer.
- **Matching evidence:** `docs/screenshots/01-home-1280.jpg`, `docs/screenshots/07-home-390.jpg`.

> Use the same structure for each: **URL → screenshot → task → observed difficulty → inferred consequence → improvement → matching screenshot**. Number the reproduction steps in the caption if one image is not enough.

## 5. Frontend decisions

### Decision 1 — Ranked, keyboard-operable autocomplete

- **Problem:** weak search suggestions slowed discovery.
- **Decision:** search name, brand, category, and keywords; show up to five ranked suggestions with keyboard support; keep the query in the URL.
- **Alternative:** submit-only search with a long result list.
- **Reason:** immediate feedback supports the product-identification task and makes results shareable/reproducible.
- **Tradeoff:** ranking/keyboard/blur state to maintain; only five suggestions shown.
- **Code:** `src/components/search/SearchAutocomplete.jsx`, `src/lib/search.js`, `src/pages/HomePage.jsx`.
- **Evidence:** [screenshot + steps from `DECISIONS.md` Decision 1].

### Decision 2 — Delivery transparency beside the purchase action

- **Problem:** shipping charges and eligibility were difficult to see before checkout.
- **Decision:** product-page delivery panel plus repeated cart/checkout calculation and area validation.
- **Alternative:** show shipping only in the cart or a modal.
- **Reason:** delivered cost and eligibility are part of the purchase decision; one rule module prevents inconsistent messages.
- **Tradeoff:** denser product page; single-product free-delivery gap is only a guide.
- **Code:** `src/components/product/DeliveryPanel.jsx`, `src/lib/businessRules.js`, `src/data/deliveryAreas.js`, `src/pages/ProductDetailsPage.jsx`.
- **Evidence:** [screenshot + steps from `DECISIONS.md` Decision 2].

### Decision 3 — URL-synced filters with a mobile drawer

- **Problem:** listing filters were insufficient for price-led browsing.
- **Decision:** combine all filters/sorts with search, store them in URL parameters, show active chips, and use a mobile drawer.
- **Alternative:** local component or context state only.
- **Reason:** preserves the shopper's place across details, Back/Forward, and refresh; the filtered view is shareable.
- **Tradeoff:** longer URLs and defensive parsing; more history entries; drawer focus work.
- **Code:** `src/pages/HomePage.jsx`, `src/lib/search.js`, `src/components/filters/FiltersPanel.jsx`.
- **Evidence:** [screenshot + steps from `DECISIONS.md` Decision 3].

## 6. Implemented application

Use short captions that explain a design choice, not just the screen name.

| Screenshot | Annotation |
| --- | --- |
| `docs/screenshots/01-home-1280.jpg` | Catalogue hierarchy: search first, sticky filters, cards with stock/price, compare action |
| `docs/screenshots/02-search-autocomplete-1280.jpg` | Suggestions show name, category, and price with keyboard focus |
| `docs/screenshots/03-product-details-1280.jpg` | Delivery panel before add-to-cart; primary/secondary actions separated |
| `docs/screenshots/04-cart-1280.jpg` | Cart lines, stock-aware quantity, free-delivery progress, summary |
| `docs/screenshots/05-checkout-1280.jpg` | Controlled form, labels, delivery/area fields, error summary |
| `docs/screenshots/06-order-confirmation-1280.jpg` | Simulated confirmation with totals and delivery details |
| `docs/screenshots/07-home-390.jpg` | Mobile layout: stacked cards, menu, labelled filter control |
| `docs/screenshots/08-about-rules-390.jpg` | Business profile and rules readable at 390 px |

## 7. Verification

### Automated

```text
npm test      → 41 tests, 41 passing, 0 failing
npm run build → successful production build
```

The business-rule test is in `src/lib/__tests__/businessRules.test.js` and uses `node:test` with `node:assert/strict`. It includes ordinary valid input, exactly-at-limit stock, one-above-limit stock, zero stock, and the Rs. 1,999 / 2,000 / 2,001 delivery boundaries.

### Edge-case checklist

| Case | Expected | Observed |
| --- | --- | --- |
| Loading failure | Error panel with working retry | Pass |
| Empty catalogue | Empty-dataset message with reset | Pass |
| Search with no matches | No-match message with clear action | Pass |
| Invalid product/order URL | Recovery links, no crash | Pass |
| Corrupt saved cart | Reset with notice, no crash | Pass |
| Unavailable restored item | Removed with explanation | Pass |
| Quantity above new stock | Reduced with explanation | Pass |
| Invalid form values | Specific errors, valid input kept | Pass |
| Unsupported area | Checkout blocked | Pass |
| Image failure | Fallback shown | Pass |
| 390 px / 1280 px | No page-wide horizontal overflow | Pass |
| Keyboard journey | Search, filters, cart, form, dialog usable | Pass |

### Improvement evidence

For each investigated improvement, include **user actions → expected behaviour → observed behaviour** and one screenshot. The details are in `DECISIONS.md` and `docs/VERIFICATION.md`.

### Browser status

- Automated Chromium checks passed on the development server and production preview.
- [Add the date and result of the student's final manual Chrome/Edge console check.]

## 8. Limitations

- Frontend-only prototype: no backend, authentication, real payment, email/SMS, courier, or live stock.
- Orders are simulated and stored only in the current browser; they are not shared across devices.
- Delivery dates are estimates, not courier commitments.
- Reference-site evidence must be captured by the student; this repository does not fabricate it.
- A public GitHub repository and deployment must be created with the student's own accounts.
- Product names/brands are fictional; photos are licensed stock images.

## 9. Submission checklist

- [ ] Student details, repository link, deployment link, and final commit hash filled in.
- [ ] Three reference screenshots inserted with dates and captions.
- [ ] Three decisions include alternative, reason, tradeoff, code location, and evidence.
- [ ] Application screenshots inserted with design annotations.
- [ ] Verification results match the submitted commit.
- [ ] PDF exported and checked for readability.
- [ ] Public repository and deployment open without access requests.
- [ ] Direct nested-route refresh verified on the deployment.
- [ ] ZIP named `RollNo_Name_Section_A#02.zip`, excluding `node_modules` and `dist`.
- [ ] Report, repository, deployment, and ZIP all match.
- [ ] Submitted on Google Classroom before the deadline.
