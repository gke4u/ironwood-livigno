'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { nigi, useNigiEnabled } from '@/lib/nigi';
import AssistantLogo from './AssistantLogo';

// The site's contact corner, the way the owner liked it on guanafoto.com
// (15 October 2026; before, a round launcher opened NIGI straight away):
//   - A white "Help" capsule in the bottom-right corner, with the assistant's
//     mark and "instant answer, any time".
//   - It opens a small panel, "How can we help?", with the three ways
//     explained: NIGI first and big ("Recommended", instant answer), then
//     WhatsApp (not instant: the owners answer when they can), the phone and
//     the request form. With only logos side by side visitors didn't know
//     which one to tap.
//   - A welcome bubble above the capsule, once per visit, that opens NIGI.
//   - No booking bar at the bottom of phones (the owner removed it on
//     14 October 2026). Only while NIGI is switched on.
// While NIGI's chat is open the capsule steps aside (globals.css,
// html[data-nigi]).

const LAUNCHER_ID = 'iw-launcher';
const WHATSAPP = '390342929285';
const PHONE_HREF = 'tel:+390342929285';
const PHONE_LABEL = '+39 0342 929285';

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

export default function FloatingDock({ strings: t, locale, whatsappText }: { strings: DockStrings; locale: string; whatsappText: string }) {
  const nigiOn = useNigiEnabled();
  const [menu, setMenu] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);

  if (!nigiOn) return null;

  return (
    <>
      {menu && <HelpMenu t={t} locale={locale} whatsappText={whatsappText} onClose={closeMenu} />}
      {!menu && <Nudge t={t} />}
      <button
        id={LAUNCHER_ID}
        type="button"
        data-help
        onClick={() => setMenu((on) => !on)}
        aria-expanded={menu}
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

// The "Help" panel. NIGI is the main choice (big box, "Recommended",
// instant answer at any hour); under it, smaller, WhatsApp (not instant),
// the phone and the request form. On phones it rises from the bottom over a
// light veil; on computers it opens above the capsule. Esc or a tap outside
// closes it.
function HelpMenu({ t, locale, whatsappText, onClose }: { t: DockStrings; locale: string; whatsappText: string; onClose: () => void }) {
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const badge = 'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em]';
  const row = 'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-ink/[0.03] active:bg-ink/[0.05]';
  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <>
      <button type="button" aria-label={t.close} tabIndex={-1} onClick={onClose} className="iw-fade-in fixed inset-0 z-[62] cursor-default bg-ink/25 sm:bg-transparent" />
      <div
        role="dialog"
        aria-label={t.menuTitle}
        className="iw-sheet-in fixed inset-x-3 bottom-[calc(5.4rem+env(safe-area-inset-bottom))] z-[63] mx-auto max-w-md overflow-hidden rounded-2xl border border-ink/10 bg-white font-body shadow-[0_24px_60px_-18px_rgba(36,28,21,0.5)] sm:inset-x-auto sm:right-6 sm:bottom-[6.6rem] sm:mx-0 sm:w-[23rem]"
      >
        <div className="flex items-center justify-between px-4 pb-1 pt-3">
          <p className="font-display text-[17px] text-ink">{t.menuTitle}</p>
          <button type="button" onClick={onClose} aria-label={t.close} className="grid h-8 w-8 place-items-center rounded-full text-ink/50 hover:bg-ink/5 hover:text-ink">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-3 p-3 pt-2">
          <button
            ref={first}
            type="button"
            onClick={() => {
              onClose();
              nigi.open();
            }}
            className="group relative block w-full rounded-2xl border-2 border-gold bg-gradient-to-b from-cream/60 to-white px-4 pb-4 pt-7 text-left shadow-[0_14px_30px_-18px_rgba(201,160,89,0.9)] transition-transform active:scale-[0.99]"
          >
            <span className="absolute -top-px right-4 rounded-b-lg bg-gold px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink">{t.recommended}</span>
            <span className="flex items-center gap-3.5">
              <AssistantLogo size={56} appear />
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[18px] leading-tight text-ink">{t.assistantTitle}</span>
                <span className={`${badge} mt-1.5 bg-[#4cc27a]/15 text-[#1f7a45]`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4cc27a]" aria-hidden />
                  {t.assistantBadge}
                </span>
                <span className="mt-1 block text-[12.5px] leading-snug text-ink/65">{t.assistantSub}</span>
              </span>
            </span>
            <span className="mt-3.5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 text-[15px] font-semibold text-mist transition-colors group-hover:bg-wood">
              {t.askButton}
              <ArrowIcon />
            </span>
          </button>

          <div>
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/45">{t.otherTitle}</p>
            <div className="divide-y divide-ink/[0.07] overflow-hidden rounded-xl border border-ink/10">
              <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={onClose} className={row}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
                  <WaIcon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[14px] font-semibold text-ink">WhatsApp</span>
                    <span className={`${badge} bg-gold/20 text-wood`}>
                      <ClockIcon />
                      {t.waBadge}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-ink/55">{t.waSub}</span>
                </span>
              </a>
              <a href={PHONE_HREF} onClick={onClose} className={row}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-wood">
                  <PhoneIcon />
                </span>
                <span className="text-[14px] font-semibold text-ink">{t.callShort}</span>
                <span className="text-[13px] tabular-nums text-ink/55">{PHONE_LABEL}</span>
              </a>
              <a href={`/${locale}#prenota`} onClick={onClose} className={row}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-wood">
                  <CalendarIcon />
                </span>
                <span className="text-[14px] font-semibold text-ink">{t.requestShort}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
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

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
