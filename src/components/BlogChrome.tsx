// Standalone header/footer for the /blog section and the standalone landing
// pages (/inverno, /estate, /famiglie, /come-arrivare, ...) and their
// translations. They live outside the [locale] routing tree, so they can't
// use Nav/Footer/StickyWhatsApp directly — those depend on the next-intl
// provider that only wraps pages under src/app/[locale]/. Each takes the
// page's locale (Italian by default) and reads the site's own translated
// strings with getTranslations, so a Polish article gets a Polish menu
// linking to Polish pages instead of the Italian ones.
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { contactSlugs, type Locale } from '@/i18n/routing';
import { getSatellitePages } from '@/data/satellite-pages';
import { blogIndexHref } from '@/lib/blogIndex';
import Logo from './Logo';
import BlogMobileMenu from './BlogMobileMenu';
import OfferPopupServer from './OfferPopupServer';

export async function BlogHeader({ locale = 'it' }: { locale?: Locale }) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const home = `/${locale}`;
  const links = [
    { href: home, label: 'Home' },
    { href: blogIndexHref(locale), label: 'Blog' },
    { href: `/${locale}/${contactSlugs[locale]}`, label: t('contact') }
  ];
  const book = { href: `${home}#prenota`, label: t('book') };

  return (
    <header className="sticky top-0 z-40 bg-ink py-6 shadow-soft">
      <div className="max-w-content mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link href={home} aria-label="Ironwood Livigno — home">
          <Logo className="text-mist" />
        </Link>
        {/* Below `lg`, four inline items (three text links plus a pill
            button) had no room to breathe next to the logo on a phone —
            no wrap handling, so they'd overflow or crowd together. Hidden
            here in favour of BlogMobileMenu, same breakpoint and pattern
            already used by the main site's Nav.tsx. */}
        <nav className="hidden lg:flex items-center gap-6 text-mist/90 text-sm uppercase tracking-widest">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold transition-colors">
              {link.label}
            </Link>
          ))}
          <Link
            href={book.href}
            className="border border-gold text-gold rounded-full px-5 py-2 hover:bg-gold hover:text-ink transition-colors"
          >
            {book.label}
          </Link>
        </nav>
        <BlogMobileMenu links={links} book={book} openLabel={t('menu_open')} closeLabel={t('menu_close')} />
      </div>
    </header>
  );
}

// Fixed WhatsApp CTA for pages outside the [locale] tree — same look as
// StickyWhatsApp.tsx but with hardcoded Italian strings instead of
// useTranslations, since there's no NextIntlClientProvider out here.
// Mid-article call to action (see BlogInlineCta in src/content/blog.ts):
// shown after roughly half of the sections on the posts that bring in the
// most search traffic, so readers who arrived through an informational
// query meet the apartment before the end of the article, not only after it.
export function InlineApartmentCta({ text, label, href }: { text: string; label: string; href: string }) {
  return (
    <aside className="my-8 p-6 md:p-7 bg-white rounded-2xl shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-ink text-base md:text-lg leading-snug">{text}</p>
      <Link
        href={href}
        className="bg-brick text-mist rounded-full px-6 py-3 font-medium hover:bg-brick/90 transition-colors whitespace-nowrap"
      >
        {label}
      </Link>
    </aside>
  );
}

export async function BlogWhatsAppCta({ locale = 'it' }: { locale?: Locale }) {
  const t = await getTranslations({ locale, namespace: 'request' });
  const tc = await getTranslations({ locale, namespace: 'contactPage' });

  return (
    <a
      href={`https://wa.me/390342929285?text=${encodeURIComponent(t('wa_intro'))}`}
      target="_blank"
      rel="noopener noreferrer"
      // Same fix as StickyWhatsApp.tsx: #25D366 only hit 1.98:1 contrast
      // with white text (needs 4.5:1) — #075E54 is WhatsApp's own darker
      // brand green, still recognizable, ~7.7:1 with white on top.
      className="fixed bottom-6 right-6 z-50 flex items-center gap-[3px] bg-[#075E54] text-white rounded-full pl-[9px] pr-[11px] py-[7px] shadow-soft hover:bg-[#054942] transition-colors"
      aria-label={tc('whatsapp_cta')}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
      </svg>
      <span className="text-[11px] font-medium">{tc('whatsapp_cta')}</span>
    </a>
  );
}

export async function BlogFooter({ locale = 'it' }: { locale?: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
    <OfferPopupServer locale={locale} />
    <footer className="bg-ink text-mist/70 py-10">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest mb-8 pb-8 border-b border-mist/10">
          {getSatellitePages(locale).map((p) => (
            <Link key={p.href} href={p.href} className="hover:text-mist transition-colors">
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm mb-8">
          <Link href={`/${locale}`}>
            <Logo className="text-mist/70 [&_svg]:opacity-70" />
          </Link>
          <p>{t('tagline')}</p>
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
            <Link href={`/${locale}/${contactSlugs[locale]}`} className="hover:text-mist transition-colors underline underline-offset-4">
              {tNav('contact')}
            </Link>
            <span className="opacity-30">·</span>
            <Link href={`/${locale}/privacy`} className="hover:text-mist transition-colors underline underline-offset-4">
              {t('privacy_link')}
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-mist/60 mb-2">
          Ironwood Livigno — Via Saroch 767, 23041 Livigno (SO), Italia · CIN IT014037C274OJ27T8 · CF GNUFNC74D07E621H
        </p>
        <p className="text-center text-xs text-mist/60">
          © {new Date().getFullYear()} Ironwood Livigno — {t('copyright')}
        </p>
      </div>
    </footer>
    </>
  );
}
