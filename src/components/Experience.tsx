import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';

export default function Experience() {
  const t = useTranslations('experience');
  const th = useTranslations('hero');

  const points = [
    { title: t('point_1_title'), text: t('point_1_text') },
    { title: t('point_2_title'), text: t('point_2_text') },
    { title: t('point_3_title'), text: t('point_3_text') }
  ];

  return (
    <section id="esperienza" className="bg-mist py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div className="rounded-3xl overflow-hidden shadow-soft aspect-[4/5]">
            <Pic
              src="/images/sauna-vista-montagna.jpg"
              alt="Sauna a infrarossi privata"
              width={2000}
              height={1333}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
              {t('eyebrow')}
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-ink mb-6 leading-tight">
              {t('title')}
            </h2>
            <p className="text-ink/70 text-base md:text-lg mb-10 max-w-md">{t('text')}</p>
          </Reveal>

          <div className="space-y-6">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className="flex gap-4 border-t border-ink/10 pt-6">
                  <span className="font-display text-gold text-2xl leading-none">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-ink mb-1">{p.title}</h3>
                    <p className="text-ink/60 text-sm">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Quick-facts recap: the numbered points above rarely fill the
              same height as the tall 4/5 image next to them, leaving a bare
              gap under the text column on desktop. This closes that gap
              with a scannable summary (same figures as the hero stats,
              still useful here since the hero is long scrolled past by the
              time someone reaches this section). */}
          <Reveal delay={360}>
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 mt-8 pt-6 text-sm text-ink/60">
              <span>{th('stat_sleeps')}</span>
              <span>{th('stat_rooms')}</span>
              <span>{th('stat_distance')}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
