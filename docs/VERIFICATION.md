# Verification Record

Verified on **19 November 2026** against the local submitted snapshot.

- Node.js **22.20.0**, npm **10.9.3**
- Automated rule/unit tests: **41 passed, 0 failed**
- Production build: **successful**
- Browser automation: **Playwright Chromium 140**, development server and production preview
- Viewports: **390 px** and **1280 px**

> **Updated 21 November 2026:** the reference screenshots and the final Edge console pass are complete. The public GitHub repository and public deployment are the only remaining external steps; see the end of this document.

## 1. Automated checks

### Commands

```bash
export PATH="$HOME/.local/bin:$PATH"   # local Node installation used during development
npm test
npm run build
npm run preview
```

### Results

| Check | Command | Result |
| --- | --- | --- |
| All rule/unit tests | `npm test` | **41 tests, 41 passing, 0 failing** |
| Business-rule test only | `npm run test:rules` | Passing |
| Production build | `npm run build` | `✓ built`; `dist/` generated |
| Production preview | `npm run preview` | Served locally on `127.0.0.1:4174` |

### Test files

| File | Tests | What is covered |
| --- | ---: | --- |
| `src/lib/__tests__/businessRules.test.js` | 12 | Stock valid/exact/above/zero/invalid; delivery fee at Rs. 1,999 / 2,000 / 2,001; free-delivery gap; order totals; supported and unsupported areas; PKR formatting |
| `src/lib/__tests__/search.test.js` | 9 | Name/brand/category/keyword matching, case-insensitivity, multi-term queries, combined filters, availability, inclusive price bounds, both price directions, rating sort, suggestion minimum/limit |
| `src/lib/__tests__/validation.test.js` | 8 | Valid checkout, empty fields, invalid email/phone/name/address, unsupported city/area, missing city, no mutation, area options |
| `src/lib/__tests__/cartReconciliation.test.js` | 7 | Valid restore, removed product, newly out-of-stock product, quantity reduction, duplicate grouping, malformed entries, empty cart |
| `src/lib/__tests__/cartStorage.test.js` | 5 | ID/quantity round trip, corrupt JSON, wrong shape, invalid entries, storage failure, namespaced key |

The required three business-rule cases are explicit:

- valid input: `validateStockQuantity(8, 2)` → allowed;
- exactly at the limit: `validateStockQuantity(4, 4)` → allowed;
- breaking the limit: `validateStockQuantity(4, 5)` → rejected with “Only 4 units are available”;
- plus zero stock, invalid quantities, and delivery/eligibility boundaries.

## 2. Route and navigation checks

| Check | Expected | Observed |
| --- | --- | --- |
| `/` | Catalogue loads with 13 products | Pass |
| `/products/:id` | Valid product renders details | Pass |
| `/products/invalid-id` | Recovery panel, no crash | Pass |
| `/cart` | Cart route renders, empty state when appropriate | Pass |
| `/checkout` | Form and summary render; empty-cart guard | Pass |
| `/order-confirmation/:id` | Valid order renders; invalid ID shows recovery | Pass |
| `/about` | Business profile and all three rules | Pass |
| `*` | Not-found page with useful links | Pass |
| Browser Back/Forward | Search, filters, product, cart, and checkout remain consistent | Pass |
| Direct nested-route refresh | Product, cart, checkout, confirmation served after refresh (SPA rewrite/preview) | Pass |
| Header/footer links | Navigate without full-page reload | Pass |
| Mobile menu | Opens, navigates, closes; keyboard accessible | Pass |

## 3. Complete journey check

1. Catalogue loads through the asynchronous mock loader with a skeleton.
2. Search for a product, select a suggestion, and open details.
3. Apply a combined filter (category + availability + price range + price sort).
4. Add multiple products and compare up to three.
5. Change quantity, remove an item, and confirm derived totals.
6. Reload and confirm cart persistence.
7. Proceed to checkout, submit invalid values, and confirm specific errors plus preserved input.
8. Select a supported area, submit, and reach the confirmation route.
9. Confirm the displayed order items, subtotal, delivery fee, total, and delivery details.

**Observed:** all steps completed without application errors or React warnings in the automated Chromium session.

## 4. Business-rule boundary checks

### Stock

| Scenario | Expected | Observed |
| --- | --- | --- |
| Product with stock 3, quantity 3 | Allowed | Pass |
| Same product, attempt quantity 4 | Blocked/clamped; specific stock message | Pass |
| Product with stock 0 (`hydra-steel-bottle`) | Add action unavailable, out-of-stock explanation | Pass |
| Zero/negative/fractional quantity | Rejected by rule | Pass |

### Delivery pricing

| Subtotal | Expected delivery fee | Total | Observed |
| ---: | ---: | ---: | --- |
| Rs. 1,999 | Rs. 150 | Rs. 2,149 | Pass |
| Rs. 2,000 | Rs. 0 | Rs. 2,000 | Pass |
| Rs. 2,001 | Rs. 0 | Rs. 2,001 | Pass |

The cart shows the amount remaining to free delivery; the product panel, cart, checkout, and confirmation use the same calculation module.

### Delivery eligibility

| City | Area | Expected | Observed |
| --- | --- | --- | --- |
| Islamabad | F-11 | Accepted | Pass |
| Rawalpindi | Saddar | Accepted | Pass |
| Islamabad | Saddar | Rejected as a city/area mismatch | Pass |
| Islamabad | Other / not listed | Rejected | Pass |
| Other city / empty city | Any | Rejected with city message | Pass |
| Empty area | — | Rejected with area message | Pass |

## 5. Form validation checks

The controlled checkout form has six user-editable fields: full name, email, phone, address, city, area.

| Input | Expected feedback | Observed |
| --- | --- | --- |
| Empty submit | Error summary plus per-field messages; focus moves to summary | Pass |
| Name shorter than 3 characters or with digits | Specific name message | Pass |
| Invalid email | Example-based email message | Pass |
| Non-Pakistani or malformed phone | Mobile-format message | Pass |
| Address shorter than 10 characters | Specific detail message | Pass |
| Missing city | City required message | Pass |
| Unsupported area | Area-specific rejection | Pass |
| Valid values after an error | Other fields preserved; messages update | Pass |
| Double submit | Guarded while the simulated order is placing | Pass |

## 6. Persistence and recovery checks

| Scenario | Expected | Observed |
| --- | --- | --- |
| Cart survives reload/navigation | IDs and quantities restored | Pass |
| Corrupt `cartly:cart:v1` JSON | Reset with a storage notice, no crash | Pass |
| Wrong stored shape | Treated as corrupt/invalid entries ignored | Pass |
| Product removed from catalogue | Removed from restored cart with explanation | Pass |
| Product became out of stock | Removed with explanation | Pass |
| Saved quantity above new stock | Reduced to available stock with notice | Pass |
| Availability scenario changes | Cart reconciled against the new catalogue state | Pass |
| Storage write failure | Handled without crashing; order save reports an error | Pass |
| Sensitive data in orders | Name, email, phone, street address not persisted | Pass |

Keys used: `cartly:cart:v1`, `cartly:compare:v1`, `cartly:orders:v1`.

## 7. Async loading, empty, and error checks

| Scenario | Expected | Observed |
| --- | --- | --- |
| Initial catalogue load | Skeleton/status message, then products | Pass |
| **Simulate loading failure** control | Error panel with retry | Pass |
| Retry after simulated failure | Catalogue loads successfully on the next request | Pass |
| **Empty catalogue** control | Empty-dataset message with reset action | Pass |
| Search with no match | Separate no-match message with clear action | Pass |
| Invalid product/order URL | Useful recovery links | Pass |
| Image load failure | `ProductImage` fallback | Pass |

## 8. Responsive and accessibility checks

### Responsive

| Viewport | Checks | Observed |
| --- | --- | --- |
| 390 px | No page-wide horizontal overflow; menu, filter drawer, cards, details, cart, checkout, confirmation, footer usable | Pass |
| 1280 px | Full navigation, sidebar filters, grid, summary layouts | Pass |

Screenshots captured at both widths:

| File | View |
| --- | --- |
| `docs/screenshots/01-home-1280.jpg` | Home/catalogue, desktop |
| `docs/screenshots/02-search-autocomplete-1280.jpg` | Search suggestions |
| `docs/screenshots/03-product-details-1280.jpg` | Product details and delivery panel |
| `docs/screenshots/04-cart-1280.jpg` | Cart |
| `docs/screenshots/05-checkout-1280.jpg` | Checkout |
| `docs/screenshots/06-order-confirmation-1280.jpg` | Confirmation |
| `docs/screenshots/07-home-390.jpg` | Home, mobile |
| `docs/screenshots/08-about-rules-390.jpg` | About/rules, mobile |

### Accessibility

| Check | Observed |
| --- | --- |
| One `h1` per page and logical heading levels | Pass |
| Header/nav/main/footer landmarks; sections and forms labelled | Pass |
| Form labels connected to inputs | Pass |
| Visible focus rings; skip-to-content link | Pass |
| Keyboard autocomplete (Arrow/Enter/Escape) | Pass |
| Keyboard quantity, filter, menu, and dialog controls | Pass |
| Text status labels alongside colour | Pass |
| `aria-invalid` and `aria-describedby` on errors; error summary | Pass |
| Live regions for relevant status feedback | Pass |
| Meaningful image alt text; decorative icons hidden | Pass |
| No horizontal overflow at 390 px or 1280 px | Pass |

## 9. Browser and console status

- Automated checks ran in **Chromium 140** against both the Vite development server and the production preview.
- No application errors or React warnings were observed in those sessions.
- **Final Edge console check (21 November 2026):** the journey below was replayed in Microsoft Edge through Playwright at 1366 × 900 and 390 px on both the development server and the production preview, with console errors/warnings and page errors captured. Every step passed and **no application errors or React warnings were observed**. Favicon, React DevTools and extension messages were excluded from the count. This is an automated console check; a brief visual pass in the student's own browser is still recommended before submission.

### Reference-site evidence

| File | Source | Capture note |
| --- | --- | --- |
| `docs/reference/01-extra-search.png` | Live `extra.com/en-sa` | 21 November 2026; `head` query with text-only suggestions |
| `docs/reference/02-ann-taylor-shipping.png` | Internet Archive snapshot, 3 January 2025 | Live site blocked automation; free-shipping threshold banner |
| `docs/reference/03-tesco-filters.png` | Live `tesco.com/shop/en-GB/search?query=coffee` | Cookie overlay hidden to reveal the listing filter control |

## 10. Manual steps still required

- [x] Capture the three reference-site screenshots in `docs/reference/` and record the date/site state.
- [x] Complete a final Edge console check and note any warnings (automated; zero application errors/warnings).
- [ ] Optional: repeat the console check visually in the student's own Chrome/Edge browser.
- [x] Assemble the PDF report from `docs/REPORT_TEMPLATE.md`.
- [ ] Publish the local Git history to a public GitHub repository and record the final commit hash.
- [ ] Deploy to Vercel/Netlify and verify assets, the main journey, and direct nested-route refresh.
- [ ] Re-check that the report, repository, deployment, and ZIP all match the submitted commit.
- [ ] Name the ZIP `24i-2109_Asma-Siddiqa_CY-A_A#02.zip` using the student's real details.
