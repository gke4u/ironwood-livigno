import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import { rates } from '@/data/rates';

// True for every season right now (no confirmed 2026/27 rate card yet — see
// src/data/rates.ts). A 4-column table with "su richiesta" repeated in
// every price cell and "—" in every nights cell reads as data that's
// missing, not a deliberate choice — the editorial layout below says the
// same thing once, as the actual message ("we quote personally, fast")
// instead of an empty grid. The table path stays intact and takes over
// automatically the moment even one season gets a real number.
const allOnRequest = rates.every((season) => season.pricePerNight == null);

export default function RatesTable() {
  const t = useTranslations('rates');

  return (
    <section id="tariffe" className="bg-white py-24 md:py-28">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-10">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{t('eyebrow')}</p>
          <h2 className="font-display text-3xl md:text-5xl text-ink mb-5 leading-tight">{t('title')}</h2>
          <p className="text-ink/70 text-base md:text-lg">{t('text')}</p>
        </Reveal>

        {allOnRequest ? (
          <>
            <Reveal delay={100}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rates.map((season) => (
                  <div key={season.id} className="rounded-2xl border border-ink/10 bg-mist/40 p-6">
                    <span className="block h-1 w-8 rounded-full bg-gold mb-4" aria-hidden />
                    <h3 className="font-display text-lg text-ink mb-1.5">{t(`season_${season.id}_label`)}</h3>
                    <p className="text-ink/60 text-sm">{t(`season_${season.id}_period`)}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6 rounded-2xl border border-ink/10 bg-mist/40 px-7 py-6">
                <p className="font-display text-xl text-ink flex-1">{t('price_on_request')}</p>
                <a
                  href="#prenota"
                  className="inline-flex items-center justify-center gap-2 bg-brick text-mist rounded-full px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-brick/90 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-soft shrink-0"
                >
                  {t('cta')} →
                </a>
              </div>
              <p className="text-ink/65 text-xs mt-4 max-w-2xl">{t('disclaimer')}</p>
            </Reveal>
          </>
        ) : (
          <>
            <Reveal delay={100}>
              <div className="overflow-x-auto rounded-2xl border border-ink/10 shadow-soft">
                <table className="w-full text-left border-collapse min-w-[520px]">
                  <thead>
                    <tr className="bg-mist">
                      <th scope="col" className="px-5 py-4 text-sm font-medium text-ink/70">
                        {t('th_season')}
                      </th>
                      <th scope="col" className="px-5 py-4 text-sm font-medium text-ink/70">
                        {t('th_period')}
                      </th>
                      <th scope="col" className="px-5 py-4 text-sm font-medium text-ink/70">
                        {t('th_price')}
                      </th>
                      <th scope="col" className="px-5 py-4 text-sm font-medium text-ink/70">
                        {t('th_min_nights')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((season, i) => (
                      <tr key={season.id} className={i % 2 === 1 ? 'bg-mist/40' : undefined}>
                        <th scope="row" className="px-5 py-4 text-ink font-medium border-t border-ink/10">
                          {t(`season_${season.id}_label`)}
                        </th>
                        <td className="px-5 py-4 text-ink/70 border-t border-ink/10">
                          {t(`season_${season.id}_period`)}
                        </td>
                        <td className="px-5 py-4 text-ink border-t border-ink/10">
                          {season.pricePerNight != null ? (
                            <>
                              €{season.pricePerNight}{' '}
                              <span className="text-ink/65">{t('per_night_suffix')}</span>
                            </>
                          ) : (
                            <span className="text-ink/65">{t('price_on_request')}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-ink/70 border-t border-ink/10">
                          {season.minNights != null ? `${season.minNights} ${t('nights_suffix')}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <p className="text-ink/65 text-xs mt-4 max-w-2xl">{t('disclaimer')}</p>
              <a
                href="#prenota"
                className="inline-flex items-center gap-2 mt-5 text-brick font-medium hover:underline underline-offset-4"
              >
                {t('cta')} →
              </a>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
