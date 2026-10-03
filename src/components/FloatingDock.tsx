// The site's contact dock: NIGI, the special offer and WhatsApp as one
// element instead of three separate floating buttons.
//   - Phones: a slim bar across the bottom of the screen, the buttons side by
//     side in equal parts (like hotel apps), so nothing covers the page; the
//     body gets the same padding at the bottom (globals.css).
//   - Larger screens: a tidy column in the bottom-right corner, every button
//     the same width, height and style.
// WhatsApp is always there. NIGI (ChatWidget.tsx) and the offer
// (OfferPopup.tsx) appear only when switched on / live: they render their
// button into their slot here with a portal, and the bar shares the space
// between whatever is present. While NIGI's chat is open the dock steps aside
// (globals.css, html[data-nigi]).

export const DOCK_ID = 'iw-dock';
export const DOCK_SLOT_NIGI = 'iw-dock-nigi';
export const DOCK_SLOT_OFFER = 'iw-dock-offer';

// One button of the dock: icon over a short label on phones, a pill on larger screens.
export const DOCK_ITEM =
  'group relative flex flex-col items-center justify-center gap-1 h-14 min-w-0 px-1 text-[11px] leading-tight font-semibold text-mist ' +
  'hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/80 ' +
  'sm:flex-row sm:justify-start sm:gap-2.5 sm:h-11 sm:w-[13.5rem] sm:px-1.5 sm:pr-4 sm:rounded-full sm:bg-[#3D3026] sm:text-[13px] ' +
  'sm:ring-1 sm:ring-gold/50 sm:shadow-soft sm:hover:ring-gold sm:hover:bg-[#3D3026] sm:hover:-translate-y-0.5 sm:transition motion-reduce:sm:hover:translate-y-0';

// The round icon at the start of each button.
export const DOCK_ICON = 'relative grid place-items-center flex-none w-7 h-7 sm:w-8 sm:h-8 rounded-full';

export default function FloatingDock({ whatsappHref, whatsappShort, whatsappLong }: { whatsappHref: string; whatsappShort: string; whatsappLong: string }) {
  return (
    <div
      id={DOCK_ID}
      className="fixed z-50 inset-x-0 bottom-0 grid grid-flow-col auto-cols-fr bg-[#3D3026]/95 backdrop-blur-md border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-12px_rgba(0,0,0,0.45)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:flex sm:flex-col sm:items-end sm:gap-2 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:shadow-none sm:pb-0"
    >
      <div id={DOCK_SLOT_NIGI} className="contents" />
      <div id={DOCK_SLOT_OFFER} className="contents" />
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={DOCK_ITEM} aria-label={whatsappLong}>
        <span className={`${DOCK_ICON} bg-[#075E54] text-white`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
          </svg>
        </span>
        {/* Short on every screen: the full phrase (up to 33 letters in Dutch)
            would not fit buttons of equal width; screen readers get it. */}
        <span className="truncate max-w-full">{whatsappShort}</span>
      </a>
    </div>
  );
}
