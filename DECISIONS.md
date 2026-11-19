# Three Frontend Decisions

These decisions respond to the three investigated problems. Each entry records the problem, decision, one reasonable alternative, reason, tradeoff, code location, and reproduction evidence. Reference-site screenshots are the student's responsibility; see `docs/INVESTIGATION.md`.

---

## Decision 1 — Show relevant, keyboard-operable suggestions while the shopper types

**Problem.** In the investigated eXtra storefront, search did not surface strong, relevant suggestions while a shopper was still typing. A customer had to commit to a full search before learning whether the catalogue contained the right product, which made discovery slower and increased the chance of abandoning a search.

**Decision.** Add an autocomplete to both header and hero search. It searches name, brand, category, and curated keywords as the query changes, ranks name matches ahead of weaker field matches, shows up to five products with image and PKR price, and supports Arrow Up/Down, Enter, and Escape. Submitting or choosing a suggestion navigates to `/` with the query in `?q=`, so the result page is shareable and survives refresh. A short local draft state keeps typing responsive during React Router's start transition.

**Alternative.** Keep a submit-only search field and show a separate result page with a longer list. This is simpler and avoids suggestion ranking work, but it preserves the exact discovery delay the investigation identified.

**Reason.** The primary customer task starts with identifying a product. Suggestions give immediate feedback using the fields customers actually know (product type, brand, or category), while the URL query keeps results bookmarkable and consistent with the filter state.

**Tradeoff.** Suggestions add state, ranking, keyboard handling, and an outside-click/blur path to maintain. Limiting to five results can hide relevant products from the suggestion list, so the full search results page remains the complete view. Curated keywords must be kept up to date with the catalogue.

**Code location.**
- `src/components/search/SearchAutocomplete.jsx` — draft input, suggestion list, keyboard and ARIA behavior.
- `src/lib/search.js` — `searchProducts`, `getSearchSuggestions` (two-character minimum, five-item limit).
- `src/pages/HomePage.jsx` — reads `q` from `useSearchParams`.
- `src/components/layout/Header.jsx` — header instance of the same component.

**Evidence and reproduction.**
1. Open `/` and type `sound` in the hero search.
2. Confirm product suggestions appear with prices and can be selected with Arrow Down + Enter.
3. Submit the query and confirm the URL includes `?q=sound`; reload, and the search persists.
4. Screenshot: `docs/screenshots/02-search-autocomplete-1280.jpg`.

---

## Decision 2 — Put the complete delivery calculation on the product page, then repeat it in cart and checkout

**Problem.** In the investigated Ann Taylor product experience, shipping charges and eligibility were difficult to establish before checkout. Customers could choose an item without knowing the delivered cost or whether delivery was available to them, creating a late surprise in the journey.

**Decision.** Add a dedicated delivery panel to the product page, placed before the add-to-cart action. It states the current delivery charge for the product price, the Rs. 2,000 free-delivery threshold, the exact amount still needed for free delivery, the delivery estimate, and the supported Islamabad/Rawalpindi areas. The cart shows the same fee, a free-delivery progress message, and supported-area reminder; checkout repeats the fee and rejects unsupported areas. All values come from one exported rule module rather than duplicated literals.

**Alternative.** Show delivery information only in the cart or a shipping modal after the customer has added the item. This reduces product-page density but keeps the critical condition late in the decision process.

**Reason.** Delivered cost and eligibility are part of choosing a product, not an afterthought. Placing the panel beside price and stock lets a customer compare the real cost before adding to the cart. Repeating the same computed values in cart and checkout prevents conflicting messages.

**Tradeoff.** The product page carries more information, especially on mobile, and the free-delivery gap is only accurate for the current single-product context. It is a guide, not a guarantee for a multi-item cart; the cart and checkout remain the authoritative summary. An unsupported-area shopper may still browse, which is intentional, but cannot complete checkout.

**Code location.**
- `src/components/product/DeliveryPanel.jsx` — visible fee, threshold, gap, estimate, and area list.
- `src/lib/businessRules.js` — `getDeliveryFee`, `getAmountUntilFreeDelivery`, `calculateOrderTotals`, `isSupportedArea`.
- `src/data/deliveryAreas.js` — explicit supported cities and areas.
- `src/pages/ProductDetailsPage.jsx` — places the panel before the primary add-to-cart action.
- `src/pages/CartPage.jsx`, `src/pages/CheckoutPage.jsx` — repeat the calculation and eligibility checks.

**Evidence and reproduction.**
1. Open `/products/glide-wireless-mouse` (price below Rs. 2,000).
2. Confirm the panel shows **Rs. 150 delivery**, the amount still needed for free delivery, the estimate, and the supported areas.
3. Add the item and compare the same figures in the cart.
4. At checkout, choose **Other / not listed** and confirm the area is rejected with a specific message.
5. Screenshot: `docs/screenshots/03-product-details-1280.jpg`; mobile layout: `docs/screenshots/07-home-390.jpg`.

---

## Decision 3 — Keep search, filters, and sorting in the URL, with a mobile filter drawer

**Problem.** In the investigated Tesco listing experience, filtering was insufficient for price-led shopping: customers could not reliably narrow by a price range or sort by price in both directions while keeping a search active. On narrow screens, filter controls also competed with the product list for space.

**Decision.** Compose search, category, availability, minimum price, maximum price, sorting, and rating sorting into one derived list. Store every active control in the URL (`q`, `category`, `availability`, `min`, `max`, `sort`) through `useSearchParams`. Desktop uses a sticky filter sidebar; mobile uses a clearly labelled filter button that opens an in-page drawer. Active filters appear as removable chips, and every change recomputes the same list.

**Alternative.** Keep filter values in local component state or a global context only. This avoids URL plumbing but loses the state on refresh and Back/Forward, and makes filtered views harder to share or explain.

**Reason.** Price-led shoppers need to combine a query with a range and a sort direction, then move into a product and return without losing the narrowed list. The URL is the natural shared source for that interaction state, works with browser history, and makes the result reproducible during verification and viva.

**Tradeoff.** The URL becomes longer and must be parsed defensively for invalid values. Every filter change adds a history entry, which is useful for Back but can clutter history. The mobile drawer adds focus-management and layout complexity. The design accepts these costs because preserving the customer's place is central to the investigated problem.

**Code location.**
- `src/pages/HomePage.jsx` — reads/writes URL parameters, derives results, handles mobile drawer state.
- `src/lib/search.js` — `filterAndSortProducts` combines query, category, availability, inclusive price bounds, and sorting.
- `src/components/filters/FiltersPanel.jsx` — desktop panel, mobile drawer controls, active chips.
- `src/components/search/SearchAutocomplete.jsx` — updates `q` while preserving the other parameters.

**Evidence and reproduction.**
1. Open `/` and search for `audio`.
2. Set category **Audio**, minimum price `3000`, maximum price `9000`, availability **In stock**, and sort **Price: low to high**.
3. Confirm the URL contains all parameters and the visible results match.
4. Open a product and use browser Back; confirm the same search and filters return. Reload; they remain.
5. At 390 px, use the **Filters** button, apply a filter, close the drawer, and confirm no page-wide horizontal overflow.
6. Screenshots: `docs/screenshots/01-home-1280.jpg` and `docs/screenshots/07-home-390.jpg`.
