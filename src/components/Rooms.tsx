'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';
import PhotoLightbox from './PhotoLightbox';
import { usePhotoLightbox } from './usePhotoLightbox';
import { useTilt, TILT_TRANSITION } from './useTilt';

export default function Rooms() {
  const t = useTranslations('rooms');
  // Reuses the main Gallery's close/prev/next labels, same as ExtraServices
  // — a lightbox that behaves identically shouldn't need its own copy of
  // the same three strings in all twelve locale files.
  const tg = useTranslations('gallery');
  const { onMouseMove: handleCardMouseMove, onMouseLeave: handleCardMouseLeave } = useTilt();

  const rooms = [
    {
      title: t('room1_title'),
      text: t('room1_text'),
      img: '/images/camera3.jpg',
      w: 2000,
      h: 1333
    },
    {
      title: t('room2_title'),
      text: t('room2_text'),
      img: '/images/camera2.jpg',
      w: 1905,
      h: 1269
    },
    {
      title: t('room3_title'),
      text: t('room3_text'),
      img: '/images/camera1.jpg',
      w: 1905,
      h: 1269
    }
  ];

  const { activeIndex, open, close, showPrev, showNext } = usePhotoLightbox(rooms.length);
  const active = activeIndex !== null ? rooms[activeIndex] : null;

  return (
    // Follows Gallery, which shares this same bg-mist — a full py-24/32 on
    // both sides stacked into ~250px of blank cream with nothing to anchor
    // the eye (Gallery ends on a photo, but the next visible thing here was
    // plain text, so the seam read as a gap rather than a new section).
    // Tightening the top and adding a hairline rule gives the transition an
    // actual edge instead of relying on whitespace alone to signal it.
    <section id="camere" className="bg-mist border-t border-ink/[0.06] pt-14 md:pt-20 pb-24 md:pb-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-ink mb-5 leading-tight">
            {t('title')}
          </h2>
          <p className="text-ink/70 text-base md:text-lg">{t('text')}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room, i) => (
            <Reveal key={room.title + i} delay={i * 120}>
              {/* Same treatment as the extra-services cards: idle Ken Burns
                  motion so the photo isn't just a still while scrolling
                  past, a diagonal shine sweep and cursor-tracked 3D tilt on
                  hover, and a click-through to a full-screen view instead
                  of a photo that only ever looks the way it does here. */}
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={TILT_TRANSITION}
                className="rounded-3xl overflow-hidden shadow-soft h-full flex flex-col hover:shadow-xl [transform-style:preserve-3d] will-change-transform"
              >
                <button
                  type="button"
                  onClick={() => open(i)}
                  aria-label={`${room.title} — Ironwood Livigno`}
                  className="group relative block aspect-[4/3] overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-inset"
                >
                  <Pic
                    src={room.img}
                    alt={`${room.title} — Ironwood Livigno`}
                    width={room.w}
                    height={room.h}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="w-full h-full object-cover animate-kenburns motion-reduce:animate-none"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[120%] transition-[transform,opacity] duration-[1100ms] ease-out"
                    aria-hidden
                  />
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
                <div className="bg-white p-6 flex-1">
                  <h3 className="font-display text-xl text-ink mb-2">{room.title}</h3>
                  <p className="text-ink/60 text-sm">{room.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={360}>
          <p className="mt-8 text-ink/65 text-sm tracking-wide">{t('bathrooms_note')}</p>
        </Reveal>
      </div>

      {active && (
        <PhotoLightbox
          photo={{ src: active.img, alt: `${active.title} — Ironwood Livigno`, w: active.w, h: active.h, caption: active.title }}
          index={activeIndex!}
          total={rooms.length}
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
