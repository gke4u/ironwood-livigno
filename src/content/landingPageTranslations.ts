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
    },
    de: {
      title: 'Winterurlaub in Livigno: Skifahren, private Sauna und Komfort direkt an der Piste',
      metaTitle: 'Winterurlaub in Livigno | Ferienwohnung mit Sauna, 100 m von den Liften',
      metaDescription: 'Private Infrarotsauna und Dampfbad, 100 m vom Carosello 3000: entdecken Sie den Winter in Livigno bei Ironwood.',
      eyebrow: 'Winter in Livigno',
      intro:
        'Livigno hat eine der längsten Skisaisons der italienischen Alpen: Die Pisten sind von Ende November bis Anfang Mai geöffnet, das Skigebiet reicht auf über 3.000 Meter, und nach der letzten Abfahrt wartet der seltene Komfort einer privaten Sauna.',
      sections: [
        {
          heading: 'Das Skigebiet: Carosello 3000 und Mottolino',
          body: [
            'Livigno erstreckt sich über zwei Hauptseiten. Carosello 3000, das größere der beiden Gebiete, bietet Pisten für jedes Niveau und Ausblicke auf über 3.000 Meter Höhe. Mottolino ist die erste Adresse für Freeride und anspruchsvolleres Gelände und wird im Sommer zum Bikepark des Ortes. Zusammen decken die beiden Gebiete alles ab, von Familien mit Anfängern bis zu erfahrenen Skifahrern.',
            'Livigno ist auch für den Langlauf bekannt: Einige Loipen führen mitten durch das Ortszentrum und das Tal — eine ruhigere Aktivität als Abfahrtsski, gut geeignet für Familien mit Kindern oder alle, die einfach mal etwas anderes machen möchten.'
          ]
        },
        {
          heading: 'Eine längere Saison als anderswo',
          body: [
            'Die Wintersaison in Livigno dauert in der Regel von Ende November bis Anfang Mai — länger als in vielen anderen italienischen Alpenorten. Das heißt, Sie können ganz zu Saisonbeginn oder -ende Ski fahren, wenn die Lifte anderswo bereits geschlossen sind — oft mit weniger Andrang auf den Pisten und günstigeren Preisen außerhalb der Hauptsaison (Weihnachten, Neujahr, Februar).'
          ]
        },
        {
          heading: 'Der Vorteil, 100 Meter von der Piste entfernt zu wohnen',
          body: [
            'Ironwood Livigno liegt nur 100 Meter zu Fuß von den Skiliften entfernt und 50 Meter von Skischule und Ausrüstungsverleih: Sie können den ganzen Vormittag Ski fahren, ohne das Auto zu bewegen, bei Bedarf zum Mittagessen zurückkehren und am Nachmittag ohne Zeitverlust wieder auf die Piste.',
            "Doch erst nach der letzten Abfahrt zeigt sich der wahre Unterschied. In der Wohnung sind Infrarotsauna und Dampfbad privat — nie mit anderen Gästen geteilt, anders als im Hotel-Spa. Genau dann werden die Muskeln wirklich warm, noch bevor Sie ans Abendessen denken, am elektrischen Kamin im Wohnzimmer.",
            'Die Wohnung verfügt außerdem über einen eigenen Abstellraum für Ski, Skischuhe und Ausrüstung, sodass Sie nicht jeden Abend alles hineintragen müssen, plus einen kostenlosen Parkplatz für die Anreise mit dem Auto.'
          ]
        }
      ],
      highlights: [
        '100 m von den Skiliften, 50 m von Skischule und Verleih',
        'Private Infrarotsauna und Dampfbad, nie geteilt',
        'Eigener Ski- und Schuhabstellraum',
        '3 Schlafzimmer und 2 Bäder für Familien und Gruppen bis 6 Personen'
      ],
      ctaText: 'Verfügbarkeit für Ihren Winterurlaub in Livigno prüfen',
      breadcrumbName: 'Winter in Livigno',
      navLabel: 'Winter',
      relatedLinkLabel: 'Lesen Sie den vollständigen Guide zum Skigebiet Carosello 3000'
    },
    fr: {
      title: 'Hiver à Livigno : ski, sauna privé et confort à deux pas des pistes',
      metaTitle: "Vacances d'hiver à Livigno | Appartement avec sauna à 100 m des remontées",
      metaDescription:
        "Sauna infrarouge et hammam privés à 100 m du Carosello 3000 : découvrez l'hiver à Livigno chez Ironwood.",
      eyebrow: 'Hiver à Livigno',
      intro:
        "Livigno bénéficie de l'une des saisons de ski les plus longues des Alpes italiennes : pistes ouvertes de fin novembre à début mai, un domaine skiable qui culmine à plus de 3 000 mètres, et le rare confort de rentrer se réchauffer dans un sauna privé après la dernière descente.",
      sections: [
        {
          heading: 'Le domaine skiable : Carosello 3000 et Mottolino',
          body: [
            "Livigno se déploie sur deux versants principaux. Carosello 3000, le plus vaste, offre des pistes pour tous les niveaux et des panoramas qui frôlent les 3 000 mètres d'altitude. Mottolino est la référence pour le freeride et les terrains plus techniques, et devient le bike park de la station en été. Ensemble, les deux domaines couvrent aussi bien les familles débutantes que les skieurs expérimentés.",
            "Livigno est aussi réputée pour le ski de fond : certaines boucles traversent le centre du village et la vallée, une activité plus tranquille à alterner avec les journées sur les pistes de ski alpin — idéal pour les familles avec enfants, ou pour changer de rythme."
          ]
        },
        {
          heading: 'Une saison plus longue que la moyenne',
          body: [
            "La saison hivernale à Livigno s'étend généralement de fin novembre à début mai, plus longue que dans de nombreuses autres stations alpines italiennes. Cela permet de skier en tout début ou fin de saison, quand les remontées sont déjà fermées ailleurs — souvent avec moins d'affluence sur les pistes et des prix plus doux en dehors des périodes de pointe (Noël, Nouvel An, février)."
          ]
        },
        {
          heading: "L'avantage de rentrer à 100 mètres des pistes",
          body: [
            "Ironwood Livigno se trouve à seulement 100 mètres à pied des remontées mécaniques et à 50 mètres de l'école de ski et de la location de matériel : vous pouvez skier toute la matinée sans déplacer la voiture, rentrer déjeuner si besoin, et retourner sur les pistes l'après-midi sans perdre de temps en trajets.",
            "Mais c'est après la dernière descente que la différence se fait vraiment sentir. Dans l'appartement, le sauna infrarouge et le hammam sont privés — jamais partagés avec d'autres clients, contrairement à un spa d'hôtel. C'est le moment où les muscles se détendent vraiment, avant même de penser au dîner, près de la cheminée électrique du salon.",
            "L'appartement dispose aussi d'un espace dédié pour ranger skis, chaussures et matériel, pour ne pas avoir à tout rentrer chaque soir, ainsi que d'une place de parking gratuite pour les arrivées en voiture."
          ]
        }
      ],
      highlights: [
        "À 100 m des remontées mécaniques, 50 m de l'école de ski et de la location",
        'Sauna infrarouge et hammam privés, jamais partagés',
        'Espace de rangement dédié pour skis et chaussures',
        "3 chambres et 2 salles de bains pour familles et groupes jusqu'à 6 personnes"
      ],
      ctaText: 'Vérifiez les disponibilités pour votre hiver à Livigno',
      breadcrumbName: 'Hiver à Livigno',
      navLabel: 'Hiver',
      relatedLinkLabel: 'Lisez le guide complet du domaine skiable Carosello 3000'
    },
    da: {
      title: 'Vinter i Livigno: skiløb, privat sauna og komfort tæt på pisterne',
      metaTitle: 'Vinterferie i Livigno | Lejlighed med sauna 100 m fra liftene',
      metaDescription: 'Privat infrarød sauna og dampbad 100 m fra Carosello 3000: oplev vinteren i Livigno hos Ironwood.',
      eyebrow: 'Vinter i Livigno',
      intro:
        'Livigno har en af de længste skisæsoner i de italienske Alper: pisterne er åbne fra slutningen af november til begyndelsen af maj, skiområdet når over 3.000 meter, og efter dagens sidste tur venter den sjældne komfort ved en privat sauna.',
      sections: [
        {
          heading: 'Skiområdet: Carosello 3000 og Mottolino',
          body: [
            'Livigno strækker sig over to hovedsider. Carosello 3000, det største af de to områder, har pister til alle niveauer og udsigter, der når over 3.000 meters højde. Mottolino er det oplagte valg for freeride og mere teknisk terræn, og bliver om sommeren til byens bikepark. Sammen dækker de to områder alt fra familier med begyndere til erfarne skiløbere.',
            'Livigno er også kendt for langrend: nogle af sporene løber gennem selve byen og dalen — en roligere aktivitet at veksle med dage på nedfartspisterne, god for familier med børn eller for alle, der bare vil have en pause.'
          ]
        },
        {
          heading: 'En længere sæson end de fleste',
          body: [
            'Vintersæsonen i Livigno varer typisk fra slutningen af november til begyndelsen af maj — længere end mange andre italienske alpebyer. Det betyder, du kan stå på ski helt i starten eller slutningen af sæsonen, når liftene andre steder allerede er lukket — ofte med mindre trængsel på pisterne og lavere priser uden for højsæsonen (jul, nytår, februar).'
          ]
        },
        {
          heading: 'Fordelen ved at bo 100 meter fra pisterne',
          body: [
            'Ironwood Livigno ligger kun 100 meter til fods fra skiliftene og 50 meter fra skiskole og udstyrsudlejning: du kan stå på ski hele formiddagen uden at flytte bilen, komme hjem til frokost hvis du vil, og være tilbage på pisten om eftermiddagen uden at spilde tid på transport.',
            'Men det er efter dagens sidste tur, at forskellen for alvor mærkes. I lejligheden er den infrarøde sauna og dampbadet privat — aldrig delt med andre gæster, i modsætning til et hotelspa. Det er da, musklerne rigtig varmes op, endnu inden du tænker på aftensmaden, ved stuens elektriske pejs.',
            'Lejligheden har desuden et eget opbevaringsrum til ski, støvler og udstyr, så du ikke behøver bære alt ind hver aften, plus en gratis parkeringsplads for dem, der ankommer i bil.'
          ]
        }
      ],
      highlights: [
        '100 m fra skiliftene, 50 m fra skiskole og udlejning',
        'Privat infrarød sauna og dampbad, aldrig delt',
        'Eget opbevaringsrum til ski og støvler',
        '3 soveværelser og 2 badeværelser til familier og grupper på op til 6 personer'
      ],
      ctaText: 'Tjek ledighed for din vinter i Livigno',
      breadcrumbName: 'Vinter i Livigno',
      navLabel: 'Vinter',
      relatedLinkLabel: 'Læs den fulde guide til skiområdet Carosello 3000'
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
    },
    de: {
      title: 'Sommer in Livigno: Mountainbike, Wandern und Entspannung in der Ferienwohnung mit Sauna',
      metaTitle: 'Sommerurlaub in Livigno | Mountainbike, Wandern und private Sauna',
      metaDescription:
        'Bikepark, Wege für jedes Niveau und der Lago di Livigno: entdecken Sie den Sommer in Livigno und warum eine Ferienwohnung mit privater Sauna die ideale Basis ist.',
      eyebrow: 'Sommer in Livigno',
      intro:
        'Livigno ist nicht nur ein Winterziel: Von Juni bis September verwandelt sich das Alpenbecken in eine der Mountainbike-Hauptstädte Europas, mit Trails für Familien, Wanderer und erfahrene Biker.',
      sections: [
        {
          heading: 'Mountainbike: vom Mottolino Bike Park bis zur Bike Academy',
          body: [
            'Der Mottolino Bike Park ist die erste Adresse für alle, die Adrenalin suchen, mit Downhill-Strecken, einem Jump-Bereich und North-Shore-Abschnitten. Auch Carosello 3000 öffnet seine Lifte im Sommer und verbindet Panoramawege in der Höhe. Für Anfänger oder Familien mit Kindern bietet die Bike Academy eine speziell konzipierte Strecke.',
            'Insgesamt zählt das Gebiet über 50 km ausgeschilderte Trails, geeignet sowohl für technische Abfahrten als auch für eine entspannte Fahrt durch die Lärchenwälder.'
          ]
        },
        {
          heading: 'Wandern, der Lago di Livigno und die Almen',
          body: [
            'Man muss kein Biker sein, um Livigno im Sommer zu genießen. Das Becken wird von Wanderwegen jeden Schwierigkeitsgrads durchzogen, vorbei an blühenden Almen — die Arnika ist die Symbolblume der Region — mit Blick auf die Rätischen Alpen. Ein für alle geeigneter Spaziergang ist die Runde um den Lago di Livigno, mit vielen Möglichkeiten für ein Picknick an warmen Tagen.',
            'Die Sommertemperaturen bleiben auch im August angenehm kühl — ein weiterer Grund, warum Livigno bei allen beliebt ist, die der Stadthitze entkommen möchten.'
          ]
        },
        {
          heading: 'Warum Sie im Sommer bei Ironwood übernachten sollten',
          body: [
            'Die Lage nur wenige Schritte von den Liften, praktisch im Winter, ist auch im Sommer nützlich, um die wichtigsten Trailheads zu Fuß oder mit dem Rad zu erreichen. Auf Wunsch stellen wir 2 E-Bikes direkt vor Ort zur Verfügung, damit Sie mehr Strecke zurücklegen können, ohne sich bei den Anstiegen zu sehr anzustrengen — praktisch für Familien oder alle, die keine geübten Radfahrer sind.',
            'Nach einem Tag auf den Trails oder dem Rad sind die beiden Balkone der Wohnung mit Bergblick der richtige Ort zum Entspannen, und die private Infrarotsauna bleibt auch außerhalb der Skisaison ein kleiner Luxus für alle, die sich nach einer anstrengenden Wanderung lockern möchten.'
          ]
        }
      ],
      highlights: [
        'E-Bike-Verleih direkt vor Ort verfügbar',
        'Zwei Balkone mit Bergblick',
        'Private Infrarotsauna, auch nach dem Wandern nützlich',
        'Wenige Schritte von Trailheads und Bikepark entfernt'
      ],
      ctaText: 'Verfügbarkeit für Ihren Sommer in Livigno prüfen',
      breadcrumbName: 'Sommer in Livigno',
      navLabel: 'Sommer',
      relatedLinkLabel: 'Lesen Sie den vollständigen Guide zum Sommer in Livigno'
    },
    fr: {
      title: "Été à Livigno : VTT, randonnée et détente dans l'appartement avec sauna",
      metaTitle: 'Vacances d\'été à Livigno | VTT, randonnée et sauna privé',
      metaDescription:
        "Bike park, sentiers pour tous niveaux et le lac de Livigno : découvrez l'été à Livigno et pourquoi un appartement avec sauna privé est la base idéale.",
      eyebrow: 'Été à Livigno',
      intro:
        "Livigno n'est pas seulement une destination hivernale : de juin à septembre, le bassin alpin devient l'une des capitales du VTT en Europe, avec des sentiers pour les familles, les randonneurs et les vététistes expérimentés.",
      sections: [
        {
          heading: 'VTT : du Mottolino Bike Park à la Bike Academy',
          body: [
            "Le Mottolino Bike Park est la référence pour les amateurs de sensations fortes, avec des pistes de descente, une zone de saut et des sections north shore. Carosello 3000 ouvre lui aussi ses remontées en été, reliant des sentiers panoramiques en altitude. Pour les débutants ou les familles avec enfants, la Bike Academy propose un parcours pensé spécialement pour les novices.",
            'Au total, le domaine compte plus de 50 km de sentiers balisés, adaptés aussi bien aux descentes techniques qu\'à une balade tranquille à travers les mélèzes.'
          ]
        },
        {
          heading: 'Randonnée, le lac de Livigno et les alpages',
          body: [
            "Pas besoin d'être vététiste pour profiter de Livigno en été. Le bassin est traversé par des sentiers de randonnée de tous niveaux, entre alpages fleuris — l'arnica est la fleur emblématique de la région — avec vue sur les Alpes rhétiques. Une promenade accessible à tous est le tour du lac de Livigno, avec de nombreux endroits pour pique-niquer les jours les plus chauds.",
            "Les températures estivales restent fraîches même en août, une raison de plus pour laquelle Livigno est appréciée par ceux qui cherchent à échapper à la chaleur des villes."
          ]
        },
        {
          heading: "Pourquoi séjourner chez Ironwood en été",
          body: [
            "L'emplacement à deux pas des remontées, pratique en hiver, reste utile en été pour rejoindre à pied ou à vélo les principaux accès aux sentiers. Sur demande, nous mettons à disposition la location de 2 vélos électriques directement sur place, pour explorer davantage de terrain sans trop forcer dans les montées — utile aussi pour les familles ou pour qui n'est pas un cycliste entraîné.",
            "Après une journée sur les sentiers ou à vélo, les deux balcons avec vue sur la montagne de l'appartement sont l'endroit idéal pour se détendre, et le sauna infrarouge privé reste un petit luxe disponible même hors saison de ski, pour qui veut délasser ses muscles après une randonnée exigeante."
          ]
        }
      ],
      highlights: [
        'Location de vélos électriques disponible directement sur place',
        'Deux balcons avec vue sur la montagne',
        'Sauna infrarouge privé, utile aussi après la randonnée',
        "À deux pas des accès aux sentiers et du bike park"
      ],
      ctaText: "Vérifiez les disponibilités pour votre été à Livigno",
      breadcrumbName: 'Été à Livigno',
      navLabel: 'Été',
      relatedLinkLabel: "Lisez le guide complet de l'été à Livigno"
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
    },
    de: {
      title: 'Livigno mit Kindern: die Ferienwohnung für Familien',
      metaTitle: 'Familienwohnung in Livigno | Bis zu 6 Personen, Kinderbett und Hochstuhl',
      metaDescription:
        '3 Schlafzimmer, 2 Bäder, Kinderbett und Hochstuhl auf Anfrage: entdecken Sie, warum Ironwood Livigno für Familien und Gruppen bis 6 Personen konzipiert ist.',
      eyebrow: 'Familien in Livigno',
      intro:
        'Einen Familienurlaub in Livigno zu planen bedeutet, nach Platz, Sicherheit und Komfort zu suchen — nicht nur nach einem zusätzlichen Bett. Ironwood Livigno wurde genau dafür konzipiert: Familien und Gruppen bis zu 6 Personen, in einer Wohnung, in der jeder seinen eigenen Raum hat.',
      sections: [
        {
          heading: 'Platz für alle: 3 Schlafzimmer, 2 Bäder, 90 m²',
          body: [
            'Die Wohnung erstreckt sich über 90 m² mit 3 Schlafzimmern und 2 vollständigen Bädern — eine flexible Aufteilung, die den Eltern etwas Privatsphäre lässt, während die Kleinen im Nebenzimmer schlafen. Das Doppelzimmer mit Topper ist für die Eltern der Gruppe gedacht, während das Zweibettzimmer für Kinder oder ältere Kids geeignet ist.',
            'Auf Anfrage stellen wir Kinderbett und Hochstuhl zur Verfügung, sodass Sie nicht mit sperriger Ausrüstung anreisen müssen. Die Küche ist voll ausgestattet — Geschirrspüler, Backofen, Kaffeemaschine — für Mahlzeiten nach Maß für die Kleinen, ohne jeden Abend auswärts essen zu müssen.'
          ]
        },
        {
          heading: 'Aktivitäten auch für Kinder, zu jeder Jahreszeit',
          body: [
            'Im Winter sind die Langlaufloipen mitten durch Livigno eine ruhigere Aktivität als die Abfahrtspisten, geeignet auch für Kinder, die zum ersten Mal Schnee erleben. Wer Alpinski ausprobieren möchte: Die Skischule liegt nur 50 Meter von der Wohnung entfernt — praktisch für Unterricht und schnellen Wechsel, ohne das Auto zu benutzen.',
            'Im Sommer bietet die Bike Academy von Livigno eine rund 5 km lange, speziell für Anfänger und Kinder konzipierte Strecke, während ein Spaziergang um den Lago di Livigno für die ganze Familie machbar ist, mit vielen Möglichkeiten für ein Picknick.'
          ]
        },
        {
          heading: 'Eine sichere, ruhige Umgebung',
          body: [
            'Die Wohnung liegt 100 Meter von den Skiliften entfernt und ist 15 Gehminuten vom Zentrum Livignos entfernt — eine praktische, aber ruhige Lage, um Pisten, Skischule und Geschäfte zu Fuß zu erreichen, ohne das Gedränge eines von Touristen überfüllten Zentrums. Der eigene Ski- und Fahrradabstellraum erspart es Ihnen, die Ausrüstung der ganzen Familie jeden Abend hineinzutragen.',
            'Und wenn die Kinder endlich schlafen, bleiben die private Infrarotsauna und das Dampfbad ein Rückzugsort nur für die Eltern — ein Detail, das laut den Bewertungen, die wir erhalten, viele Familien als eine der schönsten Überraschungen des Aufenthalts hervorheben.'
          ]
        }
      ],
      highlights: [
        '3 Schlafzimmer und 2 Bäder, bis zu 6 Schlafplätze',
        'Kinderbett und Hochstuhl auf Anfrage verfügbar',
        'Skischule 50 m entfernt, kinderfreundlicher Langlauf im Ort',
        'Voll ausgestattete Küche für Mahlzeiten nach Maß'
      ],
      ctaText: 'Verfügbarkeit für Ihre Familie prüfen',
      breadcrumbName: 'Familien in Livigno',
      navLabel: 'Familien',
      relatedLinkLabel: 'Lesen Sie den vollständigen Guide zu Livigno mit Kindern'
    },
    fr: {
      title: "Livigno avec des enfants : l'appartement pensé pour les familles",
      metaTitle: 'Appartement familial à Livigno | Jusqu\'à 6 personnes, lit bébé et chaise haute',
      metaDescription:
        "3 chambres, 2 salles de bains, lit bébé et chaise haute sur demande : découvrez pourquoi Ironwood Livigno est pensé pour les familles et groupes jusqu'à 6 personnes.",
      eyebrow: 'Familles à Livigno',
      intro:
        "Organiser des vacances en famille à Livigno, c'est chercher de l'espace, de la sécurité et du confort — pas seulement un lit supplémentaire. Ironwood Livigno a été conçu précisément dans cet esprit : familles et groupes jusqu'à 6 personnes, dans un appartement où chacun a son propre espace.",
      sections: [
        {
          heading: 'De la place pour tous : 3 chambres, 2 salles de bains, 90 m²',
          body: [
            "L'appartement s'étend sur 90 m² avec 3 chambres et 2 salles de bains complètes, une configuration flexible qui permet aux parents d'avoir un peu d'intimité pendant que les plus petits dorment dans la chambre voisine. La chambre double avec surmatelas est pensée pour les parents du groupe, tandis que la chambre à lits jumeaux convient aux enfants ou aux plus grands.",
            "Sur demande, nous fournissons lit bébé et chaise haute, pour ne pas avoir à voyager avec du matériel encombrant. La cuisine est entièrement équipée — lave-vaisselle, four, machine à café — pour préparer des repas adaptés aux enfants sans devoir sortir manger tous les soirs."
          ]
        },
        {
          heading: 'Des activités adaptées aux enfants aussi, à chaque saison',
          body: [
            "En hiver, les boucles de ski de fond qui traversent le centre de Livigno sont une activité plus tranquille que les pistes de descente, adaptée aussi aux enfants qui découvrent la neige pour la première fois. Pour ceux qui veulent essayer le ski alpin, l'école de ski se trouve à seulement 50 mètres de l'appartement — pratique pour les cours et les changements rapides sans avoir besoin de la voiture.",
            "En été, la Bike Academy de Livigno propose un parcours d'environ 5 km pensé spécialement pour les débutants et les enfants, tandis qu'une promenade autour du lac de Livigno est accessible à toute la famille, avec de nombreux endroits pour pique-niquer."
          ]
        },
        {
          heading: 'Un secteur sûr et tranquille',
          body: [
            "L'appartement se trouve à 100 mètres des remontées mécaniques et à 15 minutes à pied du centre de Livigno, dans un emplacement pratique mais tranquille — proche des pistes, de l'école de ski et des commerces à pied, sans l'agitation d'un centre bondé de touristes. Le local à skis et vélos dédié évite d'avoir à transporter le matériel de toute la famille à l'intérieur chaque soir.",
            "Et quand les enfants dorment enfin, le sauna infrarouge et le hammam privés restent un espace rien que pour les parents — un détail que, d'après les avis que nous recevons, de nombreuses familles signalent comme l'une des surprises les plus appréciées du séjour."
          ]
        }
      ],
      highlights: [
        '3 chambres et 2 salles de bains, jusqu\'à 6 couchages',
        'Lit bébé et chaise haute disponibles sur demande',
        "École de ski à 50 m, ski de fond adapté aux enfants dans le village",
        'Cuisine entièrement équipée pour des repas adaptés aux enfants'
      ],
      ctaText: 'Vérifiez les disponibilités pour votre famille',
      breadcrumbName: 'Familles à Livigno',
      navLabel: 'Familles',
      relatedLinkLabel: 'Lisez le guide complet de Livigno avec des enfants'
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
    },
    de: {
      title: 'Wellness in Livigno: private Infrarotsauna und Dampfbad',
      metaTitle: 'Private Sauna in Livigno | Dampfbad und Wellness in der Ferienwohnung',
      metaDescription:
        'Private Infrarotsauna und Dampfbad, nie mit anderen Gästen geteilt: entdecken Sie die Wellness-Seite eines Aufenthalts in Livigno bei Ironwood.',
      eyebrow: 'Wellness',
      intro:
        'Nach einem Tag auf der Piste oder auf den Wanderwegen zählt die Erholung genauso viel wie die Aktivität selbst. Bei Ironwood Livigno sind Infrarotsauna und Dampfbad kein gemeinsam genutzter Service in einem Gemeinschaftsbereich: Sie sind privat, innerhalb der Wohnung, nur für die aktuellen Gäste verfügbar.',
      sections: [
        {
          heading: 'Warum eine private Sauna den Unterschied macht',
          body: [
            'In vielen Bergunterkünften sind Sauna und Dampfbad Gemeinschaftsbereiche, mit Buchungszeiten, mitzubringenden Bademänteln und der realen Möglichkeit, sie mit Fremden teilen zu müssen. Bei Ironwood in Livigno sind Infrarotsauna und Dampfbad dagegen ausschließlich den Gästen der Wohnung vorbehalten: kein Warten, keine Buchung, kein Teilen — zu jeder Tages- oder Abendstunde.',
            'Die Infrarotsauna eignet sich besonders für die Muskelerholung: Die Wärme dringt tief in das Gewebe ein — eine echte Hilfe nach einem Tag Skifahren, Wandern oder Mountainbiken, wenn Beine und Rücken schon vor dem Abendessen nach Lockerung verlangen.'
          ]
        },
        {
          heading: 'Ein einfaches Ritual, jeden Tag wiederholbar',
          body: [
            'Der Vorteil, Sauna und Dampfbad zu Hause statt in einem Gemeinschafts-Spa zu haben, ist die Freiheit, daraus eine tägliche Gewohnheit des Urlaubs zu machen: von der Piste oder vom Wanderweg zurückkommen, sich in Ruhe aufwärmen, vielleicht mit einem Glas Wein aus der Küche, und erst danach ans Abendessen denken. Kein Zeitplan, keine App zum Buchen eines Termins.',
            'Das Wohnzimmer mit seinem elektrischen Kamin rundet das Bild ab: Die Abende in der Wohnung werden ebenso Teil des Erlebnisses wie der Tag auf der Piste oder den Wanderwegen — kein bloßer Schlafplatz.'
          ]
        },
        {
          heading: 'Ein Detail, das Gästen wirklich auffällt',
          body: [
            'Das ist keine reine Marketing-Aussage: Es ist eines der Details, die in den echten Bewertungen, die wir auf Google und Airbnb erhalten, am häufigsten erwähnt werden — oft als einer der Hauptgründe genannt, sich für Ironwood statt für ein klassisches Hotel zu entscheiden. Und für alle, die das Erlebnis mit einem gepflegten Frühstück vor dem Start in den Tag abrunden möchten, bieten wir auf Anfrage auch einen kostenpflichtigen Frühstücksservice in einer Partnerunterkunft nur wenige Meter von der Wohnung entfernt.'
          ]
        }
      ],
      highlights: [
        'Private Infrarotsauna und Dampfbad, nie geteilt',
        'Keine Buchung nötig, jederzeit verfügbar',
        'Elektrischer Kamin im Wohnzimmer für die Abende',
        'Frühstück auf Anfrage nur wenige Meter entfernt'
      ],
      ctaText: 'Buchen Sie Ihren Wellness-Moment in Livigno',
      breadcrumbName: 'Wellness',
      navLabel: 'Wellness',
      relatedLinkLabel: 'Alle Details zu privater Sauna und Dampfbad ansehen'
    },
    fr: {
      title: 'Bien-être à Livigno : sauna infrarouge et hammam privés',
      metaTitle: 'Sauna privé à Livigno | Hammam et bien-être dans l\'appartement',
      metaDescription:
        "Sauna infrarouge et hammam privés, jamais partagés avec d'autres clients : découvrez le volet bien-être d'un séjour à Livigno chez Ironwood.",
      eyebrow: 'Bien-être',
      intro:
        "Après une journée sur les pistes ou les sentiers, la façon dont on récupère compte autant que l'activité elle-même. Chez Ironwood Livigno, le sauna infrarouge et le hammam ne sont pas un service partagé dans un espace commun : ils sont privés, à l'intérieur de l'appartement, réservés uniquement à ceux qui y séjournent.",
      sections: [
        {
          heading: 'Pourquoi un sauna privé fait la différence',
          body: [
            "Dans de nombreux hébergements de montagne, le sauna et le hammam sont des espaces communs, avec des créneaux à réserver, des peignoirs à apporter et le risque bien réel de devoir les partager avec des inconnus. Chez Ironwood à Livigno, le sauna infrarouge et le hammam sont au contraire réservés exclusivement aux clients de l'appartement : pas d'attente, pas de réservation, pas de partage — à toute heure du jour ou du soir.",
            "Le sauna infrarouge en particulier convient bien à la récupération musculaire : la chaleur pénètre en profondeur dans les tissus, une aide concrète après une journée de ski, de randonnée ou de VTT, quand jambes et dos réclament d'être détendus avant même de passer à table."
          ]
        },
        {
          heading: 'Un rituel simple, à répéter chaque jour',
          body: [
            "L'avantage d'avoir un sauna et un hammam chez soi plutôt que dans un spa partagé, c'est la liberté d'en faire une habitude quotidienne des vacances : rentrer des pistes ou du sentier, se réchauffer tranquillement, peut-être avec un verre de vin pris dans la cuisine, et ne penser au dîner qu'après. Aucun horaire à respecter, aucune application pour réserver un créneau.",
            "Le salon, avec sa cheminée électrique, complète le tableau : les soirées dans l'appartement font autant partie de l'expérience que la journée passée sur les pistes ou les sentiers, pas seulement un endroit où dormir."
          ]
        },
        {
          heading: 'Un détail que les clients remarquent vraiment',
          body: [
            "Ce n'est pas qu'un argument marketing : c'est l'un des détails les plus souvent mentionnés dans les avis réels que nous recevons sur Google et Airbnb, souvent décrit comme l'une des principales raisons de choisir Ironwood plutôt qu'un hôtel classique. Et pour ceux qui souhaitent compléter l'expérience avec un petit-déjeuner soigné avant de sortir, nous proposons aussi un service de petit-déjeuner payant sur demande, dans un établissement partenaire à quelques mètres de l'appartement."
          ]
        }
      ],
      highlights: [
        'Sauna infrarouge et hammam privés, jamais partagés',
        'Aucune réservation nécessaire, disponibles à toute heure',
        'Cheminée électrique dans le salon pour les soirées',
        "Petit-déjeuner sur demande à quelques mètres de l'appartement"
      ],
      ctaText: 'Réservez votre moment bien-être à Livigno',
      breadcrumbName: 'Bien-être',
      navLabel: 'Bien-être',
      relatedLinkLabel: 'Voir tous les détails du sauna et du hammam privés'
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
    },
    de: {
      title: 'So erreichen Sie Ironwood Livigno: Adresse, Parkplatz und die letzten Kilometer',
      metaTitle: 'Anreise zu Ironwood Livigno | Adresse, Parkplatz und letzter Streckenabschnitt',
      metaDescription:
        'Adresse, kostenloser Parkplatz und Entfernung zu den Liften: der praktische Guide zur Anreise nach Ironwood Livigno, Via Saroch 771, ganz ohne Überraschungen.',
      eyebrow: 'Anreise',
      intro:
        'Wenn Sie sich bereits für einen Aufenthalt bei Ironwood Livigno entschieden haben, finden Sie auf dieser Seite die praktischen Informationen zum letzten Streckenabschnitt: wo genau die Wohnung liegt, wie Sie sie vom Passo di Foscagno oder von Tirano aus erreichen, und was Sie zu Parkplatz und Ankunft wissen sollten. Den vollständigen Guide zu Zug, Auto oder Flugzeug ab Mailand finden Sie in unserem verlinkten Artikel am Ende dieser Seite.',
      sections: [
        {
          heading: 'Adresse und genaue Lage',
          body: [
            'Ironwood Livigno liegt in der Via Saroch 771, 23041 Livigno (SO), etwa 100 Meter zu Fuß von den Skiliften und 50 Meter von Skischule und Ausrüstungsverleih entfernt. Es ist eine praktische, aber ruhige Lage, etwa 15 Gehminuten vom Ortszentrum entfernt — ideal, um nach der Ankunft Pisten, Geschäfte und Restaurants zu Fuß zu erreichen.',
            'Die genauen GPS-Koordinaten sind 46.525061, 10.126967: nützlich für die Eingabe ins Navigationsgerät, besonders auf den letzten Bergkilometern, wo der Mobilfunkempfang weniger zuverlässig sein kann.'
          ]
        },
        {
          heading: 'Der letzte Streckenabschnitt, von Tirano oder der Schweizer Grenze aus',
          body: [
            'Wer mit dem Zug anreist, steigt am Bahnhof Tirano aus und fährt mit einem Linienbus (Umstieg in Bormio) weiter nach Livigno. Wer mit dem Auto von Mailand aus anreist, nimmt die SS38 Richtung Bormio und dann den Passo di Foscagno; aus der Schweiz kommend nimmt man stattdessen die Forcola di Livigno. Prüfen Sie im Winter vor der Abfahrt die Passbedingungen: Bei starkem Schneefall können Ketten oder Winterreifen nötig sein, und in seltenen Fällen kann der Pass vorübergehend gesperrt werden.',
            'Im Ort angekommen, folgen Sie den Schildern zur Via Saroch, im Bereich der Skilifte: Die Wohnung ist mit ihrer für die Region typischen Holzfassade leicht zu erkennen.'
          ]
        },
        {
          heading: 'Parken und Ankunft in der Wohnung',
          body: [
            'Zur Wohnung gehört ein kostenloser Parkplatz, sodass Sie im Ort nicht nach einem kostenpflichtigen Parkplatz suchen müssen. Check-in- und Check-out-Zeiten werden bei der Buchung per WhatsApp bestätigt, mit einer gewissen Flexibilität je nach Verfügbarkeit — praktisch, wenn Sie nach einer langen Reise oder mit nicht immer pünktlichen Zug-/Busverbindungen ankommen.',
            'Bei Fragen zum letzten Streckenabschnitt erreichen Sie uns am schnellsten über WhatsApp: Wir antworten mit präzisen Wegbeschreibungen und, falls nötig, mit Fotos des Eingangs, damit Sie das Gebäude sofort erkennen.'
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — 100 m von den Skiliften',
        'Kostenloser Parkplatz inklusive',
        'GPS-Koordinaten: 46.525061, 10.126967',
        'Flexibler Check-in, per WhatsApp bestätigt'
      ],
      ctaText: 'Schreiben Sie uns auf WhatsApp für Wegbeschreibungen',
      breadcrumbName: 'Anreise',
      navLabel: 'Anreise',
      relatedLinkLabel: 'Lesen Sie den vollständigen Guide: Zug, Auto oder Flugzeug ab Mailand'
    },
    fr: {
      title: 'Comment rejoindre Ironwood Livigno : adresse, parking et derniers kilomètres',
      metaTitle: 'Comment venir à Ironwood Livigno | Adresse, parking et dernier tronçon',
      metaDescription:
        'Adresse, parking gratuit et distance des remontées : le guide pratique pour rejoindre Ironwood Livigno, via Saroch 771, sans surprises.',
      eyebrow: "Comment venir",
      intro:
        "Si vous avez déjà décidé de séjourner chez Ironwood Livigno, cette page rassemble les informations pratiques sur le dernier tronçon du trajet : où se trouve exactement l'appartement, comment y accéder depuis le col de Foscagno ou depuis Tirano, et ce qu'il faut savoir sur le parking et l'arrivée. Pour le guide complet sur le train, la voiture ou l'avion depuis Milan, retrouvez tous les détails dans notre article dédié, en lien en bas de cette page.",
      sections: [
        {
          heading: 'Adresse et emplacement exact',
          body: [
            "Ironwood Livigno se trouve via Saroch 771, 23041 Livigno (SO), à environ 100 mètres à pied des remontées mécaniques et à 50 mètres de l'école de ski et de la location de matériel. C'est un emplacement pratique mais tranquille, à environ 15 minutes à pied du centre du village — pratique pour rejoindre à pied pistes, commerces et restaurants une fois sur place.",
            "Les coordonnées GPS exactes sont 46.525061, 10.126967 : utiles à saisir dans le GPS, surtout sur les derniers kilomètres en montagne où la couverture réseau peut être moins fiable."
          ]
        },
        {
          heading: 'Le dernier tronçon, depuis Tirano ou la frontière suisse',
          body: [
            "En train, descendez à la gare de Tirano puis poursuivez avec un bus de ligne (correspondance à Bormio) jusqu'à Livigno. En voiture depuis Milan, prenez la SS38 en direction de Bormio puis le col de Foscagno ; en venant de Suisse, passez plutôt par la Forcola di Livigno. En hiver, vérifiez l'état du col avant de partir : en cas de fortes chutes de neige, chaînes ou pneus hiver peuvent être nécessaires, et dans de rares cas le col peut fermer temporairement.",
            "Une fois dans le village, suivez les indications vers via Saroch, dans le secteur des remontées mécaniques : l'appartement est facile à repérer, avec sa façade en bois typique du style alpin de la région."
          ]
        },
        {
          heading: "Parking et arrivée à l'appartement",
          body: [
            "L'appartement inclut une place de parking gratuite, pas besoin de chercher un parking payant dans le village. Les horaires de check-in et check-out sont confirmés au moment de la réservation via WhatsApp, avec une certaine flexibilité selon les disponibilités — pratique en cas d'arrivée après un long trajet ou avec des horaires de train/bus pas toujours ponctuels.",
            "Pour toute question sur le dernier tronçon du trajet, le moyen le plus rapide de nous joindre est WhatsApp : nous répondons avec des indications précises et, si besoin, des photos de l'entrée pour repérer immédiatement le bâtiment."
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — à 100 m des remontées mécaniques',
        'Place de parking gratuite incluse',
        'Coordonnées GPS : 46.525061, 10.126967',
        'Check-in flexible, confirmé via WhatsApp'
      ],
      ctaText: "Écrivez-nous sur WhatsApp pour les indications d'arrivée",
      breadcrumbName: 'Comment venir',
      navLabel: 'Comment venir',
      relatedLinkLabel: 'Lisez le guide complet : train, voiture ou avion depuis Milan'
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
    },
    de: {
      title: 'Über uns: die Livigno-Familie hinter Ironwood Livigno',
      metaTitle: 'Über Uns | Ironwood Livigno — Eine Gastgeberfamilie in Livigno',
      metaDescription:
        'Ironwood Livigno wird direkt von Francesco und seiner Familie geführt, waschechten Livignesern: lesen Sie unsere Geschichte und Bewertungen, buchen Sie ohne Provision.',
      eyebrow: 'Über uns',
      intro:
        'Wer steckt hinter Ironwood Livigno? Keine Immobilienagentur und keine Ferienwohnungskette, sondern eine echte Familie, die das ganze Jahr über in Livigno lebt. Ich bin Francesco, hier geboren und aufgewachsen, und gemeinsam mit meiner Frau Tania und unseren beiden Töchtern, Nicole und Giulia, haben wir unser Familienhaus in eine Wohnung verwandelt, die für alle gedacht ist, die im Winter zum Skifahren oder im Sommer zum Wandern nach Livigno kommen. Wenn Sie bei uns buchen, schreiben Sie nicht an ein Callcenter: Sie schreiben direkt an die Menschen, die dieses Haus mit den eigenen Händen renoviert haben, Zimmer für Zimmer.',
      sections: [
        {
          heading: 'Eine Livigno-Familie, keine Agentur',
          body: [
            'Wir sind zu viert: ich, meine Frau Tania und unsere beiden Töchter, Nicole (18) und Giulia (13). Wir führen Ironwood Livigno nicht aus der Ferne oder über eine Hausverwaltung: Wir leben das ganze Jahr über hier, nicht nur in der Saison — deshalb kennen wir den Rhythmus der Pisten, die stärksten Reisezeiten und die praktischen Details, die Ihnen ein allgemeiner Reiseführer nicht geben kann.',
            'In Livigno geboren und aufgewachsen zu sein bedeutet auch, dass wir Ihnen echte Tipps geben können: wann Sie den Skipass online buchen sollten, um Warteschlangen zu vermeiden, welche Bergseite je nach Tageswetter die bessere Wahl ist, oder wo Sie abends essen können, ohne sich nur auf Online-Bewertungen zu verlassen.'
          ]
        },
        {
          heading: 'Ein Familienhaus, 2022 sorgfältig renoviert',
          body: [
            'Ironwood Livigno war nicht als gewöhnliche Investition gedacht. Es ist unser Zuhause, das wir vollständig renoviert haben — mit Eisen und Holz als Hauptmaterialien, die die Berge besser erzählen als eine Standard-Ferienwohnungseinrichtung. Die Arbeiten wurden 2022 abgeschlossen: private Infrarotsauna, Dampfbad, elektrischer Kamin, voll ausgestattete Küche und 3 Schlafzimmer auf insgesamt 90 m², konzipiert für Familien und Gruppen bis zu 6 Personen, mit 2 vollständigen Bädern.',
            'Das Ergebnis ist eine Ferienwohnung nur 100 Meter von den Skiliften und 50 Meter von Skischule und Ausrüstungsverleih entfernt, in der Via Saroch — die im Inneren jedoch die Wärme eines echten Familienhauses bewahrt, keine standardisierte Wohnung.'
          ]
        },
        {
          heading: 'Warum sich die direkte Buchung bei Ironwood Livigno lohnt',
          body: [
            'Wir führen Ironwood Livigno persönlich, ohne Vermittler: Das bedeutet, wenn Sie uns auf WhatsApp nach der Verfügbarkeit fragen, antworten wir selbst, kein Callcenter. Wir können flexible Check-in-Zeiten bestätigen, Ihnen genaue Hinweise zum letzten Streckenabschnitt geben und einen besonderen Wunsch spontan lösen — ein zusätzliches Kinderbett, eine Terminänderung — ohne über eine Drittplattform zu gehen.',
            'Direkt zu buchen bedeutet außerdem, die Vermittlungsprovision zu vermeiden, die normalerweise den Endpreis bei Airbnb oder Booking belastet: Der Preis, den wir per WhatsApp oder E-Mail vereinbaren, ist der, den Sie zahlen — ohne Überraschungen beim Checkout.'
          ]
        },
        {
          heading: 'Was Gäste sagen, die bei uns waren',
          body: ['Die untenstehenden Bewertungen sind echt, veröffentlicht auf Google und Airbnb — dieselben, die Sie auch im Bewertungsbereich der Startseite finden.']
        }
      ],
      highlights: [
        'Direkte Verwaltung, ohne Agenturen oder Vermittler',
        'Waschechte Livigneser: echte Tipps zu Pisten und Saison',
        'Familienhaus, 2022 renoviert, Eisen und Holz',
        'Direkte Antworten auf WhatsApp, kein Callcenter'
      ],
      faq: [
        {
          q: 'Wird Ironwood Livigno von einer Agentur geführt?',
          a: 'Nein. Ironwood Livigno wird direkt von Francesco und seiner Familie geführt, Eigentümer, die das ganze Jahr über in Livigno leben — keine Immobilienagentur und keine Ferienwohnungskette.'
        },
        {
          q: 'Lohnt sich die direkte Buchung statt über Airbnb oder Booking?',
          a: 'Ja: Eine direkte Buchung per WhatsApp, Telefon oder E-Mail vermeidet die Vermittlungsprovision der Plattformen und gibt Ihnen einen direkten Kontakt zu den Menschen, die die Wohnung tatsächlich führen, für jedes Anliegen vor, während und nach dem Aufenthalt.'
        },
        {
          q: 'Wer hat das Haus renoviert?',
          a: 'Es ist das Familienhaus von Francesco und Tania, vollständig renoviert und 2022 fertiggestellt, mit einem Konzept, das hauptsächlich auf Eisen und Holz basiert.'
        },
        {
          q: 'Wie lange leben Sie schon in Livigno?',
          a: 'Francesco ist in Livigno geboren und aufgewachsen und lebt das ganze Jahr über hier, nicht nur während der Tourismussaison — dasselbe gilt für die ganze Familie.'
        },
        {
          q: 'Wie kann ich Sie direkt kontaktieren?',
          a: 'Am schnellsten erreichen Sie uns über WhatsApp unter +39 0342 929285, per E-Mail an info@ironwoodlivigno.com oder über das Verfügbarkeitsformular auf der Website.'
        }
      ],
      internalLinkLabels: [
        'Entdecken Sie unsere 3 Schlafzimmer, konzipiert für Familien und Gruppen',
        'Lesen Sie den Guide zur Anreise nach Ironwood Livigno',
        'Entdecken Sie den Winter in Livigno bei Ironwood',
        'Sehen Sie alle unsere verifizierten Bewertungen',
        'Lesen Sie unsere Guides zu Livigno'
      ],
      ctaText: 'Schreiben Sie uns direkt auf WhatsApp',
      breadcrumbName: 'Über uns',
      navLabel: 'Über uns',
      relatedLinkLabel: 'Zur Kontaktseite, um uns zu schreiben oder anzurufen'
    },
    fr: {
      title: 'Qui sommes-nous : la famille de Livigno derrière Ironwood Livigno',
      metaTitle: 'Qui Sommes-Nous | Ironwood Livigno — Une Famille d\'Hôtes à Livigno',
      metaDescription:
        'Ironwood Livigno est géré directement par Francesco et sa famille, natifs de Livigno depuis toujours : découvrez notre histoire et nos avis, réservez sans commission.',
      eyebrow: 'Qui sommes-nous',
      intro:
        "Qui se cache derrière Ironwood Livigno ? Ni une agence immobilière ni une chaîne de locations de vacances, mais une vraie famille qui vit à Livigno toute l'année. Je m'appelle Francesco, né et grandi ici, et avec mon épouse Tania et nos deux filles, Nicole et Giulia, nous avons transformé notre maison de famille en un appartement pensé pour ceux qui viennent à Livigno skier en hiver ou randonner en montagne en été. Quand vous réservez chez nous, vous n'écrivez pas à un centre d'appels : vous écrivez directement à ceux qui ont rénové cette maison de leurs propres mains, pièce par pièce.",
      sections: [
        {
          heading: 'Une famille de Livigno, pas une agence',
          body: [
            "Nous sommes quatre : moi, mon épouse Tania, et nos deux filles, Nicole (18 ans) et Giulia (13 ans). Nous ne gérons pas Ironwood Livigno à distance ni via un gestionnaire immobilier : nous vivons ici toute l'année, pas seulement en saison, c'est pourquoi nous connaissons bien le rythme des pistes, les périodes les plus chargées et les détails pratiques qu'un guide touristique générique ne peut pas vous donner.",
            "Être né et avoir grandi à Livigno signifie aussi pouvoir vous donner de vrais conseils : quand réserver son forfait de ski en ligne pour éviter les files d'attente, quel versant choisir selon la météo du jour, ou où dîner le soir sans se fier uniquement aux avis en ligne."
          ]
        },
        {
          heading: 'Une maison de famille, rénovée avec soin en 2022',
          body: [
            "Ironwood Livigno n'est pas né comme un simple investissement. C'est notre maison, que nous avons entièrement rénovée en choisissant de travailler principalement le fer et le bois — des matériaux qui racontent la montagne mieux qu'un mobilier standard de location de vacances. Les travaux se sont achevés en 2022 : sauna infrarouge privé, hammam, cheminée électrique, cuisine entièrement équipée et 3 chambres pour un total de 90 m², pensés pour accueillir confortablement familles et groupes jusqu'à 6 personnes, avec 2 salles de bains complètes.",
            "Le résultat est une location de vacances à seulement 100 mètres des remontées mécaniques et à 50 mètres de l'école de ski et de la location de matériel, via Saroch — mais qui conserve à l'intérieur la chaleur d'une vraie maison de famille, pas d'un appartement standardisé."
          ]
        },
        {
          heading: 'Pourquoi réserver directement chez Ironwood Livigno est avantageux',
          body: [
            "Nous gérons Ironwood Livigno nous-mêmes, sans intermédiaires : cela signifie que lorsque vous nous écrivez sur WhatsApp pour demander les disponibilités, c'est nous qui répondons, pas un centre d'appels. Nous pouvons confirmer des horaires de check-in flexibles, vous donner des indications précises sur le dernier tronçon du trajet, et arranger sur-le-champ une demande particulière — un lit bébé supplémentaire, un changement de date — sans passer par une plateforme tierce.",
            "Réserver directement permet aussi d'éviter les commissions d'intermédiation qui pèsent habituellement sur le prix final sur Airbnb ou Booking : le prix convenu par WhatsApp ou e-mail est celui que vous payez, sans surprise au moment du paiement."
          ]
        },
        {
          heading: 'Ce que disent les clients qui ont séjourné chez nous',
          body: ["Les avis ci-dessous sont réels, publiés sur Google et Airbnb — les mêmes que vous trouverez dans la section avis de la page d'accueil."]
        }
      ],
      highlights: [
        'Gestion directe, sans agences ni intermédiaires',
        'Natifs de Livigno : de vrais conseils sur les pistes et la saison',
        'Maison de famille rénovée en 2022, fer et bois',
        "Réponses directes sur WhatsApp, pas un centre d'appels"
      ],
      faq: [
        {
          q: 'Ironwood Livigno est-il géré par une agence ?',
          a: "Non. Ironwood Livigno est géré directement par Francesco et sa famille, propriétaires résidant à Livigno toute l'année — ni une agence immobilière ni une chaîne de locations de vacances."
        },
        {
          q: 'Est-il avantageux de réserver directement plutôt que sur Airbnb ou Booking ?',
          a: "Oui : réserver directement via WhatsApp, téléphone ou e-mail permet d'éviter les commissions des plateformes, et vous donne un contact direct avec ceux qui gèrent réellement l'appartement pour toute demande avant, pendant et après le séjour."
        },
        {
          q: 'Qui a rénové la maison ?',
          a: "C'est la maison de famille de Francesco et Tania, entièrement rénovée et achevée en 2022, avec un projet basé principalement sur le fer et le bois."
        },
        {
          q: 'Depuis combien de temps vivez-vous à Livigno ?',
          a: "Francesco est né et a grandi à Livigno et y vit toute l'année, pas seulement pendant la saison touristique — il en va de même pour toute la famille."
        },
        {
          q: 'Comment puis-je vous contacter directement ?',
          a: 'Le moyen le plus rapide est WhatsApp au +39 0342 929285, ou par e-mail à info@ironwoodlivigno.com, ou via le formulaire de demande de disponibilité sur le site.'
        }
      ],
      internalLinkLabels: [
        'Découvrez nos 3 chambres, pensées pour les familles et les groupes',
        'Lisez le guide pour rejoindre Ironwood Livigno',
        "Découvrez l'hiver à Livigno chez Ironwood",
        'Consultez tous nos avis vérifiés',
        'Lisez nos guides sur Livigno'
      ],
      ctaText: 'Écrivez-nous directement sur WhatsApp',
      breadcrumbName: 'Qui sommes-nous',
      navLabel: 'Qui sommes-nous',
      relatedLinkLabel: 'Accédez à la page contact pour nous écrire ou nous appeler'
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
    },
    de: {
      title: 'Ferienwohnung mit privater Sauna in Livigno: exklusive Infrarotsauna und Dampfbad',
      metaTitle: 'Private Sauna Livigno | Ferienwohnung mit privatem Dampfbad',
      metaDescription:
        'In Livigno, eine Ferienwohnung mit privater Infrarotsauna und Dampfbad, nie geteilt: keine Buchung nötig, jeden Tag zu jeder Zeit verfügbar.',
      eyebrow: 'Private Sauna',
      intro:
        'Suchen Sie eine Ferienwohnung mit privater Sauna in Livigno? Bei Ironwood Livigno sind Infrarotsauna und Dampfbad kein kostenpflichtiger Service in einem Gemeinschafts-Spa, sondern Teil der Wohnung selbst: exklusiv für die aktuellen Gäste, ohne feste Zeiten und ohne Teilen mit anderen Gästen. Diese Seite fasst alle praktischen Details zusammen, für alle, die genau wissen möchten, was inklusive ist.',
      sections: [
        {
          heading: 'Private Infrarotsauna, nie geteilt',
          body: [
            'Die Infrarotsauna ist auf Muskelerholung ausgelegt: Die Wärme dringt tief in das Gewebe ein — eine echte Hilfe nach einem Tag Skifahren, Wandern oder Mountainbiken. Sie befindet sich innerhalb der Wohnung, nicht in einem Gemeinschaftsbereich des Gebäudes — das bedeutet, kein anderer Gast wird sie je vor oder nach Ihnen nutzen.'
          ]
        },
        {
          heading: 'Privates Dampfbad inklusive',
          body: [
            'Neben der Sauna verfügt die Wohnung auch über ein privates Dampfbad: heißer Dampf zur exklusiven Nutzung, abwechselnd mit der Infrarotsauna je nach Vorliebe, ohne zwischen beiden wählen oder den Zugang zu einem Gemeinschaftsbereich buchen zu müssen.'
          ]
        },
        {
          heading: 'Keine Buchung nötig, jederzeit verfügbar',
          body: [
            'Anders als im Hotel-Spa, wo oft ein Zeitfenster gebucht werden muss, sind hier Sauna und Dampfbad zu jeder Tageszeit verfügbar: direkt nach der Rückkehr von der Piste, nach einer Sommerwanderung oder einfach abends vor dem Essen.'
          ]
        },
        {
          heading: 'Warum es besser ist als ein Gemeinschafts-Spa',
          body: [
            'Wir haben einen eigenen Guide zum Vergleich zwischen privater und gemeinsamer Sauna geschrieben, mit den praktischen Vorteilen in Sachen Hygiene, Zeitplanung und Komfort — nützlich, wenn Sie noch überlegen, ob eine Ferienwohnung mit privater Sauna die richtige Wahl für Ihren Aufenthalt in Livigno ist.'
          ]
        }
      ],
      highlights: [
        'Private Infrarotsauna, nie mit anderen Gästen geteilt',
        'Privates Dampfbad in der Wohnung inklusive',
        'Jederzeit verfügbar, keine Buchung nötig',
        'Teil einer 90 m² Wohnung, 3 Schlafzimmer, bis zu 6 Gäste'
      ],
      faq: [
        {
          q: 'Ist die Sauna wirklich privat oder wird sie mit anderen Wohnungen geteilt?',
          a: 'Sie ist vollständig privat: Sie befindet sich innerhalb der Wohnung und steht ausschließlich den dort untergebrachten Gästen zur Verfügung, nie geteilt mit anderen Gästen oder Einheiten.'
        },
        {
          q: 'Muss ich einen Termin für Sauna oder Dampfbad buchen?',
          a: 'Nein. Da es sich nicht um einen Gemeinschaftsbereich handelt, gibt es keinen Termin zu buchen: Sie sind während des gesamten Aufenthalts jederzeit verfügbar.'
        },
        {
          q: 'Sind Sauna und Dampfbad im Preis des Aufenthalts inbegriffen?',
          a: 'Ja, sie gehören zur Wohnung und verursachen keine zusätzlichen Kosten zum gebuchten Aufenthalt.'
        },
        {
          q: 'Sind sie auch im Sommer nützlich, nicht nur nach dem Skifahren?',
          a: 'Ja: Viele Gäste nutzen sie auch im Sommer zur Muskelerholung nach einem Tag Wandern oder Mountainbiken, nicht nur im Winter nach dem Skifahren.'
        }
      ],
      internalLinkLabels: [
        'Entdecken Sie den gesamten Wellness-Bereich von Ironwood Livigno',
        'Lesen Sie den Vergleich: private vs. gemeinsame Sauna',
        'Entdecken Sie, warum wir uns für eine private Sauna entschieden haben'
      ],
      ctaText: 'Verfügbarkeit prüfen und Ihre private Sauna buchen',
      breadcrumbName: 'Private Sauna',
      navLabel: 'Private Sauna',
      relatedLinkLabel: 'Entdecken Sie auch Kamin, Frühstück und weitere Wellness-Details'
    },
    fr: {
      title: 'Appartement avec sauna privé à Livigno : sauna infrarouge et hammam exclusifs',
      metaTitle: 'Sauna Privé Livigno | Appartement avec Hammam Privé',
      metaDescription:
        'À Livigno, un appartement avec sauna infrarouge et hammam privés, jamais partagés : aucune réservation, disponibles chaque jour à toute heure.',
      eyebrow: 'Sauna privé',
      intro:
        "Vous cherchez un appartement avec sauna privé à Livigno ? Chez Ironwood Livigno, le sauna infrarouge et le hammam ne sont pas un service payant dans un spa commun, mais font partie intégrante de l'appartement : exclusifs à ceux qui y séjournent, sans horaires à respecter ni partage avec d'autres clients. Cette page rassemble tous les détails pratiques, pour ceux qui veulent savoir exactement ce qui est inclus.",
      sections: [
        {
          heading: 'Sauna infrarouge privé, jamais partagé',
          body: [
            "Le sauna infrarouge est conçu pour la récupération musculaire : la chaleur pénètre en profondeur dans les tissus, une aide concrète après une journée de ski, de randonnée ou de VTT. Il se trouve à l'intérieur de l'appartement, pas dans un espace commun du bâtiment — ce qui signifie qu'aucun autre client ne l'utilisera jamais avant ou après vous."
          ]
        },
        {
          heading: 'Hammam privé inclus',
          body: [
            "En plus du sauna, l'appartement dispose aussi d'un hammam privé : vapeur chaude à usage exclusif, à alterner avec le sauna infrarouge selon les préférences, sans avoir à choisir entre les deux ni à réserver l'accès à un espace commun."
          ]
        },
        {
          heading: 'Aucune réservation nécessaire, disponible à toute heure',
          body: [
            "Contrairement à un spa d'hôtel, où il faut souvent réserver un créneau, ici le sauna et le hammam sont disponibles à toute heure de la journée : juste après être rentré des pistes, après une randonnée estivale, ou simplement le soir avant le dîner."
          ]
        },
        {
          heading: "Pourquoi c'est mieux qu'un spa partagé",
          body: [
            "Nous avons rédigé un guide dédié comparant sauna privé et sauna partagé, avec les avantages pratiques en matière d'hygiène, d'horaires et de confort — utile si vous hésitez encore à savoir si un appartement avec sauna privé est le bon choix pour votre séjour à Livigno."
          ]
        }
      ],
      highlights: [
        "Sauna infrarouge privé, jamais partagé avec d'autres clients",
        "Hammam privé inclus dans l'appartement",
        'Disponibles à toute heure, aucune réservation nécessaire',
        'Fait partie d\'un appartement de 90 m², 3 chambres, jusqu\'à 6 personnes'
      ],
      faq: [
        {
          q: 'Le sauna est-il vraiment privé ou partagé avec d\'autres appartements ?',
          a: "Il est entièrement privé : il se trouve à l'intérieur de l'appartement et est réservé exclusivement aux clients qui y séjournent, jamais partagé avec d'autres clients ou d'autres unités."
        },
        {
          q: 'Faut-il réserver un créneau pour utiliser le sauna ou le hammam ?',
          a: "Non. N'étant pas un espace commun, il n'y a aucun créneau à réserver : ils sont disponibles à toute heure pendant tout le séjour."
        },
        {
          q: 'Le sauna et le hammam sont-ils inclus dans le prix du séjour ?',
          a: "Oui, ils font partie de l'appartement et n'entraînent aucun coût supplémentaire par rapport au séjour réservé."
        },
        {
          q: 'Sont-ils utiles en été aussi, pas seulement après le ski ?',
          a: "Oui : de nombreux clients les utilisent aussi en été pour la récupération musculaire après une journée de randonnée ou de VTT, pas seulement en hiver après le ski."
        }
      ],
      internalLinkLabels: [
        "Découvrez tout l'espace bien-être d'Ironwood Livigno",
        'Lisez la comparaison : sauna privé vs sauna partagé',
        'Découvrez pourquoi nous avons choisi un sauna privé pour notre maison'
      ],
      ctaText: 'Vérifiez les disponibilités et réservez votre sauna privé',
      breadcrumbName: 'Sauna privé',
      navLabel: 'Sauna privé',
      relatedLinkLabel: 'Découvrez aussi cheminée, petit-déjeuner et autres détails bien-être'
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
    },
    de: {
      title: 'Die 3 Schlafzimmer der Wohnung in Livigno: Aufteilung, Betten und Details',
      metaTitle: '3-Zimmer-Wohnung in Livigno | Raumaufteilung',
      metaDescription:
        '3 Schlafzimmer, 2 Bäder, 90 m²: entdecken Sie die detaillierte Aufteilung der Wohnung in Livigno, Zimmer für Zimmer, konzipiert für Familien und Gruppen bis 6 Personen.',
      eyebrow: 'Die Schlafzimmer',
      intro:
        'Suchen Sie eine 3-Zimmer-Wohnung in Livigno und möchten vor der Buchung genau wissen, wie die Räume aufgeteilt sind? Ironwood Livigno erstreckt sich über 90 m² mit 3 Schlafzimmern und 2 vollständigen Bädern, für bis zu 6 Gäste, nur 100 Meter zu Fuß von den Skiliften entfernt. Hier finden Sie die Details Zimmer für Zimmer, damit Sie genau wissen, was Sie erwartet.',
      sections: [
        {
          heading: 'Zimmer 1 — Doppelzimmer (verbundene Betten)',
          body: [
            'Zwei Einzelbetten, durch einen Topper verbunden, für den durchgehenden Komfort eines echten Doppelbetts — ideal für Paare oder für die Eltern der Gruppe, die dennoch die Flexibilität zweier Einzelbetten schätzen.'
          ]
        },
        {
          heading: 'Zimmer 2 — Zweibettzimmer',
          body: [
            'Zwei Einzelbetten, auf Anfrage zu einem Doppelbett kombinierbar — praktisch für Kinder, ältere Kids oder gemeinsam reisende Freunde, die kein festes Doppelbett teilen möchten.'
          ]
        },
        {
          heading: 'Zimmer 3 — Hauptschlafzimmer mit Doppelbett',
          body: [
            'Doppelbett mit Topper für maximalen Komfort: Dies ist das Hauptschlafzimmer der Wohnung, konzipiert für alle, die mehr Privatsphäre als in den anderen beiden Zimmern suchen.'
          ]
        },
        {
          heading: '2 vollständige Bäder, gemeinsam genutzt',
          body: [
            'Der gesamten Wohnung stehen 2 vollständige Bäder zur Verfügung — eine Aufteilung, die speziell entwickelt wurde, um morgendliche Warteschlangen zu vermeiden, wenn die Wohnung eine vollständige Familie oder Gruppe beherbergt — ein Detail, das einen echten Unterschied zu einer typischen Zwei-Zimmer-Wohnung mit nur einem Bad macht.'
          ]
        }
      ],
      highlights: [
        '3 Schlafzimmer, 90 m² insgesamt',
        '2 vollständige, gemeinsam genutzte Bäder',
        'Bis zu 6 Schlafplätze für Familien und Gruppen',
        'Flexible Aufteilung: Einzel- oder Doppelbetten',
        '100 m von den Skiliften entfernt'
      ],
      faq: [
        {
          q: 'Wie viele Personen können bequem in der Wohnung schlafen?',
          a: 'Bis zu 6 Personen, verteilt auf die 3 Schlafzimmer: eines mit im Doppelbett-Stil verbundenen Einzelbetten, eines mit trennbaren Einzelbetten und das Hauptschlafzimmer mit Doppelbett.'
        },
        {
          q: 'Können die Einzelbetten zu einem Doppelbett verbunden werden?',
          a: 'Ja, in Zimmer 2 können die beiden Einzelbetten auf Anfrage verbunden werden. In Zimmer 1 sind sie bereits mit einem Topper verbunden, für den durchgehenden Komfort eines Doppelbetts.'
        },
        {
          q: 'Gibt es mehr als ein Badezimmer?',
          a: 'Ja, die Wohnung hat 2 vollständige Bäder, gemeinsam genutzt von den 3 Schlafzimmern — praktisch für Familien und Gruppen, die alle Räume gleichzeitig nutzen.'
        }
      ],
      internalLinkLabels: [
        'Entdecken Sie, warum die Wohnung für Familien und Gruppen konzipiert ist',
        'Entdecken Sie, wer die Wohnung renoviert hat und warum',
        'Adresse, Parkplatz und Anreise ansehen'
      ],
      ctaText: 'Verfügbarkeit für Ihre Schlafzimmer prüfen',
      breadcrumbName: 'Die Schlafzimmer',
      navLabel: 'Die Schlafzimmer',
      relatedLinkLabel: 'Entdecken Sie alle Details für Familien und Gruppen'
    },
    fr: {
      title: "Les 3 chambres de l'appartement à Livigno : disposition, lits et détails",
      metaTitle: 'Appartement 3 Chambres à Livigno | Disposition des Pièces',
      metaDescription:
        "3 chambres, 2 salles de bains, 90 m² : découvrez la disposition détaillée de l'appartement à Livigno, pièce par pièce, pensé pour les familles et groupes jusqu'à 6 personnes.",
      eyebrow: 'Les chambres',
      intro:
        "Vous cherchez un appartement 3 chambres à Livigno et voulez savoir exactement comment les espaces sont organisés avant de réserver ? Ironwood Livigno s'étend sur 90 m² avec 3 chambres et 2 salles de bains complètes, pour un maximum de 6 personnes, à seulement 100 mètres à pied des remontées mécaniques. Voici le détail pièce par pièce, pour savoir exactement à quoi vous attendre.",
      sections: [
        {
          heading: 'Chambre 1 — Chambre Double (lits jumelés)',
          body: [
            "Deux lits simples réunis par un surmatelas, pour le confort continu d'un vrai lit double — idéal pour un couple, ou pour les parents du groupe qui préfèrent tout de même la flexibilité de deux lits simples."
          ]
        },
        {
          heading: 'Chambre 2 — Chambre Lits Jumeaux',
          body: [
            "Deux lits simples, pouvant être réunis sur demande pour former un lit double — pratique pour les enfants, les plus grands, ou des amis voyageant ensemble qui préfèrent ne pas partager un lit double fixe."
          ]
        },
        {
          heading: 'Chambre 3 — Chambre Double Principale',
          body: [
            "Lit double avec surmatelas pour un confort maximal : c'est la chambre principale de l'appartement, pensée pour ceux qui recherchent plus d'intimité que dans les deux autres chambres."
          ]
        },
        {
          heading: '2 salles de bains complètes, partagées entre les chambres',
          body: [
            "L'ensemble de l'appartement dispose de 2 salles de bains complètes, une configuration pensée spécialement pour éviter les files d'attente le matin lorsque l'appartement accueille une famille ou un groupe au complet — un détail qui fait une vraie différence par rapport à un appartement classique deux-pièces avec une seule salle de bains."
          ]
        }
      ],
      highlights: [
        '3 chambres, 90 m² au total',
        '2 salles de bains complètes partagées entre les chambres',
        "Jusqu'à 6 couchages pour familles et groupes",
        'Disposition flexible : lits simples ou double',
        '100 m des remontées mécaniques'
      ],
      faq: [
        {
          q: 'Combien de personnes peuvent dormir confortablement dans l\'appartement ?',
          a: "Jusqu'à 6 personnes, réparties dans les 3 chambres : une avec des lits simples réunis façon lit double, une avec des lits simples séparables, et la chambre double principale."
        },
        {
          q: 'Les lits simples peuvent-ils être réunis pour former un lit double ?',
          a: "Oui, dans la Chambre 2 les deux lits simples peuvent être réunis sur demande. Dans la Chambre 1, ils sont déjà réunis avec un surmatelas, pour le confort continu d'un lit double."
        },
        {
          q: "Y a-t-il plus d'une salle de bains ?",
          a: "Oui, l'appartement dispose de 2 salles de bains complètes, partagées entre les 3 chambres — pratique pour les familles et groupes qui occupent tous les espaces en même temps."
        }
      ],
      internalLinkLabels: [
        "Découvrez pourquoi l'appartement est pensé pour les familles et les groupes",
        "Découvrez qui a rénové l'appartement, et pourquoi",
        "Voir l'adresse, le parking et comment venir"
      ],
      ctaText: 'Vérifiez les disponibilités pour vos chambres',
      breadcrumbName: 'Les chambres',
      navLabel: 'Les chambres',
      relatedLinkLabel: 'Découvrez tous les détails pensés pour les familles et les groupes'
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
    },
    de: {
      title: 'Was man im Sommer in Livigno unternehmen kann: 10 unverzichtbare Erlebnisse',
      metaTitle: 'Livigno im Sommer | 10 Dinge zu tun: Biken, Wandern und der See',
      metaDescription:
        'Mountainbike, Wandern, der Lago di Livigno und private Sauna nach dem Sport: 10 unverzichtbare Erlebnisse, um Ihren Sommer in Livigno perfekt zu planen.',
      eyebrow: 'Livigno im Sommer',
      intro:
        'Was kann man im Sommer in Livigno konkret unternehmen? Von Juni bis September verwandelt sich das Alpenbecken in eine der Mountainbike-Hauptstädte Europas, mit Trails für jedes Niveau, einem See zum Erkunden per Kanu oder zu Fuß und einem autofreien Duty-free-Zentrum, das einen Spaziergang wert ist. Hier sind 10 unverzichtbare Erlebnisse, um Ihren Sommer in Livigno kurz zusammengefasst zu planen.',
      sections: [
        {
          heading: '1–2. Mountainbike: Mottolino Bike Park und Bike Academy',
          body: [
            'Der Mottolino Bike Park ist die erste Adresse für Adrenalin, mit 14 Strecken zwischen Downhill, Jump-Bereich und North-Shore-Abschnitten. Für Familien oder Einsteiger bietet die Bike Academy eine rund 5 km lange, speziell für Anfänger konzipierte Strecke.'
          ]
        },
        {
          heading: '3–4. Wandern: der Lago di Livigno und die blühenden Almen',
          body: [
            'Die Runde um den Lago di Livigno ist der einfachste und für alle zugängliche Spaziergang, mit vielen Möglichkeiten für ein Picknick. Für eine anspruchsvollere Wanderung bieten die Wege durch die blühenden Almen — die Arnika ist die Symbolblume der Region — Ausblicke auf die Rätischen Alpen.'
          ]
        },
        {
          heading: '5–6. Carosello 3000 im Sommer und eine Kanutour',
          body: [
            'Auch die Lifte des Wintersportgebiets öffnen im Sommer (etwa vom 20. Juni bis 13. September) und verbinden Panoramawege in der Höhe. An wärmeren Tagen eignet sich der See auch für eine Kanutour.'
          ]
        },
        {
          heading: '7–8. Duty-free-Shopping und Spezialitäten aus dem Veltlin',
          body: [
            'Das autofreie Zentrum von Livigno, eine Duty-free-Zollzone, bleibt ein fast obligatorischer Stopp zum Einkaufen. Probieren Sie auch die Spezialitäten aus dem Veltlin — Pizzoccheri, Sciatt und Bresaola IGP — in den Restaurants des Orts oder in Ruhe in der Wohnung zubereitet.'
          ]
        },
        {
          heading: '9–10. Private Sauna nach dem Sport und kühle Temperaturen auch im August',
          body: [
            'Nach einem Tag Wandern oder Mountainbiken helfen die private Infrarotsauna und das Dampfbad, die Muskeln vor dem Abendessen zu lockern. Und die Sommertemperaturen in Livigno bleiben auch mitten im Sommer angenehm kühl — ein weiterer Grund für alle, die der Stadthitze entkommen möchten.'
          ]
        }
      ],
      highlights: [
        'Über 50 km Trails für Mountainbike und Wandern',
        'Lago di Livigno: Spaziergang, Picknick oder Kanu',
        'Autofreies Duty-free-Zentrum, 15 Gehminuten entfernt',
        'Private Sauna auch nach dem Sommersport verfügbar'
      ],
      faq: [
        {
          q: 'Lohnt sich Livigno auch, wenn man nicht mountainbiket?',
          a: 'Ja: Der Spaziergang um den See, die blühenden Almen, Duty-free-Shopping und die Spezialitäten aus dem Veltlin sind für alle zugängliche Erlebnisse — man muss kein erfahrener Biker oder Wanderer sein.'
        },
        {
          q: 'Wann sind die Sommerlifte von Carosello 3000 geöffnet?',
          a: 'Etwa vom 20. Juni bis 13. September, um Panoramawege in der Höhe zu verbinden — die genauen Daten können von Jahr zu Jahr variieren.'
        },
        {
          q: 'Ist es im Sommer heiß in Livigno?',
          a: 'Die Temperaturen bleiben in der Regel auch im August angenehm kühl — einer der Gründe, warum Livigno bei allen beliebt ist, die der Stadthitze entkommen möchten.'
        }
      ],
      internalLinkLabels: [
        'Lesen Sie den vollständigen Guide zum Sommer in Livigno bei Ironwood',
        'Lesen Sie den vollständigen Artikel mit allen Details',
        'Entdecken Sie auch für Kinder geeignete Aktivitäten'
      ],
      ctaText: 'Verfügbarkeit für Ihren Sommer in Livigno prüfen',
      breadcrumbName: 'Livigno im Sommer',
      navLabel: 'Sommer-Highlights',
      relatedLinkLabel: 'Lesen Sie auch den Guide zu Mountainbike, Wandern und dem See'
    },
    fr: {
      title: "Que faire à Livigno en été : 10 expériences à ne pas manquer",
      metaTitle: "Livigno en Été | 10 Choses à Faire : VTT, Randonnée et le Lac",
      metaDescription:
        "VTT, randonnée, le lac de Livigno et sauna privé après le sport : 10 expériences à ne pas manquer pour organiser votre été à Livigno.",
      eyebrow: 'Livigno en été',
      intro:
        "Que faire concrètement à Livigno en été ? De juin à septembre, le bassin alpin devient l'une des capitales du VTT en Europe, avec des sentiers pour tous niveaux, un lac à explorer en canoë ou à pied, et un centre piéton hors taxes à parcourir. Voici 10 expériences à ne pas manquer pour organiser votre été à Livigno, en résumé.",
      sections: [
        {
          heading: '1–2. VTT : Mottolino Bike Park et Bike Academy',
          body: [
            "Le Mottolino Bike Park est la référence pour les sensations fortes, avec 14 pistes entre descente, zone de saut et sections north shore. Pour les familles ou les débutants, la Bike Academy propose un parcours d'environ 5 km pensé spécialement pour les novices."
          ]
        },
        {
          heading: '3–4. Randonnée : le lac de Livigno et les alpages fleuris',
          body: [
            "Le tour du lac de Livigno est la promenade la plus simple et accessible à tous, avec de nombreux endroits pour pique-niquer. Pour une randonnée plus exigeante, les sentiers à travers les alpages fleuris — l'arnica est la fleur emblématique de la région — offrent des vues sur les Alpes rhétiques."
          ]
        },
        {
          heading: '5–6. Carosello 3000 en été et une sortie en canoë',
          body: [
            "Les remontées du domaine skiable hivernal ouvrent aussi en été (environ du 20 juin au 13 septembre), reliant des sentiers panoramiques en altitude. Les jours les plus chauds, le lac se prête aussi à une sortie en canoë."
          ]
        },
        {
          heading: '7–8. Shopping hors taxes et spécialités de la Valteline',
          body: [
            "Le centre piéton de Livigno, zone franche douanière, reste une étape presque incontournable pour le shopping. À goûter aussi : les spécialités de la Valteline — pizzoccheri, sciatt et bresaola IGP — dans les restaurants du village ou préparées tranquillement dans l'appartement."
          ]
        },
        {
          heading: '9–10. Sauna privé après le sport et températures fraîches même en août',
          body: [
            "Après une journée de randonnée ou de VTT, le sauna infrarouge et le hammam privés aident à détendre les muscles avant le dîner. Et les températures estivales à Livigno restent fraîches même au cœur de l'été — une raison de plus pour ceux qui cherchent à échapper à la chaleur des villes."
          ]
        }
      ],
      highlights: [
        'Plus de 50 km de sentiers pour le VTT et la randonnée',
        'Lac de Livigno : promenade, pique-nique ou canoë',
        'Centre piéton hors taxes, à 15 minutes à pied',
        'Sauna privé disponible aussi après le sport estival'
      ],
      faq: [
        {
          q: 'Livigno vaut-elle le détour même sans faire de VTT ?',
          a: "Oui : la promenade autour du lac, les alpages fleuris, le shopping hors taxes et les spécialités de la Valteline sont des expériences accessibles à tous — pas besoin d'être un vététiste ou un randonneur expérimenté."
        },
        {
          q: 'Quand les remontées estivales de Carosello 3000 sont-elles ouvertes ?',
          a: 'Environ du 20 juin au 13 septembre, pour relier des sentiers panoramiques en altitude — les dates exactes peuvent varier d\'une année à l\'autre.'
        },
        {
          q: 'Fait-il chaud à Livigno en été ?',
          a: "Les températures restent généralement fraîches même en août, l'une des raisons pour lesquelles Livigno est appréciée par ceux qui cherchent à échapper à la chaleur des villes."
        }
      ],
      internalLinkLabels: [
        "Lisez le guide complet de l'été à Livigno chez Ironwood",
        "Lisez l'article complet avec tous les détails",
        'Découvrez aussi des activités adaptées aux enfants'
      ],
      ctaText: 'Vérifiez les disponibilités pour votre été à Livigno',
      breadcrumbName: 'Livigno en été',
      navLabel: 'Best of été',
      relatedLinkLabel: 'Lisez aussi le guide sur le VTT, la randonnée et le lac'
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
