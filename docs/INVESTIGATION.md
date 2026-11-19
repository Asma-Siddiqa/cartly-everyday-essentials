# Reference-Site Investigation

This document records the three reference problems that shaped Cartly and the evidence still required from the student's own browser session. Cartly does **not** copy reference-site branding, layouts, assets, or code.

> **Evidence status:** The observations below are the investigation notes used to define the assignment problems. They must be re-checked against the live sites and supported with the student's own dated screenshots before the PDF report is submitted. Do not present these notes as freshly verified live behaviour.

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

**Screenshot placeholder:** `docs/reference/01-extra-search.png` *(student capture required)*

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

**Screenshot placeholder:** `docs/reference/02-ann-taylor-shipping.png` *(student capture required)*

**Affected task.** A shopper is deciding whether a product is worth buying and needs the delivered cost and whether the store ships to their location.

**Observed difficulty (investigation notes).** Shipping cost and conditions were not easy to establish on the product page before checkout. The shopper had to add the item and move deeper into the order flow, or look for a separate shipping-policy area, to understand the delivered cost and eligibility.

**Possible business consequence (inference, not a measured statistic).** Late shipping charges create an unpleasant surprise at checkout and can cause abandonment. Shoppers outside the delivery area may spend time building an order that cannot be completed.

**Proposed improvement.** Cartly shows a delivery panel next to the product's price and stock, before the add-to-cart action. It states the delivery fee, the Rs. 2,000 free-delivery threshold, the exact amount remaining, the estimate, and the supported Islamabad/Rawalpindi areas. Cart and checkout repeat the calculation from the same rule module, and checkout blocks unsupported areas.

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

**Screenshot placeholder:** `docs/reference/03-tesco-filters.png` *(student capture required)*

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

## Evidence checklist for the report

For each problem, the PDF report needs:

- [ ] Reference website URL visible in the screenshot or caption.
- [ ] A dated screenshot of the relevant interface.
- [ ] The customer task being attempted.
- [ ] Numbered steps to reproduce the difficulty.
- [ ] A clear separation between **observed** interface behaviour and **inferred** business consequence.
- [ ] A matching Cartly screenshot showing the improvement.
- [ ] A caption linking the evidence to the decision entry.

Suggested capture set (create `docs/reference/` locally; it is intentionally not generated or fabricated here):

```text
docs/reference/01-extra-search.png
docs/reference/02-ann-taylor-shipping.png
docs/reference/03-tesco-filters.png
```

When capturing, keep the browser width and date consistent, avoid logging in with personal accounts, and do not include personal data in the screenshot. If a live site has changed and a problem can no longer be reproduced, record that fact honestly and use the original investigation notes only as historical context.
