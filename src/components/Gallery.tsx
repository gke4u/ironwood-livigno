'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';
import { useTilt, TILT_TRANSITION } from './useTilt';

// A full-width feature banner (the apartment's signature shot), a
// deliberately-composed bento grid instead of a CSS-columns masonry — a
// magazine spread, not a stack of thumbnails — then one full-width closing
// shot. The grid itself is a single "big, small, small, small, small" band
// (a clean 2-row/4-column block: one feature-weight photo plus four detail
// shots) followed by four more small shots filling the row below. That
// specific [small×4, big, small×4] order is what keeps CSS Grid's own
// (sparse, left-to-right/top-to-bottom) item placement landing exactly
// where intended with nothing but col-span/row-span classes — no explicit
// grid-column/row coordinates to keep in sync by hand, and no risk of the
// gaps a masonry column that runs short can leave (the problem this
// replaced).
// `alt` stays Italian-only (it's read by screen readers/crawlers, not a
// caption a sighted visitor is meant to read) — `caption`, the text every
// visitor actually sees, comes from the `gallery` translation namespace
// (img{index}_caption) instead, so each locale reads it in its own
// language rather than always seeing the Italian original.
const images = [
  // The apartment's single most representative shot — living room and open
  // kitchen together. Sharing "big" status with the bathroom cell inside
  // the grid still read as one photo among several, so it's pulled out
  // entirely into its own full-width showcase banner above the grid (see
  // `images[0]` usage below) instead of competing for attention as just
  // the largest tile in a field of ten.
  { src: '/images/hero-ironwood.jpg', alt: 'Soggiorno e cucina a vista, appartamento Ironwood a Livigno', w: 1920, h: 1280 },
  { src: '/images/esterno-notte.jpg', alt: 'Esterno dell’appartamento Ironwood a Livigno di sera, sotto la neve', w: 1920, h: 1440 },
  { src: '/images/cucina.jpg', alt: 'Cucina completamente attrezzata nell’appartamento vacanze a Livigno', w: 2000, h: 1333 },
  { src: '/images/bagno-extra.jpg', alt: 'Bagno con doccia in pietra nell’appartamento a Livigno', w: 1333, h: 2000 },
  { src: '/images/dettaglio-vini.jpg', alt: 'Cantinetta vini in cucina nella casa vacanze a Livigno', w: 1333, h: 2000 },
  { src: '/images/bagno-extra2.jpg', alt: 'Dettaglio del secondo bagno nella casa vacanze a Livigno', w: 1333, h: 2000, big: true },
  { src: '/images/soggiorno.jpg', alt: 'Soggiorno con divano e vista sulle Alpi, appartamento a Livigno', w: 1920, h: 1280 },
  { src: '/images/bagno.jpg', alt: 'Uno dei due bagni completi dell’appartamento a Livigno', w: 1168, h: 1752 },
  { src: '/images/cucina-dettaglio.jpg', alt: 'Dettaglio del piano cucina nell’appartamento con cucina attrezzata a Livigno', w: 2000, h: 1500 },
  { src: '/images/appartamento-soggiorno.jpg', alt: 'Zona giorno dell’appartamento a Livigno con vista sulle montagne', w: 2000, h: 1333 },
  { src: '/images/esterno-giorno.jpg', alt: 'Esterno dell’appartamento a Livigno vicino agli impianti, di giorno', w: 1181, h: 787, wide: true }
];

export default function Gallery() {
  const t = useTranslations('gallery');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const imagesWithCaptions = images.map((img, i) => ({ ...img, caption: t(`img${i}_caption`) }));

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, []);
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
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

  const active = activeIndex !== null ? imagesWithCaptions[activeIndex] : null;
  const { onMouseMove: handleCardMouseMove, onMouseLeave: handleCardMouseLeave } = useTilt();

  // The opening (most representative) and closing (whole chalet) shots
  // both live outside the bento grid, each on its own full-width row —
  // `gridImages` is everything in between.
  const featureImage = imagesWithCaptions[0];
  const gridImages = imagesWithCaptions.slice(1, -1);
  // Sized to its real aspect ratio instead of a fixed grid-row height — the
  // only way to show the entire building with zero cropping and no
  // letterbox bars.
  const closingImage = imagesWithCaptions[imagesWithCaptions.length - 1];
  const closingIndex = imagesWithCaptions.length - 1;

  return (
    <section id="galleria" className="bg-mist pt-24 md:pt-32 pb-16 md:pb-20">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-10">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-ink leading-tight">{t('title')}</h2>
        </Reveal>

        {/* The apartment's signature shot, standing alone above the grid at
            full width instead of just being the biggest of several tiles —
            same idle Ken Burns / shine / tilt as the grid's "big" cell, plus
            a permanent (not hover-gated) title treatment so it reads as a
            deliberate cover image, not a photo you have to hover to name. */}
        <Reveal className="mb-3 md:mb-4">
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={TILT_TRANSITION}
            className="rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-xl [transform-style:preserve-3d] will-change-transform"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(0)}
              aria-label={featureImage.alt}
              className="group relative block w-full aspect-[16/9] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-2"
            >
              <Pic
                src={featureImage.src}
                alt={featureImage.alt}
                width={featureImage.w}
                height={featureImage.h}
                sizes="100vw"
                className="w-full h-full object-cover animate-kenburns motion-reduce:animate-none"
              />
              <div
                className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[120%] transition-[transform,opacity] duration-[1100ms] ease-out"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" aria-hidden />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 overflow-hidden">
                <span className="gallery-caption-line block h-px w-10 bg-gold mb-3" aria-hidden />
                <p className="gallery-caption-text font-display text-mist text-2xl md:text-4xl leading-tight">
                  {featureImage.caption}
                </p>
              </div>
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[13vw] md:gap-4 lg:auto-rows-[180px]">
          {gridImages.map((img, i) => (
            <Reveal key={img.src} delay={Math.min(i, 5) * 80} className={img.big ? 'md:col-span-2 md:row-span-2' : ''}>
              {/* Tilt + shine live on this inner div, which also owns the
                  rounded/clip/shadow chrome, so the whole tile tilts as one
                  rigid card instead of the photo rotating inside a clip
                  region that doesn't move with it (which would show gaps at
                  the corners). Reveal's own element stays untouched by any
                  hover transform — its entrance animation drives transform
                  too, and stacking a second transform source on top of that
                  risks the two fighting each other. Only the "big" cell
                  gets the idle Ken Burns zoom: with ten photos in view at
                  once, all of them breathing simultaneously would read as
                  restless rather than alive — reserving it for that one
                  anchor shot (plus the standalone feature banner and
                  closing shot above/below) keeps the rest of the grid calm
                  until a visitor actually hovers one. */}
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={TILT_TRANSITION}
                className="rounded-2xl md:rounded-3xl overflow-hidden shadow-soft w-full h-full hover:shadow-xl [transform-style:preserve-3d] will-change-transform"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(i + 1)}
                  aria-label={img.alt}
                  className="group relative block w-full h-full aspect-square md:aspect-auto cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-2"
                >
                  <Pic
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    sizes={img.big ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                    className={
                      img.big
                        ? 'w-full h-full object-cover animate-kenburns motion-reduce:animate-none'
                        : 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                    }
                  />
                  <div
                    className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[120%] transition-[transform,opacity] duration-[1100ms] ease-out"
                    aria-hidden
                  />
                  {/* Caption on hover — a gradient scrim plus the room name,
                      both fading/rising in together. Static on touch devices
                      with no hover would just never show it, which is fine:
                      the lightbox (a tap away) still names every photo via
                      its alt text read out below. */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                  <p className="absolute bottom-0 left-0 right-0 p-4 md:p-5 font-display text-mist text-sm md:text-base opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    {img.caption}
                  </p>
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-3 md:mt-4">
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={TILT_TRANSITION}
            className="rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-xl [transform-style:preserve-3d] will-change-transform"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(closingIndex)}
              aria-label={closingImage.alt}
              className="group relative block w-full aspect-[1181/787] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-2"
            >
              <Pic
                src={closingImage.src}
                alt={closingImage.alt}
                width={closingImage.w}
                height={closingImage.h}
                sizes="100vw"
                className="w-full h-full object-cover animate-kenburns motion-reduce:animate-none"
              />
              <div
                className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[120%] transition-[transform,opacity] duration-[1100ms] ease-out"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
              <p className="absolute bottom-0 left-0 right-0 p-4 md:p-5 font-display text-mist text-sm md:text-base opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                {closingImage.caption}
              </p>
            </button>
          </div>
        </Reveal>
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
            <p className="text-white/85 font-display text-base">{active.caption}</p>
            <p className="text-white/60 text-sm tabular-nums">
              {activeIndex! + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
