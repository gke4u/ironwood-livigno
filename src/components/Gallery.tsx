'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';
import PhotoLightbox from './PhotoLightbox';
import { usePhotoLightbox } from './usePhotoLightbox';
import { useTilt, TILT_TRANSITION } from './useTilt';
import { galleryImages as images } from '@/data/gallery-images';

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
// The apartment's single most representative shot (images[0]) — living
// room and open kitchen together — is pulled out entirely into its own
// full-width showcase banner above the grid instead of competing for
// attention as just the largest tile in a field of ten.

export default function Gallery() {
  const t = useTranslations('gallery');
  const imagesWithCaptions = images.map((img, i) => ({ ...img, caption: t(`img${i}_caption`) }));
  const { activeIndex, open, close, showPrev, showNext } = usePhotoLightbox(images.length);
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
              onClick={() => open(0)}
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
                  onClick={() => open(i + 1)}
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
              onClick={() => open(closingIndex)}
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
        <PhotoLightbox
          photo={active}
          index={activeIndex!}
          total={images.length}
          onClose={close}
          onPrev={showPrev}
          onNext={showNext}
          closeLabel={t('close_label')}
          prevLabel={t('prev_label')}
          nextLabel={t('next_label')}
        />
      )}
    </section>
  );
}
