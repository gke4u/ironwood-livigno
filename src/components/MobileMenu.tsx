'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { getSatellitePages } from '@/data/satellite-pages';
import type { Locale } from '@/i18n/routing';

// The desktop nav links (Esperienza, Camere, Posizione, Blog, Contatti,
// Richiedi info) are hidden below the `lg` breakpoint with no fallback,
// which leaves mobile/tablet visitors — the majority of traffic on a
// vacation-rental site — unable to reach any section or the request-info
// CTA from the header at all. This adds the missing hamburger menu.
export default function MobileMenu({
  home,
  contactHref,
  locale
}: {
  home: string;
  contactHref: string;
  locale: Locale;
}) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      // Focus trap: while the panel is open, Tab/Shift+Tab cycle only
      // through its own focusable elements instead of leaking out to the
      // rest of the page (WCAG 2.1.2, and just less disorienting on a
      // small screen where you can't see what you've tabbed onto).
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    // Move focus into the panel as soon as it opens, so keyboard users
    // land somewhere sensible instead of on a now-hidden trigger.
    const firstLink = panelRef.current?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const links = [
    { href: `${home}#esperienza`, label: t('experience') },
    { href: `${home}#camere`, label: t('rooms') },
    { href: `${home}#posizione`, label: t('location') },
    { href: '/blog', label: 'Blog' },
    { href: contactHref, label: t('contact') }
  ];

  function close() {
    setOpen(false);
  }

  return (
    <div className="lg:hidden" ref={panelRef}>
      <button
        ref={toggleRef}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? t('menu_close') : t('menu_open')}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-ink text-mist border border-cream/70 hover:bg-ink/90 hover:border-cream transition-colors shadow-soft"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full mt-2 mx-6 rounded-2xl bg-mist text-ink shadow-soft overflow-hidden z-50">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="block px-6 py-3.5 min-h-[44px] text-sm uppercase tracking-widest border-b border-ink/10 hover:bg-cream/60 flex items-center"
            >
              {link.label}
            </a>
          ))}
          <p className="px-6 pt-3 pb-1 text-[11px] uppercase tracking-widest text-ink/40">{t('discover')}</p>
          {getSatellitePages(locale).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="block px-6 py-3 min-h-[44px] text-sm uppercase tracking-widest border-b border-ink/10 hover:bg-cream/60 flex items-center"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`${home}#prenota`}
            onClick={close}
            className="block px-6 py-4 min-h-[44px] text-sm uppercase tracking-widest font-medium text-brick hover:bg-cream/60 flex items-center"
          >
            {t('book')}
          </a>
        </div>
      )}
    </div>
  );
}
