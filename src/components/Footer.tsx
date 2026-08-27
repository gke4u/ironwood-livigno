import { useTranslations } from 'next-intl';
import { contactSlugs, locales, localeLabels, type Locale } from '@/i18n/routing';
import { getSatellitePages } from '@/data/satellite-pages';
import Logo from './Logo';

const CIN = 'IT014037C274OJ27T8';
// No VAT number — sole proprietor operating under a personal tax code
// (confirmed by the site owner directly, not a placeholder).
const TAX_CODE = 'GNUFNC74D07E621H';
const EMAIL = 'info@ironwoodlivigno.com';
const PHONE_DISPLAY = '+39 0342 929285';
const PHONE_TEL = '+390342929285';
const FULL_ADDRESS = 'Via Saroch 771, 23041 Livigno (SO), Italia';

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  // The 9 SEO landing pages (src/data/satellite-pages.ts) live outside the
  // [locale] tree. getSatellitePages resolves each to its translated
  // /<slug>/<locale> variant where one exists (src/content/
  // landingPageTranslations.ts), falling back to the Italian original for
  // any locale/page combination not translated yet.
  const landingPages = getSatellitePages(locale);

  const sectionLinks = [
    { href: `/${locale}#esperienza`, label: tNav('experience') },
    { href: `/${locale}#camere`, label: tNav('rooms') },
    { href: `/${locale}#posizione`, label: tNav('location') },
    { href: '/blog', label: 'Blog' }
  ];

  return (
    <footer className="bg-ink text-mist/70 py-10">
      <div className="max-w-content mx-auto px-6 md:px-10">
        {landingPages.length > 0 && (
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest mb-8 pb-8 border-b border-mist/10">
            {landingPages.map((p) => (
              <a key={p.href} href={p.href} className="hover:text-mist transition-colors">
                {p.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm mb-8">
          <a href={`/${locale}`}>
            <Logo className="text-mist/70 [&_svg]:opacity-70" />
          </a>
          <p>{t('tagline')}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a href={`tel:${PHONE_TEL}`} className="hover:text-mist transition-colors">
              {PHONE_DISPLAY}
            </a>
            <span className="opacity-30">·</span>
            <a href={`mailto:${EMAIL}`} className="hover:text-mist transition-colors">
              {EMAIL}
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
            <a href={`/${locale}/${contactSlugs[locale]}`} className="hover:text-mist transition-colors underline underline-offset-4">
              {tNav('contact')}
            </a>
            <span className="opacity-30">·</span>
            <a href={`/${locale}/privacy`} className="hover:text-mist transition-colors underline underline-offset-4">
              {t('privacy_link')}
            </a>
          </div>
        </div>

        {/* Legal / registry info: required to appear on-site for Italian
            short-term rentals (CIN), plus the identifying tax code since
            there's no VAT number (sole proprietor, not VAT-registered). */}
        <div className="text-center text-xs text-mist/45 mb-8 space-y-1">
          <p>
            Ironwood Livigno — {FULL_ADDRESS} · CIN {CIN} · CF {TAX_CODE}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-widest mb-6">
          {sectionLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-mist transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <nav
          aria-label={t('language_nav_label')}
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-mist/40 mb-6"
        >
          {locales.map((l, i) => (
            <span key={l} className="flex items-center gap-x-3">
              <a
                href={`/${l}`}
                aria-current={l === locale ? 'true' : undefined}
                className={`hover:text-mist transition-colors ${l === locale ? 'text-mist/70 underline underline-offset-4' : ''}`}
              >
                {localeLabels[l]}
              </a>
              {i < locales.length - 1 && <span aria-hidden>·</span>}
            </span>
          ))}
        </nav>

        <p className="text-center text-xs text-mist/40">
          © {new Date().getFullYear()} Ironwood Livigno — {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
