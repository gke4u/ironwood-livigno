import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import { rates } from '@/data/rates';

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
      </div>
    </section>
  );
}
