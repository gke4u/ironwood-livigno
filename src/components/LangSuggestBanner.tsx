'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n/routing';

// The site always defaults to /it for new visitors (x-default), regardless
// of what language their browser is set to. This detects the visitor's
// browser language client-side and, if it maps to one of our 9 supported
// locales and differs from the page they're currently on, offers a
// dismissible switch — shown in THEIR language, not the current page's,
// since the whole point is the current page may not be one they read well.
const BANNER_TEXT: Record<Locale, { msg: string; switchBtn: string; close: string }> = {
  it: { msg: "Sembra che tu preferisca l'italiano.", switchBtn: "Passa all'italiano", close: 'Chiudi' },
  en: { msg: 'It looks like you might prefer English.', switchBtn: 'Switch to English', close: 'Close' },
  de: { msg: 'Es sieht so aus, als würden Sie Deutsch bevorzugen.', switchBtn: 'Zu Deutsch wechseln', close: 'Schließen' },
  fr: { msg: 'Il semble que vous préférez le français.', switchBtn: 'Passer au français', close: 'Fermer' },
  da: { msg: 'Det ser ud til, at du foretrækker dansk.', switchBtn: 'Skift til dansk', close: 'Luk' },
  pl: { msg: 'Wygląda na to, że wolisz język polski.', switchBtn: 'Przełącz na polski', close: 'Zamknij' },
  cs: { msg: 'Zdá se, že preferujete češtinu.', switchBtn: 'Přepnout na češtinu', close: 'Zavřít' },
  no: { msg: 'Det ser ut som du foretrekker norsk.', switchBtn: 'Bytt til norsk', close: 'Lukk' },
  nl: { msg: 'Het lijkt erop dat u Nederlands verkiest.', switchBtn: 'Overschakelen naar Nederlands', close: 'Sluiten' },
  zh: { msg: '看起来您可能更喜欢中文。', switchBtn: '切换到中文', close: '关闭' },
  ja: { msg: '日本語がお好みのようです。', switchBtn: '日本語に切り替える', close: '閉じる' },
  'en-us': { msg: 'It looks like you might prefer English.', switchBtn: 'Switch to English', close: 'Close' }
};

export default function LangSuggestBanner({ current }: { current: Locale }) {
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<Locale | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('lang-banner-dismissed')) return;

      const browserLangs = navigator.languages?.length ? navigator.languages : [navigator.language];
      for (const lang of browserLangs) {
        const code = lang.slice(0, 2).toLowerCase();
        if ((locales as readonly string[]).includes(code) && code !== current) {
          setSuggested(code as Locale);
          break;
        }
      }
    } catch {
      // navigator/localStorage unavailable — just skip the suggestion
    }
  }, [current]);

  // Pushes the sticky header down via the --banner-h CSS variable instead
  // of letting the banner overlay it (was: banner fixed on top, header
  // fixed underneath at the same top:0, logo and nav links half-hidden on
  // every first visit — see globals.css and Nav.tsx, which read this same
  // variable). Reset on unmount too, so a client-side navigation that
  // unmounts this component never leaves the header permanently offset.
  useEffect(() => {
    const show = Boolean(suggested) && !dismissed;
    document.documentElement.style.setProperty('--banner-h', show ? '44px' : '0px');
    return () => {
      document.documentElement.style.setProperty('--banner-h', '0px');
    };
  }, [suggested, dismissed]);

  function handleDismiss() {
    setDismissed(true);
    try {
      localStorage.setItem('lang-banner-dismissed', '1');
    } catch {
      // ignore
    }
  }

  if (!suggested || dismissed) return null;

  const rest = pathname.split('/').slice(2).join('/');
  const href = rest ? `/${suggested}/${rest}` : `/${suggested}`;
  const text = BANNER_TEXT[suggested];

  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] h-11 bg-ink text-mist px-4 flex items-center justify-center gap-1 text-sm shadow-soft"
      role="status"
    >
      <span className="truncate whitespace-nowrap overflow-hidden min-w-0">
        {text.msg}{' '}
        <a
          href={href}
          onClick={handleDismiss}
          className="underline underline-offset-4 font-medium text-gold hover:text-gold/80 transition-colors"
        >
          {text.switchBtn}
        </a>
      </span>
      <button
        onClick={handleDismiss}
        aria-label={text.close}
        className="shrink-0 w-11 h-11 -mr-3 flex items-center justify-center text-mist/50 hover:text-mist transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
