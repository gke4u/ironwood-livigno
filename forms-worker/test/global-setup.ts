// Runs in real Node (not the Workers runtime) before any test file, so it's
// the only place allowed to touch the filesystem — reads schema.sql once
// and hands its text to the Workers-side setup (test/setup.ts) via
// provide/inject, instead of duplicating the schema as a second hardcoded
// copy that could drift from the real one.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

declare module 'vitest' {
  export interface ProvidedContext {
    schemaSql: string;
  }
}

export default function setup({ provide }: { provide: (key: 'schemaSql', value: string) => void }) {
  // Not `new URL('../schema.sql', import.meta.url)` — @cloudflare/workers-types
  // and @types/node both declare a global `URL`, and the two are
  // incompatible enough that TS rejects passing one to the other's
  // fileURLToPath(). import.meta.url is already a plain string, so building
  // the path with node:path instead sidesteps the clash entirely.
  const here = dirname(fileURLToPath(import.meta.url));
  const schemaPath = join(here, '..', 'schema.sql');
  provide('schemaSql', readFileSync(schemaPath, 'utf8'));
}
