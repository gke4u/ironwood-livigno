import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
      // Secrets (SMTP_PASSWORD, ADMIN_*) live in `wrangler secret put` in
      // production and .dev.vars locally, neither of which is meant to be
      // committed — fixed, obviously-fake values here instead, so the test
      // suite is fully self-contained and never depends on a secrets file
      // existing on whatever machine runs it (including CI).
      miniflare: {
        bindings: {
          ADMIN_PASSWORD: 'test-password',
          ADMIN_SESSION_SECRET: 'test-session-secret',
          SMTP_PASSWORD: 'unused-in-tests'
        }
      }
    })
  ],
  test: {
    globalSetup: ['./test/global-setup.ts'],
    setupFiles: ['./test/setup.ts']
  }
});
