// Standalone header/footer for the /blog section and the standalone landing
// pages (/inverno, /estate, /famiglie, /come-arrivare). Italian-
// only (see README) and living outside the [locale] routing tree, so they
// can't use Nav/Footer/StickyWhatsApp directly — those depend on the
// next-intl provider that only wraps pages under src/app/[locale]/. This
// keeps the same look (logo, colors, sticky nav, WhatsApp CTA) without
// pulling in i18n machinery for sections that don't need it.
import Link from 'next/link';
import Logo from './Logo';
import BlogMobileMenu from './BlogMobileMenu';

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 bg-ink py-6 shadow-soft">
      <div className="max-w-content mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link href="/it" aria-label="Ironwood Livigno — home">
          <Logo className="text-mist" />
        </Link>
        {/* Below `lg`, four inline items (three text links plus a pill
            button) had no room to breathe next to the logo on a phone —
            no wrap handling, so they'd overflow or crowd together. Hidden
            here in favour of BlogMobileMenu, same breakpoint and pattern
            already used by the main site's Nav.tsx. */}
        <nav className="hidden lg:flex items-center gap-6 text-mist/90 text-sm uppercase tracking-widest">
          <Link href="/it" className="hover:text-gold transition-colors">
            Home
          </Link>
          <Link href="/blog" className="hover:text-gold transition-colors">
            Blog
          </Link>
          <Link href="/it/contatti" className="hover:text-gold transition-colors">
            Contatti
          </Link>
          <Link
            href="/it#prenota"
            className="border border-gold text-gold rounded-full px-5 py-2 hover:bg-gold hover:text-ink transition-colors"
          >
            Prenota
          </Link>
        </nav>
        <BlogMobileMenu />
      </div>
    </header>
  );
}

// Fixed WhatsApp CTA for pages outside the [locale] tree — same look as
// StickyWhatsApp.tsx but with hardcoded Italian strings instead of
// useTranslations, since there's no NextIntlClientProvider out here.
export function BlogWhatsAppCta() {
  return (
    <a
      href="https://wa.me/390342929285?text=Ciao!%20Vorrei%20richiedere%20disponibilit%C3%A0%20per%20Ironwood%20Livigno."
      target="_blank"
      rel="noopener noreferrer"
      // Same fix as StickyWhatsApp.tsx: #25D366 only hit 1.98:1 contrast
      // with white text (needs 4.5:1) — #075E54 is WhatsApp's own darker
      // brand green, still recognizable, ~7.7:1 with white on top.
      className="fixed bottom-6 right-6 z-50 flex items-center gap-[3px] bg-[#075E54] text-white rounded-full pl-[9px] pr-[11px] py-[7px] shadow-soft hover:bg-[#054942] transition-colors"
      aria-label="WhatsApp"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
      </svg>
      <span className="text-[11px] font-medium">Scrivici su WhatsApp</span>
    </a>
  );
}

const RELATED_PAGES = [
  { href: '/inverno', label: 'Inverno' },
  { href: '/estate', label: 'Estate' },
  { href: '/famiglie', label: 'Famiglie' },
  { href: '/come-arrivare', label: 'Come arrivare' },
  { href: '/chi-siamo', label: 'Chi siamo' },
  { href: '/sauna-bagno-turco-privato-livigno', label: 'Sauna privata' },
  { href: '/camere-appartamento-livigno', label: 'Le camere' }
];

export function BlogFooter() {
  return (
    <footer className="bg-ink text-mist/70 py-10">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest mb-8 pb-8 border-b border-mist/10">
          {RELATED_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="hover:text-mist transition-colors">
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm mb-8">
          <Link href="/it">
            <Logo className="text-mist/70 [&_svg]:opacity-70" />
          </Link>
          <p>Ironwood Livigno — Via Saroch 771</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a href="tel:+390342929285" className="hover:text-mist transition-colors">
              +39 0342 929285
            </a>
            <span className="opacity-30">·</span>
            <a href="mailto:info@ironwoodlivigno.com" className="hover:text-mist transition-colors">
              info@ironwoodlivigno.com
            </a>
            <span className="opacity-30">·</span>
            <a
              href="https://instagram.com/ironwood_livigno"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mist transition-colors"
            >
              Instagram
            </a>
            <span className="opacity-30">·</span>
            <Link href="/it/contatti" className="hover:text-mist transition-colors underline underline-offset-4">
              Contatti
            </Link>
            <span className="opacity-30">·</span>
            <Link href="/it/privacy" className="hover:text-mist transition-colors underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-mist/60 mb-2">
          Ironwood Livigno — Via Saroch 771, 23041 Livigno (SO), Italia · CIN IT014037C274OJ27T8 · CF GNUFNC74D07E621H
        </p>
        <p className="text-center text-xs text-mist/60">
          © {new Date().getFullYear()} Ironwood Livigno — Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
