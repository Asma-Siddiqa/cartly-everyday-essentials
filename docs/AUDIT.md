# Assignment 02 — Pre-change Audit Checklist

Audit date: 22 November 2026. Source inspected: complete `src/` tree, all five Node test files,
`package.json`, Vite/PostCSS/Tailwind config, `index.html`, the six routes, all documentation in the
repository root and `docs/`, bundled screenshots, deployment configs, and local Git history.
The assignment PDF itself is **not present** in this working copy (`.gitignore` excludes it), so the
requirements supplied in the task and the existing `REQUIREMENTS.md` were used as the checklist.

Legend: **Complete** = verified by reading the implementation; **Partial** = code exists but an
access path, documentation claim, or behaviour needs correction; **Missing** = not found;
**Manual** = requires the student's accounts/browser or cannot be confirmed from source alone.

## A. Business website and investigation

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| Believable fictional business, name, products, audience, area, task, goal | Complete | `src/pages/AboutPage.jsx` profile array; `README.md` business profile; header banner | None |
| Customer-facing text free of assignment/competitor explanations | Complete (from previous cleanup) | Grep of `src/` shows no eXtra/Ann Taylor/Tesco/assignment explanation in rendered pages; docs still contain them intentionally | None |
| At least 10 local records with stable IDs | Complete | `src/data/products.js` — 13 products, stable slug IDs | None |
| Realistic, consistent product information | Complete | Each record has brand, category, price, image, rating, reviews, stock, highlights, estimate, keywords | None |
| Three investigations documented (eXtra, Ann Taylor, Tesco) | Complete | `docs/INVESTIGATION.md`, `DECISIONS.md`, `docs/REPORT_TEMPLATE.md` | Update wording where it claims live verification that was actually an archive/single capture |
| Research findings distinguished from current observations | Complete | Captions in `docs/INVESTIGATION.md` label archival snapshot and blocked live access; consequences marked as inference | None |
| Visual evidence for each investigation | Complete | `docs/reference/01-extra-search.png`, `02-ann-taylor-shipping.png`, `03-tesco-filters.png` (all present, 1366×900) | None |

## B. Investigation detail (URL, evidence, task, problem, difficulty, consequence, improvement, source)

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| All nine fields for each of three problems | Complete | `docs/INVESTIGATION.md` sections 1–3 and evidence checklist | None |
| No fabricated screenshots/dates/URLs | Complete (as recorded) | Each capture has a source, date, and limitation note; no claims of measurements | Student should re-check live sites before final submission if they want "current problem" claims |

## C. Three business rules

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| Availability rule (stock limit) | Complete | `validateStockQuantity` in `src/lib/businessRules.js`; used by cart and checkout | None |
| Eligibility rule (supported areas) | Complete | `isSupportedArea`; `src/data/deliveryAreas.js`; checkout validation | None |
| Pricing rule (Rs. 150 below Rs. 2,000, free at threshold) | Complete | `getDeliveryFee`, `calculateOrderTotals`; constants with numerical limit | None |
| Conditions, user communication, satisfied/violated behaviour, edge cases documented | Complete | `README.md` operating rules; `src/pages/AboutPage.jsx` customer policies; tests | None |
| Rules enforced in UI and logic, not only described | Complete | `CartContext`, `ProductDetailsPage`, `CheckoutPage` call the same module | None |

## D. DECISIONS.md

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| One decision per investigated problem with problem/solution/alternative/reason/tradeoff/code/evidence | Complete | `DECISIONS.md` decisions 1–3 | Fix two inaccurate statements: screenshots "student's responsibility" (now captured), and delivery panel "before add-to-cart" (it is directly below the purchase card) |
| Decisions match implemented features | Partial | All three features exist; placement wording in Decision 2 is inaccurate | Correct documentation wording |

## E. Routes and navigation

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| React Router, ≥3 meaningful routes | Complete | `src/App.jsx` — 6 routes plus `*` | None |
| Parameterized `/products/:id`, invalid IDs handled | Complete | `ProductDetailsPage` not-found panel | Verify in browser during final pass |
| Back/Forward and nested refresh | Partial (config verified) | `vercel.json` rewrite and `public/_redirects` present; `BrowserRouter` used | Verify with browser automation locally; public deployment still a manual step |
| Navigation links correct | Complete | Header, footer, breadcrumbs, cards use Router links | None |

## F. Product browsing

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| 13 local records, stable IDs, useful fields | Complete | `src/data/products.js` | None |
| Search with autocomplete, empty query, no suggestions | Complete | `SearchAutocomplete.jsx`, `lib/search.js`, tests | None |
| Price range filter works | Complete | `FiltersPanel.jsx`, `filterAndSortProducts`, inclusive-bound tests | None |
| Filters/sorting/search compose; empty state helpful | Complete | `HomePage.jsx`, `search.test.js` | None |
| Invalid/missing product message | Complete | `ProductDetailsPage` | None |

## G. Cart and shared state

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| Add/remove/increase/decrease/totals/count | Complete | `CartContext.jsx`, `CartLineItem.jsx`, `OrderSummary.jsx` | None |
| Stock cannot be exceeded | Complete | `addToCart`/`updateQuantity` use `validateStockQuantity` | None |
| Shared state, functional immutable updates | Complete | Contexts use functional `setState`, spreads, filters | None |

## H. Checkout form and validation

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| ≥6 controlled editable fields | Complete | `CheckoutPage.jsx` full name/email/phone/address/city/area | None |
| ≥3 validation rules, invalid data blocked | Complete | `lib/validation.js` and 8 validation tests | None |
| Summary from cart data, correct delivery/total | Complete | `calculateOrderTotals(subtotal)` | None |
| Business rules enforced at checkout | Complete | Stock loop, `isSupportedArea`, validation | None |
| Simulated confirmation, no real payments | Complete | `orderService.js`, `OrderConfirmationPage.jsx` | None |

## I. localStorage persistence

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| Cart saved/restored, corrupted data safe | Complete | `cartStorage.js`, `cartReconciliation.js`, 12 tests | Verify corrupt-data notice in browser pass |
| State consistent after updates | Complete | `CartContext` writes on change | None |

## J. Async loading, error handling, test controls

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| Async mock loader, visible loading state | Complete | `productService.js`, `CatalogContext.jsx`, skeleton components | None |
| Failure state and working retry | Complete | Error panels + `retry` with cancellation cleanup | None |
| **A way to simulate loading failure** | **Partial** | `simulateLoadFailure` exists in context and `DemoControls.jsx` implements it, but the component is **not rendered anywhere** after the earlier customer-facing cleanup | Restore access through a hidden `?test=1` route gate; update docs |
| **A way to change availability for testing** | **Partial** | Same: `setAvailabilityScenario` exists but no reachable UI | Restore with the same hidden test gate |

## K. Required React concepts

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| Functional components, JSX, props, callbacks, events | Complete | All page/component files | None |
| useState/useEffect, functional updates, immutable data | Complete | Contexts, forms, search, compare | None |
| Lists/keys, conditional rendering, derived values | Complete | Grids, suggestions, summaries | None |
| Shared state, dependency arrays, cleanup | Complete | `CatalogContext` cancellation flag; header Escape cleanup; dialog cleanup | None |
| Array methods, spread/destructuring, async/await, errors | Complete | Search, cart, services | None |
| localStorage, React Router | Complete | Storage modules, `App.jsx` | None |

## L. Business-rule module and automated tests

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| Separate exported rule module used by app and tests | Complete | `src/lib/businessRules.js` imported by UI and tests | None |
| `node:test` + `node:assert/strict`, valid/boundary/violating cases | Complete | 5 test files, 41 tests including required three cases | Re-run after changes |
| `node --test` command works | Partial (not re-run in this audit) | `npm test` maps to `node --test` | Run final verification |

## M. Responsive design and accessibility

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| 390 px and 1280 px layouts, no horizontal overflow | Partial (historical verification only) | `docs/VERIFICATION.md` records previous Playwright passes; screenshots present but pre-date the latest copy cleanup | Re-run automated checks and regenerate screenshots |
| Mobile navigation, cards, forms, labels, focus, semantics | Complete (code) | `Header.jsx`, `FiltersPanel.jsx`, `index.css` focus rule, labelled fields | Confirm in browser pass |

## N. Three frontend improvements are real

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| Autocomplete, delivery panel, price filter present and customer-facing | Complete | `SearchAutocomplete.jsx`, `DeliveryPanel.jsx`, `FiltersPanel.jsx` | None |
| No competitor/assignment promotional text in UI | Complete | Source grep after cleanup | None |

## Documentation and submission

| Requirement | Status | Evidence / finding | Action |
| --- | --- | --- | --- |
| README title/description/features/tech/install/run/test/structure/rules/limitations | Complete | `README.md` 274 lines | Update demo-control instructions and commit-hash note |
| Deployment link present | Complete (claimed) | `https://cartly-everyday-essentials.vercel.app` in README/report | Check URL reachability; cannot claim verified without a response |
| DECISIONS.md complete | Partial | See section D | Fix inaccurate wording |
| PDF report present | Complete | `docs/Cartly_Assignment_02_Report.pdf` (1.39 MB) | Regenerate after screenshot/doc updates |
| Screenshots present | Partial | 8 screenshots exist but were captured before the latest UI copy cleanup | Regenerate from current app |
| `REQUIREMENTS.md` accurate | Partial | Still says student details are placeholders, screenshots must be captured, PDF missing, demo controls on About page | Update to current state |
| Source ZIP | Missing (manual) | No ZIP in project root; student-specific filename required | Student to create after final commit |
| Git history with meaningful commits | Complete | 10 local commits, real dates; HEAD `967a5a9`; working tree has uncommitted copy cleanup | Student to commit remaining changes; do not fabricate commits |

## Immediate remediation plan

1. Restore a reachable test-control path at `/about?test=1` without changing the default customer UI.
2. Correct documentation wording (DECISIONS, README, REQUIREMENTS, VERIFICATION, report source).
3. Re-run tests and production build.
4. Run browser checks at 390 px and 1280 px, including all 20 edge cases and nested-route refresh.
5. Regenerate application screenshots and the PDF report from the current UI.
6. Report remaining manual tasks (GitHub publication, public deployment, ZIP, student browser pass).

## Final audit outcome (22 November 2026)

The table above records the state **before** remediation. The actions in that plan are now complete except for the explicitly manual submission steps.

| Area | Final status | Evidence |
| --- | --- | --- |
| A. Business website and investigation | Complete | Customer-facing copy cleaned; 13 local products; three investigations with dated evidence in `docs/INVESTIGATION.md` |
| B. Investigation detail | Complete | Nine required fields for each problem are present in `docs/INVESTIGATION.md` |
| C. Three business rules | Complete | `businessRules.js` shared by product, cart, checkout, and tests; automated and browser checks pass |
| D. DECISIONS.md | Complete | Screenshot and delivery-panel placement wording corrected; three decisions retain problem/solution/alternative/reason/tradeoff/code/evidence |
| E. Routes and navigation | Complete | Six routes plus invalid URL; direct refresh of nested product route passed on local production preview; public deployment still manual |
| F. Product browsing | Complete | Autocomplete, price filter, combined URL-synced filters, empty/no-match states verified in browser |
| G. Cart and shared state | Complete | Add/remove/quantity/totals and stock limits verified; corrupted storage handled |
| H. Checkout and validation | Complete | Invalid and valid submissions, unsupported area, and simulated confirmation verified |
| I. localStorage persistence | Complete | Cart and order persistence verified; corrupt data does not crash |
| J. Async loading and test controls | Complete | Hidden controls at `/about?test=1` verified for load failure/retry, empty catalogue/reset, and availability scenarios |
| K. React concepts | Complete | Functional components, hooks, controlled state, derived values, cleanup, router, and localStorage are in use |
| L. Rule module and tests | Complete | `npm test`: 41/41 passing; `npm run build`: successful, 1640 modules transformed |
| M. Responsive design and accessibility | Complete | 27 Edge checks at 390 px and 1280 px passed with zero console errors; screenshots regenerated |
| N. Three improvements are real | Complete | Autocomplete, delivery panel, and price filter remain customer-facing with no competitor/assignment promo text |
| README / DECISIONS / REQUIREMENTS / report | Complete | Stale commit, demo-control, placeholder, screenshot, and deployment claims corrected; PDF regenerated |
| Public GitHub / deployment / ZIP / final commit hash | Complete | Public repo and Vercel URL verified at both viewports; implementation commit `5ed26cc`; repository-cleanup commit `a5ee9e6` untracks the PDF and tidies `.gitignore`; source ZIP regenerated from the tracked project files |


