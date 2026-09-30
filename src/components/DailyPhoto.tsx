import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import DailyPhotoDate from './DailyPhotoDate';

// "Photo of the day": /foto-del-giorno is served by the Worker (see
// worker/index.ts), which picks one of the photos uploaded at /admin and
// switches to the next one every midnight, Italian time. The page itself
// stays fully static — only the image behind this fixed URL changes.
export default function DailyPhoto() {
  const t = useTranslations('dailyPhoto');
  return (
    <section id="foto-del-giorno" className="bg-mist py-20 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-10">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{t('eyebrow')}</p>
          <h2 className="font-display text-3xl md:text-5xl text-ink mb-5 leading-tight">{t('title')}</h2>
          <p className="text-ink/70 text-base md:text-lg leading-relaxed">{t('text')}</p>
        </Reveal>
        <Reveal delay={120}>
          <figure className="relative rounded-3xl overflow-hidden shadow-soft aspect-[4/3] md:aspect-[16/9] bg-ink/5">
            {/* A plain <img>: the URL is dynamic (one photo per day), so there
                are no pre-built responsive variants for Pic to point at. The
                Worker already serves it compressed, max 1600 px wide. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/foto-del-giorno"
              alt={t('alt')}
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <DailyPhotoDate />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
