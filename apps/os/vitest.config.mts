import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      // `server-only` throws outside the Next.js server build. Tests import those modules directly.
      { find: 'server-only', replacement: path.join(root, 'test/server-only-stub.ts') },
      { find: /^@\//, replacement: `${path.join(root, 'src')}/` },
    ],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
