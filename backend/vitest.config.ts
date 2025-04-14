// backend/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Use Vitest's global APIs (describe, it, expect, etc.) without importing
    environment: 'node', // Specify the test environment
    // Optional: Setup files to run before tests (e.g., for global mocks)
    setupFiles: ['./src/tests/setup.ts'], 
    // Optional: Configure coverage
    // coverage: {
    //   provider: 'v8', // or 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    // },
  },
});
