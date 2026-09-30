// Translated blog indexes (/blog/<locale> for every blog translation): the translated
// articles used to be reachable only from the small "Also available in"
// line on each Italian post, so no page in those languages linked to them.
// Rendered by app/blog/[slug]/page.tsx when the slug is a blog locale (the
// only way to get this URL shape, see the note in [slug]/[locale]/page.tsx).
import type { Metadata } from 'next';
import { blogPosts } from '@/content/blog';
import { blogTranslations, translatedBlogLocales, type TranslatedBlogLocale } from '@/content/blogTranslations';
import { organizationRef, websiteId } from '@/lib/structuredDataIds';
import { BlogHeader, BlogFooter, BlogWhatsAppCta } from '@/components/BlogChrome';
import Pic from '@/components/Pic';
import { getSatellitePages } from '@/data/satellite-pages';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

const HUB: Record<
  TranslatedBlogLocale,
  {
    title: string;
    description: string;
    kicker: string;
    h1: string;
    lead: string;
    readingSuffix: string;
    homeLabel: string;
    ogLocale: string;
    ctaText: string;
    ctaButton: string;
  }
> = {
  en: {
    title: 'Livigno Travel Guide: Skiing, Summer and Practical Tips',
    description:
      'Practical guides to Livigno written by a local host: getting there, skiing and ski pass prices, summer hiking and biking, duty-free shopping and when to book.',
    kicker: 'Livigno travel guide',
    h1: 'Practical tips for your holiday in Livigno',
    lead: 'Guides on getting there, skiing, summer in the mountains and planning your stay — written by people who host travellers in this valley all year round.',
    readingSuffix: 'min read',
    homeLabel: 'Home',
    ogLocale: 'en_GB',
    ctaText: 'Ready to plan your stay in Livigno?',
    ctaButton: 'Check availability'
  },
  de: {
    title: 'Livigno Reiseführer: Skifahren, Sommer und praktische Tipps',
    description:
      'Praktische Guides zu Livigno von Gastgebern vor Ort: Anreise, Skifahren und Skipass-Preise, Wandern und Biken im Sommer, zollfreies Einkaufen und beste Reisezeit.',
    kicker: 'Livigno Reiseführer',
    h1: 'Praktische Tipps für Ihren Urlaub in Livigno',
    lead: 'Guides zu Anreise, Skifahren, Sommer in den Bergen und Urlaubsplanung – geschrieben von Gastgebern, die das ganze Jahr über Reisende in diesem Tal empfangen.',
    readingSuffix: 'Min. Lesezeit',
    homeLabel: 'Startseite',
    ogLocale: 'de_DE',
    ctaText: 'Bereit, Ihren Aufenthalt in Livigno zu planen?',
    ctaButton: 'Verfügbarkeit prüfen'
  },
  pl: {
    title: 'Przewodnik po Livigno: narty, lato i praktyczne porady',
    description:
      'Praktyczne przewodniki po Livigno od lokalnych gospodarzy: dojazd, narty i ceny karnetów, trekking i rower latem, zakupy bez cła i kiedy rezerwować.',
    kicker: 'Przewodnik po Livigno',
    h1: 'Praktyczne porady na urlop w Livigno',
    lead: 'Przewodniki o dojeździe, nartach, lecie w górach i planowaniu pobytu — napisane przez gospodarzy, którzy przez cały rok goszczą podróżnych w tej dolinie.',
    readingSuffix: 'min czytania',
    homeLabel: 'Strona główna',
    ogLocale: 'pl_PL',
    ctaText: 'Gotowy, by zaplanować pobyt w Livigno?',
    ctaButton: 'Sprawdź dostępność'
  },
  nl: {
    title: 'Reisgids Livigno: skiën, zomer en praktische tips',
    description:
      'Praktische gidsen over Livigno van lokale gastheren: de reis, skiën en skipasprijzen, wandelen en fietsen in de zomer, belastingvrij winkelen en wanneer boeken.',
    kicker: 'Reisgids Livigno',
    h1: 'Praktische tips voor je vakantie in Livigno',
    lead: 'Gidsen over de reis, skiën, de zomer in de bergen en het plannen van je verblijf — geschreven door gastheren die het hele jaar reizigers in dit dal ontvangen.',
    readingSuffix: 'min leestijd',
    homeLabel: 'Home',
    ogLocale: 'nl_NL',
    ctaText: 'Klaar om je verblijf in Livigno te plannen?',
    ctaButton: 'Beschikbaarheid bekijken'
  },
  cs: {
    title: 'Průvodce Livignem: lyžování, léto a praktické tipy',
    description:
      'Praktičtí průvodci Livignem od místních hostitelů: cesta, lyžování a ceny skipasů, turistika a kolo v létě, bezcelní nákupy a kdy rezervovat.',
    kicker: 'Průvodce Livignem',
    h1: 'Praktické tipy pro vaši dovolenou v Livignu',
    lead: 'Průvodci o cestě, lyžování, létě na horách a plánování pobytu — napsaní hostiteli, kteří v tomto údolí přijímají cestovatele po celý rok.',
    readingSuffix: 'min čtení',
    homeLabel: 'Domů',
    ogLocale: 'cs_CZ',
    ctaText: 'Chcete si naplánovat pobyt v Livignu?',
    ctaButton: 'Ověřit dostupnost'
  },
  fr: {
    title: 'Guide de Livigno : ski, été et conseils pratiques',
    description:
      'Guides pratiques sur Livigno écrits par des hôtes sur place : comment venir, ski et prix des forfaits, randonnée et VTT en été, shopping détaxé et quand réserver.',
    kicker: 'Guide de Livigno',
    h1: 'Conseils pratiques pour vos vacances à Livigno',
    lead: 'Des guides pour venir, skier, profiter de l’été en montagne et organiser votre séjour — écrits par des hôtes qui accueillent des voyageurs dans cette vallée toute l’année.',
    readingSuffix: 'min de lecture',
    homeLabel: 'Accueil',
    ogLocale: 'fr_FR',
    ctaText: 'Prêt à organiser votre séjour à Livigno ?',
    ctaButton: 'Vérifier les disponibilités'
  },
  da: {
    title: 'Rejseguide til Livigno: ski, sommer og praktiske råd',
    description:
      'Praktiske guides til Livigno fra lokale værter: rejsen, skiløb og liftkortpriser, vandring og cykling om sommeren, toldfri shopping og hvornår du skal booke.',
    kicker: 'Rejseguide til Livigno',
    h1: 'Praktiske råd til din ferie i Livigno',
    lead: 'Guides om rejsen, skiløb, sommer i bjergene og planlægning af opholdet — skrevet af værter, der tager imod rejsende i denne dal hele året.',
    readingSuffix: 'min. læsning',
    homeLabel: 'Forside',
    ogLocale: 'da_DK',
    ctaText: 'Klar til at planlægge dit ophold i Livigno?',
    ctaButton: 'Se ledighed'
  },
  no: {
    title: 'Reiseguide til Livigno: ski, sommer og praktiske tips',
    description:
      'Praktiske guider til Livigno fra lokale verter: reisen, skikjøring og heiskortpriser, fotturer og sykling om sommeren, tollfri shopping og når du bør bestille.',
    kicker: 'Reiseguide til Livigno',
    h1: 'Praktiske tips til ferien i Livigno',
    lead: 'Guider om reisen, skikjøring, sommer på fjellet og planlegging av oppholdet — skrevet av verter som tar imot reisende i denne dalen hele året.',
    readingSuffix: 'min lesing',
    homeLabel: 'Hjem',
    ogLocale: 'nb_NO',
    ctaText: 'Klar til å planlegge oppholdet i Livigno?',
    ctaButton: 'Sjekk ledighet'
  },
  zh: {
    title: '利维尼奥旅游指南：滑雪、夏季与实用建议',
    description:
      '由当地房东撰写的利维尼奥实用指南：交通、滑雪与雪票价格、夏季徒步和骑行、免税购物以及何时预订。',
    kicker: '利维尼奥旅游指南',
    h1: '利维尼奥度假实用建议',
    lead: '关于交通、滑雪、夏日山区和行程规划的指南——由全年在这片山谷接待旅客的房东撰写。',
    readingSuffix: '分钟阅读',
    homeLabel: '首页',
    ogLocale: 'zh_CN',
    ctaText: '准备好规划你的利维尼奥之旅了吗？',
    ctaButton: '查询空房'
  },
  ja: {
    title: 'リヴィーニョ旅行ガイド：スキー、夏、実用情報',
    description:
      '地元のホストが書いたリヴィーニョの実用ガイド：アクセス、スキーとリフト券の料金、夏のハイキングとサイクリング、免税ショッピング、予約の時期。',
    kicker: 'リヴィーニョ旅行ガイド',
    h1: 'リヴィーニョでの休暇に役立つ実用情報',
    lead: 'アクセス、スキー、夏の山、滞在の計画についてのガイド。一年中この谷で旅行者を迎えているホストが書いています。',
    readingSuffix: '分で読めます',
    homeLabel: 'ホーム',
    ogLocale: 'ja_JP',
    ctaText: 'リヴィーニョでの滞在を計画しませんか？',
    ctaButton: '空室を確認する'
  }
};

export function isBlogLocale(slug: string): slug is TranslatedBlogLocale {
  return (translatedBlogLocales as readonly string[]).includes(slug);
}

// Theme pages shown as chips above the article grid, with the labels their
// own translations use in the site navigation.
const TOPIC_PAGES = ['/inverno', '/estate', '/famiglie', '/sauna-bagno-turco-privato-livigno', '/come-arrivare'];

const hubUrl = (locale: TranslatedBlogLocale) => `${siteUrl}/blog/${locale}`;

function hubPosts(locale: TranslatedBlogLocale) {
  return blogPosts.flatMap((post) => {
    const translation = blogTranslations[post.slug]?.[locale];
    return translation ? [{ post, translation }] : [];
  });
}

export function blogHubMetadata(locale: TranslatedBlogLocale): Metadata {
  const hub = HUB[locale];
  const languages: Record<string, string> = { it: `${siteUrl}/blog`, 'x-default': `${siteUrl}/blog` };
  translatedBlogLocales.forEach((l) => {
    languages[l] = hubUrl(l);
  });
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: hubUrl(locale), languages },
    openGraph: {
      title: hub.title,
      description: hub.description,
      url: hubUrl(locale),
      siteName: 'Ironwood Livigno',
      images: [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630 }],
      locale: hub.ogLocale,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.title,
      description: hub.description,
      images: [`${siteUrl}/images/og-image.jpg`]
    }
  };
}

export function BlogHub({ locale }: { locale: TranslatedBlogLocale }) {
  const hub = HUB[locale];
  const posts = hubPosts(locale);
  const topics = getSatellitePages(locale).filter((p) => TOPIC_PAGES.some((t) => p.href === t || p.href.startsWith(`${t}/`)));

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: hub.homeLabel, item: `${siteUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: hub.kicker, item: hubUrl(locale) }
    ]
  };

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${hubUrl(locale)}#blog`,
    name: hub.kicker,
    description: hub.description,
    url: hubUrl(locale),
    inLanguage: locale,
    isPartOf: { '@id': websiteId(siteUrl) },
    publisher: organizationRef(siteUrl),
    blogPost: posts.map(({ post, translation }) => ({
      '@type': 'BlogPosting',
      headline: translation.title,
      description: translation.description,
      url: `${siteUrl}/blog/${post.slug}/${locale}`,
      datePublished: post.date,
      dateModified: translation.updated ?? post.date,
      image: `${siteUrl}${post.image.src}`,
      inLanguage: locale
    }))
  };

  return (
    <html lang={locale}>
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
        <BlogHeader locale={locale} />
        <main className="bg-mist min-h-screen">
          <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-24">
            <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{hub.kicker}</p>
            <h1 className="font-display text-3xl md:text-5xl text-ink mb-4 leading-tight">{hub.h1}</h1>
            <p className="text-ink/70 text-base md:text-lg max-w-2xl mb-14">{hub.lead}</p>

            <div className="flex flex-wrap gap-3 mb-14">
              {topics.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="border border-ink/15 text-ink rounded-full px-5 py-2.5 text-sm font-medium hover:bg-ink/5 transition-colors"
                >
                  {p.label}
                </a>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {posts.map(({ post, translation }) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}/${locale}`}
                  className="group rounded-3xl overflow-hidden shadow-soft bg-white flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Pic
                      src={post.image.src}
                      alt={post.image.alt}
                      width={post.image.w}
                      height={post.image.h}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-ink/65 text-xs mb-2">
                      {post.readingTime.replace(/\s*min$/, '')} {hub.readingSuffix}
                    </p>
                    <h2 className="font-display text-xl text-ink mb-2 leading-snug">{translation.title}</h2>
                    <p className="text-ink/60 text-sm">{translation.description}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-14 p-8 bg-white rounded-3xl shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-display text-lg text-ink">{hub.ctaText}</p>
              <a
                href={`/${locale}#prenota`}
                className="bg-brick text-mist rounded-full px-7 py-3 font-medium hover:bg-brick/90 transition-colors whitespace-nowrap"
              >
                {hub.ctaButton}
              </a>
            </div>
          </div>
        </main>
        <BlogWhatsAppCta locale={locale} />
        <BlogFooter locale={locale} />
      </body>
    </html>
  );
}
