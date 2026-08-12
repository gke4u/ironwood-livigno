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

export default function Summer() {
  const t = useTranslations('summer');

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={i * 90} className="rounded-2xl overflow-hidden aspect-[3/4]">
              <Pic
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={380}>
          <p className="mt-8 text-ink/65 text-sm tracking-wide">{t('ebike_note')}</p>
        </Reveal>

        <Reveal delay={420} className="mt-14">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
            {t('winter_caption')}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {winterImages.map((img, i) => (
            <Reveal key={img.src} delay={i * 90} className="rounded-2xl overflow-hidden aspect-[3/4]">
              <Pic
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
