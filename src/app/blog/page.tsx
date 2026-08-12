import type { Metadata } from 'next';
import { blogPosts } from '@/content/blog';
import { BlogHeader, BlogFooter, BlogWhatsAppCta } from '@/components/BlogChrome';
import Pic from '@/components/Pic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

export const metadata: Metadata = {
  title: 'Guida a Livigno — Blog | Ironwood Livigno',
  description: "Guide pratiche su Livigno: come arrivare, sci, mountain bike, trekking e come organizzare al meglio la tua vacanza.",
  alternates: { canonical: `${siteUrl}/blog`, languages: { it: `${siteUrl}/blog`, 'x-default': `${siteUrl}/blog` } },
  openGraph: {
    title: 'Guida a Livigno — Blog | Ironwood Livigno',
    description: 'Guide pratiche su Livigno: come arrivare, sci, mountain bike, trekking e come organizzare al meglio la tua vacanza.',
    url: `${siteUrl}/blog`,
    siteName: 'Ironwood Livigno',
    images: [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630 }],
    locale: 'it_IT',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guida a Livigno — Blog | Ironwood Livigno',
    description: 'Guide pratiche su Livigno: come arrivare, sci, mountain bike, trekking e come organizzare al meglio la tua vacanza.',
    images: [`${siteUrl}/images/og-image.jpg`]
  }
};

export default function BlogIndex() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/it` },
      { '@type': 'ListItem', position: 2, name: 'Guida a Livigno', item: `${siteUrl}/blog` }
    ]
  };

  return (
    <html lang="it">
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <BlogHeader />
        <main className="bg-mist min-h-screen">
          <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-24">
            <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">Guida a Livigno</p>
            <h1 className="font-display text-3xl md:text-5xl text-ink mb-4 leading-tight">
              Consigli pratici per la tua vacanza a Livigno
            </h1>
            <p className="text-ink/70 text-base md:text-lg max-w-2xl mb-14">
              Guide su come arrivare, sciare e vivere Livigno d'estate — scritte da chi ospita viaggiatori in questa
              valle tutto l'anno.
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              {[
                { href: '/inverno', label: 'Inverno a Livigno' },
                { href: '/estate', label: 'Estate a Livigno' },
                { href: '/famiglie', label: 'Famiglie' },
                { href: '/benessere', label: 'Benessere' },
                { href: '/come-arrivare', label: 'Come arrivare' }
              ].map((p) => (
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
              {blogPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
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
                    <p className="text-ink/65 text-xs mb-2">{post.readingTime} di lettura</p>
                    <h2 className="font-display text-xl text-ink mb-2 leading-snug">{post.title}</h2>
                    <p className="text-ink/60 text-sm">{post.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>
        <BlogWhatsAppCta />
        <BlogFooter />
      </body>
    </html>
  );
}
