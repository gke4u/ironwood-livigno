'use client';

import { useEffect, useRef, useState } from 'react';

// Mobile hamburger menu for BlogHeader (satellite/blog pages, Italian-only,
// no next-intl provider available out here — see BlogChrome.tsx). Mirrors
// MobileMenu.tsx (used by the main [locale] Nav) so mobile visitors get the
// same interaction pattern everywhere on the site, just with the smaller,
// hardcoded link set these pages actually have.
const LINKS = [
  { href: '/it', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/it/contatti', label: 'Contatti' }
];

export default function BlogMobileMenu() {
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

    const firstLink = panelRef.current?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <div className="lg:hidden relative" ref={panelRef}>
      <button
        ref={toggleRef}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Chiudi menu' : 'Apri menu'}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-ink text-mist border border-cream/70 hover:bg-ink/90 hover:border-cream transition-colors shadow-soft"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-mist text-ink shadow-soft overflow-hidden z-50">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="block px-6 py-3.5 min-h-[44px] text-sm uppercase tracking-widest border-b border-ink/10 hover:bg-cream/60 flex items-center"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/it#prenota"
            onClick={close}
            className="block px-6 py-4 min-h-[44px] text-sm uppercase tracking-widest font-medium text-brick hover:bg-cream/60 flex items-center"
          >
            Prenota
          </a>
        </div>
      )}
    </div>
  );
}
