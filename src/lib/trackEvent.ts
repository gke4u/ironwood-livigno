// Counts a contact action or engagement click for the admin's statistics
// (worker/stats.ts): a POST beacon with just the kind; the Worker adds the
// page from the Referer. No cookie, no visitor id, nothing personal.
// Not counted in the admin's offer preview.
export type TrackedEvent = 'whatsapp' | 'email' | 'phone' | 'form' | 'tour' | 'map';

export function trackEvent(kind: TrackedEvent) {
  try {
    if (new URLSearchParams(window.location.search).has('anteprima-offerta')) return;
    navigator.sendBeacon(`/api/evento?e=${kind}`);
  } catch {}
}

// Which tracked kind a link is, from its href (WhatsApp, email, phone).
export function linkKind(href: string | null): TrackedEvent | null {
  if (!href) return null;
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return 'whatsapp';
  if (href.startsWith('mailto:')) return 'email';
  if (href.startsWith('tel:')) return 'phone';
  return null;
}
