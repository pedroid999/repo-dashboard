# QA notes — `replace-mock-with-gitlab`

Fase: **G** (gates finales + QA), change `replace-mock-with-gitlab`.

## Gates ejecutados

| Gate | Comando | Resultado |
|------|---------|-----------|
| G.1 | `pnpm --filter @workspace/domain test` | 111/111 pasan |
| G.2 | `pnpm --filter dashboard test` | 91/91 pasan |
| G.3 | `pnpm -w typecheck` | 5/5 tasks pasan |
| G.4 | `pnpm -w lint` | 3/3 tasks pasan |
| G.5 | `pnpm e2e` (con `DATA_SOURCE=mock`) | 3 passed · 1 failed preexistente (ver abajo) |

## E2E: fallo preexistente (out of scope)

El test `e2e/app-shell.spec.ts:25` `invalid ?v=hacker falls back to V1 (AS-1)` falla por *strict mode violation* de Playwright: `getByTestId('variation-v1')` resuelve a 2 elementos.

Verificado revirtiendo al commit de base `2efd3ee` (merge de `add-app-shell`, previo a este change): la suite tenía **2 tests rojos** (`V4 tab updates URL and persists across reload` + `invalid ?v=hacker falls back to V1`). Tras este change, sólo queda **1 en rojo** (el de `?v=hacker`).

- **Causa**: duplicidad del `data-testid="variation-v1"` en `DashboardShell` / CardsGrid (no se modificaron en este change).
- **Impacto en GL-2..GL-9**: cero — el fallback `parseVariation` y el factory `DATA_SOURCE=mock` funcionan (los otros 3 tests verifican shell, theme toggle, V4 selection).
- **Propuesta**: abrir follow-up en `fix-variation-testid-dup` (aislado a `add-app-shell`).

## G.6 — QA visual (manual)

Instrucciones para la corrida local con mock:

```bash
DATA_SOURCE=mock pnpm dev --filter dashboard
# abrir http://localhost:3000 con viewport 1440×900
```

Baseline esperado: misma salida visual post-`port-wireframe-styles` / `add-app-shell` (mock fixture `platformCoreFixture`, 12 repos, 5 tabs, Kanagawa dark theme por defecto, toggle de tema preservado, `loading.tsx` skeleton durante hidratación, `error.tsx` en español).

## G.7 — Run manual opcional con GitLab real

No automatizado. Para ejercitar `GitLabDataSource` con un proyecto real:

```bash
cp apps/dashboard/.env.local.example apps/dashboard/.env.local
# editar .env.local:
#   DATA_SOURCE=gitlab
#   GITLAB_HOST=https://gitlab.com            (o tu instancia self-hosted)
#   GITLAB_TOKEN=<PAT con scope read_api>
#   GITLAB_PROJECT_IDS=<numeric-id>,<group/subgroup/project>
pnpm dev --filter dashboard
```

Validaciones recomendadas a ojo:
- El Dataset hidrata con repos/pipelines/MRs reales sin errores en consola.
- El `error.tsx` se invoca si `GITLAB_TOKEN` es inválido y **no muestra** el valor del token (GL-3, GL-8).
- Network tab: todas las requests a `/api/v4/*` incluyen `PRIVATE-TOKEN`; ningún fetch llega al bundle cliente.
- Revalidate: pipelines/jobs/commits/MRs con 60 s; `GET /projects/:id` con 300 s (GL-7).
