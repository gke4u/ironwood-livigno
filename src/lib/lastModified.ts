import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

// Real "last changed" date for a page, derived from the source files that
// hold its content — used by sitemap.ts for <lastmod>. That field used to be
// `new Date()` (the build timestamp) for most pages, so every deploy told
// Google that ~110 URLs had "just changed" whether or not they had, and
// Google learns to ignore lastmod entirely from sites where it's always
// "now". Build-time only (called while `next build` renders sitemap.xml).
//
// - Files with uncommitted edits → newest file mtime (so a deploy from a
//   working tree that isn't committed yet still reports the edit).
// - Otherwise → date of the last commit touching any of the files.
// - Git missing or no history → undefined, and the sitemap simply omits
//   <lastmod> for that URL. No date is better than a wrong one.
const cache = new Map<string, Date | undefined>();

function git(args: string[]): string {
  return execFileSync('git', ['--literal-pathspecs', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function resolveLastModified(paths: string[]): Date | undefined {
  try {
    if (git(['status', '--porcelain', '--', ...paths])) {
      const newest = Math.max(...paths.map((p) => { try { return statSync(p).mtimeMs; } catch { return 0; } }));
      return newest > 0 ? new Date(newest) : undefined;
    }
    const iso = git(['log', '-1', '--format=%cI', '--', ...paths]);
    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}

export function contentLastModified(...paths: string[]): Date | undefined {
  const key = paths.join('|');
  if (!cache.has(key)) cache.set(key, resolveLastModified(paths));
  return cache.get(key);
}
