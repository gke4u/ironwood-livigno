'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import Pic from './Pic';

// How much a tap/click on the open photo enlarges it. The photos are about
// 2000px wide at most: twice the screen is about as far as they stay sharp.
const ZOOM = 2;

type LightboxPhoto = {
  src: string;
  alt: string;
  w: number;
  h: number;
  // Optional: Summer.tsx's photos are self-explanatory from their alt text
  // (lake, bike, flowers...) and never showed a caption line even before
  // this was shared — omitting it here preserves that, rather than forcing
  // every caller to have one.
  caption?: string;
};

// The full-screen modal half of the shared lightbox (see usePhotoLightbox.ts
// for the state/keyboard-nav half) — same markup that used to be copied
// into Gallery, Rooms, Summer and ExtraServices individually.
export default function PhotoLightbox({
  photo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  closeLabel,
  prevLabel,
  nextLabel
}: {
  photo: LightboxPhoto;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  // Tap/click on the photo: shown twice as large (the full original file),
  // moved by dragging a finger or by moving the mouse; another tap/click goes back.
  const [zoom, setZoom] = useState<{ width: number; x: number; y: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => setZoom(null), [photo.src]);
  // Starts on the point that was clicked.
  useEffect(() => {
    const el = scrollRef.current;
    if (!zoom || !el) return;
    const h = (zoom.width * photo.h) / photo.w;
    el.scrollLeft = zoom.x * zoom.width - el.clientWidth / 2;
    el.scrollTop = zoom.y * h - el.clientHeight / 2;
  }, [zoom, photo.w, photo.h]);
  const zoomIn = (e: MouseEvent<HTMLElement>) => {
    const img = (e.currentTarget as HTMLElement).querySelector('img');
    if (!img) return;
    const r = img.getBoundingClientRect();
    setZoom({ width: r.width * ZOOM, x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };
  // Mouse only (touch scrolls by itself): the view follows the pointer across the photo.
  const pan = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.scrollLeft = (e.clientX / el.clientWidth) * (el.scrollWidth - el.clientWidth);
    el.scrollTop = (e.clientY / el.clientHeight) * (el.scrollHeight - el.clientHeight);
  };
  const original = photo.src.replace(/\.jpe?g$/i, '');

  // Rendered into <body> (like ProtectedPhoto): the homepage sections have
  // `content-visibility: auto` (globals.css), which traps a fixed layer inside
  // its section — the photo ended up halfway down the gallery, off screen.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 md:p-10 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute top-4 right-4 md:top-6 md:right-6 text-white/90 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label={prevLabel}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label={nextLabel}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="max-w-[92vw] max-h-[88vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        {/* The size it is really shown at (92% of the width, or 80% of the height for
            tall photos), so the browser loads a file big enough to look sharp. */}
        <button type="button" onClick={zoomIn} aria-label={photo.alt} className="cursor-zoom-in block relative">
          <Pic
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.w}
            height={photo.h}
            loading="eager"
            withOriginal
            sizes={`min(92vw, ${((80 * photo.w) / photo.h).toFixed(1)}vh)`}
            className="max-w-[92vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg"
          />
          {/* Magnifier: tells that a tap enlarges the photo (no text, same in every language). */}
          <span className="pointer-events-none absolute right-3 bottom-3 w-10 h-10 rounded-full bg-ink/60 text-white flex items-center justify-center" aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <line x1="15.5" y1="15.5" x2="21" y2="21" />
              <line x1="10.5" y1="7.5" x2="10.5" y2="13.5" />
              <line x1="7.5" y1="10.5" x2="13.5" y2="10.5" />
            </svg>
          </span>
        </button>
        {photo.caption && <p className="text-white/85 font-display text-base">{photo.caption}</p>}
        <p className="text-white/60 text-sm tabular-nums">
          {index + 1} / {total}
        </p>
      </div>

      {zoom && (
        <div
          ref={scrollRef}
          className="fixed inset-0 z-[110] flex overflow-auto overscroll-contain bg-ink cursor-zoom-out"
          onClick={(e) => {
            e.stopPropagation();
            setZoom(null);
          }}
          onMouseMove={pan}
        >
          {/* Auto margins centre a photo smaller than the screen (both ways) and become 0 when it is larger. */}
          <picture className="block m-auto shrink-0">
            <source type="image/webp" srcSet={`${original}.webp`} />
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              style={{ width: zoom.width, maxWidth: 'none', height: 'auto' }}
              className="block"
            />
          </picture>
        </div>
      )}
    </div>,
    document.body
  );
}
