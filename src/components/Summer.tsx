'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';

const images = [
  { src: '/images/lago-livigno-panorama.jpg', alt: 'Panorama sul Lago di Livigno', w: 1080, h: 720 },
  { src: '/images/mountain-bike-estate.jpg', alt: 'Mountain bike in alta quota d’estate', w: 960, h: 640 },
  { src: '/images/arnica-fiori-alpini-livigno.jpg', alt: 'Fiori alpini di arnica a Livigno', w: 1200, h: 1053 },
  { src: '/images/mucca-alpeggio-livigno.jpg', alt: 'Mucche al pascolo negli alpeggi di Livigno', w: 1119, h: 1200 }
];

// Winter counterpart to the summer gallery above, shown right below it so
// the section makes its point visually: Livigno isn't just a winter
// destination, but winter itself stays just as magical.
const winterImages = [
  { src: '/images/livigno-notte-neve-luci.jpg', alt: 'Via centrale di Livigno di notte durante una nevicata, con luci natalizie', w: 1400, h: 1594 },
  { src: '/images/livigno-skilift-vallata-nebbia.jpg', alt: 'Vista dalla seggiovia sulla vallata di Livigno tra le nuvole', w: 1400, h: 1143 },
  { src: '/images/livigno-ghiaccioli-vista-vallata.jpg', alt: 'Ghiaccioli con vista sulla vallata innevata di Livigno', w: 1400, h: 1755 },
  { src: '/images/cane-neve-livigno.jpg', alt: 'Cane di razza bovaro del bernese coperto di neve per le vie di Livigno', w: 1400, h: 1299 }
];

// Both rows flattened into one browsable sequence — the same "click a
// thumbnail, arrow through the rest" pattern as the main Gallery and the
// extra-services/rooms cards, rather than leaving this the one photo grid
// on the site you can look at but not actually see full-size.
const allPhotos = [...images, ...winterImages];

export default function Summer() {
  const t = useTranslations('summer');
  const tg = useTranslations('gallery');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + allPhotos.length) % allPhotos.length));
  }, []);
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % allPhotos.length));
  }, []);

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

  const active = activeIndex !== null ? allPhotos[activeIndex] : null;

  const renderGrid = (photos: typeof images, offset: number) =>
    photos.map((img, i) => (
      <Reveal key={img.src} delay={i * 90} className="rounded-2xl overflow-hidden aspect-[3/4]">
        <button
          type="button"
          onClick={() => setActiveIndex(offset + i)}
          aria-label={img.alt}
          className="group relative block w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-inset"
        >
          <Pic
            src={img.src}
            alt={img.alt}
            width={img.w}
            height={img.h}
            sizes="(min-width: 768px) 25vw, 50vw"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors duration-500" aria-hidden />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" aria-hidden>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-ink shadow-soft">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <line x1="15.5" y1="15.5" x2="21" y2="21" />
                <line x1="10.5" y1="7.5" x2="10.5" y2="13.5" />
                <line x1="7.5" y1="10.5" x2="13.5" y2="10.5" />
              </svg>
            </span>
          </div>
        </button>
      </Reveal>
    ));

  return (
    <section id="estate" className="bg-mist py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-ink mb-6 leading-tight">
            {t('title')}
          </h2>
          <p className="text-ink/70 text-base md:text-lg max-w-xl">{t('text')}</p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{renderGrid(images, 0)}</div>

        <Reveal delay={380}>
          <p className="mt-8 text-ink/65 text-sm tracking-wide">{t('ebike_note')}</p>
        </Reveal>

        <Reveal delay={420} className="mt-14">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
            {t('winter_caption')}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{renderGrid(winterImages, images.length)}</div>
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
            aria-label={tg('close_label')}
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
            aria-label={tg('prev_label')}
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
            aria-label={tg('next_label')}
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
            <p className="text-white/60 text-sm tabular-nums">
              {activeIndex! + 1} / {allPhotos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
