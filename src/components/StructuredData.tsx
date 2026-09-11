import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import { rates, CURRENCY } from '@/data/rates';
import { galleryImages } from '@/data/gallery-images';

// Every language the site actually publishes content in (see
// messages/*.json) — was hardcoded to just ['it', 'en'], understating the
// other 10 translations that exist and are fully live. 'en-us' is the same
// spoken language as 'en' (only the on-page copy differs, e.g. sqft vs
// sqm), so it collapses to one 'en' entry rather than listing the same
// language code's variant twice.
const knownLanguages = Array.from(new Set(locales.map((l) => (l === 'en-us' ? 'en' : l))));

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwoodlivigno.com';

export default async function StructuredData({ locale }: { locale: Locale }) {
  const hero = await getTranslations({ locale, namespace: 'hero' });
  const faq = await getTranslations({ locale, namespace: 'faq' });
  const amenities = await getTranslations({ locale, namespace: 'amenities' });
  const gallery = await getTranslations({ locale, namespace: 'gallery' });
  const experience = await getTranslations({ locale, namespace: 'experience' });
  const rooms = await getTranslations({ locale, namespace: 'rooms' });

  // Same 11 photos as Gallery.tsx (src/data/gallery-images.ts is the
  // shared source), each as an ImageObject with its real caption instead
  // of a bare URL — lets search engines and AI answer engines attribute a
  // specific room/feature to each photo instead of an undifferentiated list.
  // Two more signature photos that live outside the Gallery component
  // (Experience.tsx's sauna shot and Rooms.tsx's main bedroom) are
  // prepended first since they're the property's headline features —
  // sauna/bagno turco is the top selling point everywhere else on the
  // site — and shouldn't be dropped just because they're not part of the
  // 11-photo gallery grid.
  const propertyImages = [
    { '@type': 'ImageObject', url: `${siteUrl}/images/sauna-vista-montagna.jpg`, caption: experience('point_1_title'), width: 2000, height: 1333 },
    { '@type': 'ImageObject', url: `${siteUrl}/images/camera1.jpg`, caption: rooms('room3_title'), width: 1905, height: 1269 },
    ...galleryImages.map((img, i) => ({
      '@type': 'ImageObject',
      url: `${siteUrl}${img.src}`,
      caption: gallery(`img${i}_caption`),
      width: img.w,
      height: img.h
    }))
  ];

  const lodgingBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Ironwood Livigno',
    description: hero('meta_description'),
    url: `${siteUrl}/${locale}`,
    image: propertyImages,
    telephone: '+39 0342 929285',
    email: 'info@ironwoodlivigno.com',
    priceRange: '€€€',
    // Only seasons with a real, confirmed price (src/data/rates.ts) turn
    // into an `Offer` here — a season still marked TODO (null price) is
    // skipped rather than publishing a guessed number to search engines.
    // Empty array is valid JSON-LD and simply omits `makesOffer` from what
    // gets rendered below once every season has a real price filled in.
    ...(rates.some((s) => s.pricePerNight != null)
      ? {
          makesOffer: rates
            .filter((s) => s.pricePerNight != null)
            .map((s) => ({
              '@type': 'Offer',
              priceCurrency: CURRENCY,
              price: s.pricePerNight,
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: s.pricePerNight,
                priceCurrency: CURRENCY,
                unitCode: 'DAY'
              }
            }))
        }
      : {}),
    // "LodgingReservation" itself models an actual booking record (guest,
    // dates, confirmation number) — not something a static marketing page
    // can truthfully claim to have. `potentialAction: ReserveAction` is the
    // schema.org-correct way to say "this business can be booked" on a page
    // that isn't itself a reservation, and it's the pattern Google's own
    // documentation uses for hotel/lodging booking markup.
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}#prenota`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform'
        ]
      },
      result: {
        '@type': 'LodgingReservation',
        name: 'Richiesta di prenotazione — Ironwood Livigno'
      }
    },
    // Real, verified listing/review profiles for this property, found via
    // search and cross-checked against the property description (90 m²,
    // 3 bedrooms, private sauna, fireplace, wine fridge — all match).
    sameAs: [
      'https://www.holiduhost.com/d/54247934',
      'https://www.airbnb.com/rooms/1001347662140918475',
      'https://instagram.com/ironwood_livigno'
    ],
    // Links directly to the exact pin (see geo coordinates below), provided
    // by the property owner from Google Maps.
    hasMap: 'https://www.google.com/maps?q=46.525061,10.126967',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Saroch 771',
      addressLocality: 'Livigno',
      addressRegion: 'SO',
      postalCode: '23041',
      addressCountry: 'IT'
    },
    // Exact coordinates provided directly by the property owner from Google
    // Maps Street View, pinned on the building itself (Via Saroch 771).
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 46.525061,
      longitude: 10.126967
    },
    numberOfRooms: 3,
    petsAllowed: false,
    // Detailed accommodation facts (all from the property description:
    // 90 m², 3 bedrooms, 2 bathrooms, sleeps 6). Machine-readable numbers
    // that search engines and AI answer engines can quote directly.
    containsPlace: {
      '@type': 'Accommodation',
      name: 'Ironwood Livigno — appartamento',
      occupancy: { '@type': 'QuantitativeValue', maxValue: 6, unitCode: 'C62' },
      numberOfBedrooms: 3,
      numberOfBathroomsTotal: 2,
      floorSize: { '@type': 'QuantitativeValue', value: 90, unitCode: 'MTK' }
    },
    knowsLanguage: knownLanguages,
    // No `review`/`aggregateRating` here on purpose: Google's structured
    // data guidelines disallow self-serving review markup (ratings/reviews
    // about a business, authored or curated by that same business) from
    // rich-result eligibility. The genuine aggregate ratings already live
    // on the third-party platforms linked via `sameAs` below (Google Maps,
    // Airbnb, Holidu) — that's where this data legitimately belongs. The
    // on-page testimonials in Reviews.tsx are unaffected; a visible
    // testimonials section is ordinary marketing copy, not schema markup.
    amenityFeature: [
      amenities('g1_1'),
      amenities('g1_2'),
      amenities('g1_3'),
      amenities('g1_4'),
      amenities('g2_1'),
      amenities('g2_2'),
      amenities('g2_3'),
      amenities('g2_4'),
      amenities('g3_1'),
      amenities('g3_2'),
      amenities('g3_3'),
      amenities('g3_4'),
      amenities('g3_5'),
      amenities('g4_1'),
      amenities('g4_2'),
      amenities('g4_3'),
      amenities('g4_4')
    ].map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true
    }))
  };

  // WebSite entity: tells search engines the canonical site name (helps
  // them show "Ironwood Livigno" instead of a truncated URL in results)
  // and links every language version together as one site.
  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ironwood Livigno',
    url: siteUrl,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: 'Ironwood Livigno', url: siteUrl }
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => ({
      '@type': 'Question',
      name: faq(`q${n}_q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq(`q${n}_a`)
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  );
}
