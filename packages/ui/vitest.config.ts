import { createVitestConfig } from '@workspace/vitest-config'

export default createVitestConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.stories.tsx',
        '**/*.config.{ts,mjs}',
        '**/index.ts',
        '**/*.d.ts',
        '**/__tests__/**',
      ],
      thresholds: { perFile: true, lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
})
