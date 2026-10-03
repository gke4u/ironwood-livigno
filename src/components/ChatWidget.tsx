'use client';

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

// NIGI, the site's virtual assistant. Hybrid, so it costs nothing to run:
//   - the FAQ buttons answer instantly from the site's own translated FAQ
//     (passed in by ChatWidgetServer), with no request at all;
//   - a typed question goes to /api/chat, where the Worker asks Workers AI
//     (worker/chat.ts) and replies in the visitor's language.
// The owner switches it on and off in the admin: GET /api/chat says whether
// to show the button, so the static pages never need rebuilding.
// `?anteprima-nigi` (the admin's preview link) shows and opens it for the
// logged-in owner even while it is switched off.
// The conversation lives in sessionStorage: it follows the visitor from page
// to page and is gone when the tab closes. Nothing typed is stored server-side.

export type ChatStrings = {
  subtitle: string;
  open: string;
  close: string;
  welcome: string;
  placeholder: string;
  send: string;
  faqTitle: string;
  showFaq: string;
  moreFaq: string;
  typing: string;
  restart: string;
  errorBusy: string;
  errorLimit: string;
  errorRate: string;
  disclaimer: string;
};

type Faq = { q: string; a: string };
type Msg = { role: 'user' | 'assistant'; content: string; kind?: 'faq' | 'ai' | 'error' };

const STORE_KEY = 'iw-nigi';
const OPENED_KEY = 'iw-nigi-opened';
const PREVIEW_PARAM = 'anteprima-nigi';
const WHATSAPP = '390342929285';
const MAX_INPUT = 500;
// FAQ buttons shown before "More questions" (the full list is 14).
const FIRST_FAQ = 6;
// Turns sent to the AI with each question (the Worker keeps at most 10 too).
const CONTEXT_TURNS = 10;

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

function beacon(kind: 'open' | 'faq', preview: boolean) {
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
function rich(text: string): ReactNode {
  const clean = text.replace(/^#{1,6}\s+/gm, '').replace(/^\s*[*-]\s+/gm, '• ');
  return clean.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const cls = 'underline underline-offset-2 decoration-wood/40 hover:decoration-wood break-words';
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
      <a key={i} href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className={cls}>
        {part}
      </a>
    );
  });
}

export default function ChatWidget({
  strings: s,
  faq,
  whatsappLabel,
  whatsappText
}: {
  strings: ChatStrings;
  faq: Faq[];
  whatsappLabel: string;
  whatsappText: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [preview, setPreview] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showFaq, setShowFaq] = useState(true);
  const [allFaq, setAllFaq] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Is the chat switched on? (Cached for a minute by the Worker.)
  useEffect(() => {
    const isPreview = new URLSearchParams(window.location.search).has(PREVIEW_PARAM);
    setPreview(isPreview);
    const restored = load();
    setMessages(restored);
    setShowFaq(!restored.some((m) => m.role === 'user'));
    let cancelled = false;
    fetch(isPreview ? '/api/chat?preview=1' : '/api/chat', { credentials: 'same-origin' })
      .then((r) => (r.ok ? (r.json() as Promise<{ active?: boolean }>) : { active: false }))
      .then((d: { active?: boolean }) => {
        if (cancelled || !d.active) return;
        setEnabled(true);
        if (isPreview) setOpen(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (enabled) save(messages);
  }, [messages, enabled]);

  // Newest message in view; a fresh chat stays at the top, so the welcome
  // is what visitors read first.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = messages.length ? el.scrollHeight : 0;
  }, [messages, busy, open, showFaq]);

  // Opening: count it once per visit, focus the input on larger screens
  // (on phones the keyboard would cover the welcome), lock the page scroll
  // on phones where the chat is full-screen. Esc closes it.
  useEffect(() => {
    if (!open) return;
    // Tells the offer pop-up not to open by itself over the conversation.
    document.documentElement.dataset.nigi = 'open';
    try {
      if (!sessionStorage.getItem(OPENED_KEY)) {
        sessionStorage.setItem(OPENED_KEY, '1');
        beacon('open', preview);
      }
    } catch {}
    const small = window.matchMedia('(max-width: 639px)').matches;
    if (!small) inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    if (small) document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      delete document.documentElement.dataset.nigi;
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  function askFaq(item: Faq) {
    setMessages((m) => [...m, { role: 'user', content: item.q }, { role: 'assistant', content: item.a, kind: 'faq' }]);
    setShowFaq(false);
    beacon('faq', preview);
  }

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const q = input.trim().slice(0, MAX_INPUT);
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');
    setShowFaq(false);
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
        body: JSON.stringify({ messages: history })
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
    setShowFaq(true);
    setInput('');
    inputRef.current?.focus();
  }

  if (!enabled) return null;

  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={s.open}
          title={s.open}
          className="group fixed right-6 bottom-[7.25rem] z-50 flex items-center gap-2 rounded-full bg-white pl-1 pr-1 sm:pr-4 py-1 shadow-soft ring-1 ring-gold/60 hover:ring-gold transition"
        >
          <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-ink text-mist">
            <BrandMark className="w-7 h-7" />
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#2f9e57] ring-2 ring-white" aria-hidden />
          </span>
          <span className="hidden sm:block text-left leading-tight">
            <span className="block text-[13px] font-semibold text-ink">NIGI</span>
            <span className="block text-[11px] text-wood/80">{s.subtitle}</span>
          </span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={`NIGI · Ironwood Livigno`}
          className="fixed z-[70] inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[390px] sm:h-[min(640px,calc(100dvh-3rem))] flex flex-col bg-mist sm:rounded-2xl shadow-soft overflow-hidden ring-1 ring-black/5 animate-fadeIn"
        >
          <header className="flex items-center gap-3 bg-ink text-mist px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-mist/10 ring-1 ring-mist/20 text-mist flex-none">
              <BrandMark className="w-6 h-6" />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="font-display text-lg">
                NIGI <span className="text-[13px] font-body text-gold">· Ironwood Livigno</span>
              </p>
              <p className="text-[12px] text-mist/70 truncate">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4cc27a] mr-1.5 align-middle" aria-hidden />
                {s.subtitle}
              </p>
            </div>
            {messages.length > 0 && (
              <button type="button" onClick={restart} aria-label={s.restart} title={s.restart} className="p-2 rounded-full text-mist/80 hover:text-mist hover:bg-white/10 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v5h5" />
                </svg>
              </button>
            )}
            <button type="button" onClick={close} aria-label={s.close} title={s.close} className="p-2 rounded-full text-mist/80 hover:text-mist hover:bg-white/10 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3" aria-live="polite">
            <Bubble role="assistant">{s.welcome}</Bubble>
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} error={m.kind === 'error'}>
                {m.role === 'assistant' ? rich(m.content) : m.content}
                {m.kind === 'error' && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                   
                    className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-[#075E54] text-white text-xs font-medium px-3 py-1.5 hover:bg-[#054942] transition-colors no-underline"
                  >
                    <WaIcon /> {whatsappLabel}
                  </a>
                )}
              </Bubble>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-wood/70" role="status">
                <span className="flex gap-1" aria-hidden>
                  <span className="w-1.5 h-1.5 rounded-full bg-wood/50 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-wood/50 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-wood/50 animate-bounce" />
                </span>
                {s.typing}
              </div>
            )}
            {showFaq && (
              <div className="pt-1">
                <p className="text-[11px] uppercase tracking-[0.14em] text-wood/70 mb-2">{s.faqTitle}</p>
                <div className="flex flex-wrap gap-2">
                  {(allFaq ? faq : faq.slice(0, FIRST_FAQ)).map((item) => (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => askFaq(item)}
                      className="text-left text-[13px] leading-snug rounded-2xl border border-wood/20 bg-white px-3 py-2 text-ink hover:border-gold hover:bg-cream/40 transition"
                    >
                      {item.q}
                    </button>
                  ))}
                  {!allFaq && faq.length > FIRST_FAQ && (
                    <button
                      type="button"
                      onClick={() => setAllFaq(true)}
                      className="text-[13px] rounded-2xl px-3 py-2 font-medium text-wood hover:text-ink underline underline-offset-2 decoration-wood/30"
                    >
                      {s.moreFaq} (+{faq.length - FIRST_FAQ})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-black/5 bg-white px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {!showFaq && (
              <button type="button" onClick={() => setShowFaq(true)} className="mb-2 inline-flex items-center gap-1 text-[12px] text-wood hover:text-ink transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01" />
                </svg>
                {s.showFaq}
              </button>
            )}
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
                className="flex-1 resize-none max-h-28 rounded-xl border border-wood/20 bg-mist/60 px-3 py-2.5 text-[16px] sm:text-[14px] text-ink placeholder:text-wood/50 focus:outline-none focus:border-gold focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label={s.send}
                className="flex-none w-11 h-11 rounded-xl bg-wood text-white flex items-center justify-center hover:bg-wood-dark disabled:opacity-40 transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-wood/70">
              <span className="leading-snug">{s.disclaimer}</span>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
               
                className="flex-none inline-flex items-center gap-1 font-medium text-[#075E54] hover:underline"
              >
                <WaIcon /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ role, error, children }: { role: 'user' | 'assistant'; error?: boolean; children: ReactNode }) {
  const mine = role === 'user';
  return (
    <div className={mine ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={
          'max-w-[85%] whitespace-pre-line break-words px-3.5 py-2.5 text-[14px] leading-relaxed ' +
          (mine
            ? 'bg-wood text-white rounded-2xl rounded-br-md'
            : `bg-white text-ink rounded-2xl rounded-bl-md border ${error ? 'border-brick/30' : 'border-black/5'} shadow-[0_1px_2px_rgba(0,0,0,0.04)]`)
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

function WaIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm4.44 11.96c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
