// `wrangler types` can only see bindings declared in wrangler.jsonc, so the
// generated Cloudflare.Env (worker-configuration.d.ts) is missing the
// secrets (SMTP_PASSWORD, ADMIN_*) that only exist via `wrangler secret
// put` in production / .dev.vars locally / miniflare.bindings in
// vitest.config.mts for tests. Merging them in here is what lets
// `env` from `cloudflare:test` satisfy src/index.ts's own Env type when
// passed to worker.fetch() in test/worker.test.ts.
export {};

declare global {
  namespace Cloudflare {
    interface Env {
      SMTP_PASSWORD: string;
      ADMIN_PASSWORD: string;
      ADMIN_SESSION_SECRET: string;
    }
  }
}
