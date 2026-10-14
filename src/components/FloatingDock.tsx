'use client';

import { useEffect, useState } from 'react';
import { nigi, useNigiEnabled } from '@/lib/nigi';
import { COOKIE_CONSENT_KEY } from './CookieConsent';

// The site's contact corner, laid out the way hotel and booking sites do it:
//   - One round button in the bottom-right corner (the launcher, with the
//     Ironwood mark and a pulsing gold ring) that opens NIGI's chat in one
//     tap. Only while NIGI is switched on.
//   - A welcome bubble above it, once per visit, with a ready first question:
//     visitors rarely open a chat by themselves, but they answer a greeting.
//   - WhatsApp is not out here: the owner wants it inside the chat (its
//     footer and under each answer), in the request form and on the contact
//     page. The phone number is on the contact page; the special offer has
//     its own strip at the top of the page (OfferPopup.tsx).
//   - Phones also keep a gold booking bar along the bottom. The body gets the
//     same padding at the bottom (globals.css). On computers the nav already
//     has the booking button.
// While NIGI's chat is open the dock and the launcher step aside
// (globals.css, html[data-nigi]).

export const DOCK_ID = 'iw-dock';
const LAUNCHER_ID = 'iw-launcher';

export type DockStrings = {
  aria: string;
  book: string;
  nigiTitle: string;
  nudge: string;
  nudgeClose: string;
};

const GREEN = '#4cc27a';

export default function FloatingDock({ strings: t, bookHref, firstQuestion }: { strings: DockStrings; bookHref: string; firstQuestion: string }) {
  const nigiOn = useNigiEnabled();

  return (
    <>
      {nigiOn && (
        <>
          <Nudge t={t} firstQuestion={firstQuestion} />
          {/* The launcher: above the phone bar, in the corner on computers.
              The gold ring pulsing out of it draws the eye (the owner's
              request); still for visitors who ask for reduced motion. */}
          <button
            id={LAUNCHER_ID}
            type="button"
            data-help
            onClick={() => nigi.open()}
            aria-label={t.nigiTitle}
            title={t.nigiTitle}
            className="fixed z-[61] right-4 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] grid place-items-center w-14 h-14 rounded-full bg-[#3D3026] text-mist ring-2 ring-gold shadow-[0_14px_34px_-10px_rgba(0,0,0,0.6)] transition hover:scale-105 motion-reduce:hover:scale-100 sm:right-6 sm:bottom-6 sm:w-16 sm:h-16"
          >
            <span className="absolute inset-0 rounded-full ring-2 ring-gold animate-ping motion-reduce:hidden" aria-hidden />
            <BrandMark className="relative w-7 h-7 sm:w-8 sm:h-8" />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-[#3D3026] animate-pulse motion-reduce:animate-none" style={{ background: GREEN }} aria-hidden />
          </button>
        </>
      )}

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

const NUDGE_SEEN = 'iw-nudge-seen';
const NUDGE_AFTER_MS = 8000;
const NUDGE_FOR_MS = 20000;

// Welcome bubble above the launcher: once per visit (sessionStorage), after a
// few quiet seconds, only for visitors who have not opened NIGI yet, never
// over the cookie banner, the offer pop-up or the chat. A ready first question
// opens NIGI and asks it. It goes away by itself, with the X, or as soon as
// something else opens.
function Nudge({ t, firstQuestion }: { t: DockStrings; firstQuestion: string }) {
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
