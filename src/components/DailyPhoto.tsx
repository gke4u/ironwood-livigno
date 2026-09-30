import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import DailyPhotoDate from './DailyPhotoDate';
import ProtectedPhoto from './ProtectedPhoto';

// "Photo of the day": /foto-del-giorno is served by the Worker (see
// worker/index.ts), which picks one of the photos uploaded at /admin and
// switches to the next one every midnight, Italian time. The page itself
// stays fully static — only the image behind this fixed URL changes.
// Photo on one side, today's date in large type on the other (stacked on
// phones), so the date never covers the picture.
export default function DailyPhoto() {
  const t = useTranslations('dailyPhoto');
  return (
    <section id="foto-del-giorno" className="bg-mist border-t border-ink/[0.06] py-20 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-10 grid md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] gap-8 md:gap-14 items-center">
        <Reveal className="md:order-2">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{t('eyebrow')}</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-5 leading-tight">{t('title')}</h2>
          <DailyPhotoDate className="block font-display text-4xl md:text-5xl text-brick leading-tight mb-5" />
          <p className="text-ink/70 text-base md:text-lg leading-relaxed">{t('text')}</p>
        </Reveal>
        <Reveal delay={120} className="md:order-1">
          <ProtectedPhoto alt={t('alt')} enlargeLabel={t('enlarge')} closeLabel={t('close')} />
        </Reveal>
      </div>
    </section>
  );
}
