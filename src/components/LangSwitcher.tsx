'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { locales, localeLabels, type Locale } from '@/i18n/routing';

// Language picker in the nav. Twelve languages don't fit a plain dropdown
// on a phone: the nav is fixed, so a long list ran off the bottom of the
// screen (and under the contact bar) and couldn't be scrolled. Now:
//   - phones: a sheet sliding up from the bottom, above everything, with the
//     languages in two columns (all visible at once; scrolls if ever needed),
//     closed by ×, by tapping outside or by picking a language;
//   - larger screens: a two-column dropdown under the button, never taller
//     than the window.
// Same warm dark look as NIGI and the offer pop-up.

const SMALL = '(max-width: 639px)';

export default function LangSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false); // phone layout, decided when opening
  const [shown, setShown] = useState(false); // runs the sheet's slide-in
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rest = pathname.split('/').slice(2).join('/');

  const close = useCallback(() => {
    setShown(false);
    setOpen(false);
  }, []);

  function toggle() {
    if (open) return close();
    setSheet(window.matchMedia(SMALL).matches);
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  }

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const t = event.target as Node;
      if (containerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      close();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    // The page behind the phone sheet stays still.
    const prev = document.body.style.overflow;
    if (sheet) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, sheet, close]);

  const options = (
    <ul role="listbox" aria-label="Lingua / Language" className="grid grid-cols-2 gap-1.5">
      {locales.map((l) => {
        const active = l === current;
        return (
          <li key={l}>
            <Link
              href={rest ? `/${l}/${rest}` : `/${l}`}
              onClick={close}
              role="option"
              aria-selected={active}
              lang={l}
              className={`flex items-center justify-between gap-2 min-h-[48px] rounded-xl px-3.5 text-[15px] sm:text-sm transition-colors ${
                active ? 'bg-gold/15 text-mist ring-1 ring-gold/70 font-semibold' : 'text-mist/85 hover:bg-white/[0.07] hover:text-mist'
              }`}
            >
              <span className="truncate">{localeLabels[l]}</span>
              {active ? (
                <svg className="flex-none w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m5 12 5 5L20 7" />
                </svg>
              ) : (
                <span className="flex-none text-[10px] tracking-[0.14em] uppercase text-mist/40">{l === 'en-us' ? 'US' : l}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const eyebrow = (
    <p className="flex items-center gap-2 text-gold tracking-[0.22em] uppercase text-[10px] font-semibold">
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" />
      </svg>
      Lingua · Language
    </p>
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        // Starts with the visible label, so voice-control users can say
        // what they see (WCAG 2.5.3 "label in name").
        aria-label={`${localeLabels[current]} — Cambia lingua / Change language`}
        className="flex items-center gap-2 min-h-[44px] text-sm font-medium tracking-wide uppercase bg-ink text-mist border border-cream/70 rounded-full pl-3 pr-3.5 py-2.5 hover:bg-ink/90 hover:border-cream transition-colors shadow-soft"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" />
        </svg>
        {localeLabels[current]}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Larger screens: dropdown under the button. */}
      {open && !sheet && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-[22rem] max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain bg-[#3D3026] rounded-2xl p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 z-50"
        >
          <div className="px-1.5 pb-2.5 pt-0.5">{eyebrow}</div>
          {options}
        </div>
      )}

      {/* Phones: a sheet from the bottom, outside the fixed nav (portal) so it
          can cover the whole screen and sit above the contact bar. */}
      {open &&
        sheet &&
        createPortal(
          <div className="fixed inset-0 z-[90]" role="presentation">
            <div className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`} aria-hidden />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Lingua / Language"
              className={`absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto overscroll-contain bg-[#3D3026] rounded-t-[1.75rem] px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
                shown ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" aria-hidden />
              <div className="flex items-center justify-between px-1 pb-3">
                {eyebrow}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Chiudi / Close"
                  className="grid place-items-center w-9 h-9 rounded-full ring-1 ring-gold/60 text-mist hover:bg-white/10 transition"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              {options}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
