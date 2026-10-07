'use client';

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { nigi } from '@/lib/nigi';

// NIGI, the site's virtual assistant (free to run: Workers AI's daily allowance):
//   - a question goes to /api/chat, where the Worker asks Workers AI
//     (worker/chat.ts) and replies in the visitor's language.
// The owner switches it on and off in the admin: GET /api/chat says whether
// to show the button, so the static pages never need rebuilding.
// `?anteprima-nigi` (the admin's preview link) shows and opens it for the
// logged-in owner even while it is switched off.
// The conversation lives in sessionStorage: it follows the visitor from page
// to page and is gone when the tab closes. Nothing typed is stored server-side.
//
// Look: the same visual language as the offer pop-up (OfferPopup.tsx) — warm
// dark panel #3D3026, gold accents, Fraunces titles, pill buttons. It has no
// button of its own: it opens from the "Help" menu of the contact dock
// (FloatingDock.tsx), through src/lib/nigi.ts.

export type ChatStrings = {
  cta: string;
  subtitle: string;
  open: string;
  close: string;
  welcome: string;
  placeholder: string;
  send: string;
  typing: string;
  restart: string;
  errorBusy: string;
  errorLimit: string;
  errorRate: string;
  disclaimer: string;
};

type Msg = { role: 'user' | 'assistant'; content: string; kind?: 'ai' | 'error' };

const STORE_KEY = 'iw-nigi';
const OPENED_KEY = 'iw-nigi-opened';
const PREVIEW_PARAM = 'anteprima-nigi';
const WHATSAPP = '390342929285';
const MAX_INPUT = 500;
// Turns sent to the AI with each question (the Worker keeps at most 10 too).
const CONTEXT_TURNS = 10;
const PANEL = 'bg-[#3D3026]';

function load(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    const list = raw ? (JSON.parse(raw) as Msg[]) : [];
    return Array.isArray(list) ? list.filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') : [];
  } catch {
    return [];
  }
}

function save(list: Msg[]) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(list.slice(-40)));
  } catch {}
}

function beacon(kind: 'open', preview: boolean) {
  if (preview) return;
  try {
    navigator.sendBeacon(`/api/chat/evento?k=${kind}`);
  } catch {}
}

// Answers are plain text: **bold**, links to this site, e-mail addresses and
// the phone number become real elements (never HTML from the model; other
// web addresses stay plain text, so an invented link is never clickable).
// Their clicks are counted by the site-wide listener in OfferPopup.tsx, like
// every other contact link.
const TOKEN = /(\*\*[^*\n]+\*\*|https:\/\/(?:www\.)?ironwoodlivigno\.com[^\s<>()]*[^\s<>().,;:!?]|[\w.+-]+@[\w-]+\.[\w.-]*\w|\+39(?: ?\d){9,11})/g;
// The booking form's name in an answer (NIGI is told to call it as the
// page's button, hero.cta_primary, in quotes or not) becomes a link to it.
type FormLink = { name: string; href: string; onClick: () => void };
const LINK_CLS = 'text-mist underline underline-offset-[3px] decoration-gold/60 hover:decoration-gold break-words';
function rich(text: string, form: FormLink): ReactNode {
  const name = form.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const formRe = new RegExp(`([«„“"']?${name}[»“”"']?)`, 'i');
  return text.split(formRe).map((part, i) =>
    i % 2 === 0 ? (
      <Fragment key={i}>{richPart(part)}</Fragment>
    ) : (
      // Gold chip, as the site's other accents: the owner wanted it to stand out.
      <a
        key={i}
        href={form.href}
        onClick={form.onClick}
        data-form-link
        className="inline-block whitespace-nowrap rounded-full bg-gold/20 ring-1 ring-gold/70 text-gold font-semibold px-2.5 py-0.5 mx-0.5 leading-snug hover:bg-gold hover:text-[#3D3026] transition-colors"
      >
        {part.replace(/^[«„“"']|[»“”"']$/g, '')} →
      </a>
    )
  );
}

function richPart(text: string): ReactNode {
  const clean = text.replace(/^#{1,6}\s+/gm, '').replace(/^\s*[*-]\s+/gm, '• ');
  return clean.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    if (part.startsWith('**')) return <strong key={i} className="font-semibold text-mist">{part.slice(2, -2)}</strong>;
    const cls = LINK_CLS;
    if (part.startsWith('https://')) {
      return (
        <a key={i} href={part} className={cls}>
          {part.replace(/^https:\/\/(www\.)?/, '')}
        </a>
      );
    }
    if (part.includes('@')) {
      return (
        <a key={i} href={`mailto:${part}`} className={cls}>
          {part}
        </a>
      );
    }
    return (
      // Each number opens its own WhatsApp chat (e.g. the transfer service's,
      // not only the owners').
      <a key={i} href={`https://wa.me/${part.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={cls}>
        {part}
      </a>
    );
  });
}

export default function ChatWidget({
  locale,
  strings: s,
  whatsappLabel,
  whatsappText,
  bookLabel
}: {
  locale: string;
  strings: ChatStrings;
  whatsappLabel: string;
  whatsappText: string;
  bookLabel: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [preview, setPreview] = useState(false);
  // `open` mounts the panel, `shown` runs its entrance/exit transition.
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openChat = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  }, []);

  const closeChat = useCallback(() => {
    setShown(false);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      // Back to the visible "Help" button (the phone bar's or the computer's).
      requestAnimationFrame(() =>
        Array.from(document.querySelectorAll<HTMLElement>('[data-help]'))
          .find((el) => el.offsetParent)
          ?.focus()
      );
    }, 260);
  }, []);

  // Is the chat switched on? (Cached for a minute by the Worker.)
  useEffect(() => {
    const isPreview = new URLSearchParams(window.location.search).has(PREVIEW_PARAM);
    setPreview(isPreview);
    const restored = load();
    setMessages(restored);
    let cancelled = false;
    fetch(isPreview ? '/api/chat?preview=1' : '/api/chat', { credentials: 'same-origin' })
      .then((r) => (r.ok ? (r.json() as Promise<{ active?: boolean }>) : { active: false }))
      .then((d: { active?: boolean }) => {
        if (cancelled || !d.active) return;
        setEnabled(true);
        nigi.setEnabled(true);
        if (isPreview) openChat();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [openChat]);

  useEffect(() => nigi.onOpen(openChat), [openChat]);

  useEffect(() => {
    if (enabled) save(messages);
  }, [messages, enabled]);

  // Newest message in view; a fresh chat stays at the top, so the welcome
  // is what visitors read first.
  useLayoutEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = messages.length ? el.scrollHeight : 0;
  }, [messages, busy, open]);

  // The question box grows with the text, up to a few lines.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input, open]);

  // While open: count it once per visit, focus the question box on larger
  // screens (on phones the keyboard would cover the welcome), lock the page
  // scroll on phones where the chat is full-screen, Esc closes it, and the
  // offer pop-up knows not to open by itself on top of it.
  useEffect(() => {
    if (!open) return;
    document.documentElement.dataset.nigi = 'open';
    try {
      if (!sessionStorage.getItem(OPENED_KEY)) {
        sessionStorage.setItem(OPENED_KEY, '1');
        beacon('open', preview);
      }
    } catch {}
    const small = window.matchMedia('(max-width: 639px)').matches;
    if (!small) setTimeout(() => inputRef.current?.focus(), 80);
    const prevOverflow = document.body.style.overflow;
    if (small) document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeChat();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      delete document.documentElement.dataset.nigi;
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, preview, closeChat]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const q = input.trim().slice(0, MAX_INPUT);
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');
    setBusy(true);
    let reply: Msg;
    try {
      const history = next
        .filter((m) => m.kind !== 'error')
        .slice(-CONTEXT_TURNS)
        .map(({ role, content }) => ({ role, content }));
      const res = await fetch(preview ? '/api/chat?preview=1' : '/api/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        // The page's language: NIGI answers in it unless the visitor writes in another one.
        body: JSON.stringify({ messages: history, lang: locale })
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (data.reply) reply = { role: 'assistant', content: data.reply, kind: 'ai' };
      else if (data.error === 'limit') reply = { role: 'assistant', content: s.errorLimit, kind: 'error' };
      else if (data.error === 'busy' && res.status === 429) reply = { role: 'assistant', content: s.errorRate, kind: 'error' };
      // 'off' (switched off meanwhile), 'busy' (AI failed) or anything else:
      // the visitor keeps the open chat and gets the WhatsApp contact.
      else reply = { role: 'assistant', content: s.errorBusy, kind: 'error' };
    } catch {
      reply = { role: 'assistant', content: s.errorBusy, kind: 'error' };
    }
    setMessages((m) => [...m, reply]);
    setBusy(false);
  }

  function restart() {
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  }

  if (!enabled) return null;

  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;
  const fresh = messages.length === 0;

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="NIGI · Ironwood Livigno"
          className={`fixed z-[70] inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:max-h-[min(660px,calc(100dvh-3rem))] flex flex-col ${PANEL} text-mist sm:rounded-[1.75rem] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] sm:ring-1 sm:ring-white/10 origin-bottom-right transition-all duration-300 ease-out motion-reduce:transition-none ${
            shown ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-6 sm:scale-95'
          }`}
        >
          {/* Header: the apartment's living room as a photo band while the chat is
              new; once the conversation starts it folds into a compact bar. */}
          <header
            className={`relative flex-none transition-[height] duration-300 ease-out motion-reduce:transition-none ${
              fresh ? 'h-[calc(9.5rem+env(safe-area-inset-top))]' : 'h-[calc(4.25rem+env(safe-area-inset-top))]'
            }`}
          >
            <picture>
              <source type="image/avif" srcSet="/images/hero-ironwood-480.avif" />
              <img src="/images/hero-ironwood-480.webp" alt="" width={480} height={320} className="absolute inset-0 w-full h-full object-cover" />
            </picture>
            <div
              className={`absolute inset-0 transition-colors duration-300 ${
                fresh ? 'bg-gradient-to-t from-[#3D3026] via-[#3D3026]/70 to-[#3D3026]/10' : 'bg-[#3D3026]/90'
              }`}
              aria-hidden
            />
            {fresh ? (
              <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 px-5 pb-4">
                <span className="grid place-items-center flex-none w-12 h-12 rounded-full bg-ink/80 ring-1 ring-gold/60 backdrop-blur-sm">
                  <BrandMark className="w-6 h-6 text-mist" />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="flex items-center gap-2 text-gold tracking-[0.22em] uppercase text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4cc27a]" aria-hidden />
                    {s.subtitle}
                  </p>
                  <p className="font-display text-[1.7rem] mt-0.5">
                    NIGI <span className="font-body text-sm text-mist/70">· Ironwood Livigno</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-x-0 bottom-0 h-[4.25rem] flex items-center gap-3 pl-5 pr-28">
                <span className="grid place-items-center flex-none w-10 h-10 rounded-full bg-ink/80 ring-1 ring-gold/60">
                  <BrandMark className="w-5 h-5 text-mist" />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="font-display text-lg truncate">
                    NIGI <span className="font-body text-[13px] text-mist/70">· Ironwood Livigno</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-mist/60 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4cc27a]" aria-hidden />
                    {s.subtitle}
                  </p>
                </div>
              </div>
            )}
            <div className={`absolute right-4 flex gap-2 ${fresh ? 'top-[calc(1rem+env(safe-area-inset-top))]' : 'bottom-[1.03rem]'}`}>
              {!fresh && (
                <button
                  type="button"
                  onClick={restart}
                  aria-label={s.restart}
                  title={s.restart}
                  className="grid place-items-center w-9 h-9 rounded-full bg-ink/40 backdrop-blur-sm ring-1 ring-white/20 text-mist/90 hover:text-mist hover:ring-gold transition"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={closeChat}
                aria-label={s.close}
                title={s.close}
                className="grid place-items-center w-9 h-9 rounded-full bg-ink/40 backdrop-blur-sm ring-1 ring-gold/60 text-mist hover:bg-ink/70 hover:ring-gold transition"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </header>

          <div ref={listRef} className="flex-1 sm:flex-auto sm:min-h-[8rem] overflow-y-auto overscroll-contain px-5 pt-3 pb-4 space-y-3 [scrollbar-width:thin] [scrollbar-color:rgba(247,243,236,0.2)_transparent]" aria-live="polite">
            <Bubble role="assistant">{s.welcome}</Bubble>
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} error={m.kind === 'error'}>
                {m.role === 'assistant' ? rich(m.content, { name: bookLabel, href: `/${locale}#prenota`, onClick: closeChat }) : m.content}
                {m.kind === 'error' && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-fit items-center gap-2 rounded-full bg-gold text-ink text-[13px] font-semibold px-4 py-2 shadow-[0_8px_24px_-8px_rgba(201,160,89,0.6)] hover:brightness-105 transition no-underline"
                  >
                    <WaIcon className="w-4 h-4" /> {whatsappLabel}
                  </a>
                )}
              </Bubble>
            ))}
            {/* Under NIGI's latest answer: the two ways to actually book. WhatsApp
                opens with the visitor's last question already in the message. */}
            {!busy && messages.length > 0 && messages[messages.length - 1].kind === 'ai' && (
              <div className="flex flex-wrap gap-2 pl-9">
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`${whatsappText}

${[...messages].reverse().find((m) => m.role === 'user')?.content ?? ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#075E54] text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-[#054942] transition-colors"
                >
                  <WaIcon className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <a
                  href={`/${locale}#prenota`}
                  onClick={closeChat}
                  className="inline-flex items-center gap-1.5 rounded-full ring-1 ring-gold/60 text-gold text-[12px] font-semibold px-3 py-1.5 hover:bg-white/[0.06] hover:ring-gold transition"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                  {bookLabel}
                </a>
              </div>
            )}
            {busy && (
              <div className="flex justify-start pl-9" role="status" aria-label={s.typing}>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white/[0.07] ring-1 ring-white/10 px-4 py-3.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:-0.3s] motion-reduce:animate-none" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:-0.15s] motion-reduce:animate-none" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce motion-reduce:animate-none" />
                </div>
              </div>
            )}
          </div>

          <div className={`flex-none border-t border-white/10 ${PANEL} px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]`}>
            <form onSubmit={send} className="flex items-end gap-2">
              <label htmlFor="nigi-input" className="sr-only">
                {s.placeholder}
              </label>
              <textarea
                id="nigi-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_INPUT}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={s.placeholder}
                className="flex-1 resize-none rounded-[1.4rem] bg-white/[0.07] ring-1 ring-white/15 px-4 py-3 text-[16px] sm:text-[14px] leading-snug text-mist placeholder:text-mist/40 focus:outline-none focus:ring-gold/80 transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label={s.send}
                className="flex-none grid place-items-center w-12 h-12 rounded-full bg-gold text-ink shadow-[0_8px_24px_-8px_rgba(201,160,89,0.6)] hover:brightness-105 disabled:opacity-35 disabled:shadow-none transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <p className="text-[11px] leading-snug text-mist/50">{s.disclaimer}</p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none inline-flex items-center gap-1.5 rounded-full ring-1 ring-white/25 px-3 py-1.5 text-[11px] font-medium text-mist hover:ring-gold transition"
              >
                <WaIcon className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// One message. NIGI's carry its small mark on the left; each one fades in
// as it arrives (keys are stable, so only new messages animate).
function Bubble({ role, error, children }: { role: 'user' | 'assistant'; error?: boolean; children: ReactNode }) {
  const mine = role === 'user';
  return (
    <div className={`flex items-end gap-2 animate-fadeIn motion-reduce:animate-none ${mine ? 'justify-end' : 'justify-start'}`}>
      {!mine && (
        <span className="grid place-items-center flex-none w-7 h-7 rounded-full bg-ink ring-1 ring-gold/40 mb-0.5" aria-hidden>
          <BrandMark className="w-3.5 h-3.5 text-mist" />
        </span>
      )}
      <div
        className={
          'max-w-[82%] whitespace-pre-line break-words px-4 py-2.5 text-[14px] leading-relaxed ' +
          (mine
            ? 'bg-gold text-ink font-medium rounded-2xl rounded-tr-md'
            : `bg-white/[0.07] text-mist/90 rounded-2xl rounded-tl-md ring-1 ${error ? 'ring-brick/60' : 'ring-white/10'}`)
        }
      >
        {children}
      </div>
    </div>
  );
}

// The Ironwood roofline mark with its gold dot (same drawing as Logo.tsx).
function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 110" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="46" r="7" fill="#C9A059" />
      <polyline
        points="24,60 46,26 66,50 94,10 118,60 118,96 20,96 20,64"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
