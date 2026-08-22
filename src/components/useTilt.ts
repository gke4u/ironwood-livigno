'use client';

import { useCallback, useEffect, useRef, type MouseEvent } from 'react';

// Shared "transform transitions faster than shadow" style for every tilting
// card — kept as one constant object so every card passes the identical
// reference instead of a fresh object each render.
export const TILT_TRANSITION = { transition: 'transform 150ms ease-out, box-shadow 400ms ease' };

// A light "tilt toward the cursor" for photo/product-style cards — the kind
// of tactile motion that reads as premium. Writes the transform directly to
// the DOM node (not React state) since it needs to update on every
// pointermove without triggering a re-render. Gated to real mice: touch
// "hover" is a tap-and-stick that would leave a card permanently tilted,
// and anyone with prefers-reduced-motion set shouldn't get motion tied to
// their cursor at all.
export function useTilt(maxDeg = 7, lift = 6) {
  const canTiltRef = useRef(false);

  useEffect(() => {
    canTiltRef.current =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!canTiltRef.current) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateX(${(-py * maxDeg).toFixed(2)}deg) rotateY(${(px * maxDeg).toFixed(2)}deg) translateY(-${lift}px)`;
    },
    [maxDeg, lift]
  );

  const onMouseLeave = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  }, []);

  return { onMouseMove, onMouseLeave };
}
