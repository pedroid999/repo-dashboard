import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// Use the return type of defineConfig (which is augmented by Vitest to include `test`)
type VitestConfig = Parameters<typeof defineConfig>[0]

const baseCoverage = {
  provider: 'v8' as const,
  reporter: ['json', 'lcov', 'text'] as string[],
  reportsDirectory: './coverage',
  thresholds: { perFile: true, lines: 70, functions: 70, branches: 70, statements: 70 },
}

export function createVitestConfig(overrides: VitestConfig = {}): ReturnType<typeof defineConfig> {
  const { test: overrideTest, ...restOverrides } = overrides as {
    test?: { coverage?: Record<string, unknown>; [key: string]: unknown }
    [key: string]: unknown
  }
  const { coverage: overrideCoverage, ...restOverrideTest } = overrideTest ?? {}

  return defineConfig({
    plugins: [tsconfigPaths()],
    test: {
      environment: 'happy-dom',
      globals: true,
      css: false,
      coverage: {
        ...baseCoverage,
        ...(overrideCoverage as object),
      },
      ...restOverrideTest,
    },
    ...restOverrides,
  } as VitestConfig)
}
