'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';

const TOUR_SRC = 'https://app.lapentor.com/sphere/appartamento-guana';

// The 360° tour itself lives entirely on Lapentor's servers (shot a couple
// of years ago) — nothing to host or optimize here. What we control is how
// it's presented: a click-to-load poster (same pattern as MapEmbed's
// consent gate) instead of an eager iframe, so this heavy third-party
// viewer never adds to the initial page weight that the mobile LCP work
// elsewhere in this codebase was all about protecting.
export default function VirtualTour() {
  const t = useTranslations('virtualtour');
  const [loaded, setLoaded] = useState(false);

  return (
    <section id="tour-virtuale" className="bg-mist border-t border-ink/[0.06] pt-14 md:pt-20 pb-16 md:pb-20">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-10 md:mb-14">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{t('eyebrow')}</p>
          <h2 className="font-display text-3xl md:text-5xl text-ink mb-5 leading-tight">{t('title')}</h2>
          <p className="text-ink/70 text-base md:text-lg">{t('text')}</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative w-full aspect-video rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-soft border border-ink/[0.06] bg-ink">
            {loaded ? (
              <iframe
                src={TOUR_SRC}
                title={t('iframe_title')}
                className="absolute inset-0 w-full h-full border-0"
                allow="xr-spatial-tracking; gyroscope; accelerometer"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="group absolute inset-0 w-full h-full text-left"
                aria-label={t('open_button')}
              >
                <Pic
                  src="/images/appartamento-soggiorno.jpg"
                  alt=""
                  width={2000}
                  height={1333}
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-ink/40 group-hover:bg-ink/50 transition-colors"
                  aria-hidden
                />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                  <span className="flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-mist/15 backdrop-blur-sm border border-mist/40 text-mist font-display text-sm tracking-wide group-hover:scale-110 group-hover:bg-mist/25 transition-all">
                    360°
                  </span>
                  <span className="text-mist text-lg md:text-xl font-medium [text-shadow:0_1px_4px_rgba(36,28,21,0.7)]">
                    {t('open_button')}
                  </span>
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
