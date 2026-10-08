# Toro Fruit — Website Rebuild

Redesign and rebuild of https://torofruit.com, a WordPress (X theme + Slider Revolution) site from 2020, as a modern, fast, SEO-optimised **Astro** site styled with **Lumos for Astro** and deployed on **Vercel**.

**Client:** Toro Fruit, a South African B2B exporter of fresh and frozen fruit (dried fruit has been discontinued) to international importers, retailers and distributors.
**Audience:** Procurement and import buyers, not consumers. Tone is professional, credible and export-focused.
**Primary goal:** Generate qualified B2B enquiries through the contact form. Secondary goal: rank for export and sourcing searches in target markets.

---

## Stack

| Concern              | Choice                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Framework            | Astro (the version Lumos installs, currently Astro 7.x)                                              |
| Styling / components | [Lumos for Astro](https://lumosframework.com/docs/) (beta, v0.0.x)                                   |
| Content              | Astro content collections (Markdown / JSON in the repo, schema-validated)                            |
| Forms                | Astro API route on Vercel, email sent via **Resend**                                                 |
| Analytics            | **GA4** + **Microsoft Clarity**, loaded only after cookie consent                                    |
| Hosting              | Vercel (`@astrojs/vercel` adapter). GitHub repo, `main` = production, branches/PRs = preview deploys |
| Node                 | >= 22.12.0                                                                                           |
| Package manager      | npm                                                                                                  |
| Language             | English only (`en`), no i18n                                                                         |

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (run before every commit that touches pages/config)
npm run preview    # preview the production build
npm run format     # Prettier (Lumos config)
```

Scaffold (first time only): `npm create lumos@latest` and keep this CLAUDE.md at the repo root.

---

## Lumos rules (read the docs before building)

Lumos is beta, so APIs may change before v1. **Check the current docs rather than guessing component props:** https://lumosframework.com/docs/. The key pages are `/docs/project-structure`, `/docs/concepts/*`, `/docs/components/*`, `/docs/classes/utilities` and `/docs/classes/tokens`.

- **Use Lumos components first** (Section, ContentWrapper, Grid, Heading, Paragraph, RichText, Eyebrow, Button, Card, Img, Nav, Footer, Form, Input, Accordion, Slider, Marquee, BaseHead, and so on). Build a custom component only when no Lumos component fits.
- **Don't edit framework components in `src/components/`.** Create project components in their own folder (e.g. `src/components/site/`) so Lumos upgrades stay clean.
- **Tokens:** edit design tokens only in `src/styles/base.css` (colors, `--brand-*`, type, spacing). Never hardcode colors, sizes or spacing in components. Use tokens.
- **Use rem only.** Never mix in `px`.
- **Fluid, breakpointless:** use Lumos fluid type and spacing, autofit grids and **container queries**. Avoid viewport media queries except for reduced motion.
- **Theming:** apply themes with a class on the section. Children inherit, so don't restyle children per theme.
- **Readable markup:** a variant is one class on the parent. Prefer one named class over stacks of `u-` utilities.
- **Accessibility is built in:** use semantic elements, landmarks, SkipLink, visible focus states, labelled inputs and `prefers-reduced-motion` support. Target WCAG 2.1 AA.
- **Assets:** images go in `src/assets/` and are imported via Astro/Lumos `Img` so they get optimisation (AVIF/WebP, responsive `srcset`, explicit width and height). `public/` holds only files served as-is (favicons, robots.txt, OG images, PDFs).
- **Agent skills** ship in `.agents/skills/` (aliased in `.claude/skills/`):
  - `lumos-import-figma`: use it to build pages and sections from the Figma designs. It maps designs to existing tokens and components.
  - `lumos-upgrade-version`: use it for Lumos upgrades. Never upgrade by hand.
  - `lumos-audit-props`: use it to check custom component props.

## Design source

- Designs are made **in Figma first**, and code follows the Figma file. Don't invent layouts when a design exists. Ask if a page has no design yet.
- Figma file: https://www.figma.com/design/JFbXhjD1hXC5p0ZowguGCo/Toro-Fruit. The pages are **Design System** (components), **Home**, **Fresh Fruit**, **Contact**, **Food Safety** and **About Us** (desktop 1440; mobile 375 still to do). Fresh Fruit has an "Interaction states" frame beside it. Build its fruit list as a Lumos Accordion: `Fruit Row` is the trigger and `Fruit Panel` is the content. Keep the months as data in the products content collection. The current-month "Now" band is computed from the visitor's date and breaks per group and around an open item.
- Company pages: Food Safety uses a dark hero and alternating image/text sections with circle photos (current-site images, cropped inside their outline). The one photo of a person there (a strawberry picker) is fine to keep. About Us is a raspberry fruit-only hero, a marquee band, a placeholder for the client's own story, and a call to action. **The owners want to stay low-profile: no staff or team section, no names, no photos of people and no personal details on About Us.** Use fruit imagery instead. The client will send their story directly; until it arrives the section is a dashed placeholder, and the old draft copy was dropped. Avoid adding photos of people elsewhere without asking; the Home "How we work" collage still uses a container-loading photo with workers in it. The "four key regions" claim and the third affiliation logo are still to be confirmed.
- Figma variables mirror `base.css` token names. **Swatch** holds the raw colours, **Theme** has Light/Dark/Brand modes mapping to `.theme-*`, **Sizes** is Desktop (= `-max`) / Mobile (= `-min`), and **Typography** holds families and weights.
- Themes: three Lumos themes. Each uses `background-2`/`background-3` for the extra section and card colours:
  - Light: cream / pale leaf / white
  - Dark: forest / forest-light / raspberry
  - Brand: tangerine / sun yellow / peach
- Token changes from the Lumos defaults, to carry into `base.css`:
  - Fonts: Fraunces (headings) and Figtree (body). This adds a `secondary-family`.
  - `--h1-max` 96, `--site-margin-max` 80, `--border-width` 2px.
  - New tokens: `--radius-large` (32/24), `--text-2` at 80% (not 60%, for contrast), plus the brand swatches.
- Build workflow: `lumos-import-figma` skill + figma-console MCP. Map Figma variables to Lumos tokens in `base.css`, then build each section with Lumos components. Screenshot and compare against Figma after each section.

---

## Site map & URLs

**Keep the existing WordPress URLs exactly, with trailing slashes,** to preserve rankings and backlinks. Set `trailingSlash: 'always'` in `astro.config.mjs`.

| Page                         | URL                            | Notes                                                   |
| ---------------------------- | ------------------------------ | ------------------------------------------------------- |
| Home                         | `/`                            |                                                         |
| Products (overview)          | `/products/`                   | Links to the 2 categories                               |
| Fresh Fruit                  | `/products/fresh-fruit/`       | Grouped sections per fruit group (no per-fruit pages)   |
| Frozen Fruit                 | `/products/frozen-fruit/`      | Pack formats                                            |
| Food Safety & Sustainability | `/food-safety-sustainability/` | Certifications, social and environmental responsibility |
| About Us                     | `/about-us/`                   | **New page**                                            |
| Contact                      | `/contact/`                    | B2B enquiry form                                        |

**Redirects (301):** `/gallery/` → `/about-us/` and `/products/dried-fruit/` → `/products/` (dried fruit discontinued). Define them in `astro.config.mjs` `redirects` (the Vercel adapter emits real redirects) and verify with `curl -I` on a preview deploy. There is no Gallery page and no Dried Fruit page. Gallery imagery moves into About Us and Products.

Main nav order: Home, Products (Fresh / Frozen), Food Safety & Sustainability, About Us, Contact.

## Content

- All copy and product data live in **content collections** (`src/content.config.ts`, with data in `src/content/`). Pages render from collections. Don't hardcode copy in components.
- Suggested collections: `productCategories` (fresh, frozen: intro, SEO fields, groups/items, pack formats), `certifications`, and `pages` (page-level copy + SEO fields). Every entry has a Zod schema.
- **Copy is being rewritten for SEO.** Claude drafts new copy from the current content, and **all copy needs client approval.** Mark unapproved copy with `draft: true` or a `// COPY: pending approval` note.
- Fix typos from the old site: "Papaja" → Papaya, "Rasberries" → Raspberries.

### Current product catalogue (source: client's "Product Calendar 2026")

Availability months are converted from the client's weekly chart: a month counts if any of its weeks is shaded. The website groups items into families. The client's sheet only groups stone fruit, citrus and vegetables; the other families are ours.

| Family          | Item                  | Months   |
| --------------- | --------------------- | -------- |
| Citrus          | Lemons                | Feb–Sep  |
| Citrus          | Grapefruit            | Apr–Jun  |
| Citrus          | Clementines           | Apr–Jun  |
| Citrus          | Late mandarins        | Jun–Sep  |
| Citrus          | Navels & late navels  | May–Sep  |
| Citrus          | Valencia types        | Jun–Oct  |
| Citrus          | Kumquats              | May–Aug  |
| Stone fruit     | Apricots              | Nov–Dec  |
| Stone fruit     | Peaches               | Sep–Mar  |
| Stone fruit     | Nectarines            | Sep–Mar  |
| Stone fruit     | Red plums             | Oct–Mar  |
| Stone fruit     | Yellow plums          | Dec–Feb  |
| Stone fruit     | Cherries              | Oct–Nov  |
| Berries         | Strawberries          | Apr–Dec  |
| Berries         | Blueberries           | Jun–Dec  |
| Berries         | Raspberries           | Dec–Apr  |
| Berries         | Blackberries          | Dec–Feb  |
| Exotics         | Golden kiwi           | Feb–May  |
| Exotics         | Figs                  | Mar–May  |
| Exotics         | Lychees               | Nov–Jan  |
| Exotics         | Mangoes               | Nov–Jan  |
| Exotics         | Passion fruit         | Jan–Apr  |
| Exotics         | Baby pines            | All year |
| Exotics         | Bahri dates           | Jan–Mar  |
| Exotics         | Dry dates             | Apr–Aug  |
| Melons & grapes | Watermelon (seedless) | Nov–Apr  |
| Melons & grapes | Cantaloupe            | Dec–Apr  |
| Melons & grapes | Grapes                | Nov–Mar  |
| Vegetables      | Butternuts            | Jan      |
| Vegetables      | Muscat pumpkins       | Feb–Apr  |
| Vegetables      | Crown Prince pumpkins | Feb–Apr  |

No longer listed (removed Oct 2026): oranges as a single line (now navels and Valencia), soft citrus, apples, pears, papaya, avocado, kiwi, kiwi berry, gooseberries, ginger, sweet potato. The fruit panel shows the season only. Varieties, pack formats and growing regions are removed for now.

**Frozen fruit** comes in branded packs (500g Raspberry, 500g Blueberry, 500g Mixed Berry, 750g Strawberry) and 12kg bulk boxes.

**Dried fruit is discontinued.** Don't mention it anywhere on the new site.

### Food safety & sustainability facts (don't overstate them)

- All produce comes from **GlobalG.A.P.**-certified growers who comply with MRL regulations.
- _Selected_ growers hold Tesco Nurture, M&S Field to Fork, BRC and HACCP accreditations.
- _Most_ growers hold SIZA or SEDEX accreditation and comply with national ethical trading standards.
- The grower base takes part in carbon footprint, water stewardship and biodiversity programmes.
- Affiliations shown on the current site: APAC and FPEF logos. Confirm current memberships with the client before displaying them.

Keep the qualifiers ("selected", "most"). Never claim certifications the client hasn't confirmed.

---

## SEO requirements

**Target markets:** Middle East, Asia (China, Southeast Asia), and EU & UK importers.
**Keyword themes:** South African fruit exporter; fresh / frozen fruit supplier; citrus / stone fruit / berry / avocado exporter from South Africa; GlobalG.A.P. certified; plus sourcing and import intent ("import South African citrus", "wholesale frozen berries supplier").

Every page must have:

- A unique `<title>` (≤ 60 chars) and meta description (≤ 155 chars) from content, set through Lumos `BaseHead`
- A canonical URL (absolute, with trailing slash, `https://torofruit.com/...`)
- Open Graph and Twitter tags with a 1200×630 OG image
- Exactly one `<h1>` and a logical heading hierarchy
- Descriptive `alt` text on every meaningful image (empty `alt=""` for decorative ones)

Site-wide:

- `@astrojs/sitemap` and `public/robots.txt` pointing to `/sitemap-index.xml`
- JSON-LD: `Organization` (logo, contact email, `areaServed`), `WebSite`, and `BreadcrumbList` on nested pages. On product pages, use `ItemList` / `Product` without prices.
- `lang="en"` and site metadata in `src/consts.ts` (`SITE_URL = https://torofruit.com`)
- Internal linking between categories, food safety and contact. Every product page ends with an enquiry CTA.
- Performance budget: Lighthouse ≥ 95 for Performance, SEO, Accessibility and Best Practices on mobile. LCP < 2.5s, CLS < 0.1. Ship no client JS unless a component needs it. Preload the hero image and self-host fonts.
- Preview deploys must be `noindex` (check `VERCEL_ENV !== 'production'`).

## Contact form (`/contact/`)

- **B2B only.** The client works with companies, not private individuals. The page says so, and the company field is required.
- Fields:
  - First name*, surname*, company name*
  - Region* (select): Middle East, Asia, European Union, United Kingdom
  - Products of interest* (multi-select, at least 1). Options are grouped by family: the 31 fresh items plus the frozen berries.
  - Work email*
  - Message (optional)
- **Pre-fill:** fruit pages link to `/contact/?product=<slug>` (e.g. `?product=oranges`), and that product is pre-selected. Validate slugs against the products collection and ignore unknown ones.
- Design: see the Contact board on the design canvas. The multi-select is a chip field with a grouped, searchable checkbox panel. With JS off it falls back to a fieldset of Lumos `Choice` checkboxes.
- Build it with Lumos Form, Fieldset, Input, Select, Choice and Textarea components. Region uses a native `Select`. Do client-side validation with native constraints and repeat it server-side.
- Post to `src/pages/api/contact.ts` with `export const prerender = false` (serverless on Vercel). The rest of the site stays static.
- Send through Resend to `CONTACT_TO_EMAIL` (info@torofruit.com), with `reply-to` set to the submitter. The sending domain (torofruit.com) must be verified in Resend with DNS records.
- Spam protection: a honeypot field plus a minimum time-to-submit check. Add Cloudflare Turnstile if spam gets through.
- Handle success and error states accessibly (`aria-live`). The form must work without JS (POST, then redirect to `/contact/?sent=1`).

## Analytics & consent

- GA4 and Microsoft Clarity load **only after consent**. The banner covers POPIA, GDPR and UK GDPR because of EU/UK traffic.
- Build a lightweight, self-built consent banner with Lumos components: Accept / Reject / Manage, stored in `localStorage`, with a "Cookie settings" link in the footer to reopen it.
- Use **Google Consent Mode v2**: set defaults to `denied` before the gtag loads, and update on accept. For Clarity, call `window.clarity('consent')` after acceptance, or inject the Clarity script only after acceptance.
- Add a Privacy Policy page (`/privacy-policy/`) linked from the footer and banner. Copy is TBD and needs client approval.
- No analytics in dev or preview environments.

## Environment variables

Set these in Vercel and in `.env` locally. Never commit `.env`.

```
RESEND_API_KEY=
CONTACT_TO_EMAIL=info@torofruit.com
CONTACT_FROM_EMAIL=website@torofruit.com
PUBLIC_GA4_ID=
PUBLIC_CLARITY_ID=
```

## Conventions

- TypeScript strict mode. Props are typed with `interface Props`.
- Components use PascalCase `.astro` files. Content files use kebab-case.
- Keep client JS minimal. Use Astro islands and scripts only for interactive components (nav toggle, consent banner, slider).
- Run `npm run build` and `npm run format` before committing. The build must pass with zero content-schema errors.
- Commit messages are short and imperative. Never commit secrets.

## Launch checklist

- [ ] All kept URLs return 200, `/gallery/` returns 301 → `/about-us/`, and `/products/dried-fruit/` returns 301 → `/products/`
- [ ] Sitemap submitted in Google Search Console; old WordPress sitemap URLs don't 404 in a way that matters
- [ ] Resend domain verified, and a test enquiry received at info@torofruit.com
- [ ] Consent banner blocks GA4 and Clarity until accepted
- [ ] Lighthouse mobile ≥ 95 on every page
- [ ] Client has approved all copy and certifications
- [ ] torofruit.com DNS pointed to Vercel, HTTPS confirmed, `www` → apex redirect

## Open items

- Figma file link
- Final approved copy (Claude drafts it, client approves)
- Confirmation of current certifications and affiliations (APAC, FPEF, and so on)
- Logo and brand assets in SVG, plus a high-res photography library from the client
- Company details for About Us and the footer: address, phone, registration details

---

## Build status (Astro)

All pages are built: Home, Products, Fresh Fruit, Frozen Fruit, Food Safety & Sustainability, About Us, Contact, Privacy Policy (placeholder, noindex) and 404.

- **Components:** project components live in `src/components/content/` (building blocks) and `src/components/section/` (whole sections). Pages compose them; copy lives in pages and collections.
- **Collections:** `products` (`src/content/products.json`) and `frozen` (`frozen.json`) carry an `order` field and are sorted with `byOrder`. `story` (`src/content/story/*.md`) drives the About Us story and only renders when `draft: false`.
- **Contact:** `/contact/?product=<id>` pre-selects a product. `POST /api/contact/` validates, then sends through Resend. No-JS posts redirect to `/contact/#sent`. Without `RESEND_API_KEY` it returns 503.
- **Token audit:** `npm run audit` fails on hard-coded colours, px lengths, literal fonts or undefined `var()` tokens. Run it before committing.
- **Env:** see `.env.example`. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` in Vercel.

### Still to do / unconfirmed

- Products overview and Frozen pages were composed without Figma designs.
- Unconfirmed with the client: the four target markets, the third affiliation logo, About Us story, privacy policy copy.
- Cookie consent banner + GA4/Clarity, and a real 1200×630 OG image (`public/og-image.jpg` is still the Lumos default).
- Image licensing: Wikimedia (CC BY-SA / GFDL) cut-outs and the recoloured yellow plum need attribution or replacement before launch. The Crown Prince pumpkin photo is a stand-in.
- Figma: mobile (375) frames, and the Home / Fresh Fruit / Contact pages still show the old product list.
