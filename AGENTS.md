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

# Site

The public site is **German-only**. There is no `next-intl`, no `[locale]` segment, and no page registry. URLs are filesystem routes under `src/app/(site)/`.

Marketing pages are **text-only**: copy lives in section components (or is passed inline to shared sections such as `FaqSection`). Do not put landing-page copy in `src/content/`.

# Directory Layout

```
src/
├── app/
│   ├── layout.tsx                 # Root HTML, fonts, lang="de"
│   ├── (site)/                    # Public marketing site (no URL segment)
│   │   ├── layout.tsx             # Header + Footer
│   │   ├── page.tsx               # /
│   │   └── <slug>/page.tsx        # Thin route + metadata
│   └── os/                        # Internal app (separate layout)
├── components/
│   ├── main.tsx                   # <main> with header offset
│   ├── pages/                     # Page composers
│   │   ├── home.tsx
│   │   └── check/index.tsx
│   ├── sections/                  # Shared + page-specific sections
│   │   ├── index.tsx              # Base Section wrapper
│   │   ├── faq.tsx                # Shared (content prop)
│   │   ├── home/hero.tsx
│   │   └── check/hero.tsx
│   └── atoms/                     # Brow, Heading, CTA, …
└── content/                       # Not for landing copy
    ├── pages/                     # Legal MDX (impressum, datenschutz)
    └── team/                      # Team + booking config
    # Later: blog
```

# Page & Section Architecture

Pages are composed from section components. Copy is hardcoded in those sections, matching the homepage.

## Route handlers

Thin files under `src/app/(site)/<slug>/page.tsx`:

1. Export `metadata` (`title`, `description`, `alternates.canonical`).
2. Default-export a component that renders the page composer.

## Page components

Live in `src/components/pages/` (`<slug>.tsx` or `<slug>/index.tsx`). They:

1. Wrap everything in `Main` from `@/components/main`.
2. Compose sections in order.
3. Pass inline content only to shared sections that require a `content` prop (`FaqSection`, `CalloutSection`).

## Section components

Every section:

1. Wraps its content in the base `Section` from `@/components/sections` (padding, paint/stripe backgrounds, side borders).
2. Composes atoms (`Brow`, `Heading`, `CTA`) and shadcn/ui components.
3. Uses `@mynaui/icons-react` and `cn()`.

Page-specific sections live in `src/components/sections/<page>/` and contain their German copy directly.

Shared sections that are reused with different copy (FAQ, callout) accept a typed `content` prop. The page composer passes that object inline — still not via `src/content/`.

For simple one-off blocks, render inline in the page component with the base `Section` wrapper.

# `src/content/`

Reserved for:

- Legal MDX (`impressum`, `datenschutz`)
- Team / booking config (`team/lukas.ts`)
- **Blog (later)**

Do **not** add landing-page or avatar-page copy here. Do not introduce `slugs.ts`, locale loaders, or a `definePage()` registry.

# Adding a new marketing page

1. `src/app/(site)/<slug>/page.tsx` — metadata + render the page component
2. `src/components/pages/<slug>.tsx` — `Main` + sections
3. `src/components/sections/<slug>/…` — page-specific sections with hardcoded copy
4. Footer (`src/components/sections/footer.tsx`) and sitemap (`src/app/sitemap.ts`) if the page is public
5. Booking confirmation route + `src/content/team/lukas.ts` only if the page has its own booking type

# Navigation

- Header CTA: `/check` (Prozess-Check). `navItems` is currently empty.
- Footer menus in `src/components/sections/footer.tsx`
- Locale-aware `Link` lives at `@/components/link` (hash smooth-scrolling). There is no locale switcher.
