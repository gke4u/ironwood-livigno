'use client';

import { useEffect } from 'react';

// Homepage sections can be hidden from the admin (worker/layout.ts). On the
// homepages the Worker already hides them, and every link to them, before the
// page reaches the browser; the other pages with the site menu (contact,
// privacy) ask /api/sezioni and hide the menu/footer links to hidden sections.
export default function HiddenSectionLinks() {
  useEffect(() => {
    if (document.getElementById('iw-ordine')) return;
    let cancelled = false;
    fetch('/api/sezioni')
      .then((res) => (res.ok ? (res.json() as Promise<{ hidden?: string[] }>) : null))
      .then((data) => {
        const hidden = (data?.hidden ?? []).filter((id) => /^[a-z-]+$/.test(id));
        if (cancelled || !hidden.length) return;
        const style = document.createElement('style');
        style.id = 'iw-nascoste';
        style.textContent = hidden.map((id) => `a[href$="#${id}"]{display:none!important}`).join('');
        document.head.appendChild(style);
      })
      .catch(() => {
        // No Worker (local `next dev`): nothing to hide.
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
