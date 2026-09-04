'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';
import PhotoLightbox from './PhotoLightbox';
import { usePhotoLightbox } from './usePhotoLightbox';
import { useTilt, TILT_TRANSITION } from './useTilt';

// Breakfast and e-bike rental are paid, on-request extras — not included in
// the stay. Each card states the price up front (per person, per day) and
// makes clear these must be booked in advance through the request form,
// with payment handled on-site. Previously this section only said "on
// request" without pricing, which read as vague; now it's unambiguous.
const breakfastPhotos = [
  { src: '/images/colazione-croissant.jpg', alt: 'Vassoio di croissant per la colazione a Livigno', w: 1400, h: 935 },
  { src: '/images/colazione-buffet.jpg', alt: 'Buffet di colazione con affettati e formaggi tipici', w: 1400, h: 932 },
  { src: '/images/colazione-tavola.jpg', alt: 'Sala colazioni della struttura convenzionata vicino all’appartamento', w: 1400, h: 932 }
];

const ebikePhotos = [
  { src: '/images/ebike-laterale.jpg', alt: 'E-bike a noleggio per gli ospiti dell’appartamento di Livigno, vista laterale', w: 900, h: 700 },
  { src: '/images/ebike-frontale.jpg', alt: 'E-bike a noleggio per gli ospiti dell’appartamento di Livigno, vista frontale', w: 900, h: 700 },
  { src: '/images/ebike-dettaglio.jpg', alt: 'Dettaglio del telaio e della sospensione dell’e-bike a noleggio', w: 1333, h: 522 }
];

export default function ExtraServices() {
  const t = useTranslations('extras');
  // Reuses the main Gallery's close/prev/next labels rather than adding a
  // parallel set under "extras" in all twelve locale files for a lightbox
  // that behaves identically.
  const tg = useTranslations('gallery');

  const items = [
    {
      key: 'breakfast',
      title: t('breakfast_title'),
      price: t('breakfast_price'),
      unit: t('breakfast_price_unit'),
      text: t('breakfast_text'),
      photos: breakfastPhotos,
      icon: <path d="M6 8h12l-1 9a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3L6 8Zm2-4h8m-4 0v4" />
    },
    {
      key: 'ebike',
      title: t('ebike_title'),
      price: t('ebike_price'),
      unit: t('ebike_price_unit'),
      text: t('ebike_text'),
      photos: ebikePhotos,
      icon: (
        <>
          <circle cx="6" cy="17" r="3" />
          <circle cx="18" cy="17" r="3" />
          <path d="M6 17 10 8h5l3 5m-8-5-2 5h7M9 17h9" />
        </>
      )
    }
  ];

  // Every photo across both cards, flattened into one sequence so the
  // lightbox can page through the whole set — the same "click a thumbnail,
  // arrow through the rest" browse the main Gallery section already uses,
  // rather than a second, more limited lightbox pattern just for this
  // section. Each photo carries its parent item's title as a caption.
  const allPhotos = items.flatMap((item) => item.photos.map((photo) => ({ ...photo, caption: item.title })));
  const itemOffsets = items.reduce<number[]>((offsets, item, i) => {
    offsets.push(i === 0 ? 0 : offsets[i - 1] + items[i - 1].photos.length);
    return offsets;
  }, []);

  const { activeIndex, open, close, showPrev, showNext } = usePhotoLightbox(allPhotos.length);
  const active = activeIndex !== null ? allPhotos[activeIndex] : null;
  const { onMouseMove: handleCardMouseMove, onMouseLeave: handleCardMouseLeave } = useTilt();

  return (
    <section id="servizi-extra" className="bg-mist py-20 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-10">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-ink mb-4 leading-tight">{t('title')}</h2>
          <p className="text-ink/65 text-base">{t('subtitle')}</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
          {items.map((item, i) => {
            const offset = itemOffsets[i];
            return (
              <Reveal key={item.key} delay={i * 100}>
                {/* Tilt + shadow live on this inner div, not on Reveal's own
                    wrapper — Reveal's entrance animation also drives
                    transform, and stacking hover/pointer transforms on top
                    of that risks the animation's forwards-filled transform
                    fighting them. Transform is written directly by the
                    mousemove handler (see canTiltRef above), not by a
                    Tailwind hover: class, so its own transition duration is
                    set inline rather than via `transition-all` — a single
                    faster easing for the tilt itself, independent of the
                    slower shadow fade. */}
                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  style={TILT_TRANSITION}
                  className="rounded-3xl shadow-soft bg-white overflow-hidden flex flex-col h-full hover:shadow-xl [transform-style:preserve-3d] will-change-transform"
                >
                  {/* A big, full-bleed hero shot (with the item name revealed
                      on hover, magazine-style) instead of three equally-
                      cropped squares — food and the e-bikes need room to
                      actually look appetizing/enticing, not just be legible.
                      Two smaller detail shots underneath keep the "more
                      photos exist" cue without competing with the hero for
                      attention. The price and photo-count badges stay
                      visible without hovering — the price is the strongest
                      reason to book, and touch devices never see :hover. */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => open(offset)}
                      aria-label={item.photos[0].alt}
                      className="group absolute inset-0 block w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-inset"
                    >
                      {/* A slow, continuous Ken Burns zoom (same
                          animate-kenburns used on the page hero) instead of
                          a hover-only scale — the photo stays alive even
                          before anyone's cursor reaches it, which is what
                          actually catches the eye while scrolling past.
                          Paired with a one-shot diagonal light sweep on
                          hover for a glossy, "look closer" cue. */}
                      <Pic
                        src={item.photos[0].src}
                        alt={item.photos[0].alt}
                        width={item.photos[0].w}
                        height={item.photos[0].h}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="w-full h-full object-cover animate-kenburns motion-reduce:animate-none"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[120%] transition-[transform,opacity] duration-[1100ms] ease-out"
                        aria-hidden
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        aria-hidden
                      />
                      <div className="absolute bottom-4 left-5 right-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <span className="block h-px w-8 bg-gold mb-2" aria-hidden />
                        <p className="font-display text-mist text-2xl md:text-3xl leading-tight">{item.title}</p>
                      </div>
                    </button>

                    <div className="absolute top-4 left-4 rounded-full bg-ink/85 backdrop-blur-sm border border-gold/40 px-4 py-1.5 pointer-events-none shadow-[0_0_24px_rgba(201,160,89,0.45)]">
                      <span className="font-display text-gold text-base md:text-lg">{item.price}</span>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-ink/70 backdrop-blur-sm px-2.5 py-1 pointer-events-none">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-mist" aria-hidden>
                        <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
                        <circle cx="12" cy="13.5" r="3.2" />
                      </svg>
                      <span className="text-mist text-xs tabular-nums">{item.photos.length}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {item.photos.slice(1).map((photo, j) => (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={() => open(offset + 1 + j)}
                        aria-label={photo.alt}
                        className="group relative block aspect-[4/3] overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-inset"
                      >
                        <Pic
                          src={photo.src}
                          alt={photo.alt}
                          width={photo.w}
                          height={photo.h}
                          sizes="(min-width: 768px) 25vw, 50vw"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors duration-500" aria-hidden />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" aria-hidden>
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-ink shadow-soft">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <circle cx="10.5" cy="10.5" r="6.5" />
                              <line x1="15.5" y1="15.5" x2="21" y2="21" />
                              <line x1="10.5" y1="7.5" x2="10.5" y2="13.5" />
                              <line x1="7.5" y1="10.5" x2="13.5" y2="10.5" />
                            </svg>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start gap-3 mb-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-brick shrink-0 mt-0.5"
                        aria-hidden
                      >
                        {item.icon}
                      </svg>
                      <h3 className="font-display text-lg text-ink">{item.title}</h3>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-display text-2xl text-brick">{item.price}</span>
                      <span className="text-ink/65 text-xs">{item.unit}</span>
                    </div>

                    <p className="text-ink/65 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200} className="mt-6 max-w-3xl">
          <p className="text-ink/65 text-sm leading-relaxed">{t('booking_note')}</p>
        </Reveal>

        <Reveal delay={240} className="mt-4">
          <a
            href="#prenota"
            className="inline-flex items-center gap-2 text-brick font-medium underline underline-offset-4 decoration-brick/40 hover:decoration-brick transition-colors"
          >
            {t('cta')} →
          </a>
        </Reveal>
      </div>

      {active && (
        <PhotoLightbox
          photo={active}
          index={activeIndex!}
          total={allPhotos.length}
          onClose={close}
          onPrev={showPrev}
          onNext={showNext}
          closeLabel={tg('close_label')}
          prevLabel={tg('prev_label')}
          nextLabel={tg('next_label')}
        />
      )}
    </section>
  );
}
