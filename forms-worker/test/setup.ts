// Runs inside the real Workers runtime (workerd) before each test file —
// vitest-pool-workers gives every test file its own isolated D1 instance,
// so the schema has to be (re)applied here rather than once globally.
//
// Not env.DB.exec(fullSchema) — D1's exec() splits its input on newlines,
// one statement per line, so a CREATE TABLE with each column on its own
// line (schema.sql's actual formatting) gets chopped mid-statement. Each
// ;-terminated statement is run individually instead, the same way
// wrangler d1 execute --file parses it.
import { env } from 'cloudflare:test';
import { inject } from 'vitest';

// Strip `-- comment` text before splitting on `;` — schema.sql has at
// least one inline comment that itself contains a semicolon
// (children_ages's "e.g. [5,9]; NULL when..."), which would otherwise
// split a statement in the middle of its trailing comment.
const withoutComments = inject('schemaSql')
  .split('\n')
  .map((line) => line.replace(/--.*$/, ''))
  .join('\n');
const statements = withoutComments
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await env.DB.prepare(statement).run();
}
