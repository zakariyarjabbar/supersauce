# Validation record

## 11 September 2026 — map touch and wheel navigation

Added two-finger pinch zoom and one-finger map dragging, plus desktop wheel zoom at the cursor. The map converts screen coordinates through the rendered SVG matrix, retains the zoom anchor, clamps zoom to 1–32, suppresses accidental branch activation after gestures, and cleans up native event listeners when switching to the list. List mode and the surrounding page retain normal scrolling; Ctrl/Command-wheel remains available for browser zoom. Arabic instructions describe the gestures.

Production build, TypeScript and lint passed. The 14 applicable map checks passed across the regression run and focused confirmation, with two desktop skips for mobile-only behavior. Chromium touch injection verified pinch in/out, transition to one-finger dragging, stable page scroll/viewport scale, and no accidental branch dialog. Real wheel input verified the geographic cursor anchor and scrolling outside the canvas. The existing map checks continue to cover branch selection, clusters, keyboard zoom/reset, filters, lists, geolocation and accessibility. Physical-device Safari was not exercised. The scoped detector reported 45 existing design-token advisories and no warnings or errors.

## 11 September 2026 — search indexing enabled

Removed the root `noindex, nofollow` metadata requested by the user. The public robots file allows normal pages, continues to exclude `/order` and `/api/`, and now advertises a populated sitemap in demo mode as well. Automated metadata checks verify that the homepage has no robots meta tag and that the sitemap contains the homepage and menu URLs.

## 11 September 2026 — shared-link previews

The deployed homepage was inspected with a preview-crawler user agent before this change. It returned an image URL on `http://localhost:3000` and a blanket `Disallow: /` rule. Both prevented reliable external preview fetching. Public origins now resolve from explicit configuration, Vercel environment settings or the repository's verified public address. Every public page supplies complete, consistent Open Graph and X metadata in the initial HTML head.

| Check | Result |
| --- | --- |
| Production build and TypeScript | Passed; 43 build outputs |
| ESLint and diff whitespace | Passed |
| Desktop/mobile regression suite | 46 passed, 2 intentionally skipped |
| Raw HTML metadata | All 35 public pages checked for canonical URL, Arabic title/description, image, dimensions, type and alt text |
| Crawler requests | Nine known/unknown user agents received complete initial-head metadata on the dynamic contact route |
| Preview delivery | Nine static JPEGs decoded successfully; 1200 × 630 Open Graph and 1200 × 600 branded X card; each under 180KB |
| Icons and manifest | Apple 180px, PNG 192px/512px, three-frame ICO and Arabic manifest served successfully |
| Final image export | Centered photo crops visually checked; all 10 metadata/asset tests passed again after export |

The branded card preserves the supplied logo, existing burger photo, Arabic Alexandria font and red/cream/checkerboard identity. It is exported from local HTML/CSS using Chromium; Sharp prepares static JPEGs and icon fallbacks. No new photograph was generated. The source layout and delivery images include provenance, and the README explains regeneration, public domain configuration and cache-versioned filenames.

The first integration pass exposed a local form-origin issue after removing the localhost canonical fallback. The API now compares the Origin header with the actual request Host and canonical site origin; requests from an unrelated origin remain rejected, including a forged forwarded-host header. Contact and careers demo forms pass on both viewports. The metadata tests also normalize equivalent homepage URLs with/without the trailing slash that Next.js removes.

The Impeccable scan ran once in degraded regex mode because its optional HTML parser modules were unavailable. It reported two warnings for the local Alexandria font alias and four size/radius advisories for the fixed-size exported artwork. These values preserve the existing brand and are intentionally scaled for the image canvas; the global design documents were not rewritten. Rendered OG/X cards and product/storefront crops were inspected separately from the detector output.

The two suite skips are existing mobile-only cases in the desktop project. Existing invalid-dynamic-route tests still return HTTP 404 while Next.js logs `NoFallbackError`. Preview tests send HTTP requests using crawler user-agent strings; they do not establish the rendered result inside every third-party app. No real messages, orders or emails were sent. Platforms control whether a particular surface displays a preview, as well as its crop and cache-refresh timing.

## 11 September 2026 — homepage Iraq branch map

Replaced the homepage branch banner with a local vector Iraq map using the eight shared demonstration branches and user-authorized sample coordinates. The existing menu/contact-order behavior remains covered by the regression suite.

| Check                           | Result                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Production build                | Passed; 42 build outputs                                                                               |
| TypeScript and ESLint           | Passed without errors or warnings                                                                      |
| Desktop/mobile Playwright suite | 36 passed, 2 intentionally skipped                                                                     |
| Automated WCAG A/AA checks      | Passed on core pages, Order dialog, selected desktop branch panel and mobile branch sheet              |
| Layout inspection               | 1536px desktop, 860px tablet, 390px phone and 320px narrow phone; no measured horizontal page overflow |
| Impeccable detector             | 45 design-system advisories: 37 typography, seven map colors, one radius; no mechanical warning/error  |
| Production direction contract   | `BRANCH-MAP: THESIS` confirmed in generated homepage HTML                                              |

The two skipped cases are mobile navigation and the mobile branch sheet in the desktop project; both run and pass in the mobile project. Map tests verify separate national-view city pins, Baghdad cluster expansion, keyboard zoom/pan/reset, city filters, Arabic search/empty-state recovery, list selection synchronization, branch hours, exact-coordinate directions, absent-number placeholders, existing Instagram destination, native-sheet focus containment/dismissal/resize, and geolocation success/denial. Browser permission is not requested before the customer's explicit location action. No real calls or messages were initiated.

The initial national-view grouping was adjusted to retain separate cities and use short guide lines when nearby marker buttons need spacing. The first test passes also exposed assertions reading `body.style.overflow` before React completed native-dialog close cleanup; those assertions now wait for the observable cleanup instead of sampling the same frame. The final full suite passes with no retries.

An independent finish review requested one material fix: the map reset button partly covered the Najaf label at 320px. Reset was moved to the upper-right corner, including the mobile override. The production build passed again, and recaptured desktop/tablet/phone layouts plus recorded element rectangles confirm the label is clear at all four widths. The reviewer's follow-up reached the account usage limit, so the verdict and surface documentation were completed locally using the fallback contracts. The local `ship` verdict scores that single fix resolved; it is not a second independent whole-surface approval. The surface brief records the implemented pattern without rewriting the inherited global design system.

Screenshots and capture metrics are in `.impeccable/review/branch-map-*`. Isolated section crops temporarily hide the unrelated sticky header/skip-link to avoid long element-capture artifacts; actual mobile-sheet viewport captures include the normal header. Phone dialog captures use 390 × 664 and 320 × 780 viewports. Short-screen sheets scroll internally. Existing `restaurant.webp` retains its provenance and is labelled illustrative; no new photographic asset was produced for this implementation.

Locations, addresses, hours and photos are demonstration content. Phone and WhatsApp remain unavailable until configured; directions currently point to the sample coordinates. Natural Earth geography loads from the local bundle, and opt-in nearest-branch calculations stay in the browser. Physical-device Safari, real location accuracy and live external-channel behavior were not exercised. The previously documented Next.js `NoFallbackError` logs still occur on intentional invalid dynamic-route requests, which return the expected HTTP 404.

## 10 September 2026 — menu and contact ordering

Validated the requested removal of cart, checkout, quantity controls and favorites. The menu data and prices in `lib/menu.ts` are unchanged. Menu cards, product pages, branch pages and the header now use one contact dialog. The previous `/order` route redirects to `/menu`, including old branch query links.

| Check                                 | Result                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| Production build                      | Passed; 42 build outputs                                                          |
| TypeScript                            | Passed; standalone typecheck and final production build                           |
| ESLint                                | Passed                                                                            |
| Desktop/mobile Playwright suite       | 25 passed, 1 skipped                                                              |
| Core pages and open dialog axe checks | Passed for the tested WCAG A/AA rules                                             |
| Visual review                         | Desktop 1440 × 1000, mobile 390 × 844, narrow 320 × 690, landscape 844 × 390      |
| Retired-feature cleanup               | Cart/favorites providers, checkout, validation and 209 obsolete CSS rules removed |
| Impeccable detector                   | Reported design-token advisories; existing design sidecar metadata is stale       |

The skipped test is mobile navigation in the desktop project; it passes on mobile. The first browser pass exposed a reverse-tab focus escape in the native dialog. Explicit keyboard wrapping fixed it, and the final suite verifies forward/reverse Tab, Escape, close-button and backdrop dismissal, restored focus and scrolling, item changes, contact destinations, preserved prices, legacy redirects and absence of restored cart/favorites controls.

Visual captures are in `/tmp/super-sauce-review/`. The menu and dialog have no measured horizontal overflow at the four tested sizes. Order buttons meet a 44-pixel minimum height; at narrow phone widths they sit below the price. The dialog scrolls internally on short screens. The design helper's existing sidecar drift was not refreshed; Impeccable's `document` command can refresh it separately.

Phone and WhatsApp have no restaurant-approved numbers configured in this workspace. Their rows therefore display as unavailable, with the existing Instagram profile available. Link-generation tests verify Iraqi/Arabic-number normalization, invalid/absent configuration, and item/branch text using synthetic data. External calls and messages were not initiated. Final integration with the restaurant's real numbers still needs those values in `NEXT_PUBLIC_ORDER_PHONE` and `NEXT_PUBLIC_ORDER_WHATSAPP`, followed by a rebuild.

Intentional invalid dynamic-route requests produce correct HTTP 404 responses and also log Next.js `NoFallbackError` messages on the server. No browser page errors occurred in the page-render checks. Physical-device Safari and real external-channel behavior were not exercised.

## 5 September 2026 — historical baseline before this change

Validated locally on 5 September 2026 in default demo mode.

| Check                                   | Result                                                   |
| --------------------------------------- | -------------------------------------------------------- |
| `npm run build`                         | Passed; 42 build outputs generated                       |
| `npm run typecheck`                     | Passed                                                   |
| `npm run lint`                          | Passed                                                   |
| `npm audit`                             | 0 reported vulnerabilities                               |
| `npm test`                              | 19 passed, 1 skipped                                     |
| Desktop and mobile core-page axe checks | Passed for the tested WCAG A/AA rules                    |
| Asset provenance scan                   | 16 source/delivery rasters, 0 missing provenance records |
| Impeccable mechanical UI detector       | No findings on `app` and `components`                    |

The one skipped case is the mobile navigation test in the desktop project. That same test passes in the mobile project.

Browser tests use Chromium at 1440 × 1000 and an emulated 390-pixel iPhone viewport. They verify rendering and loaded images across 12 representative routes, Arabic/RTL attributes, no horizontal page overflow, menu filters/search/favorites, local basket persistence and corrupt-entry cleanup, quantity and pickup/delivery calculations, form validation, explicitly labeled demo success, branch search, keyboard accordion/navigation, API rejection paths, robots rules and invalid-page HTTP statuses.

Visual evidence is in `.impeccable/review/`: home, menu, checkout, branches, contact and about pages at desktop and phone sizes. Entrance motion was disabled and fonts/images were settled for captures. The final captures include the darker muted text token that satisfies the breadcrumb contrast check.

An independent reviewer used the fallback reviewer contract because the harness has no named reviewer-type selector. The reviewer requested visible keyboard outlines on three red sections and removal of decorative About-section numbering. Both fixes were applied, rebuilt and recaptured. The final **ship** verdict scores both requested fixes resolved; it is a verdict on that fix list, not a claim of exhaustive certification. Lint, TypeScript, production build and both core-page accessibility tests passed again after the correction.

The automated accessibility checks cover the rules the tool can detect on the tested states; they are not a complete accessibility certification. Physical-device Safari and live third-party services were not tested. Contact delivery needs the restaurant's email configuration, and direct orders/payment are intentionally absent from this mock experience. Tests sent no real email, order or payment.
