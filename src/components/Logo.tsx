// Matches the brand mark supplied by the client: a single-stroke
// roofline/mountain silhouette with an accent dot, plus the "iron"+"wood"
// wordmark. The icon and "iron" use currentColor so the mark stays legible
// wherever it's placed (mist over the dark hero nav, mist/70 in the dark
// footer); "wood" stays the fixed brand gold in both places.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="26"
        viewBox="0 0 120 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="10" cy="46" r="6" fill="#C9A059" />
        <polyline
          points="24,60 46,26 66,50 94,10 118,60 118,96 20,96 20,64"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-xl md:text-2xl tracking-wide lowercase">
        iron<span className="text-gold">wood</span>
      </span>
    </span>
  );
}
