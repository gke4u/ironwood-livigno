'use client';

import { useCallback, useEffect, useState } from 'react';

// Shared by every full-screen photo lightbox on the site (Gallery, Rooms,
// Summer, ExtraServices) — each used to carry its own copy of this exact
// state/keyboard/scroll-lock logic (~60 lines apiece, textually similar but
// not identical closures, so webpack couldn't dedupe them). One shared hook
// instead of four near-identical ones.
export function usePhotoLightbox(photoCount: number) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + photoCount) % photoCount));
  }, [photoCount]);
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % photoCount));
  }, [photoCount]);

  // Lock page scroll while the lightbox is open and wire up keyboard
  // controls (Esc to close, arrow keys to browse other photos).
  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, close, showPrev, showNext]);

  return { activeIndex, open, close, showPrev, showNext };
}
