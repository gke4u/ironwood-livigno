'use client';

import Pic from './Pic';

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
  return (
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
        <Pic
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          loading="eager"
          className="max-w-[92vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg"
        />
        {photo.caption && <p className="text-white/85 font-display text-base">{photo.caption}</p>}
        <p className="text-white/60 text-sm tabular-nums">
          {index + 1} / {total}
        </p>
      </div>
    </div>
  );
}
