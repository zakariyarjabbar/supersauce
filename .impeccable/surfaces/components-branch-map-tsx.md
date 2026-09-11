---
version: 1
slug: "components-branch-map-tsx"
primary_target: "components/branch-map.tsx"
related_targets: ["app/page.tsx","components/branch-map.module.css","lib/branches.ts"]
---

# Homepage branch map

Scope: the `#branch-map` section in `app/page.tsx`. Visitor mode: Operate. A customer in Iraq finds a branch, inspects its details, and opens directions or a contact channel.

Direction: extend the existing Super Sauce identity. The user approved the desktop map with a fixed details panel and mobile pin selection with a bottom sheet, illustrated in `output/iraq-branch-map-concepts/side-panel.png` and `mobile-bottom-sheet.png`. Keep Alexandria Arabic, brand red, yellow selection accents, cream geography, and the checkerboard section seam. The country silhouette is the visual anchor; the selected branch and its directions are the action anchor.

Composition: heading and location action, city chips and search, a large Iraq map on the left and a 380px details panel on the right. Phone widths show the map across the content width and reveal branch details in a native bottom dialog. Search, clusters, map/list toggle and keyboard zoom/pan make every entry reachable.

Content: eight existing example branches now have sample Iraqi coordinates authorized by the user. Preserve existing hours and services as clearly labelled demo data. Use the existing illustrative restaurant photo. Empty phone/WhatsApp fields show unavailable controls until approved numbers are supplied; Instagram uses the existing profile. Coordinates and branch metadata are edited in `lib/branches.ts`.

Constraints: no map API key, remote tiles, cart, internal checkout, invented callable phone numbers, or deployment. Natural Earth public-domain geometry is bundled locally. Request geolocation only after the user clicks its button; compute nearest branch in the browser, with search as recovery if denied.

Finish: working selection/directions, accessible focus and dismissal, no page overflow at desktop/phone widths, passing production build, lint, browser checks, and a fresh finish review. The concept is a visual reference; generated phone numbers and misplaced geography in it are not product facts.

Pending content: replace demonstration coordinates, hours, addresses and photography; add approved phone and WhatsApp numbers. No design decision remains open.

## Recorded implementation

The surface extends `DESIGN.md`; it establishes no replacement global palette or type ramp. Brand red marks pins and actions, yellow identifies the selected location, and the cream map is drawn with subdued geographic boundaries and blue waterways. Those geographic colors are local map notation. Heavy Alexandria headings and smaller supporting text preserve the site's existing hierarchy.

Desktop uses a right-hand details panel (380px, reducing to 330px and 300px) beside the larger map. At 760px and below, the panel becomes a native bottom dialog, with a summary button below the map as another entry point. The dialog scrolls on short screens and restores focus on close. The map controls use at least 44px targets; reset stays in the upper-right corner, while zoom stays at the lower left, keeping the sample city labels clear at 320px.

Pins within the same city can form numbered clusters. Nearby city markers spread apart with guide lines to their real coordinate anchors. Search, city filters, map/list switching and opt-in location selection share the same branch data. Direct contact controls remain visibly unavailable when no approved destination exists.

The final independent review requested one change, the narrow-screen reset/label overlap. That change was corrected and scored resolved locally after the reviewer's follow-up reached the account limit. The final verdict is `ship` for that scored fix. The final documentation pass also ran locally within this surface boundary. Existing global design tokens and the sidecar were preserved; one-off geographic notation, sample operational content and stale sidecar entries were not promoted into global rules.
