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
      metaTitle: 'Winter Holiday in Livigno | Sauna 100 m from the Lifts',
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
      relatedLinkLabel: 'Read the full guide to the Carosello 3000 ski area',
      faq: [
        { q: 'How long is the ski season in Livigno?', a: 'Typically from late November to early May — one of the longest ski seasons in the Italian Alps.' },
        { q: 'How far is the apartment from the ski lifts?', a: 'About a 100-metre walk from the lifts; the ski school and equipment rental are 50 metres away.' },
        { q: 'Is there somewhere to store skis, boots and gear?', a: 'Yes, a dedicated storage space for skis, boots and gear, plus a free parking space for anyone arriving by car.' }
      ]
    },
    'en-us': {
      title: 'Winter in Livigno, Italy: skiing, a private sauna, and comfort steps from the slopes',
      metaTitle: 'Winter Vacation in Livigno, Italy | Sauna 100 m from Lifts',
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
      relatedLinkLabel: 'Read the full guide to the Carosello 3000 ski area',
      faq: [
        { q: 'How long is the ski season in Livigno, Italy?', a: 'Typically from late November to early May — one of the longest ski seasons in the Italian Alps.' },
        { q: 'How far is the apartment from the ski lifts?', a: 'About a 100-meter walk from the lifts; the ski school and equipment rental are 50 meters away.' },
        { q: 'Is there somewhere to store skis, boots, and gear?', a: 'Yes, a dedicated storage space for skis, boots, and gear, plus a free parking spot for anyone arriving by car.' }
      ]
    },
    de: {
      title: 'Winterurlaub in Livigno: Skifahren, private Sauna und Komfort direkt an der Piste',
      metaTitle: 'Winterurlaub in Livigno | Sauna, 100 m von den Liften',
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
      relatedLinkLabel: 'Lesen Sie den vollständigen Guide zum Skigebiet Carosello 3000',
      faq: [
        { q: 'Wie lange dauert die Skisaison in Livigno?', a: 'In der Regel von Ende November bis Anfang Mai — eine der längsten Skisaisons der italienischen Alpen.' },
        { q: 'Wie weit ist die Wohnung von den Skiliften entfernt?', a: 'Etwa 100 Meter zu Fuß von den Liften; Skischule und Ausrüstungsverleih liegen 50 Meter entfernt.' },
        { q: 'Gibt es einen Abstellraum für Ski, Skischuhe und Ausrüstung?', a: 'Ja, einen eigenen Abstellraum dafür, plus einen kostenlosen Parkplatz für die Anreise mit dem Auto.' }
      ]
    },
    fr: {
      title: 'Hiver à Livigno : ski, sauna privé et confort à deux pas des pistes',
      metaTitle: "Vacances d'hiver à Livigno | Sauna à 100 m des remontées",
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
      relatedLinkLabel: 'Lisez le guide complet du domaine skiable Carosello 3000',
      faq: [
        { q: 'Combien de temps dure la saison de ski à Livigno ?', a: "Généralement de fin novembre à début mai — l'une des saisons de ski les plus longues des Alpes italiennes." },
        { q: "À quelle distance l'appartement se trouve-t-il des remontées mécaniques ?", a: "À environ 100 mètres à pied des remontées ; l'école de ski et la location de matériel sont à 50 mètres." },
        { q: 'Y a-t-il un espace pour ranger skis, chaussures et matériel ?', a: "Oui, un espace de rangement dédié, ainsi qu'une place de parking gratuite pour les arrivées en voiture." }
      ]
    },
    da: {
      title: 'Vinter i Livigno: skiløb, privat sauna og komfort tæt på pisterne',
      metaTitle: 'Vinterferie i Livigno | Sauna 100 m fra liftene',
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
      relatedLinkLabel: 'Læs den fulde guide til skiområdet Carosello 3000',
      faq: [
        { q: 'Hvor lang er skisæsonen i Livigno?', a: 'Typisk fra slutningen af november til begyndelsen af maj — en af de længste skisæsoner i de italienske Alper.' },
        { q: 'Hvor langt er lejligheden fra skiliftene?', a: 'Cirka 100 meter til fods fra liftene; skiskole og udstyrsudlejning ligger 50 meter væk.' },
        { q: 'Er der plads til opbevaring af ski, støvler og udstyr?', a: 'Ja, et eget opbevaringsrum til det, plus en gratis parkeringsplads for dem, der ankommer i bil.' }
      ]
    },
    pl: {
      title: 'Zimowe wakacje w Livigno: narciarstwo, prywatna sauna i komfort tuż przy stokach',
      metaTitle: 'Zimowe wakacje w Livigno | Sauna 100 m od wyciągów',
      metaDescription:
        'Prywatna sauna na podczerwień i łaźnia parowa 100 m od Carosello 3000: odkryj, jak wygląda zima w Livigno w Ironwood.',
      eyebrow: 'Zima w Livigno',
      intro:
        "Livigno to jeden z alpejskich kurortów we Włoszech z najdłuższym sezonem narciarskim: stoki otwarte od końca listopada do początku maja, obszar narciarski sięgający ponad 3000 metrów i rzadki komfort powrotu do rozgrzewającej prywatnej sauny po ostatnim zjeździe.",
      sections: [
        {
          heading: 'Obszar narciarski: Carosello 3000 i Mottolino',
          body: [
            "Livigno rozciąga się na dwóch głównych zboczach. Carosello 3000, większy z nich, oferuje trasy dla każdego poziomu i widoki sięgające niemal 3000 metrów n.p.m. Mottolino to z kolei punkt odniesienia dla freeride'u i bardziej technicznych stoków, a latem zamienia się w bike park kurortu. Razem oba obszary tworzą teren narciarski odpowiedni zarówno dla rodzin stawiających pierwsze kroki na nartach, jak i dla doświadczonych narciarzy.",
            'Livigno słynie też z narciarstwa biegowego: część tras biegnie przez centrum miasteczka i dolinę — spokojniejsza aktywność, którą warto przeplatać z dniami na trasach zjazdowych, odpowiednia dla rodzin z dziećmi lub dla każdego, kto szuka po prostu innego tempa.'
          ]
        },
        {
          heading: 'Sezon dłuższy niż przeciętnie',
          body: [
            'Sezon zimowy w Livigno trwa zazwyczaj od końca listopada do początku maja — dłużej niż w wielu innych włoskich kurortach alpejskich. Oznacza to możliwość jazdy na nartach na samym początku lub końcu sezonu, gdy gdzie indziej wyciągi są już zamknięte — często przy mniejszym tłoku na stokach i niższych cenach poza szczytem sezonu (Boże Narodzenie, Nowy Rok, luty).'
          ]
        },
        {
          heading: 'Zaleta powrotu 100 metrów od stoków',
          body: [
            'Ironwood Livigno znajduje się zaledwie 100 metrów pieszo od wyciągów narciarskich i 50 metrów od szkółki narciarskiej i wypożyczalni sprzętu: możesz jeździć na nartach cały poranek bez ruszania samochodu, wrócić na obiad, jeśli chcesz, i po południu znów być na stoku bez straty czasu na dojazdy.',
            'Ale to dopiero po ostatnim zjeździe naprawdę czuć różnicę. W apartamencie sauna na podczerwień i łaźnia parowa są prywatne — nigdy nie dzielone z innymi gośćmi, w przeciwieństwie do spa w hotelu. To wtedy mięśnie naprawdę się rozgrzewają, jeszcze zanim pomyślisz o kolacji, przy elektrycznym kominku w salonie.',
            'Apartament obejmuje też dedykowaną przechowalnię na narty, buty i sprzęt, więc nie trzeba wnosić wszystkiego do domu każdego wieczoru, a także bezpłatne miejsce parkingowe dla przyjeżdżających samochodem.'
          ]
        }
      ],
      highlights: [
        '100 m od wyciągów narciarskich, 50 m od szkółki narciarskiej i wypożyczalni',
        'Prywatna sauna na podczerwień i łaźnia parowa, nigdy nie dzielone',
        'Dedykowana przechowalnia na narty i buty',
        '3 sypialnie i 2 łazienki dla rodzin i grup do 6 osób'
      ],
      ctaText: 'Sprawdź dostępność na swoją zimę w Livigno',
      breadcrumbName: 'Zima w Livigno',
      navLabel: 'Zima',
      relatedLinkLabel: 'Przeczytaj pełny przewodnik po obszarze narciarskim Carosello 3000',
      faq: [
        { q: 'Jak długo trwa sezon narciarski w Livigno?', a: 'Zazwyczaj od końca listopada do początku maja — jeden z najdłuższych sezonów narciarskich w Alpach włoskich.' },
        { q: 'Jak daleko jest apartament od wyciągów narciarskich?', a: 'Około 100 metrów pieszo od wyciągów; szkółka narciarska i wypożyczalnia sprzętu znajdują się 50 metrów dalej.' },
        { q: 'Czy jest miejsce na przechowanie nart, butów i sprzętu?', a: 'Tak, dedykowana przechowalnia, a także bezpłatne miejsce parkingowe dla przyjeżdżających samochodem.' }
      ]
    },
    cs: {
      title: 'Zimní dovolená v Livignu: lyžování, soukromá sauna a komfort kousek od sjezdovek',
      metaTitle: 'Zimní dovolená v Livignu | Apartmán se saunou 100 m od vleků',
      metaDescription: 'Soukromá infrasauna a parní lázeň 100 m od Carosello 3000: objevte, jaké je trávit zimu v Livignu v Ironwood.',
      eyebrow: 'Zima v Livignu',
      intro:
        'Livigno patří mezi italská alpská střediska s nejdelší lyžařskou sezónou: sjezdovky otevřené od konce listopadu do začátku května, lyžařský areál sahající přes 3 000 metrů a vzácný komfort návratu do soukromé sauny po posledním sjezdu dne.',
      sections: [
        {
          heading: 'Lyžařský areál: Carosello 3000 a Mottolino',
          body: [
            'Livigno se rozkládá na dvou hlavních svazích. Carosello 3000, ten rozlehlejší, nabízí sjezdovky pro každou úroveň a výhledy sahající téměř ke 3 000 metrům nad mořem. Mottolino je naopak referenčním bodem pro freeride a technicky náročnější terén a v létě se mění v bikepark střediska. Dohromady oba areály tvoří lyžařskou oblast, která vyhovuje jak začínajícím rodinám, tak zkušeným lyžařům.',
            'Livigno je známé i běžeckým lyžováním: některé okruhy vedou přímo centrem městečka a údolím — klidnější aktivita, kterou lze střídat se dny na sjezdovkách, vhodná pro rodiny s dětmi nebo pro každého, kdo chce jednoduše jiné tempo.'
          ]
        },
        {
          heading: 'Sezóna delší, než je obvyklé',
          body: [
            'Zimní sezóna v Livignu obvykle trvá od konce listopadu do začátku května — déle než v mnoha jiných italských alpských střediscích. Znamená to možnost lyžovat i na úplném začátku nebo konci sezóny, kdy jinde jsou vleky už zavřené — často s menším provozem na sjezdovkách a nižšími cenami mimo hlavní sezónu (Vánoce, Nový rok, únor).'
          ]
        },
        {
          heading: 'Výhoda návratu 100 metrů od sjezdovek',
          body: [
            'Ironwood Livigno se nachází pouhých 100 metrů pěšky od lyžařských vleků a 50 metrů od lyžařské školy a půjčovny vybavení: lyžovat můžete celé dopoledne, aniž byste hnuli autem, v případě potřeby se vrátit na oběd a odpoledne se opět vydat na sjezdovky bez ztráty času přesuny.',
            'Skutečný rozdíl ale pocítíte až po posledním sjezdu dne. V apartmánu jsou infrasauna a parní lázeň soukromé — nikdy sdílené s jinými hosty, na rozdíl od hotelového spa. Právě tehdy se svaly opravdu prohřejí, ještě než začnete myslet na večeři, u elektrického krbu v obývacím pokoji.',
            'Apartmán navíc zahrnuje vyhrazenou úschovnu na lyže, boty a vybavení, takže nemusíte nosit všechno dovnitř každý večer, a bezplatné parkovací místo pro ty, kdo přijíždějí autem.'
          ]
        }
      ],
      highlights: [
        '100 m od lyžařských vleků, 50 m od lyžařské školy a půjčovny',
        'Soukromá infrasauna a parní lázeň, nikdy sdílené',
        'Vyhrazená úschovna na lyže a boty',
        '3 ložnice a 2 koupelny pro rodiny a skupiny až 6 osob'
      ],
      ctaText: 'Ověřte dostupnost pro svou zimu v Livignu',
      breadcrumbName: 'Zima v Livignu',
      navLabel: 'Zima',
      relatedLinkLabel: 'Přečtěte si kompletního průvodce lyžařským areálem Carosello 3000',
      faq: [
        { q: 'Jak dlouho trvá lyžařská sezóna v Livignu?', a: 'Obvykle od konce listopadu do začátku května — jedna z nejdelších lyžařských sezón v italských Alpách.' },
        { q: 'Jak daleko je apartmán od lyžařských vleků?', a: 'Přibližně 100 metrů pěšky od vleků; lyžařská škola a půjčovna vybavení jsou vzdáleny 50 metrů.' },
        { q: 'Je k dispozici místo na uschování lyží, bot a vybavení?', a: 'Ano, vyhrazená úschovna, a navíc bezplatné parkovací místo pro příjezd autem.' }
      ]
    },
    no: {
      title: 'Vinter i Livigno: skikjøring, privat badstue og komfort like ved bakkene',
      metaTitle: 'Vinterferie i Livigno | Badstue 100 m fra heisene',
      metaDescription: 'Privat infrarød badstue og dampbad 100 m fra Carosello 3000: oppdag hvordan vinteren i Livigno oppleves hos Ironwood.',
      eyebrow: 'Vinter i Livigno',
      intro:
        'Livigno har en av de lengste skisesongene i de italienske Alpene: bakker åpne fra slutten av november til begynnelsen av mai, et skiområde som strekker seg over 3000 meter, og den sjeldne komforten ved å komme hjem til en privat badstue etter dagens siste tur.',
      sections: [
        {
          heading: 'Skiområdet: Carosello 3000 og Mottolino',
          body: [
            'Livigno strekker seg over to hovedsider. Carosello 3000, det største av de to områdene, har løyper for alle nivåer og utsikt som når over 3000 meters høyde. Mottolino er derimot det naturlige valget for freeride og mer teknisk terreng, og blir om sommeren stedets bikepark. Sammen dekker de to områdene alt fra familier med nybegynnere til erfarne skiløpere.',
            'Livigno er også kjent for langrenn: noen av løypene går gjennom selve bysentrumet og dalen — en roligere aktivitet å veksle med dager i alpinbakkene, godt egnet for familier med barn eller alle som bare vil ha et annet tempo.'
          ]
        },
        {
          heading: 'En lengre sesong enn de fleste',
          body: [
            'Vintersesongen i Livigno varer vanligvis fra slutten av november til begynnelsen av mai — lengre enn i mange andre italienske alpebyer. Det betyr at du kan stå på ski helt i starten eller slutten av sesongen, når heisene andre steder allerede er stengt — ofte med mindre folkemengder i bakkene og lavere priser utenom høysesongen (jul, nyttår, februar).'
          ]
        },
        {
          heading: 'Fordelen ved å bo 100 meter fra bakkene',
          body: [
            'Ironwood Livigno ligger bare 100 meter til fots fra skiheisene, og 50 meter fra skiskole og utstyrsutleie: du kan stå på ski hele formiddagen uten å flytte bilen, komme hjem til lunsj om du vil, og være tilbake i bakken om ettermiddagen uten å miste tid på transport.',
            'Men det er etter dagens siste tur at forskjellen virkelig merkes. Inne i leiligheten er den infrarøde badstuen og dampbadet privat — aldri delt med andre gjester, i motsetning til et hotellspa. Det er da musklene virkelig varmes opp, lenge før du har tenkt på middag, ved stuens elektriske peis.',
            'Leiligheten har også et eget lagringsrom for ski, støvler og utstyr, så du slipper å bære alt inn hver kveld, samt en gratis parkeringsplass for dem som kommer med bil.'
          ]
        }
      ],
      highlights: [
        '100 m fra skiheisene, 50 m fra skiskole og utleie',
        'Privat infrarød badstue og dampbad, aldri delt',
        'Eget lagringsrom for ski og støvler',
        '3 soverom og 2 bad for familier og grupper på opptil 6 personer'
      ],
      ctaText: 'Sjekk tilgjengelighet for din vinter i Livigno',
      breadcrumbName: 'Vinter i Livigno',
      navLabel: 'Vinter',
      relatedLinkLabel: 'Les den fullstendige guiden til skiområdet Carosello 3000',
      faq: [
        { q: 'Hvor lang er skisesongen i Livigno?', a: 'Vanligvis fra slutten av november til begynnelsen av mai — en av de lengste skisesongene i de italienske Alpene.' },
        { q: 'Hvor langt er leiligheten fra skiheisene?', a: 'Omtrent 100 meter til fots fra heisene; skiskole og utstyrsutleie ligger 50 meter unna.' },
        { q: 'Er det et sted å oppbevare ski, støvler og utstyr?', a: 'Ja, et eget lagringsrom for dette, i tillegg til en gratis parkeringsplass for dem som kommer med bil.' }
      ]
    },
    nl: {
      title: 'Winter in Livigno: skiën, een privésauna en comfort vlak bij de piste',
      metaTitle: 'Wintervakantie in Livigno | Sauna, 100 m van de liften',
      metaDescription: 'Privé infraroodsauna en stoombad, 100 m van Carosello 3000: ontdek hoe de winter in Livigno aanvoelt bij Ironwood.',
      eyebrow: 'Winter in Livigno',
      intro:
        'Livigno heeft een van de langste skiseizoenen van de Italiaanse Alpen: piste open van eind november tot begin mei, een skigebied dat tot boven de 3000 meter reikt, en het zeldzame comfort om na de laatste afdaling thuis te komen in een privésauna.',
      sections: [
        {
          heading: 'Het skigebied: Carosello 3000 en Mottolino',
          body: [
            "Livigno strekt zich uit over twee hoofdzijden. Carosello 3000, de grootste van de twee, biedt piste's voor elk niveau en uitzichten die de 3000 meter boven zeeniveau benaderen. Mottolino is dan weer hét referentiepunt voor freeride en technischer terrein, en verandert 's zomers in het bikepark van het dorp. Samen vormen de twee gebieden een skigebied dat zowel beginnende gezinnen als ervaren skiërs tevreden stelt.",
            'Livigno staat ook bekend om langlaufen: sommige lussen lopen dwars door het centrum van het dorp en de vallei — een rustigere activiteit om af te wisselen met dagen op de afdalingspiste, geschikt voor gezinnen met kinderen of voor wie gewoon een ander tempo zoekt.'
          ]
        },
        {
          heading: 'Een langer seizoen dan gemiddeld',
          body: [
            'Het winterseizoen in Livigno loopt doorgaans van eind november tot begin mei, langer dan in veel andere Italiaanse Alpensteden. Dat betekent dat je ook aan het begin of einde van het seizoen kunt skiën, wanneer de liften elders al gesloten zijn — vaak met minder drukte op de piste en lagere prijzen buiten de piekperiodes (Kerstmis, Nieuwjaar, februari).'
          ]
        },
        {
          heading: 'Het voordeel van thuiskomen op 100 meter van de piste',
          body: [
            "Ironwood Livigno ligt op slechts 100 meter lopen van de skiliften en 50 meter van de skischool en verhuur van uitrusting: je kunt de hele ochtend skiën zonder de auto te verplaatsen, terugkomen voor de lunch als je wilt, en 's middags weer op de piste staan zonder tijd te verliezen aan verplaatsingen.",
            "Maar het is pas na de laatste afdaling dat je het verschil echt voelt. In het appartement zijn de infraroodsauna en het stoombad privé — nooit gedeeld met andere gasten, in tegenstelling tot een hotelspa. Dat is het moment waarop je spieren écht opwarmen, nog voor je aan het avondeten denkt, bij de elektrische open haard in de woonkamer.",
            "Het appartement beschikt bovendien over een eigen bergruimte voor ski's, skischoenen en uitrusting, zodat je niet elke avond alles naar binnen hoeft te dragen, plus een gratis parkeerplaats voor wie met de auto komt."
          ]
        }
      ],
      highlights: [
        '100 m van de skiliften, 50 m van skischool en verhuur',
        'Privé infraroodsauna en stoombad, nooit gedeeld',
        "Eigen bergruimte voor ski's en schoenen",
        '3 slaapkamers en 2 badkamers voor gezinnen en groepen tot 6 personen'
      ],
      ctaText: 'Check de beschikbaarheid voor jouw winter in Livigno',
      breadcrumbName: 'Winter in Livigno',
      navLabel: 'Winter',
      relatedLinkLabel: 'Lees de volledige gids over het skigebied Carosello 3000',
      faq: [
        { q: 'Hoe lang duurt het skiseizoen in Livigno?', a: 'Meestal van eind november tot begin mei — een van de langste skiseizoenen van de Italiaanse Alpen.' },
        { q: 'Hoe ver ligt het appartement van de skiliften?', a: 'Ongeveer 100 meter lopen van de liften; de skischool en verhuur van uitrusting liggen op 50 meter.' },
        { q: "Is er een plek om ski's, schoenen en uitrusting op te bergen?", a: "Ja, een eigen bergruimte hiervoor, plus een gratis parkeerplaats voor wie met de auto komt." }
      ]
    },
    zh: {
      title: '利维尼奥冬季度假:滑雪、私人桑拿与近在咫尺的舒适体验',
      metaTitle: '利维尼奥冬季度假 | 距缆车仅100米的带桑拿公寓',
      metaDescription: '私人红外线桑拿与土耳其蒸汽浴,距Carosello 3000仅100米:在Ironwood体验利维尼奥的冬日时光。',
      eyebrow: '利维尼奥的冬天',
      intro:
        '利维尼奥是意大利阿尔卑斯山滑雪季最长的度假胜地之一:雪道从11月末开放至次年5月初,滑雪区海拔超过3000米,滑完最后一趟雪后还能回到私人桑拿房暖身,这样的舒适实属难得。',
      sections: [
        {
          heading: '滑雪区:Carosello 3000与Mottolino',
          body: [
            '利维尼奥分布在两大主要山坡上。面积更大的Carosello 3000提供适合各个水平的雪道,视野几乎可达海拔3000米。Mottolino则是自由式滑雪和技术性地形爱好者的首选,夏季还会变身为当地的自行车公园。两个滑雪区合起来,既能满足初学家庭,也能满足经验丰富的滑雪者。',
            '利维尼奥同样以越野滑雪闻名:部分雪道穿过镇中心和山谷,是一项比高山滑雪更轻松的活动,适合与下坡滑雪的日子交替进行——无论是带着孩子出行的家庭,还是只想换个节奏的旅行者,都很合适。'
          ]
        },
        {
          heading: '比平均更长的雪季',
          body: [
            '利维尼奥的冬季通常从11月末持续到次年5月初,比意大利许多其他阿尔卑斯山度假地都要长。这意味着您可以在雪季刚开始或即将结束时滑雪,那时其他地方的缆车往往已经关闭——雪道通常更不拥挤,而且在圣诞、新年和二月等高峰期之外,价格也更实惠。'
          ]
        },
        {
          heading: '距雪道仅100米的优势',
          body: [
            'Ironwood Livigno距离滑雪缆车仅100米步行路程,距滑雪学校和器材租赁点仅50米:您可以整个上午滑雪而无需挪动汽车,需要的话中午回来吃饭,下午再回到雪道上,不必在路途上浪费时间。',
            '但真正感受到差异的,是滑完最后一趟雪之后。公寓内的红外线桑拿和土耳其蒸汽浴都是私人专属——绝不与其他客人共用,这一点与酒店水疗中心截然不同。在客厅的电壁炉旁,还没想到晚餐,肌肉就已经真正地暖和了起来。',
            '公寓还配有专用的滑雪板、雪靴和装备储藏室,不必每晚把所有装备都搬进屋内;自驾前来的客人还可享有免费停车位。'
          ]
        }
      ],
      highlights: [
        '距滑雪缆车100米,距滑雪学校和租赁点50米',
        '私人红外线桑拿与土耳其蒸汽浴,绝不与他人共用',
        '专用滑雪板与雪靴储藏室',
        '3间卧室、2间浴室,适合最多6人的家庭或团体'
      ],
      ctaText: '查询您在利维尼奥冬季的入住空房情况',
      breadcrumbName: '利维尼奥的冬天',
      navLabel: '冬季',
      relatedLinkLabel: '阅读Carosello 3000滑雪区完整指南',
      faq: [
        { q: '利维尼奥的滑雪季有多长?', a: '通常从11月末持续到次年5月初——是意大利阿尔卑斯山滑雪季最长的地区之一。' },
        { q: '公寓距离滑雪缆车有多远?', a: '步行约100米即可到达缆车;滑雪学校和器材租赁点距离50米。' },
        { q: '有地方存放滑雪板、雪靴和装备吗?', a: '有,配有专用储藏室存放这些物品,自驾前来的客人还可享有免费停车位。' }
      ]
    },
    ja: {
      title: 'リヴィニョの冬:スキー、専用サウナ、ゲレンデ目の前の快適さ',
      metaTitle: 'リヴィニョ冬のバカンス | リフトから100mのサウナ付きアパートメント',
      metaDescription: 'Carosello 3000から100m、専用の赤外線サウナとスチームバス。Ironwoodでリヴィニョの冬を体験しませんか。',
      eyebrow: 'リヴィニョの冬',
      intro:
        'リヴィニョはイタリアアルプスの中でも屈指の長さを誇るスキーシーズンで知られています。ゲレンデは11月下旬から5月初旬までオープンし、スキーエリアは標高3,000mを超え、最後の滑走のあとは専用サウナで暖まって帰れるという贅沢な体験ができます。',
      sections: [
        {
          heading: 'スキーエリア:Carosello 3000とMottolino',
          body: [
            'リヴィニョは2つの主要なエリアに広がっています。より広大なCarosello 3000には、あらゆるレベルに対応するゲレンデがあり、標高3,000m近くまで見渡せる眺望が楽しめます。一方Mottolinoはフリーライドやより技術的な斜面を求める人の定番で、夏にはこの町のバイクパークにもなります。この2つのエリアが合わさることで、スキー初心者の家族から経験豊富なスキーヤーまで満足できるゲレンデが完成しています。',
            'リヴィニョはクロスカントリースキーでも知られており、コースの一部は町の中心部や谷を通っています。ダウンヒルのゲレンデでの1日と組み合わせるのにちょうどよい、より穏やかなアクティビティで、小さなお子様連れのご家族や、単に違うペースを楽しみたい方にもおすすめです。'
          ]
        },
        {
          heading: '平均より長いシーズン',
          body: [
            'リヴィニョの冬シーズンは通常11月下旬から5月初旬まで続き、イタリアの他の多くのアルプスリゾートよりも長めです。つまり、他の場所ではすでにリフトが閉まっているシーズンの初めや終わりにもスキーを楽しめるということです。多くの場合ゲレンデも空いており、クリスマスや年末年始、2月といったピーク期間を外せば料金も抑えられます。'
          ]
        },
        {
          heading: 'ゲレンデから100mという利点',
          body: [
            'Ironwood Livignoはスキーリフトから徒歩わずか100m、スキースクールとレンタル用品店からは50mの場所にあります。車を動かさずに午前中スキーを楽しみ、必要であればランチのために戻り、移動時間を無駄にすることなく午後には再びゲレンデへ戻ることができます。',
            'しかし、本当に違いを実感できるのは最後の滑走を終えたあとです。アパートメント内の赤外線サウナとスチームバスは完全に専用で、ホテルのスパのように他の宿泊客と共有することは決してありません。リビングの電気暖炉のそばで、夕食のことを考える前に、まさに筋肉が芯から温まる瞬間です。',
            'アパートメントにはスキー板やブーツ、用具専用の収納スペースも備わっているため、毎晩すべてを室内に運び込む必要はありません。また、車でお越しの方には無料駐車場もご用意しています。'
          ]
        }
      ],
      highlights: [
        'スキーリフトから100m、スキースクールとレンタルから50m',
        '専用の赤外線サウナとスチームバス、他の宿泊客とは共有しません',
        'スキー板・ブーツ専用の収納スペース',
        '3ベッドルーム・2バスルームで最大6名のご家族・グループに対応'
      ],
      ctaText: 'リヴィニョでの冬のご滞在、空室状況を確認する',
      breadcrumbName: 'リヴィニョの冬',
      navLabel: '冬',
      relatedLinkLabel: 'Carosello 3000スキーエリアの完全ガイドを読む',
      faq: [
        { q: 'リヴィニョのスキーシーズンはどのくらい続きますか?', a: '通常11月下旬から5月初旬までで、イタリアアルプスの中でも屈指の長さのスキーシーズンです。' },
        { q: 'アパートメントからスキーリフトまでの距離は?', a: '徒歩約100mでリフトに到着します。スキースクールとレンタル用品店は50mの距離です。' },
        { q: 'スキー板やブーツ、用具を収納する場所はありますか?', a: 'はい、専用の収納スペースをご用意しており、車でお越しの方には無料駐車場もございます。' }
      ]
    }
  },
  estate: {
    en: {
      title: 'Summer in Livigno: mountain biking, hiking, and unwinding in the apartment with a sauna',
      metaTitle: 'Summer Holiday in Livigno | Biking, Hiking, Private Sauna',
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
      relatedLinkLabel: 'Read the full guide to summer in Livigno',
      faq: [
        { q: 'When is the summer season for mountain biking and hiking in Livigno?', a: "From June to September, with over 50 km of organised trails, Mottolino Bike Park and Carosello 3000's summer lifts open." },
        { q: 'Is e-bike hire available?', a: 'Yes, on request we provide 2 e-bikes for hire directly at the property.' },
        { q: "Is Livigno in summer worth visiting even if you don't do sport?", a: 'Yes — the loop around Lake Livigno is suited to everyone, and temperatures stay cool even in August.' }
      ]
    },
    'en-us': {
      title: 'Summer in Livigno, Italy: mountain biking, hiking, and unwinding in the apartment with a sauna',
      metaTitle: 'Summer Vacation in Livigno, Italy | Biking and Private Sauna',
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
      relatedLinkLabel: 'Read the full guide to summer in Livigno',
      faq: [
        { q: 'When is the summer season for mountain biking and hiking in Livigno, Italy?', a: "From June to September, with over 50 km of organized trails, Mottolino Bike Park and Carosello 3000's summer lifts open." },
        { q: 'Is e-bike rental available?', a: 'Yes, on request we provide 2 e-bikes for rent directly at the property.' },
        { q: "Is Livigno in summer worth visiting even if you don't do sports?", a: 'Yes — the loop around Lake Livigno is suited to everyone, and temperatures stay cool even in August.' }
      ]
    },
    de: {
      title: 'Sommer in Livigno: Mountainbike, Wandern und Entspannung in der Ferienwohnung mit Sauna',
      metaTitle: 'Sommerurlaub in Livigno | Bike, Wandern, private Sauna',
      metaDescription:
        'Bikepark, Wege für jedes Niveau und der Lago di Livigno: entdecken Sie den Sommer in Livigno bei Ironwood.',
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
      relatedLinkLabel: 'Lesen Sie den vollständigen Guide zum Sommer in Livigno',
      faq: [
        { q: 'Wann ist die Sommersaison für Mountainbike und Wandern in Livigno?', a: 'Von Juni bis September, mit über 50 km ausgeschilderten Trails, dem Mottolino Bike Park und den geöffneten Sommerliften von Carosello 3000.' },
        { q: 'Ist ein E-Bike-Verleih verfügbar?', a: 'Ja, auf Wunsch stellen wir 2 E-Bikes direkt vor Ort zur Verfügung.' },
        { q: 'Lohnt sich Livigno im Sommer auch ohne Sport?', a: 'Ja — die Runde um den Lago di Livigno ist für alle geeignet, und die Temperaturen bleiben auch im August angenehm kühl.' }
      ]
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
      relatedLinkLabel: "Lisez le guide complet de l'été à Livigno",
      faq: [
        { q: 'Quand est la saison estivale pour le VTT et la randonnée à Livigno ?', a: 'De juin à septembre, avec plus de 50 km de sentiers balisés, le Mottolino Bike Park et les remontées estivales du Carosello 3000 ouvertes.' },
        { q: 'La location de vélos électriques est-elle disponible ?', a: 'Oui, sur demande nous mettons à disposition 2 vélos électriques directement sur place.' },
        { q: 'Livigno en été vaut-il le détour même sans pratiquer de sport ?', a: 'Oui — le tour du lac de Livigno est accessible à tous, et les températures restent fraîches même en août.' }
      ]
    },
    da: {
      title: 'Livigno om sommeren: mountainbike, vandreture og afslapning i lejligheden med sauna',
      metaTitle: 'Sommerferie i Livigno | Mountainbike og privat sauna',
      metaDescription: 'Bikepark, stier til alle niveauer og Livigno-søen: oplev sommeren i Livigno, og hvorfor en lejlighed med privat sauna er den ideelle base.',
      eyebrow: 'Sommer i Livigno',
      intro:
        'Livigno er ikke kun et vinterrejsemål: fra juni til september forvandles det alpine bassin til en af Europas mountainbike-hovedstæder, med stier til familier, vandreentusiaster og erfarne bikere.',
      sections: [
        {
          heading: 'Mountainbike: fra Mottolino Bike Park til Bike Academy',
          body: [
            'Mottolino Bike Park er det oplagte valg for dem, der søger adrenalin, med ruter inden for downhill, jumparea og north shore-sektioner. Også Carosello 3000 åbner sine lifte om sommeren og forbinder panoramastier i højden. For begyndere eller familier med børn tilbyder Bike Academy en rute skræddersyet til førstegangsbrugere.',
            'I alt tæller området over 50 km organiserede stier, der passer både til teknisk krævende nedkørsler og til en rolig tur gennem lærkeskovene.'
          ]
        },
        {
          heading: 'Vandreture, Livigno-søen og de blomstrende alpeenge',
          body: [
            'Man behøver ikke være biker for at nyde Livigno om sommeren. Bassinet gennemkrydses af vandrestier i alle sværhedsgrader, forbi blomstrende alpeenge — arnika er egnens symbolblomst — med udsigt over de Rætiske Alper. En tur, alle kan klare, er ruten rundt om Livigno-søen, med masser af steder til en picnic på varme dage.',
            'Sommertemperaturerne forbliver kølige selv i august — endnu en grund til, at Livigno er populært blandt dem, der søger lindring fra bykarmen.'
          ]
        },
        {
          heading: 'Hvorfor bo hos Ironwood om sommeren',
          body: [
            'Beliggenheden tæt på liftene, som er praktisk om vinteren, er lige så nyttig om sommeren til at nå de vigtigste stiudgangspunkter til fods eller på cykel. Efter ønske stiller vi 2 el-cykler til rådighed direkte fra ejendommen, så du kan dække mere terræn uden at slide dig selv op ad bakkerne — nyttigt også for familier eller alle, der ikke er trænede cyklister.',
            'Efter en dag på stierne eller cyklen er lejlighedens to altaner med udsigt over bjergene det rette sted at slappe af, og den private infrarøde sauna er fortsat en lille luksus, der også er tilgængelig uden for skisæsonen, for dem der vil løsne musklerne efter en krævende vandretur.'
          ]
        }
      ],
      highlights: [
        'Udlejning af el-cykler direkte fra ejendommen',
        'To altaner med udsigt over bjergene',
        'Privat infrarød sauna, nyttig også efter vandreture',
        'Tæt på stiernes udgangspunkter og bikeparken'
      ],
      ctaText: 'Tjek ledighed for din sommer i Livigno',
      breadcrumbName: 'Sommer i Livigno',
      navLabel: 'Sommer',
      relatedLinkLabel: 'Læs den fulde guide til sommeren i Livigno',
      faq: [
        { q: 'Hvornår er sommersæsonen for mountainbike og vandreture i Livigno?', a: "Fra juni til september, med over 50 km organiserede stier, Mottolino Bike Park og Carosello 3000's sommerlifte åbne." },
        { q: 'Er der udlejning af el-cykler?', a: 'Ja, efter ønske stiller vi 2 el-cykler til rådighed direkte fra ejendommen.' },
        { q: 'Er Livigno om sommeren et besøg værd, selv uden sport?', a: 'Ja — ruten rundt om Livigno-søen passer til alle, og temperaturerne forbliver kølige selv i august.' }
      ]
    },
    pl: {
      title: 'Livigno latem: rowery górskie, trekking i relaks w apartamencie z sauną',
      metaTitle: 'Letnie wakacje w Livigno | Rowery i prywatna sauna',
      metaDescription: 'Bike park, szlaki dla każdego poziomu i Jezioro Livigno: odkryj lato w Livigno i dlaczego apartament z prywatną sauną to idealna baza.',
      eyebrow: 'Lato w Livigno',
      intro:
        'Livigno to nie tylko zimowy kierunek: od czerwca do września alpejska kotlina zamienia się w jedną ze stolic kolarstwa górskiego w Europie, z trasami dla rodzin, entuzjastów trekkingu i doświadczonych rowerzystów.',
      sections: [
        {
          heading: 'Rowery górskie: od Mottolino Bike Park do Bike Academy',
          body: [
            "Mottolino Bike Park to punkt odniesienia dla szukających adrenaliny, z trasami zjazdowymi, strefą skoków i sekcjami north shore. Latem otwiera swoje wyciągi także Carosello 3000, łącząc widokowe szlaki na wysokości. Dla początkujących i rodzin z dziećmi Bike Academy oferuje trasę zaprojektowaną specjalnie dla debiutantów.",
            'W sumie obszar liczy ponad 50 km oznakowanych szlaków, odpowiednich zarówno dla szukających technicznych zjazdów, jak i dla tych, którzy wolą spokojną przejażdżkę przez modrzewiowe lasy.'
          ]
        },
        {
          heading: 'Trekking, Jezioro Livigno i kwitnące hale',
          body: [
            "Nie trzeba być rowerzystą, by cieszyć się Livigno latem. Kotlinę przecinają szlaki trekkingowe o różnym poziomie trudności, wśród kwitnących hal — arnika to symboliczny kwiat tego regionu — z widokami na Alpy Retyckie. Spacer dostępny dla każdego to trasa wokół Jeziora Livigno, z licznymi miejscami na piknik w cieplejsze dni.",
            'Letnie temperatury pozostają chłodne nawet w sierpniu — to kolejny powód, dla którego Livigno cieszy się popularnością wśród szukających wytchnienia od miejskiego upału.'
          ]
        },
        {
          heading: 'Dlaczego warto zatrzymać się w Ironwood latem',
          body: [
            'Lokalizacja tuż przy wyciągach, wygodna zimą, przydaje się także latem, by dotrzeć pieszo lub rowerem do głównych wejść na szlaki. Na życzenie udostępniamy wypożyczenie 2 rowerów elektrycznych bezpośrednio na miejscu, by pokonać więcej terenu bez nadmiernego wysiłku na podjazdach — przydatne również dla rodzin lub osób bez dużego doświadczenia kolarskiego.',
            'Po dniu spędzonym na szlakach lub na rowerze, dwa balkony apartamentu z widokiem na góry to idealne miejsce na odpoczynek, a prywatna sauna na podczerwień pozostaje małym luksusem dostępnym również poza sezonem narciarskim, dla tych, którzy chcą rozluźnić mięśnie po wymagającym trekkingu.'
          ]
        }
      ],
      highlights: [
        'Wypożyczalnia rowerów elektrycznych dostępna bezpośrednio na miejscu',
        'Dwa balkony z widokiem na góry',
        'Prywatna sauna na podczerwień, przydatna także po trekkingu',
        'Blisko wejść na szlaki i bike parku'
      ],
      ctaText: 'Sprawdź dostępność na swoje lato w Livigno',
      breadcrumbName: 'Lato w Livigno',
      navLabel: 'Lato',
      relatedLinkLabel: 'Przeczytaj pełny przewodnik po lecie w Livigno',
      faq: [
        { q: 'Kiedy jest letni sezon na rowery górskie i trekking w Livigno?', a: 'Od czerwca do września, z ponad 50 km oznakowanych szlaków, Mottolino Bike Park i otwartymi letnimi wyciągami Carosello 3000.' },
        { q: "Czy dostępna jest wypożyczalnia e-bike'ów?", a: 'Tak, na życzenie udostępniamy 2 rowery elektryczne bezpośrednio na miejscu.' },
        { q: 'Czy Livigno latem warto odwiedzić nawet bez uprawiania sportu?', a: 'Tak — trasa wokół Jeziora Livigno jest dostępna dla każdego, a temperatury pozostają chłodne nawet w sierpniu.' }
      ]
    },
    cs: {
      title: 'Livigno v létě: horská kola, trekking a odpočinek v apartmánu se saunou',
      metaTitle: 'Letní dovolená v Livignu | Kola a soukromá sauna',
      metaDescription: 'Bikepark, trasy pro všechny úrovně a jezero Livigno: objevte léto v Livignu a proč je apartmán se soukromou saunou ideální základnou.',
      eyebrow: 'Léto v Livignu',
      intro:
        'Livigno není jen zimní destinace: od června do září se alpská kotlina mění v jednu z evropských hlavních destinací horské cyklistiky, s trasami pro rodiny, milovníky trekkingu i zkušené bikery.',
      sections: [
        {
          heading: 'Horská kola: od Mottolino Bike Parku po Bike Academy',
          body: [
            'Mottolino Bike Park je referenčním bodem pro milovníky adrenalinu, s trasami mezi downhillem, jump area a sekcemi north shore. I Carosello 3000 v létě otevírá své vleky a propojuje panoramatické stezky ve výškách. Pro začátečníky nebo rodiny s dětmi nabízí Bike Academy trasu navrženou přímo pro nováčky.',
            'Celkem oblast čítá přes 50 km organizovaných tras, vhodných jak pro technické sjezdy, tak pro klidnou projížďku modřínovými lesy.'
          ]
        },
        {
          heading: 'Trekking, jezero Livigno a kvetoucí horské pastviny',
          body: [
            'Livigno si v létě užijete i bez kola. Kotlinou prochází trekové trasy všech obtížností, kolem kvetoucích horských pastvin — arnika je symbolickou květinou oblasti — s výhledy na Rétské Alpy. Procházka dostupná pro každého vede kolem jezera Livigno, s řadou míst na piknik v teplejších dnech.',
            'Letní teploty zůstávají příjemně chladné i v srpnu — další důvod, proč je Livigno oblíbené u těch, kdo hledají úlevu od městských veder.'
          ]
        },
        {
          heading: 'Proč zůstat v létě u Ironwood',
          body: [
            'Poloha kousek od vleků, praktická v zimě, je stejně užitečná i v létě pro dosažení hlavních výchozích bodů tras pěšky nebo na kole. Na přání zajistíme zapůjčení 2 elektrokol přímo v objektu, abyste zvládli více terénu bez přílišné námahy do kopce — užitečné i pro rodiny nebo pro ty, kdo nejsou zkušení cyklisté.',
            'Po dni stráveném na trasách nebo na kole jsou dva balkony apartmánu s výhledem na hory tím pravým místem k odpočinku a soukromá infrasauna zůstává drobným luxusem dostupným i mimo lyžařskou sezónu pro ty, kdo si chtějí po náročném treku uvolnit svaly.'
          ]
        }
      ],
      highlights: [
        'Půjčovna elektrokol přímo v objektu',
        'Dva balkony s výhledem na hory',
        'Soukromá infrasauna, užitečná i po trekkingu',
        'Kousek od výchozích bodů tras a bikeparku'
      ],
      ctaText: 'Ověřte dostupnost pro své léto v Livignu',
      breadcrumbName: 'Léto v Livignu',
      navLabel: 'Léto',
      relatedLinkLabel: 'Přečtěte si kompletního průvodce létem v Livignu',
      faq: [
        { q: 'Kdy je letní sezóna pro horská kola a trekking v Livignu?', a: 'Od června do září, s více než 50 km organizovaných tras, Mottolino Bike Parkem a otevřenými letními vleky Carosello 3000.' },
        { q: 'Je k dispozici půjčovna elektrokol?', a: 'Ano, na přání zajistíme zapůjčení 2 elektrokol přímo v objektu.' },
        { q: 'Vyplatí se Livigno v létě navštívit i bez sportu?', a: 'Ano — procházka kolem jezera Livigno je vhodná pro každého a teploty zůstávají příjemně chladné i v srpnu.' }
      ]
    },
    no: {
      title: 'Livigno om sommeren: sykling i fjellet, fotturer og avslapning i leiligheten med badstue',
      metaTitle: 'Sommerferie i Livigno | Fjellsykling og privat badstue',
      metaDescription: 'Bikepark, stier for alle nivåer og Livigno-sjøen: oppdag sommeren i Livigno, og hvorfor en leilighet med privat badstue er den ideelle basen.',
      eyebrow: 'Sommer i Livigno',
      intro:
        'Livigno er ikke bare et vintermål: fra juni til september forvandles det alpine bassenget til en av Europas hovedsteder for fjellsykling, med stier for familier, turentusiaster og erfarne syklister.',
      sections: [
        {
          heading: 'Fjellsykling: fra Mottolino Bike Park til Bike Academy',
          body: [
            'Mottolino Bike Park er det naturlige valget for de som søker adrenalin, med løyper innen downhill, hoppområde og north shore-seksjoner. Også Carosello 3000 åpner heisene sine om sommeren og knytter sammen panoramastier i høyden. For nybegynnere eller familier med barn tilbyr Bike Academy en løype spesielt utformet for førstegangssyklister.',
            'Totalt teller området over 50 km organiserte stier, egnet både for tekniske nedkjøringer og for en rolig tur gjennom lerkeskogene.'
          ]
        },
        {
          heading: 'Fotturer, Livigno-sjøen og blomstrende fjellbeiter',
          body: [
            'Du trenger ikke være syklist for å nyte Livigno om sommeren. Bassenget krysses av fotturstier i alle vanskelighetsgrader, forbi blomstrende fjellbeiter — arnika er egnens symbolblomst — med utsikt over de Rætiske Alper. En tur alle kan klare, er runden rundt Livigno-sjøen, med mange steder for en piknik på varme dager.',
            'Sommertemperaturene holder seg kjølige selv i august — enda en grunn til at Livigno er populært blant dem som ønsker en pause fra byvarmen.'
          ]
        },
        {
          heading: 'Hvorfor bo hos Ironwood om sommeren',
          body: [
            'Beliggenheten like ved heisene, som er praktisk om vinteren, er like nyttig om sommeren for å nå de viktigste stiene til fots eller med sykkel. På forespørsel stiller vi 2 el-sykler til rådighet direkte fra eiendommen, slik at du kan utforske mer terreng uten å slite deg ut i motbakkene — nyttig også for familier eller alle som ikke er erfarne syklister.',
            'Etter en dag på stiene eller sykkelen er leilighetens to balkonger med fjellutsikt det rette stedet å slappe av, og den private infrarøde badstuen forblir en liten luksus tilgjengelig også utenfor skisesongen, for de som vil løsne opp musklene etter en krevende fottur.'
          ]
        }
      ],
      highlights: [
        'Utleie av el-sykler tilgjengelig direkte fra eiendommen',
        'To balkonger med fjellutsikt',
        'Privat infrarød badstue, nyttig også etter fotturer',
        'Like ved inngangene til stiene og bikeparken'
      ],
      ctaText: 'Sjekk tilgjengelighet for din sommer i Livigno',
      breadcrumbName: 'Sommer i Livigno',
      navLabel: 'Sommer',
      relatedLinkLabel: 'Les den fullstendige guiden til sommeren i Livigno',
      faq: [
        { q: 'Når er sommersesongen for fjellsykling og fotturer i Livigno?', a: 'Fra juni til september, med over 50 km organiserte stier, Mottolino Bike Park og Carosello 3000s sommerheiser åpne.' },
        { q: 'Er utleie av el-sykler tilgjengelig?', a: 'Ja, på forespørsel stiller vi 2 el-sykler til rådighet direkte fra eiendommen.' },
        { q: 'Er Livigno om sommeren verdt et besøk selv uten sport?', a: 'Ja — runden rundt Livigno-sjøen passer for alle, og temperaturene holder seg kjølige selv i august.' }
      ]
    },
    nl: {
      title: 'Livigno in de zomer: mountainbiken, wandelen en ontspannen in het appartement met sauna',
      metaTitle: 'Zomervakantie in Livigno | Mountainbiken en privésauna',
      metaDescription: 'Bikepark, paden voor elk niveau en het Meer van Livigno: ontdek de zomer in Livigno en waarom een appartement met privésauna de ideale uitvalsbasis is.',
      eyebrow: 'Zomer in Livigno',
      intro:
        "Livigno is niet alleen een winterbestemming: van juni tot september verandert dit alpendal in een van de mountainbikehoofdsteden van Europa, met paden voor gezinnen, wandelliefhebbers en ervaren bikers.",
      sections: [
        {
          heading: 'Mountainbiken: van Mottolino Bike Park tot de Bike Academy',
          body: [
            "Mottolino Bike Park is hét referentiepunt voor wie op zoek is naar adrenaline, met downhillroutes, een jumparea en north-shoresecties. Ook Carosello 3000 opent 's zomers de liften en verbindt panoramische paden op hoogte. Voor beginners of gezinnen met kinderen biedt de Bike Academy een route die speciaal voor starters is ontworpen.",
            'In totaal telt het gebied meer dan 50 km aan georganiseerde paden, geschikt voor zowel technische afdalingen als een rustige tocht door de lariksbossen.'
          ]
        },
        {
          heading: 'Wandelen, het Meer van Livigno en de bloeiende alpenweiden',
          body: [
            'Je hoeft geen mountainbiker te zijn om van Livigno in de zomer te genieten. Het dal wordt doorkruist door wandelpaden van elke moeilijkheidsgraad, langs bloeiende alpenweiden — de arnica is de symboolbloem van de streek — met uitzicht op de Rätische Alpen. Een wandeling die voor iedereen geschikt is, is het rondje rond het Meer van Livigno, met veel plekjes voor een picknick op warmere dagen.',
            'De zomertemperaturen blijven ook in augustus aangenaam koel — nog een reden waarom Livigno populair is bij wie de stadshitte wil ontvluchten.'
          ]
        },
        {
          heading: 'Waarom je in de zomer bij Ironwood moet verblijven',
          body: [
            'De ligging vlak bij de liften, praktisch in de winter, is ook in de zomer nuttig om de belangrijkste toegangspunten tot de paden te voet of per fiets te bereiken. Op aanvraag stellen we 2 e-bikes rechtstreeks bij de accommodatie ter beschikking, zodat je meer terrein kunt verkennen zonder je te veel te vermoeien bij de klimmen — handig ook voor gezinnen of wie geen getrainde fietser is.',
            'Na een dag op de paden of de fiets zijn de twee balkons met berguitzicht van het appartement de perfecte plek om te ontspannen, en de privé infraroodsauna blijft een kleine luxe die ook buiten het skiseizoen beschikbaar is, voor wie de spieren wil ontspannen na een pittige wandeling.'
          ]
        }
      ],
      highlights: [
        'E-bikeverhuur rechtstreeks bij de accommodatie beschikbaar',
        'Twee balkons met uitzicht op de bergen',
        'Privé infraroodsauna, ook handig na het wandelen',
        'Vlak bij de toegang tot de paden en het bikepark'
      ],
      ctaText: 'Check de beschikbaarheid voor jouw zomer in Livigno',
      breadcrumbName: 'Zomer in Livigno',
      navLabel: 'Zomer',
      relatedLinkLabel: 'Lees de volledige gids over de zomer in Livigno',
      faq: [
        { q: 'Wanneer is het zomerseizoen voor mountainbiken en wandelen in Livigno?', a: 'Van juni tot september, met meer dan 50 km aan georganiseerde paden, het Mottolino Bike Park en de geopende zomerliften van Carosello 3000.' },
        { q: 'Is e-bikeverhuur beschikbaar?', a: 'Ja, op aanvraag stellen we 2 e-bikes rechtstreeks bij de accommodatie ter beschikking.' },
        { q: 'Is Livigno in de zomer de moeite waard, ook zonder sport?', a: 'Ja — het rondje rond het Meer van Livigno is geschikt voor iedereen, en de temperaturen blijven ook in augustus aangenaam koel.' }
      ]
    },
    zh: {
      title: '利维尼奥的夏天:山地自行车、徒步与带桑拿公寓的悠然放松',
      metaTitle: '利维尼奥夏季度假 | 山地自行车、徒步与私人桑拿',
      metaDescription: '自行车公园、适合各水平的步道与利维尼奥湖:探索利维尼奥的夏天,了解为什么带私人桑拿的公寓是理想的落脚点。',
      eyebrow: '利维尼奥的夏天',
      intro:
        '利维尼奥不只是冬季目的地:从6月到9月,这片阿尔卑斯山谷会变身为欧洲最热门的山地自行车胜地之一,拥有适合家庭、徒步爱好者以及经验丰富骑手的多条步道。',
      sections: [
        {
          heading: '山地自行车:从Mottolino自行车公园到自行车学院',
          body: [
            'Mottolino自行车公园是追求肾上腺素飙升的骑手的首选之地,设有速降赛道、跳跃区和North Shore路段。Carosello 3000也会在夏季开放缆车,串联起高海拔的观景步道。对于初学者或带孩子出行的家庭,自行车学院提供专为新手设计的路线。',
            '整个区域共有超过50公里的规划步道,既适合寻求技术性下坡的骑手,也适合喜欢在落叶松林间悠闲骑行的人。'
          ]
        },
        {
          heading: '徒步、利维尼奥湖与鲜花盛开的高山牧场',
          body: [
            '欣赏夏日的利维尼奥并不需要是骑行爱好者。山谷间遍布各种难度的徒步步道,穿过鲜花盛开的高山牧场——山金车是当地的象征之花——沿途还能眺望雷蒂克阿尔卑斯山脉。环绕利维尼奥湖的步道适合所有人,天气炎热时沿途还有许多适合野餐的地点。',
            '即使在8月,夏季气温依然凉爽宜人,这也是利维尼奥深受渴望逃离城市酷暑的旅行者青睐的另一个原因。'
          ]
        },
        {
          heading: '为什么夏天要入住Ironwood',
          body: [
            '距缆车咫尺之遥的位置,在冬季十分便利,夏季同样能让您步行或骑行轻松抵达主要步道入口。如有需要,我们可直接在住处提供2辆电动自行车租赁,帮助您探索更多地形,而不必在上坡路段过度费力——对家庭出行或非资深骑行者尤其实用。',
            '结束一天的徒步或骑行后,公寓的两个山景阳台正是放松的绝佳之地;私人红外线桑拿即便在滑雪季之外,依然是一份小小的奢侈享受,适合在辛苦的徒步之后舒展肌肉。'
          ]
        }
      ],
      highlights: [
        '可直接在住处租赁电动自行车',
        '两个可欣赏山景的阳台',
        '私人红外线桑拿,徒步后同样实用',
        '紧邻步道入口与自行车公园'
      ],
      ctaText: '查询您在利维尼奥夏季的入住空房情况',
      breadcrumbName: '利维尼奥的夏天',
      navLabel: '夏季',
      relatedLinkLabel: '阅读利维尼奥夏季完整指南',
      faq: [
        { q: '利维尼奥的山地自行车和徒步夏季是什么时候?', a: '从6月到9月,拥有超过50公里的规划步道,Mottolino自行车公园和Carosello 3000的夏季缆车均开放。' },
        { q: '可以租赁电动自行车吗?', a: '可以,如有需要,我们可直接在住处提供2辆电动自行车租赁。' },
        { q: '即使不运动,夏天的利维尼奥也值得游览吗?', a: '是的——环绕利维尼奥湖的步道适合所有人,即使在8月气温也依然凉爽。' }
      ]
    },
    ja: {
      title: 'リヴィニョの夏:マウンテンバイク、トレッキング、サウナ付きアパートメントでのくつろぎ',
      metaTitle: 'リヴィニョ夏のバカンス | マウンテンバイク、トレッキング、専用サウナ',
      metaDescription: 'バイクパーク、あらゆるレベルに対応するトレイル、リヴィニョ湖。リヴィニョの夏と、専用サウナ付きアパートメントが理想的な拠点である理由をご紹介します。',
      eyebrow: 'リヴィニョの夏',
      intro:
        'リヴィニョは冬だけの目的地ではありません。6月から9月にかけて、このアルプスの盆地はヨーロッパ屈指のマウンテンバイクの聖地へと姿を変え、家族連れからトレッキング愛好家、経験豊富なバイカーまで楽しめるトレイルが揃います。',
      sections: [
        {
          heading: 'マウンテンバイク:Mottolino Bike ParkからBike Academyまで',
          body: [
            'アドレナリンを求める人にとっての定番はMottolino Bike Parkで、ダウンヒルコース、ジャンプエリア、ノースショアセクションが揃っています。Carosello 3000も夏にはリフトを開放し、標高の高いパノラマトレイルをつないでいます。初心者やお子様連れのご家族には、Bike Academyが専用に設計されたコースを提供しています。',
            'このエリア全体では整備されたトレイルの総延長が50kmを超え、テクニカルな下りを求める人にも、カラマツ林の中をのんびり走りたい人にも対応しています。'
          ]
        },
        {
          heading: 'トレッキング、リヴィニョ湖、花咲く高山牧場',
          body: [
            'リヴィニョの夏を楽しむのにバイカーである必要はありません。盆地にはあらゆる難易度のトレッキングコースが通っており、花咲く高山牧場——アルニカはこの地域を象徴する花です——を抜けながら、レティッシュアルプスの景色を望むことができます。誰でも楽しめる散策コースがリヴィニョ湖を一周するルートで、暖かい日にはピクニックに最適なスポットも点在しています。',
            '8月でも夏の気温は涼しく保たれており、これも都会の暑さから逃れたい人々にリヴィニョが人気の理由のひとつです。'
          ]
        },
        {
          heading: '夏にIronwoodに滞在する理由',
          body: [
            'リフトのすぐそばという立地は冬に便利なだけでなく、夏にも主要なトレイルの入口へ徒歩や自転車で行くのに役立ちます。ご要望に応じて、施設から直接利用できるeバイク2台のレンタルもご用意しており、上り坂で無理をせずより広い範囲を探索できます。ご家族連れや自転車に慣れていない方にも便利です。',
            'トレイルやサイクリングで過ごした一日の後は、山の景色を望む2つのバルコニーがくつろぎにぴったりの場所です。専用の赤外線サウナはスキーシーズン以外でも楽しめるささやかな贅沢として、ハードなトレッキングの後に筋肉をほぐしたい方にもおすすめです。'
          ]
        }
      ],
      highlights: [
        '施設から直接eバイクのレンタルが可能',
        '山の景色を望む2つのバルコニー',
        '専用の赤外線サウナ、トレッキング後にも便利',
        'トレイル入口とバイクパークのすぐそば'
      ],
      ctaText: 'リヴィニョでの夏のご滞在、空室状況を確認する',
      breadcrumbName: 'リヴィニョの夏',
      navLabel: '夏',
      relatedLinkLabel: 'リヴィニョの夏の完全ガイドを読む',
      faq: [
        { q: 'リヴィニョでマウンテンバイクやトレッキングを楽しめる夏のシーズンはいつですか?', a: '6月から9月で、50kmを超える整備されたトレイル、Mottolino Bike Park、Carosello 3000の夏季リフトが利用できます。' },
        { q: 'eバイクのレンタルはありますか?', a: 'はい、ご要望に応じて施設から直接利用できるeバイク2台をご用意しています。' },
        { q: 'スポーツをしなくても夏のリヴィニョは楽しめますか?', a: 'はい。リヴィニョ湖を一周する散策コースは誰でも楽しめ、8月でも気温は涼しく保たれています。' }
      ]
    }
  },
  famiglie: {
    en: {
      title: 'Livigno with children: the apartment designed for families',
      metaTitle: 'Family Apartment in Livigno, Up to 6 Guests',
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
      relatedLinkLabel: 'Read the full guide to Livigno with children',
      faq: [
        { q: 'Is the apartment suitable for young children?', a: 'Yes: on request we provide a cot and high chair, and the 3 bedrooms and 2 bathrooms give parents and children space and a bit of privacy.' },
        { q: 'What activities are suitable for children in Livigno?', a: 'In winter, the cross-country ski loops through the town centre; in summer, the Bike Academy (about 5 km, built for beginners) and walks around the lake.' },
        { q: 'Is the kitchen equipped for cooking for children?', a: "Yes, it's fully equipped with a dishwasher, oven and coffee machine, for preparing tailored meals without eating out every night." }
      ]
    },
    'en-us': {
      title: 'Livigno, Italy with kids: the apartment designed for families',
      metaTitle: 'Family Apartment in Livigno, Italy | Up to 6 Guests',
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
      relatedLinkLabel: 'Read the full guide to Livigno with kids',
      faq: [
        { q: 'Is the apartment suitable for young kids?', a: 'Yes: on request we provide a crib and high chair, and the 3 bedrooms and 2 bathrooms give parents and kids space and a bit of privacy.' },
        { q: 'What activities are suitable for kids in Livigno?', a: 'In winter, the cross-country ski loops through the town center; in summer, the Bike Academy (about 5 km, built for beginners) and walks around the lake.' },
        { q: 'Is the kitchen equipped for cooking for kids?', a: "Yes, it's fully equipped with a dishwasher, oven, and coffee machine, for preparing tailored meals without eating out every night." }
      ]
    },
    de: {
      title: 'Livigno mit Kindern: die Ferienwohnung für Familien',
      metaTitle: 'Familienwohnung in Livigno, bis zu 6 Personen',
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
      relatedLinkLabel: 'Lesen Sie den vollständigen Guide zu Livigno mit Kindern',
      faq: [
        { q: 'Ist die Wohnung für kleine Kinder geeignet?', a: 'Ja: Auf Anfrage stellen wir Kinderbett und Hochstuhl zur Verfügung, und die 3 Schlafzimmer und 2 Bäder geben Eltern und Kindern Platz und etwas Privatsphäre.' },
        { q: 'Welche Aktivitäten eignen sich für Kinder in Livigno?', a: 'Im Winter die Langlaufloipen durch das Ortszentrum, im Sommer die Bike Academy (rund 5 km, für Anfänger konzipiert) und Spaziergänge um den See.' },
        { q: 'Ist die Küche zum Kochen für Kinder ausgestattet?', a: 'Ja, sie ist voll ausgestattet mit Geschirrspüler, Backofen und Kaffeemaschine, um Mahlzeiten nach Maß zuzubereiten, ohne jeden Abend auswärts essen zu müssen.' }
      ]
    },
    fr: {
      title: "Livigno avec des enfants : l'appartement pensé pour les familles",
      metaTitle: 'Appartement familial à Livigno, jusqu\'à 6 personnes',
      metaDescription:
        "3 chambres, 2 salles de bains, lit bébé et chaise haute sur demande : pensé pour les familles jusqu'à 6 personnes.",
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
      relatedLinkLabel: 'Lisez le guide complet de Livigno avec des enfants',
      faq: [
        { q: 'L\'appartement convient-il aux jeunes enfants ?', a: "Oui : sur demande nous fournissons lit bébé et chaise haute, et les 3 chambres et 2 salles de bains offrent de l'espace et un peu d'intimité aux parents et aux enfants." },
        { q: 'Quelles activités conviennent aux enfants à Livigno ?', a: 'En hiver, les boucles de ski de fond qui traversent le centre du village ; en été, la Bike Academy (environ 5 km, pensée pour les débutants) et les promenades autour du lac.' },
        { q: 'La cuisine est-elle équipée pour cuisiner pour les enfants ?', a: 'Oui, elle est entièrement équipée avec lave-vaisselle, four et machine à café, pour préparer des repas adaptés sans devoir sortir manger tous les soirs.' }
      ]
    },
    da: {
      title: 'Livigno med børn: lejligheden designet til familier',
      metaTitle: 'Familielejlighed i Livigno, op til 6 personer',
      metaDescription: '3 soveværelser, 2 badeværelser, barneseng og højstol efter ønske: oplev hvorfor Ironwood Livigno er designet til familier og grupper på op til 6 personer.',
      eyebrow: 'Familier i Livigno',
      intro:
        'At planlægge en familieferie i Livigno med børn betyder at søge plads, sikkerhed og komfort — ikke bare en ekstra seng. Ironwood Livigno er skabt netop med dette for øje: familier og grupper på op til 6 personer, i en lejlighed hvor alle har deres eget rum.',
      sections: [
        {
          heading: 'Plads til alle: 3 soveværelser, 2 badeværelser, 90 m²',
          body: [
            'Lejligheden strækker sig over 90 m² med 3 soveværelser og 2 fulde badeværelser — en fleksibel indretning, der giver forældrene lidt privatliv, mens de mindste sover i værelset ved siden af. Dobbeltværelset med topmadras er tænkt til gruppens forældre, mens værelset med enkeltsenge er praktisk til børn eller større unge.',
            'Efter ønske stiller vi barneseng og højstol til rådighed, så du ikke behøver rejse med tungt udstyr. Køkkenet er fuldt udstyret — opvaskemaskine, ovn, kaffemaskine — så du kan tilberede måltider tilpasset de mindste uden at skulle spise ude hver aften.'
          ]
        },
        {
          heading: 'Aktiviteter der også passer til børn, i alle sæsoner',
          body: [
            'Om vinteren er langrendssporene, der løber gennem Livignos centrum, en roligere aktivitet end nedfartspisterne, velegnet også til børn, der møder sne for første gang. Vil man i stedet prøve alpint skiløb, ligger skiskolen kun 50 meter fra lejligheden — praktisk til timer og hurtige skift uden at skulle bruge bilen.',
            'Om sommeren tilbyder Livignos Bike Academy en rute på omkring 5 km, der er skræddersyet til begyndere og børn, mens en tur rundt om Livigno-søen kan klares af hele familien, med masser af steder til en picnic.'
          ]
        },
        {
          heading: 'Et trygt og roligt område',
          body: [
            'Lejligheden ligger 100 meter fra skiliftene og 15 minutters gang fra Livignos centrum, i en beliggenhed der er praktisk, men rolig — nem adgang til pister, skiskole og butikker til fods, uden travlheden fra et centrum fyldt med turister. Det dedikerede ski- og cykeldepot gør, at man slipper for at bære hele familiens udstyr indenfor hver aften.',
            'Og når børnene endelig sover, forbliver den private infrarøde sauna og dampbadet et rum kun for forældrene — en detalje, som mange familier ifølge de anmeldelser, vi modtager, fremhæver som en af de mest værdsatte overraskelser ved opholdet.'
          ]
        }
      ],
      highlights: [
        '3 soveværelser og 2 badeværelser, op til 6 sovepladser',
        'Barneseng og højstol tilgængelig efter ønske',
        'Skiskole 50 m væk, børnevenligt langrend i centrum',
        'Fuldt udstyret køkken til skræddersyede måltider'
      ],
      ctaText: 'Tjek ledighed for din familie',
      breadcrumbName: 'Familier i Livigno',
      navLabel: 'Familier',
      relatedLinkLabel: 'Læs den fulde guide til Livigno med børn',
      faq: [
        { q: 'Er lejligheden velegnet til små børn?', a: 'Ja: efter ønske stiller vi barneseng og højstol til rådighed, og de 3 soveværelser og 2 badeværelser giver forældre og børn plads og lidt privatliv.' },
        { q: 'Hvilke aktiviteter passer til børn i Livigno?', a: 'Om vinteren langrendssporene gennem byens centrum, om sommeren Bike Academy (cirka 5 km, bygget til begyndere) og gåture rundt om søen.' },
        { q: 'Er køkkenet udstyret til at lave mad til børn?', a: 'Ja, det er fuldt udstyret med opvaskemaskine, ovn og kaffemaskine, så man kan tilberede skræddersyede måltider uden at skulle spise ude hver aften.' }
      ]
    },
    pl: {
      title: 'Livigno z dziećmi: apartament pomyślany dla rodzin',
      metaTitle: 'Apartament dla rodzin w Livigno, do 6 osób',
      metaDescription: '3 sypialnie, 2 łazienki, łóżeczko i krzesełko na życzenie: odkryj, dlaczego Ironwood Livigno jest pomyślany dla rodzin i grup do 6 osób.',
      eyebrow: 'Rodziny w Livigno',
      intro:
        'Organizacja wakacji w Livigno z dziećmi to poszukiwanie przestrzeni, bezpieczeństwa i wygody — nie tylko dodatkowego łóżka. Ironwood Livigno powstał z myślą właśnie o tym: rodziny i grupy do 6 osób, w apartamencie, gdzie każdy ma swoją przestrzeń.',
      sections: [
        {
          heading: 'Miejsce dla wszystkich: 3 sypialnie, 2 łazienki, 90 m²',
          body: [
            'Apartament o powierzchni 90 m² obejmuje 3 sypialnie i 2 pełne łazienki — elastyczny układ, który pozwala rodzicom cieszyć się odrobiną prywatności, podczas gdy najmłodsi śpią w sąsiednim pokoju. Sypialnia małżeńska z topperem jest przeznaczona dla rodziców z grupy, a pokój z pojedynczymi łóżkami sprawdzi się dla dzieci lub starszych nastolatków.',
            'Na życzenie zapewniamy łóżeczko i krzesełko do karmienia, więc nie trzeba podróżować z nieporęcznym sprzętem. Kuchnia jest w pełni wyposażona — zmywarka, piekarnik, ekspres do kawy — dzięki czemu można przygotować posiłki dostosowane do najmłodszych, bez konieczności jedzenia na mieście co wieczór.'
          ]
        },
        {
          heading: 'Atrakcje odpowiednie także dla dzieci, w każdej porze roku',
          body: [
            'Zimą pętle narciarstwa biegowego przecinające centrum Livigno to spokojniejsza aktywność niż trasy zjazdowe, odpowiednia także dla dzieci stykających się ze śniegiem po raz pierwszy. Dla tych, którzy chcą spróbować narciarstwa alpejskiego, szkółka narciarska znajduje się zaledwie 50 metrów od apartamentu — wygodnie na lekcje i szybkie przebieranie się bez konieczności korzystania z samochodu.',
            'Latem Bike Academy w Livigno oferuje trasę o długości około 5 km, zaprojektowaną specjalnie dla początkujących i dzieci, a spacer wokół Jeziora Livigno jest dostępny dla całej rodziny, z licznymi miejscami na piknik.'
          ]
        },
        {
          heading: 'Bezpieczna i spokojna okolica',
          body: [
            'Apartament znajduje się 100 metrów od wyciągów narciarskich i 15 minut spacerem od centrum Livigno, w lokalizacji dogodnej, ale spokojnej — łatwy pieszy dostęp do stoków, szkółki narciarskiej i sklepów, bez tłoku pełnego turystów centrum. Dedykowana przechowalnia nart i rowerów pozwala uniknąć wnoszenia sprzętu całej rodziny do domu każdego wieczoru.',
            'A gdy dzieci wreszcie śpią, prywatna sauna na podczerwień i łaźnia parowa pozostają przestrzenią tylko dla rodziców — szczegół, który wielu rodzin, sądząc po otrzymywanych przez nas opiniach, wskazuje jako jedną z najbardziej docenianych niespodzianek pobytu.'
          ]
        }
      ],
      highlights: [
        '3 sypialnie i 2 łazienki, do 6 miejsc noclegowych',
        'Łóżeczko i krzesełko dostępne na życzenie',
        'Szkółka narciarska 50 m dalej, narciarstwo biegowe przyjazne dzieciom w centrum',
        'W pełni wyposażona kuchnia do przygotowania posiłków na miarę'
      ],
      ctaText: 'Sprawdź dostępność dla swojej rodziny',
      breadcrumbName: 'Rodziny w Livigno',
      navLabel: 'Rodziny',
      relatedLinkLabel: 'Przeczytaj pełny przewodnik po Livigno z dziećmi',
      faq: [
        { q: 'Czy apartament jest odpowiedni dla małych dzieci?', a: 'Tak: na życzenie zapewniamy łóżeczko i krzesełko, a 3 sypialnie i 2 łazienki dają rodzicom i dzieciom przestrzeń oraz odrobinę prywatności.' },
        { q: 'Jakie atrakcje są odpowiednie dla dzieci w Livigno?', a: 'Zimą pętle narciarstwa biegowego przez centrum miasteczka, latem Bike Academy (około 5 km, stworzona dla początkujących) oraz spacery wokół jeziora.' },
        { q: 'Czy kuchnia jest wyposażona do gotowania dla dzieci?', a: 'Tak, jest w pełni wyposażona w zmywarkę, piekarnik i ekspres do kawy, dzięki czemu można przygotować posiłki na miarę bez konieczności jedzenia na mieście co wieczór.' }
      ]
    },
    cs: {
      title: 'Livigno s dětmi: apartmán navržený pro rodiny',
      metaTitle: 'Rodinný apartmán v Livignu, až 6 osob',
      metaDescription: '3 ložnice, 2 koupelny, dětská postýlka a jídelní židlička na přání: objevte, proč je Ironwood Livigno navržen pro rodiny a skupiny až 6 osob.',
      eyebrow: 'Rodiny v Livignu',
      intro:
        'Naplánovat dovolenou v Livignu s dětmi znamená hledat prostor, bezpečí a pohodlí — nejen postel navíc. Ironwood Livigno vznikl přesně s tímto záměrem: pro rodiny a skupiny až 6 osob, v apartmánu, kde má každý svůj vlastní prostor.',
      sections: [
        {
          heading: 'Prostor pro všechny: 3 ložnice, 2 koupelny, 90 m²',
          body: [
            'Apartmán se rozkládá na 90 m² se 3 ložnicemi a 2 plnohodnotnými koupelnami — flexibilní uspořádání, které rodičům umožňuje mít trochu soukromí, zatímco nejmenší spí ve vedlejším pokoji. Manželská ložnice s topperem je určena rodičům skupiny, zatímco pokoj s oddělenými lůžky je vhodný pro děti nebo starší děti.',
            'Na přání zajistíme dětskou postýlku a jídelní židličku, takže nemusíte cestovat s objemným vybavením. Kuchyně je plně vybavená — myčka, trouba, kávovar — pro přípravu jídel na míru dětem, aniž byste museli chodit každý večer ven.'
          ]
        },
        {
          heading: 'Aktivity vhodné i pro děti, v každé sezóně',
          body: [
            'V zimě jsou okruhy pro běžecké lyžování procházející centrem Livigna klidnější aktivitou než sjezdovky, vhodnou i pro děti, které se poprvé setkávají se sněhem. Pro ty, kdo chtějí zkusit sjezdové lyžování, je lyžařská škola vzdálená pouhých 50 metrů od apartmánu — praktické pro lekce a rychlé převlékání bez nutnosti použít auto.',
            'V létě nabízí Bike Academy v Livignu trasu o délce přibližně 5 km, navrženou přímo pro začátečníky a děti, zatímco procházka kolem jezera Livigno zvládne celá rodina, s řadou míst na piknik.'
          ]
        },
        {
          heading: 'Bezpečná a klidná lokalita',
          body: [
            'Apartmán se nachází 100 metrů od lyžařských vleků a 15 minut chůze od centra Livigna, na strategickém, ale klidném místě — pohodlný pěší dosah na sjezdovky, do lyžařské školy a obchodů, bez ruchu centra plného turistů. Vyhrazená úschovna lyží a kol umožňuje vyhnout se nošení vybavení celé rodiny dovnitř každý večer.',
            'A když děti konečně usnou, soukromá infrasauna a parní lázeň zůstávají prostorem jen pro rodiče — detail, který podle recenzí, jež dostáváme, mnoho rodin uvádí jako jedno z nejoceňovanějších překvapení pobytu.'
          ]
        }
      ],
      highlights: [
        '3 ložnice a 2 koupelny, až 6 lůžek',
        'Dětská postýlka a jídelní židlička na přání',
        'Lyžařská škola 50 m daleko, běžecké lyžování vhodné pro děti v centru',
        'Plně vybavená kuchyně pro jídla na míru'
      ],
      ctaText: 'Ověřte dostupnost pro svou rodinu',
      breadcrumbName: 'Rodiny v Livignu',
      navLabel: 'Rodiny',
      relatedLinkLabel: 'Přečtěte si kompletního průvodce Livignem s dětmi',
      faq: [
        { q: 'Je apartmán vhodný pro malé děti?', a: 'Ano: na přání zajistíme dětskou postýlku a jídelní židličku a 3 ložnice a 2 koupelny poskytují rodičům i dětem prostor a trochu soukromí.' },
        { q: 'Jaké aktivity jsou vhodné pro děti v Livignu?', a: 'V zimě okruhy pro běžecké lyžování centrem městečka, v létě Bike Academy (přibližně 5 km, navržená pro začátečníky) a procházky kolem jezera.' },
        { q: 'Je kuchyně vybavená pro vaření pro děti?', a: 'Ano, je plně vybavená myčkou, troubou a kávovarem, takže lze připravit jídla na míru bez nutnosti chodit každý večer ven.' }
      ]
    },
    no: {
      title: 'Livigno med barn: leiligheten designet for familier',
      metaTitle: 'Familieleilighet i Livigno, opptil 6 personer',
      metaDescription: '3 soverom, 2 bad, barneseng og barnestol på forespørsel: oppdag hvorfor Ironwood Livigno er designet for familier og grupper på opptil 6 personer.',
      eyebrow: 'Familier i Livigno',
      intro:
        'Å planlegge en familieferie i Livigno med barn handler om å finne plass, trygghet og komfort — ikke bare en ekstra seng. Ironwood Livigno er skapt nettopp med dette for øye: familier og grupper på opptil 6 personer, i en leilighet der alle har sitt eget rom.',
      sections: [
        {
          heading: 'Plass til alle: 3 soverom, 2 bad, 90 m²',
          body: [
            'Leiligheten strekker seg over 90 m² med 3 soverom og 2 fullverdige bad — en fleksibel løsning som gir foreldrene litt privatliv mens de minste sover i rommet ved siden av. Dobbeltrommet med topmadrass er tenkt for foreldrene i gruppen, mens rommet med enkeltsenger passer for barn eller eldre ungdom.',
            'På forespørsel stiller vi barneseng og barnestol til rådighet, så du slipper å reise med tungt utstyr. Kjøkkenet er fullt utstyrt — oppvaskmaskin, stekeovn, kaffemaskin — for å lage måltider tilpasset de minste uten å måtte spise ute hver kveld.'
          ]
        },
        {
          heading: 'Aktiviteter som også passer for barn, i alle sesonger',
          body: [
            'Om vinteren er langrennsløypene som går gjennom sentrum av Livigno en roligere aktivitet enn alpinbakkene, godt egnet også for barn som møter snø for første gang. For dem som heller vil prøve alpint, ligger skiskolen bare 50 meter fra leiligheten — praktisk for timer og raske skift uten å måtte bruke bilen.',
            'Om sommeren tilbyr Livignos Bike Academy en løype på omtrent 5 km, spesielt utformet for nybegynnere og barn, mens en tur rundt Livigno-sjøen kan klares av hele familien, med mange steder for en piknik.'
          ]
        },
        {
          heading: 'Et trygt og rolig område',
          body: [
            'Leiligheten ligger 100 meter fra skiheisene og 15 minutters gange fra sentrum av Livigno, på et sted som er praktisk, men rolig — nær nok til å nå bakker, skiskole og butikker til fots, uten trengselen fra et sentrum fullt av turister. Det dedikerte ski- og sykkellageret gjør at du slipper å bære hele familiens utstyr inn hver kveld.',
            'Og når barna endelig sover, forblir den private infrarøde badstuen og dampbadet et rom bare for foreldrene — en detalj som mange familier, ifølge tilbakemeldingene vi mottar, trekker frem som en av de mest verdsatte overraskelsene ved oppholdet.'
          ]
        }
      ],
      highlights: [
        '3 soverom og 2 bad, opptil 6 sengeplasser',
        'Barneseng og barnestol tilgjengelig på forespørsel',
        'Skiskole 50 m unna, barnevennlig langrenn i sentrum',
        'Fullt utstyrt kjøkken for skreddersydde måltider'
      ],
      ctaText: 'Sjekk tilgjengelighet for din familie',
      breadcrumbName: 'Familier i Livigno',
      navLabel: 'Familier',
      relatedLinkLabel: 'Les den fullstendige guiden til Livigno med barn',
      faq: [
        { q: 'Er leiligheten egnet for små barn?', a: 'Ja: på forespørsel stiller vi barneseng og barnestol til rådighet, og de 3 soverommene og 2 badene gir foreldre og barn plass og litt privatliv.' },
        { q: 'Hvilke aktiviteter passer for barn i Livigno?', a: 'Om vinteren langrennsløypene gjennom sentrum, om sommeren Bike Academy (omtrent 5 km, laget for nybegynnere) og turer rundt sjøen.' },
        { q: 'Er kjøkkenet utstyrt for å lage mat til barn?', a: 'Ja, det er fullt utstyrt med oppvaskmaskin, stekeovn og kaffemaskin, for å lage skreddersydde måltider uten å måtte spise ute hver kveld.' }
      ]
    },
    nl: {
      title: 'Livigno met kinderen: het appartement ontworpen voor gezinnen',
      metaTitle: 'Gezinsappartement in Livigno, tot 6 personen',
      metaDescription: '3 slaapkamers, 2 badkamers, kinderbedje en kinderstoel op aanvraag: ontdek waarom Ironwood Livigno is ontworpen voor gezinnen en groepen tot 6 personen.',
      eyebrow: 'Gezinnen in Livigno',
      intro:
        'Een gezinsvakantie in Livigno met kinderen plannen betekent op zoek gaan naar ruimte, veiligheid en comfort — niet zomaar een extra bed. Ironwood Livigno is precies daarvoor ontworpen: gezinnen en groepen tot 6 personen, in een appartement waar iedereen zijn eigen ruimte heeft.',
      sections: [
        {
          heading: 'Ruimte voor iedereen: 3 slaapkamers, 2 badkamers, 90 m²',
          body: [
            'Het appartement beslaat 90 m² met 3 slaapkamers en 2 volledige badkamers, een flexibele indeling waarmee ouders wat privacy hebben terwijl de kleintjes in de kamer ernaast slapen. De tweepersoonskamer met topper is bedoeld voor de ouders van de groep, terwijl de kamer met eenpersoonsbedden geschikt is voor kinderen of oudere kids.',
            'Op aanvraag zorgen we voor een kinderbedje en kinderstoel, zodat je niet met omvangrijke uitrusting hoeft te reizen. De keuken is volledig uitgerust — vaatwasser, oven, koffiemachine — om maaltijden op maat van de kleintjes te bereiden zonder elke avond buitenshuis te hoeven eten.'
          ]
        },
        {
          heading: 'Activiteiten die ook voor kinderen geschikt zijn, in elk seizoen',
          body: [
            'In de winter zijn de langlaufroutes die door het centrum van Livigno lopen een rustigere activiteit dan de afdalingspiste, geschikt ook voor kinderen die voor het eerst met sneeuw kennismaken. Voor wie liever alpineskiën wil proberen: de skischool ligt op slechts 50 meter van het appartement — handig voor lessen en snel omkleden zonder de auto te hoeven gebruiken.',
            'In de zomer biedt de Bike Academy van Livigno een route van ongeveer 5 km die speciaal is ontworpen voor beginners en kinderen, terwijl een wandeling rond het Meer van Livigno haalbaar is voor het hele gezin, met veel plekjes voor een picknick.'
          ]
        },
        {
          heading: 'Een veilige, rustige omgeving',
          body: [
            'Het appartement ligt 100 meter van de skiliften en op 15 minuten lopen van het centrum van Livigno, op een plek die praktisch maar rustig is — dichtbij genoeg om piste, skischool en winkels te voet te bereiken, zonder de drukte van een centrum vol toeristen. De eigen ski- en fietsberging voorkomt dat je elke avond de uitrusting van het hele gezin naar binnen moet dragen.',
            'En als de kinderen eindelijk slapen, blijven de privé infraroodsauna en het stoombad een ruimte enkel voor de ouders — een detail dat, blijkens de recensies die we ontvangen, veel gezinnen aanwijzen als een van de meest gewaardeerde verrassingen van het verblijf.'
          ]
        }
      ],
      highlights: [
        '3 slaapkamers en 2 badkamers, tot 6 slaapplaatsen',
        'Kinderbedje en kinderstoel beschikbaar op aanvraag',
        'Skischool op 50 m, kindvriendelijk langlaufen in het centrum',
        'Volledig uitgeruste keuken voor maaltijden op maat'
      ],
      ctaText: 'Check de beschikbaarheid voor jouw gezin',
      breadcrumbName: 'Gezinnen in Livigno',
      navLabel: 'Gezinnen',
      relatedLinkLabel: 'Lees de volledige gids over Livigno met kinderen',
      faq: [
        { q: 'Is het appartement geschikt voor kleine kinderen?', a: 'Ja: op aanvraag zorgen we voor een kinderbedje en kinderstoel, en de 3 slaapkamers en 2 badkamers geven ouders en kinderen ruimte en wat privacy.' },
        { q: 'Welke activiteiten zijn geschikt voor kinderen in Livigno?', a: 'In de winter de langlaufroutes door het centrum, in de zomer de Bike Academy (ongeveer 5 km, ontworpen voor beginners) en wandelingen rond het meer.' },
        { q: 'Is de keuken uitgerust om voor kinderen te koken?', a: 'Ja, ze is volledig uitgerust met vaatwasser, oven en koffiemachine, om maaltijden op maat te bereiden zonder elke avond buitenshuis te hoeven eten.' }
      ]
    },
    zh: {
      title: '带孩子游利维尼奥:专为家庭设计的公寓',
      metaTitle: '利维尼奥家庭公寓 | 可住6人,提供婴儿床与餐椅',
      metaDescription: '3间卧室、2间浴室,婴儿床和餐椅可应要求提供:了解为什么Ironwood Livigno专为家庭及最多6人的团体而设计。',
      eyebrow: '利维尼奥的家庭',
      intro:
        '带孩子在利维尼奥安排一次假期,意味着需要空间、安全和舒适——而不仅仅是多一张床。Ironwood Livigno正是为此而生:适合家庭及最多6人的团体,让每个人在公寓里都拥有属于自己的空间。',
      sections: [
        {
          heading: '人人都有空间:3间卧室、2间浴室、90平方米',
          body: [
            '公寓面积达90平方米,拥有3间卧室和2间独立浴室,灵活的布局让父母在孩子们于隔壁房间入睡时也能拥有一些私人空间。带加厚床垫的双人卧室专为团体中的父母设计,而单人床卧室则适合儿童或年纪较大的孩子。',
            '应要求我们提供婴儿床和餐椅,因此无需携带笨重的装备出行。厨房设备齐全——洗碗机、烤箱、咖啡机——可以为孩子们准备量身定制的餐点,无需每晚外出就餐。'
          ]
        },
        {
          heading: '四季皆宜的亲子活动',
          body: [
            '冬季,穿过利维尼奥中心的越野滑雪环线是比高山滑雪更轻松的活动,也适合第一次接触雪的孩子。若想尝试高山滑雪,滑雪学校距公寓仅50米——便于上课和快速更换装备,无需动用汽车。',
            '夏季,利维尼奥的自行车学院提供一条约5公里、专为初学者和儿童设计的路线,而环绕利维尼奥湖的散步路线也适合全家出行,沿途还有许多野餐地点。'
          ]
        },
        {
          heading: '安全又宁静的区域',
          body: [
            '公寓距滑雪缆车100米,距利维尼奥中心步行仅15分钟,地理位置既便利又安静——步行即可抵达雪道、滑雪学校和商店,又不必置身于游客熙攘的中心地带。专用的滑雪与自行车储藏室,让您无需每晚将全家的装备都搬进屋内。',
            '当孩子们终于入睡后,私人红外线桑拿和土耳其蒸汽浴便成为专属于父母的空间——从我们收到的评价来看,许多家庭都将这一细节视为入住期间最受欢迎的惊喜之一。'
          ]
        }
      ],
      highlights: [
        '3间卧室、2间浴室,最多可住6人',
        '婴儿床和餐椅可应要求提供',
        '滑雪学校距离50米,市中心设有适合儿童的越野滑雪道',
        '设备齐全的厨房,可准备量身定制的餐点'
      ],
      ctaText: '查询您家庭入住的空房情况',
      breadcrumbName: '利维尼奥的家庭',
      navLabel: '家庭',
      relatedLinkLabel: '阅读带孩子游利维尼奥完整指南',
      faq: [
        { q: '公寓适合小孩子入住吗?', a: '适合:应要求我们提供婴儿床和餐椅,3间卧室和2间浴室为父母和孩子提供了空间和一定的私密性。' },
        { q: '利维尼奥有哪些适合儿童的活动?', a: '冬季有穿过镇中心的越野滑雪环线,夏季有专为初学者设计的自行车学院路线(约5公里)以及环湖散步。' },
        { q: '厨房是否配备了适合给孩子做饭的设施?', a: '是的,厨房设备齐全,配有洗碗机、烤箱和咖啡机,可以准备量身定制的餐点,无需每晚外出就餐。' }
      ]
    },
    ja: {
      title: '子連れのリヴィニョ:ファミリーのために考え抜かれたアパートメント',
      metaTitle: 'リヴィニョのファミリー向けアパートメント | 最大6名、ベビーベッド・チェア対応',
      metaDescription: '3ベッドルーム、2バスルーム、ご要望に応じてベビーベッドとハイチェアもご用意。Ironwood Livignoが最大6名のご家族・グループのために設計されている理由をご紹介します。',
      eyebrow: 'リヴィニョのファミリー',
      intro:
        '子供連れでリヴィニョへの旅行を計画するということは、単にベッドが1つ多いだけでなく、広さ、安全性、快適さを求めるということです。Ironwood Livignoはまさにそのために生まれました。最大6名のご家族・グループが、それぞれ自分の空間を持てるアパートメントです。',
      sections: [
        {
          heading: '全員分のスペース:3ベッドルーム、2バスルーム、90㎡',
          body: [
            'アパートメントは90㎡の広さに3つのベッドルームと2つの完全なバスルームを備えており、隣の部屋で小さなお子様が眠っている間、ご両親も少しプライバシーを保てる柔軟なレイアウトになっています。トッパー付きのダブルベッドルームはグループのご両親向け、ツインベッドルームはお子様や年上のお子様に適しています。',
            'ご要望に応じてベビーベッドとハイチェアをご用意しますので、かさばる荷物を持参する必要はありません。キッチンには食洗機、オーブン、コーヒーマシンなどが完備されており、毎晩外食することなく、お子様に合わせた食事を用意できます。'
          ]
        },
        {
          heading: '季節を問わず、子供も楽しめるアクティビティ',
          body: [
            '冬は、リヴィニョの中心部を通るクロスカントリースキーコースが、ダウンヒルのゲレンデよりも穏やかなアクティビティで、初めて雪に触れるお子様にも適しています。アルペンスキーに挑戦したい方には、アパートメントからわずか50mのスキースクールが便利です。車を使わずにレッスンや素早い着替えができます。',
            '夏は、リヴィニョのBike Academyが初心者やお子様向けに設計された約5kmのコースを提供しており、リヴィニョ湖を一周する散策コースはご家族全員で楽しめ、ピクニックに適した場所も点在しています。'
          ]
        },
        {
          heading: '安全で静かなエリア',
          body: [
            'アパートメントはスキーリフトから100m、リヴィニョ中心部から徒歩15分の場所にあり、便利でありながら静かな立地です。観光客で賑わう中心部の喧騒とは無縁に、ゲレンデやスキースクール、お店へ徒歩で行くことができます。専用のスキー・自転車収納スペースがあるため、毎晩ご家族全員分の道具を室内に運び込む必要もありません。',
            'そして、お子様がようやく眠りについた後は、専用の赤外線サウナとスチームバスがご両親だけの空間になります。いただくレビューによると、多くのご家族がこれを滞在中最も嬉しいサプライズの一つとして挙げています。'
          ]
        }
      ],
      highlights: [
        '3ベッドルーム・2バスルーム、最大6名まで宿泊可能',
        'ご要望に応じてベビーベッド・ハイチェアをご用意',
        'スキースクールまで50m、市街地には子供向けクロスカントリーコースも',
        '食事を自由に用意できる設備完備のキッチン'
      ],
      ctaText: 'ご家族でのご滞在、空室状況を確認する',
      breadcrumbName: 'リヴィニョのファミリー',
      navLabel: 'ファミリー',
      relatedLinkLabel: '子連れのリヴィニョ完全ガイドを読む',
      faq: [
        { q: '小さなお子様でも利用できますか?', a: 'はい。ご要望に応じてベビーベッドとハイチェアをご用意しており、3ベッドルーム・2バスルームでご両親とお子様それぞれにスペースとプライバシーを確保できます。' },
        { q: 'リヴィニョで子供に適したアクティビティはありますか?', a: '冬は町の中心部を通るクロスカントリースキーコース、夏は初心者向けに作られた約5kmのBike Academyのコースや湖の周りの散策がおすすめです。' },
        { q: 'キッチンは子供のための調理に対応していますか?', a: 'はい、食洗機、オーブン、コーヒーマシンを完備しており、毎晩外食することなくお子様に合わせた食事を用意できます。' }
      ]
    }
  },
  'come-arrivare': {
    en: {
      title: 'How to reach Ironwood Livigno: address, parking, and the final stretch',
      metaTitle: 'How to Get to Ironwood Livigno | Address and Parking',
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
      relatedLinkLabel: 'Read the full guide: train, car or plane from Milan',
      faq: [
        { q: 'What is the exact address of Ironwood Livigno?', a: 'Via Saroch 771, 23041 Livigno (SO) — GPS coordinates 46.525061, 10.126967.' },
        { q: 'Is parking included?', a: 'Yes, the apartment includes a free parking space.' },
        { q: 'How do you reach Livigno by car or train?', a: 'By car from Milan, take the SS38 to the Foscagno Pass (from Switzerland, take the Forcola di Livigno instead); by train, get off at Tirano and continue with a scheduled bus, changing at Bormio.' }
      ]
    },
    'en-us': {
      title: 'How to reach Ironwood Livigno, Italy: address, parking, and the final stretch',
      metaTitle: 'How to Get to Ironwood Livigno, Italy | Address and Parking',
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
      relatedLinkLabel: 'Read the full guide: train, car or plane from Milan',
      faq: [
        { q: 'What is the exact address of Ironwood Livigno, Italy?', a: 'Via Saroch 771, 23041 Livigno (SO), Italy — GPS coordinates 46.525061, 10.126967.' },
        { q: 'Is parking included?', a: 'Yes, the apartment includes a free parking space.' },
        { q: 'How do you get to Livigno by car or train?', a: 'By car from Milan, take the SS38 to the Foscagno Pass (from Switzerland, take the Forcola di Livigno instead); by train, get off at Tirano and continue with a scheduled bus, changing at Bormio.' }
      ]
    },
    de: {
      title: 'So erreichen Sie Ironwood Livigno: Adresse, Parkplatz und die letzten Kilometer',
      metaTitle: 'Anreise zu Ironwood Livigno | Adresse und Parkplatz',
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
      relatedLinkLabel: 'Lesen Sie den vollständigen Guide: Zug, Auto oder Flugzeug ab Mailand',
      faq: [
        { q: 'Wie lautet die genaue Adresse von Ironwood Livigno?', a: 'Via Saroch 771, 23041 Livigno (SO) — GPS-Koordinaten 46.525061, 10.126967.' },
        { q: 'Ist ein Parkplatz inklusive?', a: 'Ja, zur Wohnung gehört ein kostenloser Parkplatz.' },
        { q: 'Wie erreicht man Livigno mit dem Auto oder mit dem Zug?', a: 'Mit dem Auto von Mailand aus über die SS38 zum Passo di Foscagno (aus der Schweiz stattdessen über die Forcola di Livigno); mit dem Zug bis Tirano und weiter mit dem Linienbus, Umstieg in Bormio.' }
      ]
    },
    fr: {
      title: 'Comment rejoindre Ironwood Livigno : adresse, parking et derniers kilomètres',
      metaTitle: 'Comment venir à Ironwood Livigno | Adresse et parking',
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
      relatedLinkLabel: 'Lisez le guide complet : train, voiture ou avion depuis Milan',
      faq: [
        { q: "Quelle est l'adresse exacte d'Ironwood Livigno ?", a: 'Via Saroch 771, 23041 Livigno (SO) — coordonnées GPS 46.525061, 10.126967.' },
        { q: 'Le parking est-il inclus ?', a: 'Oui, l\'appartement inclut une place de parking gratuite.' },
        { q: 'Comment rejoindre Livigno en voiture ou en train ?', a: 'En voiture depuis Milan, prenez la SS38 jusqu\'au col de Foscagno (depuis la Suisse, passez plutôt par la Forcola di Livigno) ; en train, descendez à Tirano puis continuez en bus de ligne, avec correspondance à Bormio.' }
      ]
    },
    da: {
      title: 'Sådan kommer du til Ironwood Livigno: adresse, parkering og de sidste kilometer',
      metaTitle: 'Sådan kommer du til Ironwood Livigno | Adresse og parkering',
      metaDescription: 'Adresse, gratis parkering og afstand til liftene: den praktiske guide til at komme til Ironwood Livigno, Via Saroch 771, uden overraskelser.',
      eyebrow: 'Sådan kommer du hertil',
      intro:
        'Har du allerede besluttet dig for at bo hos Ironwood Livigno, samler denne side de praktiske oplysninger om den sidste del af rejsen: hvor lejligheden præcis ligger, hvordan du når frem fra Foscagno-passet eller fra Tirano, og hvad du skal vide om parkering og ankomst. For den fulde guide til tog, bil eller fly fra Milano finder du alle detaljer i vores dedikerede artikel, linket nederst på denne side.',
      sections: [
        {
          heading: 'Adresse og præcis beliggenhed',
          body: [
            'Ironwood Livigno ligger på Via Saroch 771, 23041 Livigno (SO), cirka 100 meter til fods fra skiliftene og 50 meter fra skiskole og udstyrsudlejning. Det er en beliggenhed, der er praktisk, men rolig, cirka 15 minutters gang fra byens centrum — nem adgang til pister, butikker og restauranter til fods, når du først er ankommet.',
            'De præcise GPS-koordinater er 46.525061, 10.126967: nyttige at indtaste i navigationssystemet, især på de sidste bjergkilometer, hvor mobildækningen kan være mindre pålidelig.'
          ]
        },
        {
          heading: 'Den sidste strækning, fra Tirano eller den schweiziske grænse',
          body: [
            'Rejsende med tog stiger af på Tirano station og fortsætter med rutebus (skift i Bormio) til Livigno. Rejsende med bil fra Milano kører ad SS38 mod Bormio og derefter Foscagno-passet; rejsende fra Schweiz tager i stedet Forcola di Livigno. Om vinteren bør du tjekke passets forhold, inden du kører: ved kraftigt snefald kan der kræves kæder eller vinterdæk, og i sjældne tilfælde kan passet lukke midlertidigt.',
            'Når du er i byen, følg skiltene mod Via Saroch, i området med skiliftene: lejligheden er let at genkende med sin træfacade, typisk for områdets alpine stil.'
          ]
        },
        {
          heading: 'Parkering og ankomst til lejligheden',
          body: [
            'Lejligheden inkluderer en gratis parkeringsplads, så det er ikke nødvendigt at lede efter betalt parkering i byen. Check-in- og check-out-tider bekræftes ved booking via WhatsApp, med en vis fleksibilitet afhængigt af ledighed — praktisk for dem, der ankommer efter en lang rejse eller med tog-/bustider, der ikke altid er præcise.',
            'Ved eventuelle spørgsmål om den sidste del af rejsen er den hurtigste måde at kontakte os på WhatsApp: vi svarer med præcise anvisninger og, hvis nødvendigt, billeder af indgangen, så du straks kan genkende bygningen.'
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — 100 m fra skiliftene',
        'Gratis parkeringsplads inkluderet',
        'GPS-koordinater: 46.525061, 10.126967',
        'Fleksibel check-in, bekræftet via WhatsApp'
      ],
      ctaText: 'Skriv til os på WhatsApp for ankomstvejledning',
      breadcrumbName: 'Sådan kommer du hertil',
      navLabel: 'Sådan kommer du hertil',
      relatedLinkLabel: 'Læs den fulde guide: tog, bil eller fly fra Milano',
      faq: [
        { q: 'Hvad er den præcise adresse på Ironwood Livigno?', a: 'Via Saroch 771, 23041 Livigno (SO) — GPS-koordinater 46.525061, 10.126967.' },
        { q: 'Er parkering inkluderet?', a: 'Ja, lejligheden inkluderer en gratis parkeringsplads.' },
        { q: 'Hvordan kommer man til Livigno med bil eller tog?', a: 'Med bil fra Milano ad SS38 til Foscagno-passet (fra Schweiz tages i stedet Forcola di Livigno); med tog til Tirano og videre med rutebus, med skift i Bormio.' }
      ]
    },
    pl: {
      title: 'Jak dojechać do Ironwood Livigno: adres, parking i ostatnie kilometry',
      metaTitle: 'Jak dojechać do Ironwood Livigno | Adres i parking',
      metaDescription: 'Adres, bezpłatny parking i odległość od wyciągów: praktyczny przewodnik dojazdu do Ironwood Livigno, via Saroch 771, bez niespodzianek.',
      eyebrow: 'Jak dojechać',
      intro:
        'Jeśli już zdecydowałeś się na pobyt w Ironwood Livigno, na tej stronie znajdziesz praktyczne informacje o ostatnim odcinku podróży: gdzie dokładnie znajduje się apartament, jak do niego dotrzeć z Przełęczy Foscagno lub z Tirano, oraz co warto wiedzieć o parkingu i przyjeździe. Pełny przewodnik dotyczący pociągu, samochodu i samolotu z Mediolanu znajdziesz w naszym dedykowanym artykule, do którego link znajduje się na dole tej strony.',
      sections: [
        {
          heading: 'Adres i dokładna lokalizacja',
          body: [
            'Ironwood Livigno znajduje się przy via Saroch 771, 23041 Livigno (SO), około 100 metrów pieszo od wyciągów narciarskich i 50 metrów od szkółki narciarskiej i wypożyczalni sprzętu. To lokalizacja dogodna, ale spokojna, około 15 minut spacerem od centrum miasteczka — wygodna do dotarcia pieszo do stoków, sklepów i restauracji po przyjeździe.',
            'Dokładne współrzędne GPS to 46.525061, 10.126967: warto wpisać je do nawigacji, zwłaszcza na ostatnich górskich kilometrach, gdzie zasięg sieci może być mniej pewny.'
          ]
        },
        {
          heading: 'Ostatni odcinek, z Tirano lub od granicy szwajcarskiej',
          body: [
            'Podróżujący pociągiem wysiadają na stacji w Tirano i kontynuują podróż autobusem rejsowym (przesiadka w Bormio) do Livigno. Podróżujący samochodem z Mediolanu jadą drogą SS38 w kierunku Bormio, a następnie przez Przełęcz Foscagno; przyjeżdżający ze Szwajcarii korzystają natomiast z przełęczy Forcola di Livigno. Zimą sprawdź warunki na przełęczy przed wyjazdem: przy obfitych opadach śniegu mogą być wymagane łańcuchy lub opony zimowe, a w rzadkich przypadkach przełęcz może zostać tymczasowo zamknięta.',
            'Po dotarciu do miasteczka podążaj za oznaczeniami do via Saroch, w okolicy wyciągów narciarskich: apartament łatwo rozpoznać po drewnianej elewacji typowej dla alpejskiego stylu regionu.'
          ]
        },
        {
          heading: 'Parking i przyjazd do apartamentu',
          body: [
            'Apartament obejmuje bezpłatne miejsce parkingowe, więc nie trzeba szukać płatnego parkingu w miasteczku. Godziny zameldowania i wymeldowania są potwierdzane przy rezerwacji przez WhatsApp, z pewną elastycznością w zależności od dostępności — wygodne dla osób przyjeżdżających po długiej podróży lub z niezawsze punktualnymi połączeniami pociągów/autobusów.',
            'W razie jakichkolwiek wątpliwości dotyczących ostatniego odcinka podróży najszybszym sposobem kontaktu jest WhatsApp: odpowiadamy z dokładnymi wskazówkami, a w razie potrzeby przesyłamy zdjęcia wejścia, aby od razu rozpoznać budynek.'
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — 100 m od wyciągów narciarskich',
        'Bezpłatne miejsce parkingowe w cenie',
        'Współrzędne GPS: 46.525061, 10.126967',
        'Elastyczne zameldowanie, potwierdzane przez WhatsApp'
      ],
      ctaText: 'Napisz do nas na WhatsApp po wskazówki dojazdu',
      breadcrumbName: 'Jak dojechać',
      navLabel: 'Jak dojechać',
      relatedLinkLabel: 'Przeczytaj pełny przewodnik: pociąg, samochód lub samolot z Mediolanu',
      faq: [
        { q: 'Jaki jest dokładny adres Ironwood Livigno?', a: 'Via Saroch 771, 23041 Livigno (SO) — współrzędne GPS 46.525061, 10.126967.' },
        { q: 'Czy parking jest wliczony w cenę?', a: 'Tak, apartament obejmuje bezpłatne miejsce parkingowe.' },
        { q: 'Jak dojechać do Livigno samochodem lub pociągiem?', a: 'Samochodem z Mediolanu przez SS38 do Przełęczy Foscagno (ze Szwajcarii przez przełęcz Forcola di Livigno); pociągiem do Tirano, a następnie autobusem rejsowym z przesiadką w Bormio.' }
      ]
    },
    cs: {
      title: 'Jak se dostat do Ironwood Livigno: adresa, parkování a poslední kilometry',
      metaTitle: 'Jak se dostat do Ironwood Livigno | Adresa a parkování',
      metaDescription: 'Adresa, bezplatné parkování a vzdálenost od vleků: praktický průvodce cestou do Ironwood Livigno, Via Saroch 771, bez překvapení.',
      eyebrow: 'Jak se k nám dostat',
      intro:
        'Pokud jste se již rozhodli pro pobyt v Ironwood Livigno, tato stránka shromažďuje praktické informace o posledním úseku cesty: kde přesně se apartmán nachází, jak se k němu dostat z průsmyku Foscagno nebo z Tirana, a co je třeba vědět o parkování a příjezdu. Kompletního průvodce vlakem, autem nebo letadlem z Milána najdete v našem samostatném článku, na který odkazujeme na konci této stránky.',
      sections: [
        {
          heading: 'Adresa a přesná poloha',
          body: [
            'Ironwood Livigno se nachází na adrese Via Saroch 771, 23041 Livigno (SO), přibližně 100 metrů pěšky od lyžařských vleků a 50 metrů od lyžařské školy a půjčovny vybavení. Jde o strategickou, ale klidnou polohu, přibližně 15 minut chůze od centra městečka — pohodlný pěší dosah na sjezdovky, do obchodů a restaurací po příjezdu.',
            'Přesné GPS souřadnice jsou 46.525061, 10.126967: užitečné zadat do navigace, zejména na posledních horských kilometrech, kde může být pokrytí sítě méně spolehlivé.'
          ]
        },
        {
          heading: 'Poslední úsek, z Tirana nebo od švýcarské hranice',
          body: [
            'Kdo přijíždí vlakem, vystoupí na nádraží v Tiranu a pokračuje linkovým autobusem (přestup v Bormiu) do Livigna. Kdo přijíždí autem z Milána, jede po silnici SS38 směrem na Bormio a poté přes průsmyk Foscagno; kdo přijíždí ze Švýcarska, volí naopak Forcolu di Livigno. V zimě si před odjezdem ověřte stav průsmyku: při silném sněžení mohou být potřeba řetězy nebo zimní pneumatiky, a ve vzácných případech může být průsmyk dočasně uzavřen.',
            'Jakmile dorazíte do městečka, řiďte se značením k Via Saroch, v oblasti lyžařských vleků: apartmán snadno poznáte podle dřevěné fasády typické pro alpský styl regionu.'
          ]
        },
        {
          heading: 'Parkování a příjezd do apartmánu',
          body: [
            'Apartmán zahrnuje bezplatné parkovací místo, takže není třeba hledat placené parkování v městečku. Časy check-inu a check-outu jsou potvrzeny při rezervaci přes WhatsApp, s určitou flexibilitou v závislosti na dostupnosti — praktické pro ty, kdo přijíždějí po dlouhé cestě nebo s ne vždy přesnými časy vlaků/autobusů.',
            'V případě jakýchkoli otázek k poslednímu úseku cesty je nejrychlejším způsobem kontaktu WhatsApp: odpovídáme s přesnými pokyny a v případě potřeby i s fotkami vchodu, abyste budovu ihned poznali.'
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — 100 m od lyžařských vleků',
        'Bezplatné parkovací místo v ceně',
        'GPS souřadnice: 46.525061, 10.126967',
        'Flexibilní check-in, potvrzený přes WhatsApp'
      ],
      ctaText: 'Napište nám na WhatsApp pro pokyny k příjezdu',
      breadcrumbName: 'Jak se k nám dostat',
      navLabel: 'Jak se k nám dostat',
      relatedLinkLabel: 'Přečtěte si kompletního průvodce: vlak, auto nebo letadlo z Milána',
      faq: [
        { q: 'Jaká je přesná adresa Ironwood Livigno?', a: 'Via Saroch 771, 23041 Livigno (SO) — GPS souřadnice 46.525061, 10.126967.' },
        { q: 'Je parkování součástí pobytu?', a: 'Ano, apartmán zahrnuje bezplatné parkovací místo.' },
        { q: 'Jak se dostat do Livigna autem nebo vlakem?', a: 'Autem z Milána po silnici SS38 k průsmyku Foscagno (ze Švýcarska přes Forcolu di Livigno); vlakem do Tirana a dále linkovým autobusem s přestupem v Bormiu.' }
      ]
    },
    no: {
      title: 'Slik kommer du til Ironwood Livigno: adresse, parkering og de siste kilometerne',
      metaTitle: 'Slik kommer du til Ironwood Livigno | Adresse og parkering',
      metaDescription: 'Adresse, gratis parkering og avstand til heisene: den praktiske guiden til å komme til Ironwood Livigno, Via Saroch 771, uten overraskelser.',
      eyebrow: 'Slik kommer du hit',
      intro:
        'Har du allerede bestemt deg for å bo hos Ironwood Livigno, samler denne siden praktisk informasjon om den siste delen av reisen: nøyaktig hvor leiligheten ligger, hvordan du kommer dit fra Foscagno-passet eller fra Tirano, og hva du bør vite om parkering og ankomst. For den fullstendige guiden til tog, bil eller fly fra Milano finner du alle detaljer i vår egen artikkel, lenket nederst på denne siden.',
      sections: [
        {
          heading: 'Adresse og nøyaktig beliggenhet',
          body: [
            'Ironwood Livigno ligger på Via Saroch 771, 23041 Livigno (SO), omtrent 100 meter til fots fra skiheisene og 50 meter fra skiskole og utstyrsutleie. Det er en beliggenhet som er praktisk, men rolig, omtrent 15 minutters gange fra sentrum av byen — nær nok til å nå bakker, butikker og restauranter til fots når du først har ankommet.',
            'De nøyaktige GPS-koordinatene er 46.525061, 10.126967: nyttige å taste inn i navigasjonen, spesielt på de siste fjellkilometerne der mobildekningen kan være mindre pålitelig.'
          ]
        },
        {
          heading: 'Den siste strekningen, fra Tirano eller den sveitsiske grensen',
          body: [
            'De som kommer med tog, går av på Tirano stasjon og fortsetter med rutebuss (bytte i Bormio) til Livigno. De som kommer med bil fra Milano, kjører SS38 mot Bormio og deretter Foscagno-passet; de som kommer fra Sveits, tar i stedet Forcola di Livigno. Om vinteren bør du sjekke passforholdene før du drar: ved kraftig snøfall kan det kreves kjettinger eller vinterdekk, og i sjeldne tilfeller kan passet stenge midlertidig.',
            'Når du er i byen, følg skiltingen mot Via Saroch, i området rundt skiheisene: leiligheten er lett å kjenne igjen, med trefasaden som er typisk for områdets alpine stil.'
          ]
        },
        {
          heading: 'Parkering og ankomst til leiligheten',
          body: [
            'Leiligheten inkluderer en gratis parkeringsplass, så det er ikke nødvendig å lete etter betalt parkering i byen. Innsjekkings- og utsjekkingstider bekreftes ved booking via WhatsApp, med en viss fleksibilitet avhengig av tilgjengelighet — praktisk for dem som ankommer etter en lang reise eller med tog-/busstider som ikke alltid er presise.',
            'Ved spørsmål om den siste delen av reisen er den raskeste måten å nå oss på WhatsApp: vi svarer med presise anvisninger og, om nødvendig, bilder av inngangen slik at du straks kjenner igjen bygningen.'
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — 100 m fra skiheisene',
        'Gratis parkeringsplass inkludert',
        'GPS-koordinater: 46.525061, 10.126967',
        'Fleksibel innsjekking, bekreftet via WhatsApp'
      ],
      ctaText: 'Skriv til oss på WhatsApp for veibeskrivelse',
      breadcrumbName: 'Slik kommer du hit',
      navLabel: 'Slik kommer du hit',
      relatedLinkLabel: 'Les den fullstendige guiden: tog, bil eller fly fra Milano',
      faq: [
        { q: 'Hva er den nøyaktige adressen til Ironwood Livigno?', a: 'Via Saroch 771, 23041 Livigno (SO) — GPS-koordinater 46.525061, 10.126967.' },
        { q: 'Er parkering inkludert?', a: 'Ja, leiligheten inkluderer en gratis parkeringsplass.' },
        { q: 'Hvordan kommer man til Livigno med bil eller tog?', a: 'Med bil fra Milano via SS38 til Foscagno-passet (fra Sveits tar man i stedet Forcola di Livigno); med tog til Tirano og videre med rutebuss, med bytte i Bormio.' }
      ]
    },
    nl: {
      title: 'Zo bereik je Ironwood Livigno: adres, parkeren en de laatste kilometers',
      metaTitle: 'Zo kom je bij Ironwood Livigno | Adres en parkeren',
      metaDescription: 'Adres, gratis parkeren en afstand tot de liften: de praktische gids om Ironwood Livigno, Via Saroch 771, zonder verrassingen te bereiken.',
      eyebrow: 'Hoe je hier komt',
      intro:
        'Heb je al besloten om bij Ironwood Livigno te verblijven? Deze pagina bundelt de praktische informatie over het laatste stuk van de reis: waar het appartement precies ligt, hoe je er komt vanaf de Foscagno-pas of vanuit Tirano, en wat je moet weten over parkeren en aankomst. Voor de volledige gids over trein, auto of vliegtuig vanuit Milaan vind je alle details in ons speciale artikel, gelinkt onderaan deze pagina.',
      sections: [
        {
          heading: 'Adres en exacte locatie',
          body: [
            'Ironwood Livigno bevindt zich aan de Via Saroch 771, 23041 Livigno (SO), ongeveer 100 meter lopen van de skiliften en 50 meter van de skischool en verhuur van uitrusting. Het is een locatie die praktisch maar rustig is, ongeveer 15 minuten lopen van het centrum van het dorp — handig om eenmaal aangekomen te voet naar piste, winkels en restaurants te gaan.',
            'De exacte GPS-coördinaten zijn 46.525061, 10.126967: handig om in te voeren in de navigatie, vooral op de laatste bergkilometers waar het mobiele netwerk minder betrouwbaar kan zijn.'
          ]
        },
        {
          heading: 'Het laatste stuk, vanaf Tirano of de Zwitserse grens',
          body: [
            'Wie met de trein komt, stapt uit bij station Tirano en reist verder met een lijnbus (overstap in Bormio) naar Livigno. Wie met de auto vanuit Milaan komt, neemt de SS38 richting Bormio en vervolgens de Foscagno-pas; wie vanuit Zwitserland komt, neemt in plaats daarvan de Forcola di Livigno. Controleer in de winter vóór vertrek de omstandigheden op de pas: bij zware sneeuwval kunnen kettingen of winterbanden nodig zijn, en in zeldzame gevallen kan de pas tijdelijk gesloten zijn.',
            'Volg eenmaal in het dorp de bewegwijzering naar Via Saroch, in de buurt van de skiliften: het appartement is gemakkelijk te herkennen aan de houten gevel die typisch is voor de alpiene stijl van de streek.'
          ]
        },
        {
          heading: 'Parkeren en aankomst bij het appartement',
          body: [
            'Bij het appartement hoort een gratis parkeerplaats, dus je hoeft in het dorp niet naar betaald parkeren te zoeken. Check-in- en check-outtijden worden bij de boeking via WhatsApp bevestigd, met enige flexibiliteit afhankelijk van beschikbaarheid — handig als je aankomt na een lange reis of met trein-/bustijden die niet altijd op schema lopen.',
            "Voor vragen over het laatste stuk van de reis is WhatsApp de snelste manier om ons te bereiken: we reageren met precieze aanwijzingen en, indien nodig, foto's van de ingang zodat je het gebouw meteen herkent."
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — 100 m van de skiliften',
        'Gratis parkeerplaats inbegrepen',
        'GPS-coördinaten: 46.525061, 10.126967',
        'Flexibele check-in, bevestigd via WhatsApp'
      ],
      ctaText: 'Stuur ons een bericht op WhatsApp voor route-aanwijzingen',
      breadcrumbName: 'Hoe je hier komt',
      navLabel: 'Hoe je hier komt',
      relatedLinkLabel: 'Lees de volledige gids: trein, auto of vliegtuig vanuit Milaan',
      faq: [
        { q: 'Wat is het exacte adres van Ironwood Livigno?', a: 'Via Saroch 771, 23041 Livigno (SO) — GPS-coördinaten 46.525061, 10.126967.' },
        { q: 'Is parkeren inbegrepen?', a: 'Ja, bij het appartement hoort een gratis parkeerplaats.' },
        { q: 'Hoe bereik je Livigno met de auto of trein?', a: 'Met de auto vanuit Milaan via de SS38 naar de Foscagno-pas (vanuit Zwitserland neem je in plaats daarvan de Forcola di Livigno); met de trein tot Tirano en verder met een lijnbus, met overstap in Bormio.' }
      ]
    },
    zh: {
      title: '如何抵达Ironwood Livigno:地址、停车与最后几公里',
      metaTitle: '如何抵达Ironwood Livigno | 地址、停车与最后路段',
      metaDescription: '地址、免费停车位与距缆车的距离:前往Ironwood Livigno(via Saroch 771)的实用指南,不会有任何意外。',
      eyebrow: '如何抵达',
      intro:
        '如果您已决定入住Ironwood Livigno,本页汇总了旅程最后一段的实用信息:公寓的确切位置、如何从Foscagno山口或Tirano抵达,以及关于停车和到达的注意事项。有关从米兰出发乘坐火车、汽车或飞机的完整指南,请参阅本页底部链接的专文。',
      sections: [
        {
          heading: '地址与确切位置',
          body: [
            '位于via Saroch 771, 23041 Livigno (SO)的Ironwood Livigno,距滑雪缆车约100米步行路程,距滑雪学校和器材租赁点50米。这里地理位置优越却十分安静,距镇中心约步行15分钟——抵达后步行即可前往雪道、商店和餐厅,无需驾车。',
            '确切GPS坐标为46.525061, 10.126967:建议输入导航系统,尤其是在山区最后几公里,那里的网络信号可能不太稳定。'
          ]
        },
        {
          heading: '最后一段路程,从Tirano或瑞士边境出发',
          body: [
            '乘火车前来的客人可在Tirano车站下车,转乘班车(在Bormio换乘)前往Livigno。自驾从米兰出发的客人沿SS38公路驶向Bormio,再经Foscagno山口;从瑞士方向前来的客人则经由Forcola di Livigno山口。冬季出发前请查询山口路况:大雪天气可能需要防滑链或雪地轮胎,极少数情况下山口可能暂时封闭。',
            '抵达镇上后,请沿指示牌前往缆车区域的via Saroch:公寓外观采用当地典型的阿尔卑斯风格木质外墙,十分易于辨认。'
          ]
        },
        {
          heading: '停车与抵达公寓',
          body: [
            '公寓附带免费停车位,因此无需在镇上寻找付费停车场。入住与退房时间将在通过WhatsApp预订时确认,并可根据具体情况灵活调整——对于长途旅行后抵达,或火车/巴士时刻不总是准时的客人来说十分方便。',
            '如对旅程最后一段有任何疑问,联系我们最快捷的方式是WhatsApp:我们会提供准确的指引,如有需要,还会发送入口照片,方便您立即认出建筑。'
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO)——距滑雪缆车100米',
        '含免费停车位',
        'GPS坐标:46.525061, 10.126967',
        '灵活入住时间,通过WhatsApp确认'
      ],
      ctaText: '通过WhatsApp联系我们获取抵达指引',
      breadcrumbName: '如何抵达',
      navLabel: '如何抵达',
      relatedLinkLabel: '阅读完整指南:从米兰出发的火车、汽车或飞机',
      faq: [
        { q: 'Ironwood Livigno的确切地址是什么?', a: 'Via Saroch 771, 23041 Livigno (SO)——GPS坐标46.525061, 10.126967。' },
        { q: '是否含停车位?', a: '是的,公寓附带一个免费停车位。' },
        { q: '如何自驾或乘火车抵达利维尼奥?', a: '自驾从米兰出发沿SS38公路前往Foscagno山口(从瑞士方向则经由Forcola di Livigno山口);乘火车可到Tirano站,再转乘班车,在Bormio换乘。' }
      ]
    },
    ja: {
      title: 'Ironwood Livignoへのアクセス:住所、駐車場、そして最後の道のり',
      metaTitle: 'Ironwood Livignoへのアクセス | 住所、駐車場、最後の区間',
      metaDescription: '住所、無料駐車場、リフトまでの距離。Ironwood Livigno(Via Saroch 771)へ迷わずたどり着くための実用ガイドです。',
      eyebrow: 'アクセス',
      intro:
        'すでにIronwood Livignoへの滞在を決めている方のために、このページでは旅の最後の区間に関する実用的な情報をまとめています。アパートメントの正確な場所、Foscagno峠やティラノからのアクセス方法、駐車場や到着時に知っておくべきことなどです。ミラノからの電車、車、飛行機での行き方については、このページ下部にリンクした専用記事に詳細をまとめています。',
      sections: [
        {
          heading: '住所と正確な場所',
          body: [
            'Ironwood LivignoはVia Saroch 771, 23041 Livigno (SO)にあり、スキーリフトから徒歩約100m、スキースクールとレンタル用品店から50mの場所にあります。便利でありながら静かな立地で、町の中心部からは徒歩約15分。到着後は徒歩でゲレンデやお店、レストランへアクセスできます。',
            '正確なGPS座標は46.525061, 10.126967です。特に山道の最後の数キロメートルは携帯電波が不安定になることがあるため、カーナビに入力しておくと安心です。'
          ]
        },
        {
          heading: 'ティラノまたはスイス国境からの最後の区間',
          body: [
            '電車でお越しの方は、ティラノ駅で下車後、路線バス(ボルミオで乗り換え)でリヴィニョまでお越しください。ミラノから車でお越しの方は、SS38号線をボルミオ方面へ進み、その後Foscagno峠を通過します。スイスからお越しの場合はForcola di Livignoを経由します。冬季は出発前に峠の状況をご確認ください。大雪の場合はチェーンやスタッドレスタイヤが必要になることがあり、まれに一時的に閉鎖されることもあります。',
            '町に着いたら、スキーリフトのエリアにあるVia Sarochへの案内表示に従ってください。アパートメントはこの地域特有のアルプス様式の木造外観で、すぐに見つけられます。'
          ]
        },
        {
          heading: '駐車場とアパートメントへの到着',
          body: [
            'アパートメントには無料駐車場が付いているため、町で有料駐車場を探す必要はありません。チェックインとチェックアウトの時間は、ご予約時にWhatsAppでご案内し、空室状況に応じて多少の融通も可能です。長旅の後や、電車・バスの時刻が必ずしも正確でない場合にも安心です。',
            '旅の最後の区間についてご不明な点があれば、最も早くご連絡いただける方法はWhatsAppです。正確な道案内をお伝えし、必要であれば入口の写真もお送りしますので、すぐに建物を見つけていただけます。'
          ]
        }
      ],
      highlights: [
        'Via Saroch 771, Livigno (SO) — スキーリフトから100m',
        '無料駐車場付き',
        'GPS座標:46.525061, 10.126967',
        '柔軟なチェックイン、WhatsAppで確認'
      ],
      ctaText: 'WhatsAppでアクセス方法をお問い合わせください',
      breadcrumbName: 'アクセス',
      navLabel: 'アクセス',
      relatedLinkLabel: '完全ガイドを読む:ミラノからの電車・車・飛行機',
      faq: [
        { q: 'Ironwood Livignoの正確な住所は?', a: 'Via Saroch 771, 23041 Livigno (SO)——GPS座標46.525061, 10.126967。' },
        { q: '駐車場は含まれていますか?', a: 'はい、アパートメントには無料駐車場が含まれています。' },
        { q: '車や電車でリヴィニョへ行くにはどうすればよいですか?', a: '車の場合、ミラノからSS38号線でFoscagno峠へ向かいます(スイスからの場合はForcola di Livignoを経由)。電車の場合はティラノ駅で下車し、ボルミオで乗り換えて路線バスで向かいます。' }
      ]
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
      metaTitle: 'About Us | Ironwood Livigno — A Host Family',
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
      metaTitle: 'Über Uns | Ironwood Livigno — Eine Gastgeberfamilie',
      metaDescription:
        'Ironwood Livigno wird direkt von Francesco und seiner Familie geführt, waschechten Livignesern: lesen Sie unsere Geschichte.',
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
      metaTitle: 'Qui Sommes-Nous | Ironwood Livigno — Famille d\'Hôtes',
      metaDescription:
        'Ironwood Livigno est géré directement par Francesco et sa famille, natifs de Livigno depuis toujours.',
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
    },
    da: {
      title: 'Om os: den Livigno-familie, der står bag Ironwood Livigno',
      metaTitle: 'Om Os | Ironwood Livigno — En værtsfamilie i Livigno',
      metaDescription: 'Ironwood Livigno drives direkte af Francesco og hans familie, ægte livignesere: læs vores historie og anmeldelser, book uden kommission.',
      eyebrow: 'Om os',
      intro:
        'Hvem står bag Ironwood Livigno? Ikke et ejendomsmæglerfirma eller en ferieboligkæde, men en rigtig familie, der bor i Livigno hele året. Jeg hedder Francesco, født og opvokset her, og sammen med min kone Tania og vores to døtre, Nicole og Giulia, har vi forvandlet vores familiehus til en lejlighed skabt til dem, der kommer til Livigno for at stå på ski om vinteren eller vandre i bjergene om sommeren. Når du booker hos os, skriver du ikke til et callcenter: du skriver direkte til dem, der har renoveret huset med deres egne hænder, værelse for værelse.',
      sections: [
        {
          heading: 'En Livigno-familie, ikke et bureau',
          body: [
            'Vi er fire: mig, min kone Tania, og vores to døtre, Nicole (18 år) og Giulia (13 år). Vi driver ikke Ironwood Livigno på afstand eller gennem en ejendomsadministrator: vi bor her hele året, ikke kun i sæsonen, og derfor kender vi pisternes rytme, de travleste perioder og de praktiske detaljer, som en generel rejseguide ikke kan give dig.',
            'At være født og opvokset i Livigno betyder også, at vi kan give dig ægte råd om, hvornår du skal booke din skipas online for at undgå køer, hvilken side af bjerget du skal vælge afhængigt af dagens vejr, eller hvor du skal spise om aftenen uden kun at stole på anmeldelser online.'
          ]
        },
        {
          heading: 'Et familiehus, omhyggeligt renoveret i 2022',
          body: [
            'Ironwood Livigno startede ikke som en almindelig investering. Det er vores hjem, som vi har renoveret fuldstændigt og valgt primært at arbejde med jern og træ — materialer, der fortæller om bjergene bedre end standardmøbler i en ferielejlighed. Arbejdet blev afsluttet i 2022: privat infrarød sauna, dampbad, elektrisk pejs, et fuldt udstyret køkken og 3 soveværelser på i alt 90 m², designet til komfortabelt at huse familier og grupper på op til 6 personer, med 2 fulde badeværelser.',
            'Resultatet er en ferielejlighed kun 100 meter fra skiliftene og 50 meter fra skiskole og udstyrsudlejning, på Via Saroch — men som indeni stadig bevarer varmen fra et rigtigt familiehus, ikke en standardiseret lejlighed.'
          ]
        },
        {
          heading: 'Hvorfor det betaler sig at booke direkte hos Ironwood Livigno',
          body: [
            'Vi driver selv Ironwood Livigno, uden mellemmænd: det betyder, at når du skriver til os på WhatsApp for at spørge om ledighed, er det os, der svarer, ikke et callcenter. Vi kan bekræfte fleksible check-in-tider, give dig præcise anvisninger til den sidste del af rejsen og ordne en særlig anmodning på stedet — en ekstra barneseng, en datoændring — uden at skulle gå igennem en tredjepartsplatform.',
            'At booke direkte betyder også, at du undgår den kommission, der normalt lægges oveni den endelige pris på Airbnb eller Booking: prisen, vi aftaler via WhatsApp eller e-mail, er den, du betaler — uden overraskelser ved betaling.'
          ]
        },
        {
          heading: 'Hvad gæster, der har boet hos os, siger',
          body: ['Anmeldelserne nedenfor er ægte, offentliggjort på Google og Airbnb — de samme, du finder i anmeldelsessektionen på forsiden.']
        }
      ],
      highlights: [
        'Direkte administration, uden bureauer eller mellemmænd',
        'Ægte livignesere: reelle råd om pister og sæson',
        'Familiehus renoveret i 2022, jern og træ',
        'Direkte svar på WhatsApp, ikke et callcenter'
      ],
      faq: [
        {
          q: 'Drives Ironwood Livigno af et bureau?',
          a: 'Nej. Ironwood Livigno drives direkte af Francesco og hans familie, ejere der bor i Livigno hele året — ikke et ejendomsmæglerfirma eller en ferieboligkæde.'
        },
        {
          q: 'Kan det betale sig at booke direkte i stedet for via Airbnb eller Booking?',
          a: 'Ja: ved at booke direkte via WhatsApp, telefon eller e-mail undgår du platformenes kommission, og du får direkte kontakt med dem, der faktisk driver lejligheden, til enhver forespørgsel før, under og efter opholdet.'
        },
        {
          q: 'Hvem har renoveret huset?',
          a: 'Det er Francesco og Tanias familiehus, fuldstændigt renoveret og færdiggjort i 2022, med et design bygget primært omkring jern og træ.'
        },
        {
          q: 'Hvor længe har I boet i Livigno?',
          a: 'Francesco er født og opvokset i Livigno og bor her hele året, ikke kun i turistsæsonen — det samme gælder for hele familien.'
        },
        {
          q: 'Hvordan kan jeg kontakte jer direkte?',
          a: 'Den hurtigste måde er WhatsApp på +39 0342 929285, eller via e-mail til info@ironwoodlivigno.com, eller gennem formularen for tilgængelighedsforespørgsel på hjemmesiden.'
        }
      ],
      internalLinkLabels: [
        'Se vores 3 soveværelser, designet til familier og grupper',
        'Læs guiden om, hvordan du kommer til Ironwood Livigno',
        'Oplev vinteren i Livigno hos Ironwood',
        'Se alle vores verificerede anmeldelser',
        'Læs vores guider til Livigno'
      ],
      ctaText: 'Skriv til os direkte på WhatsApp',
      breadcrumbName: 'Om os',
      navLabel: 'Om os',
      relatedLinkLabel: 'Gå til kontaktsiden for at skrive eller ringe til os'
    },
    pl: {
      title: 'O nas: livignijska rodzina stojąca za Ironwood Livigno',
      metaTitle: 'O Nas | Ironwood Livigno — Rodzina Gospodarzy w Livigno',
      metaDescription: 'Ironwood Livigno jest prowadzony bezpośrednio przez Francesco i jego rodzinę, mieszkańców Livigno od zawsze.',
      eyebrow: 'O nas',
      intro:
        'Kto stoi za Ironwood Livigno? Nie agencja nieruchomości ani sieć domów wakacyjnych, lecz prawdziwa rodzina, która mieszka w Livigno przez cały rok. Nazywam się Francesco, urodziłem się i wychowałem tutaj, i wraz z żoną Tanią oraz naszymi dwiema córkami, Nicole i Giulią, zamieniliśmy nasz rodzinny dom w apartament pomyślany dla tych, którzy przyjeżdżają do Livigno, by jeździć na nartach zimą lub wędrować po górach latem. Rezerwując u nas, nie piszesz do call center: piszesz bezpośrednio do osób, które własnymi rękami wyremontowały ten dom, pokój po pokoju.',
      sections: [
        {
          heading: 'Rodzina z Livigno, nie agencja',
          body: [
            'Jest nas czworo: ja, moja żona Tania oraz nasze dwie córki, Nicole (18 lat) i Giulia (13 lat). Nie prowadzimy Ironwood Livigno zdalnie ani przez zarządcę nieruchomości: mieszkamy tu przez cały rok, nie tylko w sezonie, dlatego dobrze znamy rytm stoków, najbardziej obłożone okresy i praktyczne szczegóły, których nie da ci ogólny przewodnik turystyczny.',
            'Urodzenie i wychowanie w Livigno oznacza także, że możemy dać ci prawdziwe rady: kiedy zarezerwować karnet narciarski online, by uniknąć kolejek, które zbocze wybrać w zależności od pogody danego dnia, albo gdzie zjeść wieczorem, nie polegając wyłącznie na opiniach w internecie.'
          ]
        },
        {
          heading: 'Rodzinny dom, starannie wyremontowany w 2022 roku',
          body: [
            'Ironwood Livigno nie powstał jako zwykła inwestycja. To nasz dom, który w pełni wyremontowaliśmy, wybierając pracę głównie z żelazem i drewnem — materiałami, które opowiadają o górach lepiej niż standardowe wyposażenie domu wakacyjnego. Prace zakończono w 2022 roku: prywatna sauna na podczerwień, łaźnia parowa, elektryczny kominek, w pełni wyposażona kuchnia i 3 sypialnie o łącznej powierzchni 90 m², pomyślane tak, by wygodnie pomieścić rodziny i grupy do 6 osób, z 2 pełnymi łazienkami.',
            'Efektem jest dom wakacyjny zaledwie 100 metrów od wyciągów narciarskich i 50 metrów od szkółki narciarskiej i wypożyczalni sprzętu, przy via Saroch — który jednak w środku zachowuje ciepło prawdziwego rodzinnego domu, a nie standaryzowanego apartamentu.'
          ]
        },
        {
          heading: 'Dlaczego warto rezerwować bezpośrednio w Ironwood Livigno',
          body: [
            'Prowadzimy Ironwood Livigno osobiście, bez pośredników: oznacza to, że gdy piszesz do nas na WhatsApp z pytaniem o dostępność, odpowiadamy my, a nie call center. Możemy potwierdzić elastyczne godziny zameldowania, dać ci precyzyjne wskazówki dotyczące ostatniego odcinka drogi i od razu załatwić szczególną prośbę — dodatkowe łóżeczko, zmianę daty — bez konieczności przechodzenia przez platformę zewnętrzną.',
            'Rezerwacja bezpośrednia oznacza także uniknięcie prowizji pośredniczącej, która zwykle obciąża cenę końcową na Airbnb czy Booking: cena, którą ustalimy przez WhatsApp lub e-mail, jest tą, którą płacisz — bez niespodzianek przy płatności.'
          ]
        },
        {
          heading: 'Co mówią goście, którzy u nas mieszkali',
          body: ['Poniższe opinie są prawdziwe, opublikowane na Google i Airbnb — te same, które znajdziesz w sekcji opinii na stronie głównej.']
        }
      ],
      highlights: [
        'Bezpośrednie zarządzanie, bez agencji i pośredników',
        'Mieszkańcy Livigno od zawsze: prawdziwe rady o stokach i sezonie',
        'Rodzinny dom wyremontowany w 2022 roku, żelazo i drewno',
        'Bezpośrednie odpowiedzi na WhatsApp, nie call center'
      ],
      faq: [
        {
          q: 'Czy Ironwood Livigno jest prowadzony przez agencję?',
          a: 'Nie. Ironwood Livigno jest prowadzony bezpośrednio przez Francesco i jego rodzinę, właścicieli mieszkających w Livigno przez cały rok — nie przez agencję nieruchomości ani sieć domów wakacyjnych.'
        },
        {
          q: 'Czy warto rezerwować bezpośrednio zamiast przez Airbnb lub Booking?',
          a: 'Tak: rezerwując bezpośrednio przez WhatsApp, telefon lub e-mail, unikasz prowizji platform i masz bezpośredni kontakt z osobami, które faktycznie prowadzą apartament, w każdej sprawie przed, w trakcie i po pobycie.'
        },
        {
          q: 'Kto wyremontował dom?',
          a: 'To rodzinny dom Francesco i Tanii, w pełni wyremontowany i ukończony w 2022 roku, w projekcie opartym głównie na żelazie i drewnie.'
        },
        {
          q: 'Od jak dawna mieszkacie w Livigno?',
          a: 'Francesco urodził się i wychował w Livigno i mieszka tu przez cały rok, nie tylko w sezonie turystycznym — to samo dotyczy całej rodziny.'
        },
        {
          q: 'Jak mogę skontaktować się z wami bezpośrednio?',
          a: 'Najszybszym sposobem jest WhatsApp pod numerem +39 0342 929285, e-mail na adres info@ironwoodlivigno.com, lub formularz zapytania o dostępność na stronie.'
        }
      ],
      internalLinkLabels: [
        'Poznaj nasze 3 sypialnie, pomyślane dla rodzin i grup',
        'Przeczytaj przewodnik, jak dojechać do Ironwood Livigno',
        'Poznaj zimę w Livigno w Ironwood',
        'Zobacz wszystkie nasze zweryfikowane opinie',
        'Przeczytaj nasze przewodniki po Livigno'
      ],
      ctaText: 'Napisz do nas bezpośrednio na WhatsApp',
      breadcrumbName: 'O nas',
      navLabel: 'O nas',
      relatedLinkLabel: 'Przejdź do strony kontaktowej, aby do nas napisać lub zadzwonić'
    },
    cs: {
      title: 'O nás: livignská rodina za Ironwood Livigno',
      metaTitle: 'O Nás | Ironwood Livigno — Rodina Hostitelů v Livignu',
      metaDescription: 'Ironwood Livigno vede přímo Francesco a jeho rodina, rodilí obyvatelé Livigna: přečtěte si náš příběh a recenze, rezervujte bez provize.',
      eyebrow: 'O nás',
      intro:
        'Kdo stojí za Ironwood Livigno? Ne realitní kancelář ani řetězec dovolenkových domů, ale skutečná rodina, která žije v Livignu celý rok. Jmenuji se Francesco, narodil jsem se a vyrostl zde, a společně s manželkou Tanií a našimi dvěma dcerami, Nicole a Giulií, jsme proměnili náš rodinný dům v apartmán navržený pro ty, kdo přijíždějí do Livigna lyžovat v zimě nebo chodit po horách v létě. Když si u nás rezervujete, nepíšete call centru: píšete přímo lidem, kteří tento dům vlastníma rukama zrenovovali, pokoj po pokoji.',
      sections: [
        {
          heading: 'Livignská rodina, ne agentura',
          body: [
            'Jsme čtyři: já, moje manželka Tania a naše dvě dcery, Nicole (18 let) a Giulia (13 let). Ironwood Livigno neřídíme na dálku ani přes správce nemovitosti: žijeme zde celý rok, nejen v sezóně, a proto dobře známe rytmus sjezdovek, nejrušnější období a praktické detaily, které vám obecný turistický průvodce nedá.',
            'Narodit se a vyrůst v Livignu také znamená, že vám můžeme dát skutečné rady: kdy si rezervovat skipas online, abyste se vyhnuli frontám, kterou stranu hory zvolit podle počasí daného dne, nebo kde večer povečeřet, aniž byste se spoléhali jen na recenze online.'
          ]
        },
        {
          heading: 'Rodinný dům, pečlivě zrenovovaný v roce 2022',
          body: [
            'Ironwood Livigno nevznikl jako obyčejná investice. Je to náš domov, který jsme kompletně zrenovovali a zvolili práci hlavně se železem a dřevem — materiály, které o horách vypovídají lépe než standardní vybavení dovolenkového domu. Práce byly dokončeny v roce 2022: soukromá infrasauna, parní lázeň, elektrický krb, plně vybavená kuchyně a 3 ložnice o celkové ploše 90 m², navržené tak, aby pohodlně pojaly rodiny a skupiny až 6 osob, se 2 plnohodnotnými koupelnami.',
            'Výsledkem je dovolenkový dům pouhých 100 metrů od lyžařských vleků a 50 metrů od lyžařské školy a půjčovny vybavení, na Via Saroch — který si však uvnitř zachovává teplo skutečného rodinného domova, ne standardizovaného apartmánu.'
          ]
        },
        {
          heading: 'Proč se vyplatí rezervovat přímo u Ironwood Livigno',
          body: [
            'Ironwood Livigno řídíme osobně, bez prostředníků: to znamená, že když nám napíšete na WhatsApp s dotazem na dostupnost, odpovídáme my, ne call centrum. Můžeme potvrdit flexibilní časy check-inu, dát vám přesné pokyny k poslednímu úseku cesty a okamžitě vyřešit zvláštní požadavek — dětskou postýlku navíc, změnu data — bez nutnosti procházet přes platformu třetí strany.',
            'Přímá rezervace navíc znamená vyhnout se zprostředkovatelské provizi, která obvykle zatěžuje konečnou cenu na Airbnb nebo Booking: cena, na které se dohodneme přes WhatsApp nebo e-mail, je ta, kterou zaplatíte — bez překvapení při placení.'
          ]
        },
        {
          heading: 'Co říkají hosté, kteří u nás pobývali',
          body: ['Recenze níže jsou skutečné, zveřejněné na Google a Airbnb — stejné, jaké najdete v sekci recenzí na hlavní stránce.']
        }
      ],
      highlights: [
        'Přímá správa, bez agentur a prostředníků',
        'Rodilí obyvatelé Livigna: skutečné rady o sjezdovkách a sezóně',
        'Rodinný dům zrenovovaný v roce 2022, železo a dřevo',
        'Přímé odpovědi na WhatsApp, ne call centrum'
      ],
      faq: [
        {
          q: 'Vede Ironwood Livigno agentura?',
          a: 'Ne. Ironwood Livigno vede přímo Francesco a jeho rodina, majitelé žijící v Livignu celoročně — ne realitní kancelář ani řetězec dovolenkových domů.'
        },
        {
          q: 'Vyplatí se rezervovat přímo místo přes Airbnb nebo Booking?',
          a: 'Ano: přímou rezervací přes WhatsApp, telefon nebo e-mail se vyhnete provizi platforem a máte přímý kontakt s lidmi, kteří apartmán skutečně spravují, pro jakýkoli požadavek před, během i po pobytu.'
        },
        {
          q: 'Kdo dům zrenovoval?',
          a: 'Je to rodinný dům Francesca a Tanie, kompletně zrenovovaný a dokončený v roce 2022, s projektem postaveným hlavně na železe a dřevě.'
        },
        {
          q: 'Jak dlouho žijete v Livignu?',
          a: 'Francesco se v Livignu narodil a vyrostl a žije zde celoročně, nejen během turistické sezóny — totéž platí pro celou rodinu.'
        },
        {
          q: 'Jak vás mohu kontaktovat přímo?',
          a: 'Nejrychlejší je WhatsApp na čísle +39 0342 929285, e-mail na info@ironwoodlivigno.com, nebo formulář pro dotaz na dostupnost na webu.'
        }
      ],
      internalLinkLabels: [
        'Podívejte se na naše 3 ložnice, navržené pro rodiny a skupiny',
        'Přečtěte si průvodce, jak se dostat do Ironwood Livigno',
        'Objevte zimu v Livignu u Ironwood',
        'Podívejte se na všechny naše ověřené recenze',
        'Přečtěte si naše průvodce po Livignu'
      ],
      ctaText: 'Napište nám přímo na WhatsApp',
      breadcrumbName: 'O nás',
      navLabel: 'O nás',
      relatedLinkLabel: 'Přejít na kontaktní stránku a napsat nám nebo zavolat'
    },
    no: {
      title: 'Om oss: Livigno-familien bak Ironwood Livigno',
      metaTitle: 'Om Oss | Ironwood Livigno — En vertsfamilie i Livigno',
      metaDescription: 'Ironwood Livigno drives direkte av Francesco og hans familie, ekte livignesere: les vår historie og anmeldelser, book uten provisjon.',
      eyebrow: 'Om oss',
      intro:
        'Hvem står bak Ironwood Livigno? Ikke et eiendomsmeglerfirma eller en feriehuskjede, men en ekte familie som bor i Livigno hele året. Jeg heter Francesco, født og oppvokst her, og sammen med min kone Tania og våre to døtre, Nicole og Giulia, har vi forvandlet vårt familiehus til en leilighet skapt for dem som kommer til Livigno for å stå på ski om vinteren eller gå fotturer i fjellene om sommeren. Når du booker hos oss, skriver du ikke til et callsenter: du skriver direkte til dem som har renovert huset med sine egne hender, rom for rom.',
      sections: [
        {
          heading: 'En Livigno-familie, ikke et byrå',
          body: [
            'Vi er fire: meg, min kone Tania, og våre to døtre, Nicole (18 år) og Giulia (13 år). Vi driver ikke Ironwood Livigno på avstand eller gjennom en eiendomsforvalter: vi bor her hele året, ikke bare i sesongen, og derfor kjenner vi rytmen i bakkene, de travleste periodene og de praktiske detaljene som en generell reiseguide ikke kan gi deg.',
            'Å være født og oppvokst i Livigno betyr også at vi kan gi deg ekte råd: når du bør bestille skipassen din på nett for å unngå køer, hvilken side av fjellet du bør velge basert på dagens vær, eller hvor du kan spise om kvelden uten bare å stole på anmeldelser på nettet.'
          ]
        },
        {
          heading: 'Et familiehus, omhyggelig renovert i 2022',
          body: [
            'Ironwood Livigno startet ikke som en vanlig investering. Det er vårt hjem, som vi har renovert fullstendig og valgt å jobbe hovedsakelig med jern og tre — materialer som forteller om fjellene bedre enn standard møbler i et feriehus. Arbeidet ble fullført i 2022: privat infrarød badstue, dampbad, elektrisk peis, et fullt utstyrt kjøkken og 3 soverom på til sammen 90 m², utformet for komfortabelt å huse familier og grupper på opptil 6 personer, med 2 fullverdige bad.',
            'Resultatet er et feriehus bare 100 meter fra skiheisene og 50 meter fra skiskole og utstyrsutleie, på Via Saroch — men som innvendig fortsatt bevarer varmen fra et ekte familiehus, ikke en standardisert leilighet.'
          ]
        },
        {
          heading: 'Hvorfor det lønner seg å bestille direkte hos Ironwood Livigno',
          body: [
            'Vi driver Ironwood Livigno selv, uten mellommenn: det betyr at når du skriver til oss på WhatsApp for å spørre om ledighet, er det vi som svarer, ikke et callsenter. Vi kan bekrefte fleksible innsjekkingstider, gi deg presise anvisninger for den siste delen av reisen, og ordne en spesiell forespørsel på stedet — en ekstra barneseng, en datoendring — uten å måtte gå gjennom en tredjepartsplattform.',
            'Å bestille direkte betyr også at du unngår provisjonen som vanligvis legges til sluttprisen på Airbnb eller Booking: prisen vi avtaler via WhatsApp eller e-post, er den du betaler — uten overraskelser ved betaling.'
          ]
        },
        {
          heading: 'Hva gjester som har bodd hos oss sier',
          body: ['Anmeldelsene nedenfor er ekte, publisert på Google og Airbnb — de samme du finner i anmeldelsesdelen på forsiden.']
        }
      ],
      highlights: [
        'Direkte administrasjon, uten byråer eller mellommenn',
        'Ekte livignesere: reelle råd om bakker og sesong',
        'Familiehus renovert i 2022, jern og tre',
        'Direkte svar på WhatsApp, ikke et callsenter'
      ],
      faq: [
        {
          q: 'Drives Ironwood Livigno av et byrå?',
          a: 'Nei. Ironwood Livigno drives direkte av Francesco og hans familie, eiere som bor i Livigno hele året — ikke et eiendomsmeglerfirma eller en feriehuskjede.'
        },
        {
          q: 'Lønner det seg å bestille direkte i stedet for via Airbnb eller Booking?',
          a: 'Ja: ved å bestille direkte via WhatsApp, telefon eller e-post unngår du plattformenes provisjon, og du får direkte kontakt med dem som faktisk driver leiligheten, for enhver forespørsel før, under og etter oppholdet.'
        },
        {
          q: 'Hvem har renovert huset?',
          a: 'Det er Francesco og Tanias familiehus, fullstendig renovert og ferdigstilt i 2022, med et design bygget hovedsakelig rundt jern og tre.'
        },
        {
          q: 'Hvor lenge har dere bodd i Livigno?',
          a: 'Francesco er født og oppvokst i Livigno og bor her hele året, ikke bare i turistsesongen — det samme gjelder for hele familien.'
        },
        {
          q: 'Hvordan kan jeg kontakte dere direkte?',
          a: 'Den raskeste måten er WhatsApp på +39 0342 929285, eller via e-post til info@ironwoodlivigno.com, eller gjennom skjemaet for tilgjengelighetsforespørsel på nettsiden.'
        }
      ],
      internalLinkLabels: [
        'Se våre 3 soverom, utformet for familier og grupper',
        'Les guiden om hvordan du kommer til Ironwood Livigno',
        'Oppdag vinteren i Livigno hos Ironwood',
        'Se alle våre verifiserte anmeldelser',
        'Les våre guider til Livigno'
      ],
      ctaText: 'Skriv til oss direkte på WhatsApp',
      breadcrumbName: 'Om oss',
      navLabel: 'Om oss',
      relatedLinkLabel: 'Gå til kontaktsiden for å skrive eller ringe til oss'
    },
    nl: {
      title: 'Over ons: de Livigno-familie achter Ironwood Livigno',
      metaTitle: 'Over Ons | Ironwood Livigno — Een gastfamilie in Livigno',
      metaDescription: 'Ironwood Livigno wordt rechtstreeks beheerd door Francesco en zijn familie, geboren en getogen in Livigno.',
      eyebrow: 'Over ons',
      intro:
        "Wie schuilt er achter Ironwood Livigno? Geen makelaarskantoor of vakantiehuizenketen, maar een echt gezin dat het hele jaar door in Livigno woont. Ik ben Francesco, hier geboren en getogen, en samen met mijn vrouw Tania en onze twee dochters, Nicole en Giulia, hebben we ons familiehuis omgetoverd tot een appartement voor iedereen die naar Livigno komt om 's winters te skiën of 's zomers in de bergen te wandelen. Als je bij ons boekt, schrijf je niet naar een callcenter: je schrijft rechtstreeks naar de mensen die dat huis met hun eigen handen hebben gerenoveerd, kamer voor kamer.",
      sections: [
        {
          heading: 'Een Livigno-familie, geen bureau',
          body: [
            "We zijn met z'n vieren: ik, mijn vrouw Tania, en onze twee dochters, Nicole (18 jaar) en Giulia (13 jaar). We beheren Ironwood Livigno niet op afstand of via een propertymanager: we wonen hier het hele jaar door, niet alleen in het seizoen, en daarom kennen we het ritme van de piste, de drukste periodes en de praktische details die een algemene reisgids je niet kan geven.",
            'In Livigno geboren en getogen zijn betekent ook dat we je echte tips kunnen geven: wanneer je je skipas online moet boeken om rijen te vermijden, welke berghelling je moet kiezen op basis van het weer van die dag, of waar je \'s avonds kunt eten zonder alleen op online recensies te vertrouwen.'
          ]
        },
        {
          heading: 'Een familiehuis, zorgvuldig gerenoveerd in 2022',
          body: [
            'Ironwood Livigno is niet ontstaan als een gewone investering. Het is ons huis, dat we volledig hebben gerenoveerd en waarbij we ervoor kozen vooral met ijzer en hout te werken — materialen die de bergen beter vertellen dan standaard meubilair van een vakantiewoning. De werkzaamheden werden in 2022 afgerond: privé infraroodsauna, stoombad, elektrische open haard, een volledig uitgeruste keuken en 3 slaapkamers voor een totaal van 90 m², ontworpen om comfortabel plaats te bieden aan gezinnen en groepen tot 6 personen, met 2 volledige badkamers.',
            'Het resultaat is een vakantiewoning op slechts 100 meter van de skiliften en 50 meter van de skischool en verhuur van uitrusting, aan de Via Saroch — maar die vanbinnen nog altijd de warmte van een echt familiehuis behoudt, geen gestandaardiseerd appartement.'
          ]
        },
        {
          heading: 'Waarom rechtstreeks boeken bij Ironwood Livigno loont',
          body: [
            'We beheren Ironwood Livigno zelf, zonder tussenpersonen: dat betekent dat wanneer je ons op WhatsApp schrijft om naar beschikbaarheid te vragen, wij degenen zijn die antwoorden, niet een callcenter. We kunnen flexibele check-intijden bevestigen, je precieze aanwijzingen geven voor het laatste stuk van de reis, en ter plekke een speciaal verzoek regelen — een extra kinderbedje, een datumwijziging — zonder via een platform van derden te hoeven gaan.',
            'Rechtstreeks boeken betekent ook dat je de bemiddelingscommissie vermijdt die normaal gesproken op de eindprijs bij Airbnb of Booking drukt: de prijs die we via WhatsApp of e-mail afspreken, is wat je betaalt — zonder verrassingen bij het afrekenen.'
          ]
        },
        {
          heading: 'Wat gasten die bij ons hebben verbleven zeggen',
          body: ['De onderstaande recensies zijn echt, gepubliceerd op Google en Airbnb — dezelfde die je vindt in het recensiegedeelte van de homepage.']
        }
      ],
      highlights: [
        'Directe beheer, zonder bureaus of tussenpersonen',
        'Geboren en getogen in Livigno: echte tips over piste en seizoen',
        'Familiehuis gerenoveerd in 2022, ijzer en hout',
        'Rechtstreekse antwoorden op WhatsApp, geen callcenter'
      ],
      faq: [
        {
          q: 'Wordt Ironwood Livigno beheerd door een bureau?',
          a: 'Nee. Ironwood Livigno wordt rechtstreeks beheerd door Francesco en zijn familie, eigenaars die het hele jaar door in Livigno wonen — geen makelaarskantoor of vakantiehuizenketen.'
        },
        {
          q: 'Loont het om rechtstreeks te boeken in plaats van via Airbnb of Booking?',
          a: 'Ja: door rechtstreeks te boeken via WhatsApp, telefoon of e-mail vermijd je de commissie van de platforms, en heb je rechtstreeks contact met de mensen die het appartement daadwerkelijk beheren, voor elk verzoek vóór, tijdens en na het verblijf.'
        },
        {
          q: 'Wie heeft het huis gerenoveerd?',
          a: 'Het is het familiehuis van Francesco en Tania, volledig gerenoveerd en voltooid in 2022, met een ontwerp dat vooral rond ijzer en hout is opgebouwd.'
        },
        {
          q: 'Hoe lang wonen jullie al in Livigno?',
          a: 'Francesco is geboren en getogen in Livigno en woont hier het hele jaar door, niet alleen tijdens het toeristenseizoen — hetzelfde geldt voor het hele gezin.'
        },
        {
          q: 'Hoe kan ik jullie rechtstreeks contacteren?',
          a: 'De snelste manier is WhatsApp op +39 0342 929285, of per e-mail naar info@ironwoodlivigno.com, of via het beschikbaarheidsformulier op de site.'
        }
      ],
      internalLinkLabels: [
        'Ontdek onze 3 slaapkamers, ontworpen voor gezinnen en groepen',
        'Lees de gids over hoe je bij Ironwood Livigno komt',
        'Ontdek de winter in Livigno bij Ironwood',
        'Bekijk al onze geverifieerde recensies',
        'Lees onze gidsen over Livigno'
      ],
      ctaText: 'Schrijf ons rechtstreeks op WhatsApp',
      breadcrumbName: 'Over ons',
      navLabel: 'Over ons',
      relatedLinkLabel: 'Ga naar de contactpagina om ons te schrijven of te bellen'
    },
    zh: {
      title: '关于我们:Ironwood Livigno背后的利维尼奥本地家庭',
      metaTitle: '关于我们 | Ironwood Livigno——利维尼奥的房东家庭',
      metaDescription: 'Ironwood Livigno由Francesco及其家人亲自经营,世代扎根利维尼奥:了解我们的故事和评价,预订无需支付佣金。',
      eyebrow: '关于我们',
      intro:
        'Ironwood Livigno背后是谁?不是房产中介,也不是度假屋连锁品牌,而是一整年都居住在利维尼奥的真实家庭。我是Francesco,在这里出生长大,和妻子Tania以及两个女儿Nicole和Giulia一起,把我们的家庭住宅改造成了一间公寓,专为冬季来利维尼奥滑雪、夏季来登山的旅客而设计。当您向我们预订时,并非在联系某个呼叫中心:而是在直接联系亲手一间一间翻修这座房子的人。',
      sections: [
        {
          heading: '一个利维尼奥家庭,而非中介机构',
          body: [
            '我们一家四口:我、妻子Tania,以及两个女儿——18岁的Nicole和13岁的Giulia。我们并非通过远程或物业管理公司来经营Ironwood Livigno:我们一整年都住在这里,而不只是旺季,因此我们非常了解雪道的节奏、最繁忙的时段,以及一份普通旅游指南无法给您的实用细节。',
            '在利维尼奥出生长大也意味着,我们可以给您真正实用的建议:何时在线预订滑雪通行证以避开排队,根据当天天气该选择哪一侧山坡滑雪,或者晚上该去哪里用餐,而不仅仅依赖网上评价。'
          ]
        },
        {
          heading: '一座家庭住宅,于2022年精心翻修',
          body: [
            'Ironwood Livigno并非始于一次普通的投资。这是我们自己的家,我们对其进行了全面翻修,主要选用铁艺与木材——这些材质比标准度假屋装饰更能诉说山区的故事。装修工程于2022年完工:私人红外线桑拿、土耳其蒸汽浴、电壁炉、设备齐全的厨房,以及总面积90平方米的3间卧室,专为舒适容纳最多6人的家庭或团体而设计,配有2间独立浴室。',
            '最终呈现的是一处距滑雪缆车仅100米、距滑雪学校和器材租赁点仅50米的度假住宅,位于via Saroch——但室内依然保留着真正家庭住宅的温度,而非千篇一律的标准化公寓。'
          ]
        },
        {
          heading: '为什么直接向Ironwood Livigno预订更划算',
          body: [
            '我们亲自经营Ironwood Livigno,不经过任何中间人:这意味着当您通过WhatsApp向我们咨询空房情况时,回复您的正是我们本人,而不是呼叫中心。我们可以确认灵活的入住时间,为您提供旅程最后一段的精确指引,并当场满足特殊需求——比如加一张婴儿床、更改日期——完全无需经过第三方平台。',
            '直接预订还意味着可以避免通常附加在Airbnb或Booking最终价格上的中介佣金:我们通过WhatsApp或邮件商定的价格,就是您实际支付的价格,结账时不会有任何意外。'
          ]
        },
        {
          heading: '曾入住过的客人怎么说',
          body: ['以下评价均为真实评价,发布于Google和Airbnb——与首页评价板块中展示的完全相同。']
        }
      ],
      highlights: [
        '直接经营管理,无中介、无中间人',
        '世代扎根利维尼奥:提供关于雪道和季节的真实建议',
        '家庭住宅于2022年翻修,铁艺与木材',
        'WhatsApp直接回复,而非呼叫中心'
      ],
      faq: [
        {
          q: 'Ironwood Livigno是由中介机构经营的吗?',
          a: '不是。Ironwood Livigno由Francesco及其家人直接经营,他们是常年居住在利维尼奥的业主——并非房产中介,也不是度假屋连锁品牌。'
        },
        {
          q: '直接预订是否比通过Airbnb或Booking更划算?',
          a: '是的:通过WhatsApp、电话或邮件直接预订可以避免平台佣金,并且无论是入住前、入住期间还是退房后,您都能直接联系到真正管理这间公寓的人。'
        },
        {
          q: '这栋房子是谁翻修的?',
          a: '这是Francesco和Tania的家庭住宅,于2022年全面翻修完工,设计主要以铁艺和木材为主。'
        },
        {
          q: '你们在利维尼奥居住多久了?',
          a: 'Francesco在利维尼奥出生长大,并常年居住于此,而不仅仅是旅游旺季——全家人都是如此。'
        },
        {
          q: '我该如何直接联系你们?',
          a: '最快捷的方式是通过WhatsApp联系+39 0342 929285,或发送邮件至info@ironwoodlivigno.com,也可以通过网站上的空房查询表单联系我们。'
        }
      ],
      internalLinkLabels: [
        '了解我们专为家庭和团体设计的3间卧室',
        '阅读前往Ironwood Livigno的路线指南',
        '在Ironwood体验利维尼奥的冬天',
        '查看我们所有的真实认证评价',
        '阅读我们的利维尼奥旅行指南'
      ],
      ctaText: '通过WhatsApp直接联系我们',
      breadcrumbName: '关于我们',
      navLabel: '关于我们',
      relatedLinkLabel: '前往联系页面给我们写信或致电'
    },
    ja: {
      title: '私たちについて:Ironwood Livignoを営むリヴィニョの家族',
      metaTitle: '私たちについて | Ironwood Livigno — リヴィニョのホストファミリー',
      metaDescription: 'Ironwood Livignoは、代々リヴィニョに暮らすFrancescoとその家族が直接運営しています。私たちのストーリーとレビューをご覧いただき、手数料なしでご予約ください。',
      eyebrow: '私たちについて',
      intro:
        'Ironwood Livignoを運営しているのは誰なのでしょうか。不動産会社でも、バケーションレンタルのチェーンでもなく、一年を通してリヴィニョで暮らす本物の家族です。私はFrancesco、ここで生まれ育ちました。妻のTania、そして2人の娘、NicoleとGiuliaとともに、私たちの実家を、冬はスキーを、夏は山歩きを楽しみにリヴィニョへ訪れる方のためのアパートメントへと生まれ変わらせました。ご予約いただく際、あなたが連絡するのはコールセンターではありません。自らの手でこの家を一部屋ずつ改装した本人に、直接連絡することになります。',
      sections: [
        {
          heading: '代理店ではなく、リヴィニョの家族',
          body: [
            '私たちは4人家族です。私、妻のTania、そして2人の娘、Nicole(18歳)とGiulia(13歳)。Ironwood Livignoを遠隔で、あるいは不動産管理会社を通じて運営しているわけではありません。シーズン中だけでなく一年中ここに暮らしているからこそ、ゲレンデのリズムや最も混雑する時期、一般的な旅行ガイドでは得られない実用的な情報を熟知しています。',
            'リヴィニョで生まれ育ったということは、リフト券をオンラインでいつ予約すれば行列を避けられるか、その日の天気によってどちら側の斜面を選ぶべきか、あるいはオンラインのレビューだけに頼らずどこで夕食をとるべきかといった、本物のアドバイスをお伝えできるということでもあります。'
          ]
        },
        {
          heading: '2022年に丁寧に改装された実家',
          body: [
            'Ironwood Livignoは単なる投資物件として生まれたわけではありません。ここは私たちの実家であり、主に鉄と木を使うことを選んで全面的に改装しました。これらの素材は、標準的なバケーションレンタルの内装よりも山の物語をよく伝えてくれます。工事は2022年に完了し、専用の赤外線サウナ、スチームバス、電気暖炉、設備の整ったキッチン、そして合計90㎡の3つのベッドルームを備え、最大6名のご家族やグループを快適に迎えられるよう設計され、2つの完全なバスルームも用意されています。',
            'こうして完成したのが、スキーリフトからわずか100m、スキースクールとレンタル用品店から50mの場所、Via Sarochに位置するバケーションレンタルです。それでいて内部には、標準化されたアパートメントではなく、本物の実家ならではの温かみが今も残っています。'
          ]
        },
        {
          heading: 'Ironwood Livignoへの直接予約がお得な理由',
          body: [
            '私たちはIronwood Livignoを仲介業者を介さず自分たちで運営しています。つまり、WhatsAppで空室状況をお問い合わせいただいた際に返信するのは、コールセンターではなく私たち自身です。柔軟なチェックイン時間の確認、旅の最後の区間についての正確なご案内、そしてベビーベッドの追加や日程変更といった特別なご要望にも、第三者のプラットフォームを介さずその場で対応できます。',
            '直接予約することで、AirbnbやBookingの最終価格に通常上乗せされる仲介手数料も回避できます。WhatsAppやメールでお伝えする金額が、そのままお支払いいただく金額です。決済時に驚くようなことはありません。'
          ]
        },
        {
          heading: 'ご滞在いただいたゲストの声',
          body: ['以下のレビューはすべて実際のもので、GoogleとAirbnbに投稿されたものです。ホームページのレビューセクションに掲載されているものと同じ内容です。']
        }
      ],
      highlights: [
        '代理店や仲介業者を介さない直接運営',
        '代々のリヴィニョ住民ならではの、ゲレンデやシーズンに関する本物のアドバイス',
        '2022年に改装された実家、鉄と木',
        'コールセンターではなく、WhatsAppでの直接返信'
      ],
      faq: [
        {
          q: 'Ironwood Livignoは代理店が運営しているのですか?',
          a: 'いいえ。Ironwood Livignoは、一年を通してリヴィニョに暮らすオーナーであるFrancescoとその家族が直接運営しています。不動産会社でもバケーションレンタルのチェーンでもありません。'
        },
        {
          q: 'AirbnbやBookingではなく、直接予約するメリットはありますか?',
          a: 'はい。WhatsApp、電話、メールで直接予約すると、プラットフォームの手数料を回避できるだけでなく、ご滞在前・滞在中・滞在後を問わず、実際にアパートメントを運営している人と直接やり取りできます。'
        },
        {
          q: 'この家を改装したのは誰ですか?',
          a: 'FrancescoとTaniaの実家で、2022年に全面改装が完了しました。主に鉄と木を基調としたデザインです。'
        },
        {
          q: 'リヴィニョに住んでどのくらいになりますか?',
          a: 'Francescoはリヴィニョで生まれ育ち、観光シーズンだけでなく一年を通してここに暮らしています。それは家族全員にも当てはまります。'
        },
        {
          q: '直接連絡するにはどうすればよいですか?',
          a: '最も早い方法はWhatsApp(+39 0342 929285)です。メールはinfo@ironwoodlivigno.com、またはウェブサイトの空室確認フォームからもご連絡いただけます。'
        }
      ],
      internalLinkLabels: [
        'ご家族やグループ向けに設計された3つのベッドルームをご覧ください',
        'Ironwood Livignoへのアクセスガイドをお読みください',
        'Ironwoodでリヴィニョの冬を発見してください',
        '認証済みのレビューをすべてご覧ください',
        'リヴィニョに関する私たちのガイドをお読みください'
      ],
      ctaText: 'WhatsAppで直接ご連絡ください',
      breadcrumbName: '私たちについて',
      navLabel: '私たちについて',
      relatedLinkLabel: 'お問い合わせページへ進み、メッセージまたはお電話でご連絡ください'
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
      metaTitle: 'Private Sauna Livigno, Italy | Private Steam Bath',
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
    },
    da: {
      title: 'Lejlighed med privat sauna i Livigno: eksklusiv infrarød sauna og dampbad',
      metaTitle: 'Privat Sauna Livigno | Lejlighed med Privat Dampbad',
      metaDescription: 'I Livigno, en lejlighed med privat infrarød sauna og dampbad, aldrig delt: ingen booking, tilgængelig hver dag på ethvert tidspunkt.',
      eyebrow: 'Privat sauna',
      intro:
        'Leder du efter en lejlighed med privat sauna i Livigno? Hos Ironwood Livigno er den infrarøde sauna og dampbadet ikke en betalt service i et fælles spa, men en del af selve lejligheden: eksklusiv for dem, der bor her, uden tidsplaner at følge eller deling med andre gæster. Denne side samler alle de praktiske detaljer for dig, der vil vide præcis, hvad der er inkluderet.',
      sections: [
        {
          heading: 'Privat infrarød sauna, aldrig delt',
          body: [
            'Den infrarøde sauna er designet til muskelrestitution: varmen trænger dybt ind i vævet, en konkret hjælp efter en dag med ski, vandreture eller mountainbike. Den er inde i lejligheden, ikke i et fælles rum i bygningen — hvilket betyder, at ingen anden gæst nogensinde vil bruge den før eller efter dig.'
          ]
        },
        {
          heading: 'Privat dampbad inkluderet',
          body: [
            'Ved siden af saunaen har lejligheden også et privat dampbad: varm damp til eksklusiv brug, der kan veksles med den infrarøde sauna efter præference, uden at skulle vælge mellem de to eller booke adgang til et fælles rum.'
          ]
        },
        {
          heading: 'Ingen booking nødvendig, tilgængelig når som helst',
          body: [
            'I modsætning til et hotelspa, hvor man ofte skal booke en tid, er sauna og dampbad her tilgængelige når som helst på dagen: lige efter hjemkomst fra pisterne, efter en sommervandring, eller simpelthen om aftenen før middagen.'
          ]
        },
        {
          heading: 'Hvorfor det er bedre end et delt spa',
          body: [
            'Vi har skrevet en dedikeret guide, der sammenligner en privat sauna med en delt sauna, med de praktiske fordele i forhold til hygiejne, tidsplan og komfort — nyttig, hvis du stadig overvejer, om en lejlighed med privat sauna er det rette valg for dit ophold i Livigno.'
          ]
        }
      ],
      highlights: [
        'Privat infrarød sauna, aldrig delt med andre gæster',
        'Privat dampbad inkluderet i lejligheden',
        'Tilgængelig når som helst, ingen booking',
        'Del af en 90 m² lejlighed, 3 soveværelser, op til 6 personer'
      ],
      faq: [
        {
          q: 'Er saunaen virkelig privat, eller deles den med andre lejligheder?',
          a: 'Den er fuldstændig privat: den findes inde i lejligheden og er udelukkende til rådighed for de gæster, der bor der, aldrig delt med andre gæster eller andre enheder.'
        },
        {
          q: 'Skal man booke en tid for at bruge saunaen eller dampbadet?',
          a: 'Nej. Da det ikke er et fælles rum, er der ingen tid at booke: de er tilgængelige når som helst på dagen under hele opholdet.'
        },
        {
          q: 'Er sauna og dampbad inkluderet i prisen for opholdet?',
          a: 'Ja, de er en del af lejligheden og medfører ingen ekstra omkostninger ud over det bookede ophold.'
        },
        {
          q: 'Er de også nyttige om sommeren, ikke kun efter ski?',
          a: 'Ja: mange gæster bruger dem også om sommeren til muskelrestitution efter en dag med vandreture eller mountainbike, ikke kun om vinteren efter ski.'
        }
      ],
      internalLinkLabels: [
        'Se hele velværesektionen hos Ironwood Livigno',
        'Læs sammenligningen: privat sauna vs. delt sauna',
        'Se hvorfor vi valgte en privat sauna til vores hjem'
      ],
      ctaText: 'Tjek ledighed og book din private sauna',
      breadcrumbName: 'Privat sauna',
      navLabel: 'Privat sauna',
      relatedLinkLabel: 'Se også pejs, morgenmad og de andre velværedetaljer'
    },
    pl: {
      title: 'Apartament z prywatną sauną w Livigno: ekskluzywna sauna na podczerwień i łaźnia parowa',
      metaTitle: 'Prywatna Sauna Livigno | Apartament z Prywatną Łaźnią Parową',
      metaDescription: 'W Livigno apartament z prywatną sauną na podczerwień i łaźnią parową, nigdy niedzieloną: bez rezerwacji, dostępna codziennie o każdej porze.',
      eyebrow: 'Prywatna sauna',
      intro:
        'Szukasz apartamentu z prywatną sauną w Livigno? W Ironwood Livigno sauna na podczerwień i łaźnia parowa nie są płatną usługą we wspólnym spa, lecz częścią samego apartamentu: ekskluzywne dla osób tu mieszkających, bez godzin do przestrzegania i bez dzielenia z innymi gośćmi. Ta strona zbiera wszystkie praktyczne szczegóły, dla tych, którzy chcą dokładnie ocenić, co jest w cenie.',
      sections: [
        {
          heading: 'Prywatna sauna na podczerwień, nigdy niedzielona',
          body: [
            'Sauna na podczerwień jest przeznaczona do regeneracji mięśni: ciepło przenika głęboko w tkanki, co stanowi realną pomoc po dniu jazdy na nartach, trekkingu czy jazdy na rowerze górskim. Znajduje się wewnątrz apartamentu, a nie we wspólnej przestrzeni budynku — oznacza to, że żaden inny gość nigdy nie skorzysta z niej przed ani po tobie.'
          ]
        },
        {
          heading: 'Prywatna łaźnia parowa w cenie',
          body: [
            'Obok sauny apartament obejmuje także prywatną łaźnię parową: gorąca para do wyłącznego użytku, do naprzemiennego korzystania z sauną na podczerwień w zależności od preferencji, bez konieczności wyboru między nimi lub rezerwowania dostępu do przestrzeni wspólnej.'
          ]
        },
        {
          heading: 'Bez rezerwacji, dostępna o każdej porze',
          body: [
            'W przeciwieństwie do spa hotelowego, gdzie często trzeba zarezerwować termin, tutaj sauna i łaźnia parowa są dostępne o każdej porze dnia: zaraz po powrocie ze stoku, po letniej wycieczce, lub po prostu wieczorem przed kolacją.'
          ]
        },
        {
          heading: 'Dlaczego to się opłaca w porównaniu ze wspólnym spa',
          body: [
            'Napisaliśmy dedykowany przewodnik porównujący prywatną saunę ze wspólną, z praktycznymi korzyściami w zakresie higieny, godzin i komfortu — przydatny, jeśli wciąż zastanawiasz się, czy apartament z prywatną sauną to właściwy wybór na twój pobyt w Livigno.'
          ]
        }
      ],
      highlights: [
        'Prywatna sauna na podczerwień, nigdy niedzielona z innymi gośćmi',
        'Prywatna łaźnia parowa w cenie apartamentu',
        'Dostępne o każdej porze, bez rezerwacji',
        'Część apartamentu o powierzchni 90 m², 3 sypialnie, do 6 osób'
      ],
      faq: [
        {
          q: 'Czy sauna jest naprawdę prywatna, czy dzielona z innymi apartamentami?',
          a: 'Jest całkowicie prywatna: znajduje się wewnątrz apartamentu i jest dostępna wyłącznie dla gości tam mieszkających, nigdy niedzielona z innymi gośćmi ani innymi lokalami.'
        },
        {
          q: 'Czy trzeba rezerwować godzinę, by skorzystać z sauny lub łaźni parowej?',
          a: 'Nie. Ponieważ nie jest to przestrzeń wspólna, nie ma żadnego terminu do rezerwacji: są dostępne o każdej porze dnia przez cały pobyt.'
        },
        {
          q: 'Czy sauna i łaźnia parowa są wliczone w cenę pobytu?',
          a: 'Tak, są częścią apartamentu i nie wiążą się z dodatkowymi kosztami poza zarezerwowanym pobytem.'
        },
        {
          q: 'Czy są przydatne również latem, nie tylko po nartach?',
          a: 'Tak: wielu gości korzysta z nich także latem, do regeneracji mięśni po dniu trekkingu czy jazdy na rowerze górskim, nie tylko zimą po nartach.'
        }
      ],
      internalLinkLabels: [
        'Poznaj pełną sekcję wellness w Ironwood Livigno',
        'Przeczytaj porównanie: prywatna sauna vs sauna wspólna',
        'Dowiedz się, dlaczego wybraliśmy prywatną saunę do naszego domu'
      ],
      ctaText: 'Sprawdź dostępność i zarezerwuj swoją prywatną saunę',
      breadcrumbName: 'Prywatna sauna',
      navLabel: 'Prywatna sauna',
      relatedLinkLabel: 'Poznaj także kominek, śniadanie i inne szczegóły wellness'
    },
    cs: {
      title: 'Apartmán se soukromou saunou v Livignu: exkluzivní infrasauna a parní lázeň',
      metaTitle: 'Soukromá Sauna Livigno | Apartmán se Soukromou Parní Lázní',
      metaDescription: 'V Livignu apartmán se soukromou infrasaunou a parní lázní, nikdy sdílené: žádná rezervace, dostupné každý den v kteroukoli hodinu.',
      eyebrow: 'Soukromá sauna',
      intro:
        'Hledáte apartmán se soukromou saunou v Livignu? V Ironwood Livigno nejsou infrasauna a parní lázeň placenou službou ve společném spa, ale součástí samotného apartmánu: exkluzivně pro ty, kdo zde bydlí, bez rozvrhu, který je třeba dodržovat, a bez sdílení s jinými hosty. Tato stránka shromažďuje všechny praktické detaily pro ty, kdo chtějí přesně zjistit, co je zahrnuto.',
      sections: [
        {
          heading: 'Soukromá infrasauna, nikdy sdílená',
          body: [
            'Infrasauna je navržena pro regeneraci svalů: teplo proniká hluboko do tkání, což je konkrétní pomoc po dni lyžování, treku nebo jízdy na horském kole. Nachází se uvnitř apartmánu, nikoli ve společném prostoru budovy — to znamená, že ji před vámi ani po vás nikdy nepoužije žádný jiný host.'
          ]
        },
        {
          heading: 'Soukromá parní lázeň v ceně',
          body: [
            'Vedle sauny apartmán zahrnuje také soukromou parní lázeň: horká pára k výhradnímu použití, kterou lze střídat s infrasaunou podle preference, bez nutnosti volit mezi nimi nebo rezervovat přístup do společného prostoru.'
          ]
        },
        {
          heading: 'Žádná rezervace, dostupné kdykoli',
          body: [
            'Na rozdíl od hotelového spa, kde je často třeba rezervovat časový slot, jsou zde sauna a parní lázeň dostupné kdykoli během dne: hned po návratu ze sjezdovky, po letním výletu, nebo prostě večer před večeří.'
          ]
        },
        {
          heading: 'Proč se to vyplatí oproti sdílenému spa',
          body: [
            'Napsali jsme samostatného průvodce srovnávajícího soukromou saunu se sdílenou, s praktickými výhodami v oblasti hygieny, rozvrhu a komfortu — užitečné, pokud stále zvažujete, zda je apartmán se soukromou saunou správnou volbou pro váš pobyt v Livignu.'
          ]
        }
      ],
      highlights: [
        'Soukromá infrasauna, nikdy sdílená s jinými hosty',
        'Soukromá parní lázeň zahrnutá v apartmánu',
        'Dostupné kdykoli, žádná rezervace',
        'Součást apartmánu o rozloze 90 m², 3 ložnice, až 6 osob'
      ],
      faq: [
        {
          q: 'Je sauna opravdu soukromá, nebo sdílená s jinými apartmány?',
          a: 'Je zcela soukromá: nachází se uvnitř apartmánu a je k dispozici výhradně hostům, kteří tam bydlí, nikdy sdílená s jinými hosty ani jinými jednotkami.'
        },
        {
          q: 'Je třeba rezervovat čas na použití sauny nebo parní lázně?',
          a: 'Ne. Jelikož se nejedná o společný prostor, není třeba rezervovat žádný slot: jsou dostupné kdykoli během dne po celou dobu pobytu.'
        },
        {
          q: 'Jsou sauna a parní lázeň zahrnuty v ceně pobytu?',
          a: 'Ano, jsou součástí apartmánu a nepřinášejí žádné další náklady nad rámec rezervovaného pobytu.'
        },
        {
          q: 'Jsou vhodné i v létě, nejen po lyžování?',
          a: 'Ano: mnoho hostů je využívá i v létě pro regeneraci svalů po dni treku nebo jízdy na horském kole, nejen v zimě po lyžování.'
        }
      ],
      internalLinkLabels: [
        'Podívejte se na celou wellness sekci Ironwood Livigno',
        'Přečtěte si srovnání: soukromá sauna vs sdílená sauna',
        'Zjistěte, proč jsme si pro náš dům vybrali soukromou saunu'
      ],
      ctaText: 'Ověřte dostupnost a rezervujte si svou soukromou saunu',
      breadcrumbName: 'Soukromá sauna',
      navLabel: 'Soukromá sauna',
      relatedLinkLabel: 'Podívejte se také na krb, snídani a další wellness detaily'
    },
    no: {
      title: 'Leilighet med privat badstue i Livigno: eksklusiv infrarød badstue og dampbad',
      metaTitle: 'Privat Badstue Livigno | Leilighet med Privat Dampbad',
      metaDescription: 'I Livigno, en leilighet med privat infrarød badstue og dampbad, aldri delt: ingen booking, tilgjengelig hver dag når som helst.',
      eyebrow: 'Privat badstue',
      intro:
        'Leter du etter en leilighet med privat badstue i Livigno? Hos Ironwood Livigno er den infrarøde badstuen og dampbadet ikke en betalt tjeneste i et delt spa, men en del av selve leiligheten: eksklusivt for dem som bor her, uten tidsplaner å følge eller deling med andre gjester. Denne siden samler alle de praktiske detaljene for deg som vil vite nøyaktig hva som er inkludert.',
      sections: [
        {
          heading: 'Privat infrarød badstue, aldri delt',
          body: [
            'Den infrarøde badstuen er utformet for muskelrestitusjon: varmen trenger dypt inn i vevet, en konkret hjelp etter en dag med ski, fotturer eller fjellsykling. Den befinner seg inne i leiligheten, ikke i et fellesrom i bygningen — det betyr at ingen andre gjester noensinne vil bruke den før eller etter deg.'
          ]
        },
        {
          heading: 'Privat dampbad inkludert',
          body: [
            'Ved siden av badstuen har leiligheten også et privat dampbad: varm damp til eksklusiv bruk, som kan veksles med den infrarøde badstuen etter preferanse, uten å måtte velge mellom de to eller booke tilgang til et fellesrom.'
          ]
        },
        {
          heading: 'Ingen booking nødvendig, tilgjengelig når som helst',
          body: [
            'I motsetning til et hotellspa, hvor man ofte må booke et tidspunkt, er badstue og dampbad her tilgjengelige når som helst på dagen: rett etter hjemkomst fra bakkene, etter en sommertur, eller ganske enkelt om kvelden før middag.'
          ]
        },
        {
          heading: 'Hvorfor det lønner seg fremfor et delt spa',
          body: [
            'Vi har skrevet en egen guide som sammenligner en privat badstue med en delt, med de praktiske fordelene når det gjelder hygiene, tidsplan og komfort — nyttig hvis du fortsatt vurderer om en leilighet med privat badstue er det rette valget for oppholdet ditt i Livigno.'
          ]
        }
      ],
      highlights: [
        'Privat infrarød badstue, aldri delt med andre gjester',
        'Privat dampbad inkludert i leiligheten',
        'Tilgjengelig når som helst, ingen booking',
        'Del av en leilighet på 90 m², 3 soverom, opptil 6 personer'
      ],
      faq: [
        {
          q: 'Er badstuen virkelig privat, eller delt med andre leiligheter?',
          a: 'Den er helt privat: den befinner seg inne i leiligheten og er utelukkende tilgjengelig for gjestene som bor der, aldri delt med andre gjester eller andre enheter.'
        },
        {
          q: 'Må man booke et tidspunkt for å bruke badstuen eller dampbadet?',
          a: 'Nei. Siden det ikke er et fellesrom, er det ingen tid å booke: de er tilgjengelige når som helst på dagen gjennom hele oppholdet.'
        },
        {
          q: 'Er badstue og dampbad inkludert i prisen for oppholdet?',
          a: 'Ja, de er en del av leiligheten og medfører ingen ekstra kostnader utover det bookede oppholdet.'
        },
        {
          q: 'Er de nyttige om sommeren også, ikke bare etter ski?',
          a: 'Ja: mange gjester bruker dem også om sommeren til muskelrestitusjon etter en dag med fotturer eller fjellsykling, ikke bare om vinteren etter ski.'
        }
      ],
      internalLinkLabels: [
        'Se hele velværeseksjonen hos Ironwood Livigno',
        'Les sammenligningen: privat badstue vs. delt badstue',
        'Se hvorfor vi valgte en privat badstue til hjemmet vårt'
      ],
      ctaText: 'Sjekk tilgjengelighet og book din private badstue',
      breadcrumbName: 'Privat badstue',
      navLabel: 'Privat badstue',
      relatedLinkLabel: 'Se også peis, frokost og de andre velværedetaljene'
    },
    nl: {
      title: 'Appartement met privésauna in Livigno: exclusieve infraroodsauna en stoombad',
      metaTitle: 'Privésauna Livigno | Appartement met Privé Stoombad',
      metaDescription: 'In Livigno, een appartement met privé infraroodsauna en stoombad, nooit gedeeld: geen reservering nodig, elke dag op elk moment beschikbaar.',
      eyebrow: 'Privésauna',
      intro:
        'Op zoek naar een appartement met privésauna in Livigno? Bij Ironwood Livigno zijn de infraroodsauna en het stoombad geen betaalde dienst in een gedeelde spa, maar deel van het appartement zelf: exclusief voor wie hier verblijft, zonder tijdschema en zonder te delen met andere gasten. Deze pagina bundelt alle praktische details, voor wie precies wil weten wat inbegrepen is.',
      sections: [
        {
          heading: 'Privé infraroodsauna, nooit gedeeld',
          body: [
            'De infraroodsauna is ontworpen voor spierherstel: de warmte dringt diep in het weefsel door, een echte hulp na een dag skiën, wandelen of mountainbiken. Hij bevindt zich in het appartement, niet in een gemeenschappelijke ruimte van het gebouw — dat betekent dat geen andere gast hem ooit vóór of na jou zal gebruiken.'
          ]
        },
        {
          heading: 'Privé stoombad inbegrepen',
          body: [
            'Naast de sauna beschikt het appartement ook over een privé stoombad: hete stoom voor exclusief gebruik, af te wisselen met de infraroodsauna naar voorkeur, zonder tussen de twee te hoeven kiezen of toegang tot een gedeelde ruimte te moeten boeken.'
          ]
        },
        {
          heading: 'Geen reservering nodig, altijd beschikbaar',
          body: [
            "In tegenstelling tot een hotelspa, waar je vaak een tijdslot moet boeken, zijn sauna en stoombad hier op elk moment van de dag beschikbaar: meteen na terugkomst van de piste, na een zomerse wandeling, of gewoon 's avonds voor het eten."
          ]
        },
        {
          heading: 'Waarom dit beter is dan een gedeelde spa',
          body: [
            'We hebben een speciale gids geschreven die een privésauna vergelijkt met een gedeelde, met de praktische voordelen op het gebied van hygiëne, planning en comfort — nuttig als je nog twijfelt of een appartement met privésauna de juiste keuze is voor jouw verblijf in Livigno.'
          ]
        }
      ],
      highlights: [
        'Privé infraroodsauna, nooit gedeeld met andere gasten',
        'Privé stoombad inbegrepen in het appartement',
        'Altijd beschikbaar, geen reservering nodig',
        'Onderdeel van een appartement van 90 m², 3 slaapkamers, tot 6 personen'
      ],
      faq: [
        {
          q: 'Is de sauna echt privé, of gedeeld met andere appartementen?',
          a: 'Hij is volledig privé: hij bevindt zich in het appartement en is uitsluitend beschikbaar voor de gasten die daar verblijven, nooit gedeeld met andere gasten of andere eenheden.'
        },
        {
          q: 'Moet ik een tijdslot reserveren om de sauna of het stoombad te gebruiken?',
          a: 'Nee. Omdat het geen gedeelde ruimte is, hoeft er geen slot gereserveerd te worden: ze zijn tijdens het hele verblijf op elk moment van de dag beschikbaar.'
        },
        {
          q: 'Zijn sauna en stoombad inbegrepen in de prijs van het verblijf?',
          a: 'Ja, ze maken deel uit van het appartement en brengen geen extra kosten met zich mee bovenop het geboekte verblijf.'
        },
        {
          q: 'Zijn ze ook nuttig in de zomer, niet alleen na het skiën?',
          a: 'Ja: veel gasten gebruiken ze ook in de zomer voor spierherstel na een dag wandelen of mountainbiken, niet alleen in de winter na het skiën.'
        }
      ],
      internalLinkLabels: [
        'Ontdek de volledige wellnessafdeling van Ironwood Livigno',
        'Lees de vergelijking: privésauna vs gedeelde sauna',
        'Ontdek waarom we voor een privésauna kozen voor ons huis'
      ],
      ctaText: 'Check de beschikbaarheid en boek jouw privésauna',
      breadcrumbName: 'Privésauna',
      navLabel: 'Privésauna',
      relatedLinkLabel: 'Bekijk ook open haard, ontbijt en de andere wellnessdetails'
    },
    zh: {
      title: '利维尼奥带私人桑拿的公寓:专属红外线桑拿与土耳其蒸汽浴',
      metaTitle: '利维尼奥私人桑拿 | 带私人土耳其蒸汽浴的公寓',
      metaDescription: '在利维尼奥,一间带私人红外线桑拿与土耳其蒸汽浴的公寓,绝不与他人共用:无需预约,每天任何时间均可使用。',
      eyebrow: '私人桑拿',
      intro:
        '正在寻找利维尼奥带私人桑拿的公寓吗?在Ironwood Livigno,红外线桑拿和土耳其蒸汽浴并非公共水疗中心的付费服务,而是公寓本身的一部分:专属于入住此地的客人,无需遵守任何时刻表,也无需与其他客人共享。本页汇总了所有实用细节,方便您准确了解其中包含的内容。',
      sections: [
        {
          heading: '私人红外线桑拿,绝不与人共用',
          body: [
            '红外线桑拿专为肌肉恢复而设计:热量深入渗透组织,在滑雪、徒步或山地自行车一天之后能带来切实的帮助。它位于公寓内部,而非楼内的公共空间——这意味着不会有任何其他客人在您之前或之后使用它。'
          ]
        },
        {
          heading: '含私人土耳其蒸汽浴',
          body: [
            '除了桑拿房,公寓还配有私人土耳其蒸汽浴:热蒸汽供您独享,可根据个人喜好与红外线桑拿交替使用,无需在两者之间做选择,也无需预约使用公共空间。'
          ]
        },
        {
          heading: '无需预约,随时可用',
          body: [
            '与酒店水疗中心通常需要预约时段不同,这里的桑拿和蒸汽浴一天中任何时刻都可使用:滑雪归来后、夏季徒步之后,或者仅仅是晚餐前的傍晚时分。'
          ]
        },
        {
          heading: '为什么它比共用水疗中心更划算',
          body: [
            '我们撰写了一篇专门的指南,比较私人桑拿与公共桑拿,分析了在卫生、时间安排和舒适度方面的实际优势——如果您仍在考虑带私人桑拿的公寓是否是利维尼奥之行的正确选择,这篇指南将有所帮助。'
          ]
        }
      ],
      highlights: [
        '私人红外线桑拿,绝不与其他客人共用',
        '公寓内含私人土耳其蒸汽浴',
        '随时可用,无需预约',
        '公寓面积90平方米、3间卧室,可住最多6人'
      ],
      faq: [
        {
          q: '桑拿真的是私人的吗,还是与其他公寓共用?',
          a: '完全私密:它位于公寓内部,专供该公寓入住客人使用,绝不与其他客人或其他单元共享。'
        },
        {
          q: '使用桑拿或蒸汽浴需要预约时段吗?',
          a: '不需要。由于这不是公共空间,因此无需预约任何时段:整个住宿期间,一天中任何时刻均可使用。'
        },
        {
          q: '桑拿和蒸汽浴是否包含在住宿价格中?',
          a: '是的,它们属于公寓的一部分,在已预订的住宿费用之外不产生任何额外费用。'
        },
        {
          q: '夏天也适合使用吗,不只是滑雪之后?',
          a: '是的:许多客人也会在夏天使用它们,以在徒步或山地自行车一天后进行肌肉恢复,而不仅限于冬季滑雪之后。'
        }
      ],
      internalLinkLabels: [
        '了解Ironwood Livigno完整的养生板块',
        '阅读对比:私人桑拿与公共桑拿',
        '了解我们为什么为自己的家选择了私人桑拿'
      ],
      ctaText: '查询空房情况并预订您的私人桑拿',
      breadcrumbName: '私人桑拿',
      navLabel: '私人桑拿',
      relatedLinkLabel: '同时了解壁炉、早餐及其他养生细节'
    },
    ja: {
      title: 'リヴィニョの専用サウナ付きアパートメント:専用の赤外線サウナとスチームバス',
      metaTitle: 'リヴィニョの専用サウナ | 専用スチームバス付きアパートメント',
      metaDescription: 'リヴィニョで、専用の赤外線サウナとスチームバスを備えたアパートメント。他の宿泊客とは共有せず、予約不要で毎日いつでもご利用いただけます。',
      eyebrow: '専用サウナ',
      intro:
        'リヴィニョで専用サウナ付きのアパートメントをお探しですか。Ironwood Livignoでは、赤外線サウナとスチームバスは共用スパの有料サービスではなく、アパートメント自体の一部です。ここにご滞在の方だけが利用でき、決まった時間もなく、他の宿泊客と共有することもありません。このページでは、内容を正確に知りたい方のために、実用的な詳細をすべてまとめています。',
      sections: [
        {
          heading: '専用の赤外線サウナ、他の人とは共有しません',
          body: [
            '赤外線サウナは筋肉の回復を目的として設計されており、熱が組織の深部まで浸透します。スキー、トレッキング、マウンテンバイクを楽しんだ一日の後に実感できる助けとなります。アパートメント内にあり、建物の共用スペースにはありません。つまり、あなたの前後に他の宿泊客がそれを使うことは決してありません。'
          ]
        },
        {
          heading: '専用スチームバスも完備',
          body: [
            'サウナに加えて、アパートメントには専用のスチームバスもあります。専用の熱い蒸気を、お好みに応じて赤外線サウナと使い分けることができ、どちらかを選ぶ必要も、共用スペースの利用を予約する必要もありません。'
          ]
        },
        {
          heading: '予約不要、いつでもご利用可能',
          body: [
            '時間枠の予約が必要なことが多いホテルのスパとは異なり、ここではサウナとスチームバスを一日のどの時間でもご利用いただけます。ゲレンデから戻った直後でも、夏のハイキングの後でも、あるいは夕食前の夜のひとときでも構いません。'
          ]
        },
        {
          heading: '共用スパよりお得な理由',
          body: [
            '衛生面、時間の柔軟性、快適さという観点から実用的なメリットをまとめた、専用サウナと共用サウナを比較する専用ガイドを作成しました。リヴィニョでのご滞在に専用サウナ付きアパートメントが適しているかまだ迷っている方に役立つ内容です。'
          ]
        }
      ],
      highlights: [
        '専用の赤外線サウナ、他の宿泊客とは共有しません',
        'アパートメントに専用スチームバスを完備',
        'いつでも利用可能、予約不要',
        '90㎡・3ベッドルーム・最大6名収容のアパートメントの一部'
      ],
      faq: [
        {
          q: 'サウナは本当に専用ですか、それとも他のアパートメントと共有ですか?',
          a: '完全に専用です。アパートメント内にあり、そこに滞在するゲストのみが利用でき、他の宿泊客や他のユニットと共有することは決してありません。'
        },
        {
          q: 'サウナやスチームバスを使うのに時間枠の予約が必要ですか?',
          a: 'いいえ。共用スペースではないため、予約する時間枠はありません。ご滞在中はいつでもご利用いただけます。'
        },
        {
          q: 'サウナとスチームバスは宿泊料金に含まれていますか?',
          a: 'はい、アパートメントの一部であり、ご予約いただいた宿泊料金以外の追加費用は発生しません。'
        },
        {
          q: 'スキーの後だけでなく、夏にも役立ちますか?',
          a: 'はい。多くのゲストが、冬のスキー後だけでなく、夏のトレッキングやマウンテンバイクの後の筋肉の回復にも利用しています。'
        }
      ],
      internalLinkLabels: [
        'Ironwood Livignoのウェルネスセクション全体をご覧ください',
        '比較記事をお読みください:専用サウナ vs 共用サウナ',
        '私たちが自宅に専用サウナを選んだ理由をご覧ください'
      ],
      ctaText: '空室状況を確認して専用サウナをご予約ください',
      breadcrumbName: '専用サウナ',
      navLabel: '専用サウナ',
      relatedLinkLabel: '暖炉、朝食、その他のウェルネスの詳細もご覧ください'
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
        '3 Schlafzimmer, 2 Bäder, 90 m²: entdecken Sie die detaillierte Aufteilung der Wohnung in Livigno, Zimmer für Zimmer.',
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
        "3 chambres, 2 salles de bains, 90 m² : découvrez la disposition détaillée de l'appartement à Livigno, pièce par pièce.",
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
    },
    da: {
      title: 'Lejlighedens 3 soveværelser i Livigno: layout, senge og detaljer',
      metaTitle: 'Lejlighed med 3 Soveværelser i Livigno | Værelsesindretning',
      metaDescription: '3 soveværelser, 2 badeværelser, 90 m²: oplev den detaljerede indretning af lejligheden i Livigno, værelse for værelse.',
      eyebrow: 'Soveværelserne',
      intro:
        'Leder du efter en lejlighed med 3 soveværelser i Livigno og vil vide præcis, hvordan rummene er indrettet, inden du booker? Ironwood Livigno strækker sig over 90 m² med 3 soveværelser og 2 fulde badeværelser, til op til 6 gæster, kun 100 meter til fods fra skiliftene. Her finder du detaljerne værelse for værelse, så du ved præcis, hvad du kan forvente.',
      sections: [
        {
          heading: 'Soveværelse 1 — Dobbeltværelse (sammensatte senge)',
          body: [
            'To enkeltsenge samlet med en topmadras, for den uafbrudte komfort af en rigtig dobbeltseng — ideel til et par, eller til gruppens forældre, der stadig foretrækker fleksibiliteten ved to enkeltsenge.'
          ]
        },
        {
          heading: 'Soveværelse 2 — Værelse med enkeltsenge',
          body: [
            'To enkeltsenge, der kan samles efter ønske til en dobbeltseng — praktisk til børn, større unge eller venner, der rejser sammen og hellere vil undgå at dele en fast dobbeltseng.'
          ]
        },
        {
          heading: 'Soveværelse 3 — Hoveddobbeltværelse',
          body: [
            'Dobbeltseng med topmadras for maksimal komfort: dette er lejlighedens hovedsoveværelse, designet til dem, der søger mere privatliv end i de to andre værelser.'
          ]
        },
        {
          heading: '2 fulde badeværelser, delt mellem soveværelserne',
          body: [
            'Hele lejligheden har 2 fulde badeværelser til rådighed — en indretning designet specifikt til at undgå morgenkøer, når lejligheden huser en hel familie eller gruppe — en detalje, der gør en konkret forskel sammenlignet med en typisk to-værelses lejlighed med kun ét badeværelse.'
          ]
        }
      ],
      highlights: [
        '3 soveværelser, 90 m² i alt',
        '2 fulde badeværelser delt mellem soveværelserne',
        'Op til 6 sovepladser til familier og grupper',
        'Fleksibel indretning: enkelt- eller dobbeltsenge',
        '100 m fra skiliftene'
      ],
      faq: [
        {
          q: 'Hvor mange personer kan komfortabelt sove i lejligheden?',
          a: 'Op til 6 personer, fordelt på de 3 soveværelser: ét med enkeltsenge samlet i dobbeltseng-stil, ét med adskillelige enkeltsenge, og hoveddobbeltværelset.'
        },
        {
          q: 'Kan enkeltsengene samles til en dobbeltseng?',
          a: 'Ja, i Soveværelse 2 kan de to enkeltsenge samles efter ønske. I Soveværelse 1 er de allerede samlet med en topmadras, for den uafbrudte komfort af en dobbeltseng.'
        },
        {
          q: 'Er der mere end ét badeværelse?',
          a: 'Ja, lejligheden har 2 fulde badeværelser, delt mellem de 3 soveværelser — praktisk for familier og grupper, der bruger alle rummene samtidig.'
        }
      ],
      internalLinkLabels: [
        'Se hvorfor lejligheden er designet til familier og grupper',
        'Se hvem der har renoveret lejligheden, og hvorfor',
        'Se adresse, parkering og hvordan du kommer hertil'
      ],
      ctaText: 'Tjek ledighed for dine soveværelser',
      breadcrumbName: 'Soveværelserne',
      navLabel: 'Soveværelserne',
      relatedLinkLabel: 'Se alle detaljer designet til familier og grupper'
    },
    pl: {
      title: '3 sypialnie w apartamencie w Livigno: układ, łóżka i szczegóły',
      metaTitle: 'Apartament z 3 Sypialniami w Livigno | Układ Pomieszczeń',
      metaDescription: '3 sypialnie, 2 łazienki, 90 m²: poznaj szczegółowy układ apartamentu w Livigno, pokój po pokoju, pomyślany dla rodzin i grup do 6 osób.',
      eyebrow: 'Sypialnie',
      intro:
        'Szukasz apartamentu z 3 sypialniami w Livigno i chcesz dokładnie wiedzieć, jak zorganizowane są przestrzenie przed rezerwacją? Ironwood Livigno rozciąga się na 90 m² z 3 sypialniami i 2 pełnymi łazienkami, dla maksymalnie 6 gości, zaledwie 100 metrów pieszo od wyciągów narciarskich. Tutaj znajdziesz szczegóły pokój po pokoju, więc dokładnie wiesz, czego się spodziewać.',
      sections: [
        {
          heading: 'Sypialnia 1 — Pokój Dwuosobowy (połączone łóżka)',
          body: [
            'Dwa pojedyncze łóżka połączone topperem, dla nieprzerwanego komfortu prawdziwego łóżka małżeńskiego — idealne dla pary lub rodziców z grupy, którzy wciąż preferują elastyczność dwóch pojedynczych łóżek.'
          ]
        },
        {
          heading: 'Sypialnia 2 — Pokój z Pojedynczymi Łóżkami',
          body: [
            'Dwa pojedyncze łóżka, które można połączyć na życzenie w łóżko małżeńskie — wygodne dla dzieci, starszych nastolatków lub przyjaciół podróżujących razem, którzy wolą nie dzielić stałego łóżka małżeńskiego.'
          ]
        },
        {
          heading: 'Sypialnia 3 — Główny Pokój Małżeński',
          body: [
            'Łóżko małżeńskie z topperem dla maksymalnego komfortu: to główna sypialnia apartamentu, pomyślana dla tych, którzy szukają większej prywatności niż w pozostałych dwóch pokojach.'
          ]
        },
        {
          heading: '2 pełne łazienki, wspólne dla sypialni',
          body: [
            'Do dyspozycji całego apartamentu są 2 pełne łazienki — układ zaprojektowany specjalnie, by uniknąć porannych kolejek, gdy apartament gości pełną rodzinę lub grupę — szczegół, który stanowi realną różnicę w porównaniu do typowego dwupokojowego apartamentu z tylko jedną łazienką.'
          ]
        }
      ],
      highlights: [
        '3 sypialnie, łącznie 90 m²',
        '2 pełne łazienki wspólne dla sypialni',
        'Do 6 miejsc noclegowych dla rodzin i grup',
        'Elastyczny układ: łóżka pojedyncze lub małżeńskie',
        '100 m od wyciągów narciarskich'
      ],
      faq: [
        {
          q: 'Ile osób może wygodnie spać w apartamencie?',
          a: 'Do 6 osób, rozmieszczonych w 3 sypialniach: jedna z pojedynczymi łóżkami połączonymi w stylu małżeńskim, jedna z rozdzielnymi pojedynczymi łóżkami oraz główna sypialnia małżeńska.'
        },
        {
          q: 'Czy pojedyncze łóżka można połączyć w łóżko małżeńskie?',
          a: 'Tak, w Sypialni 2 dwa pojedyncze łóżka można połączyć na życzenie. W Sypialni 1 są już połączone topperem, dla nieprzerwanego komfortu łóżka małżeńskiego.'
        },
        {
          q: 'Czy jest więcej niż jedna łazienka?',
          a: 'Tak, apartament ma 2 pełne łazienki, wspólne dla 3 sypialni — wygodne dla rodzin i grup korzystających jednocześnie ze wszystkich przestrzeni.'
        }
      ],
      internalLinkLabels: [
        'Poznaj powody, dla których apartament jest pomyślany dla rodzin i grup',
        'Dowiedz się, kto wyremontował apartament i dlaczego',
        'Zobacz adres, parking i jak dojechać'
      ],
      ctaText: 'Sprawdź dostępność swoich sypialni',
      breadcrumbName: 'Sypialnie',
      navLabel: 'Sypialnie',
      relatedLinkLabel: 'Poznaj wszystkie szczegóły pomyślane dla rodzin i grup'
    },
    cs: {
      title: '3 ložnice apartmánu v Livignu: rozvržení, postele a detaily',
      metaTitle: 'Apartmán se 3 Ložnicemi v Livignu | Rozvržení Pokojů',
      metaDescription: '3 ložnice, 2 koupelny, 90 m²: objevte podrobné rozvržení apartmánu v Livignu, pokoj po pokoji, navrženého pro rodiny a skupiny až 6 osob.',
      eyebrow: 'Ložnice',
      intro:
        'Hledáte apartmán se 3 ložnicemi v Livignu a chcete přesně vědět, jak jsou prostory uspořádány před rezervací? Ironwood Livigno se rozkládá na 90 m² se 3 ložnicemi a 2 plnohodnotnými koupelnami, pro maximálně 6 hostů, pouhých 100 metrů pěšky od lyžařských vleků. Zde najdete detaily pokoj po pokoji, abyste přesně věděli, co očekávat.',
      sections: [
        {
          heading: 'Ložnice 1 — Dvoulůžkový pokoj (spojené postele)',
          body: [
            'Dvě jednolůžkové postele spojené topperem, pro nepřerušovaný komfort skutečné manželské postele — ideální pro pár nebo pro rodiče ve skupině, kteří přesto preferují flexibilitu dvou jednolůžkových postelí.'
          ]
        },
        {
          heading: 'Ložnice 2 — Pokoj s oddělenými lůžky',
          body: [
            'Dvě jednolůžkové postele, které lze na přání spojit do manželské postele — praktické pro děti, starší děti nebo přátele cestující společně, kteří dávají přednost nesdílení pevné manželské postele.'
          ]
        },
        {
          heading: 'Ložnice 3 — Hlavní manželská ložnice',
          body: [
            'Manželská postel s topperem pro maximální komfort: jde o hlavní ložnici apartmánu, navrženou pro ty, kdo hledají více soukromí než v ostatních dvou pokojích.'
          ]
        },
        {
          heading: '2 plnohodnotné koupelny, sdílené mezi ložnicemi',
          body: [
            'K dispozici celému apartmánu jsou 2 plnohodnotné koupelny — uspořádání navržené speciálně tak, aby se předešlo ranním frontám, když apartmán hostí kompletní rodinu nebo skupinu — detail, který představuje konkrétní rozdíl oproti typickému dvoupokojovému apartmánu s pouze jednou koupelnou.'
          ]
        }
      ],
      highlights: [
        '3 ložnice, celkem 90 m²',
        '2 plnohodnotné koupelny sdílené mezi ložnicemi',
        'Až 6 lůžek pro rodiny a skupiny',
        'Flexibilní uspořádání: jednolůžkové nebo manželské postele',
        '100 m od lyžařských vleků'
      ],
      faq: [
        {
          q: 'Kolik lidí může v apartmánu pohodlně spát?',
          a: 'Až 6 osob, rozmístěných ve 3 ložnicích: jedna s jednolůžkovými postelemi spojenými do stylu manželské postele, jedna s oddělitelnými jednolůžkovými postelemi a hlavní manželská ložnice.'
        },
        {
          q: 'Mohou být jednolůžkové postele spojeny do manželské postele?',
          a: 'Ano, v Ložnici 2 lze obě jednolůžkové postele na přání spojit. V Ložnici 1 jsou již spojené topperem, pro nepřerušovaný komfort manželské postele.'
        },
        {
          q: 'Je v apartmánu více než jedna koupelna?',
          a: 'Ano, apartmán má 2 plnohodnotné koupelny, sdílené mezi 3 ložnicemi — praktické pro rodiny a skupiny, které využívají všechny prostory současně.'
        }
      ],
      internalLinkLabels: [
        'Zjistěte, proč je apartmán navržen pro rodiny a skupiny',
        'Zjistěte, kdo apartmán zrenovoval a proč',
        'Podívejte se na adresu, parkování a jak se k nám dostat'
      ],
      ctaText: 'Ověřte dostupnost svých ložnic',
      breadcrumbName: 'Ložnice',
      navLabel: 'Ložnice',
      relatedLinkLabel: 'Objevte všechny detaily navržené pro rodiny a skupiny'
    },
    no: {
      title: 'Leilighetens 3 soverom i Livigno: layout, senger og detaljer',
      metaTitle: 'Leilighet med 3 Soverom i Livigno | Romoppsett',
      metaDescription: '3 soverom, 2 bad, 90 m²: oppdag den detaljerte planløsningen til leiligheten i Livigno, rom for rom, utformet for familier og grupper på opptil 6 personer.',
      eyebrow: 'Soverommene',
      intro:
        'Leter du etter en leilighet med 3 soverom i Livigno og vil vite nøyaktig hvordan rommene er organisert før du booker? Ironwood Livigno strekker seg over 90 m² med 3 soverom og 2 fullverdige bad, for opptil 6 gjester, bare 100 meter til fots fra skiheisene. Her finner du detaljene rom for rom, slik at du vet nøyaktig hva du kan forvente.',
      sections: [
        {
          heading: 'Soverom 1 — Dobbeltrom (sammenkoblede senger)',
          body: [
            'To enkeltsenger koblet sammen med en topmadrass, for den uavbrutte komforten av en ekte dobbeltseng — ideelt for et par, eller for foreldrene i gruppen som likevel foretrekker fleksibiliteten til to enkeltsenger.'
          ]
        },
        {
          heading: 'Soverom 2 — Rom med enkeltsenger',
          body: [
            'To enkeltsenger, som kan kobles sammen på forespørsel til en dobbeltseng — praktisk for barn, eldre ungdom eller venner som reiser sammen og heller vil unngå å dele en fast dobbeltseng.'
          ]
        },
        {
          heading: 'Soverom 3 — Hoveddobbeltrom',
          body: [
            'Dobbeltseng med topmadrass for maksimal komfort: dette er leilighetens hovedsoverom, utformet for dem som søker mer privatliv enn i de to andre rommene.'
          ]
        },
        {
          heading: '2 fullverdige bad, delt mellom soverommene',
          body: [
            'Hele leiligheten har 2 fullverdige bad tilgjengelig — en løsning spesielt utformet for å unngå morgenkøer når leiligheten huser en hel familie eller gruppe — en detalj som gjør en konkret forskjell sammenlignet med en typisk to-roms leilighet med bare ett bad.'
          ]
        }
      ],
      highlights: [
        '3 soverom, 90 m² totalt',
        '2 fullverdige bad delt mellom soverommene',
        'Opptil 6 sengeplasser for familier og grupper',
        'Fleksibel løsning: enkeltsenger eller dobbeltsenger',
        '100 m fra skiheisene'
      ],
      faq: [
        {
          q: 'Hvor mange personer kan sove komfortabelt i leiligheten?',
          a: 'Opptil 6 personer, fordelt på de 3 soverommene: ett med enkeltsenger koblet sammen i dobbeltseng-stil, ett med adskillbare enkeltsenger, og hoveddobbeltrommet.'
        },
        {
          q: 'Kan enkeltsengene kobles sammen til en dobbeltseng?',
          a: 'Ja, i Soverom 2 kan de to enkeltsengene kobles sammen på forespørsel. I Soverom 1 er de allerede koblet sammen med en topmadrass, for den uavbrutte komforten til en dobbeltseng.'
        },
        {
          q: 'Er det mer enn ett bad?',
          a: 'Ja, leiligheten har 2 fullverdige bad, delt mellom de 3 soverommene — praktisk for familier og grupper som bruker alle rommene samtidig.'
        }
      ],
      internalLinkLabels: [
        'Se hvorfor leiligheten er utformet for familier og grupper',
        'Se hvem som har renovert leiligheten, og hvorfor',
        'Se adresse, parkering og hvordan du kommer hit'
      ],
      ctaText: 'Sjekk tilgjengelighet for dine soverom',
      breadcrumbName: 'Soverommene',
      navLabel: 'Soverommene',
      relatedLinkLabel: 'Se alle detaljer utformet for familier og grupper'
    },
    nl: {
      title: 'De 3 slaapkamers van het appartement in Livigno: indeling, bedden en details',
      metaTitle: 'Appartement met 3 Slaapkamers in Livigno',
      metaDescription: '3 slaapkamers, 2 badkamers, 90 m²: ontdek de gedetailleerde indeling van het appartement in Livigno, kamer voor kamer.',
      eyebrow: 'De slaapkamers',
      intro:
        'Ben je op zoek naar een appartement met 3 slaapkamers in Livigno en wil je precies weten hoe de ruimtes zijn ingedeeld voordat je boekt? Ironwood Livigno beslaat 90 m² met 3 slaapkamers en 2 volledige badkamers, voor maximaal 6 gasten, op slechts 100 meter lopen van de skiliften. Hier vind je de details per kamer, zodat je precies weet wat je kunt verwachten.',
      sections: [
        {
          heading: 'Slaapkamer 1 — Tweepersoonskamer (samengevoegde bedden)',
          body: [
            'Twee eenpersoonsbedden verbonden door een topper, voor het ononderbroken comfort van een echt tweepersoonsbed — ideaal voor een koppel, of voor de ouders van de groep die toch de flexibiliteit van twee eenpersoonsbedden verkiezen.'
          ]
        },
        {
          heading: 'Slaapkamer 2 — Kamer met Eenpersoonsbedden',
          body: [
            'Twee eenpersoonsbedden, die op aanvraag kunnen worden samengevoegd tot een tweepersoonsbed — handig voor kinderen, oudere kids of vrienden die samen reizen en liever geen vast tweepersoonsbed delen.'
          ]
        },
        {
          heading: 'Slaapkamer 3 — Hoofdtweepersoonskamer',
          body: [
            'Tweepersoonsbed met topper voor maximaal comfort: dit is de hoofdslaapkamer van het appartement, ontworpen voor wie meer privacy zoekt dan in de andere twee kamers.'
          ]
        },
        {
          heading: '2 volledige badkamers, gedeeld tussen de slaapkamers',
          body: [
            'Voor het hele appartement zijn er 2 volledige badkamers beschikbaar — een indeling die specifiek is ontworpen om ochtendrijen te vermijden wanneer het appartement een volledig gezin of groep herbergt — een detail dat een concreet verschil maakt in vergelijking met een typisch tweekamerappartement met slechts één badkamer.'
          ]
        }
      ],
      highlights: [
        '3 slaapkamers, 90 m² in totaal',
        '2 volledige badkamers gedeeld tussen de slaapkamers',
        'Tot 6 slaapplaatsen voor gezinnen en groepen',
        'Flexibele indeling: eenpersoons- of tweepersoonsbedden',
        '100 m van de skiliften'
      ],
      faq: [
        {
          q: 'Hoeveel mensen kunnen comfortabel slapen in het appartement?',
          a: 'Tot 6 personen, verdeeld over de 3 slaapkamers: één met eenpersoonsbedden samengevoegd in tweepersoonsstijl, één met scheidbare eenpersoonsbedden, en de hoofdtweepersoonskamer.'
        },
        {
          q: 'Kunnen de eenpersoonsbedden worden samengevoegd tot een tweepersoonsbed?',
          a: 'Ja, in Slaapkamer 2 kunnen de twee eenpersoonsbedden op aanvraag worden samengevoegd. In Slaapkamer 1 zijn ze al samengevoegd met een topper, voor het ononderbroken comfort van een tweepersoonsbed.'
        },
        {
          q: 'Is er meer dan één badkamer?',
          a: 'Ja, het appartement heeft 2 volledige badkamers, gedeeld tussen de 3 slaapkamers — handig voor gezinnen en groepen die alle ruimtes tegelijk gebruiken.'
        }
      ],
      internalLinkLabels: [
        'Ontdek waarom het appartement is ontworpen voor gezinnen en groepen',
        'Ontdek wie het appartement heeft gerenoveerd, en waarom',
        'Bekijk het adres, parkeren en hoe je hier komt'
      ],
      ctaText: 'Check de beschikbaarheid voor jouw slaapkamers',
      breadcrumbName: 'De slaapkamers',
      navLabel: 'De slaapkamers',
      relatedLinkLabel: 'Ontdek alle details ontworpen voor gezinnen en groepen'
    },
    zh: {
      title: '利维尼奥公寓的3间卧室:布局、床型与细节',
      metaTitle: '利维尼奥3卧室公寓 | 房间布局',
      metaDescription: '3间卧室、2间浴室、90平方米:详细了解利维尼奥公寓逐间卧室的布局,专为最多6人的家庭或团体设计。',
      eyebrow: '卧室介绍',
      intro:
        '正在寻找利维尼奥的3卧室公寓,想在预订前准确了解空间布局吗?Ironwood Livigno占地90平方米,拥有3间卧室和2间独立浴室,最多可接待6位客人,距滑雪缆车仅100米步行路程。这里为您提供逐间卧室的详细介绍,让您准确了解入住后的情况。',
      sections: [
        {
          heading: '卧室1——双人房(拼接床)',
          body: [
            '两张单人床通过加厚床垫拼接而成,带来如真正双人床般连续不间断的舒适感——非常适合情侣,也适合仍偏好两张单人床灵活性的团体中的父母。'
          ]
        },
        {
          heading: '卧室2——单人床房',
          body: [
            '两张单人床,可应要求拼接成双人床——适合儿童、年纪较大的孩子,或结伴出行但不想共用固定双人床的朋友。'
          ]
        },
        {
          heading: '卧室3——主双人卧室',
          body: [
            '带加厚床垫的双人床,提供极致舒适感:这是公寓的主卧室,专为寻求比另外两间房更多隐私的客人设计。'
          ]
        },
        {
          heading: '2间独立浴室,供各卧室共用',
          body: [
            '整套公寓共设有2间独立浴室——这一布局专为避免公寓接待完整家庭或团体时早晨排队等候而设计,与仅有一间浴室的典型两居室公寓相比,这一细节带来了实实在在的差异。'
          ]
        }
      ],
      highlights: [
        '3间卧室,总面积90平方米',
        '2间独立浴室,供各卧室共用',
        '最多可容纳6人的家庭或团体入住',
        '灵活布局:单人床或双人床可选',
        '距滑雪缆车100米'
      ],
      faq: [
        {
          q: '公寓最多能舒适容纳多少人入住?',
          a: '最多6人,分布在3间卧室中:一间为拼接成双人床风格的单人床,一间为可分开的单人床,还有一间是主双人卧室。'
        },
        {
          q: '单人床可以拼接成双人床吗?',
          a: '可以,卧室2的两张单人床可应要求拼接。而卧室1的两张单人床已通过加厚床垫拼接完成,提供连续不间断的双人床舒适感。'
        },
        {
          q: '公寓是否有不止一间浴室?',
          a: '是的,公寓设有2间独立浴室,供3间卧室共用——非常适合同时使用所有空间的家庭和团体。'
        }
      ],
      internalLinkLabels: [
        '了解公寓为何专为家庭和团体设计',
        '了解公寓的翻修者及翻修原因',
        '查看地址、停车信息及到达方式'
      ],
      ctaText: '查询您卧室入住的空房情况',
      breadcrumbName: '卧室介绍',
      navLabel: '卧室介绍',
      relatedLinkLabel: '了解所有专为家庭和团体设计的细节'
    },
    ja: {
      title: 'リヴィニョのアパートメントの3つのベッドルーム:間取り、ベッド、詳細',
      metaTitle: 'リヴィニョの3ベッドルーム・アパートメント | 部屋の間取り',
      metaDescription: '3ベッドルーム、2バスルーム、90㎡。最大6名のご家族・グループのために設計された、リヴィニョのアパートメントの部屋ごとの詳しい間取りをご紹介します。',
      eyebrow: 'ベッドルームについて',
      intro:
        'リヴィニョで3ベッドルームのアパートメントをお探しで、ご予約前に空間の配置を正確に知りたいですか。Ironwood Livignoは90㎡の広さに3つのベッドルームと2つの完全なバスルームを備え、最大6名まで宿泊可能で、スキーリフトから徒歩わずか100mの場所にあります。ここでは部屋ごとの詳細をご紹介しますので、何を期待できるか正確に把握できます。',
      sections: [
        {
          heading: 'ベッドルーム1 — ダブルルーム(連結ベッド)',
          body: [
            'トッパーで連結された2台のシングルベッドが、本物のダブルベッドのような途切れのない快適さを提供します。カップルにも、2台のシングルベッドの柔軟性を好むグループのご両親にも最適です。'
          ]
        },
        {
          heading: 'ベッドルーム2 — ツインルーム',
          body: [
            'ご要望に応じて連結してダブルベッドにできる2台のシングルベッド。お子様、年上のお子様、または固定のダブルベッドを共有したくない一緒に旅行する友人同士に便利です。'
          ]
        },
        {
          heading: 'ベッドルーム3 — メインダブルルーム',
          body: [
            '最大限の快適さを実現するトッパー付きダブルベッド。他の2部屋よりもプライバシーを求める方のために設計された、アパートメントのメインベッドルームです。'
          ]
        },
        {
          heading: '2つの完全なバスルーム、各ベッドルームで共用',
          body: [
            'アパートメント全体で2つの完全なバスルームをご利用いただけます。この配置は、アパートメントにご家族やグループが満室でご宿泊の際、朝の順番待ちを避けられるよう特別に設計されており、バスルームが1つしかない典型的な2ルームタイプのアパートメントとは明確な違いを生み出しています。'
          ]
        }
      ],
      highlights: [
        '3ベッドルーム、合計90㎡',
        '各ベッドルームで共用できる2つの完全なバスルーム',
        'ご家族・グループ向けに最大6名まで宿泊可能',
        '柔軟な構成:シングルベッドまたはダブルベッド',
        'スキーリフトから100m'
      ],
      faq: [
        {
          q: 'アパートメントには何名まで快適に宿泊できますか?',
          a: '最大6名まで、3つのベッドルームに分かれてご宿泊いただけます。ダブルベッド風に連結されたシングルベッドの部屋、分離可能なシングルベッドの部屋、そしてメインのダブルベッドルームです。'
        },
        {
          q: 'シングルベッドを連結してダブルベッドにできますか?',
          a: 'はい、ベッドルーム2の2台のシングルベッドはご要望に応じて連結できます。ベッドルーム1ではすでにトッパーで連結されており、途切れのないダブルベッドの快適さをお楽しみいただけます。'
        },
        {
          q: 'バスルームは1つ以上ありますか?',
          a: 'はい、アパートメントには3つのベッドルームで共用する2つの完全なバスルームがあります。すべての空間を同時に使用するご家族やグループに便利です。'
        }
      ],
      internalLinkLabels: [
        'アパートメントがご家族やグループ向けに設計されている理由をご覧ください',
        'アパートメントを改装したのが誰か、その理由をご覧ください',
        '住所、駐車場、アクセス方法をご覧ください'
      ],
      ctaText: 'ベッドルームの空室状況を確認する',
      breadcrumbName: 'ベッドルームについて',
      navLabel: 'ベッドルームについて',
      relatedLinkLabel: 'ご家族・グループ向けに設計されたすべての詳細をご覧ください'
    }
  },
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
