# Reference-Site Investigation

This document records the three reference problems that shaped Cartly and the screenshots captured for the report. Cartly does **not** copy reference-site branding, layouts, assets, or code.

> **Evidence status (captured 21 November 2026):** each problem below now has an actual browser screenshot in `docs/reference/`. Live access was available for eXtra. Ann Taylor and Tesco blocked automated access on the live sites (bot protection / repeated `403 Access Denied`), so the Ann Taylor image is an archived snapshot from the Internet Archive and the Tesco image is a live capture from the first successful load with the cookie overlay hidden. Their captions state this limitation honestly. These are observation records, not measurements.

## Summary

| # | Reference site | Problem area | Affected customer task | Cartly response |
| --- | --- | --- | --- | --- |
| 1 | eXtra | Weak search suggestions | Identifying the right product while typing | Ranked, keyboard-accessible autocomplete across name, brand, category, and keywords |
| 2 | Ann Taylor | Shipping cost and eligibility hidden until late | Judging delivered cost and whether delivery is possible | Delivery panel on the product page; repeated in cart/checkout |
| 3 | Tesco | Insufficient listing filters, especially price | Narrowing a large grocery/retail list by price and availability | Combined category, availability, min/max price, price/rating/name sorting, URL-synced |

Each problem affects a different part of the journey: **discovery**, **delivery information**, and **listing control**. They are therefore three distinct problems, not three variations of one visual complaint.

---

## Problem 1 — Search suggestions are too weak to support discovery

**Reference website:** eXtra — <https://www.extra.com/>

**Screenshot:** `docs/reference/01-extra-search.png` — live capture from `https://www.extra.com/en-sa` on 21 November 2026 at 1366 × 900. The query `head` is visible in the search field and the suggestion list shows text-only suggestions for headphones/headsets.

**Affected task.** A shopper types a product type or brand and wants to reach a relevant product quickly without scanning the whole catalogue.

**Observed difficulty (investigation notes).** The search experience did not offer strong, relevant suggestions while the shopper was typing. The shopper had to commit to a full search and then interpret a broad result list, even when the intended product type, brand, or category was already clear from the partial query.

**Possible business consequence (inference, not a measured statistic).** Extra steps between intent and a relevant product can increase search abandonment and reduce the chance that a shopper reaches a product page. Shoppers who do not know the exact product name are most affected.

**Proposed improvement.** Cartly searches product name, brand, category, and curated keywords. The autocomplete appears after two characters, ranks name matches ahead of weaker matches, shows a product image and PKR price, and supports Arrow Up/Down, Enter, and Escape. Submitting keeps the query in the URL (`?q=`) so the full result list is reproducible and survives refresh.

**Implementation evidence.**
- `src/lib/search.js` — `searchProducts`, `getSearchSuggestions`
- `src/components/search/SearchAutocomplete.jsx`
- Screenshot: `docs/screenshots/02-search-autocomplete-1280.jpg`
- Decision: `DECISIONS.md` → Decision 1

**Reproduction steps.**
1. Open the reference site's search field and type a partial product type or brand.
2. Capture the suggestion state, or the absence of useful suggestions, with the query visible and the page URL in the browser.
3. On Cartly, type `sound` or `audio` and confirm ranked product suggestions with prices.
4. Use Arrow Down + Enter to select a suggestion and confirm navigation to the product page.

---

## Problem 2 — Shipping cost and delivery eligibility appear too late

**Reference website:** Ann Taylor — <https://www.anntaylor.com/>

**Screenshot:** `docs/reference/02-ann-taylor-shipping.png` — Internet Archive snapshot of `https://www.anntaylor.com/` dated 3 January 2025, captured 21 November 2026 at 1366 × 900. The live site returned an automated-access block; the archived page shows the `FREE SHIPPING‡ WITH ORDERS OF $150+!` banner rather than product-page delivered-cost detail.

**Affected task.** A shopper is deciding whether a product is worth buying and needs the delivered cost and whether the store ships to their location.

**Observed difficulty (investigation notes).** Shipping cost and conditions were not easy to establish on the product page before checkout. The shopper had to add the item and move deeper into the order flow, or look for a separate shipping-policy area, to understand the delivered cost and eligibility.

**Possible business consequence (inference, not a measured statistic).** Late shipping charges create an unpleasant surprise at checkout and can cause abandonment. Shoppers outside the delivery area may spend time building an order that cannot be completed.

**Proposed improvement.** Cartly shows a delivery panel in the product purchase area, immediately below the price, stock, quantity, and add-to-cart controls. It states the delivery fee, the Rs. 2,000 free-delivery threshold, the exact amount remaining, the estimate, and the supported Islamabad/Rawalpindi areas. Cart and checkout repeat the calculation from the same rule module, and checkout blocks unsupported areas.

**Implementation evidence.**
- `src/components/product/DeliveryPanel.jsx`
- `src/lib/businessRules.js` — `getDeliveryFee`, `getAmountUntilFreeDelivery`, `calculateOrderTotals`, `isSupportedArea`
- `src/data/deliveryAreas.js`
- Screenshot: `docs/screenshots/03-product-details-1280.jpg`
- Decision: `DECISIONS.md` → Decision 2

**Reproduction steps.**
1. Open a reference-site product page and attempt to find the delivered cost and destination eligibility before adding the item.
2. Capture the product page and, if needed, the later shipping step that reveals the condition.
3. On Cartly, open a product priced below Rs. 2,000 and read the delivery panel.
4. Add the item, compare the cart totals, then choose an unsupported area at checkout to confirm the block.

---

## Problem 3 — Listing filters are insufficient for price-led shopping

**Reference website:** Tesco — <https://www.tesco.com/groceries/>

**Screenshot:** `docs/reference/03-tesco-filters.png` — live capture of `https://www.tesco.com/shop/en-GB/search?query=coffee` on 21 November 2026 at 1366 × 900, reached from the Tesco Groceries home page. The cookie-consent overlay was hidden only so the underlying listing controls can be seen; no site content was altered. The listing exposes a single compact **Filter** button rather than an always-visible combined price-range and bidirectional price-sort panel.

**Affected task.** A shopper has a search or category in mind and wants to narrow the list by price range and availability, then sort the remaining options by price.

**Observed difficulty (investigation notes).** The listing controls did not provide the combination needed for price-led browsing: a price range plus both price directions, together with the existing search. The shopper had to scan a long list and mentally compare prices, or repeatedly adjust coarse controls.

**Possible business consequence (inference, not a measured statistic).** Shoppers with a fixed budget may give up before finding an affordable option, and products outside the visible first results may be overlooked. Poorly composed filters also make it harder to explain why a result list is empty.

**Proposed improvement.** Cartly provides category, availability, minimum price, maximum price, price low→high, price high→low, rating, and name sorting. All controls compose with search. The active state is stored in the URL, active filters are shown as removable chips, and mobile uses a labelled filter drawer. Empty results distinguish “no match” from an empty catalogue and offer a clear reset.

**Implementation evidence.**
- `src/lib/search.js` — `filterAndSortProducts`
- `src/pages/HomePage.jsx` — URL-synced filter state
- `src/components/filters/FiltersPanel.jsx`
- Screenshots: `docs/screenshots/01-home-1280.jpg`, `docs/screenshots/07-home-390.jpg`
- Decision: `DECISIONS.md` → Decision 3

**Reproduction steps.**
1. Open the reference listing and apply a search or category.
2. Attempt to combine a price range with both price sort directions and capture the controls/result state.
3. On Cartly, combine `audio`, category **Audio**, minimum `3000`, maximum `9000`, **In stock**, and **Price: low to high**.
4. Confirm the URL, result order, Back/Forward restoration, and the mobile filter drawer.

---

Capture set actually used:

| File | Source | Capture note |
| --- | --- | --- |
| `docs/reference/01-extra-search.png` | Live `extra.com/en-sa` | 21 November 2026; query `head` typed; suggestion dropdown visible |
| `docs/reference/02-ann-taylor-shipping.png` | Internet Archive snapshot, 3 January 2025 | 21 November 2026; live site blocked automation; banner shows free-shipping threshold |
| `docs/reference/03-tesco-filters.png` | Live `tesco.com/shop/en-GB/search?query=coffee` | 21 November 2026; cookie overlay hidden to reveal the listing filter control |

All captures used a 1366 × 900 browser viewport, were taken without signing in, and contain no personal data. Where a live site blocked automated access, the limitation is recorded in the caption; the original investigation notes are used only as historical context.
