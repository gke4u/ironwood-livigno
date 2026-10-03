// Standalone header/footer for the /blog section and the standalone landing
// pages (/inverno, /estate, /famiglie, /come-arrivare, ...) and their
// translations. They live outside the [locale] routing tree, so they can't
// use Nav/Footer directly — those depend on the next-intl
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
import ChatWidgetServer from './ChatWidgetServer';
import FloatingDockServer from './FloatingDockServer';

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


export async function BlogFooter({ locale = 'it' }: { locale?: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
    <OfferPopupServer locale={locale} />
    <ChatWidgetServer locale={locale} />
    <FloatingDockServer locale={locale} />
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
          Ironwood Livigno — Via Saroch 767, 23041 Livigno (SO), Italia · CIN IT014037C274OJ27T8 · CIR 014037-CNI-01104 · CF GNUFNC74D07E621H
        </p>
        <p className="text-center text-xs text-mist/60">
          © {new Date().getFullYear()} Ironwood Livigno — {t('copyright')}
        </p>
      </div>
    </footer>
    </>
  );
}
