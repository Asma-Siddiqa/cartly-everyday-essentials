# Cartly — Assignment 02 Report

**Course:** CS4032 Web Programming — Assignment 02 (Fall 2026)

## 1. Student and project details

| Field | Value |
| --- | --- |
| Student name | Asma Siddiqa |
| Roll number | 24i-2109 |
| Section | CY-A |
| Course | CS4032 Web Programming — Assignment 02 |
| Semester | Fall 2026 |
| Business name | Cartly |
| Public repository | https://github.com/Asma-Siddiqa/cartly-everyday-essentials |
| Deployed website | https://cartly-everyday-essentials.vercel.app |
| Final implementation commit | `__FINAL_COMMIT__` |
| Date | 21 November 2026 |

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

- **URL:** https://www.extra.com/en-sa
- **Screenshot (21 November 2026, live capture):** `docs/reference/01-extra-search.png`

![eXtra search suggestions for the query "head"](docs/reference/01-extra-search.png)

- **Task:** identify a product while typing.
- **Observed difficulty:** typing the partial query `head` produced a suggestion list made only of plain text suggestions (for example “HEAD headphones”, “SONY Headphone headset”, “Wireless Headphones”) plus brand and blog links. There were no ranked product cards with images or prices, so the shopper still had to submit a full search and scan a broad result list to judge relevance.
- **Possible business consequence:** extra steps and weaker discovery can reduce progression to product pages.
- **Cartly improvement:** ranked autocomplete over name/brand/category/keywords with keyboard selection and visible prices.
- **Matching evidence:** `docs/screenshots/02-search-autocomplete-1280.jpg`.

![Cartly ranked autocomplete with price and category](docs/screenshots/02-search-autocomplete-1280.jpg)

### Problem 2 — Delivery information appears too late (Ann Taylor)

- **URL:** https://www.anntaylor.com/ (live site blocked automated access; archived snapshot dated 3 January 2025 used)
- **Screenshot (archived snapshot, captured 21 November 2026):** `docs/reference/02-ann-taylor-shipping.png`

![Ann Taylor archived home page with free-shipping threshold banner](docs/reference/02-ann-taylor-shipping.png)

- **Task:** judge delivered cost and destination eligibility before adding an item.
- **Observed difficulty:** the archived home page communicated the threshold through a promotional banner reading “FREE SHIPPING‡ WITH ORDERS OF $150+!” rather than through product-level delivered-cost information. The conditions behind the dagger are not visible next to the product or the add-to-bag action, so the shopper must look elsewhere or proceed deeper into the order flow.
- **Possible business consequence:** late fees or eligibility restrictions can cause abandonment or wasted effort.
- **Cartly improvement:** delivery panel before add-to-cart; repeated in cart/checkout; unsupported areas blocked.
- **Matching evidence:** `docs/screenshots/03-product-details-1280.jpg`.

![Cartly product page delivery panel before add-to-cart](docs/screenshots/03-product-details-1280.jpg)

### Problem 3 — Insufficient listing filters (Tesco)

- **URL:** https://www.tesco.com/groceries/ (search result: `https://www.tesco.com/shop/en-GB/search?query=coffee`)
- **Screenshot (21 November 2026, live capture with cookie overlay hidden):** `docs/reference/03-tesco-filters.png`

![Tesco coffee search listing with compact filter control](docs/reference/03-tesco-filters.png)

- **Task:** narrow a listing by price range and availability, then sort by price.
- **Observed difficulty:** the coffee search listing exposes a single compact **Filter** button rather than an always-visible filter panel. Combining a price range with both price sort directions is not possible directly from the visible listing controls; the shopper must open the filter control and work through it before scanning results.
- **Possible business consequence:** budget shoppers may miss affordable options or abandon the list.
- **Cartly improvement:** combined search/category/availability/min-max price plus price, rating, and name sorting; URL persistence; mobile filter drawer.
- **Matching evidence:** `docs/screenshots/01-home-1280.jpg`, `docs/screenshots/07-home-390.jpg`.

![Cartly catalogue with combined filter controls](docs/screenshots/01-home-1280.jpg)

> Each problem uses the structure **URL → screenshot → task → observed difficulty → inferred consequence → improvement → matching screenshot**. Numbered reproduction steps are recorded in `docs/INVESTIGATION.md`.

## 5. Frontend decisions

### Decision 1 — Ranked, keyboard-operable autocomplete

- **Problem:** weak search suggestions slowed discovery.
- **Decision:** search name, brand, category, and keywords; show up to five ranked suggestions with keyboard support; keep the query in the URL.
- **Alternative:** submit-only search with a long result list.
- **Reason:** immediate feedback supports the product-identification task and makes results shareable/reproducible.
- **Tradeoff:** ranking/keyboard/blur state to maintain; only five suggestions shown.
- **Code:** `src/components/search/SearchAutocomplete.jsx`, `src/lib/search.js`, `src/pages/HomePage.jsx`.
- **Evidence:** `docs/screenshots/02-search-autocomplete-1280.jpg`; type `sound` and use Arrow Down + Enter to open a suggested product.

### Decision 2 — Delivery transparency beside the purchase action

- **Problem:** shipping charges and eligibility were difficult to see before checkout.
- **Decision:** product-page delivery panel plus repeated cart/checkout calculation and area validation.
- **Alternative:** show shipping only in the cart or a modal.
- **Reason:** delivered cost and eligibility are part of the purchase decision; one rule module prevents inconsistent messages.
- **Tradeoff:** denser product page; single-product free-delivery gap is only a guide.
- **Code:** `src/components/product/DeliveryPanel.jsx`, `src/lib/businessRules.js`, `src/data/deliveryAreas.js`, `src/pages/ProductDetailsPage.jsx`.
- **Evidence:** `docs/screenshots/03-product-details-1280.jpg`; open a product below Rs. 2,000, read the panel, then choose an unsupported area at checkout.

### Decision 3 — URL-synced filters with a mobile drawer

- **Problem:** listing filters were insufficient for price-led browsing.
- **Decision:** combine all filters/sorts with search, store them in URL parameters, show active chips, and use a mobile drawer.
- **Alternative:** local component or context state only.
- **Reason:** preserves the shopper's place across details, Back/Forward, and refresh; the filtered view is shareable.
- **Tradeoff:** longer URLs and defensive parsing; more history entries; drawer focus work.
- **Code:** `src/pages/HomePage.jsx`, `src/lib/search.js`, `src/components/filters/FiltersPanel.jsx`.
- **Evidence:** `docs/screenshots/01-home-1280.jpg`, `docs/screenshots/07-home-390.jpg`; combine `audio`, category Audio, min 3000, max 9000, In stock, Price low→high and refresh.

## 6. Implemented application

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

![Cartly catalogue at 1280 px](docs/screenshots/01-home-1280.jpg)

![Cartly cart with stock-aware quantities and delivery progress](docs/screenshots/04-cart-1280.jpg)

![Cartly controlled checkout form](docs/screenshots/05-checkout-1280.jpg)

![Cartly simulated order confirmation](docs/screenshots/06-order-confirmation-1280.jpg)

![Cartly catalogue at 390 px](docs/screenshots/07-home-390.jpg)

![Cartly business profile and rules at 390 px](docs/screenshots/08-about-rules-390.jpg)

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

- Automated browser checks passed on the development server and production preview in Chromium.
- Final automated console check in Microsoft Edge (21 November 2026, 1366 × 900 and 390 px, development server and production preview): all journey steps passed with no application errors or React warnings. A brief visual pass in the student's own browser is still recommended.

## 8. Limitations

- Frontend-only prototype: no backend, authentication, real payment, email/SMS, courier, or live stock.
- Orders are simulated and stored only in the current browser; they are not shared across devices.
- Delivery dates are estimates, not courier commitments.
- Ann Taylor and Tesco blocked automated live capture; the Ann Taylor image is an archived snapshot and the Tesco cookie overlay was hidden to reveal the underlying listing. Both facts are stated in the captions.
- Product names/brands are fictional; photos are licensed stock images.
- Deployment must be verified on the public URL after the repository is pushed.

## 9. Submission checklist

- [x] Student details, repository link, deployment link, and final commit hash filled in.
- [x] Three reference screenshots inserted with dates and captions.
- [x] Three decisions include alternative, reason, tradeoff, code location, and evidence.
- [x] Application screenshots inserted with design annotations.
- [x] Verification results match the submitted commit.
- [x] PDF exported and checked for readability.
- [ ] Public repository and deployment open without access requests (complete after pushing and deploying).
- [ ] Direct nested-route refresh verified on the deployment.
- [ ] ZIP named `24i-2109_Asma-Siddiqa_CY-A_A#02.zip`, excluding `node_modules` and `dist`.
- [ ] Report, repository, deployment, and ZIP all match.
- [ ] Submitted on Google Classroom before the deadline.
