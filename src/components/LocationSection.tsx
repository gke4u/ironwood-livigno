import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Reveal from './Reveal';

// Code-split out of the initial bundle (see BookingSection.tsx for the same
// pattern/rationale) — this section sits below several others on the
// homepage, so its JS doesn't need to be ready before the hero paints.
const MapEmbed = dynamic(() => import('./MapEmbed'));

export default function LocationSection() {
  const t = useTranslations('location');
  const points = [t('point_1'), t('point_2'), t('point_3'), t('point_4')];

  return (
    <section id="posizione" className="bg-wood-dark text-mist py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center">
        <Reveal>
          <p className="text-gold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl mb-8 leading-tight">{t('title')}</h2>
          <ul className="space-y-4 mb-8">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-mist/85">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="text-mist/60 text-sm tracking-wide">{t('address')}</p>
        </Reveal>

        <Reveal delay={150}>
          <div className="rounded-3xl overflow-hidden shadow-soft aspect-[4/3] bg-mist/10">
            <MapEmbed />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
