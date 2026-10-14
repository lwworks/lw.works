# lw.works

Monorepo for the LW Works website and internal OS, built with pnpm workspaces, Turborepo and Next.js (Turbopack).

| Package | Path | Deployed to |
| --- | --- | --- |
| `@lw/web` | `apps/web` | www.lw.works |
| `@lw/os` | `apps/os` | os.lw.works |
| `@lw/ui` | `packages/ui` | shared design system (shadcn/ui, atoms, theme, fonts) |

## Getting started

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/os/.env.example apps/os/.env.local
pnpm dev
```

The website runs on [http://localhost:3000](http://localhost:3000), the OS on [http://localhost:3001](http://localhost:3001).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start both apps (`pnpm dev:web` / `pnpm dev:os` for one) |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Typecheck all packages |
| `pnpm --filter @lw/web email` | React Email preview |
| `pnpm --filter @lw/os db:migrate` | Run Drizzle migrations (also `db:generate`, `db:push`) |

## Deployment

Each app is its own Vercel project from this repository, with the Root Directory set to `apps/web` and `apps/os` respectively.
