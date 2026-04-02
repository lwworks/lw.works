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
