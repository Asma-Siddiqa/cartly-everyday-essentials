# Cartly — Assignment 02 Requirements Checklist

Source: `Web Programming_A#02.pdf` (CS4032, Fall 2026), National University of Computer and Emerging Sciences, Islamabad Campus.

Legend: `[x]` implemented and verified · `[ ]` pending · `[manual]` requires the student's own account/browser evidence.

> **Student details are filled in** in `README.md` and `docs/REPORT_TEMPLATE.md` from the existing project. The public repository and deployment URLs should be re-checked after the student pushes and deploys the final commit.

**Current verification snapshot (22 November 2026):** `npm test` reports **41/41 passing**; `npm run build` succeeds. 27 automated Edge checks cover all routes, the full journey, boundaries, persistence, loading/error states, and 390/1280 px layouts with zero console errors. Public GitHub publication and Vercel deployment are complete and their nested routes were verified at both viewports. Only a brief visual pass in the student's own browser and the final Classroom submission remain. Details: `docs/VERIFICATION.md` sections 11–12 and `docs/AUDIT.md`.

---

## 1. Task 1 — Domain and three investigated problems

- [x] **1.1 Suitable domain:** online retail (e-commerce) for students and young professionals.
- [x] **Full journey supported:** browse products → search/filter/sort → details → selection/cart → checkout form → calculated summary → confirmation.
- [x] **1.2 Reference websites:** eXtra (search), Ann Taylor (shipping transparency), Tesco (listing filters).
- [x] **1.3 Three different problems:**
  1. Weak search suggestions (eXtra).
  2. Shipping charges and delivery eligibility not shown on product pages (Ann Taylor).
  3. Insufficient listing filters, especially price filtering (Tesco).
- [x] **Problems are distinct** (search discovery, delivery information, listing controls) and linked to business goals.
- [x] **1.4 Evidence plan:** URL, screenshot, task, observed difficulty, possible business consequence, and proposed improvement captured for each problem.
- [x] **Reference-site screenshots:** three genuine captures are stored in `docs/reference/` with dates, URLs, and limitations. Capture steps are recorded in `docs/INVESTIGATION.md`.
- [x] **Original work:** no copied branding, layout, assets, or code from the reference sites.

**Implementation:** `docs/INVESTIGATION.md`, `DECISIONS.md`, home search, product delivery panel, filter sidebar.

---

## 2. Task 2 — Business definition

| Element | Required detail | Cartly implementation |
| --- | --- | --- |
| Business identity | Name and products/services | **Cartly**, a local online retail store selling audio, tech, bags, stationery, home, footwear, and lifestyle products. |
| Primary audience | Specific customer group | Students and young professionals in Islamabad and Rawalpindi. |
| Operating area | City/region/delivery area | Delivery only to an explicit list of supported areas in Islamabad and Rawalpindi. |
| Main customer task | What customers should do | Browse, search, filter, compare, add to cart, change quantities, and place a simulated order. |
| Business goal | Completed action | Complete a transparent, validated checkout with no surprise delivery charges. |
| Offering | At least 10 records | 13 product records with stable IDs, brands, categories, PKR prices, images, ratings, stock, and delivery information. |

- [x] Business profile visible in the application (`/about`) and README.
- [x] Exactly one rule from each required category:
  - **Availability/capacity:** stock limit; quantity cannot exceed current stock; zero-stock products cannot be ordered.
  - **Eligibility/compatibility:** delivery only to explicitly supported Islamabad/Rawalpindi areas.
  - **Pricing/fulfilment:** Rs. 150 delivery below Rs. 2,000; free delivery at Rs. 2,000 or more.
- [x] Each rule states its exact condition.
- [x] Each rule is communicated before and at the point of use (product page, cart, checkout, hidden test controls at `/about?test=1`).
- [x] Each rule changes application behaviour and prevents invalid completion.
- [x] Boundary cases documented and tested (stock exactly at limit; 1 above; 0; Rs. 1,999 / 2,000 / 2,001; unsupported area).

**Implementation:** `src/data/products.js`, `src/data/deliveryAreas.js`, `src/lib/businessRules.js`, `src/pages/AboutPage.jsx`.

---

## 3. Task 3 — Three frontend decisions

- [x] One decision per investigated problem in `DECISIONS.md`.
- [x] Every entry has **Problem**, **Decision**, **Alternative**, **Reason**, **Tradeoff**, **Code location**, and **Evidence/reproduction steps**.
- [x] At least one decision concerns **interaction/state behaviour**: URL-synced filters and search (and cart state) — Decision 3.
- [x] At least one decision concerns **information hierarchy or mobile layout**: delivery panel placement and mobile filter drawer — Decisions 2 and 3.
- [x] Entries are short, specific, and reference real files/functions.
- [x] Improvement-evidence screenshots and reference screenshots are embedded in the PDF report.

---

## 4. Task 4 — Functional requirements (FR01–FR19)

| ID | Requirement | Implementation | Status |
| --- | --- | --- | --- |
| FR01 | Navigation; at least three meaningful routes; Back/Forward work | React Router DOM; six routes plus 404 fallback; header/footer links; browser history works | [x] |
| FR02 | Parameterized details route; invalid IDs show useful feedback | `/products/:id`; invalid ID renders a not-found panel with links back to the catalogue | [x] |
| FR03 | At least 10 local records with stable IDs | 13 records in `src/data/products.js` | [x] |
| FR04 | Search relevant text fields | Case-insensitive search across product name, brand, category (and keywords); URL `q` parameter; autocomplete | [x] |
| FR05 | At least one filter and sorting control; works with search | Category, availability, min price, max price; sorting by price (both directions) and rating; all composed together | [x] |
| FR06 | Details view with decision information | Image, description, brand, rating, PKR price, stock status, delivery charges, free-delivery eligibility, delivery estimate, supported areas | [x] |
| FR07 | Add/remove records; change quantities | Add to cart, quantity stepper, remove item, clear cart; stock-aware limits | [x] |
| FR08 | Shared state consistent across pages | React Context for cart and catalogue; header badge, details, cart, checkout, and confirmation all use the same state | [x] |
| FR09 | Controlled form with at least three user-editable fields | Full name, email, phone, address, city, area; all controlled | [x] |
| FR10 | At least three validation rules with specific feedback and preserved input | Six field rules; inline messages; error summary; valid values preserved; invalid checkout blocked | [x] |
| FR11 | Calculated summary | Item count, subtotal, delivery fee, free-delivery progress, final total; recomputed from cart | [x] |
| FR12 | All three business rules work and prevent invalid completion | Stock, supported-area, and delivery-fee rules exported and used in UI + checkout | [x] |
| FR13 | Local storage persistence and restore | Cart item IDs/quantities saved, restored, validated against current catalogue; corrupted data handled | [x] |
| FR14 | Async mock loader with loading, failure, retry | `getProducts()` promise, skeleton loading, error panel, working retry, retry recovers after a simulated one-shot failure | [x] |
| FR15 | Distinguish empty dataset from no search/filter matches; useful guidance | Separate empty-catalogue state and no-match state; reset filters/retry actions | [x] |
| FR16 | Clear confirmation or final summary | `/order-confirmation/:id` with simulated order summary, totals, delivery details, and order reference | [x] |
| FR17 | Responsive and keyboard accessible journey | Mobile navigation, stacked layouts, keyboard autocomplete, focus states, 390 px and 1280 px verification | [x] |
| FR18 | All three investigated improvements implemented | Autocomplete; delivery transparency panel; complete filter/sort controls | [x] |
| FR19 | Public deployment with working assets, navigation, nested-route refresh | Deployment-ready Vite build plus Vercel/Netlify SPA rewrite config; **manual deployment step required** (no credentials supplied) | [manual] |

**Additional user-specified requirements:**

- [x] Six required routes: `/`, `/products/:id`, `/cart`, `/checkout`, `/order-confirmation/:id`, `/about`.
- [x] Search, filters, and sorting work together.
- [x] Product comparison (compare tray and side-by-side dialog).
- [x] Realistic local records with all required fields.
- [x] Simulated order; no real payment details.
- [x] Cart survives refresh and navigation.
- [x] Loading, error, retry, empty catalogue, and no-match states.
- [x] Hidden test controls for loading failure and availability changes at `/about?test=1`, documented in the README.

---

## 5. React and JavaScript requirements

| Topic | Required use | Cartly location | Status |
| --- | --- | --- | --- |
| Components and modules | Function components in suitable files with imports/exports | `src/components/**`, `src/pages/**` | [x] |
| JSX | Valid JSX, expressions, semantic elements | All components | [x] |
| Props | Data passed to children | `ProductCard`, `QuantitySelector`, `StatusMessage`, layout components | [x] |
| Callback props | Child sends actions to state owner | `ProductCard` callbacks, `QuantitySelector`, `FiltersPanel`, `CheckoutForm` | [x] |
| Events | React handlers; prevent default submit | Search submit, add/remove, quantity, checkout form | [x] |
| State | `useState` for changing/controlled values | Search input, forms, test controls, compare tray, cart | [x] |
| Functional updates | Next state depends on previous | Cart add/update/remove, compare toggle | [x] |
| Objects | Immutable form/record updates | Checkout form, storage records | [x] |
| Arrays | Add/remove/update without mutation | Cart items, compare IDs, filtered lists | [x] |
| Lists and keys | Stable identifiers | Product grids, cart lines, suggestions, order items | [x] |
| Conditional rendering | Availability, validation, loading, error, empty states | Product card, details, cart, checkout, catalogue | [x] |
| Shared state | One consistent source of data | `CatalogContext`, `CartContext`, `CompareContext` | [x] |
| Derived values | Summaries from current data | Filtered products, delivery fee, totals, cart count, free-delivery gap | [x] |
| Effects | `useEffect` external synchronization | Catalogue loading, localStorage persistence, route title/scroll, storage event | [x] |
| Dependencies and cleanup | Correct dependencies and cleanup | Loader cancellation flag; storage event cleanup; debounced/effect cleanup | [x] |
| Data handling | Array methods, spread, destructuring, conditions used for real logic | Throughout data/service/context modules | [x] |
| Asynchronous code | Promises and async/await with failure handling | `src/services/productService.js`, `CatalogContext` | [x] |
| Browser storage | Read/write useful data | `src/lib/cartStorage.js`, `src/lib/orderStorage.js`, `src/lib/compareStorage.js` | [x] |
| Routing | Routes, URL parameters, links, navigation | `src/App.jsx`, header, cards, checkout, confirmation | [x] |

**Structure and code quality:**

- [x] Suitable folders for components, pages, data, assets, styles, mock loading logic, business rules, tests.
- [x] Meaningful names and consistent formatting.
- [x] Brief comments only where reasoning needs explanation.
- [x] Local data and simulated operations clearly labelled.
- [x] No real payment, credentials, or sensitive customer data stored.

---

## 6. Task 5 — Visual design, accessibility, responsiveness

### Visual design

- [x] Consistent Cartly identity using primary blue `#72AEFE` and dark charcoal `#2A2D34` with supporting accessible shades.
- [x] Clear information hierarchy on home, details, cart, checkout, confirmation.
- [x] One identifiable primary action per screen (e.g., Add to cart, Proceed to checkout, Place simulated order).
- [x] Distinct primary/secondary actions.
- [x] Consistent typography and spacing tokens via Tailwind config.
- [x] Clear selected, unavailable, error, success states.
- [x] Mobile layout designed intentionally, not merely shrunk.
- [x] Product images are locally stored Unsplash photos used under the Unsplash License; the README records the licence and a source-note step, and a fallback component covers failed images.
- [x] No prebuilt page templates or UI component kits.

### Accessibility

- [x] Semantic HTML: header, nav, main, section, article, aside, footer, form, fieldset.
- [x] Logical heading hierarchy (one `h1` per page, nested `h2`/`h3`).
- [x] Every form input has a connected `<label>`.
- [x] Buttons for actions; links for navigation.
- [x] Keyboard access to core interactions, including search suggestions and quantity controls.
- [x] Visible focus indicators via `focus-visible` rings and a global focus style.
- [x] Useful image `alt` text; decorative images marked `aria-hidden`.
- [x] Status text accompanies colour (in stock, low stock, out of stock, errors, success).
- [x] Errors are associated using `aria-invalid` and `aria-describedby`; submit displays an error summary.
- [x] Live regions for cart/search/status feedback.
- [x] Skip-to-content link.
- [x] No page-wide horizontal overflow at 390 px and 1280 px.
- [x] Buttons and links meet practical touch target sizes.

---

## 7. Task 6 — Edge cases and automated rule test

### 7.1 Manual checks

| Case | Required handling | Implementation | Status |
| --- | --- | --- | --- |
| Missing or lengthy content | Usable layout; fallbacks | Long descriptions wrap; image fallback; missing-field fallbacks; text truncation where appropriate | [x] |
| Empty results or invalid URL | Explain and offer next action | Empty/no-match panels with clear-filters link; invalid product/order IDs show recovery links | [x] |
| Invalid form input | Specific feedback; preserve valid input | Six validation rules; per-field messages; form state preserved | [x] |
| Unavailable or restored selection | Check current data/rules, explain, allow correction | Cart reconciliation detects deleted products, zero stock, and excessive quantities; displays notices and fixes/corrects | [x] |
| Loading failure | Clear error and working retry | Error panel + retry; one-shot failure demonstration recovers on retry | [x] |
| Loading failure test control | Reachable and documented | `/about?test=1` → **Test settings** → **Simulate load failure (next request)** | [x] |
| Changed availability demo control | Clearly labelled/documented | Stock scenario selector: standard, low stock, sold out; shared catalogue state | [x] |
| Console errors/warnings | Resolve | 27 automated Edge checks and production preview recorded zero application errors/warnings in `docs/VERIFICATION.md` section 11 | [x] |

- [x] Documented user actions, expected behaviour, and observed behaviour for each improvement.
- [x] Edge-case checklist and regenerated screenshots recorded in `docs/VERIFICATION.md`.
- [x] 27 automated Edge checks completed on the development server; production-preview nested-route refresh passed with no observed application errors or React warnings.
- [manual] Final manual Chrome/Edge pass with the console kept open. This is not yet claimed.
- [manual] Final student browser screenshot proof.

### 7.2 Automated business-rule test

- [x] Rule in a separate module: `src/lib/businessRules.js`.
- [x] Same function used by React application.
- [x] Test file uses `node:test` and `node:assert/strict`.
- [x] At least three cases: valid input, exactly at limit, invalid violation.
- [x] Additional boundary tests for Rs. 1,999 / 2,000 / 2,001 and unsupported area.
- [x] `npm test` maps to `node --test` and passes.
- [x] Test command and result documented in README and verification notes.

---

## 8. Task 7 — GitHub and deployment

### 8.1 GitHub

- [x] Local Git repository initialized with logical milestone commits (setup, browsing, cart/checkout, documentation, tests, and UI polish):
  1. Initial setup and business data.
  2. Components, routes, and product browsing.
  3. Selection/cart workflow, checkout form, and operating rules.
  4. Responsive design, accessibility, and improvements.
  5. Edge cases, rule tests, documentation, and deployment preparation.
- [x] Commit messages explain changes, and commits use genuine current timestamps (no backdating).
- [x] Source, dependency files, lockfile, README, DECISIONS, tests, and assets included.
- [x] `node_modules`, build output, and secrets excluded via `.gitignore`.
- [x] **Published to a public GitHub repository** — https://github.com/Asma-Siddiqa/cartly-everyday-essentials; implementation commit `d5fda9e66289ea6c9787472234706e02fc010258` pushed to `main`.
- [x] Public URL supplied in README/report.
- [manual] The repository history was assembled from the completed implementation using real timestamps. It does not recreate a repository created at the very start of development, and no history was fabricated or backdated.

### 8.2 Deployment

- [x] Production build succeeds.
- [x] SPA rewrite configuration included for Vercel (`vercel.json`) and Netlify (`public/_redirects`).
- [x] Relative/imported assets so hashed assets load after deployment.
- [x] Nested-route refresh support configured with SPA rewrites.
- [x] **Deployed to Vercel** — https://cartly-everyday-essentials.vercel.app; deployment `dpl_8RjkafySpv3TFGiyCnpdaCsjPidt`.
- [x] Verified public link, assets, main journey, nested-route refresh, and 390/1280 px layouts with zero console errors.

---

## 9. Submission requirements

- [x] PDF report with required sections in order (student/project details, business profile, operating rules, reference investigation, decisions, implemented application screenshots, verification, limitations).
  - [x] Report source in `docs/REPORT_TEMPLATE.md`; exported PDF at `docs/Cartly_Assignment_02_Report.pdf`.
- [x] Source-code ZIP named `24i-2109_Asma-Siddiqa_CY-A_A#02.zip`, excluding `node_modules`, `dist`, `.git`, and local Vercel files.
- [x] Public GitHub repository link.
- [x] Deployed website link.
- [x] Final implementation commit hash.
- [x] Source, local data, assets, styles, test file, dependency files, lockfile, README, and DECISIONS included.
- [x] No `node_modules`, build output, or secrets committed.
- [x] Report/repository/deployment/ZIP consistency plan documented.
- [manual] Submit on Google Classroom before deadline.
- [manual] Prepare for 10-minute viva using README concept map, DECISIONS, and verification notes.

---

## 10. Marking rubric coverage

| Category | Marks | How this project addresses it | Status |
| --- | --- | --- | --- |
| Functional application | 20 | Full six-route journey, discovery, details, cart, validated checkout, summary, confirmation | [x] |
| React and JavaScript | 20 | Components, props/callbacks, context, state, immutable/functions updates, derived values, async loader, effects, storage | [x] |
| Business rules | 10 | Three distinct rules, UI communication, enforcement, boundary tests | [x] |
| Visual design | 7 | Consistent identity, hierarchy, responsive layouts, clear states/actions | [x] |
| Responsiveness and accessibility | 8 | 390 px and 1280 px, semantic controls, keyboard access, labels, focus, live feedback | [x] |
| Edge cases and rule tests | 7 | Recovery states, hidden test controls, Node tests with boundary cases | [x] |
| Investigation and decisions | 7 | Three problems, decisions with alternatives/tradeoffs/code | [x] |
| GitHub and documentation | 3 | Public milestone history, README, DECISIONS, reproducible setup | [x] |
| Deployment | 3 | Vercel production deployment with verified nested-route refresh | [x] |
| Individual viva | 15 | Concept map and code organization support explanation; must be studied by student | [manual] |

---

## 11. Explicit non-goals / limitations

- No backend, authentication, real payments, or real order processing.
- No real courier integration; delivery times are estimates.
- Reference-site observations are recorded in `docs/INVESTIGATION.md`; the Ann Taylor image is an archived snapshot and the Tesco capture had its cookie overlay hidden. Do not claim those problems were re-verified on the live sites after the capture date.
- Product names, brands, and business details are fictional; product photos are licensed stock images.
- GitHub publication and deployment were completed with the student's authenticated accounts on 22 November 2026.
- The report and README record the final implementation commit; later commits are documentation-only.
