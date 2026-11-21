# Cartly — React E-Commerce Frontend

**Course:** CS4032 Web Programming — Assignment 02 (Fall 2026)
**Student:** Asma Siddiqa
**Roll number:** 24i-2109
**Section:** CY-A
**GitHub repository:** https://github.com/Asma-Siddiqa/cartly-everyday-essentials
**Deployment:** https://cartly-everyday-essentials.vercel.app
**Final implementation commit:** `__FINAL_COMMIT__`

Cartly is a fictional local online retailer for students and young professionals in Islamabad and Rawalpindi. It is a frontend-only React application with a complete shopping journey: browse the catalogue, search and filter, open a product, build a cart, complete a validated delivery form, review calculated totals, and reach a simulated order confirmation.

The project addresses three frontend problems investigated in existing retail sites:

1. **Weak search suggestions** → search matches product name, brand, category, and curated keywords, with keyboard-accessible suggestions.
2. **Delivery charges hidden until late** → every product page shows the delivery fee, free-delivery threshold, amount remaining, estimate, and supported areas; cart and checkout repeat the same calculation.
3. **Insufficient listing filters** → category, availability, minimum/maximum price, and sorting by price (both directions), rating, and name can all be combined with search.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 18.3.1 with JSX (no TypeScript) |
| Build tool | Vite 6.4.6 |
| Routing | React Router DOM 6.30.6 |
| Styling | Tailwind CSS 3.4.19 with authored components; no UI kit or page template |
| Icons | `lucide-react` (icon library permitted by the brief) |
| Fonts | Locally bundled `@fontsource-variable` packages |
| Images | Locally stored, licensed Unsplash product photos with a fallback component |
| Tests | Node.js built-in `node:test` and `node:assert/strict` |
| Persistence | Browser `localStorage` (cart, compare list, non-sensitive order snapshots) |

## Requirements

- Node.js 20 or newer (verified with Node 22.20.0 and npm 10.9.3)
- npm

## Installation and commands

```bash
npm install
npm run dev       # development server, normally http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
npm test          # run all Node rule/unit tests with node --test
npm run test:rules # run only the business-rule test file
```

Verified results for the submitted snapshot:

- `npm test` → **41 tests, 41 passing, 0 failing**
- `npm run build` → **successful production build**

See `docs/VERIFICATION.md` for the full verification record.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Catalogue with search, autocomplete, filters, sorting, loading/error/empty/no-match states, and compare tray |
| `/products/:id` | Product details, stock status, delivery panel, quantity selection, compare action, related products; invalid IDs show recovery links |
| `/cart` | Cart lines, quantity changes, removal, reconciliation notices, delivery progress, and order summary |
| `/checkout` | Controlled delivery form, validation summary, supported-area eligibility, stock re-check, calculated totals, simulated order |
| `/order-confirmation/:id` | Simulated order summary and delivery details; invalid or corrupt order IDs show recovery links |
| `/about` | Business profile, operating rules, supported areas, investigated improvements, and labelled demo controls |
| `*` | Not-found page with links back to the shop |

Header and footer links use React Router, so browser Back/Forward works. Nested routes are configured for direct refresh through SPA rewrites.

## Features

- **13 local product records** with stable IDs, names, descriptions, categories, brands, PKR prices, local images, ratings, review counts, stock, highlights, delivery estimates, and keywords.
- **Search and autocomplete** across name, brand, category, and keywords; suggestions appear after two characters, support arrow keys/Enter/Escape, and are shown with prices.
- **Filters and sorting** for category, availability, minimum price, maximum price, price low→high, price high→low, rating, and name. Filter state is kept in the URL (`q`, `category`, `availability`, `min`, `max`, `sort`) so refresh/Back/Forward preserve it.
- **Product comparison** for up to three products, with a tray and a native `<dialog>` side-by-side table.
- **Cart persistence** using `localStorage`; only product IDs and quantities are stored. Restored carts are validated against the current catalogue and stock.
- **Asynchronous mock loader** with a visible skeleton, simulated failure, working retry, empty-catalogue state, and no-match state.
- **Labelled demo controls** on the About page for loading failure, empty catalogue, and stock scenarios (`standard`, `limited`, `sold-out`). They are kept out of the shop page so the catalogue stays focused on shopping.
- **Controlled checkout form** with six fields, inline errors, an error summary, preserved valid input, and focus management.
- **Derived totals** recalculated from the cart and shared rules: item count, subtotal, delivery fee, amount to free delivery, and total.
- **Responsive layouts** tested at 390 px and 1280 px, including a mobile menu, mobile filter drawer, stacked cards, and no page-wide horizontal overflow.
- **Accessibility support** including semantic landmarks, one `h1` per page, labels, visible focus rings, a skip link, keyboard-operable controls, text status labels, `aria-invalid`, `aria-describedby`, and live regions.

## Business profile

| Element | Cartly definition |
| --- | --- |
| Business identity | **Cartly**, a fictional local online retailer selling audio, tech, bags, stationery, home, footwear, and lifestyle products |
| Primary audience | Students and young professionals in the Islamabad–Rawalpindi area |
| Operating area | Only the explicitly listed areas of Islamabad and Rawalpindi |
| Main customer task | Find, compare, and order practical everyday products |
| Business goal | A transparent, low-surprise purchase with stock and delivery costs visible before checkout |
| Offering | 13 local products, each with a stable ID, price, stock, and delivery information |

## Operating rules

The rules are exported from `src/lib/businessRules.js` and imported by the React application.

### 1. Stock limit (availability/capacity)

- At least **1 unit** must be requested.
- Quantity must not exceed current stock.
- **Exactly** the available stock is allowed.
- **One unit above** stock is rejected.
- A **zero-stock** product cannot be added or ordered.
- Boundary: stock 4 accepts quantity 4 and rejects quantity 5; stock 0 rejects quantity 1.

### 2. Supported delivery areas (eligibility)

- Delivery is accepted only when the city is **Islamabad** or **Rawalpindi** and the area appears in the explicit list in `src/data/deliveryAreas.js`.
- An empty city or area fails validation.
- An unsupported or mistyped area is rejected, even if the city is supported.
- Boundary: Islamabad + F-11 is accepted; Islamabad + Saddar and Lahore + F-11 are rejected.

### 3. Delivery pricing (pricing/fulfilment)

- Orders below **Rs. 2,000** pay **Rs. 150** delivery.
- Orders at or above **Rs. 2,000** receive **free delivery**.
- Boundary: Rs. 1,999 → Rs. 150 fee; Rs. 2,000 → free; Rs. 2,001 → free.
- Constants: `DELIVERY_FEE = 150`, `FREE_DELIVERY_THRESHOLD = 2000`.

All three rules are communicated on the product page, in the cart, and at checkout, and all three can block invalid completion.

## Simulated operations and demo data

This is a frontend assignment prototype. It has no backend, authentication, real payment, courier integration, or real stock service.

- Products are loaded from local JavaScript data through an asynchronous mock loader that waits briefly and can be made to fail.
- Placing an order waits briefly, generates a local order ID, saves a **non-sensitive** snapshot, and navigates to the confirmation route.
- Order snapshots contain product IDs/names/quantities/prices, totals, city/area, and dates. **Name, email, phone, and street address are not stored.**
- Delivery dates are estimates (currently two days after the simulated order), not courier promises.
- Product brands and names are fictional; photos are licensed stock images. Licensing notes are in the assets section below.

## Reproducing edge cases

### Loading failure and retry

1. Open `/about` and use **Assignment demo controls** at the bottom.
2. Select **Simulate load failure**.
3. Return to `/` and confirm the catalogue is replaced by an error panel with a **Retry loading** action.
4. Select **Retry loading**. The retry request no longer forces failure and the catalogue loads.

### Empty catalogue vs no search matches

1. Open `/about` and use **Assignment demo controls**.
2. Enable **Empty catalogue**. Return to `/`; the result is an empty-catalogue message with a reset action, not a “no match” message.
3. Disable it, then search for a term such as `zzzz`. The result is a separate no-match panel with **Clear search/filters**.

### Changed availability

1. Open `/about` and use **Assignment demo controls**.
2. Choose **Low stock** or **Several items sold out**.
3. Return to `/` and check the catalogue, product details, cart, and checkout. Stock badges and quantity limits update from the same catalogue state.
4. Choose **Standard stock** to restore the original levels.

### Stock boundaries

1. Open `/products/orbit-smartwatch-s2` (standard stock: 3).
2. Increase quantity to 3: allowed. Attempt 4: the control stops at 3 and the stock rule explains the limit.
3. Open `/products/hydra-steel-bottle` (stock 0): the add-to-cart action is unavailable and the page explains why.

### Restored or invalid cart

1. Add products to the cart, reload the page, and confirm the cart survives.
2. In browser developer tools, edit `localStorage['cartly:cart:v1']` to an invalid JSON string and reload. The app resets the cart and shows a storage notice instead of crashing.
3. Save a valid cart, then switch **Several items sold out**. Products that became unavailable are removed, excessive quantities are reduced to stock, and the cart shows explanatory notices.

### Delivery thresholds

1. Add an item so the subtotal is below Rs. 2,000. Cart and checkout show **Rs. 150 delivery** and the remaining amount to free delivery.
2. Add products until the subtotal reaches Rs. 2,000. Delivery becomes **free** at exactly the threshold.
3. Verify the same figures in the order confirmation.

### Unsupported delivery area

1. Add a product and go to `/checkout`.
2. Choose **Other city** or leave the city empty; submit. The city error explains the service area.
3. Choose **Islamabad** and then **Other / not listed** as the area; submit. Checkout is blocked with a specific area error.
4. Choose a listed area to continue.

### Invalid product or order URL

- Visit `/products/not-a-real-id` or `/order-confirmation/not-a-real-id`. Each route shows a clear recovery panel with links back to the shop; the app does not crash.

## Known limitations

- No backend, real payments, authentication, email/SMS, courier integration, or live stock.
- Reference-site evidence is in `docs/reference/`. eXtra and Tesco were captured live on 21 November 2026; Ann Taylor blocked automated access, so an archived snapshot (3 January 2025) is used with that limitation stated in `docs/INVESTIGATION.md`.
- The order confirmation is retrievable only from the same browser's `localStorage`; orders are not shared across devices.
- Automated browser checks used Playwright Chromium, and a final automated Edge console check was completed on 21 November 2026 with no application errors or React warnings. See `docs/VERIFICATION.md`.
- The public repository and deployment must be pushed/verified with the student's own accounts; see "Deployment preparation" below.

## Project structure

```text
src/
├── assets/products/        Local product photos
├── components/
│   ├── cart/               Cart line, order summary
│   ├── compare/            Compare tray and dialog
│   ├── demo/               Labelled assignment demo controls (About page)
│   ├── filters/            Filter panel and active filter chips
│   ├── layout/             Header, footer, layout, route focus
│   ├── product/            Product card, grid, delivery panel
│   ├── search/             Keyboard-accessible autocomplete
│   └── ui/                 Buttons/status/image/quantity/rating primitives
├── config/demo.js          Simulated delays and availability scenarios
├── context/                Catalogue, cart, compare shared state
├── data/                   Products and explicit delivery areas
├── hooks/                  Page-title effect
├── lib/                    Rules, search, validation, storage, reconciliation
│   └── __tests__/          Node test files
├── pages/                  Six required routes plus not-found
├── services/               Async product loader and simulated orders
├── App.jsx                 Route table
├── index.css               Tailwind layers and global authored styles
└── main.jsx                Providers and router entry point
```

## Concept map for viva preparation

| Concept | File | Component/function |
| --- | --- | --- |
| Routing and URL parameters | `src/App.jsx` | `<Routes>`, `products/:id`, `order-confirmation/:id` |
| Shared catalogue state and async loading | `src/context/CatalogContext.jsx` | `CatalogProvider`, `useCatalog`, cancellation cleanup |
| Shared cart state | `src/context/CartContext.jsx` | `CartProvider`, functional updates, reconciliation, persistence |
| Compare selection | `src/context/CompareContext.jsx` | `CompareProvider`, maximum of three products |
| Business rules | `src/lib/businessRules.js` | `validateStockQuantity`, `getDeliveryFee`, `isSupportedArea`, `calculateOrderTotals` |
| Search and combined filtering | `src/lib/search.js` | `searchProducts`, `filterAndSortProducts`, `getSearchSuggestions` |
| Form validation | `src/lib/validation.js` | `validateCheckoutForm`, `getAreasForCity` |
| Saved-cart validation | `src/lib/cartReconciliation.js` | `reconcileCart` |
| Browser persistence | `src/lib/storage.js`, `src/lib/cartStorage.js` | namespaced keys, defensive JSON reads/writes |
| Async mock loader | `src/services/productService.js` | `getProducts`, `applyAvailabilityScenario` |
| Simulated order | `src/services/orderService.js` | `placeSimulatedOrder`, non-sensitive snapshot |
| Controlled checkout | `src/pages/CheckoutPage.jsx` | controlled values, errors, submit guard, focus summary |
| URL-synced filters | `src/pages/HomePage.jsx` | `useSearchParams`, derived result list |
| Delivery transparency | `src/components/product/DeliveryPanel.jsx` | fee, threshold, estimate, supported areas |
| Accessibility focus handling | `src/components/layout/RouteFocus.jsx` | route focus, hash targets, skip-link handling |

## Documentation

- `REQUIREMENTS.md` — requirement-by-requirement checklist and honest status.
- `DECISIONS.md` — three frontend decisions with alternatives, reasons, tradeoffs, code locations, and evidence.
- `docs/INVESTIGATION.md` — reference-site investigation notes and screenshot capture steps.
- `docs/VERIFICATION.md` — test results, browser checks, responsive checks, and edge-case record.
- `docs/REPORT_TEMPLATE.md` — PDF report outline with required sections and placeholders.
- `docs/screenshots/` — locally captured application screenshots at 1280 px and 390 px.

## Asset licensing

Product photographs are locally stored Unsplash images, used under the [Unsplash License](https://unsplash.com/license). The files are local so the catalogue does not depend on third-party hotlinks, and a `ProductImage` fallback covers failed loads. Fonts are locally bundled through Fontsource.

The exact Unsplash photo pages were not recorded in this working snapshot. Before submission, either record the source page for each local image in this section or replace the images with photos whose source URLs are documented. The Unsplash License does not require attribution, but keeping the source list makes the licence auditable. Do not claim a specific photographer or source without verifying it.

Cartly branding, copy, data, and components are original for this assignment; no reference-site branding, layout, or assets are copied.

## Deployment

The production build is deployment-ready. Hosts that support SPA rewrites are suitable.

### Vercel

1. Push the repository to GitHub and import it in Vercel.
2. Framework preset: **Vite**; build command: `npm run build`; output directory: `dist`.
3. `vercel.json` already rewrites all paths to `/index.html` so nested routes survive refresh.
4. After deployment, test the home page, a direct product URL, `/cart`, `/checkout`, and a direct `/order-confirmation/:id` URL.

### Netlify

1. Import the repository; build command `npm run build`; publish directory `dist`.
2. `public/_redirects` contains `/* /index.html 200`, which Vite copies into the build.
3. Verify direct nested-route refresh after deployment.

The expected public URLs are recorded at the top of this file. If the hosting service assigns a different URL, update the README and the report before submission.
