// The 11 photos shown in Gallery.tsx, extracted to shared data so
// StructuredData.tsx (a server component) can build ImageObject entries
// with the same captions instead of duplicating this list and risking the
// two drifting apart.
// `alt` stays Italian-only (read by screen readers/crawlers, not a caption
// a sighted visitor is meant to read) — the caption every visitor and every
// JSON-LD consumer sees comes from the `gallery` translation namespace
// (img{index}_caption) instead, so each locale reads it in its own
// language rather than always seeing the Italian original.
export type GalleryImage = { src: string; alt: string; w: number; h: number; big?: boolean; wide?: boolean };

export const galleryImages: GalleryImage[] = [
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
