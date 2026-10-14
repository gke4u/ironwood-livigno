'use client';

import { useEffect, useRef, useState } from 'react';
import { nigi, useNigiEnabled } from '@/lib/nigi';
import { COOKIE_CONSENT_KEY } from './CookieConsent';

// The site's contact corner, laid out the way hotel and booking sites do it:
//   - One round button in the bottom-right corner (the launcher, with the
//     Ironwood mark). It opens a small panel with the ways to reach us, as
//     equal rows: chat with NIGI (only while switched on, instant answer)
//     and WhatsApp.
//   - A welcome bubble above it, once per visit, with ready buttons (a first
//     question for NIGI, WhatsApp): visitors rarely open a chat by themselves,
//     but they answer a greeting.
//   - Phones also keep a gold booking bar along the bottom. The body gets the
//     same padding at the bottom (globals.css). On computers the nav already
//     has the booking button.
//   - The phone number is on the contact page; the special offer has its own
//     strip at the top of the page (OfferPopup.tsx).
// While NIGI's chat is open the dock and the launcher step aside
// (globals.css, html[data-nigi]).

export const DOCK_ID = 'iw-dock';
const LAUNCHER_ID = 'iw-launcher';

export type DockStrings = {
  aria: string;
  book: string;
  menuTitle: string;
  close: string;
  nigiTitle: string;
  instant: string;
  waSub: string;
  nudge: string;
  nudgeClose: string;
};

const GREEN = '#4cc27a';

export default function FloatingDock({
  strings: t,
  whatsappHref,
  bookHref,
  firstQuestion
}: {
  strings: DockStrings;
  whatsappHref: string;
  bookHref: string;
  firstQuestion: string;
}) {
  const nigiOn = useNigiEnabled();
  const [panel, setPanel] = useState(false);

  return (
    <>
      {panel && <ContactPanel t={t} nigiOn={nigiOn} whatsappHref={whatsappHref} onClose={() => setPanel(false)} />}
      {nigiOn && !panel && <Nudge t={t} whatsappHref={whatsappHref} firstQuestion={firstQuestion} />}

      {/* The launcher: above the phone bar, in the corner on computers. */}
      <button
        id={LAUNCHER_ID}
        type="button"
        data-help
        onClick={() => setPanel((on) => !on)}
        aria-expanded={panel}
        aria-haspopup="dialog"
        aria-label={panel ? t.close : t.menuTitle}
        className="fixed z-[61] right-4 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] grid place-items-center w-14 h-14 rounded-full bg-[#3D3026] text-mist ring-2 ring-gold shadow-[0_14px_34px_-10px_rgba(0,0,0,0.6)] transition hover:scale-105 motion-reduce:hover:scale-100 sm:right-6 sm:bottom-6 sm:w-16 sm:h-16"
      >
        {panel ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <>
            <BrandMark className="w-7 h-7 sm:w-8 sm:h-8" />
            {nigiOn && <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-[#3D3026]" style={{ background: GREEN }} aria-hidden />}
          </>
        )}
      </button>

      <nav
        id={DOCK_ID}
        aria-label={t.aria}
        className="fixed z-50 inset-x-0 bottom-0 bg-gold pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-12px_rgba(0,0,0,0.45)] sm:hidden"
      >
        <a href={bookHref} className="flex items-center justify-center gap-2 h-14 text-ink text-[15px] font-semibold hover:brightness-105 transition">
          <CalendarIcon className="w-[18px] h-[18px]" />
          {t.book}
        </a>
      </nav>
    </>
  );
}

// The panel the launcher opens: the ways to reach us, as equal rows (NIGI, WhatsApp). On
// phones it rises above the launcher (page dimmed behind it), on larger
// screens it sits over the corner. Esc or a tap outside closes it.
function ContactPanel({ t, nigiOn, whatsappHref, onClose }: { t: DockStrings; nigiOn: boolean; whatsappHref: string; onClose: () => void }) {
  const first = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const row = 'flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.06]';
  const icon = 'relative grid place-items-center flex-none w-11 h-11 rounded-full';
  const title = 'block text-[15px] font-semibold leading-tight';
  const sub = 'mt-0.5 block text-[12.5px] leading-snug text-mist/60';
  const setFirst = (el: HTMLButtonElement | HTMLAnchorElement | null) => {
    if (el && !first.current) first.current = el;
  };

  return (
    <>
      <button type="button" aria-label={t.close} tabIndex={-1} onClick={onClose} className="fixed inset-0 z-[55] cursor-default bg-black/45 sm:bg-transparent animate-fadeIn motion-reduce:animate-none" />
      <div
        role="dialog"
        aria-label={t.menuTitle}
        className="fixed z-[60] inset-x-3 bottom-[calc(8.25rem+env(safe-area-inset-bottom))] mx-auto max-w-md overflow-hidden rounded-[1.5rem] bg-[#3D3026] text-mist ring-1 ring-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] animate-fadeIn motion-reduce:animate-none sm:inset-x-auto sm:right-6 sm:bottom-[6.25rem] sm:mx-0 sm:w-[22rem]"
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/10">
          <span className="grid place-items-center flex-none w-10 h-10 rounded-full bg-ink ring-1 ring-gold/60">
            <BrandMark className="w-5 h-5" />
          </span>
          <p className="font-display text-xl leading-tight">{t.menuTitle}</p>
        </div>

        <div className="divide-y divide-white/10">
          {nigiOn && (
            <button
              ref={setFirst}
              type="button"
              onClick={() => {
                onClose();
                nigi.open();
              }}
              className={row}
            >
              <span className={`${icon} bg-gold text-ink`}>
                <BubbleIcon className="w-5 h-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={title}>{t.nigiTitle}</span>
                <span className={`${sub} flex items-center gap-1.5 !text-[#7fdca3]`}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} aria-hidden />
                  {t.instant}
                </span>
              </span>
            </button>
          )}
          <a ref={setFirst} href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={onClose} className={row}>
            <span className={`${icon} bg-[#25D366] text-white`}>
              <WaIcon className="w-6 h-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={title}>WhatsApp</span>
              <span className={sub}>{t.waSub}</span>
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

const NUDGE_SEEN = 'iw-nudge-seen';
const NUDGE_AFTER_MS = 8000;
const NUDGE_FOR_MS = 20000;

// Welcome bubble above the launcher: once per visit (sessionStorage), after a
// few quiet seconds, only for visitors who have not opened NIGI yet, never
// over the cookie banner, the offer pop-up or the chat. Two ready buttons: a
// first question (opens NIGI and asks it) and WhatsApp. It goes away by
// itself, with the X, or as soon as something else opens.
function Nudge({ t, whatsappHref, firstQuestion }: { t: DockStrings; whatsappHref: string; firstQuestion: string }) {
  const [show, setShow] = useState(false);

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

  if (!show) return null;
  const chip = 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition';
  return (
    <div
      role="status"
      className="fixed z-50 right-4 left-4 bottom-[calc(8.25rem+env(safe-area-inset-bottom))] ml-auto max-w-[20rem] animate-fadeIn motion-reduce:animate-none sm:left-auto sm:right-6 sm:bottom-[6.25rem]"
    >
      <div className="relative rounded-2xl bg-[#3D3026] text-mist ring-1 ring-gold/50 p-4 pr-10 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.6)]">
        <p className="text-[14px] font-medium leading-snug">{t.nudge}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setShow(false);
              nigi.open(firstQuestion);
            }}
            className={`${chip} bg-gold text-ink hover:brightness-105`}
          >
            {firstQuestion}
          </button>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => setShow(false)} className={`${chip} bg-[#075E54] text-white hover:bg-[#054942]`}>
            <WaIcon className="w-4 h-4" /> WhatsApp
          </a>
        </div>
        <button type="button" onClick={() => setShow(false)} aria-label={t.nudgeClose} className="absolute top-2 right-2 grid place-items-center w-8 h-8 rounded-full text-mist/60 hover:text-mist hover:bg-white/[0.08]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        {/* Points down at the launcher. */}
        <span className="absolute -bottom-[7px] right-6 w-3.5 h-3.5 rotate-45 bg-[#3D3026] border-b border-r border-gold/50 sm:right-[1.6rem]" aria-hidden />
      </div>
    </div>
  );
}

// The Ironwood roofline mark with its gold dot (same drawing as Logo.tsx).
function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 110" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="46" r="7" fill="#C9A059" />
      <polyline points="24,60 46,26 66,50 94,10 118,60 118,96 20,96 20,64" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
