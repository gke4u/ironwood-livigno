// The round Ironwood badge: warm dark brown disc, gold ring, the roofline
// mark with its gold dot (same drawing as Logo.tsx). Used by the "Help"
// launcher, the welcome bubble and the chat's header, so the assistant has
// one face everywhere (the owner liked the round launcher best, 15 October 2026).
export default function BrandBadge({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-full bg-[#3D3026] text-mist ring-2 ring-gold ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 120 110" fill="none" style={{ width: size * 0.5, height: size * 0.5 }}>
        <circle cx="10" cy="46" r="7" fill="#C9A059" />
        <polyline points="24,60 46,26 66,50 94,10 118,60 118,96 20,96 20,64" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
