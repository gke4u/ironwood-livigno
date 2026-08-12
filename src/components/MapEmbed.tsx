'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Pic from './Pic';

// Reverted to a consent-gated map (was briefly changed to always-on — see
// git history) at the site owner's explicit request, to match: "Nessuna
// modale al load. La mappa mostra un placeholder statico... il consenso
// viene chiesto solo lì, in contesto, quando l'utente lo richiede." No
// separate blocking modal on page load (CookieConsent.tsx stays unused) —
// the ask/consent lives entirely inside this component, in place of the map
// itself, so it never competes with the language banner or anything else
// for the visitor's attention.
export const MAP_CONSENT_KEY = 'iw-map-consent';
const MAP_CONSENT_EVENT = 'iw-map-consent-changed';

export default function MapEmbed() {
  const t = useTranslations('cookies');
  const [consent, setConsent] = useState<'accepted' | null>(null);

  useEffect(() => {
    function read() {
      try {
        setConsent(localStorage.getItem(MAP_CONSENT_KEY) === 'accepted' ? 'accepted' : null);
      } catch {
        setConsent(null);
      }
    }
    read();
    window.addEventListener(MAP_CONSENT_EVENT, read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener(MAP_CONSENT_EVENT, read);
      window.removeEventListener('storage', read);
    };
  }, []);

  function enableMap() {
    try {
      localStorage.setItem(MAP_CONSENT_KEY, 'accepted');
      window.dispatchEvent(new Event(MAP_CONSENT_EVENT));
    } catch {
      // ignore
    }
    setConsent('accepted');
  }

  if (consent === 'accepted') {
    return (
      <iframe
        title="Mappa Ironwood Livigno"
        src="https://www.google.com/maps?q=46.525061,10.126967&output=embed"
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      <Pic
        src="/images/esterno-giorno.jpg"
        alt=""
        width={1181}
        height={787}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-wood-dark/70 flex flex-col items-center justify-center text-center gap-4 p-6">
        {/* Pin icon: visually anchors this as "a map you haven't loaded yet"
            rather than just a random photo with a button on it. */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#C9A059" stroke="#241C15" strokeWidth="1" aria-hidden>
          <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
        </svg>
        <p className="text-mist/85 text-sm max-w-xs">{t('map_placeholder_text')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={enableMap}
            className="bg-gold text-ink rounded-full px-5 py-2.5 min-h-[44px] text-sm font-medium hover:bg-gold/90 transition-colors"
          >
            {t('map_enable_button')}
          </button>
          <a
            href="https://www.google.com/maps?q=46.525061,10.126967"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mist/85 hover:text-mist underline underline-offset-4 text-sm transition-colors min-h-[44px] flex items-center"
          >
            {t('map_open_link')}
          </a>
        </div>
      </div>
    </div>
  );
}
