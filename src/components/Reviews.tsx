import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

// Real, verified profile URLs for the platforms named in each review's
// author line (see the matching `sameAs`/`hasMap` entries in
// StructuredData.tsx) — matched by substring since the platform name
// itself ("Google", "Airbnb", "Holidu") is written the same, untranslated,
// across every locale's messages/*.json.
const PLATFORM_LINKS: Record<string, string> = {
  Google: 'https://www.google.com/maps?q=46.525061,10.126967',
  Airbnb: 'https://www.airbnb.com/rooms/1001347662140918475',
  Holidu: 'https://www.holiduhost.com/d/54247934'
};

function linkedAuthor(author: string) {
  const platform = Object.keys(PLATFORM_LINKS).find((p) => author.includes(p));
  if (!platform) return author;
  const [name, ...rest] = author.split(',');
  return (
    <>
      {name.trim()},{' '}
      <a
        href={PLATFORM_LINKS[platform]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-gold transition-colors"
      >
        {rest.join(',').trim()}
      </a>
    </>
  );
}

export default function Reviews() {
  const t = useTranslations('reviews');

  const items = [
    { quote: t('quote1'), author: t('author1') },
    { quote: t('quote2'), author: t('author2') },
    { quote: t('quote3'), author: t('author3') },
    { quote: t('quote4'), author: t('author4') },
    { quote: t('quote5'), author: t('author5') },
    { quote: t('quote6'), author: t('author6') }
  ];

  return (
    <section id="recensioni" className="relative text-mist py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(26,20,15,0.88) 0%, rgba(26,20,15,0.92) 100%), url('/images/livigno-vallata-inverno-bn.jpg')"
        }}
        aria-hidden
      />
      <div className="relative max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-gold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight">{t('title')}</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <Reveal key={item.author} delay={i * 120}>
              <blockquote className="bg-mist/5 border border-mist/10 rounded-3xl p-8 h-full flex flex-col justify-between">
                <p className="font-display italic text-lg md:text-xl leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="text-mist/60 text-sm tracking-wide">{linkedAuthor(item.author)}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-mist/40 text-xs italic">{t('disclaimer')}</p>
      </div>
    </section>
  );
}
