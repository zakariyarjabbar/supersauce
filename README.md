# Super Sauce — Arabic restaurant website

A complete Arabic, right-to-left Next.js website for Super Sauce in Iraq. The supplied logo and restaurant references define the red, cream, yellow-star and checkerboard identity.

**The menu uses the owner's supplied restaurant menu.** All 67 unique items, prices, meal upgrades and wing sizes were transcribed from 12 supplied pages. Branch details remain examples and the enhanced product photos are illustrative. Order buttons open contact options; the website does not submit orders or collect payments.

## Run locally

Use Node.js 22 or newer and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). All fonts and images are served with the project; there is no image CDN or font service to configure.

Production preview:

```sh
npm run build
npm run start
```

## What is included

- Campaign-style homepage with custom food photography and interactive menu categories.
- 67 items across nine categories, individual product images and pages, Arabic/English search, category filters and price sorting.
- Shared Order dialog on menu cards, product pages, branch pages and the header, with phone, WhatsApp and Instagram contact options. Prices stay visible; WhatsApp drafts include the selected item or branch.
- Keyboard-accessible native dialog with Escape, close-button and backdrop dismissal. Old `/order` links redirect to `/menu`.
- Branch directory with search, city filters, nine branch pages and Google Maps search links.
- Interactive Iraq map on the homepage: selectable pins, city clusters, search, map/list views, zoom/pan, a desktop details panel and a mobile bottom sheet. Directions use each entry's coordinates; optional geolocation finds the closest example.
- Brand story, contact, careers, searchable FAQ, privacy and terms pages with customer-facing copy.
- Contact and careers validation on both client and server, error/retry feedback, optional live email integration.
- Mobile navigation, keyboard focus, reduced-motion support, local Arabic variable font, error/404/loading states.
- Page-specific Open Graph and X previews, branded JPEG share cards, browser/Apple/Android icons, sitemap/robots configuration, security headers and optimized WebP website images.
- Automated desktop/mobile browser tests and readable TypeScript source.

## Deploy the website

The project runs on a Next.js-compatible Node host. It includes an API route, so it is **not** a folder of static HTML files.

### Vercel

1. Put the project in a Git repository and import it into Vercel as a Next.js project.
2. Use the project root as the root directory. The default install/build settings work: `npm ci`, `npm run build`.
3. Set `NEXT_PUBLIC_SITE_URL` to the full deployed origin, for example `https://your-project.vercel.app`.
4. Deploy. No database, payment key or email key is required. Contact and careers direct visitors to Instagram unless email delivery is configured.

Public pages remain indexable. The former `NEXT_PUBLIC_DEMO_MODE` setting is no longer used; an old value in hosting settings has no effect. Use your hosting provider's access controls if you want a private preview.

### A Node server

Copy the source project, run `npm ci`, then `npm run build`. Run `npm run start` behind your host's HTTPS reverse proxy. Set the same environment variables before building. Do not upload `node_modules`, `.next` or `.env.local` from your computer. Install and build on the destination host.

Public environment variables are embedded during the build. Rebuild after changing them.

## Shared-link previews

The homepage uses a branded Arabic card with the original Super Sauce logo and existing burger image. Open Graph clients receive a 1200 × 630 JPEG; X receives a 1200 × 600 version. Meal links use the meal photo, and branch links use the illustrative storefront with that branch's own title and address. Every public page has its own title, description and canonical URL.

Set `NEXT_PUBLIC_SITE_URL=https://supersauce-rho.vercel.app` before building, or replace it with the final custom domain. Use the public origin without a page path. If it is absent, the site uses Vercel's production domain, then its deployment domain, then this repository's verified public address. Explicit configuration takes priority. The previous localhost fallback made preview images inaccessible outside the development computer.

Preview metadata is included in the initial HTML head, including on the dynamic contact page. Images are static JPEG files under `public/social/`; no JavaScript, cookies or image transformation service is needed to fetch them. Public pages do not emit a `noindex` robots meta tag, and `robots.txt` links to the populated sitemap so search engines can crawl them. A password-protected deployment cannot provide public shared-link previews.

Edit `assets/social/share-card.html` to change the branded image, then export the delivery images and icon fallbacks:

```sh
npx playwright install chromium
npm run assets:share
```

The export uses the project's local font, existing imagery and SVG icon. Outputs and provenance records are committed, so the normal production build does not need a browser or an image-generation service. Product previews use `menu-*-v2.jpg` to avoid old cached sample photos. Increment the matching asset version in the export script and `lib/metadata.ts` when replacing published images. Catalog entries automatically receive a JPEG preview through `scripts/prepare-menu-assets.mjs`.

The implementation follows [Open Graph](https://ogp.me/) and X card metadata conventions. Actual preview layout, image cropping, refresh timing and whether a particular sharing surface displays a card are controlled by each platform. Tests simulate crawler requests; they do not send messages through WhatsApp, Instagram or other accounts. After deployment, check a fresh shared URL and use the platform's preview refresh tool when an older cached card remains visible.

## Replace the mock content

| Content                                                                  | File                                                                  |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Menu names, prices, descriptions, ingredients and options                | `content/menu-catalog.json`                                           |
| Menu categories and image paths                                          | `lib/menu.ts`                                                         |
| Original menu pages, duplicate handling and approved price conflicts     | `assets/menu-reference/`, `content/menu-source.json`                  |
| Product image prompts and delivery export                                | `content/menu-photo-prompts.json`, `scripts/prepare-menu-assets.mjs`  |
| Branches, map coordinates, phone/WhatsApp, hours, services and addresses | `lib/branches.ts`                                                     |
| Homepage map layout and behavior                                         | `components/branch-map.tsx`, `components/branch-map.module.css`       |
| Brand name, public links and domain                                      | `lib/site.ts`                                                         |
| Homepage copy and campaign sections                                      | `app/page.tsx`                                                        |
| Brand story                                                              | `app/about/page.tsx`                                                  |
| Shared colors, type, spacing and responsive rules                        | `app/globals.css`                                                     |
| Navigation and footer                                                    | `components/header.tsx`, `components/footer.tsx`                      |
| FAQ content                                                              | `components/faq-list.tsx`                                             |
| Form fields and validation                                               | `components/contact-form.tsx`, `lib/validation.ts`                    |
| Form delivery                                                            | `app/api/contact/route.ts`                                            |
| Order dialog and contact destinations                                    | `components/order-options.tsx`, `lib/order-contact.ts`, `lib/site.ts` |
| Usage and privacy copy                                                   | `app/terms/page.tsx`, `app/privacy/page.tsx`                          |

Prices use whole Iraqi dinars. Product cards, detail pages and the contact dialog use the same catalog. Wings offer 6 pieces for 5,000 IQD or 12 for 9,000 IQD. Burgers and sandwiches offer the printed 2,000 IQD meal upgrade; Zinger and Ayam Zaman also offer a 500 IQD cheese addition. Nashville (7,500) and Boomber (7,000) follow the final supplied page, explicitly confirmed by the owner.

Every product has its own branded image under `public/images/menu/`. The built-in ImageGen prompt set is saved in `content/menu-photo-prompts.json`; locally retained full-resolution PNGs are in `assets/menu-generated/` (excluded from Git). Run `npm run assets:menu` to export optimized WebP images and `menu-*-v2.jpg` social previews. The normal build only needs the checked-in delivery assets. Source menu pages are retained for future price and ingredient edits.

The directory has **nine branch entries**, including the user's Al Haswa addition, while the brand headline says **more than 23**, as supplied by the user. Expand the directory with the complete approved list. The original map coordinates were authorized sample locations in Iraq; source notes remain in the repository. The existing directory/detail-page map links search by branch name.

### Editing the Iraq map

The map supports mouse dragging, wheel zoom centered on the cursor, one-finger dragging and two-finger pinch zoom centered between the fingers. Gestures stay inside the map; scroll the surrounding page normally, or switch to the list for a scrollable branch directory. Zoom buttons, keyboard controls and the Iraq reset button remain available. Ctrl/Command-wheel is reserved for browser zoom.

Edit or duplicate an entry in `lib/branches.ts`. Give every branch a unique `slug`, then replace `name`, `city`, `area`, `address`, `hours`, `services` and `coordinates: { lat, lng }`. City filters, map pins, the list and branch pages are generated from this shared array. The current eight pins are grouped around Baghdad, Babel, Karbala and Najaf.

Set each branch's `phone` and `whatsapp` to approved numbers, preferably starting with `+964`. Empty fields fall back to the site-wide contact settings below; the map omits absent numbers and their actions while keeping directions and Instagram available. WhatsApp drafts identify the selected branch. Optional `image` accepts a local public image path; otherwise the existing illustrative storefront is used.

Nearby branches within a city form numbered clusters. Adjacent city buttons are separated slightly with guide lines to their coordinate anchors. Clicking a pin updates the desktop information panel or opens a keyboard-accessible mobile sheet. The red directions link opens Google Maps at that entry's exact coordinates. Replace sample coordinates before using those directions for a real visit.

The map uses bundled [Natural Earth vector data](https://github.com/nvkelso/natural-earth-vector/tree/master/geojson), available in the [public domain](https://www.naturalearthdata.com/about/terms-of-use/). It requires no API key, tile service or runtime network request for geography. The checked-in subset is `lib/iraq-map.json`; regenerate it when needed with:

```sh
node scripts/prepare-iraq-map.mjs
```

Geolocation runs only after clicking «استخدم موقعي» and accepting the browser prompt, on HTTPS or localhost. The browser computes the closest entry without storing or sending the customer's coordinates to the application server. Search and province filters remain available if permission is denied. `next.config.ts` permits geolocation for the same origin.

### Configuring contact email

To enable the contact and careers forms, supply all three private server variables:

```dotenv
RESEND_API_KEY=your_resend_key
CONTACT_FROM_EMAIL=Super Sauce <website@your-verified-domain.com>
CONTACT_TO_EMAIL=the-restaurant-inbox@example.com
```

Rebuild after configuring email. The sender domain must be verified with Resend. Without all three values, the pages show an Instagram contact action instead of collecting form data. The handler sends a plain-text message to the configured inbox with the visitor email as `reply_to`. It checks request origin, content type, payload size, field validation and a honeypot. Unconfigured or failed delivery returns an error; success is returned only after the provider accepts the message. For a public email form, enable your host's rate limiting/abuse controls. Tests mock the mail provider and never send messages.

API contract: [Resend Send Email](https://resend.com/docs/api-reference/emails/send-email). Live delivery requires your credentials and was not exercised during mock-site validation.

### Configuring order contact options

Set `NEXT_PUBLIC_ORDER_PHONE` and `NEXT_PUBLIC_ORDER_WHATSAPP` to restaurant-approved numbers in `.env.local` before building. International numbers should include the country code; Iraqi mobile numbers starting with `07`, `9647`, `009647` or `+9647`, including Arabic digits, are normalized automatically. The two numbers may differ. Empty or invalid numbers leave their option visibly unavailable, with Instagram still accessible using the existing account in `lib/site.ts`. Rebuild after changing public environment variables.

The phone option opens a `tel:` link. WhatsApp opens a prepared message that the customer reviews and sends; Instagram opens the restaurant profile to start a conversation. Item prices are displayed without being represented as a confirmed quote. No order is submitted by the site, and there is no basket, favorites storage, checkout, receipt, payment, delivery-fee calculation or customer-address form.

The owner requested removal of public demo notices on 12 September 2026. Branch-source notes and image provenance remain in the repository; removing presentation notices does not verify operational data or change the source images.

## Photos and provenance

- `assets/source/`: original supplied logo and seven generated PNG concept images.
- `public/images/`: optimized WebP delivery assets with adjacent provenance JSON.
- `content/asset-prompts.json`: complete image-generation prompts and logo source note.
- `content/menu-photo-prompts.json`: the 67 product prompts used with built-in ImageGen; `assets/menu-generated/` retains the selected PNGs locally and `public/images/menu/` contains the committed WebP files.
- `scripts/prepare-assets.mjs`: reproducible WebP generation using Sharp.
- `assets/social/share-card.html`, `scripts/prepare-share-assets.mjs`, `public/social/`: editable share-card layout, reproducible JPEG exports and their provenance records.
- `reference-photos/`: the original user reference files, preserved in the working project for design context; omitted from the downloadable source archive.

```sh
npm run assets:prepare
```

The logo is the original supplied artwork, framed with CSS. It has not been recreated as text. Food and restaurant photos are generated concepts and do not depict verified products or a real branch. Brand rights remain with their owners. Source prompt metadata identifies which images were generated.

Typography uses the self-hosted Alexandria variable font through `@fontsource-variable/alexandria`. Interface icons use Lucide. The installed packages include their license files.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

The browser tests start a production server on port 3100 and cover desktop and phone layouts, Arabic menu search and price sorting, contact dialogs and keyboard focus, removal of cart/favorites, legacy checkout redirects, branch filters, map clusters/selection/search/zoom/list, exact directions, geolocation success and denial, mobile-sheet dismissal and resizing, contact/careers Instagram fallback, keyboard navigation, invalid API payloads and 404s. Build without email credentials before running tests. Provider-delivery tests use a stubbed fetch and synthetic customer data.

Metadata tests inspect the original HTML of all 35 public pages, exercise nine crawler user agents against a dynamic route, download and decode every preview JPEG, and verify icons, manifest and crawl rules. Build and test with the same public URL environment settings.

Automated axe accessibility checks run on the core pages, the open Order dialog, the selected branch panel and the mobile branch sheet. The mobile-navigation and mobile-sheet tests are skipped in the desktop project. See `VALIDATION.md` for the tested scope.

Visual captures can be generated while the local site is running:

```sh
node scripts/capture-site.mjs
```

Screenshots are saved under `.impeccable/review/`, excluded from source control. `DESIGN.md` documents the implemented design system.

## English later

The site currently has one Arabic route tree and `lang="ar-IQ" dir="rtl"`. There is no non-working English switch. When English is approved, move copy into locale dictionaries, add locale routing, preserve product/branch IDs, and set language/direction per locale. The structured menu and branch data and shared components are ready for that extension.
