'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';

// The hero photo, repeated here as a large featured image instead of the
// small grid thumbnails below it — on request, to give the site's most
// important shot real visual weight in the gallery instead of just being
// one tile among ten. Kept as the first slide in the lightbox (index 0);
// the grid below starts at index 1.
const heroFeature = {
  src: '/images/hero-ironwood.jpg',
  alt: 'Ironwood Livigno di sera, sotto la neve, a 100 m dagli impianti di risalita',
  w: 1920,
  h: 1280
};

const images = [
  { src: '/images/esterno-notte.jpg', alt: 'Esterno dell’appartamento Ironwood a Livigno di sera, sotto la neve', w: 1920, h: 1440 },
  { src: '/images/cucina.jpg', alt: 'Cucina completamente attrezzata nell’appartamento vacanze a Livigno', w: 2000, h: 1333 },
  { src: '/images/bagno-extra.jpg', alt: 'Bagno con doccia in pietra nell’appartamento a Livigno', w: 1333, h: 2000 },
  { src: '/images/dettaglio-vini.jpg', alt: 'Cantinetta vini in cucina nella casa vacanze a Livigno', w: 1333, h: 2000 },
  { src: '/images/soggiorno.jpg', alt: 'Soggiorno con divano e vista sulle Alpi, appartamento a Livigno', w: 1920, h: 1280 },
  { src: '/images/cucina-dettaglio.jpg', alt: 'Dettaglio del piano cucina nell’appartamento con cucina attrezzata a Livigno', w: 2000, h: 1500 },
  { src: '/images/appartamento-soggiorno.jpg', alt: 'Zona giorno dell’appartamento a Livigno con vista sulle montagne', w: 2000, h: 1333 },
  { src: '/images/bagno.jpg', alt: 'Uno dei due bagni completi dell’appartamento a Livigno', w: 1168, h: 1752 },
  { src: '/images/bagno-extra2.jpg', alt: 'Dettaglio del secondo bagno nella casa vacanze a Livigno', w: 1333, h: 2000 },
  { src: '/images/esterno-giorno.jpg', alt: 'Esterno dell’appartamento a Livigno vicino agli impianti, di giorno', w: 1181, h: 787 }
];

const allImages = [heroFeature, ...images];

export default function Gallery() {
  const t = useTranslations('gallery');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + allImages.length) % allImages.length));
  }, []);
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % allImages.length));
  }, []);

  // Lock page scroll while the lightbox is open and wire up keyboard
  // controls (Esc to close, arrow keys to browse other photos).
  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, close, showPrev, showNext]);

  const active = activeIndex !== null ? allImages[activeIndex] : null;

  return (
    <section id="galleria" className="bg-mist py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-10">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-ink leading-tight">{t('title')}</h2>
        </Reveal>

        {/* The hero shot, large and given the same dark bottom gradient it
            wears on the hero itself — this is the site's single most
            important photo, so it gets a full-width feature spot ahead of
            the grid instead of being just another small tile. */}
        <Reveal className="mb-4 md:mb-6">
          <button
            type="button"
            onClick={() => setActiveIndex(0)}
            aria-label={heroFeature.alt}
            className="group relative block w-full rounded-3xl overflow-hidden shadow-soft cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-2"
          >
            <div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
              <Pic
                src={heroFeature.src}
                alt={heroFeature.alt}
                width={heroFeature.w}
                height={heroFeature.h}
                sizes="100vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" aria-hidden />
          </button>
        </Reveal>

        {/* Masonry via CSS columns instead of a fixed-height grid: every
            photo keeps its own natural aspect ratio (no object-cover
            cropping), and the column-balancing naturally produces a varied,
            non-repetitive mosaic instead of a rigid uniform grid. */}
        <div className="columns-2 md:columns-4 gap-4">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={i * 80} className="mb-4 break-inside-avoid rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveIndex(i + 1)}
                aria-label={img.alt}
                className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-2 rounded-2xl"
              >
                <Pic
                  src={img.src}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="w-full h-auto block hover:scale-105 transition-transform duration-700"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 md:p-10 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t('close_label')}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/90 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label={t('prev_label')}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label={t('next_label')}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            className="max-w-[92vw] max-h-[88vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Pic
              key={active.src}
              src={active.src}
              alt={active.alt}
              width={active.w}
              height={active.h}
              loading="eager"
              className="max-w-[92vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg"
            />
            <p className="text-white/70 text-sm tabular-nums">
              {activeIndex! + 1} / {allImages.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
