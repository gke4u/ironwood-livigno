'use client';

import { useEffect, useRef, useState } from 'react';

// The photo of the day, shown so it can't be casually saved: it is a CSS
// background under a transparent layer (no <img> to right-click, drag or
// long-press "Save image" on phones), the context menu and Ctrl/Cmd+S/P are
// blocked, and it is left out of printouts. Tapping it opens a full-screen
// view with the same protections. Screenshots can't be stopped by any web
// page — that's why every photo carries the Ironwood logo, drawn into the
// file itself when it is uploaded (see worker/admin.ts).
const SRC = '/foto-del-giorno';

const guard = {
  onContextMenu: (e: React.SyntheticEvent) => e.preventDefault(),
  onDragStart: (e: React.SyntheticEvent) => e.preventDefault(),
  draggable: false
};

export default function ProtectedPhoto({ alt, enlargeLabel, closeLabel }: { alt: string; enlargeLabel: string; closeLabel: string }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Load the photo only when the section is about to scroll into view.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    const trigger = ref.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={enlargeLabel}
        className="group relative block w-full rounded-3xl overflow-hidden shadow-soft aspect-[4/3] bg-ink/5 select-none [-webkit-touch-callout:none] print:hidden cursor-zoom-in"
        {...guard}
      >
        <span
          role="img"
          aria-label={alt}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
          style={visible ? { backgroundImage: `url(${SRC})` } : undefined}
        />
        {/* Transparent layer on top: long-press or right-click hits this, not the photo. */}
        <span className="absolute inset-0" aria-hidden />
        <span className="absolute right-4 top-4 w-11 h-11 rounded-full bg-ink/60 backdrop-blur text-mist flex items-center justify-center ring-1 ring-mist/25" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[85] bg-black/95 flex items-center justify-center select-none [-webkit-touch-callout:none] print:hidden"
          onClick={() => setOpen(false)}
          {...guard}
        >
          <span className="absolute inset-3 md:inset-10 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${SRC})` }} aria-hidden />
          <span className="absolute inset-0" aria-hidden />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeLabel}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-mist/10 text-mist ring-1 ring-mist/30 flex items-center justify-center hover:bg-mist/20 outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
