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
import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/wght-italic.css';
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
