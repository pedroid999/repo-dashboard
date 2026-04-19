import { createVitestConfig } from '@workspace/vitest-config'

export default createVitestConfig({
  test: {
    environment: 'node',
    coverage: {
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/*.config.ts',
        '**/index.ts',
        '**/*.d.ts',
      ],
      thresholds: { perFile: true, lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
})
