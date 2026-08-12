export type WeatherCategory =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'storm';

// WMO weather codes (used by Open-Meteo) collapsed into the 8 broad
// categories we actually draw an icon and copy for — see
// https://open-meteo.com/en/docs for the full code table.
export function categoryForCode(code: number): WeatherCategory {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly_cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'cloudy';
}

const CLOUD = 'M6.5 12h10.5a4 4 0 0 0 .3-7.9 6 6 0 0 0-11.4 2A3.5 3.5 0 0 0 6.5 12Z';

// Minimal line icons in the same visual language as the pin marker in
// MapEmbed.tsx (stroke-based, currentColor, no external icon library).
export default function WeatherIcon({
  category,
  className = ''
}: {
  category: WeatherCategory;
  className?: string;
}) {
  switch (category) {
    case 'clear':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
          </g>
        </svg>
      );
    case 'partly_cloudy':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <circle cx="8.5" cy="7.5" r="2.6" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M8.5 2.8v1.4M3.9 7.5h1.4M4.9 3.9l1 1M12.1 3.9l-1 1" />
          </g>
          <path
            d={CLOUD}
            transform="translate(0.5 2)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'cloudy':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path d={CLOUD} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'fog':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path
            d="M6.5 11h10.5a4 4 0 0 0 .3-7.9 6 6 0 0 0-11.4 2A3.5 3.5 0 0 0 6.5 11Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M4 15h16M6 18.2h12M8.5 21.4h7" />
          </g>
        </svg>
      );
    case 'drizzle':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path d={CLOUD} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M8 16v1.4M12 16v1.4M16 16v1.4M9 19.4v1M13 19.4v1M17 19.4v1" />
          </g>
        </svg>
      );
    case 'rain':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path d={CLOUD} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M8 15.5l-1.3 3.4M12.5 15.5l-1.3 3.4M17 15.5l-1.3 3.4" />
          </g>
        </svg>
      );
    case 'snow':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path d={CLOUD} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M8 16.3v3M6.5 17.8h3M12 16.3v3M10.5 17.8h3M16 16.3v3M14.5 17.8h3" />
          </g>
        </svg>
      );
    case 'storm':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path
            d="M6.5 10h9.5a4 4 0 0 0 .3-7.9 6 6 0 0 0-11.2 2.3A3.5 3.5 0 0 0 6.5 10Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M13 12l-3.5 5h3L11 21l4.5-6h-3l1.5-3Z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
