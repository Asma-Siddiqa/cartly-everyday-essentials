# Verification Record

Verified on **19 November 2026** against the local submitted snapshot.

- Node.js **22.20.0**, npm **10.9.3**
- Automated rule/unit tests: **41 passed, 0 failed**
- Production build: **successful**
- Browser automation: **Playwright Chromium 140**, development server and production preview
- Viewports: **390 px** and **1280 px**

> **Updated 22 November 2026:** the test controls are now reachable at `/about?test=1` after being hidden from the default customer UI. The re-verification results for this working tree are recorded in section 11. The public GitHub repository, public deployment, and source ZIP are the remaining external steps.

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
| **Simulate load failure (next request)** at `/about?test=1` | Error panel with retry | Pass |
| Retry after simulated failure | Catalogue loads successfully on the next request | Pass |
| **Simulate an empty catalogue** at `/about?test=1` | Empty-dataset message with reset action | Pass |
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
- [x] Publish the local Git history to a public GitHub repository and record the final implementation commit hash.
- [x] Deploy to Vercel and verify assets, the main journey, and direct nested-route refresh on the public URL.
- [x] Re-check that the report, repository, deployment, and ZIP all match the submitted implementation commit.
- [x] Name the ZIP `24i-2109_Asma-Siddiqa_CY-A_A#02.zip` using the student's real details.
- [x] Commit the working tree and update the published URLs and commit hash in `README.md` and the report.

## 11. Current working-tree re-verification (22 November 2026)

Environment: **Node v26.13.1**, npm **11.20.0**, Playwright **1.65.1** driving the installed Microsoft Edge browser. The development server ran at `http://127.0.0.1:5173`; the production preview ran at `http://127.0.0.1:4173`. Viewports were **1280 × 900** and **390 × 844**.

### Automated results

| Check | Command / method | Result |
| --- | --- | --- |
| Rule/unit tests | `npm test` | **41 tests, 41 passing, 0 failing** |
| Production build | `npm run build` | Success; **1640 modules transformed**, `dist/` generated |
| Development-server browser audit | Playwright/Edge, 27 named checks | **27 passed, 0 failed** |
| Console/page errors during that audit | Captured on every check | **0 application errors or React warnings** |
| Production preview smoke check | Direct refresh of `/`, `/products/:id`, `/about?test=1` | **All HTTP 200**, expected content rendered |
| Production preview 390 px product page | Document overflow check | **0 px overflow** |
| Production preview console/page errors | Captured across all preview pages | **0** |

### Browser audit details

All 27 checks passed:

| # | Check | Result |
| --- | --- | --- |
| 1 | Home loads with 13 products | Pass |
| 2 | No horizontal overflow at 1280 px on home | Pass |
| 3 | No horizontal overflow at 390 px on home | Pass |
| 4 | No horizontal overflow at 390 px on About | Pass |
| 5 | All six routes plus an invalid URL render recovery content | Pass |
| 6 | Direct refresh of a nested product route returns HTTP 200 | Pass |
| 7 | Autocomplete keyboard selection (ArrowDown/Enter) | Pass |
| 8 | Combined search, filters, sort, and URL persistence across refresh | Pass |
| 9 | No-match search message | Pass |
| 10 | Invalid price-range message | Pass |
| 11 | Back/Forward restores filter state | Pass |
| 12 | Add to cart updates the header count | Pass |
| 13 | Cart increase/decrease/remove | Pass |
| 14 | Product quantity cannot exceed stock | Pass |
| 15 | Out-of-stock product cannot be added | Pass |
| 16 | Cart restores after reload | Pass |
| 17 | Corrupted `localStorage` does not crash the app | Pass |
| 18 | Delivery fee shown below the Rs. 2,000 threshold | Pass |
| 19 | Invalid checkout submission is blocked with field errors | Pass |
| 20 | Valid checkout reaches simulated confirmation | Pass |
| 21 | Unsupported delivery area is blocked | Pass |
| 22 | Test controls hidden by default and visible at `/about?test=1` | Pass |
| 23 | Simulated loading failure shows retry; retry recovers | Pass |
| 24 | Empty-catalogue state and reset | Pass |
| 25 | Availability scenario changes the stock limit | Pass |
| 26 | 390 px mobile menu navigation | Pass |
| 27 | 390 px checkout usable with no overflow | Pass |

The loading-failure, empty-catalogue, and availability checks used site links after changing the test settings, because catalogue settings live in React state and are intentionally reset by a full browser reload.

### Screenshots and public URLs

The eight application screenshots in `docs/screenshots/` were regenerated from this working tree at the two required viewports and have the expected pixel dimensions (1280 × 900 and 390 × 844).

Initial public URL checks earlier on 22 November 2026, **before publication**, found that `https://cartly-everyday-essentials.vercel.app` and `https://github.com/Asma-Siddiqa/cartly-everyday-essentials` returned **404**. `https://github.com/Abdul-Wahab1210/Ecommerce_Frontend` is a different React/Vite project, and `https://ecommerce-frontend-one-self.vercel.app` served a Cartly home page but returned **404** for direct nested routes. Those findings were superseded by section 12.

Local deployment configuration (`vercel.json` and `public/_redirects`) is present and the local production preview passed direct nested-route refresh.

## 12. Publication and public verification (22 November 2026)

| Item | Result |
| --- | --- |
| GitHub repository | Created public at https://github.com/Asma-Siddiqa/cartly-everyday-essentials |
| Pushed implementation commit | `d5fda9e66289ea6c9787472234706e02fc010258` on `main` |
| Vercel project | `cartly-everyday-essentials` in scope `siddiqaasma04-gmailcoms-projects` |
| Deployment ID | `dpl_4sV3Zet3aBzvEPsj7yocBmRngWbq` |
| Production URL | https://cartly-everyday-essentials.vercel.app |
| Public repository reachable | Pass |
| Public home page at 1280 × 900 and 390 × 844 | Pass — 13 products rendered |
| Public direct `/products/glide-wireless-mouse` refresh | Pass at both viewports |
| Public `/about?test=1` route | Pass at both viewports |
| Public horizontal overflow at both viewports | 0 px |
| Public console/page errors | 0 |

The public checks used Microsoft Edge through Playwright against the deployed URL, not only the local preview. The final redeploy was made from `8c8ef8a04992a28f88e244b58b5514f10b86a4b3`, which changed documentation only; the application source is identical to implementation commit `d5fda9e66289ea6c9787472234706e02fc010258`.

Repository-cleanup commit `a45332533fdb9c11806cb5923542b99a16bc5782` was pushed next. It changed only `.gitignore` and PDF tracking: the PDF report remains on disk but is no longer tracked or included in the source ZIP. A later documentation-only commit records the final HEAD in the generated PDF and submission message; the deployed application source is unchanged.
