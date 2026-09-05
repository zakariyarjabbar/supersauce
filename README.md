# Super Sauce — Arabic restaurant website

A complete Arabic, right-to-left Next.js website for presenting a proposed online experience to Super Sauce in Iraq. The supplied logo and restaurant references define the red, cream, yellow-star and checkerboard identity.

**The default is a working sales demo.** Sample prices, branch details, generated photos and order confirmations are illustrative. Orders do not reach the restaurant and no money is collected. The user explicitly approved mock content for this presentation.

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
- 18 meals and sauce items, product detail pages, Arabic search, category filters, price sorting and saved favorites.
- Basket with quantities, removal and persistence on the current device.
- Complete demo checkout: delivery or pickup, branch choice, Arabic/Western Iraqi mobile-number validation, conditional address, calculated totals and printable demo receipt.
- Branch directory with search, city filters, eight example branch pages and Google Maps search links.
- Brand story, contact, careers, searchable FAQ, demo privacy and terms pages.
- Contact and careers validation on both client and server, error/retry feedback, optional live email integration.
- Mobile navigation, keyboard focus, reduced-motion support, local Arabic variable font, error/404/loading states.
- Page metadata, social preview image, sitemap/robots configuration, security headers and optimized WebP images.
- Automated desktop/mobile browser tests and readable TypeScript source.

## Deploy the presentation

The project runs on a Next.js-compatible Node host. It includes an API route, so it is **not** a folder of static HTML files.

### Vercel

1. Put the project in a Git repository and import it into Vercel as a Next.js project.
2. Use the project root as the root directory. The default install/build settings work: `npm ci`, `npm run build`.
3. Set `NEXT_PUBLIC_DEMO_MODE=true` and `NEXT_PUBLIC_SITE_URL` to the full deployed origin, for example `https://your-project.vercel.app`.
4. Deploy. No database, payment key or email key is required for the demo.

Keep demo mode enabled for the restaurant presentation. It adds the demo disclosures and prevents search indexing. Search engine directives are not password protection; use your hosting provider's access controls if you want a private preview.

### A Node server

Copy the source project, run `npm ci`, then `npm run build`. Run `npm run start` behind your host's HTTPS reverse proxy. Set the same environment variables before building. Do not upload `node_modules`, `.next` or `.env.local` from your computer. Install and build on the destination host.

Public environment variables are embedded during the build. Rebuild after changing them.

## Replace the mock content

| Content                                                              | File                                               |
| -------------------------------------------------------------------- | -------------------------------------------------- |
| Menu names, prices, categories, descriptions, ingredients and photos | `lib/menu.ts`                                      |
| Branches, hours, services and addresses                              | `lib/branches.ts`                                  |
| Brand name, public links, domain and demo setting                    | `lib/site.ts`                                      |
| Homepage copy and campaign sections                                  | `app/page.tsx`                                     |
| Brand story                                                          | `app/about/page.tsx`                               |
| Shared colors, type, spacing and responsive rules                    | `app/globals.css`                                  |
| Navigation and footer                                                | `components/header.tsx`, `components/footer.tsx`   |
| FAQ content                                                          | `components/faq-list.tsx`                          |
| Form fields and validation                                           | `components/contact-form.tsx`, `lib/validation.ts` |
| Form delivery                                                        | `app/api/contact/route.ts`                         |
| Demo order behavior and sample delivery fee                          | `components/order-flow.tsx`                        |
| Usage and privacy copy                                               | `app/terms/page.tsx`, `app/privacy/page.tsx`       |

Prices use whole Iraqi dinars. Each product and branch has a unique URL slug. Product cards and detail pages use the same data, so an edit updates both. Photos are shared between a few related sample products; replace them with item-specific photography when the menu is approved.

The directory intentionally shows **eight example branches**, while the brand headline says **more than 23**, as supplied by the user. Expand the directory with the complete approved list. The map buttons currently open a search, not a verified map pin. Replace `branchMapsUrl` with approved place links if available.

### Activating real contact email later

After the restaurant accepts the project, supply all three private server variables:

```dotenv
RESEND_API_KEY=your_resend_key
CONTACT_FROM_EMAIL=Super Sauce <website@your-verified-domain.com>
CONTACT_TO_EMAIL=the-restaurant-inbox@example.com
```

Then set `NEXT_PUBLIC_DEMO_MODE=false` and rebuild. The sender domain must be verified with Resend. The handler sends a plain-text message to the configured inbox with the visitor email as `reply_to`. It checks request origin, content type, payload size, field validation and a honeypot. Unconfigured or failed delivery returns a visible error; it never reports a sent message on a failed request. For a public live form, enable your host's rate limiting/abuse controls. Demo mode never calls Resend, even if keys exist.

API contract: [Resend Send Email](https://resend.com/docs/api-reference/emails/send-email). Live delivery requires your credentials and was not exercised during mock-site validation.

### Activating real orders later

When demo mode is disabled, the internal pretend checkout is replaced by links to the restaurant's public Talabat and Baly listings. The basket is a selection aid; it is not transferred into those apps. A direct POS order, delivery dispatch, live stock, online payment or order tracking integration requires the restaurant's chosen service and credentials. None is simulated as a live service.

Before the live launch, replace demo-specific FAQ/privacy/terms copy and all illustrative operational details. There is no claim that the restaurant has approved this proposal.

## Photos and provenance

- `assets/source/`: original supplied logo and seven generated PNG concept images.
- `public/images/`: optimized WebP delivery assets with adjacent provenance JSON.
- `content/asset-prompts.json`: complete image-generation prompts and logo source note.
- `scripts/prepare-assets.mjs`: reproducible WebP generation using Sharp.
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

The browser tests start a production server on port 3100 and cover desktop and phone layouts, Arabic menu search, favorites, basket persistence, checkout validation and totals, branch filters, demo contact/careers feedback, keyboard navigation, invalid API payloads and 404s. Build with demo mode enabled before running tests. Tests use only synthetic customer data.

The completed validation run passed 19 tests, with one mobile-only case skipped in the desktop project. Automated axe accessibility checks also run on the core pages. See `VALIDATION.md` for the tested scope.

Visual captures can be generated while the local site is running:

```sh
node scripts/capture-site.mjs
```

Screenshots are saved under `.impeccable/review/`, excluded from source control. `DESIGN.md` documents the implemented design system.

## English later

The site currently has one Arabic route tree and `lang="ar-IQ" dir="rtl"`. There is no non-working English switch. When English is approved, move copy into locale dictionaries, add locale routing, preserve product/branch IDs, and set language/direction per locale. The structured menu and branch data and shared components are ready for that extension.
