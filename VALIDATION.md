# Validation record

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
