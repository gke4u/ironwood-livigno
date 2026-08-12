import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

function Group({ title, items, delay }: { title: string; items: string[]; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div className="border-t border-mist/15 pt-6">
        <h3 className="font-display text-lg text-gold mb-4">{title}</h3>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-mist/85 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-mist/40 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Amenities() {
  const t = useTranslations('amenities');

  const groups = [
    { title: t('group1_title'), items: [t('g1_1'), t('g1_2'), t('g1_3'), t('g1_4'), t('g1_5')] },
    { title: t('group2_title'), items: [t('g2_1'), t('g2_2'), t('g2_3'), t('g2_4')] },
    { title: t('group3_title'), items: [t('g3_1'), t('g3_2'), t('g3_3'), t('g3_4'), t('g3_5')] },
    { title: t('group4_title'), items: [t('g4_1'), t('g4_2'), t('g4_3'), t('g4_4')] }
  ];

  return (
    <section id="servizi" className="bg-wood text-mist py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-gold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl mb-5 leading-tight">{t('title')}</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {groups.map((g, i) => (
            <Group key={g.title} title={g.title} items={g.items} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
