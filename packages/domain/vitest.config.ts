import { createVitestConfig } from '@workspace/vitest-config'
import { fileURLToPath } from 'node:url'

// `server-only` deliberately throws on non-server imports. In Vitest (Node env)
// we alias it to the package's own `empty.js` stub, so adapter modules that
// declare `import "server-only"` can still be exercised under test.
const serverOnlyStub = fileURLToPath(
  new URL('./node_modules/server-only/empty.js', import.meta.url)
)

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
        '**/__fixtures__/**',
      ],
      thresholds: { perFile: true, lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
  resolve: {
    alias: {
      'server-only': serverOnlyStub,
    },
  },
})
