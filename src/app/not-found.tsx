'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { locales, defaultLocale, type Locale } from '@/i18n/routing';

// Custom branded 404, served for any URL that doesn't match a real route
// (typos, old/removed links, broken external backlinks) — Next.js exports
// this as a static `404.html`, which Cloudflare serves for any unmatched
// path with a real HTTP 404 status, keeping the brand consistent instead of
// a generic blank error page.
//
// 'use client' + reading window.location here (rather than a server
// component reading route params) is deliberate: `not-found.tsx` at the app
// root sits outside `src/app/[locale]/`, so it never receives a `locale`
// param to begin with — the only way to know which language section the
// visitor was trying to reach is to look at the URL that actually 404'd.
const COPY: Record<Locale, { title: string; body: string; home: string; rooms: string; blog: string; contact: string }> = {
  it: { title: 'Pagina non trovata', body: 'Il link che hai seguito potrebbe essere vecchio o scritto male.', home: 'Home', rooms: 'Camere', blog: 'Blog', contact: 'Contatti' },
  en: { title: 'Page not found', body: 'The link you followed may be old or mistyped.', home: 'Home', rooms: 'Rooms', blog: 'Blog', contact: 'Contact' },
  de: { title: 'Seite nicht gefunden', body: 'Der Link, dem du gefolgt bist, ist möglicherweise veraltet oder falsch geschrieben.', home: 'Startseite', rooms: 'Zimmer', blog: 'Blog', contact: 'Kontakt' },
  fr: { title: 'Page introuvable', body: 'Le lien que vous avez suivi est peut-être ancien ou mal orthographié.', home: 'Accueil', rooms: 'Chambres', blog: 'Blog', contact: 'Contact' },
  da: { title: 'Siden blev ikke fundet', body: 'Linket, du fulgte, er muligvis forældet eller forkert skrevet.', home: 'Forside', rooms: 'Værelser', blog: 'Blog', contact: 'Kontakt' },
  pl: { title: 'Nie znaleziono strony', body: 'Link, z którego skorzystano, mógł być nieaktualny lub błędnie zapisany.', home: 'Strona główna', rooms: 'Pokoje', blog: 'Blog', contact: 'Kontakt' },
  cs: { title: 'Stránka nenalezena', body: 'Odkaz, který jste použili, může být starý nebo špatně napsaný.', home: 'Domů', rooms: 'Pokoje', blog: 'Blog', contact: 'Kontakt' },
  no: { title: 'Siden ble ikke funnet', body: 'Lenken du fulgte kan være utdatert eller feilstavet.', home: 'Hjem', rooms: 'Rom', blog: 'Blog', contact: 'Kontakt' },
  nl: { title: 'Pagina niet gevonden', body: 'De link die je volgde is mogelijk verouderd of verkeerd getypt.', home: 'Home', rooms: 'Kamers', blog: 'Blog', contact: 'Contact' },
  zh: { title: '未找到页面', body: '您访问的链接可能已过期或拼写有误。', home: '首页', rooms: '房间', blog: '博客', contact: '联系我们' },
  ja: { title: 'ページが見つかりません', body: 'リンクが古いか、入力に誤りがある可能性があります。', home: 'ホーム', rooms: '部屋', blog: 'ブログ', contact: 'お問い合わせ' },
  'en-us': { title: 'Page not found', body: 'The link you followed may be old or mistyped.', home: 'Home', rooms: 'Rooms', blog: 'Blog', contact: 'Contact' }
};

const CONTACT_SLUGS: Record<Locale, string> = {
  it: 'contatti', en: 'contact', de: 'kontakt', fr: 'contact', da: 'kontakt',
  pl: 'kontakt', cs: 'kontakt', no: 'kontakt', nl: 'contact', zh: 'contact',
  ja: 'contact', 'en-us': 'contact'
};

export default function NotFound() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const seg = window.location.pathname.split('/')[1];
    if ((locales as readonly string[]).includes(seg)) {
      setLocale(seg as Locale);
    }
  }, []);

  const c = COPY[locale];

  return (
    <main
      style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        background: '#241C15',
        color: '#F7F3EC',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem', color: '#C9A059', margin: 0 }}>
        Ironwood Livigno
      </p>
      <h1 style={{ fontSize: '2.25rem', margin: 0 }}>{c.title}</h1>
      <p style={{ opacity: 0.7, margin: 0, maxWidth: '32rem' }}>{c.body}</p>

      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        <a
          href={`/${locale}`}
          style={{
            background: '#A8462F',
            color: '#F7F3EC',
            borderRadius: '999px',
            padding: '0.75rem 1.75rem',
            textDecoration: 'none',
            fontWeight: 500,
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {c.home}
        </a>
        <a
          href={`/${locale}#camere`}
          style={{
            border: '1px solid rgba(247,243,236,0.3)',
            color: '#F7F3EC',
            borderRadius: '999px',
            padding: '0.75rem 1.75rem',
            textDecoration: 'none',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {c.rooms}
        </a>
        <Link
          href="/blog"
          style={{
            border: '1px solid rgba(247,243,236,0.3)',
            color: '#F7F3EC',
            borderRadius: '999px',
            padding: '0.75rem 1.75rem',
            textDecoration: 'none',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {c.blog}
        </Link>
        <a
          href={`/${locale}/${CONTACT_SLUGS[locale]}`}
          style={{
            border: '1px solid rgba(247,243,236,0.3)',
            color: '#F7F3EC',
            borderRadius: '999px',
            padding: '0.75rem 1.75rem',
            textDecoration: 'none',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {c.contact}
        </a>
      </nav>
    </main>
  );
}
