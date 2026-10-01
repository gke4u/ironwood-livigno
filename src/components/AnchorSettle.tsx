'use client';

import { useEffect } from 'react';

// The homepage sections below the hero use `content-visibility: auto` with an
// estimated height until they are first drawn (globals.css). Jumping to one of
// them (#prenota, #camere…) can therefore land a little off, because the
// sections passed on the way get their real height during the scroll. Once
// the scroll is over, this nudges the page so the target sits exactly where
// it would without the optimisation (its scroll-margin below the menu bar).
function settle(id: string) {
  const el = document.getElementById(id);
  // A section hidden from the admin has no box: nothing to align to.
  if (!el || !el.closest('#sezioni') || el.getClientRects().length === 0) return;
  let tries = 0;
  const fix = () => {
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const off = el.getBoundingClientRect().top - margin;
    if (Math.abs(off) > 4 && tries++ < 4) {
      window.scrollBy({ top: off, behavior: 'instant' as ScrollBehavior });
      requestAnimationFrame(() => requestAnimationFrame(fix));
    }
  };
  fix();
}

const afterScroll = (cb: () => void) => {
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', cb, { once: true });
  } else {
    setTimeout(cb, 900);
  }
};

export default function AnchorSettle() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      // Only for the scroll this click starts: if the page was already there,
      // no scroll happens and a later, unrelated scroll must not trigger it.
      const at = Date.now();
      afterScroll(() => {
        if (Date.now() - at < 4000) settle(id);
      });
    };
    document.addEventListener('click', onClick);
    // Arriving from another page with a hash (e.g. /it#prenota from the blog).
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      setTimeout(() => settle(id), 300);
    }
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
