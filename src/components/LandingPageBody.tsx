import type { LandingPage } from '@/content/landingPages';
import Pic from './Pic';

// Shared body for the standalone SEO landing pages (/inverno, /estate,
// /famiglie, /benessere, /come-arrivare). Header/footer/WhatsApp CTA come
// from BlogChrome — this only renders the article content itself, kept
// separate so each page.tsx stays a thin wrapper around its data.
export default function LandingPageBody({ page }: { page: LandingPage }) {
  return (
    <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-20">
      <a href="/it" className="text-brick text-sm font-medium hover:underline">
        ← Torna alla home
      </a>

      <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mt-6 mb-3">{page.eyebrow}</p>
      <h1 className="font-display text-3xl md:text-5xl text-ink mb-8 leading-tight max-w-3xl">{page.title}</h1>

      <div className="rounded-3xl overflow-hidden shadow-soft mb-10 max-w-3xl aspect-[16/9]">
        <Pic
          src={page.image.src}
          alt={page.image.alt}
          width={page.image.w}
          height={page.image.h}
          loading="eager"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-3xl">
        <p className="text-ink/80 text-base md:text-lg leading-relaxed mb-10">{page.intro}</p>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-10">
            {page.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-xl md:text-2xl text-ink mb-4">{section.heading}</h2>
                <div className="space-y-4">
                  {section.body.map((para, i) => (
                    <p key={i} className="text-ink/75 text-base leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-soft p-6 sticky top-24">
              <p className="font-display text-lg text-ink mb-4">Perché Ironwood</p>
              <ul className="space-y-3 mb-6">
                {page.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-ink/75 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brick shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/it#prenota"
                className="block text-center bg-brick text-mist rounded-full px-6 py-3 font-medium hover:bg-brick/90 transition-colors"
              >
                {page.ctaText}
              </a>
            </div>
          </aside>
        </div>

        {page.testimonials && page.testimonials.length > 0 && (
          <div className="mt-14 grid sm:grid-cols-3 gap-5">
            {page.testimonials.map((t) => (
              <blockquote key={t.author} className="bg-white rounded-2xl shadow-soft p-6 flex flex-col gap-3">
                <p className="text-ink/75 text-sm leading-relaxed">"{t.quote}"</p>
                <cite className="text-ink/50 text-xs not-italic mt-auto">— {t.author}</cite>
              </blockquote>
            ))}
          </div>
        )}

        {page.internalLinks && page.internalLinks.length > 0 && (
          <div className="mt-14">
            <p className="text-ink/50 text-xs uppercase tracking-widest mb-3">Continua a scoprire Ironwood Livigno</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {page.internalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-brick text-sm font-medium hover:underline underline-offset-2">
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {page.faq && page.faq.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl md:text-2xl text-ink mb-6">Domande frequenti</h2>
            <div className="space-y-6">
              {page.faq.map((item) => (
                <div key={item.q}>
                  <h3 className="font-medium text-ink mb-1.5">{item.q}</h3>
                  <p className="text-ink/70 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 p-8 bg-white rounded-3xl shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ink/70 text-sm">{page.relatedLink.label}</p>
          <a
            href={page.relatedLink.href}
            className="border border-ink/20 text-ink rounded-full px-6 py-3 font-medium hover:bg-ink/5 transition-colors whitespace-nowrap"
          >
            Scopri di più →
          </a>
        </div>
      </div>
    </div>
  );
}
