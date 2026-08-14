import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';

export default function Rooms() {
  const t = useTranslations('rooms');

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
              <div className="rounded-3xl overflow-hidden shadow-soft h-full flex flex-col">
                <div className="aspect-[4/3] overflow-hidden">
                  <Pic
                    src={room.img}
                    alt={`${room.title} — Ironwood Livigno`}
                    width={room.w}
                    height={room.h}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
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
    </section>
  );
}
