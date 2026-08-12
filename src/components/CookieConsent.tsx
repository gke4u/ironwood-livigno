'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// NOT RENDERED ANYWHERE as of the map-consent-gate removal (see
// MapEmbed.tsx): the site owner explicitly chose to have the Google Maps
// iframe load immediately for every visitor instead of behind a consent
// click, which removes the only thing this modal was gating. Kept in the
// repo (unused) rather than deleted, in case the consent-gated flow is
// wanted back later — re-wire by importing <CookieConsent /> in
// src/app/[locale]/layout.tsx and switching MapEmbed.tsx back to reading
// COOKIE_CONSENT_KEY. The `cookies.*` strings in messages/*.json are
// similarly unused right now but left in place for the same reason.
//
// The only third-party embed on the site that sets cookies is the Google
// Maps iframe in LocationSection — everything else (fonts, Cloudflare Web
// Analytics) is cookieless. This modal asks for consent once, and
// MapEmbed.tsx reads the same localStorage key to decide whether to render
// the real iframe or a placeholder with a plain link to Google Maps.
//
// Styled as a centered modal (rather than a bottom banner) with a single
// real toggle — "Mappa (Google Maps)" — since that's the only category of
// non-essential cookie this site actually uses. There's no "Marketing"
// toggle here: adding one that doesn't correspond to any real tracking
// would be a fake control, not a privacy setting.
export const COOKIE_CONSENT_KEY = 'iw-cookie-consent';
export const COOKIE_CONSENT_EVENT = 'iw-cookie-consent-changed';

export default function CookieConsent() {
  const t = useTranslations('cookies');
  const [visible, setVisible] = useState(false);
  const [mapEnabled, setMapEnabled] = useState(true);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_CONSENT_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable — skip the modal rather than block the page
    }
  }, []);

  function decide(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
      window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function acceptAll() {
    setMapEnabled(true);
    decide('accepted');
  }

  function saveSelection() {
    decide(mapEnabled ? 'accepted' : 'declined');
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
      <div className="bg-mist text-ink rounded-2xl shadow-soft max-w-lg w-full p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="font-display text-xl sm:text-2xl">{t('title')}</h2>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ink/40 shrink-0 mt-1" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
          </svg>
        </div>

        <p className="text-sm text-ink/70 mb-6">{t('banner_text')}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3">
            <span className="text-sm font-medium">{t('essential_label')}</span>
            <span
              aria-hidden
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-ink/20 cursor-not-allowed"
            >
              <span className="inline-block h-[18px] w-[18px] translate-x-6 rounded-full bg-mist shadow" />
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3">
            <span className="text-sm font-medium">{t('map_label')}</span>
            <button
              type="button"
              role="switch"
              aria-checked={mapEnabled}
              aria-label={t('map_label')}
              onClick={() => setMapEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                mapEnabled ? 'bg-brick' : 'bg-ink/20'
              }`}
            >
              <span
                className={`inline-block h-[18px] w-[18px] rounded-full bg-mist shadow transition-transform ${
                  mapEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={saveSelection}
            className="flex-1 border border-ink/20 rounded-full px-5 py-3 text-sm font-medium hover:bg-ink/5 transition-colors"
          >
            {t('save_selection')}
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 bg-gold text-ink rounded-full px-5 py-3 text-sm font-medium hover:bg-gold/90 transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
