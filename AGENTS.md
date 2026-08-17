<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI Components

Always prefer shadcn/ui components over building custom ones. Before creating a new component, check if shadcn offers one that fits the need. Install missing shadcn components via `npx shadcn@latest add <component>`. Only build a custom component when shadcn does not provide a suitable option.

# Icons

Always use `@mynaui/icons-react` for icons. Never use `lucide-react` — it is not installed. When installing new shadcn/ui components, check the added files for `lucide-react` imports and replace them with the equivalent `@mynaui/icons-react` icons (e.g. `CheckIcon` → `Check`, `ChevronDownIcon` → `ChevronDown`).

# Class Names

Always use `cn()` from `@/lib/utils` to compose class names. Never use template literals for className strings.

# Page & Section Architecture

Pages are built by composing section components that receive typed content objects. Content is separated from components and supports i18n.

## Directory Layout

```
src/
├── components/
│   ├── sections/           # Section components (shared + page-specific)
│   │   ├── index.tsx        # Base Section wrapper (layout, gradients, borders)
│   │   ├── testimonial.tsx  # Shared section (used across pages)
│   │   ├── callout.tsx      # Shared section
│   │   └── digital-dealer/  # Page-specific sections
│   │       ├── hero.tsx
│   │       ├── pricing.tsx
│   │       └── contact.tsx
│   ├── pages/              # Page components that compose sections
│   │   └── digital-dealer.tsx
│   └── atoms/              # Small reusable elements (Brow, Heading, CTA, etc.)
├── content/
│   ├── pages/
│   │   ├── slugs.ts         # Page slug definitions (single source of truth)
│   │   ├── index.ts         # Page registry (slugs + components + loaders)
│   │   └── digital-dealer/
│   │       ├── index.ts     # Content loader (async, per-locale)
│   │       ├── en.tsx       # English content
│   │       └── de.tsx       # German content
└── app/[locale]/           # Route handlers
```

## Content Types

Each section component **exports its own content type** alongside the component:

```tsx
// src/components/sections/callout.tsx
export type CalloutSectionContent = {
  title: string
  paragraphs: string[]
  cta?: { ... }
}

export const CalloutSection = ({ content }: { content: CalloutSectionContent }) => { ... }
```

The **page component** imports these types and composes them into a page-level content type:

```tsx
// src/components/pages/digital-dealer.tsx
export type DigitalDealerPageContent = {
  metadata: Metadata
  hero: DigitalDealerHeroSectionContent
  testimonial: TestimonialSectionContent
  callout: CalloutSectionContent
  // Simple sections can define their shape inline:
  problem: { brow: string; title: string; paragraphs: string[] }
}
```

## Content Files

Content lives in `src/content/pages/<page>/` with one file per locale. The `index.ts` exports an async loader:

```tsx
// src/content/pages/digital-dealer/index.ts
const loaders: Record<Locale, () => Promise<DigitalDealerPageContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default)
}
export const getDigitalDealerPageContent = (locale: Locale) => loaders[locale]()
```

Locale files (e.g. `en.tsx`) export a default object matching the page content type. Use `.tsx` extension when content includes JSX (e.g. inline links).

## Section Components

Every section component:
1. Exports a content type (e.g. `FooSectionContent`) and the component itself.
2. Accepts a `content` prop typed with that content type.
3. Wraps its content in the base `Section` component from `@/components/sections` for consistent layout (padding, gradients, bottom border).
4. Composes atoms (`Brow`, `Heading`, `CTA`) and shadcn/ui components.

For simple/one-off sections that don't need their own file, render them inline in the page component using the base `Section` wrapper directly.

## Page Components

Page components live in `src/components/pages/`. They:
1. Export a page content type composing all section content types.
2. Accept a single `{ content }` prop.
3. Render `<main className="pt-16">` with sections in order.
4. Pass `content.<section>` to each section component.

# i18n Setup

Uses **next-intl** with the `[locale]` App Router pattern. Supported locales: `de` (default), `en`. Locale prefix is `always` (URLs always start with `/de` or `/en`).

## Routing & Slugs

Slugs are defined in each content type's own folder — **not** in `routing.ts`:

- **Pages:** `src/content/pages/slugs.ts` defines `pageSlugs` (locale-aware slug map per page key)

`src/i18n/routing.ts` imports these to build the next-intl pathname config automatically. The `Locale` type lives in `src/i18n/locale.ts` to avoid circular imports (content folders import from `locale.ts`, not `routing.ts`).

Helpers: `getPageKeyBySlug(slug, locale)` and `getPageSlug(key, locale)` (exported from `src/content/pages/slugs.ts` and re-exported from `src/content/pages/index.ts`).

## Navigation (`src/i18n/navigation.ts`, `src/i18n/link.tsx`)

- `createNavigation(routing)` provides locale-aware `Link`, `useRouter`, `usePathname`.
- `src/i18n/link.tsx` extends `Link` with hash anchor smooth scrolling support.
- Locale switching: `router.replace(pathname, { locale: "en" })`.

## Route Handlers (`src/app/[locale]/`)

- `layout.tsx`: Calls `setRequestLocale(locale)`, wraps children in `NextIntlClientProvider`.
- `[slug]/page.tsx`: Uses `getPageKeyBySlug()` to resolve the page key, then `pages[key].render(locale)` to load content and render the component. No switch statement — the page registry handles the mapping.
- All generate static params for locale/slug combinations.

## Content Loading

Content is **not** loaded via next-intl's message system. Instead, each page has its own typed content loader in `src/content/pages/<page>/index.ts` that dynamically imports the correct locale file. Global content (header, footer) follows the same pattern in `src/content/header/` and `src/content/footer/`.

The page registry in `src/content/pages/index.ts` bundles slugs, components, and loaders together via `definePage()`. The `[slug]/page.tsx` route handler uses `pages[key].render(locale)` — no switch statement needed.

When adding a new page, register it in two places:
1. `src/content/pages/slugs.ts` — add the slug mapping
2. `src/content/pages/index.ts` — add the `definePage()` entry with component and loader
