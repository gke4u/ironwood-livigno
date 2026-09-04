import type { Metadata } from 'next';
// Global CSS + self-hosted fonts live in the ROOT layout so that every
// route gets them — both the localized pages under /[locale] and the
// Italian-only /blog section (which renders its own <html>/<body> and
// previously sat outside the tree that imported globals.css).
//
// Fonts are self-hosted via Fontsource: the .woff2 files ship inside the
// site's own static build — no request to Google Fonts at all. Faster
// (same origin, immutable cache), GDPR-simpler (no third-party
// connection), and immune to Google Fonts outages or geo-blocks. The
// imports emit @font-face rules; the font-family names they register are
// wired to the design tokens via the --font-fraunces / --font-poppins CSS
// variables in globals.css, which tailwind.config.ts consumes.
//
// Fraunces uses the static (single-weight) package, not the variable one:
// every "font-display" element inherits font-weight from its default
// (Tailwind's preflight resets h1-h6 to `font-weight: inherit`, and nothing
// in this codebase ever sets a different weight on a font-display element)
// — so only weight 400 is ever actually rendered, normal and italic. The
// variable font ships the full 100-900 weight axis to support a range nothing
// here uses; the static 400 files are less than half the size (measured:
// ~18KB+22KB vs ~37KB+46KB) and cheaper for the browser to shape, for a
// visually identical result.
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import './globals.css';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon-32.png',
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
