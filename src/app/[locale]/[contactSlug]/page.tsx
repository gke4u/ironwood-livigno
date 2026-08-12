import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { locales, contactSlugs, type Locale } from '@/i18n/routing';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import RequestForm from '@/components/RequestForm';

// Was a literal `contact/` folder — one English slug for all 12 locales.
// Now a translated slug per locale (/it/contatti, /de/kontakt, /en/contact,
// ...), so this has to become a dynamic segment with an explicit allow-list
// via generateStaticParams: exactly one valid (locale, contactSlug) pair
// per language, from the map in i18n/routing.ts. Anything else (wrong slug
// for that locale, or a locale/slug pair not in the list) 404s — with
// `output: 'export'` there's no server to fall back to at request time, so
// only params returned here ever get a real HTML file.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';
const CONTACT_PHONE = '390342929285';
const CONTACT_EMAIL = 'info@ironwoodlivigno.com';
const CONTACT_PHONE_DISPLAY = '+39 0342 929285';
const MAP_LINK = 'https://www.google.com/maps?q=46.525061,10.126967';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale, contactSlug: contactSlugs[locale] }));
}

type Params = Promise<{ locale: Locale; contactSlug: string }>;

function assertValidSlug(locale: Locale, contactSlug: string) {
  if (contactSlugs[locale] !== contactSlug) notFound();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, contactSlug } = await params;
  if (contactSlugs[locale] !== contactSlug) return {};

  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const title = `${t('title')} — Ironwood Livigno`;
  const description = t('meta_description');
  const url = `${siteUrl}/${locale}/${contactSlug}`;

  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `${siteUrl}/${l}/${contactSlugs[l]}`;
  });
  languages['x-default'] = `${siteUrl}/en/${contactSlugs.en}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Ironwood Livigno',
      images: [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630, alt: title }],
      type: 'website'
    }
  };
}

export default async function ContactPage({ params }: { params: Params }) {
  const { locale, contactSlug } = await params;
  assertValidSlug(locale, contactSlug);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const req = await getTranslations({ locale, namespace: 'request' });
  const loc = await getTranslations({ locale, namespace: 'location' });

  const waText = encodeURIComponent(req('wa_intro'));
  const mailHref = `mailto:${CONTACT_EMAIL}`;
  const telHref = `tel:+${CONTACT_PHONE}`;
  const waHref = `https://wa.me/${CONTACT_PHONE}?text=${waText}`;

  const methods = [
    {
      key: 'email',
      label: t('email_label'),
      value: CONTACT_EMAIL,
      href: mailHref,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 6 10-6" />
        </svg>
      )
    },
    {
      key: 'phone',
      label: t('phone_label'),
      value: CONTACT_PHONE_DISPLAY,
      href: telHref,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      )
    },
    {
      key: 'whatsapp',
      label: t('whatsapp_label'),
      value: t('whatsapp_cta'),
      href: waHref,
      external: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      )
    },
    {
      key: 'address',
      label: t('address_label'),
      value: loc('address'),
      href: MAP_LINK,
      external: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    }
  ];

  const url = `${siteUrl}/${locale}/${contactSlug}`;
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t('title'), item: url }
    ]
  };
  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t('title'),
    description: t('meta_description'),
    url,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: 'Ironwood Livigno', url: siteUrl },
    about: { '@type': 'LodgingBusiness', name: 'Ironwood Livigno', url: `${siteUrl}/it` }
  };

  return (
    <main className="bg-mist min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <div className="pt-32 pb-16 md:pb-20 bg-ink">
        <Nav locale={locale} />
        <div className="max-w-content mx-auto px-6 md:px-10">
          <p className="text-gold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{t('eyebrow')}</p>
          <h1 className="font-display text-3xl md:text-5xl text-mist mb-5 leading-tight max-w-2xl">
            {t('title')}
          </h1>
          <p className="text-mist/70 text-base md:text-lg max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-20">
        <Reveal>
          <h2 className="font-display text-xl md:text-2xl text-ink mb-6">{t('methods_title')}</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-16 max-w-2xl">
            {methods.map((m) => (
              <a
                key={m.key}
                href={m.href}
                target={m.external ? '_blank' : undefined}
                rel={m.external ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white px-5 py-4 hover:border-brick/40 hover:shadow-soft transition-all"
              >
                <span className="text-brick shrink-0 mt-0.5">{m.icon}</span>
                <span>
                  <span className="block text-ink/65 text-xs uppercase tracking-widest mb-1">{m.label}</span>
                  <span className="block text-ink font-medium">{m.value}</span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-display text-xl md:text-2xl text-ink mb-6">{t('form_title')}</h2>
          <RequestForm showAltMethods={false} />
        </Reveal>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
