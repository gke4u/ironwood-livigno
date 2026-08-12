// Translated variants of the 9 Italian-only SEO landing pages
// (src/content/landingPages.ts), rendered at /<slug>/<locale> — same
// pattern as src/content/blogTranslations.ts + src/app/blog/[slug]/[locale]/
// but covering all 11 non-Italian locales instead of just en/de, on
// explicit request. One entry per slug, one sub-entry per locale; this
// file's shape is the pattern to extend if a 10th satellite page is ever
// added.
//
// Deliberately NOT translated here, always reused verbatim from the
// Italian original in landingPages.ts:
// - `image` (same photo regardless of language)
// - `testimonials` (chi-siamo only) — real, attributed guest reviews (one
//   is already in English in the Italian original). Rewriting a real
//   person's quote in another language would be putting invented words in
//   their mouth; every locale shows the exact same verbatim quotes.
// - `internalLinks[].href` / `relatedLink.href` — localized at render time
//   by `localizeLandingLink` below, not stored per-translation. Only the
//   `label` text is translated (see `relatedLinkLabel` / `internalLinkLabels`).
import { contactSlugs, type Locale } from '@/i18n/routing';
import { blogTranslations, translatedBlogLocales } from './blogTranslations';
import { landingPages } from './landingPages';

export const translatedLandingLocales = ['en', 'en-us', 'de', 'fr', 'da', 'pl', 'cs', 'no', 'nl', 'zh', 'ja'] as const;
export type TranslatedLandingLocale = (typeof translatedLandingLocales)[number];

export type LandingTranslation = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
  highlights: string[];
  ctaText: string;
  breadcrumbName: string;
  navLabel: string; // short form for Nav "Scopri" dropdown / Footer, e.g. "Winter" not "Winter in Livigno"
  relatedLinkLabel: string;
  // Only chi-siamo, sauna-bagno-turco-privato-livigno, camere-appartamento-livigno
  // and livigno-estate use these two, matching which originals have them.
  faq?: { q: string; a: string }[];
  internalLinkLabels?: string[]; // positional match to the original's internalLinks array
};

export const landingPageTranslations: Record<string, Partial<Record<TranslatedLandingLocale, LandingTranslation>>> = {
  inverno: {
    en: {
      title: 'Winter in Livigno: skiing, a private sauna, and comfort steps from the slopes',
      metaTitle: 'Winter Holiday in Livigno | Apartment with Sauna 100 m from the Lifts',
      metaDescription:
        'Private infrared sauna and steam bath 100 m from Carosello 3000: discover what winter in Livigno feels like at Ironwood.',
      eyebrow: 'Winter in Livigno',
      intro:
        "Livigno has one of the longest ski seasons in the Italian Alps: slopes open from late November to early May, a ski area that climbs past 3,000 metres, and the rare comfort of coming home to a private sauna after the last run of the day.",
      sections: [
        {
          heading: 'The ski area: Carosello 3000 and Mottolino',
          body: [
            "Livigno spreads across two main sides. Carosello 3000, the larger of the two, has runs for every level and views that brush 3,000 metres above sea level. Mottolino is the reference point for freeride and more technical terrain, and doubles as the town's bike park in summer. Together, the two areas cover everything from first-timer families to experienced skiers.",
            'Livigno is also known for cross-country skiing: some of the loops run right through the town centre and the valley floor, a gentler activity to mix in with days on the downhill slopes — good for families with children, or anyone who just wants a change of pace.'
          ]
        },
        {
          heading: 'A longer season than most',
          body: [
            "Livigno's winter season typically runs from late November to early May, longer than many other Italian Alpine resorts. That means you can ski at the very start or end of the season, when lifts elsewhere are already closed — often with quieter slopes and lower prices outside peak periods (Christmas, New Year, February)."
          ]
        },
        {
          heading: 'The advantage of coming home 100 metres from the slopes',
          body: [
            "Ironwood Livigno is just a 100-metre walk from the ski lifts, and 50 metres from the ski school and equipment rental: you can ski all morning without moving the car, come back for lunch if you like, and be back on the slopes in the afternoon without losing time getting around.",
            "But it's after the last run that the difference really shows. Inside the apartment, the infrared sauna and steam bath are private — never shared with other guests, unlike a hotel spa. That's when your muscles actually warm up, before you've even thought about dinner, sitting by the living room's electric fireplace.",
            "The apartment also includes a dedicated storage space for skis, boots and gear, so you don't have to carry everything inside every evening, plus a free parking space for anyone arriving by car."
          ]
        }
      ],
      highlights: [
        '100 m from the ski lifts, 50 m from ski school and rental',
        'Private infrared sauna and steam bath, never shared',
        'Dedicated ski and boot storage',
        '3 bedrooms and 2 bathrooms for families and groups up to 6'
      ],
      ctaText: 'Check availability for your winter in Livigno',
      breadcrumbName: 'Winter in Livigno',
      navLabel: 'Winter',
      relatedLinkLabel: 'Read the full guide to the Carosello 3000 ski area'
    },
    'en-us': {
      title: 'Winter in Livigno, Italy: skiing, a private sauna, and comfort steps from the slopes',
      metaTitle: 'Winter Vacation in Livigno, Italy | Apartment with Sauna 100 m from the Lifts',
      metaDescription:
        'Private infrared sauna and steam bath 100 m from Carosello 3000: discover what winter in the Italian Alps feels like at Ironwood, in Livigno, Italy.',
      eyebrow: 'Winter in Livigno, Italy',
      intro:
        "Livigno, in the Italian Alps, has one of the longest ski seasons in Italy: slopes open from late November to early May, a ski area that climbs past 3,000 metres, and the rare comfort of coming home to a private sauna after the last run of the day.",
      sections: [
        {
          heading: 'The ski area: Carosello 3000 and Mottolino',
          body: [
            "Livigno spreads across two main sides. Carosello 3000, the larger of the two, has runs for every level and views that brush 3,000 metres above sea level. Mottolino is the reference point for freeride and more technical terrain, and doubles as the town's bike park in summer. Together, the two areas cover everything from first-timer families to experienced skiers.",
            'Livigno is also known for cross-country skiing: some of the loops run right through the town center and the valley floor, a gentler activity to mix in with days on the downhill slopes — good for families with children, or anyone who just wants a change of pace.'
          ]
        },
        {
          heading: 'A longer season than most',
          body: [
            "Livigno's winter season typically runs from late November to early May, longer than many other Italian Alpine resorts. That means you can ski at the very start or end of the season, when lifts elsewhere are already closed — often with quieter slopes and lower prices outside peak periods (Christmas, New Year, February)."
          ]
        },
        {
          heading: 'The advantage of coming home 100 meters from the slopes',
          body: [
            "Ironwood Livigno is just a 100-meter walk from the ski lifts, and 50 meters from the ski school and equipment rental: you can ski all morning without moving the car, come back for lunch if you like, and be back on the slopes in the afternoon without losing time getting around.",
            "But it's after the last run that the difference really shows. Inside the apartment, the infrared sauna and steam bath are private — never shared with other guests, unlike a hotel spa. That's when your muscles actually warm up, before you've even thought about dinner, sitting by the living room's electric fireplace.",
            "The apartment also includes a dedicated storage space for skis, boots and gear, so you don't have to carry everything inside every evening, plus a free parking space for anyone arriving by car."
          ]
        }
      ],
      highlights: [
        '100 m from the ski lifts, 50 m from ski school and rental',
        'Private infrared sauna and steam bath, never shared',
        'Dedicated ski and boot storage',
        '3 bedrooms and 2 bathrooms for families and groups up to 6'
      ],
      ctaText: 'Check availability for your winter vacation in Livigno',
      breadcrumbName: 'Winter in Livigno, Italy',
      navLabel: 'Winter',
      relatedLinkLabel: 'Read the full guide to the Carosello 3000 ski area'
    }
  },
  estate: {
    en: {
      title: 'Summer in Livigno: mountain biking, hiking, and unwinding in the apartment with a sauna',
      metaTitle: 'Summer Holiday in Livigno | Mountain Biking, Hiking and a Private Sauna',
      metaDescription:
        "Bike park, trails for every level and Lake Livigno: discover summer in Livigno and why an apartment with a private sauna is the ideal base.",
      eyebrow: 'Summer in Livigno',
      intro:
        "Livigno isn't just a winter destination: from June to September the alpine basin becomes one of Europe's mountain biking capitals, with trails for families, hikers and experienced bikers alike.",
      sections: [
        {
          heading: 'Mountain biking: from Mottolino Bike Park to the Bike Academy',
          body: [
            "Mottolino Bike Park is the reference point for anyone chasing adrenaline, with downhill runs, a jump area and north shore sections. Carosello 3000 also opens its lifts in summer, linking scenic trails at altitude. For beginners or anyone travelling with children, the Bike Academy offers a route built specifically for first-timers.",
            'In total the area counts over 50 km of organised trails, suited both to technical descents and to a relaxed ride through the larch woods.'
          ]
        },
        {
          heading: 'Hiking, Lake Livigno and the alpine pastures',
          body: [
            "You don't need to be a biker to enjoy Livigno in summer. The basin is crossed by hiking trails of every difficulty, past pastures in bloom — arnica is the flower most associated with the area — with views over the Rhaetian Alps. A walk suited to everyone is the loop around Lake Livigno, with plenty of spots for a picnic on warmer days.",
            'Summer temperatures stay cool even in August, another reason Livigno is popular with those looking to escape city heat.'
          ]
        },
        {
          heading: 'Why stay at Ironwood in summer',
          body: [
            "The location just steps from the lifts, handy in winter, is just as useful in summer for reaching the main trailheads on foot or by bike. On request, we provide 2 e-bikes for hire directly at the property, to help you cover more ground without struggling too much uphill — useful for families or anyone who isn't an experienced cyclist.",
            "After a day on the trails or the bike, the apartment's two mountain-view balconies are the right place to unwind, and the private infrared sauna remains a small luxury available outside ski season too, for anyone wanting to loosen up after a demanding hike."
          ]
        }
      ],
      highlights: [
        'E-bike hire available directly at the property',
        'Two balconies with mountain views',
        'Private infrared sauna, useful after hiking too',
        'Steps from the trailheads and the bike park'
      ],
      ctaText: 'Check availability for your summer in Livigno',
      breadcrumbName: 'Summer in Livigno',
      navLabel: 'Summer',
      relatedLinkLabel: 'Read the full guide to summer in Livigno'
    },
    'en-us': {
      title: 'Summer in Livigno, Italy: mountain biking, hiking, and unwinding in the apartment with a sauna',
      metaTitle: 'Summer Vacation in Livigno, Italy | Mountain Biking, Hiking and a Private Sauna',
      metaDescription:
        'Bike park, trails for every level and Lake Livigno: discover summer in the Italian Alps and why an apartment with a private sauna is the ideal base.',
      eyebrow: 'Summer in Livigno, Italy',
      intro:
        "Livigno isn't just a winter destination: from June to September this basin in the Italian Alps becomes one of Europe's mountain biking capitals, with trails for families, hikers and experienced bikers alike.",
      sections: [
        {
          heading: 'Mountain biking: from Mottolino Bike Park to the Bike Academy',
          body: [
            "Mottolino Bike Park is the reference point for anyone chasing adrenaline, with downhill runs, a jump area and north shore sections. Carosello 3000 also opens its lifts in summer, linking scenic trails at altitude. For beginners or anyone traveling with children, the Bike Academy offers a route built specifically for first-timers.",
            'In total the area counts over 50 km of organized trails, suited both to technical descents and to a relaxed ride through the larch woods.'
          ]
        },
        {
          heading: 'Hiking, Lake Livigno and the alpine pastures',
          body: [
            "You don't need to be a biker to enjoy Livigno in summer. The basin is crossed by hiking trails of every difficulty, past pastures in bloom — arnica is the flower most associated with the area — with views over the Rhaetian Alps. A walk suited to everyone is the loop around Lake Livigno, with plenty of spots for a picnic on warmer days.",
            'Summer temperatures stay cool even in August, another reason Livigno is popular with those looking to escape city heat.'
          ]
        },
        {
          heading: 'Why stay at Ironwood in summer',
          body: [
            "The location just steps from the lifts, handy in winter, is just as useful in summer for reaching the main trailheads on foot or by bike. On request, we provide 2 e-bikes for hire directly at the property, to help you cover more ground without struggling too much uphill — useful for families or anyone who isn't an experienced cyclist.",
            "After a day on the trails or the bike, the apartment's two mountain-view balconies are the right place to unwind, and the private infrared sauna remains a small luxury available outside ski season too, for anyone wanting to loosen up after a demanding hike."
          ]
        }
      ],
      highlights: [
        'E-bike hire available directly at the property',
        'Two balconies with mountain views',
        'Private infrared sauna, useful after hiking too',
        'Steps from the trailheads and the bike park'
      ],
      ctaText: 'Check availability for your summer vacation in Livigno',
      breadcrumbName: 'Summer in Livigno, Italy',
      navLabel: 'Summer',
      relatedLinkLabel: 'Read the full guide to summer in Livigno'
    }
  },
  famiglie: {
    en: {
      title: 'Livigno with children: the apartment designed for families',
      metaTitle: 'Family Apartment in Livigno | Up to 6 Guests, Cot and High Chair',
      metaDescription:
        '3 bedrooms, 2 bathrooms, cot and high chair on request: discover why Ironwood Livigno is designed for families and groups up to 6.',
      eyebrow: 'Families in Livigno',
      intro:
        "Planning a family holiday in Livigno means looking for space, safety and comfort — not just an extra bed. Ironwood Livigno was designed with exactly that in mind: families and groups up to 6, in an apartment where everyone has their own space.",
      sections: [
        {
          heading: 'Room for everyone: 3 bedrooms, 2 bathrooms, 90 sqm',
          body: [
            "The apartment spans 90 sqm across 3 bedrooms and 2 full bathrooms, a flexible layout that lets parents have a bit of privacy while the little ones sleep in the room next door. The double bedroom with a mattress topper is set up for the parents of the group, while the twin room suits children or older kids.",
            "On request we provide a cot and high chair, so you don't have to travel with bulky equipment. The kitchen is fully equipped — dishwasher, oven, coffee machine — for preparing meals tailored to children without eating out every night."
          ]
        },
        {
          heading: 'Activities for children too, in every season',
          body: [
            "In winter, the cross-country ski loops that run through the centre of Livigno are a gentler activity than the downhill slopes, suitable for children trying snow for the first time. For those who want to try alpine skiing, the ski school is just 50 metres from the apartment — handy for lessons and quick changes without needing the car.",
            "In summer, Livigno's Bike Academy offers a roughly 5 km route built specifically for beginners and children, while a walk around Lake Livigno is manageable for the whole family, with plenty of spots for a picnic."
          ]
        },
        {
          heading: 'A safe, quiet area',
          body: [
            "The apartment is 100 metres from the ski lifts and a 15-minute walk from the centre of Livigno, in a spot that's convenient but quiet — close enough to reach slopes, ski school and shops on foot, without the bustle of a town centre full of tourists. The dedicated ski and bike storage means you don't have to carry the whole family's gear inside every evening.",
            "And once the children are finally asleep, the private infrared sauna and steam bath remain a space just for the parents — a detail that, based on the reviews we receive, many families flag as one of the most appreciated surprises of the stay."
          ]
        }
      ],
      highlights: [
        '3 bedrooms and 2 bathrooms, sleeps up to 6',
        'Cot and high chair available on request',
        'Ski school 50 m away, child-friendly cross-country skiing in town',
        'Fully equipped kitchen for meals tailored to children'
      ],
      ctaText: 'Check availability for your family',
      breadcrumbName: 'Families in Livigno',
      navLabel: 'Families',
      relatedLinkLabel: 'Read the full guide to Livigno with children'
    },
    'en-us': {
      title: 'Livigno, Italy with kids: the apartment designed for families',
      metaTitle: 'Family Apartment in Livigno, Italy | Up to 6 Guests, Crib and High Chair',
      metaDescription:
        '3 bedrooms, 2 bathrooms, crib and high chair on request: discover why Ironwood Livigno, in the Italian Alps, is designed for families and groups up to 6.',
      eyebrow: 'Families in Livigno, Italy',
      intro:
        "Planning a family vacation in Livigno, Italy means looking for space, safety and comfort — not just an extra bed. Ironwood Livigno was designed with exactly that in mind: families and groups up to 6, in an apartment where everyone has their own space.",
      sections: [
        {
          heading: 'Room for everyone: 3 bedrooms, 2 bathrooms, 970 sqft',
          body: [
            "The apartment spans 970 sqft across 3 bedrooms and 2 full bathrooms, a flexible layout that lets parents have a bit of privacy while the little ones sleep in the room next door. The double bedroom with a mattress topper is set up for the parents of the group, while the twin room suits children or older kids.",
            "On request we provide a crib and high chair, so you don't have to travel with bulky equipment. The kitchen is fully equipped — dishwasher, oven, coffee machine — for preparing meals tailored to children without eating out every night."
          ]
        },
        {
          heading: 'Activities for kids too, in every season',
          body: [
            "In winter, the cross-country ski loops that run through the center of Livigno are a gentler activity than the downhill slopes, suitable for children trying snow for the first time. For those who want to try alpine skiing, the ski school is just 50 meters from the apartment — handy for lessons and quick changes without needing the car.",
            "In summer, Livigno's Bike Academy offers a roughly 5 km route built specifically for beginners and children, while a walk around Lake Livigno is manageable for the whole family, with plenty of spots for a picnic."
          ]
        },
        {
          heading: 'A safe, quiet area',
          body: [
            "The apartment is 100 meters from the ski lifts and a 15-minute walk from the center of Livigno, in a spot that's convenient but quiet — close enough to reach slopes, ski school and shops on foot, without the bustle of a town center full of tourists. The dedicated ski and bike storage means you don't have to carry the whole family's gear inside every evening.",
            "And once the kids are finally asleep, the private infrared sauna and steam bath remain a space just for the parents — a detail that, based on the reviews we receive, many families flag as one of the most appreciated surprises of the stay."
          ]
        }
      ],
      highlights: [
        '3 bedrooms and 2 bathrooms, sleeps up to 6',
        'Crib and high chair available on request',
        'Ski school 50 m away, kid-friendly cross-country skiing in town',
        'Fully equipped kitchen for meals tailored to kids'
      ],
      ctaText: 'Check availability for your family',
      breadcrumbName: 'Families in Livigno, Italy',
      navLabel: 'Families',
      relatedLinkLabel: 'Read the full guide to Livigno with kids'
    }
  },
  benessere: {
    en: {
      title: 'Wellness in Livigno: private infrared sauna and steam bath',
      metaTitle: 'Private Sauna in Livigno | Steam Bath and Wellness in the Apartment',
      metaDescription:
        'Private infrared sauna and steam bath, never shared with other guests: discover the wellness side of a stay in Livigno at Ironwood.',
      eyebrow: 'Wellness',
      intro:
        "After a day on the slopes or the trails, how you recover matters as much as the activity itself. At Ironwood Livigno, the infrared sauna and steam bath aren't a shared service in a communal space: they're private, inside the apartment, available only to whoever is staying here.",
      sections: [
        {
          heading: 'Why a private sauna makes a difference',
          body: [
            "In many mountain properties, the sauna and steam bath are shared spaces, with booking slots, bathrobes to bring along, and a real chance of having to share them with strangers. At Ironwood in Livigno, the infrared sauna and steam bath are instead reserved exclusively for the apartment's guests: no waiting, no booking, no sharing — at any hour of the day or evening.",
            "The infrared sauna in particular is well suited to muscle recovery: the heat penetrates deep into the tissue, a real help after a day of skiing, hiking or mountain biking, when legs and back are asking to be loosened up before you've even sat down for dinner."
          ]
        },
        {
          heading: 'A simple ritual, repeatable every day',
          body: [
            "The advantage of having a sauna and steam bath at home rather than in a shared spa is the freedom to make it a daily habit of the holiday: come back from the slopes or the trail, warm up at your own pace, maybe with a glass of wine from the kitchen, and only then think about dinner. No schedule to follow, no app to book a slot.",
            "The living room, with its electric fireplace, completes the picture: evenings in the apartment become as much a part of the experience as the day on the slopes or the trails, not just a place to sleep."
          ]
        },
        {
          heading: 'A detail guests really notice',
          body: [
            "It isn't just marketing copy: it's one of the details most often mentioned in the real reviews we receive on Google and Airbnb, often described as one of the main reasons for choosing Ironwood over a traditional hotel. And for anyone who wants to round out the experience with a proper breakfast before heading out, we also offer a paid breakfast service on request, at a partner venue just steps from the apartment."
          ]
        }
      ],
      highlights: [
        'Private infrared sauna and steam bath, never shared',
        'No booking needed, available any time of day',
        'Electric fireplace in the living room for the evenings',
        'Breakfast on request just steps from the apartment'
      ],
      ctaText: 'Book your moment of wellness in Livigno',
      breadcrumbName: 'Wellness',
      navLabel: 'Wellness',
      relatedLinkLabel: 'See all the details of the private sauna and steam bath'
    },
    'en-us': {
      title: 'Wellness in Livigno, Italy: private infrared sauna and steam bath',
      metaTitle: 'Private Sauna in Livigno, Italy | Steam Bath and Wellness in the Apartment',
      metaDescription:
        'Private infrared sauna and steam bath, never shared with other guests: discover the wellness side of a vacation in the Italian Alps at Ironwood.',
      eyebrow: 'Wellness',
      intro:
        "After a day on the slopes or the trails, how you recover matters as much as the activity itself. At Ironwood Livigno, the infrared sauna and steam bath aren't a shared amenity in a common space: they're private, inside the apartment, available only to whoever is staying here.",
      sections: [
        {
          heading: 'Why a private sauna makes a difference',
          body: [
            "At many mountain properties, the sauna and steam bath are shared spaces, with booking slots, robes to bring along, and a real chance of having to share them with strangers. At Ironwood in Livigno, the infrared sauna and steam bath are instead reserved exclusively for the apartment's guests: no waiting, no reservations, no sharing — at any hour of the day or evening.",
            "The infrared sauna in particular is well suited to muscle recovery: the heat penetrates deep into the tissue, a real help after a day of skiing, hiking or mountain biking, when legs and back are asking to be loosened up before you've even sat down for dinner."
          ]
        },
        {
          heading: 'A simple ritual, repeatable every day',
          body: [
            "The advantage of having a sauna and steam bath at home rather than in a shared spa is the freedom to make it a daily habit of the vacation: come back from the slopes or the trail, warm up at your own pace, maybe with a glass of wine from the kitchen, and only then think about dinner. No schedule to follow, no app to book a slot.",
            "The living room, with its electric fireplace, completes the picture: evenings in the apartment become as much a part of the experience as the day on the slopes or the trails, not just a place to sleep."
          ]
        },
        {
          heading: 'A detail guests really notice',
          body: [
            "It isn't just marketing copy: it's one of the details most often mentioned in the real reviews we receive on Google and Airbnb, often described as one of the main reasons for choosing Ironwood over a traditional hotel. And for anyone who wants to round out the experience with a proper breakfast before heading out, we also offer a paid breakfast service on request, at a partner venue just steps from the apartment."
          ]
        }
      ],
      highlights: [
        'Private infrared sauna and steam bath, never shared',
        'No reservation needed, available any time of day',
        'Electric fireplace in the living room for the evenings',
        'Breakfast on request just steps from the apartment'
      ],
      ctaText: 'Book your moment of wellness in Livigno',
      breadcrumbName: 'Wellness',
      navLabel: 'Wellness',
      relatedLinkLabel: 'See all the details of the private sauna and steam bath'
    }
  },
  'come-arrivare': {
    en: {
      title: 'How to reach Ironwood Livigno: address, parking, and the final stretch',
      metaTitle: 'How to Get to Ironwood Livigno | Address, Parking and Final Stretch',
      metaDescription:
        'Address, free parking and distance from the lifts: the practical guide to reaching Ironwood Livigno, Via Saroch 771, with no surprises.',
      eyebrow: 'Getting here',
      intro:
        "If you've already decided to stay at Ironwood Livigno, this page covers the practical details of the final stretch of the journey: exactly where the apartment is, how to reach it from the Foscagno Pass or from Tirano, and what to know about parking and arrival. For the full guide on getting to Livigno by train, car or plane from Milan, see our dedicated article linked at the bottom of this page.",
      sections: [
        {
          heading: 'Address and exact location',
          body: [
            "Ironwood Livigno is at Via Saroch 771, 23041 Livigno (SO), about a 100-metre walk from the ski lifts and 50 metres from the ski school and equipment rental. It's a spot that's convenient but quiet, about a 15-minute walk from the town centre — handy for reaching slopes, shops and restaurants on foot once you've arrived.",
            "The exact GPS coordinates are 46.525061, 10.126967: worth entering into your sat nav, especially for the final mountain kilometres where mobile signal can be less reliable."
          ]
        },
        {
          heading: 'The final stretch, from Tirano or the Swiss border',
          body: [
            "Arriving by train, get off at Tirano station and continue with a scheduled bus (changing at Bormio) to Livigno. Arriving by car from Milan, take the SS38 towards Bormio and then the Foscagno Pass; arriving from Switzerland, take the Forcola di Livigno instead. In winter, check the pass conditions before setting off: heavy snow can call for chains or winter tyres, and in rare cases it can close temporarily.",
            "Once in town, follow the signs for Via Saroch, in the area near the ski lifts: the apartment is easy to spot, with the wooden exterior typical of the area's alpine style."
          ]
        },
        {
          heading: 'Parking and arriving at the apartment',
          body: [
            "The apartment includes a free parking space, so there's no need to look for paid parking in town. Check-in and check-out times are confirmed at booking via WhatsApp, with some flexibility depending on availability — handy if you're arriving after a long journey or with train/bus times that aren't always on schedule.",
            "For any questions about the final stretch of the journey, the fastest way to reach us is WhatsApp: we reply with precise directions and, if needed, photos of the entrance so you can spot the building right away."
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — 100 m from the ski lifts',
        'Free parking space included',
        'GPS coordinates: 46.525061, 10.126967',
        'Flexible check-in, confirmed via WhatsApp'
      ],
      ctaText: 'Message us on WhatsApp for arrival directions',
      breadcrumbName: 'Getting here',
      navLabel: 'Getting here',
      relatedLinkLabel: 'Read the full guide: train, car or plane from Milan'
    },
    'en-us': {
      title: 'How to reach Ironwood Livigno, Italy: address, parking, and the final stretch',
      metaTitle: 'How to Get to Ironwood Livigno, Italy | Address, Parking and Final Stretch',
      metaDescription:
        'Address, free parking and distance from the lifts: the practical guide to reaching Ironwood Livigno, Via Saroch 771, Italy, with no surprises.',
      eyebrow: 'Getting here',
      intro:
        "If you've already decided to stay at Ironwood Livigno, this page covers the practical details of the final stretch of the trip: exactly where the apartment is, how to reach it from the Foscagno Pass or from Tirano, and what to know about parking and arrival. For the full guide on getting to Livigno by train, car or plane from Milan, see our dedicated article linked at the bottom of this page.",
      sections: [
        {
          heading: 'Address and exact location',
          body: [
            "Ironwood Livigno is at Via Saroch 771, 23041 Livigno (SO), Italy, about a 100-meter walk from the ski lifts and 50 meters from the ski school and equipment rental. It's a spot that's convenient but quiet, about a 15-minute walk from the town center — handy for reaching slopes, shops and restaurants on foot once you've arrived.",
            "The exact GPS coordinates are 46.525061, 10.126967: worth entering into your GPS, especially for the final mountain miles where mobile signal can be less reliable."
          ]
        },
        {
          heading: 'The final stretch, from Tirano or the Swiss border',
          body: [
            "Arriving by train, get off at Tirano station and continue with a scheduled bus (changing at Bormio) to Livigno. Arriving by car from Milan, take the SS38 towards Bormio and then the Foscagno Pass; arriving from Switzerland, take the Forcola di Livigno instead. In winter, check the pass conditions before setting off: heavy snow can call for chains or winter tires, and in rare cases it can close temporarily.",
            "Once in town, follow the signs for Via Saroch, in the area near the ski lifts: the apartment is easy to spot, with the wooden exterior typical of the area's alpine style."
          ]
        },
        {
          heading: 'Parking and arriving at the apartment',
          body: [
            "The apartment includes a free parking space, so there's no need to look for paid parking in town. Check-in and check-out times are confirmed at booking via WhatsApp, with some flexibility depending on availability — handy if you're arriving after a long trip or with train/bus times that aren't always on schedule.",
            "For any questions about the final stretch of the trip, the fastest way to reach us is WhatsApp: we reply with precise directions and, if needed, photos of the entrance so you can spot the building right away."
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO), Italy — 100 m from the ski lifts',
        'Free parking space included',
        'GPS coordinates: 46.525061, 10.126967',
        'Flexible check-in, confirmed via WhatsApp'
      ],
      ctaText: 'Message us on WhatsApp for arrival directions',
      breadcrumbName: 'Getting here',
      navLabel: 'Getting here',
      relatedLinkLabel: 'Read the full guide: train, car or plane from Milan'
    }
  },
  'chi-siamo': {
    en: {
      title: 'About us: the Livigno family behind Ironwood Livigno',
      metaTitle: 'About Us | Ironwood Livigno — A Host Family in Livigno',
      metaDescription:
        'Ironwood Livigno is run directly by Francesco and his family, Livigno natives through and through: read our story and reviews, book with no commission.',
      eyebrow: 'About us',
      intro:
        "Who's behind Ironwood Livigno? Not a real estate agency or a holiday-home chain, but a real family who lives in Livigno all year round. I'm Francesco, born and raised here, and together with my wife Tania and our two daughters, Nicole and Giulia, we've turned our family home into an apartment designed for anyone coming to Livigno to ski in winter or walk in the mountains in summer. When you book with us, you're not writing to a call centre: you're writing directly to the people who renovated that home with their own hands, room by room.",
      sections: [
        {
          heading: 'A Livigno family, not an agency',
          body: [
            "There are four of us: myself, my wife Tania, and our two daughters, Nicole (18) and Giulia (13). We don't run Ironwood Livigno remotely or through a property manager: we live here all year, not just in season, which is why we know the rhythm of the slopes, the busiest periods, and the practical details a generic guidebook can't give you.",
            "Being born and raised in Livigno also means we can give you real advice on when to book your ski pass online to skip the queues, which side of the mountain to choose based on the day's weather, or where to eat in the evening without relying solely on online reviews."
          ]
        },
        {
          heading: 'A family home, carefully renovated in 2022',
          body: [
            "Ironwood Livigno didn't start out as just another investment. It's our home, which we fully renovated choosing to work mainly with iron and wood — materials that speak to the mountains better than standard holiday-rental furnishings. The work was completed in 2022: a private infrared sauna, steam bath, electric fireplace, a fully equipped kitchen and 3 bedrooms totalling 90 sqm, designed to comfortably host families and groups up to 6, with 2 full bathrooms.",
            "The result is a holiday home just 100 metres from the ski lifts and 50 metres from the ski school and equipment rental, on Via Saroch — but one that still holds the warmth of a real family home inside, not a standardised apartment."
          ]
        },
        {
          heading: 'Why booking directly with Ironwood Livigno pays off',
          body: [
            "We run Ironwood Livigno ourselves, with no middlemen: it means that when you message us on WhatsApp to ask about availability, we're the ones who reply, not a call centre. We can confirm flexible check-in times, give you precise directions for the final stretch of road, and sort out a special request on the spot — an extra cot, a date change — without going through a third-party platform.",
            "Booking directly also means avoiding the commission that usually gets built into the final price on Airbnb or Booking: the price we agree on via WhatsApp or email is what you pay, with no surprises at checkout."
          ]
        },
        {
          heading: "What guests who've stayed with us say",
          body: [
            "The reviews below are real, published on Google and Airbnb — the same ones you'll find in the reviews section of the homepage."
          ]
        }
      ],
      highlights: [
        'Direct management, no agencies or middlemen',
        'Livigno natives: real advice on slopes and season',
        'Family home renovated in 2022, iron and wood',
        'Direct replies on WhatsApp, not a call centre'
      ],
      faq: [
        {
          q: 'Is Ironwood Livigno run by an agency?',
          a: 'No. Ironwood Livigno is run directly by Francesco and his family, owners who live in Livigno year-round — not a real estate agency or a holiday-home chain.'
        },
        {
          q: 'Is it worth booking directly instead of through Airbnb or Booking?',
          a: "Yes: booking directly via WhatsApp, phone or email avoids the platforms' commission, and gives you a direct line to the people who actually run the apartment for any request before, during or after your stay."
        },
        {
          q: 'Who renovated the house?',
          a: "It's Francesco and Tania's family home, fully renovated and completed in 2022, with a design built mainly around iron and wood."
        },
        {
          q: 'How long have you lived in Livigno?',
          a: 'Francesco was born and raised in Livigno and lives here year-round, not just during the tourist season — the same goes for the whole family.'
        },
        {
          q: 'How can I contact you directly?',
          a: 'The fastest way is WhatsApp at +39 0342 929285, or by email at info@ironwoodlivigno.com, or through the availability request form on the site.'
        }
      ],
      internalLinkLabels: [
        'Discover our 3 bedrooms, designed for families and groups',
        'Read the guide on how to reach Ironwood Livigno',
        "Discover Livigno's winter at Ironwood",
        'See all our verified reviews',
        'Read our guides to Livigno'
      ],
      ctaText: 'Message us directly on WhatsApp',
      breadcrumbName: 'About us',
      navLabel: 'About us',
      relatedLinkLabel: 'Go to the contact page to write or call us'
    },
    'en-us': {
      title: 'About us: the Livigno, Italy family behind Ironwood Livigno',
      metaTitle: 'About Us | Ironwood Livigno — A Host Family in Livigno, Italy',
      metaDescription:
        'Ironwood Livigno, Italy is run directly by Francesco and his family, Livigno natives through and through: read our story and reviews, book with no commission.',
      eyebrow: 'About us',
      intro:
        "Who's behind Ironwood Livigno? Not a real estate agency or a vacation-rental chain, but a real family who lives in Livigno, in the Italian Alps, all year round. I'm Francesco, born and raised here, and together with my wife Tania and our two daughters, Nicole and Giulia, we've turned our family home into an apartment designed for anyone coming to Livigno to ski in winter or hike in the mountains in summer. When you book with us, you're not writing to a call center: you're writing directly to the people who renovated that home with their own hands, room by room.",
      sections: [
        {
          heading: 'A Livigno family, not an agency',
          body: [
            "There are four of us: myself, my wife Tania, and our two daughters, Nicole (18) and Giulia (13). We don't run Ironwood Livigno remotely or through a property manager: we live here all year, not just in season, which is why we know the rhythm of the slopes, the busiest periods, and the practical details a generic guidebook can't give you.",
            "Being born and raised in Livigno also means we can give you real advice on when to book your ski pass online to skip the lines, which side of the mountain to choose based on the day's weather, or where to eat in the evening without relying solely on online reviews."
          ]
        },
        {
          heading: 'A family home, carefully renovated in 2022',
          body: [
            "Ironwood Livigno didn't start out as just another investment. It's our home, which we fully renovated choosing to work mainly with iron and wood — materials that speak to the mountains better than standard vacation-rental furnishings. The work was completed in 2022: a private infrared sauna, steam bath, electric fireplace, a fully equipped kitchen and 3 bedrooms totaling 970 sqft, designed to comfortably host families and groups up to 6, with 2 full bathrooms.",
            "The result is a vacation rental just 100 meters from the ski lifts and 50 meters from the ski school and equipment rental, on Via Saroch — but one that still holds the warmth of a real family home inside, not a standardized apartment."
          ]
        },
        {
          heading: 'Why booking directly with Ironwood Livigno pays off',
          body: [
            "We run Ironwood Livigno ourselves, with no middlemen: it means that when you message us on WhatsApp to ask about availability, we're the ones who reply, not a call center. We can confirm flexible check-in times, give you precise directions for the final stretch of road, and sort out a special request on the spot — an extra crib, a date change — without going through a third-party platform.",
            "Booking directly also means avoiding the commission that usually gets built into the final price on Airbnb or Booking: the price we agree on via WhatsApp or email is what you pay, with no surprises at checkout."
          ]
        },
        {
          heading: "What guests who've stayed with us say",
          body: [
            "The reviews below are real, published on Google and Airbnb — the same ones you'll find in the reviews section of the homepage."
          ]
        }
      ],
      highlights: [
        'Direct management, no agencies or middlemen',
        'Livigno natives: real advice on slopes and season',
        'Family home renovated in 2022, iron and wood',
        'Direct replies on WhatsApp, not a call center'
      ],
      faq: [
        {
          q: 'Is Ironwood Livigno run by an agency?',
          a: 'No. Ironwood Livigno is run directly by Francesco and his family, owners who live in Livigno year-round — not a real estate agency or a vacation-rental chain.'
        },
        {
          q: 'Is it worth booking directly instead of through Airbnb or Booking?',
          a: "Yes: booking directly via WhatsApp, phone or email avoids the platforms' commission, and gives you a direct line to the people who actually run the apartment for any request before, during or after your stay."
        },
        {
          q: 'Who renovated the house?',
          a: "It's Francesco and Tania's family home, fully renovated and completed in 2022, with a design built mainly around iron and wood."
        },
        {
          q: 'How long have you lived in Livigno?',
          a: 'Francesco was born and raised in Livigno and lives here year-round, not just during the tourist season — the same goes for the whole family.'
        },
        {
          q: 'How can I contact you directly?',
          a: 'The fastest way is WhatsApp at +39 0342 929285, or by email at info@ironwoodlivigno.com, or through the availability request form on the site.'
        }
      ],
      internalLinkLabels: [
        'Discover our 3 bedrooms, designed for families and groups',
        'Read the guide on how to reach Ironwood Livigno',
        "Discover Livigno's winter at Ironwood",
        'See all our verified reviews',
        'Read our guides to Livigno'
      ],
      ctaText: 'Message us directly on WhatsApp',
      breadcrumbName: 'About us',
      navLabel: 'About us',
      relatedLinkLabel: 'Go to the contact page to write or call us'
    }
  },
  'sauna-bagno-turco-privato-livigno': {
    en: {
      title: 'Apartment with private sauna in Livigno: exclusive infrared sauna and steam bath',
      metaTitle: 'Private Sauna Livigno | Apartment with Private Steam Bath',
      metaDescription:
        'In Livigno, an apartment with a private infrared sauna and steam bath, never shared: no booking needed, available every day at any time.',
      eyebrow: 'Private sauna',
      intro:
        "Looking for an apartment with a private sauna in Livigno? At Ironwood Livigno, the infrared sauna and steam bath aren't a paid service in a shared spa, but part of the apartment itself: exclusive to whoever is staying here, with no schedule to follow and no sharing with other guests. This page covers all the practical details, for anyone who wants to know exactly what's included.",
      sections: [
        {
          heading: 'Private infrared sauna, never shared',
          body: [
            "The infrared sauna is designed for muscle recovery: the heat penetrates deep into the tissue, a real help after a day of skiing, hiking or mountain biking. It's inside the apartment, not in a shared space of the building — meaning no other guest will ever use it before or after you."
          ]
        },
        {
          heading: 'Private steam bath included',
          body: [
            "Alongside the sauna, the apartment also includes a private steam bath: hot steam for your exclusive use, to alternate with the infrared sauna depending on preference, with no need to choose between the two or book access to a shared space."
          ]
        },
        {
          heading: 'No booking needed, available any time',
          body: [
            'Unlike a hotel spa, where you often need to book a time slot, here the sauna and steam bath are available at any time of day: right after coming back from the slopes, after a summer hike, or simply in the evening before dinner.'
          ]
        },
        {
          heading: 'Why it beats a shared spa',
          body: [
            "We've written a dedicated guide comparing a private sauna to a shared one, covering the practical advantages in terms of hygiene, scheduling and comfort — useful if you're still weighing up whether an apartment with a private sauna is the right choice for your stay in Livigno."
          ]
        }
      ],
      highlights: [
        'Private infrared sauna, never shared with other guests',
        'Private steam bath included in the apartment',
        'Available any time, no booking needed',
        'Part of a 90 sqm apartment, 3 bedrooms, up to 6 guests'
      ],
      faq: [
        {
          q: 'Is the sauna really private, or shared with other apartments?',
          a: "It's completely private: it's inside the apartment and available exclusively to the guests staying there, never shared with other guests or other units."
        },
        {
          q: 'Do I need to book a time slot to use the sauna or steam bath?',
          a: "No. Since it isn't a shared space, there's no slot to book: they're available at any time of day throughout your stay."
        },
        {
          q: 'Are the sauna and steam bath included in the stay price?',
          a: "Yes, they're part of the apartment and come at no extra cost on top of the booked stay."
        },
        {
          q: 'Are they useful in summer too, not just after skiing?',
          a: 'Yes: many guests use them in summer too, for muscle recovery after a day of hiking or mountain biking, not just in winter after skiing.'
        }
      ],
      internalLinkLabels: [
        'Discover the full wellness section at Ironwood Livigno',
        'Read the comparison: private sauna vs shared sauna',
        'Discover why we chose a private sauna for our home'
      ],
      ctaText: 'Check availability and book your private sauna',
      breadcrumbName: 'Private sauna',
      navLabel: 'Private sauna',
      relatedLinkLabel: 'Discover the fireplace, breakfast and other wellness details too'
    },
    'en-us': {
      title: 'Apartment with private sauna in Livigno, Italy: exclusive infrared sauna and steam bath',
      metaTitle: 'Private Sauna Livigno, Italy | Apartment with Private Steam Bath',
      metaDescription:
        'In Livigno, Italy, an apartment with a private infrared sauna and steam bath, never shared: no reservation needed, available every day at any time.',
      eyebrow: 'Private sauna',
      intro:
        "Looking for an apartment with a private sauna in Livigno, Italy? At Ironwood Livigno, the infrared sauna and steam bath aren't a paid amenity in a shared spa, but part of the apartment itself: exclusive to whoever is staying here, with no schedule to follow and no sharing with other guests. This page covers all the practical details, for anyone who wants to know exactly what's included.",
      sections: [
        {
          heading: 'Private infrared sauna, never shared',
          body: [
            "The infrared sauna is designed for muscle recovery: the heat penetrates deep into the tissue, a real help after a day of skiing, hiking or mountain biking. It's inside the apartment, not in a shared space of the building — meaning no other guest will ever use it before or after you."
          ]
        },
        {
          heading: 'Private steam bath included',
          body: [
            "Alongside the sauna, the apartment also includes a private steam bath: hot steam for your exclusive use, to alternate with the infrared sauna depending on preference, with no need to choose between the two or book access to a shared space."
          ]
        },
        {
          heading: 'No reservation needed, available any time',
          body: [
            'Unlike a hotel spa, where you often need to book a time slot, here the sauna and steam bath are available at any time of day: right after coming back from the slopes, after a summer hike, or simply in the evening before dinner.'
          ]
        },
        {
          heading: 'Why it beats a shared spa',
          body: [
            "We've written a dedicated guide comparing a private sauna to a shared one, covering the practical advantages in terms of hygiene, scheduling and comfort — useful if you're still weighing up whether an apartment with a private sauna is the right choice for your stay in Livigno."
          ]
        }
      ],
      highlights: [
        'Private infrared sauna, never shared with other guests',
        'Private steam bath included in the apartment',
        'Available any time, no reservation needed',
        'Part of a 970 sqft apartment, 3 bedrooms, up to 6 guests'
      ],
      faq: [
        {
          q: 'Is the sauna really private, or shared with other apartments?',
          a: "It's completely private: it's inside the apartment and available exclusively to the guests staying there, never shared with other guests or other units."
        },
        {
          q: 'Do I need to book a time slot to use the sauna or steam bath?',
          a: "No. Since it isn't a shared space, there's no slot to book: they're available at any time of day throughout your stay."
        },
        {
          q: 'Are the sauna and steam bath included in the price of the stay?',
          a: "Yes, they're part of the apartment and come at no extra cost on top of the booked stay."
        },
        {
          q: 'Are they useful in summer too, not just after skiing?',
          a: 'Yes: many guests use them in summer too, for muscle recovery after a day of hiking or mountain biking, not just in winter after skiing.'
        }
      ],
      internalLinkLabels: [
        'Discover the full wellness section at Ironwood Livigno',
        'Read the comparison: private sauna vs shared sauna',
        'Discover why we chose a private sauna for our home'
      ],
      ctaText: 'Check availability and book your private sauna',
      breadcrumbName: 'Private sauna',
      navLabel: 'Private sauna',
      relatedLinkLabel: 'Discover the fireplace, breakfast and other wellness details too'
    }
  },
  'camere-appartamento-livigno': {
    en: {
      title: "The apartment's 3 bedrooms in Livigno: layout, beds and details",
      metaTitle: '3-Bedroom Apartment in Livigno | Room Layout',
      metaDescription:
        '3 bedrooms, 2 bathrooms, 90 sqm: discover the detailed layout of the apartment in Livigno, room by room, designed for families and groups up to 6.',
      eyebrow: 'The bedrooms',
      intro:
        "Looking for a 3-bedroom apartment in Livigno and want to know exactly how the spaces are laid out before booking? Ironwood Livigno spans 90 sqm with 3 bedrooms and 2 full bathrooms, for up to 6 guests, just a 100-metre walk from the ski lifts. Here's the room-by-room detail, so you know exactly what to expect.",
      sections: [
        {
          heading: 'Bedroom 1 — Double Room (joined beds)',
          body: [
            'Two single beds joined by a mattress topper, for the uninterrupted comfort of a true double bed — ideal for a couple, or for the parents of the group who still prefer the flexibility of two single beds.'
          ]
        },
        {
          heading: 'Bedroom 2 — Twin Room',
          body: [
            "Two single beds, which can be joined on request to form a double — handy for children, older kids, or friends travelling together who'd rather not share a fixed double bed."
          ]
        },
        {
          heading: 'Bedroom 3 — Main Double Room',
          body: [
            "A double bed with a mattress topper for maximum comfort: this is the apartment's main bedroom, designed for those seeking more privacy than the other two rooms."
          ]
        },
        {
          heading: '2 full bathrooms, shared across the bedrooms',
          body: [
            'The whole apartment has 2 full bathrooms available, a layout designed specifically to avoid morning queues when the apartment is hosting a full family or group — a detail that makes a real difference compared to a typical two-room apartment with just one bathroom.'
          ]
        }
      ],
      highlights: [
        '3 bedrooms, 90 sqm total',
        '2 full bathrooms shared across the bedrooms',
        'Sleeps up to 6, for families and groups',
        'Flexible layout: single or double beds',
        '100 m from the ski lifts'
      ],
      faq: [
        {
          q: 'How many people can comfortably sleep in the apartment?',
          a: 'Up to 6 people, spread across the 3 bedrooms: one with single beds joined double-style, one with separable single beds, and the main double bedroom.'
        },
        {
          q: 'Can the single beds be joined into a double?',
          a: "Yes, in Bedroom 2 the two single beds can be joined on request. In Bedroom 1 they're already joined with a topper, for the uninterrupted comfort of a double bed."
        },
        {
          q: 'Is there more than one bathroom?',
          a: 'Yes, the apartment has 2 full bathrooms, shared across the 3 bedrooms — handy for families and groups using all the spaces at the same time.'
        }
      ],
      internalLinkLabels: [
        'Discover why the apartment is designed for families and groups',
        'Discover who renovated the apartment, and why',
        'See the address, parking and how to get here'
      ],
      ctaText: 'Check availability for your bedrooms',
      breadcrumbName: 'The bedrooms',
      navLabel: 'The bedrooms',
      relatedLinkLabel: 'Discover all the details designed for families and groups'
    },
    'en-us': {
      title: "The apartment's 3 bedrooms in Livigno, Italy: layout, beds and details",
      metaTitle: '3-Bedroom Apartment in Livigno, Italy | Room Layout',
      metaDescription:
        '3 bedrooms, 2 bathrooms, 970 sqft: discover the detailed layout of the apartment in Livigno, Italy, room by room, designed for families and groups up to 6.',
      eyebrow: 'The bedrooms',
      intro:
        "Looking for a 3-bedroom apartment in Livigno and want to know exactly how the spaces are laid out before booking? Ironwood Livigno spans 970 sqft with 3 bedrooms and 2 full bathrooms, for up to 6 guests, just a 100-meter walk from the ski lifts. Here's the room-by-room detail, so you know exactly what to expect.",
      sections: [
        {
          heading: 'Bedroom 1 — Double Room (joined beds)',
          body: [
            'Two twin beds joined by a mattress topper, for the uninterrupted comfort of a true double bed — ideal for a couple, or for the parents of the group who still prefer the flexibility of two twin beds.'
          ]
        },
        {
          heading: 'Bedroom 2 — Twin Room',
          body: [
            "Two twin beds, which can be joined on request to form a double — handy for kids, older children, or friends traveling together who'd rather not share a fixed double bed."
          ]
        },
        {
          heading: 'Bedroom 3 — Main Double Room',
          body: [
            "A double bed with a mattress topper for maximum comfort: this is the apartment's main bedroom, designed for those seeking more privacy than the other two rooms."
          ]
        },
        {
          heading: '2 full bathrooms, shared across the bedrooms',
          body: [
            'The whole apartment has 2 full bathrooms available, a layout designed specifically to avoid morning lines when the apartment is hosting a full family or group — a detail that makes a real difference compared to a typical two-room apartment with just one bathroom.'
          ]
        }
      ],
      highlights: [
        '3 bedrooms, 970 sqft total',
        '2 full bathrooms shared across the bedrooms',
        'Sleeps up to 6, for families and groups',
        'Flexible layout: twin or double beds',
        '100 m from the ski lifts'
      ],
      faq: [
        {
          q: 'How many people can comfortably sleep in the apartment?',
          a: 'Up to 6 people, spread across the 3 bedrooms: one with twin beds joined double-style, one with separable twin beds, and the main double bedroom.'
        },
        {
          q: 'Can the twin beds be joined into a double?',
          a: "Yes, in Bedroom 2 the two twin beds can be joined on request. In Bedroom 1 they're already joined with a topper, for the uninterrupted comfort of a double bed."
        },
        {
          q: 'Is there more than one bathroom?',
          a: 'Yes, the apartment has 2 full bathrooms, shared across the 3 bedrooms — handy for families and groups using all the spaces at the same time.'
        }
      ],
      internalLinkLabels: [
        'Discover why the apartment is designed for families and groups',
        'Discover who renovated the apartment, and why',
        'See the address, parking and how to get here'
      ],
      ctaText: 'Check availability for your bedrooms',
      breadcrumbName: 'The bedrooms',
      navLabel: 'The bedrooms',
      relatedLinkLabel: 'Discover all the details designed for families and groups'
    }
  },
  'livigno-estate': {
    en: {
      title: 'What to do in Livigno in summer: 10 unmissable experiences',
      metaTitle: 'Livigno in Summer | 10 Things to Do: Biking, Hiking and the Lake',
      metaDescription:
        'Mountain biking, hiking, Lake Livigno and a private sauna after sport: 10 unmissable experiences to help plan your summer in Livigno.',
      eyebrow: 'Livigno in summer',
      intro:
        "What to do in Livigno in summer, in practice? From June to September the alpine basin becomes one of Europe's mountain biking capitals, with trails for every level, a lake to explore by canoe or on foot, and a duty-free pedestrian centre worth a stroll. Here are 10 unmissable experiences to help plan your summer in Livigno, in short.",
      sections: [
        {
          heading: '1–2. Mountain biking: Mottolino Bike Park and the Bike Academy',
          body: [
            'Mottolino Bike Park is the reference point for adrenaline, with 14 trails spanning downhill, a jump area and north shore sections. For families or first-time riders, the Bike Academy offers a roughly 5 km route built specifically for beginners.'
          ]
        },
        {
          heading: '3–4. Hiking: Lake Livigno and the pastures in bloom',
          body: [
            'The loop around Lake Livigno is the simplest, most accessible walk, with plenty of spots for a picnic. For a more demanding hike, the trails through the pastures in bloom — arnica is the flower most associated with the area — offer views over the Rhaetian Alps.'
          ]
        },
        {
          heading: '5–6. Carosello 3000 in summer and a canoe trip',
          body: [
            'The winter ski area\'s lifts also open in summer (roughly from 20 June to 13 September), linking scenic trails at altitude. On warmer days, the lake is also good for a canoe trip.'
          ]
        },
        {
          heading: '7–8. Duty-free shopping and Valtellina specialities',
          body: [
            "Livigno's pedestrian centre, a duty-free customs zone, remains an almost obligatory stop for shopping. Also worth trying: Valtellina specialities — pizzoccheri, sciatt and bresaola IGP — at the town's restaurants, or cooked at leisure back at the apartment."
          ]
        },
        {
          heading: '9–10. A private sauna after sport, and cool temperatures even in August',
          body: [
            'After a day of hiking or mountain biking, the private infrared sauna and steam bath help loosen up your muscles before dinner. And summer temperatures in Livigno stay cool even at the height of summer — one more reason for anyone looking to escape city heat.'
          ]
        }
      ],
      highlights: [
        'Over 50 km of trails for mountain biking and hiking',
        'Lake Livigno: walk, picnic or canoe',
        'Duty-free pedestrian centre, a 15-minute walk away',
        'Private sauna available after summer sport too'
      ],
      faq: [
        {
          q: "Is Livigno worth visiting even if you don't mountain bike?",
          a: 'Yes: the walk around the lake, the pastures in bloom, duty-free shopping and Valtellina specialities are all accessible experiences — no need to be an experienced biker or hiker.'
        },
        {
          q: 'When are the summer lifts at Carosello 3000 open?',
          a: 'Roughly from 20 June to 13 September, linking scenic trails at altitude — exact dates can vary year to year.'
        },
        {
          q: 'Is it hot in Livigno in summer?',
          a: 'Temperatures generally stay cool even in August, one of the reasons Livigno is popular with those looking to escape city heat.'
        }
      ],
      internalLinkLabels: [
        'Read the full guide to summer in Livigno at Ironwood',
        'Read the full article with all the details',
        'Discover activities suited to children too'
      ],
      ctaText: 'Check availability for your summer in Livigno',
      breadcrumbName: 'Livigno in summer',
      navLabel: 'Summer highlights',
      relatedLinkLabel: 'Also read the guide to mountain biking, hiking and the lake'
    },
    'en-us': {
      title: 'What to do in Livigno, Italy in summer: 10 unmissable experiences',
      metaTitle: 'Livigno, Italy in Summer | 10 Things to Do: Biking, Hiking and the Lake',
      metaDescription:
        'Mountain biking, hiking, Lake Livigno and a private sauna after sport: 10 unmissable experiences to help plan your summer vacation in the Italian Alps.',
      eyebrow: 'Livigno in summer',
      intro:
        "What to do in Livigno, Italy in summer, in practice? From June to September this basin in the Italian Alps becomes one of Europe's mountain biking capitals, with trails for every level, a lake to explore by canoe or on foot, and a duty-free pedestrian center worth a stroll. Here are 10 unmissable experiences to help plan your summer in Livigno, in short.",
      sections: [
        {
          heading: '1–2. Mountain biking: Mottolino Bike Park and the Bike Academy',
          body: [
            'Mottolino Bike Park is the reference point for adrenaline, with 14 trails spanning downhill, a jump area and north shore sections. For families or first-time riders, the Bike Academy offers a roughly 5 km route built specifically for beginners.'
          ]
        },
        {
          heading: '3–4. Hiking: Lake Livigno and the pastures in bloom',
          body: [
            'The loop around Lake Livigno is the simplest, most accessible walk, with plenty of spots for a picnic. For a more demanding hike, the trails through the pastures in bloom — arnica is the flower most associated with the area — offer views over the Rhaetian Alps.'
          ]
        },
        {
          heading: '5–6. Carosello 3000 in summer and a canoe trip',
          body: [
            "The winter ski area's lifts also open in summer (roughly from June 20 to September 13), linking scenic trails at altitude. On warmer days, the lake is also good for a canoe trip."
          ]
        },
        {
          heading: '7–8. Duty-free shopping and Valtellina specialties',
          body: [
            "Livigno's pedestrian center, a duty-free customs zone, remains an almost obligatory stop for shopping. Also worth trying: Valtellina specialties — pizzoccheri, sciatt and bresaola IGP — at the town's restaurants, or cooked at leisure back at the apartment."
          ]
        },
        {
          heading: '9–10. A private sauna after sport, and cool temperatures even in August',
          body: [
            'After a day of hiking or mountain biking, the private infrared sauna and steam bath help loosen up your muscles before dinner. And summer temperatures in Livigno stay cool even at the height of summer — one more reason for anyone looking to escape city heat.'
          ]
        }
      ],
      highlights: [
        'Over 50 km of trails for mountain biking and hiking',
        'Lake Livigno: walk, picnic or canoe',
        'Duty-free pedestrian center, a 15-minute walk away',
        'Private sauna available after summer sport too'
      ],
      faq: [
        {
          q: "Is Livigno worth visiting even if you don't mountain bike?",
          a: 'Yes: the walk around the lake, the pastures in bloom, duty-free shopping and Valtellina specialties are all accessible experiences — no need to be an experienced biker or hiker.'
        },
        {
          q: 'When are the summer lifts at Carosello 3000 open?',
          a: 'Roughly from June 20 to September 13, linking scenic trails at altitude — exact dates can vary year to year.'
        },
        {
          q: 'Is it hot in Livigno in summer?',
          a: 'Temperatures generally stay cool even in August, one of the reasons Livigno is popular with those looking to escape city heat.'
        }
      ],
      internalLinkLabels: [
        'Read the full guide to summer in Livigno at Ironwood',
        'Read the full article with all the details',
        'Discover activities suited to kids too'
      ],
      ctaText: 'Check availability for your summer vacation in Livigno',
      breadcrumbName: 'Livigno in summer',
      navLabel: 'Summer highlights',
      relatedLinkLabel: 'Also read the guide to mountain biking, hiking and the lake'
    }
  }
};

// Small per-locale UI strings for the chrome text that lives inside the
// [locale] page templates and LandingPageBody, not in the translation data
// itself — identical across all 9 satellite pages, so defined once here
// instead of duplicated per page.tsx (unlike the blog, which only has 2
// locales and keeps its UI dict inline per file).
export type LandingUi = {
  backLabel: string;
  whyTitle: string;
  discoverMoreLabel: string;
  faqTitle: string;
  ogLocale: string;
};

export const landingPageUi: Record<TranslatedLandingLocale, LandingUi> = {
  en: { backLabel: '← Back to home', whyTitle: 'Why Ironwood', discoverMoreLabel: 'Learn more →', faqTitle: 'Frequently asked questions', ogLocale: 'en_GB' },
  'en-us': { backLabel: '← Back to home', whyTitle: 'Why Ironwood', discoverMoreLabel: 'Learn more →', faqTitle: 'Frequently asked questions', ogLocale: 'en_US' },
  de: { backLabel: '← Zurück zur Startseite', whyTitle: 'Warum Ironwood', discoverMoreLabel: 'Mehr erfahren →', faqTitle: 'Häufig gestellte Fragen', ogLocale: 'de_DE' },
  fr: { backLabel: "← Retour à l'accueil", whyTitle: 'Pourquoi Ironwood', discoverMoreLabel: 'En savoir plus →', faqTitle: 'Questions fréquentes', ogLocale: 'fr_FR' },
  da: { backLabel: '← Tilbage til forsiden', whyTitle: 'Hvorfor Ironwood', discoverMoreLabel: 'Læs mere →', faqTitle: 'Ofte stillede spørgsmål', ogLocale: 'da_DK' },
  pl: { backLabel: '← Powrót do strony głównej', whyTitle: 'Dlaczego Ironwood', discoverMoreLabel: 'Dowiedz się więcej →', faqTitle: 'Najczęściej zadawane pytania', ogLocale: 'pl_PL' },
  cs: { backLabel: '← Zpět na hlavní stránku', whyTitle: 'Proč Ironwood', discoverMoreLabel: 'Zjistit více →', faqTitle: 'Časté dotazy', ogLocale: 'cs_CZ' },
  no: { backLabel: '← Tilbake til hjemmesiden', whyTitle: 'Hvorfor Ironwood', discoverMoreLabel: 'Les mer →', faqTitle: 'Ofte stilte spørsmål', ogLocale: 'nb_NO' },
  nl: { backLabel: '← Terug naar home', whyTitle: 'Waarom Ironwood', discoverMoreLabel: 'Meer ontdekken →', faqTitle: 'Veelgestelde vragen', ogLocale: 'nl_NL' },
  zh: { backLabel: '← 返回首页', whyTitle: '为什么选择 Ironwood', discoverMoreLabel: '了解更多 →', faqTitle: '常见问题', ogLocale: 'zh_CN' },
  ja: { backLabel: '← ホームに戻る', whyTitle: 'Ironwoodが選ばれる理由', discoverMoreLabel: 'もっと詳しく →', faqTitle: 'よくある質問', ogLocale: 'ja_JP' }
};

const satelliteSlugSet = new Set(landingPages.map((p) => p.slug));

// Resolves a landingPages.ts href (as written in the Italian original) to
// its locale-appropriate target:
// - '/blog' (index) stays as-is, it isn't translated as a listing page
// - '/blog/<slug>' -> '/blog/<slug>/<locale>' if that article has a
//   translation for this locale (translatedBlogLocales is just en/de —
//   narrower than translatedLandingLocales), otherwise stays on the
//   Italian original rather than 404ing on a guessed URL
// - '/it#<anchor>' -> '/<locale>#<anchor>'
// - '/it/contatti' -> '/<locale>/<contactSlugs[locale]>'
// - a bare '/<slug>' matching another satellite page -> '/<slug>/<locale>'
//   (always resolves once that page's translation exists, since every
//   satellite page gets every locale in this rollout)
export function localizeLandingLink(href: string, locale: TranslatedLandingLocale): string {
  if (href === '/blog') return href;
  if (href.startsWith('/blog/')) {
    const slug = href.slice('/blog/'.length);
    const isBlogTranslatedLocale = (translatedBlogLocales as readonly string[]).includes(locale);
    if (isBlogTranslatedLocale && blogTranslations[slug]?.[locale as 'en' | 'de']) {
      return `${href}/${locale}`;
    }
    return href;
  }
  if (href.startsWith('/it#')) return `/${locale}${href.slice('/it'.length)}`;
  if (href === '/it/contatti') return `/${locale}/${contactSlugs[locale as Locale]}`;
  const bareSlug = href.replace(/^\//, '');
  if (satelliteSlugSet.has(bareSlug) && landingPageTranslations[bareSlug]?.[locale]) {
    return `${href}/${locale}`;
  }
  return href;
}
