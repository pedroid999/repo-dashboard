# repo-dashboard

[![CI](https://github.com/pedroid999/repo-dashboard/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/pedroid999/repo-dashboard/actions/workflows/ci.yml)

Tech Lead Dashboard — Next.js 16 + Turborepo monorepo with Tailwind v4 and shadcn/ui, themed with the Kanagawa palette (Wave dark / Lotus light).

## Stack

- **Next.js 16** (App Router, Turbopack dev) on **React 19**
- **Turborepo 2.9** + **pnpm 10** workspaces
- **Tailwind CSS v4** (CSS-first `@theme inline`, no `tailwind.config.js`)
- **shadcn/ui 4** with the `base-nova` preset on **Base UI** primitives
- **TypeScript 5.9**, ESLint 9, Prettier 3
- Fonts: Space Grotesk (sans), JetBrains Mono (mono), Orbitron (display) via `next/font/google`

## Layout

```
repo-dashboard/
├── apps/
│   └── dashboard/          Next.js app (the product)
├── packages/
│   ├── ui/                 shared shadcn/ui components, tokens, globals.css
│   ├── eslint-config/      shared ESLint flat configs
│   └── typescript-config/  shared tsconfig bases
└── docs/design/            Claude Design handoff bundle (wireframes, PNGs)
```

## Requirements

- Node `>=22` (any current LTS works; `.nvmrc` pins to 22)
- pnpm 10 (`corepack enable` if needed)

## Getting started

```bash
pnpm install
pnpm dev        # turbo runs dashboard on http://localhost:3000
```

Other workspace scripts:

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm build
```

## Adding shadcn components

From the repo root, target the dashboard app — the CLI places components in `packages/ui`:

```bash
pnpm dlx shadcn@latest add button -c apps/dashboard
```

Import them from the shared package:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Theming

Design tokens live in `packages/ui/src/styles/globals.css` as CSS custom properties:

- `:root` → **Kanagawa Lotus** (light)
- `.dark` → **Kanagawa Wave** (dark)

Tokens map to shadcn's semantic names (`--background`, `--foreground`, `--primary`, `--destructive`, plus `--success`, `--warning`, `--info`). Press `d` on the landing page to toggle themes (via `next-themes`).

## Continuous integration

GitHub Actions runs five parallel jobs on every PR against `main` and on every push to `main`:

- `typecheck` — `pnpm typecheck`
- `lint` — `pnpm lint`
- `test-unit` — `pnpm test` (Vitest, enforces 70% coverage thresholds)
- `build` — `pnpm build`
- `test-e2e` — Playwright smoke tests; on failure, uploads `playwright-report/` as a workflow artifact

### Branch protection (manual setup)

To enforce the green bar on `main`, add a branch-protection rule in **Settings → Branches**:

- Branch name pattern: `main`
- Require a pull request before merging
- Require status checks to pass: `Typecheck`, `Lint`, `Unit tests`, `Build`, `E2E tests`
- Require branches to be up to date before merging

This step cannot be automated from inside the workflow; it must be configured once per repo.

## Design source

See `docs/design/` for the original handoff:

- `Tech Lead Dashboard Wireframes.html` — annotated wireframe
- `HANDOFF.md` — design notes from the Claude Design session
- `uploads/` — reference screenshots
