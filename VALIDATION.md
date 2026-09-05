# Validation record

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
