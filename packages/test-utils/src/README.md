# @workspace/test-utils

Shared testing utilities for the repo-dashboard monorepo.

## Usage

```ts
import { render, screen, userEvent } from '@workspace/test-utils'
```

The `render` function wraps RTL's `render` with a minimal `ThemeProvider` from `next-themes`, so components that call `useTheme()` won't throw during tests.

## Known Limitations

### CSS Custom Properties

`getComputedStyle(element).getPropertyValue('--color-background')` returns `""` in happy-dom. Do not assert CSS custom property values in component tests.

Use accessible role-based assertions (`getByRole`, `getByText`, `toBeVisible`, `toBeInTheDocument`) instead.

## Troubleshooting

### Port conflict during E2E tests

If `pnpm e2e` fails with EADDRINUSE on :3000, run `lsof -ti:3000 | xargs kill` to clear the stale process.
