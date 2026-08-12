import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import Pic from './Pic';

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

  return (
    <section className="bg-mist py-20 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-10">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-ink mb-4 leading-tight">{t('title')}</h2>
          <p className="text-ink/65 text-base">{t('subtitle')}</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
          {items.map((item, i) => (
            <Reveal
              key={item.key}
              delay={i * 100}
              className="rounded-2xl border border-ink/10 bg-white/70 overflow-hidden flex flex-col"
            >
              <div className="grid grid-cols-3 gap-[2px]">
                {item.photos.map((photo) => (
                  <div key={photo.src} className="aspect-square overflow-hidden">
                    <Pic
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.w}
                      height={photo.h}
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                  <span className="text-ink/55 text-xs">{item.unit}</span>
                </div>

                <p className="text-ink/65 text-sm leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-6 max-w-3xl">
          <p className="text-ink/55 text-sm leading-relaxed">{t('booking_note')}</p>
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
    </section>
  );
}
