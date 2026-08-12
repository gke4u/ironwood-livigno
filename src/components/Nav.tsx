'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { contactSlugs, type Locale } from '@/i18n/routing';
import { getSatellitePages } from '@/data/satellite-pages';
import LangSwitcher from './LangSwitcher';
import MobileMenu from './MobileMenu';
import Logo from './Logo';

const SECTION_IDS = ['esperienza', 'camere', 'posizione', 'prenota'];

// Sticky header: was `absolute`, which scrolled away with the hero and left
// every section below (Camere, Posizione, Blog, Contatti, Richiedi info)
// unreachable from the nav without scrolling back to the very top. `fixed`
// keeps it pinned across the whole page; the scroll listener swaps the
// transparent hero-overlay look for a solid, legible bar once the hero has
// scrolled past, so text/links stay readable over any background below.
// `top` reads the --banner-h CSS var (set by LangSuggestBanner.tsx) so the
// header sits below the language banner instead of underneath it.
export default function Nav({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const home = `/${locale}`;
  const contactHref = `/${locale}/${contactSlugs[locale]}`;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlights the nav link for whichever section is currently in view
  // (aria-current, plus a visible underline) — was previously impossible to
  // tell from the nav alone where you were on a single long scrolling page.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const navLink = (id: string, href: string, label: string) => (
    <a
      href={href}
      aria-current={activeSection === id ? 'true' : undefined}
      className={`relative pb-1 transition-colors hover:text-gold ${
        activeSection === id ? 'text-gold' : ''
      } after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-gold after:transition-all ${
        activeSection === id ? 'after:w-full' : 'after:w-0'
      }`}
    >
      {label}
    </a>
  );

  return (
    <header
      style={{ top: 'var(--banner-h, 0px)' }}
      className={`fixed left-0 right-0 z-40 transition-[background-color,box-shadow,top] duration-300 ${
        scrolled ? 'bg-ink/95 backdrop-blur-sm shadow-soft' : 'bg-transparent'
      }`}
    >
      {/* Scrim behind the nav row: guarantees the logo and language switcher
          stay legible over the hero photo (or any content behind them) on
          every screen size, instead of relying on exact hero-content height
          math to avoid overlap. Fades to transparent so it stays subtle.
          Only needed pre-scroll — once the bar goes solid above, it already
          guarantees contrast on its own. */}
      {!scrolled && (
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 via-ink/35 to-transparent pointer-events-none"
          aria-hidden
        />
      )}
      <div
        className={`relative max-w-content mx-auto px-6 md:px-10 flex items-center justify-between transition-[padding] duration-300 ${
          scrolled ? 'py-4' : 'py-6'
        }`}
      >
        <a href={home} aria-label="Ironwood Livigno — home">
          <Logo className={`text-mist transition-transform duration-300 ${scrolled ? 'scale-90' : ''}`} />
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-mist/90 text-sm uppercase tracking-widest">
          {navLink('esperienza', `${home}#esperienza`, t('experience'))}
          {navLink('camere', `${home}#camere`, t('rooms'))}
          {navLink('posizione', `${home}#posizione`, t('location'))}
          <div className="relative group">
            <button type="button" className="flex items-center gap-1 hover:text-gold transition-colors" aria-haspopup="true">
              Scopri
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block group-focus-within:block">
              <div className="w-56 rounded-xl bg-mist text-ink shadow-soft overflow-hidden py-2">
                {getSatellitePages(locale).map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    className="block px-4 py-2 text-xs normal-case tracking-normal hover:bg-cream/60 transition-colors"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="/blog" className="hover:text-gold transition-colors">
            Blog
          </a>
          <a href={contactHref} className="hover:text-gold transition-colors">
            {t('contact')}
          </a>
          <a
            href={`${home}#prenota`}
            aria-current={activeSection === 'prenota' ? 'true' : undefined}
            className="border border-gold text-gold rounded-full px-5 py-2 hover:bg-gold hover:text-ink transition-colors"
          >
            {t('book')}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitcher current={locale} />
          <MobileMenu home={home} contactHref={contactHref} locale={locale} />
        </div>
      </div>
    </header>
  );
}
