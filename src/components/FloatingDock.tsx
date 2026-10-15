'use client';

import { useEffect, useState } from 'react';
import { nigi, useNigiEnabled } from '@/lib/nigi';
import AssistantLogo from './AssistantLogo';

// The site's contact corner (15 October 2026): a white "Help" capsule in the
// bottom-right corner that opens NIGI's chat straight away (no menu: the
// owner wanted it plain, like a WhatsApp chat; WhatsApp itself is a small
// icon in the chat's header), and a welcome bubble above it once per visit.
// Only while NIGI is switched on. While the chat is open the capsule steps
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

export default function FloatingDock({ strings: t }: { strings: DockStrings; locale?: string; whatsappText?: string }) {
  const nigiOn = useNigiEnabled();

  if (!nigiOn) return null;

  return (
    <>
      <Nudge t={t} />
      <button
        id={LAUNCHER_ID}
        type="button"
        data-help
        onClick={() => nigi.open()}
        aria-haspopup="dialog"
        title={t.nigiTitle}
        className="group fixed z-[61] right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/95 py-1.5 pl-1.5 pr-5 text-left shadow-[0_18px_44px_-16px_rgba(36,28,21,0.55)] backdrop-blur transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-16px_rgba(36,28,21,0.6)] motion-reduce:hover:translate-y-0 sm:right-6 sm:bottom-6 sm:gap-3 sm:py-2 sm:pl-2 sm:pr-6"
      >
        <span className="flex h-10 w-10 items-center justify-center transition-transform group-hover:-rotate-3 group-hover:scale-105 sm:h-11 sm:w-11">
          <AssistantLogo size={44} appear />
        </span>
        <span className="leading-tight">
          <span className="block font-body text-[13.5px] font-semibold text-ink">{t.help}</span>
          <span className="block font-body text-[11.5px] text-ink/55">{t.capsuleSub}</span>
        </span>
      </button>
    </>
  );
}

const NUDGE_SEEN = 'iw-nudge-seen';
// Same timing as guanafoto.com: shows after ~6 s, goes away after ~15 s.
const NUDGE_AFTER_MS = 6000;
const NUDGE_FOR_MS = 15000;

// Welcome bubble above the capsule: once per visit (sessionStorage), after a
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
          <AssistantLogo size={38} appear />
          <span className="text-[13.5px] font-medium leading-snug text-ink">{t.nudge}</span>
        </button>
        <button type="button" onClick={() => setShow(false)} aria-label={t.nudgeClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/45 hover:bg-ink/5 hover:text-ink">
          <CloseIcon />
        </button>
        {/* Points down at the capsule's mark. */}
        <span className="absolute -bottom-[7px] right-[2.4rem] h-3.5 w-3.5 rotate-45 border-b border-r border-ink/10 bg-white sm:right-[2.6rem]" aria-hidden />
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
