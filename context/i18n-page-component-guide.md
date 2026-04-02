# Building Pages & Components with i18n

> How to add new pages and components to lw.works while keeping the multilingual setup correct. Assumes familiarity with the SEO strategy in `multilingual-seo-nextjs.md` and the site structure in `lw-works-seitenstruktur-report.md`.

---

## Architecture Overview

The site uses **next-intl** with Next.js App Router. There are two translation systems working side by side:

| System | Used for | Where it lives |
|---|---|---|
| **next-intl messages** (`messages/de.json`, `messages/en.json`) | UI strings — navigation labels, button text, form labels, blog index title | `messages/` at project root |
| **Content modules** (`src/content/pages/`) | Page-specific content — metadata, hero copy, section copy, structured data | `src/content/pages/[page]/de.ts` and `en.ts` |

**Why two systems?** UI strings are short, reused across pages, and shared by components. Page content is long-form, unique per page, and often includes metadata for SEO. Keeping them separate avoids bloating the message bundles and keeps page content co-located with its type definitions.

---

## Adding a New Page

### 1. Define the content type

Add a type to `src/content/types.ts`:

```ts
export type AutomationContent = {
  metadata: PageMetadata
  hero: {
    title: string
    description: string
  }
  // ... page-specific sections
}
```

### 2. Create content files

```
src/content/pages/automation/
├── de.ts
├── en.ts
└── index.ts
```

**`de.ts`** — German content, written for SEO (not translated from English):

```ts
import type {AutomationContent} from '@/content/types'

const content: AutomationContent = {
  metadata: {
    title: 'KI-Automatisierung für Unternehmen',
    description: 'Wir automatisieren Ihre internen Prozesse mit KI und n8n.',
  },
  hero: {
    title: '...',
    description: '...',
  },
}

export default content
```

**`en.ts`** — English content, written independently (not a literal translation):

```ts
import type {AutomationContent} from '@/content/types'

const content: AutomationContent = {
  metadata: {
    title: 'AI Automation for Businesses',
    description: 'We automate your internal processes with AI and n8n.',
  },
  hero: {
    title: '...',
    description: '...',
  },
}

export default content
```

**`index.ts`** — Loader:

```ts
import type {Locale} from '@/i18n/routing'
import type {AutomationContent} from '@/content/types'

const loaders: Record<Locale, () => Promise<AutomationContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default),
}

export const getAutomationContent = (locale: Locale) => loaders[locale]()
```

### 3. Add the route to i18n routing (if the slug differs between languages)

In `src/i18n/routing.ts`, add the pathname mapping inside `defineRouting`:

```ts
pathnames: {
  // ... existing
  '/automatisierung': {
    de: '/automatisierung',
    en: '/automation',
  },
},
```

If the slug is the same in both languages (like `/blog`), a simple string suffices:

```ts
'/kontakt': '/kontakt', // same slug — but only if intentional
```

### 4. Create the page file

The filesystem route always uses the **German slug** (since `de` is the default locale). next-intl's middleware rewrites English URLs to the correct filesystem path.

```
src/app/[locale]/automatisierung/page.tsx
```

```tsx
import {HeroSection} from '@/components/sections/hero'
import {getAutomationContent} from '@/content/pages/automation'
import {hasLocale} from 'next-intl'
import {setRequestLocale} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing, baseUrl} from '@/i18n/routing'
import type {Locale} from '@/i18n/routing'
import type {Metadata} from 'next'

export async function generateMetadata({params}: PageProps<'/[locale]/automatisierung'>): Promise<Metadata> {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const content = await getAutomationContent(locale as Locale)

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: locale === 'de' ? `${baseUrl}/de/automatisierung` : `${baseUrl}/en/automation`,
      languages: {
        de: `${baseUrl}/de/automatisierung`,
        en: `${baseUrl}/en/automation`,
        'x-default': `${baseUrl}/de/automatisierung`,
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: locale === 'de' ? `${baseUrl}/de/automatisierung` : `${baseUrl}/en/automation`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
  }
}

export default async function AutomationPage({params}: PageProps<'/[locale]/automatisierung'>) {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const content = await getAutomationContent(locale as Locale)

  return (
    <main>
      <HeroSection withNav title={content.hero.title} description={content.hero.description} />
    </main>
  )
}
```

### 5. Update the sitemap

In `src/app/sitemap.ts`, add the new pathname mapping to the local `pathnames` object:

```ts
const pathnames = {
  // ... existing
  '/automatisierung': {de: '/automatisierung', en: '/automation'},
}
```

### 6. Update navigation (if the page should appear in the nav)

In `messages/de.json` and `messages/en.json`, add the label. Then in `src/components/atoms/navigation.tsx`, add the nav item using the **routing key** (not the localized slug):

```ts
{label: t('automation'), href: '/automatisierung' as const},
```

next-intl's `<Link>` component resolves the correct localized URL automatically.

---

## Adding a New Landing Page (dynamic slug)

Landing pages use a catch-all `[landingSlug]` segment with slugs that differ per locale (e.g. `autohaus-websites` / `car-dealership-websites`). These are managed separately from next-intl's pathname system.

### 1. Add the slug mapping in `src/i18n/routing.ts`:

```ts
export const landingPages = {
  // ... existing
  'digital-dealer': {
    de: 'digital-dealer',
    en: 'digital-dealer',
  },
}
```

### 2. Create content files following the same pattern as above

### 3. Register the loader in `src/content/pages/landing-pages.ts`

### 4. No route file changes needed — `src/app/[locale]/[landingSlug]/page.tsx` handles all landing pages via `generateStaticParams`

---

## Building Components

### Server Components (default)

Server components that need translations should use `getTranslations` from `next-intl/server`:

```tsx
import {getTranslations} from 'next-intl/server'

export async function Footer() {
  const t = await getTranslations('footer')
  return <footer>{t('copyright')}</footer>
}
```

### Client Components

Client components use the `useTranslations` hook. The `NextIntlClientProvider` in the layout makes messages available automatically:

```tsx
'use client'

import {useTranslations, useLocale} from 'next-intl'
import {Link} from '@/i18n/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const otherLocale = locale === 'de' ? 'en' : 'de'

  return (
    <Link href="/" locale={otherLocale}>
      {otherLocale.toUpperCase()}
    </Link>
  )
}
```

### Links between pages

Always use `Link` from `@/i18n/navigation`, never from `next/link`. Use the **routing key** as the href — the localized URL is resolved automatically:

```tsx
import {Link} from '@/i18n/navigation'

// This renders as /de/leistungen or /en/services depending on locale
<Link href="/leistungen">Services</Link>
```

### Getting the current locale

- In client components: `useLocale()` from `next-intl`
- In server components/pages: extract from `params` (already available as `locale`)
- The type is `Locale` from `@/i18n/routing`

### Content-driven components vs. translation-driven components

- **Content-driven**: Receives already-localized strings as props (e.g. `HeroSection` gets `title` and `description` from the page's content module). No i18n imports needed in the component itself.
- **Translation-driven**: Reads its own translations via `useTranslations` or `getTranslations` (e.g. `Navigation` reads nav labels from messages). Used for UI chrome that appears across many pages.

Prefer content-driven for page-specific sections, translation-driven for shared UI.

---

## SEO Checklist for Every New Page

Every page must include:

- [ ] `generateMetadata` with locale-specific `title` and `description` (not auto-translated)
- [ ] `alternates.canonical` pointing to itself (localized URL)
- [ ] `alternates.languages` with `de`, `en`, and `x-default` (pointing to `/de/...`)
- [ ] `openGraph.locale` set to `de_DE` or `en_US`
- [ ] `openGraph.url` matching the canonical
- [ ] `setRequestLocale(locale)` at the top of the page component (required for static rendering)
- [ ] `hasLocale(routing.locales, locale)` validation with `notFound()` fallback
- [ ] Entry in `src/app/sitemap.ts` with alternates
- [ ] Pathname mapping in `src/i18n/routing.ts` (if the slug differs between languages)

---

## File Reference

| File | Purpose |
|---|---|
| `src/i18n/routing.ts` | Locale list, default locale, pathname mappings, `baseUrl`, landing page slugs |
| `src/i18n/navigation.ts` | Locale-aware `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname` |
| `src/i18n/request.ts` | Server-side config — loads messages for the current locale |
| `src/proxy.ts` | Middleware — locale detection, redirect from `/` to `/de/`, URL rewriting for localized pathnames |
| `messages/de.json` | German UI strings (navigation, buttons, labels) |
| `messages/en.json` | English UI strings |
| `src/content/pages/` | Page-specific content per locale (metadata, copy, structured data) |
| `src/content/types.ts` | TypeScript types for page content |
| `src/app/sitemap.ts` | Sitemap with hreflang alternates |

---

*Last updated: March 2026 — Next.js 16 / App Router / next-intl v4*
