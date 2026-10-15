'use client';

import { useEffect, useState } from 'react';
import { nigi, useNigiEnabled } from '@/lib/nigi';
import BrandBadge from './BrandBadge';

// The site's contact corner (15 October 2026): the round launcher in the
// bottom-right corner that opens NIGI's chat straight away (no menu: the
// owner wanted it plain, like a WhatsApp chat; WhatsApp itself is a small
// icon in the chat's header), and a welcome bubble above it once per visit.
// Only while NIGI is switched on. While the chat is open the launcher steps
// aside (globals.css, html[data-nigi]).

const LAUNCHER_ID = 'iw-launcher';

export type DockStrings = {
  nigiTitle: string;
  nudge: string;
  nudgeClose: string;
  help: string;
  capsuleSub: string;
  menuTitle: string;
  close: string;
  recommended: string;
  assistantTitle: string;
  assistantBadge: string;
  assistantSub: string;
  askButton: string;
  otherTitle: string;
  waBadge: string;
  waSub: string;
  callShort: string;
  requestShort: string;
};

export default function FloatingDock({ strings: t, label, sub }: { strings: DockStrings; label: string; sub: string; locale?: string; whatsappText?: string }) {
  const nigiOn = useNigiEnabled();

  if (!nigiOn) return null;

  return (
    <>
      <Nudge t={t} />
      {/* The round launcher, as on 14 October (the owner's favourite): dark
          disc, gold ring pulsing out of it, a green "online" dot. Still for
          visitors who ask for reduced motion. */}
      <button
        id={LAUNCHER_ID}
        type="button"
        data-help
        onClick={() => nigi.open()}
        aria-haspopup="dialog"
        aria-label={t.nigiTitle}
        title={t.nigiTitle}
        className="group fixed z-[61] right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] flex items-center gap-2.5 sm:right-6 sm:bottom-6"
      >
        {/* "Chat with us", always in view: the round mark alone did not say it is a chat (owner, 15 October 2026). */}
        <span className="iw-label-in relative rounded-2xl bg-white py-2 pl-4 pr-4 text-left shadow-[0_14px_34px_-12px_rgba(36,28,21,0.55)] ring-1 ring-gold/40 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:group-hover:translate-x-0">
          <span className="block font-display text-[16px] leading-tight text-ink sm:text-[17px]">{label}</span>
          <span className="mt-0.5 flex items-center gap-1.5 font-body text-[11px] font-medium leading-none text-ink/55">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-[#4cc27a] animate-ping motion-reduce:hidden" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#4cc27a]" />
            </span>
            {sub}
          </span>
          {/* Small tail towards the round mark, like a speech bubble. */}
          <span className="absolute -right-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-r border-t border-gold/40 bg-white" aria-hidden />
        </span>
        <span className="relative grid place-items-center w-14 h-14 rounded-full bg-[#3D3026] text-mist ring-2 ring-gold shadow-[0_14px_34px_-10px_rgba(0,0,0,0.6)] transition group-hover:scale-105 motion-reduce:group-hover:scale-100 sm:w-16 sm:h-16">
        <span className="absolute inset-0 rounded-full ring-2 ring-gold animate-ping motion-reduce:hidden" aria-hidden />
        <svg viewBox="0 0 120 110" fill="none" className="relative w-7 h-7 sm:w-8 sm:h-8" aria-hidden>
          <circle cx="10" cy="46" r="7" fill="#C9A059" />
          <polyline points="24,60 46,26 66,50 94,10 118,60 118,96 20,96 20,64" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#4cc27a] ring-2 ring-[#3D3026] animate-pulse motion-reduce:animate-none" aria-hidden />
        </span>
      </button>
    </>
  );
}

const NUDGE_SEEN = 'iw-nudge-seen';
// Same timing as guanafoto.com: shows after ~6 s, goes away after ~15 s.
const NUDGE_AFTER_MS = 6000;
const NUDGE_FOR_MS = 15000;

// Welcome bubble above the launcher: once per visit (sessionStorage), after a
// few quiet seconds, only for visitors who have not opened NIGI yet, never
// over the offer pop-up or the chat. Tapping it opens NIGI. (It used to wait
// for the cookie banner's answer too, but that banner is not on the site, so
// for most visitors the bubble never appeared: fixed 15 October 2026.)
// It goes away by itself, with the X, or as soon as something else opens.
function Nudge({ t }: { t: DockStrings }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(NUDGE_SEEN) || sessionStorage.getItem('iw-nigi-opened') || JSON.parse(sessionStorage.getItem('iw-nigi') ?? '[]').length) return;
    } catch {
      return;
    }
    const html = document.documentElement;
    const busy = () => 'nigi' in html.dataset || 'offer' in html.dataset;
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
  return (
    <div role="status" className="iw-sheet-in fixed z-50 right-4 left-4 bottom-[calc(5.4rem+env(safe-area-inset-bottom))] ml-auto max-w-[22rem] font-body sm:left-auto sm:right-6 sm:bottom-[6.4rem]">
      <div className="relative flex items-center gap-3 rounded-2xl border border-ink/10 bg-white py-3 pl-3 pr-2 shadow-[0_18px_44px_-14px_rgba(36,28,21,0.5)]">
        <button
          type="button"
          onClick={() => {
            setShow(false);
            nigi.open();
          }}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <BrandBadge size={36} />
          <span className="text-[13.5px] font-medium leading-snug text-ink">{t.nudge}</span>
        </button>
        <button type="button" onClick={() => setShow(false)} aria-label={t.nudgeClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/45 hover:bg-ink/5 hover:text-ink">
          <CloseIcon />
        </button>
        {/* Points down at the launcher. */}
        <span className="absolute -bottom-[7px] right-[2.4rem] h-3.5 w-3.5 rotate-45 border-b border-r border-ink/10 bg-white sm:right-[3.05rem]" aria-hidden />
      </div>
    </div>
  );
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
