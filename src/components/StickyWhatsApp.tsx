'use client';

import { useTranslations } from 'next-intl';

// Was hardcoded to an Italian pre-filled message regardless of locale — the
// only place on the site where that still happened after the request-form
// translation pass. Now reuses the same `request.wa_intro` string as the
// request form for a consistent, localized message.
//
// The label used to be icon-only on mobile (`hidden sm:inline`) — exactly
// the viewport where a plain unlabeled icon button is easiest to miss and
// where most visitors to a vacation-rental site actually are. It now shows
// the full localized "Message us on WhatsApp" text at every breakpoint.
export default function StickyWhatsApp() {
  const t = useTranslations('request');
  const tc = useTranslations('contactPage');
  const text = encodeURIComponent(t('wa_intro'));

  return (
    <a
      href={`https://wa.me/390342929285?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-1 bg-[#25D366] text-white rounded-full pl-2.5 pr-3 py-2 shadow-soft hover:bg-[#20bd5a] transition-colors"
      aria-label={tc('whatsapp_cta')}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
      </svg>
      <span className="text-xs font-medium">{tc('whatsapp_cta')}</span>
    </a>
  );
}
