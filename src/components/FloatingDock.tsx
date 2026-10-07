'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { nigi, useNigiEnabled } from '@/lib/nigi';
import { COOKIE_CONSENT_KEY } from './CookieConsent';

// The site's contact dock: everything fixed at the bottom, in one place.
//   - Phones: a slim bar across the bottom, equal parts (like hotel apps):
//     "Help" | the special offer (only while live) | "Book" (gold, to the
//     request form). The body gets the same padding at the bottom (globals.css).
//   - Larger screens: a column of equal pills in the bottom-right corner:
//     "Help" on top, the offer (if live) below it. The nav already has the booking button.
//   - "Help" opens a menu with the three ways to reach us, each explained
//     (HelpMenu): NIGI (recommended, instant answer at any hour), WhatsApp
//     (not instant: we answer when we can) and the phone. Before, NIGI and
//     WhatsApp were two buttons side by side with nothing to tell them apart.
//     With NIGI switched off only WhatsApp and the phone remain.
//   - A welcome bubble above "Help", once per visit (Nudge).
// The offer (OfferPopup.tsx) renders its button into its slot here with a
// portal. While NIGI's chat is open the dock steps aside (globals.css,
// html[data-nigi]).

export const DOCK_ID = 'iw-dock';
export const DOCK_SLOT_OFFER = 'iw-dock-offer';

// One button of the dock: icon over a short label on phones, a pill on larger screens.
export const DOCK_ITEM =
  'group relative flex flex-col items-center justify-center gap-1 h-14 min-w-0 px-1 text-[11px] leading-tight font-semibold text-mist ' +
  'hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/80 ' +
  'sm:flex-row sm:justify-start sm:gap-2.5 sm:h-11 sm:w-[13.5rem] sm:px-1.5 sm:pr-4 sm:rounded-full sm:bg-[#3D3026] sm:text-[13px] ' +
  'sm:ring-1 sm:ring-gold/50 sm:shadow-soft sm:hover:ring-gold sm:hover:bg-[#3D3026] sm:hover:-translate-y-0.5 sm:transition motion-reduce:sm:hover:translate-y-0';

// The round icon at the start of each button.
export const DOCK_ICON = 'relative grid place-items-center flex-none w-7 h-7 sm:w-8 sm:h-8 rounded-full';

export type DockStrings = {
  aria: string;
  help: string;
  helpSub: string;
  book: string;
  menuTitle: string;
  close: string;
  recommended: string;
  nigiTitle: string;
  nigiSub: string;
  nigiExample: string;
  instant: string;
  ask: string;
  otherTitle: string;
  waSub: string;
  notInstant: string;
  call: string;
  nudge: string;
  nudgeClose: string;
};

const PHONE_HREF = 'tel:+390342929285';
const PHONE_LABEL = '+39 0342 929285';
const GREEN = '#4cc27a';

export default function FloatingDock({ strings: t, whatsappHref, bookHref }: { strings: DockStrings; whatsappHref: string; bookHref: string }) {
  const nigiOn = useNigiEnabled();
  const [menu, setMenu] = useState(false);
  const toggle = () => setMenu((on) => !on);

  return (
    <>
      {menu && <HelpMenu t={t} nigiOn={nigiOn} whatsappHref={whatsappHref} onClose={() => setMenu(false)} />}
      {nigiOn && !menu && <Nudge t={t} />}

      <nav
        id={DOCK_ID}
        aria-label={t.aria}
        className={`fixed z-50 inset-x-0 bottom-0 grid grid-flow-col auto-cols-fr bg-[#3D3026]/95 backdrop-blur-md border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-12px_rgba(0,0,0,0.45)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:flex sm:flex-col sm:items-end sm:gap-2 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:shadow-none sm:pb-0 ${
          menu ? 'sm:invisible' : ''
        }`}
      >
        <button type="button" data-help onClick={toggle} aria-expanded={menu} aria-haspopup="dialog" className={DOCK_ITEM}>
          <span className={`${DOCK_ICON} bg-ink ring-1 ring-gold/60 text-mist`}>
            <BubbleIcon className="w-4 h-4" />
            {nigiOn && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#3D3026]" style={{ background: GREEN }} aria-hidden />}
          </span>
          <span className="min-w-0 max-w-full leading-tight sm:text-left">
            <span className="block truncate">{t.help}</span>
            {nigiOn && <span className="hidden sm:block truncate text-[11px] font-medium text-mist/60">{t.helpSub}</span>}
          </span>
        </button>

        {/* Phones: between Help and Book. Computers: under Help (the owner wants Help on top). */}
        <div id={DOCK_SLOT_OFFER} className="contents" />

        <a href={bookHref} className={`${DOCK_ITEM} sm:hidden`}>
          <span className={`${DOCK_ICON} rounded-lg bg-gold text-ink shadow-[0_6px_14px_-6px_rgba(201,160,89,0.9)]`} aria-hidden>
            <CalendarIcon className="w-4 h-4" />
          </span>
          <span className="truncate max-w-full">{t.book}</span>
        </a>
      </nav>
    </>
  );
}

// The "Help" menu. NIGI is the main choice (large card, "Recommended",
// instant answer at any hour); below, smaller, WhatsApp (not instant) and the
// phone. On phones it rises above the bar (page dimmed behind it), on larger
// screens it takes the dock's corner. Esc or a tap outside closes it.
function HelpMenu({ t, nigiOn, whatsappHref, onClose }: { t: DockStrings; nigiOn: boolean; whatsappHref: string; onClose: () => void }) {
  const first = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const badge = 'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.05em]';
  const row = 'flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-white/[0.05]';

  return (
    <>
      <button type="button" aria-label={t.close} tabIndex={-1} onClick={onClose} className="fixed inset-0 z-[55] cursor-default bg-black/45 sm:bg-transparent animate-fadeIn motion-reduce:animate-none" />
      <div
        role="dialog"
        aria-label={t.menuTitle}
        className="fixed z-[60] inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom))] mx-auto max-w-md overflow-hidden rounded-[1.5rem] bg-[#3D3026] text-mist ring-1 ring-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] animate-fadeIn motion-reduce:animate-none sm:inset-x-auto sm:right-6 sm:bottom-6 sm:mx-0 sm:w-[23rem]"
      >
        <div className="flex items-center justify-between pl-5 pr-3 pt-4 pb-1">
          <p className="font-display text-xl">{t.menuTitle}</p>
          <button type="button" onClick={onClose} aria-label={t.close} className="grid place-items-center w-9 h-9 rounded-full text-mist/70 hover:text-mist hover:bg-white/[0.08] transition">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 p-3 pt-2">
          {nigiOn && (
            <button
              ref={(el) => {
                first.current = el;
              }}
              type="button"
              onClick={() => {
                onClose();
                nigi.open();
              }}
              className="group relative block w-full rounded-2xl bg-white/[0.06] ring-2 ring-gold/80 px-4 pt-7 pb-4 text-left transition hover:bg-white/[0.09]"
            >
              <span className="absolute top-0 right-4 rounded-b-lg bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink">{t.recommended}</span>
              <span className="flex items-center gap-3.5">
                <span className="relative grid place-items-center flex-none w-12 h-12 rounded-full bg-ink ring-1 ring-gold/60">
                  <BubbleIcon className="w-6 h-6 text-mist" />
                  <span className="absolute top-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#3D3026]" style={{ background: GREEN }} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.15rem] leading-tight">{t.nigiTitle}</span>
                  <span className={`${badge} mt-1.5 bg-[#4cc27a]/15 text-[#7fdca3]`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} aria-hidden />
                    {t.instant}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-mist/70">{t.nigiSub}</span>
                  {/* A sample question drawn as the visitor's own chat bubble: shows at a glance that it is a chat you type into. */}
                  <span className="mt-2 inline-block max-w-full rounded-2xl rounded-tr-md bg-gold/90 px-3 py-1.5 text-[12.5px] font-medium leading-snug text-ink">{t.nigiExample}</span>
                </span>
              </span>
              <span className="mt-3.5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-4 text-[15px] font-semibold text-ink shadow-[0_8px_24px_-8px_rgba(201,160,89,0.6)] transition group-hover:brightness-105">
                {t.ask}
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          )}

          <div>
            {nigiOn && <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-mist/50">{t.otherTitle}</p>}
            <div className="divide-y divide-white/10 overflow-hidden rounded-2xl ring-1 ring-white/10">
              <a
                ref={(el) => {
                  if (!nigiOn) first.current = el;
                }}
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={row}
              >
                <span className="grid place-items-center flex-none w-9 h-9 rounded-full bg-[#075E54] text-white">
                  <WaIcon className="w-5 h-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[14px] font-semibold">WhatsApp</span>
                    {/* Only next to NIGI's "instant": alone it would just sound like a warning. */}
                    {nigiOn && (
                      <span className={`${badge} bg-gold/15 text-gold`}>
                        <ClockIcon className="w-3 h-3" />
                        {t.notInstant}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-mist/60">{t.waSub}</span>
                </span>
              </a>
              <a href={PHONE_HREF} onClick={onClose} className={row}>
                <span className="grid place-items-center flex-none w-9 h-9 rounded-full bg-white/10 text-gold">
                  <PhoneIcon className="w-[18px] h-[18px]" />
                </span>
                <span className="text-[14px] font-semibold">{t.call}</span>
                <span className="ml-auto text-[13px] tabular-nums text-mist/60">{PHONE_LABEL}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const NUDGE_SEEN = 'iw-nudge-seen';
const NUDGE_AFTER_MS = 8000;
const NUDGE_FOR_MS = 14000;

// Welcome bubble above "Help": once per visit (sessionStorage), after a few
// quiet seconds, only for visitors who have not opened NIGI yet, never over
// the cookie banner, the offer pop-up or the chat. Tapping it opens NIGI; it
// goes away by itself, with the X, or as soon as something else opens.
function Nudge({ t }: { t: DockStrings }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ bottom: number; arrow: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(NUDGE_SEEN) || sessionStorage.getItem('iw-nigi-opened') || JSON.parse(sessionStorage.getItem('iw-nigi') ?? '[]').length) return;
    } catch {
      return;
    }
    const html = document.documentElement;
    const busy = () => {
      let consent: string | null = 'x';
      try {
        consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      } catch {}
      return !consent || 'nigi' in html.dataset || 'offer' in html.dataset;
    };
    let quiet = 0;
    let shownAt = 0;
    const tick = window.setInterval(() => {
      if (shownAt) {
        if (busy() || Date.now() - shownAt > NUDGE_FOR_MS) {
          setShow(false);
          window.clearInterval(tick);
        }
        return;
      }
      quiet = busy() ? 0 : quiet + 1000;
      if (quiet < NUDGE_AFTER_MS) return;
      try {
        sessionStorage.setItem(NUDGE_SEEN, '1');
      } catch {}
      shownAt = Date.now();
      setShow(true);
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  // Sits just above the visible "Help" button, its arrow pointing at the icon.
  useLayoutEffect(() => {
    if (!show) return;
    const place = () => {
      const target = Array.from(document.querySelectorAll<HTMLElement>('[data-help]')).find((el) => el.offsetParent);
      const own = box.current?.getBoundingClientRect();
      if (!target || !own) return;
      const icon = (target.querySelector('span') ?? target).getBoundingClientRect();
      setPos({
        bottom: window.innerHeight - target.getBoundingClientRect().top + 12,
        arrow: Math.min(Math.max(icon.left + icon.width / 2 - own.left, 20), own.width - 20)
      });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [show]);

  if (!show) return null;
  return (
    <div
      ref={box}
      role="status"
      style={{ bottom: pos?.bottom ?? 80, visibility: pos ? 'visible' : 'hidden' }}
      className="fixed z-50 inset-x-3 mx-auto max-w-sm animate-fadeIn motion-reduce:animate-none sm:inset-x-auto sm:right-6 sm:mx-0 sm:w-[21rem]"
    >
      <div className="relative flex items-center gap-3 rounded-2xl bg-[#3D3026] text-mist ring-1 ring-gold/50 py-3 pl-3 pr-2 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          onClick={() => {
            setShow(false);
            nigi.open();
          }}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="relative grid place-items-center flex-none w-10 h-10 rounded-full bg-ink ring-1 ring-gold/60">
            <BubbleIcon className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#3D3026]" style={{ background: GREEN }} aria-hidden />
          </span>
          <span className="text-[13.5px] font-medium leading-snug">{t.nudge}</span>
        </button>
        <button type="button" onClick={() => setShow(false)} aria-label={t.nudgeClose} className="grid place-items-center flex-none w-8 h-8 rounded-full text-mist/60 hover:text-mist hover:bg-white/[0.08]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        {pos && (
          <span
            className="absolute -bottom-[7px] w-3.5 h-3.5 -translate-x-1/2 rotate-45 bg-[#3D3026] border-b border-r border-gold/50"
            style={{ left: pos.arrow }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

// A speech bubble: the owner found "NIGI" alone said nothing about a chat.
function BubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="3" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
