import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // PF-43: nap bien moi truong toi thieu truoc khi import config/env.ts
    setupFiles: ['./tests/setup.ts'],
  },
});
