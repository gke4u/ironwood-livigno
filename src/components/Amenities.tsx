import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

// A small gold check instead of a plain dot — reads as "this is included"
// rather than just a generic list marker, and matches the checkmark
// language already used for trust points elsewhere on the page
// (BookingSection's "why book with us" list).
function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold shrink-0 mt-0.5"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// Breakfast and e-bike rental are the only two "amenities" that are actually
// paid, on-request extras (booked and settled separately — see
// ExtraServices), not things included in the stay like everything else in
// this list. A plain checkmark next to them would read as "included", so
// they get a small info mark that links down to the #servizi-extra section
// where the pricing and booking details actually live.
type AmenityItem = string | { label: string; extra: true };

function InfoIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 8v.01" />
    </svg>
  );
}

function Group({
  title,
  items,
  delay,
  extraNote
}: {
  title: string;
  items: AmenityItem[];
  delay: number;
  extraNote: string;
}) {
  return (
    <Reveal delay={delay}>
      <div className="border-t border-mist/15 pt-6">
        <h3 className="font-display text-lg text-gold mb-4">{title}</h3>
        <ul className="space-y-3">
          {items.map((item) => {
            const label = typeof item === 'string' ? item : item.label;
            const isExtra = typeof item === 'object' && item.extra;
            return (
              <li key={label} className="flex items-start gap-2.5 text-mist/85 text-sm">
                <CheckIcon />
                <span className="inline-flex items-center gap-1.5">
                  {label}
                  {isExtra && (
                    <a
                      href="#servizi-extra"
                      title={extraNote}
                      aria-label={extraNote}
                      className="text-gold/70 hover:text-gold transition-colors"
                    >
                      <InfoIcon />
                    </a>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Amenities() {
  const t = useTranslations('amenities');
  const extraNote = t('extra_note');

  const groups = [
    {
      title: t('group1_title'),
      items: [t('g1_1'), t('g1_2'), t('g1_3'), t('g1_4'), t('g1_5'), { label: t('g1_6'), extra: true as const }]
    },
    { title: t('group2_title'), items: [t('g2_1'), t('g2_2'), t('g2_3'), t('g2_4')] },
    {
      title: t('group3_title'),
      items: [t('g3_1'), t('g3_2'), t('g3_3'), t('g3_4'), { label: t('g3_5'), extra: true as const }]
    },
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
            <Group key={g.title} title={g.title} items={g.items} delay={i * 100} extraNote={extraNote} />
          ))}
        </div>
      </div>
    </section>
  );
}
