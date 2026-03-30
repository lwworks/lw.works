# Multilingual SEO in Next.js — German & English Implementation Guide

> A practical reference for setting up a bilingual Next.js site that ranks well in both languages. Written for the App Router (Next.js 13+). Adapt accordingly if you're still on Pages Router.

---

## Table of Contents

1. [URL Structure — The First Decision](#1-url-structure--the-first-decision)
2. [Next.js i18n Setup](#2-nextjs-i18n-setup)
3. [hreflang — The Most Critical Tag](#3-hreflang--the-most-critical-tag)
4. [Metadata & Title Tags per Locale](#4-metadata--title-tags-per-locale)
5. [XML Sitemap with Language Alternates](#5-xml-sitemap-with-language-alternates)
6. [Content Strategy for Two Languages](#6-content-strategy-for-two-languages)
7. [Canonical Tags](#7-canonical-tags)
8. [robots.txt](#8-robotstxt)
9. [Structured Data (JSON-LD)](#9-structured-data-json-ld)
10. [Language Detection & Redirects](#10-language-detection--redirects)
11. [Common Mistakes to Avoid](#11-common-mistakes-to-avoid)
12. [Testing & Validation Checklist](#12-testing--validation-checklist)
13. [Tooling Recommendations](#13-tooling-recommendations)

---

## 1. URL Structure — The First Decision

This is the most impactful architectural choice. Pick one approach and stick to it — changing later is a painful migration.

### Option A: Subdirectory (Recommended)

```
https://example.com/de/produkte
https://example.com/en/products
```

**Pros:**
- Single domain, all authority is pooled
- Easiest to set up in Next.js App Router
- Google treats subdirectories as part of the root domain

**Cons:**
- Slightly less "local" signal than a ccTLD

### Option B: Subdomain

```
https://de.example.com/produkte
https://en.example.com/products
```

**Pros:**
- Clean separation; easier for very large sites
- Some teams prefer the operational independence

**Cons:**
- Google treats subdomains as separate sites — backlinks don't pool as well
- More infrastructure overhead

### Option C: ccTLD (Strongest Local Signal, Most Overhead)

```
https://example.de/produkte
https://example.com/products
```

**Pros:**
- Strongest geo-targeting signal for German market (`.de`)
- Best for dedicated German market presence

**Cons:**
- You own and maintain two separate domains
- Backlink authority is completely separate
- Much more DevOps overhead

### Recommendation

For a single-team agency product targeting both DE and EN markets: **go with subdirectories (`/de/` and `/en/`)**. It's the best balance of SEO authority consolidation and implementation simplicity in Next.js.

---

## 2. Next.js i18n Setup

### App Router Approach (Next.js 13+)

The App Router doesn't have built-in i18n routing like the Pages Router did. The standard pattern is to use a `[locale]` dynamic segment at the root of your `app/` directory.

**Recommended library: `next-intl`** — best-in-class for App Router, well-maintained, SSR-compatible.

```
app/
  [locale]/
    layout.tsx        ← sets lang attribute on <html>
    page.tsx          ← homepage
    about/
      page.tsx
    blog/
      [slug]/
        page.tsx
  middleware.ts       ← handles locale detection & redirect
```

### Middleware for locale routing

```ts
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['de', 'en'],
  defaultLocale: 'de',         // or 'en' — your primary market
  localePrefix: 'always',      // always show /de/ or /en/ in URL
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### Root layout — always set the `lang` attribute

```tsx
// app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>  {/* ← Critical for SEO */}
      <body>{children}</body>
    </html>
  );
}
```

The `lang` attribute on `<html>` is how browsers, screen readers, and Google understand which language the page is in. Never skip it.

### Translation file structure

```
messages/
  de.json
  en.json
```

Keep keys language-agnostic:

```json
// de.json
{
  "nav": {
    "home": "Startseite",
    "about": "Über uns",
    "services": "Leistungen"
  },
  "hero": {
    "headline": "Ihre Autowerkstatt in München",
    "cta": "Termin buchen"
  }
}
```

```json
// en.json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "services": "Services"
  },
  "hero": {
    "headline": "Your car dealership in Munich",
    "cta": "Book appointment"
  }
}
```

---

## 3. hreflang — The Most Critical Tag

hreflang tells Google which version of a page is intended for which language/region. **Missing or incorrect hreflang is the #1 multilingual SEO mistake.**

### The Rules

1. Every page must declare hreflang for **all** its language versions — including itself
2. The relationship must be **bidirectional** — if DE points to EN, EN must point back to DE
3. Use `x-default` to define the fallback (usually shown to users whose language isn't covered)
4. Use BCP 47 language codes: `de`, `en`, `de-DE`, `en-US`, etc.

### Implementation in Next.js (App Router)

Use the `alternates` key in the `generateMetadata` function:

```tsx
// app/[locale]/about/page.tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'About' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `https://example.com/${locale}/about`,
      languages: {
        'de': 'https://example.com/de/ueber-uns',
        'en': 'https://example.com/en/about',
        'x-default': 'https://example.com/de/ueber-uns',  // primary market
      },
    },
  };
}
```

Next.js will render these as `<link rel="alternate" hreflang="...">` tags in `<head>` automatically.

### Alternatively: HTTP Headers (for non-HTML assets)

For PDFs or other files, hreflang can be set via HTTP headers instead of `<head>` tags.

### x-default strategy

`x-default` should point to your **primary market page** or a language selection/detection page. If German is your core market, point `x-default` to `/de/`.

---

## 4. Metadata & Title Tags per Locale

Every page must have unique, language-appropriate meta titles and descriptions. Do not auto-translate them — write them specifically for each market.

### Title Tag Best Practices

- **German**: 50–60 characters, keyword at the front, German search intent matters
- **English**: Same length rules, but English users expect different phrasing

```tsx
// Pattern for generating locale-specific titles
export async function generateMetadata({ params: { locale, slug } }: Props) {
  const t = await getTranslations({ locale, namespace: 'BlogPost' });

  return {
    title: `${t('postTitle')} | ${t('siteName')}`,
    description: t('postDescription'),
    openGraph: {
      title: t('postTitle'),
      description: t('postDescription'),
      locale: locale === 'de' ? 'de_DE' : 'en_US',  // OG uses underscore format
      alternateLocale: locale === 'de' ? 'en_US' : 'de_DE',
    },
  };
}
```

### German-Specific SEO Considerations

- German keywords are often compound words (e.g. "Gebrauchtwagenhändler" not "gebrauchte Wagen Händler")
- Search volume in German is generally lower than English — long-tail is very important
- German users search with high specificity — match their intent precisely
- The `.de` domain extension builds trust even if you're on a `.com` with `/de/` subdirectory

---

## 5. XML Sitemap with Language Alternates

Your sitemap must include hreflang annotations. A standard sitemap without language alternates is insufficient for multilingual sites.

### Generate in Next.js via `app/sitemap.ts`

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next';

const baseUrl = 'https://example.com';
const locales = ['de', 'en'];

// All your routes (without locale prefix)
const routes = [
  '',             // homepage
  '/about',       // /de/ueber-uns and /en/about
  '/services',
  '/contact',
  // ... add blog slugs dynamically
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // Add one entry per locale, each with alternates for all locales
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        // Note: Next.js doesn't natively support alternates in sitemap yet
        // Use a custom XML sitemap for full control (see below)
      });
    }
  }

  return entries;
}
```

### Custom XML Sitemap (Full Control — Recommended)

Next.js's built-in sitemap doesn't fully support the `<xhtml:link>` alternates format that Google requires. Use a custom route instead:

```ts
// app/sitemap.xml/route.ts
export async function GET() {
  const baseUrl = 'https://example.com';
  const locales = ['de', 'en'];

  const pages = [
    { de: '/de', en: '/en' },
    { de: '/de/ueber-uns', en: '/en/about' },
    { de: '/de/leistungen', en: '/en/services' },
    // Add dynamically fetched blog posts here
  ];

  const urlSet = pages.map(page => `
    <url>
      <loc>${baseUrl}${page.de}</loc>
      <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}${page.de}"/>
      <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.en}"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.de}"/>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}${page.en}</loc>
      <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}${page.de}"/>
      <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.en}"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.de}"/>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${urlSet}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

Submit both the DE and EN sections of your sitemap to Google Search Console — ideally create two separate GSC properties, one per language/region.

---

## 6. Content Strategy for Two Languages

### Translated vs. Localized

There's a critical difference:

| Translated | Localized |
|---|---|
| Same content, different language | Content adapted for the market |
| "Über uns" is literally "About us" | Examples, pricing, and references are German |
| Good enough for UI strings | Required for blog posts, landing pages |

**For pages that drive SEO, always localize — don't just translate.**

### URL Slugs: Translated or English?

Translate your slugs. This is often overlooked:

```
❌ https://example.com/de/about     ← German page with English URL
✅ https://example.com/de/ueber-uns ← Properly localized
```

German slugs rank better for German queries. Map translated slugs in your routing config:

```ts
// i18n/pathnames.ts (next-intl pattern)
export const pathnames = {
  '/': '/',
  '/about': {
    de: '/ueber-uns',
    en: '/about',
  },
  '/services': {
    de: '/leistungen',
    en: '/services',
  },
  '/blog/[slug]': {
    de: '/blog/[slug]',
    en: '/blog/[slug]',
  },
} satisfies Pathnames<typeof locales>;
```

### Keyword Research per Language

Don't assume English keywords translate 1:1 to German search volume:

- Do separate keyword research for each language using Ahrefs, Semrush, or Google Keyword Planner
- German compound words change everything (e.g. "Webentwicklung" vs. "web development")
- Check Google's German search results for your target terms — competitors and intent may differ

### Content Volume

- Aim to launch with at least **parity** between languages — don't publish 20 DE pages and 3 EN pages
- Google may treat the underdeveloped language as lower quality
- It's acceptable to phase content, but have a roadmap and keep parity close

---

## 7. Canonical Tags

### Self-Referencing Canonicals

Every page should have a canonical pointing to itself:

```html
<!-- German page -->
<link rel="canonical" href="https://example.com/de/ueber-uns" />

<!-- English page -->
<link rel="canonical" href="https://example.com/en/about" />
```

In Next.js `generateMetadata`:

```ts
alternates: {
  canonical: `https://example.com/${locale}/${localizedSlug}`,
}
```

### What Not to Do

- **Don't** set both language versions to the same canonical URL — this tells Google one is duplicate
- **Don't** cross-canonicalize (DE page canonical pointing to EN page) unless you explicitly want to consolidate

### Canonical + hreflang Interaction

These two tags work together:
- `canonical` tells Google: "this is the preferred URL for this page"
- `hreflang` tells Google: "this is the version for this language/region audience"

Both must be consistent. If your DE page's canonical is `/de/ueber-uns`, the hreflang for `de` must also reference `/de/ueber-uns`.

---

## 8. robots.txt

Make sure you don't accidentally block either locale:

```
# robots.txt
User-agent: *
Allow: /de/
Allow: /en/
Disallow: /api/
Disallow: /_next/

Sitemap: https://example.com/sitemap.xml
```

If you use locale detection redirect pages (e.g. a splash page at `/`), make sure those aren't blocked either.

---

## 9. Structured Data (JSON-LD)

Structured data should be in the page's language. Don't use English JSON-LD on your German pages.

### Organization Schema (in layout, locale-aware)

```tsx
// app/[locale]/layout.tsx
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mein Unternehmen',
  url: `https://example.com/${locale}`,
  description: locale === 'de'
    ? 'Webentwicklung für mittelständische Unternehmen'
    : 'Web development for mid-sized companies',
  address: {
    '@type': 'PostalAddress',
    addressCountry: locale === 'de' ? 'DE' : 'US',
  },
};
```

### BreadcrumbList — use localized labels

```tsx
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: locale === 'de' ? 'Startseite' : 'Home',
      item: `https://example.com/${locale}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: pageTitle,
      item: currentUrl,
    },
  ],
};
```

---

## 10. Language Detection & Redirects

### Strategy

When a user hits the bare domain (`https://example.com/`), you need to decide where to send them:

**Option A — Redirect based on `Accept-Language` header** (Recommended)
```ts
// middleware.ts — next-intl handles this automatically
// It reads the Accept-Language header and redirects to /de or /en
```

**Option B — Redirect based on geo-IP**
More complex, requires a geo-IP service or Vercel's Edge middleware geo data:
```ts
import { geolocation } from '@vercel/edge';

export function middleware(request: NextRequest) {
  const { country } = geolocation(request);
  const locale = country === 'DE' || country === 'AT' || country === 'CH'
    ? 'de'
    : 'en';
  // redirect accordingly
}
```

**Option C — Manual language selector only**
Let users pick. No automatic redirect. Safest for UX, weakest for SEO.

### Don't Cloak

Google's bot doesn't send an `Accept-Language` header. If your server returns different content to Googlebot vs. users based on language detection, that's cloaking and a penalty risk. Always ensure:

- The URL itself determines the content (which subdirectory routing gives you)
- Redirects are transparent (301/302 based on user preference, but the destination URL is real)

### Remember the Language Switcher

Every page must have a language switcher that:
- Links to the **equivalent page** in the other language, not just the homepage
- Is visible (crawlable by Google — it helps confirm hreflang relationships)
- Preserves the current path: `/de/blog/mein-artikel` ↔ `/en/blog/my-article`

---

## 11. Common Mistakes to Avoid

### ❌ Auto-translating content at scale with no human review

Google can detect machine-translated content. It often reads unnaturally and gets poor engagement signals. At minimum, have a native speaker review and edit.

### ❌ Using the same meta title/description in both languages

Each language version must have **unique** meta tags written for that language's search users.

### ❌ Only translating the homepage

All pages that exist in one language should ideally exist in the other. A German user who lands on an English-only product page will bounce. This also dilutes your hreflang signals.

### ❌ Forgetting Open Graph locale tags

Social media previews use OG tags. Make sure `og:locale` is set per page:
```html
<meta property="og:locale" content="de_DE" />
<meta property="og:locale:alternate" content="en_US" />
```

### ❌ Incorrect or missing bidirectional hreflang

If your DE page links to the EN version but the EN page doesn't link back to the DE version, Google ignores both. Always bidirectional.

### ❌ Mixing locale signals

```
❌ /de/ page with lang="en" in the HTML
❌ /en/ page with German content
❌ hreflang pointing to a URL that returns a redirect
```

hreflang URLs must be the **final destination** — no redirects in the chain.

### ❌ Parameterized locale switching (`?lang=de`)

Query parameters are much weaker than path segments for SEO. Always use path-based routing.

### ❌ Forgetting Search Console geo-targeting

If you use subdirectories (not ccTLDs), you can set geographic target in Google Search Console:
- Go to: Search Console → Settings → International targeting
- Set `/de/` to target Germany

---

## 12. Testing & Validation Checklist

### Before Launch

- [ ] Every page has a `<html lang="de">` or `<html lang="en">` attribute set
- [ ] Every page has a self-referencing canonical
- [ ] Every page has hreflang for all language variants including `x-default`
- [ ] hreflang relationships are bidirectional (verify manually on a few pages)
- [ ] URL slugs are translated (not English slugs on German pages)
- [ ] Sitemap includes `<xhtml:link>` alternate entries for all pages
- [ ] Sitemap submitted to Google Search Console
- [ ] robots.txt allows both `/de/` and `/en/` paths
- [ ] Language switcher links to correct equivalent page in other language
- [ ] JSON-LD structured data uses the correct language
- [ ] `og:locale` is set correctly per page
- [ ] No auto-redirect based on language that could appear as cloaking to Googlebot

### Tools for Validation

| Tool | What to Check |
|---|---|
| Google Rich Results Test | Structured data rendering |
| hreflang Tags Testing Tool (Merkle) | hreflang correctness |
| Screaming Frog | Crawl all hreflang values, check for orphans |
| Google Search Console | Coverage, international targeting |
| browser DevTools → Network | Verify redirects are correct HTTP status |
| `curl -H "Accept-Language: de" https://example.com/` | Test language detection server-side |

---

## 13. Tooling Recommendations

### i18n Library

**`next-intl`** — the best choice for App Router. Handles routing, translation loading, middleware, and has excellent TypeScript support.

```bash
npm install next-intl
```

### Translation Management (for teams)

| Tool | Best For |
|---|---|
| **Tolgee** | Self-hostable, good developer DX |
| **Localazy** | Small teams, fair pricing |
| **Phrase** | Agency/client workflows |
| **Simple JSON files in git** | Solo dev / small sites — totally fine |

For your agency projects, JSON files in git with a clear key structure is often the most pragmatic choice unless clients need to edit translations themselves.

### Slug / URL Mapping

Use `next-intl`'s `pathnames` configuration for translated slugs. Keep a central mapping file — it becomes the single source of truth for hreflang generation too.

### Dynamic Routes (Blog, Products, etc.)

For dynamic routes, fetch slugs per locale and generate all variants in `generateStaticParams`:

```ts
export async function generateStaticParams() {
  const deSlugs = await getBlogSlugs('de');
  const enSlugs = await getBlogSlugs('en');

  return [
    ...deSlugs.map(slug => ({ locale: 'de', slug })),
    ...enSlugs.map(slug => ({ locale: 'en', slug })),
  ];
}
```

This ensures all language variants are statically generated and indexable.

---

## Summary: Priority Order for Implementation

1. **Set up subdirectory routing** (`/de/`, `/en/`) with `next-intl` and middleware
2. **Set `lang` attribute** on `<html>` via root layout
3. **Implement hreflang** via `generateMetadata` alternates on every page
4. **Write locale-specific metadata** (title, description) per page — not auto-translated
5. **Translate URL slugs** for all pages
6. **Generate a custom XML sitemap** with `<xhtml:link>` alternates
7. **Set up Google Search Console** with two property views and geo-targeting for `/de/`
8. **Implement structured data** with locale-aware content
9. **Build the language switcher** with correct page-level cross-linking
10. **Do keyword research separately** for each language before writing content

---

*Last updated: March 2026 — Next.js 15 / App Router / next-intl v3*
