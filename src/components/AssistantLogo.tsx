// The assistant's mark: a small tilted card in the site's warm dark brown
// with the Ironwood roofline, and under it the three dots of someone typing.
// Same idea as the Guanafoto assistant the owner liked (its print-shop
// polaroid becomes our chalet card), 15 October 2026.
//   - `appear`: the card swings in and the roofline "lights up".
//   - `typing`: the three dots move while NIGI is preparing an answer.
// Animations live in globals.css (.iw-logo…) and stop with reduced motion.
export default function AssistantLogo({
  size = 32,
  appear = false,
  typing = false,
  className = ''
}: {
  size?: number;
  appear?: boolean;
  typing?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
      className={`iw-logo shrink-0 ${appear ? 'iw-logo-appear' : ''} ${typing ? 'iw-logo-typing' : ''} ${className}`}
    >
      <g className="iw-logo-card">
        <rect x="11" y="6" width="42" height="50" rx="5" fill="#3D3026" stroke="#C9A059" strokeWidth="2.2" />
        <g className="iw-logo-mark" transform="translate(16 13) scale(0.27)">
          <circle cx="10" cy="46" r="8" fill="#C9A059" />
          <polyline points="24,60 46,26 66,50 94,10 118,60 118,96 20,96 20,64" stroke="#F7F3EC" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <circle className="iw-logo-dot" cx="25" cy="47" r="2.4" fill="#F7F3EC" />
        <circle className="iw-logo-dot" cx="32" cy="47" r="2.4" fill="#F7F3EC" />
        <circle className="iw-logo-dot" cx="39" cy="47" r="2.4" fill="#C9A059" />
      </g>
    </svg>
  );
}
