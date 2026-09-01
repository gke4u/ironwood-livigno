// Partial multilingual coverage for the blog: the 3 posts with the
// broadest international appeal (getting there, skiing, family) translated
// into the two largest non-Italian markets for Livigno tourism (en, de).
// The other 3 posts, and the pl/nl/cs languages, stay Italian-only for now
// — this file's shape (one entry per slug, one sub-entry per locale) is the
// exact pattern to extend when there's time to translate more; no code
// changes needed, just new dictionary entries.
//
// Only a subset of BlogPost is here (no slug/date/image — those stay
// shared with the Italian original in blog.ts, since it's the same trip,
// same photo, same publish date, just written in another language).
import type { BlogSection } from './blog';

export type BlogTranslation = {
  title: string;
  description: string;
  intro: string;
  sections: BlogSection[];
};

export const translatedBlogLocales = ['en', 'de'] as const;
export type TranslatedBlogLocale = (typeof translatedBlogLocales)[number];

export const blogTranslations: Record<string, Partial<Record<TranslatedBlogLocale, BlogTranslation>>> = {
  'come-arrivare-a-livigno': {
    en: {
      title: 'How to Get to Livigno: A Practical Guide',
      description:
        "Train, car or plane: how to reach Livigno from Milan and the main airports, and what to know before you go.",
      intro:
        "Livigno sits in an Alpine basin in the province of Sondrio, right on the Swiss border, and is one of the few duty-free zones in Italy: that means lower prices on fuel, spirits and other goods, and it's one of the reasons the town is so popular even just for a day of shopping.",
      sections: [
        {
          heading: 'By train',
          paragraphs: [
            'The nearest station is Tirano, about 70 km from Livigno. From Milano Centrale, take a regional train (or the famous Bernina Express red train if arriving from Switzerland) to Tirano, then a scheduled bus with a change in Bormio completes the journey. Allow 3-4 hours in total from Milan.'
          ]
        },
        {
          heading: 'By car',
          paragraphs: [
            'From Milan, take the SS36 to Colico, then the SS38 toward Bormio, and finally the Foscagno Pass (or the Forcola di Livigno if arriving from Switzerland). The drive takes about 3 hours, a bit longer in heavy snow, when snow chains or winter tyres may be required.'
          ]
        },
        {
          heading: 'By plane',
          paragraphs: [
            "The most convenient airports are Milan Bergamo (Orio al Serio) and Milan Malpensa/Linate, around 180-230 km away. From November to April, the LivignoExpress transfer service runs, connecting Livigno directly to the main Lombardy airports by dedicated bus — handy if you'd rather not drive in the mountains."
          ]
        },
        {
          heading: 'A practical tip',
          paragraphs: [
            "If you're arriving in winter, check the conditions of the Foscagno Pass before setting off (it can close during heavy snowfall) and consider winter tyres or chains. Once you've arrived, Ironwood Livigno is just 100 metres from the ski lifts: park the car and, for the rest of the holiday, you can get around almost entirely on foot."
          ]
        }
      ]
    },
    de: {
      title: 'Anreise nach Livigno: praktischer Reiseführer',
      description:
        'Zug, Auto oder Flugzeug: So erreichen Sie Livigno von Mailand und den wichtigsten Flughäfen aus – und was Sie vorher wissen sollten.',
      intro:
        'Livigno liegt in einem Alpenkessel in der Provinz Sondrio, direkt an der Schweizer Grenze, und ist eine der wenigen zollfreien Zonen Italiens: Das bedeutet niedrigere Preise für Benzin, Spirituosen und andere Waren – einer der Gründe, warum der Ort auch für einen reinen Einkaufstag so beliebt ist.',
      sections: [
        {
          heading: 'Mit dem Zug',
          paragraphs: [
            'Der nächstgelegene Bahnhof ist Tirano, etwa 70 km von Livigno entfernt. Vom Mailänder Hauptbahnhof (Milano Centrale) fährt man mit einem Regionalzug (oder dem berühmten roten Bernina-Express, wenn man aus der Schweiz kommt) bis Tirano, von dort vervollständigt ein Linienbus mit Umstieg in Bormio die Fahrt. Rechnen Sie insgesamt mit 3–4 Stunden ab Mailand.'
          ]
        },
        {
          heading: 'Mit dem Auto',
          paragraphs: [
            'Von Mailand aus fährt man auf der SS36 bis Colico, dann auf der SS38 Richtung Bormio und schließlich über den Foscagno-Pass (oder die Forcola di Livigno, wenn man aus der Schweiz kommt). Die Fahrt dauert etwa 3 Stunden, bei starkem Schneefall etwas länger – dann können Schneeketten oder Winterreifen vorgeschrieben sein.'
          ]
        },
        {
          heading: 'Mit dem Flugzeug',
          paragraphs: [
            'Die praktischsten Flughäfen sind Mailand Bergamo (Orio al Serio) sowie Mailand Malpensa/Linate, etwa 180–230 km entfernt. Von November bis April verkehrt der Transferdienst LivignoExpress, der Livigno mit eigenen Bussen direkt mit den wichtigsten lombardischen Flughäfen verbindet – praktisch, wenn man nicht selbst in die Berge fahren möchte.'
          ]
        },
        {
          heading: 'Ein praktischer Tipp',
          paragraphs: [
            'Wer im Winter anreist, sollte vorab die Bedingungen am Foscagno-Pass prüfen (er kann bei starkem Schneefall gesperrt werden) und Winterreifen oder Ketten einplanen. Einmal angekommen, liegt Ironwood Livigno nur 100 Meter von den Skiliften entfernt: Auto parken, und für den Rest des Urlaubs kann man sich fast ausschließlich zu Fuß bewegen.'
          ]
        }
      ]
    }
  },
  'sci-a-livigno-guida-carosello-3000': {
    en: {
      title: 'Skiing in Livigno: A Guide to the Carosello 3000 Ski Area',
      description:
        "What to know about Livigno's ski area, the Carosello 3000 side, and how to plan your days on the snow.",
      intro:
        "Livigno's ski area spans two sides overlooking the basin: Carosello 3000, the largest and sunniest, and Mottolino, more geared toward freeride skiing and, in summer, its bike park. Together they offer runs for every level, from beginners to expert skiers, plus a snowpark (Livigno Park) for anyone who loves jumps and rails.",
      sections: [
        {
          heading: 'When to ski: the 2025/2026 season',
          paragraphs: [
            'The 2025/2026 winter season at Carosello 3000 runs indicatively from 29 November to 3 May — a long window compared to many other Alpine resorts, which makes Livigno a good choice even for skiing early or late in the season, when lifts elsewhere are already closed.'
          ]
        },
        {
          heading: 'More than just downhill runs',
          paragraphs: [
            'Livigno is also known for cross-country skiing, with tracks running through the town centre and the valley — a calmer activity, well suited to families or anyone wanting a day off from the downhill slopes.'
          ]
        },
        {
          heading: 'The advantage of staying at Ironwood Livigno',
          paragraphs: [
            'For guests staying at Ironwood Livigno, the practical advantage is proximity: 100 metres from the ski lifts and 50 metres from the ski school and equipment rental. That means no need for a car or shuttle to reach the slopes, and the option to head back to the apartment at lunchtime, or right after the last run, to warm up in the private infrared sauna before dinner — one of the things many guests point out as a highlight in their reviews.'
          ]
        },
        {
          heading: 'One tip',
          paragraphs: [
            'Buy your ski pass online in advance whenever possible, to avoid queues at the ticket offices during peak season (Christmas, New Year, February).'
          ]
        }
      ]
    },
    de: {
      title: 'Skifahren in Livigno: Leitfaden zum Skigebiet Carosello 3000',
      description:
        'Wissenswertes über das Skigebiet von Livigno, die Carosello-3000-Seite und wie Sie Ihre Skitage am besten planen.',
      intro:
        'Das Skigebiet von Livigno erstreckt sich über zwei Seiten des Talkessels: Carosello 3000, das größte und sonnigste Gebiet, und Mottolino, das eher auf Freeride-Skifahren und im Sommer auf den Bikepark ausgerichtet ist. Zusammen bieten sie Pisten für jedes Niveau, von Anfängern bis zu erfahrenen Skifahrern, sowie einen Snowpark (Livigno Park) für alle, die Sprünge und Rails lieben.',
      sections: [
        {
          heading: 'Wann man Ski fahren kann: die Saison 2025/2026',
          paragraphs: [
            'Die Wintersaison 2025/2026 in Carosello 3000 dauert voraussichtlich vom 29. November bis 3. Mai – ein im Vergleich zu vielen anderen Alpenorten langer Zeitraum, der Livigno auch für Skifahrer interessant macht, die zu Saisonbeginn oder -ende fahren möchten, wenn anderswo die Lifte bereits geschlossen sind.'
          ]
        },
        {
          heading: 'Nicht nur Abfahrtspisten',
          paragraphs: [
            'Livigno ist auch für den Langlauf bekannt, mit Loipen, die durch das Ortszentrum und das Tal führen – eine ruhigere Aktivität, die sich gut für Familien oder für alle eignet, die sich mal eine Pause von den Abfahrtspisten gönnen möchten.'
          ]
        },
        {
          heading: 'Der Vorteil eines Aufenthalts im Ironwood Livigno',
          paragraphs: [
            'Für Gäste im Ironwood Livigno liegt der praktische Vorteil in der Nähe: 100 Meter von den Skiliften und 50 Meter von Skischule und Ausrüstungsverleih entfernt. Das bedeutet, dass man weder Auto noch Shuttle braucht, um die Pisten zu erreichen, und in der Mittagspause oder direkt nach der letzten Abfahrt ins Apartment zurückkehren kann, um sich vor dem Abendessen in der privaten Infrarotsauna aufzuwärmen – ein Punkt, den viele Gäste in ihren Bewertungen besonders hervorheben.'
          ]
        },
        {
          heading: 'Ein Tipp',
          paragraphs: [
            'Kaufen Sie Ihren Skipass wenn möglich vorab online, um in der Hochsaison (Weihnachten, Silvester, Februar) Warteschlangen an den Kassen zu vermeiden.'
          ]
        }
      ]
    }
  },
  'livigno-con-bambini-attivita-famiglia': {
    en: {
      title: 'Livigno with Kids: Things to Do as a Family',
      description:
        'Toboggan runs, snow parks and ski lessons for the little ones: family-friendly activities in Livigno, one of the host venues of the Milan Cortina 2026 Olympics.',
      intro:
        'Livigno will be one of the official venues of the Milan Cortina 2026 Winter Olympics, hosting the snowboard and freestyle events — a milestone that in recent years has led to increasingly well-kept facilities and an offering designed to be accessible for families travelling with children too.',
      sections: [
        {
          heading: 'Tobogganing and minibob for the little ones',
          paragraphs: [
            'The San Rocco minibob and toboggan run is regularly open every day during lift operating hours, and on some evenings, including Monday nights — a simple, fun activity that requires no skiing experience.'
          ]
        },
        {
          heading: "Snow parks and kids' clubs",
          paragraphs: [
            'Depending on the season, there are also snow playgrounds, snow tubing and inflatable play areas designed for children, plus dedicated services like the Yepi Kids Club at Mottolino (which combines babysitting with group ski lessons for children aged 4 to 13) and the Kinder Club, proper snow nurseries with qualified staff.'
          ]
        },
        {
          heading: 'In summer: cycling and hiking as a family',
          paragraphs: [
            'In summer the family offering shifts to two wheels and the trails: the Bike Academy runs a 5 km route designed specifically for beginners and children, while the loop around Lake Livigno is an easy walk suitable for everyone, with comfortable spots to stop for a picnic.'
          ]
        },
        {
          heading: 'Ironwood Livigno for families',
          paragraphs: [
            "For guests travelling with children, Ironwood Livigno provides a cot and high chair on request, and the apartment's layout (up to 6 beds across 3 bedrooms) is designed specifically to host families comfortably — with the added benefit, after a day of activities with the little ones, of being able to walk back in minutes and relax in the private sauna while the children warm up by the fireplace."
          ]
        }
      ]
    },
    de: {
      title: 'Livigno mit Kindern: Familienaktivitäten',
      description:
        'Rodelbahnen, Schneeparks und Skikurse für die Kleinsten: familienfreundliche Aktivitäten in Livigno.',
      intro:
        'Livigno wird einer der offiziellen Austragungsorte der Olympischen Winterspiele Mailand Cortina 2026 sein und die Wettbewerbe im Snowboard und Freestyle ausrichten – ein Meilenstein, der in den letzten Jahren zu immer besser gepflegten Anlagen und einem Angebot geführt hat, das auch für Familien mit Kindern gut zugänglich ist.',
      sections: [
        {
          heading: 'Rodeln und Minibob für die Kleinsten',
          paragraphs: [
            'Die Minibob- und Rodelbahn San Rocco ist während der Betriebszeiten der Lifte regelmäßig täglich geöffnet, in manchen Zeiträumen auch abends, etwa montags – eine einfache, unterhaltsame Aktivität, für die keine Skierfahrung nötig ist.'
          ]
        },
        {
          heading: 'Schneeparks und Kinderclubs',
          paragraphs: [
            'Je nach Saison gibt es außerdem Schneespielplätze, Snow-Tubing und Hüpfburgen für Kinder sowie eigene Angebote wie den Yepi Kids Club am Mottolino (der Babysitting mit Gruppen-Skikursen für Kinder von 4 bis 13 Jahren kombiniert) und die Kinder Club genannten Schneekindergärten mit qualifiziertem Personal.'
          ]
        },
        {
          heading: 'Im Sommer: Radfahren und Wandern mit der Familie',
          paragraphs: [
            'Im Sommer verlagert sich das Familienangebot auf zwei Räder und die Wanderwege: Die Bike Academy bietet eine 5 km lange, speziell für Anfänger und Kinder konzipierte Strecke, während die Runde um den Lago di Livigno ein leichter, für alle geeigneter Spaziergang mit bequemen Picknickplätzen ist.'
          ]
        },
        {
          heading: 'Ironwood Livigno für Familien',
          paragraphs: [
            'Für Gäste mit Kindern stellt Ironwood Livigno auf Anfrage Kinderbett und Hochstuhl zur Verfügung, und die Aufteilung des Apartments (bis zu 6 Betten auf 3 Schlafzimmer) ist gezielt darauf ausgelegt, Familien komfortabel unterzubringen – mit dem zusätzlichen Vorteil, nach einem Tag voller Aktivitäten mit den Kleinen in wenigen Minuten zu Fuß zurückzukehren und sich in der privaten Sauna zu entspannen, während die Kinder sich am Kamin aufwärmen.'
          ]
        }
      ]
    }
  },
  'quanto-costa-sciare-a-livigno-guida-prezzi': {
    en: {
      title: 'How Much Does It Cost to Ski in Livigno: A Price Guide',
      description:
        'Ski pass, equipment rental, ski school and accommodation: a practical guide to the cost of a ski week in Livigno, with concrete tips to spend less.',
      intro:
        "How much does a ski week in Livigno really cost? Many people focus only on the ski pass, forgetting rental, lessons, meals and accommodation — the items that end up weighing most on the total budget. Here's a realistic overview of the costs, with a few practical tips to spend less without giving up on the quality of your holiday. The prices shown are indicative ranges: always check the latest rates on the official lift and rental websites before you go.",
      sections: [
        {
          heading: 'Ski pass: how much it changes between low and high season',
          paragraphs: [
            'The daily ski pass in Livigno costs indicatively between 50 and 60 euros for an adult, with lower rates at the start and end of the season and higher ones during peak periods (Christmas, New Year, February). Multi-day ski passes (3, 6 days or more) cost proportionally less than adding up several daily passes, and many families save further thanks to discounts for children and reductions for booking online a few days in advance.'
          ]
        },
        {
          heading: 'Ski and snowboard rental',
          paragraphs: [
            'A full set (skis, boots and poles) for an adult costs indicatively around 25-35 euros per day, with noticeable discounts on multi-day packages. Booking online in advance often saves something compared to last-minute rental in store. If your accommodation includes ski storage, like at Ironwood Livigno, you also save on the overnight storage fee that many shops charge separately.'
          ]
        },
        {
          heading: 'Ski school: private or group lessons',
          paragraphs: [
            "A one-hour private lesson costs indicatively 50-60 euros, while multi-day group courses (typically used for children) have a lower overall cost for the same number of teaching hours. For complete beginners, many schools recommend a couple of private lessons in the first few days to build confidence, then continuing in a group if you'd like."
          ]
        },
        {
          heading: 'Where you really save: accommodation and meals',
          paragraphs: [
            'The item that makes the biggest difference to the total budget is often accommodation combined with meals. An apartment with a fully equipped kitchen, like Ironwood Livigno, lets you make breakfast and some meals yourselves, with a real saving compared to eating out every time — as well as more flexible timing than a hotel with fixed board. Booking accommodation directly through the owner\'s website, when possible, also avoids the commissions charged by booking platforms.'
          ]
        },
        {
          heading: 'Indicative budget for a ski week',
          paragraphs: [
            "Adding up accommodation, ski pass, rental, a few lessons and meals, a ski week in Livigno for two people falls indicatively between 1,500 and 4,500 euros in total, depending on the season, the type of accommodation and how often you eat out: the lower end of the range for a couple in low season with an apartment and their own kitchen, the higher end for a high-season stay with more restaurant meals and private lessons. It's always worth comparing a few quotes and checking what's included (parking, ski storage, WiFi) before deciding."
          ]
        }
      ]
    },
    de: {
      title: 'Wie viel kostet Skifahren in Livigno? Ein Preisleitfaden',
      description:
        'Skipass, Ausrüstungsverleih, Skischule und Unterkunft: ein praktischer Leitfaden zu den Kosten einer Skiwoche in Livigno, mit konkreten Spartipps.',
      intro:
        'Wie viel kostet eine Skiwoche in Livigno wirklich? Viele denken nur an den Skipass und vergessen Verleih, Skikurse, Verpflegung und Unterkunft – die Posten, die letztlich am meisten ins Gewicht fallen. Hier ist ein realistischer Kostenüberblick mit ein paar praktischen Tipps, um zu sparen, ohne bei der Qualität des Urlaubs Abstriche zu machen. Die genannten Preise sind indikative Spannen: Prüfen Sie vor der Abreise immer die aktuellen Tarife auf den offiziellen Seiten der Lifte und Verleihstationen.',
      sections: [
        {
          heading: 'Skipass: wie stark er sich zwischen Neben- und Hochsaison unterscheidet',
          paragraphs: [
            'Der Tagesskipass in Livigno kostet für Erwachsene indikativ zwischen 50 und 60 Euro, mit niedrigeren Preisen zu Saisonbeginn und -ende und höheren in Spitzenzeiten (Weihnachten, Silvester, Februar). Mehrtagesskipässe (3, 6 Tage oder mehr) kosten anteilig weniger, als mehrere Tagespässe zusammenzuzählen, und viele Familien sparen zusätzlich dank Kinderermäßigungen und Rabatten für eine Online-Buchung einige Tage im Voraus.'
          ]
        },
        {
          heading: 'Ski- und Snowboardverleih',
          paragraphs: [
            'Ein komplettes Set (Ski, Skischuhe und Stöcke) für Erwachsene kostet indikativ rund 25–35 Euro pro Tag, mit deutlichen Rabatten bei Mehrtagespaketen. Eine Online-Buchung im Voraus spart oft etwas gegenüber dem spontanen Verleih im Geschäft. Wenn die Unterkunft, wie im Ironwood Livigno, einen Skikeller bietet, spart man sich zusätzlich die Übernachtungsgebühr für die Ausrüstung, die viele Geschäfte separat berechnen.'
          ]
        },
        {
          heading: 'Skischule: Privat- oder Gruppenunterricht',
          paragraphs: [
            'Eine einstündige Privatstunde kostet indikativ 50–60 Euro, während mehrtägige Gruppenkurse (typischerweise für Kinder genutzt) bei gleicher Unterrichtszeit insgesamt günstiger ausfallen. Für absolute Anfänger empfehlen viele Skischulen ein paar Privatstunden in den ersten Tagen, um Sicherheit aufzubauen, und danach bei Bedarf den Wechsel in eine Gruppe.'
          ]
        },
        {
          heading: 'Wo man wirklich spart: Unterkunft und Verpflegung',
          paragraphs: [
            'Der Posten, der den größten Unterschied im Gesamtbudget macht, ist oft die Kombination aus Unterkunft und Verpflegung. Ein Apartment mit voll ausgestatteter Küche, wie das Ironwood Livigno, erlaubt es, Frühstück und einige Mahlzeiten selbst zuzubereiten – eine echte Ersparnis gegenüber jedem Mal auswärts essen, mit flexibleren Zeiten als bei einem Hotel mit fester Verpflegung. Eine Direktbuchung über die Website des Eigentümers vermeidet außerdem, wenn möglich, die Provisionen der Buchungsplattformen.'
          ]
        },
        {
          heading: 'Indikatives Budget für eine Skiwoche',
          paragraphs: [
            'Rechnet man Unterkunft, Skipass, Verleih, ein paar Skistunden und Verpflegung zusammen, liegt eine Skiwoche in Livigno für zwei Personen indikativ zwischen 1.500 und 4.500 Euro insgesamt, je nach Saison, Unterkunftsart und Häufigkeit der Restaurantbesuche: das untere Ende der Spanne für ein Paar in der Nebensaison mit Apartment und eigener Küche, das obere Ende für einen Hochsaison-Aufenthalt mit mehr Restaurantbesuchen und Privatstunden. Es lohnt sich immer, mehrere Angebote zu vergleichen und vor der Entscheidung zu prüfen, was inbegriffen ist (Parkplatz, Skikeller, WLAN).'
          ]
        }
      ]
    }
  },
  'carosello-3000-vs-mottolino-quale-scegliere': {
    en: {
      title: 'Carosello 3000 vs Mottolino: Which Ski Area to Choose',
      description:
        "The differences between Livigno's two ski areas — slopes, atmosphere and who each one suits best — and why where you stay matters more than which side you pick.",
      intro:
        "Livigno doesn't have just one ski area, but two: Carosello 3000 and Mottolino Fun Mountain, which together offer around 115 km of slopes across the two sides of the basin. They're linked by the same town but have different characters, and understanding the differences helps you plan your ski week better.",
      sections: [
        {
          heading: 'Carosello 3000: the side best suited to beginners',
          paragraphs: [
            "Carosello 3000 is the larger, sunnier side, with a good share of wide, well-groomed blue runs. It's generally the side chosen by families travelling with children or those new to skiing, helped by a slightly calmer atmosphere than the opposite side."
          ]
        },
        {
          heading: 'Mottolino: sport, snowpark and a livelier pace',
          paragraphs: [
            "Mottolino Fun Mountain is more geared toward freeride skiing, with one of the best-known snowparks in Italy and a generally sportier crowd. In summer, the same area becomes the Mottolino Bike Park, one of the top mountain biking destinations in Europe — a useful detail if you're also considering Livigno outside the ski season."
          ]
        },
        {
          heading: 'One ski pass for both areas',
          paragraphs: [
            "You don't have to choose once and for all: Livigno's unified ski pass lets you ski on both areas, so you can alternate your days depending on mood, weather or who you're travelling with — a couple of days on the calmer slopes of Carosello 3000, a couple on the livelier ones at Mottolino."
          ]
        },
        {
          heading: 'Why where you stay matters more than which side you choose',
          paragraphs: [
            "The real practical constraint isn't so much which ski area to pick, but where you sleep: staying at one end of town, reaching the opposite side takes time. Ironwood Livigno is located on Via Saroch, 100 metres from both the Carosello 3000 and Mottolino lifts — so every morning you can decide on the spot where to ski, without the choice depending on how easy it is to get there."
          ]
        }
      ]
    },
    de: {
      title: 'Carosello 3000 oder Mottolino: Welches Skigebiet wählen',
      description:
        'Die Unterschiede zwischen den beiden Skigebieten von Livigno – Pisten, Atmosphäre und wem welches Gebiet am besten passt.',
      intro:
        'Livigno hat nicht nur ein Skigebiet, sondern zwei: Carosello 3000 und Mottolino Fun Mountain, die zusammen rund 115 km Pisten auf den beiden Seiten des Talkessels bieten. Sie sind durch denselben Ort verbunden, haben aber unterschiedlichen Charakter – die Unterschiede zu kennen hilft, die Skiwoche besser zu planen.',
      sections: [
        {
          heading: 'Carosello 3000: die für Einsteiger besser geeignete Seite',
          paragraphs: [
            'Carosello 3000 ist die größere, sonnigere Seite mit einem guten Anteil breiter, gut präparierter blauer Pisten. Meist die Seite, die Familien mit Kindern oder Skifahranfänger wählen, begünstigt durch eine etwas ruhigere Atmosphäre als auf der gegenüberliegenden Seite.'
          ]
        },
        {
          heading: 'Mottolino: Sport, Snowpark und lebendigeres Tempo',
          paragraphs: [
            'Mottolino Fun Mountain ist eher auf Freeride-Skifahren ausgerichtet, mit einem der bekanntesten Snowparks Italiens und einem im Allgemeinen sportlicheren Publikum. Im Sommer wird dasselbe Gebiet zum Mottolino Bikepark, einem der Top-Mountainbike-Ziele Europas – ein nützliches Detail, wenn Sie Livigno auch außerhalb der Skisaison in Betracht ziehen.'
          ]
        },
        {
          heading: 'Ein Skipass für beide Gebiete',
          paragraphs: [
            'Man muss sich nicht ein für alle Mal entscheiden: Der einheitliche Skipass von Livigno erlaubt das Skifahren in beiden Gebieten, sodass Sie Ihre Tage je nach Laune, Wetter oder Reisebegleitung abwechseln können – ein paar Tage auf den ruhigeren Pisten von Carosello 3000, ein paar auf den lebendigeren von Mottolino.'
          ]
        },
        {
          heading: 'Warum die Lage der Unterkunft wichtiger ist als die Wahl der Seite',
          paragraphs: [
            'Die eigentliche praktische Einschränkung ist weniger, welches Skigebiet man wählt, sondern wo man übernachtet: Wohnt man an einem Ende des Ortes, dauert es, die gegenüberliegende Seite zu erreichen. Das Ironwood Livigno liegt in der Via Saroch, 100 Meter sowohl von den Liften von Carosello 3000 als auch von Mottolino entfernt – sodass Sie jeden Morgen spontan entscheiden können, wo Sie fahren möchten, ohne dass die Wahl von der Erreichbarkeit abhängt.'
          ]
        }
      ]
    }
  },
  'migliori-piste-sci-livigno-famiglie': {
    en: {
      title: 'Best Ski Slopes in Livigno for Families',
      description:
        'Which side to choose, where to find the ski school and the minibob run, and how to plan days on the snow with children: the family guide to skiing in Livigno.',
      intro:
        'Taking your children skiing for the first time, or simply planning a stress-free week on the snow, means choosing the right ski area, ski school and alternative activities to downhill slopes. Here\'s how to navigate Livigno\'s ski slopes for families, area by area.',
      sections: [
        {
          heading: 'Carosello 3000: the side best suited to beginners',
          paragraphs: [
            'Carosello 3000 is the larger, sunnier side of the ski area, with runs for every level — it\'s generally the side chosen by families travelling with children or those just starting out, while Mottolino remains more geared toward freeride skiing and a more experienced crowd.'
          ]
        },
        {
          heading: 'Cross-country skiing: a calmer alternative',
          paragraphs: [
            'Livigno is also known for cross-country skiing, with tracks running through the town centre and the valley: a more relaxed activity to alternate with downhill slopes, handy for children experiencing snow for the first time or families wanting a different pace.'
          ]
        },
        {
          heading: 'Minibob and tobogganing at San Rocco',
          paragraphs: [
            "For little ones not quite ready to try skiing yet, the San Rocco minibob and toboggan run is regularly open every day during lift operating hours — a simple, fun activity that requires no experience."
          ]
        },
        {
          heading: "Ski lessons and kids' clubs",
          paragraphs: [
            'Dedicated services are available, like the Yepi Kids Club at Mottolino, which combines babysitting with group ski lessons for children aged 4 to 13, and the Kinder Club, proper snow nurseries with qualified staff — useful for organising your days when parents want to ski on more challenging slopes.'
          ]
        },
        {
          heading: "Why where you stay matters more than you'd think",
          paragraphs: [
            'With young children, being close to the ski school and the lifts makes a huge difference to how smoothly your days run. At Ironwood Livigno, the ski school is just 50 metres away and the lifts 100 metres away: handy for lessons, quick changeovers and lunch breaks back at the apartment without needing the car.'
          ]
        }
      ]
    },
    de: {
      title: 'Die besten Skipisten in Livigno für Familien',
      description:
        'Welche Seite wählen, wo Skischule und Minibob zu finden sind, und wie man Schneetage mit Kindern plant: der Familienratgeber für Livigno.',
      intro:
        'Kinder zum ersten Mal zum Skifahren zu bringen oder einfach eine stressfreie Schneewoche zu planen, bedeutet, das richtige Skigebiet, die richtige Skischule und Alternativen zu den Abfahrtspisten zu wählen. So finden Sie sich unter den Skipisten von Livigno für Familien zurecht, Gebiet für Gebiet.',
      sections: [
        {
          heading: 'Carosello 3000: die für Einsteiger geeignetere Seite',
          paragraphs: [
            'Carosello 3000 ist die größere, sonnigere Seite des Skigebiets mit Pisten für jedes Niveau – meist die Seite, die Familien mit Kindern oder Anfänger wählen, während Mottolino eher auf Freeride-Skifahren und ein erfahreneres Publikum ausgerichtet bleibt.'
          ]
        },
        {
          heading: 'Langlauf: eine ruhigere Alternative',
          paragraphs: [
            'Livigno ist auch für den Langlauf bekannt, mit Loipen durch das Ortszentrum und das Tal: eine entspanntere Aktivität als Abwechslung zu den Abfahrtspisten, praktisch für Kinder, die zum ersten Mal Schnee erleben, oder für Familien, die ein anderes Tempo möchten.'
          ]
        },
        {
          heading: 'Minibob und Rodeln in San Rocco',
          paragraphs: [
            'Für die Kleinsten, die noch nicht Ski fahren möchten, ist die Minibob- und Rodelbahn San Rocco während der Betriebszeiten der Lifte regelmäßig täglich geöffnet – eine einfache, unterhaltsame Aktivität, für die keine Erfahrung nötig ist.'
          ]
        },
        {
          heading: 'Skikurse und Kinderclubs',
          paragraphs: [
            'Es stehen eigene Angebote zur Verfügung, wie der Yepi Kids Club am Mottolino, der Babysitting mit Gruppen-Skikursen für Kinder von 4 bis 13 Jahren kombiniert, sowie die Kinder Club genannten Schneekindergärten mit qualifiziertem Personal – praktisch, wenn Eltern auf anspruchsvolleren Pisten fahren möchten.'
          ]
        },
        {
          heading: 'Warum die Lage der Unterkunft wichtiger ist, als man denkt',
          paragraphs: [
            'Mit kleinen Kindern macht die Nähe zu Skischule und Liften einen großen Unterschied für den Ablauf der Tage. Im Ironwood Livigno sind es nur 50 Meter bis zur Skischule und 100 Meter bis zu den Liften: praktisch für Unterricht, schnelle Wechsel und Mittagspausen im Apartment, ohne das Auto zu benötigen.'
          ]
        }
      ]
    }
  },
  'sauna-privata-vs-condivisa-livigno': {
    en: {
      title: 'Private Sauna vs Shared: Why Choose an Exclusive Spa',
      description:
        'Private sauna or shared spa in a hotel? Real advantages, timing, hygiene and comfort: what to consider before booking your stay in Livigno.',
      intro:
        "Private sauna or shared spa? It's one of the questions guests ask us most often when comparing an apartment with a traditional hotel in Livigno. The answer depends on what you're looking for in a holiday, but there are a few practical differences worth knowing before you book.",
      sections: [
        {
          heading: 'Timing and booking: no waiting with a private sauna',
          paragraphs: [
            'In many mountain accommodations, the sauna and steam room are shared spaces, with booking slots and the real possibility of having to share them with strangers. With a private sauna in the apartment, like the one at Ironwood Livigno, there are no slots to book and no queues: it\'s available whenever you want, at any time of day.'
          ]
        },
        {
          heading: "Hygiene: a space that's entirely yours",
          paragraphs: [
            "A shared sauna, however clean, remains a space used by dozens of different people every day. A private sauna, inside the apartment, is for the exclusive use of the guests staying there — no sharing, no need to bring your own robe from home."
          ]
        },
        {
          heading: "The right moment: after the last run, not before dinner at a fixed time",
          paragraphs: [
            "With a hotel spa, you often have to work around opening hours or book a time slot. With a private sauna, you can come back from the slopes or the trail and warm up right away, whenever your body actually needs it — not whenever your booked slot allows."
          ]
        },
        {
          heading: "Ironwood Livigno's choice",
          paragraphs: [
            "That's why, when we renovated our family home, we chose to include a private infrared sauna and steam room in the apartment rather than relying on a shared spa: it's one of the details most often mentioned in the genuine reviews we receive on Google and Airbnb."
          ]
        }
      ]
    },
    de: {
      title: 'Private vs. geteilte Sauna: Warum ein eigenes Spa wählen',
      description:
        'Private Sauna oder Gemeinschaftsspa im Hotel? Echte Vorteile, Hygiene und Komfort vor der Buchung in Livigno.',
      intro:
        'Private Sauna oder Gemeinschaftsspa? Das ist eine der Fragen, die uns Gäste am häufigsten stellen, wenn sie ein Apartment mit einem klassischen Hotel in Livigno vergleichen. Die Antwort hängt davon ab, was Sie sich von Ihrem Urlaub erwarten, aber es gibt ein paar praktische Unterschiede, die man vor der Buchung kennen sollte.',
      sections: [
        {
          heading: 'Zeitplanung und Buchung: keine Wartezeit bei einer privaten Sauna',
          paragraphs: [
            'In vielen Bergunterkünften sind Sauna und Dampfbad Gemeinschaftsbereiche, mit Zeitfenstern zum Buchen und der realen Möglichkeit, sie mit Fremden teilen zu müssen. Mit einer privaten Sauna im Apartment, wie im Ironwood Livigno, gibt es keine Zeitfenster und keine Warteschlangen: Sie steht zur Verfügung, wann immer Sie möchten, zu jeder Tageszeit.'
          ]
        },
        {
          heading: 'Hygiene: ein Bereich, der wirklich nur Ihnen gehört',
          paragraphs: [
            'Eine Gemeinschaftssauna, so sauber sie auch sein mag, bleibt ein Bereich, den täglich Dutzende verschiedener Personen nutzen. Eine private Sauna im Apartment steht ausschließlich den dort wohnenden Gästen zur Verfügung – kein Teilen, kein eigener Bademantel von zu Hause nötig.'
          ]
        },
        {
          heading: 'Der richtige Moment: nach der letzten Abfahrt, nicht vor dem Abendessen zu fester Zeit',
          paragraphs: [
            'Bei einem Hotelspa muss man sich oft nach Öffnungszeiten richten oder ein Zeitfenster buchen. Mit einer privaten Sauna können Sie direkt von der Piste oder vom Wanderweg zurückkehren und sich sofort aufwärmen, wann immer Ihr Körper es wirklich braucht – nicht nur, wenn Ihr gebuchtes Zeitfenster es erlaubt.'
          ]
        },
        {
          heading: 'Die Entscheidung von Ironwood Livigno',
          paragraphs: [
            'Deshalb haben wir uns bei der Renovierung unseres Familienhauses entschieden, eine private Infrarotsauna und ein Dampfbad in das Apartment zu integrieren, anstatt auf ein Gemeinschaftsspa zu setzen: Es ist eines der Details, das in den echten Bewertungen, die wir auf Google und Airbnb erhalten, am häufigsten genannt wird.'
          ]
        }
      ]
    }
  },
  'livigno-estate-mountain-bike-trekking-lago': {
    en: {
      title: "Livigno in Summer: Mountain Biking, Hiking and the Lake",
      description:
        "Why Livigno isn't just a winter destination: a bike park, trails for every level, and Lake Livigno to discover in summer.",
      intro:
        "Livigno is known across Europe as one of the mountain biking capitals. The area has over 50 km of organised trails split across several routes, suited both to families and beginners and to experienced bikers looking for technical descents.",
      sections: [
        {
          heading: 'Mottolino Bike Park and Carosello 3000 in summer',
          paragraphs: [
            "Mottolino Bike Park is the go-to spot for anyone chasing adrenaline: 14 trails spanning downhill, a jump area and north shore sections with wooden bridges and features. Carosello 3000 also opens its lifts in summer (indicatively from 20 June to 13 September), linking scenic trails at altitude. For those taking their first pedal strokes, the Bike Academy offers a 5 km route designed specifically for beginners and children."
          ]
        },
        {
          heading: 'Hiking and Lake Livigno',
          paragraphs: [
            "You don't need to be an experienced biker to enjoy Livigno in summer, though: the basin is crossed by hiking trails of every difficulty, through blooming alpine pastures (arnica is the area's symbol flower), larch woods and views over the Rhaetian Alps. A classic walk suitable for everyone is the loop around Lake Livigno, with stops for a picnic or a canoe trip on warmer days."
          ]
        },
        {
          heading: '5 trails not to miss',
          paragraphs: [
            "Among the routes most mentioned by bikers who visit Livigno: the Family Flow Trail at Mottolino Bike Park, a smooth route with banked turns designed for those approaching downhill riding; the Val Federia trail, mixed and scenic, leading toward alpine lakes at altitude; the Water Trail, the simplest and most relaxing, following the stream from Lake Livigno; the Monte della Neve loop, more demanding, with a 360-degree view over Livigno, the Engadin and the Ortles peaks; and the Black Snake, technical and reserved for experienced riders, with jumps and north shore sections. Exact difficulty, length and trail conditions can change season to season: always check the Bike Park's updated map before setting off."
          ]
        },
        {
          heading: 'Our tip',
          paragraphs: [
            "For guests staying in the apartment: the location just steps from the lifts, so handy in winter, is just as useful in summer for reaching the main trailheads on foot or by bike. We also offer e-bike rental on request, for anyone wanting to cover more ground without too much effort on the climbs — handy for families or anyone who isn't a trained cyclist.",
            "Whether you're planning a week of skiing or a summer holiday of biking and hiking, Livigno is one of the few Italian Alpine destinations genuinely built to work all 12 months of the year."
          ]
        }
      ]
    },
    de: {
      title: 'Livigno im Sommer: Mountainbiken, Wandern und der See',
      description:
        'Warum Livigno kein reines Winterziel ist: Bikepark, Wege für jedes Niveau und der Lago di Livigno, den es im Sommer zu entdecken gilt.',
      intro:
        'Livigno ist europaweit als eine der Mountainbike-Hauptstädte bekannt. Das Gebiet verfügt über mehr als 50 km ausgeschilderte Strecken auf verschiedenen Routen, geeignet sowohl für Familien und Einsteiger als auch für erfahrene Biker auf der Suche nach technischen Abfahrten.',
      sections: [
        {
          heading: 'Mottolino Bikepark und Carosello 3000 im Sommer',
          paragraphs: [
            'Der Mottolino Bikepark ist die erste Adresse für alle, die Adrenalin suchen: 14 Strecken zwischen Downhill, Jump-Area und North-Shore-Abschnitten mit Stegen und Holzelementen. Auch Carosello 3000 öffnet im Sommer seine Lifte (voraussichtlich vom 20. Juni bis 13. September) und verbindet Panoramawege in der Höhe. Für alle, die die ersten Pedaltritte machen, bietet die Bike Academy eine 5 km lange Strecke speziell für Anfänger und Kinder.'
          ]
        },
        {
          heading: 'Wandern und der Lago di Livigno',
          paragraphs: [
            'Man muss aber kein erfahrener Biker sein, um Livigno im Sommer zu genießen: Der Talkessel wird von Wanderwegen jeden Schwierigkeitsgrads durchzogen, vorbei an blühenden Almwiesen (die Arnika ist die Symbolblume der Region), Lärchenwäldern und Ausblicken auf die Rätischen Alpen. Ein klassischer, für alle geeigneter Spaziergang führt rund um den Lago di Livigno, mit Rastplätzen für ein Picknick oder an warmen Tagen für eine Kanufahrt.'
          ]
        },
        {
          heading: '5 Wege, die man nicht verpassen sollte',
          paragraphs: [
            'Zu den von Bikern in Livigno meistgenannten Strecken zählen: der Family Flow Trail im Mottolino Bikepark, eine flüssige Strecke mit überhöhten Kurven für alle, die sich dem Downhill nähern; der Weg durchs Val Federia, gemischt und panoramareich, der zu Bergseen in der Höhe führt; der Sentiero dell\'Acqua, der einfachste und entspannteste, der dem Wasserlauf vom Lago di Livigno folgt; die Runde um den Monte della Neve, anspruchsvoller, mit einem 360-Grad-Panorama auf Livigno, das Engadin und die Gipfel des Ortlers; und der Black Snake, technisch und erfahrenen Fahrern vorbehalten, mit Sprüngen und North-Shore-Abschnitten. Genaue Schwierigkeit, Länge und Streckenzustand können sich saisonal ändern: Vor der Tour immer die aktuelle Karte des Bikeparks prüfen.'
          ]
        },
        {
          heading: 'Unser Tipp',
          paragraphs: [
            'Für Gäste im Apartment: Die Lage nur wenige Schritte von den Liften entfernt, die im Winter so praktisch ist, ist im Sommer ebenso nützlich, um die Einstiege zu den wichtigsten Wegen zu Fuß oder mit dem Rad zu erreichen. Auf Anfrage bieten wir außerdem E-Bike-Verleih an, für alle, die mehr Gelände ohne allzu große Anstrengung bei den Anstiegen erkunden möchten – praktisch auch für Familien oder für alle, die keine trainierten Radfahrer sind.',
            'Ob Sie eine Skiwoche oder einen Sommerurlaub mit Rad und Wanderungen planen: Livigno ist eines der wenigen italienischen Alpenziele, das wirklich für 12 Monate im Jahr gemacht ist.'
          ]
        }
      ]
    }
  },
  'cosa-mangiare-a-livigno-piatti-tipici': {
    en: {
      title: 'What to Eat in Livigno: Traditional Valtellina Dishes',
      description:
        "Pizzoccheri, sciatt and bresaola: the traditional dishes to try during a holiday in Livigno, rooted in farming tradition and mountain ingredients.",
      intro:
        "Livigno's cuisine is rooted in the farming tradition of Valtellina, the valley it belongs to: dishes designed to give energy after a day of work at altitude, made with ingredients the land could provide even in a harsh climate — buckwheat, potatoes, aged cheeses and preserved meats.",
      sections: [
        {
          heading: 'Pizzoccheri, the signature dish',
          paragraphs: [
            'The most iconic dish is pizzoccheri: buckwheat tagliatelle cooked together with savoy cabbage and potatoes, dressed with melted butter and a mix of local cheeses (bitto, casera and the so-called "pizzoccheraia"). It\'s a hearty dish, perfect after a day of skiing or hiking.'
          ]
        },
        {
          heading: 'Sciatt: the traditional fried snack',
          paragraphs: [
            'Also worth trying are sciatt: round buckwheat fritters with a molten cheese centre, whose dialect name means "toad" because of their stubby, irregular shape. They\'re usually served piping hot, often on a bed of salad or radicchio, as a starter or a light meal.'
          ]
        },
        {
          heading: 'Bresaola della Valtellina IGP',
          paragraphs: [
            "Bresaola della Valtellina is the area's signature cured meat: since 1996 it has held Protected Geographical Indication (IGP) status, meaning only certified producers in the province of Sondrio can use the name. It's typically enjoyed thinly sliced, with a drizzle of olive oil, lemon and shavings of parmesan."
          ]
        },
        {
          heading: 'Where to try them',
          paragraphs: [
            "Many restaurants in Livigno serve these dishes in their traditional form. But if you'd prefer a quieter evening in the apartment, the fully equipped kitchen at Ironwood Livigno lets you buy fresh bresaola, cheese and pizzoccheri at the supermarket or local market and cook them at your own pace — a simple way to bring an authentic taste of Valtellina to your table."
          ]
        }
      ]
    },
    de: {
      title: 'Was man in Livigno isst: Gerichte der Valtellina',
      description:
        'Pizzoccheri, Sciatt und Bresaola: die typischen Gerichte, die man während eines Urlaubs in Livigno probieren sollte.',
      intro:
        'Die Küche von Livigno wurzelt in der bäuerlichen Tradition der Valtellina, des Tals, zu dem der Ort gehört: Gerichte, die nach einem Arbeitstag in der Höhe Energie liefern sollten, mit Zutaten, die das Gebiet auch in einem rauen Klima bot – Buchweizen, Kartoffeln, gereifter Käse und haltbar gemachtes Fleisch.',
      sections: [
        {
          heading: 'Pizzoccheri, das Symbolgericht',
          paragraphs: [
            'Das bekannteste Gericht sind Pizzoccheri: Bandnudeln aus Buchweizen, zusammen mit Wirsing und Kartoffeln gekocht und mit zerlassener Butter und einer Mischung lokaler Käsesorten (Bitto, Casera und der sogenannten „Pizzoccheraia") verfeinert. Ein herzhaftes Gericht, perfekt nach einem Tag auf Skiern oder Wanderwegen.'
          ]
        },
        {
          heading: 'Sciatt: das typische Frittierte',
          paragraphs: [
            'Probieren sollte man auch Sciatt: runde Buchweizen-Küchlein mit einem Kern aus zerlaufenem Käse, deren Dialektname wegen der gedrungenen, unregelmäßigen Form „Kröte" bedeutet. Sie werden meist heiß serviert, oft auf einem Bett aus Salat oder Radicchio, als Vorspeise oder eigenständiges Gericht.'
          ]
        },
        {
          heading: 'Bresaola della Valtellina g.g.A.',
          paragraphs: [
            'Die Bresaola della Valtellina ist der Wurstwaren-Klassiker der Region: Seit 1996 trägt sie die geschützte geografische Angabe (g.g.A.), das heißt, nur zertifizierte Hersteller aus der Provinz Sondrio dürfen den Namen verwenden. Man genießt sie typischerweise in dünnen Scheiben, mit etwas Olivenöl, Zitrone und Parmesanspänen.'
          ]
        },
        {
          heading: 'Wo man sie probieren kann',
          paragraphs: [
            'Viele Restaurants in Livigno servieren diese Gerichte in ihrer traditionellen Form. Wer aber einen ruhigeren Abend im Apartment bevorzugt: Die voll ausgestattete Küche im Ironwood Livigno erlaubt es, frische Bresaola, Käse und Pizzoccheri im Supermarkt oder auf dem lokalen Markt zu kaufen und in Ruhe selbst zuzubereiten – eine einfache Art, ein authentisches Stück Valtellina auf den Tisch zu bringen.'
          ]
        }
      ]
    }
  },
  'shopping-duty-free-livigno-cosa-comprare': {
    en: {
      title: "Duty-Free Shopping in Livigno: What's Worth Buying",
      description:
        "Livigno is one of the few duty-free zones in Italy: here's what's genuinely worth buying, and the limits you should know before you go.",
      intro:
        "Livigno is one of the few duty-free zones in Italy: because of its isolated position, it has historically been exempt from certain taxes, including VAT on several products. Today this status draws many visitors every year, looking not just for ski slopes but also for a good round of shopping in the town's pedestrian centre.",
      sections: [
        {
          heading: 'Spirits and wine',
          paragraphs: [
            'The selection is wide, with wines, spirits and liqueurs — including niche labels hard to find elsewhere — generally at more competitive prices than the rest of Italy.'
          ]
        },
        {
          heading: 'Tobacco',
          paragraphs: [
            'Cigarettes and cigars are among the best-value products, with a noticeable saving compared to usual prices.'
          ]
        },
        {
          heading: 'Perfumes and cosmetics',
          paragraphs: [
            "This is one of the categories where the price advantage is most noticeable, with high-end brands available at reduced prices — on average up to 20% less before tax."
          ]
        },
        {
          heading: 'Duty-free allowance limits',
          paragraphs: [
            "One practical thing to know before making a significant purchase: when re-entering Italy (or another EU country), duty-free allowance limits apply — indicatively 1 litre of spirits above 22°, 2 litres of alcohol below 22°, 4 litres of wine, 16 litres of beer and 200 cigarettes per person. Rules can change, so it's worth checking in advance if you're planning a substantial purchase."
          ]
        },
        {
          heading: 'Where to shop',
          paragraphs: [
            "Livigno's pedestrian centre, with its duty-free shops, is about a 15-minute walk from Ironwood Livigno — handy for a stroll among the shops after a day of skiing, or as an evening stop before dinner."
          ]
        }
      ]
    },
    de: {
      title: 'Duty-free-Shopping in Livigno: Was sich wirklich lohnt',
      description:
        'Livigno ist eine der wenigen zollfreien Zonen Italiens: Was sich wirklich zu kaufen lohnt und welche Freigrenzen Sie vor der Abreise kennen sollten.',
      intro:
        'Livigno ist eine der wenigen zollfreien Zonen Italiens: Wegen seiner isolierten Lage war der Ort historisch von bestimmten Steuern befreit, darunter die Mehrwertsteuer auf mehrere Produkte. Dieser Status zieht heute jedes Jahr viele Besucher an, die nicht nur die Skipisten suchen, sondern auch eine ausgiebige Shoppingrunde im Fußgängerzentrum des Ortes.',
      sections: [
        {
          heading: 'Spirituosen und Wein',
          paragraphs: [
            'Die Auswahl ist groß: Weine, Spirituosen und Liköre – auch Nischenmarken, die anderswo schwer zu finden sind – zu Preisen, die im Allgemeinen wettbewerbsfähiger sind als im restlichen Italien.'
          ]
        },
        {
          heading: 'Tabakwaren',
          paragraphs: [
            'Zigaretten und Zigarren gehören zu den preiswertesten Produkten, mit einer spürbaren Ersparnis gegenüber den üblichen Preisen.'
          ]
        },
        {
          heading: 'Parfüm und Kosmetik',
          paragraphs: [
            'Dies ist einer der Bereiche, in denen sich der Preisvorteil am stärksten bemerkbar macht: hochwertige Marken zu reduzierten Preisen – im Schnitt bis zu 20 % weniger auf den Nettopreis.'
          ]
        },
        {
          heading: 'Zollfreie Freigrenzen',
          paragraphs: [
            'Ein praktischer Hinweis vor größeren Einkäufen: Bei der Rückkehr nach Italien (oder in ein anderes EU-Land) gelten zollfreie Freigrenzen – indikativ 1 Liter Spirituosen über 22°, 2 Liter Alkohol unter 22°, 4 Liter Wein, 16 Liter Bier und 200 Zigaretten pro Person. Die Vorschriften können sich ändern, es lohnt sich also, sie vorab zu prüfen, wenn ein größerer Einkauf geplant ist.'
          ]
        },
        {
          heading: 'Wo man einkaufen kann',
          paragraphs: [
            'Das Fußgängerzentrum von Livigno mit seinen Duty-free-Geschäften ist etwa 15 Gehminuten vom Ironwood Livigno entfernt – praktisch für einen Bummel durch die Geschäfte nach einem Skitag oder als abendlicher Zwischenstopp vor dem Essen.'
          ]
        }
      ]
    }
  },
  'livigno-estate-10-esperienze-imperdibili': {
    en: {
      title: "What to Do in Livigno in Summer: 10 Unmissable Experiences",
      description:
        "From mountain biking to Lake Livigno, from duty-free shopping to the private sauna: 10 experiences not to miss during a summer holiday in Livigno.",
      intro:
        "What is there to do in Livigno in summer? Much more than you'd expect from a destination known mainly for skiing: from June to September the Alpine basin turns into one of Europe's mountain biking capitals, with trails for every level, a lake to explore by canoe, and a pedestrian centre that remains one of the few duty-free zones in Italy. Here are 10 experiences not to miss.",
      sections: [
        {
          heading: '1. Mountain biking at Mottolino Bike Park',
          paragraphs: [
            'Livigno is known across Europe as one of the mountain biking capitals, and Mottolino Bike Park is its heart: 14 trails spanning downhill, a jump area and north shore sections with bridges and wooden features, for anyone looking for real adrenaline in the saddle.'
          ]
        },
        {
          heading: '2. The Bike Academy for families with children',
          paragraphs: [
            "You don't need to be an experienced biker: the Bike Academy offers a route of around 5 km designed specifically for beginners and children, a good way to introduce even the youngest to biking in a safe setting."
          ]
        },
        {
          heading: '3. Hiking around Lake Livigno',
          paragraphs: [
            "A classic walk suitable for everyone is the loop around Lake Livigno, with stops for a picnic on warmer days — the easiest summer activity to organise, suited to every age."
          ]
        },
        {
          heading: '4. Excursions among the blooming alpine pastures',
          paragraphs: [
            "The Livigno basin is crossed by hiking trails of every difficulty, through blooming alpine pastures — arnica is the area's symbol flower — larch woods and views over the Rhaetian Alps, for anyone looking for a more demanding excursion."
          ]
        },
        {
          heading: '5. Carosello 3000 open in summer too',
          paragraphs: [
            "The winter ski area comes alive in summer too: Carosello 3000 opens its lifts indicatively from 20 June to 13 September, linking scenic trails at altitude that are reachable without too much effort."
          ]
        },
        {
          heading: '6. A canoe trip on the lake',
          paragraphs: [
            'On warmer days, Lake Livigno is also well suited to a canoe trip — a different way to experience the valley, from the water rather than the mountain trails.'
          ]
        },
        {
          heading: '7. Shopping in the duty-free pedestrian centre',
          paragraphs: [
            "Livigno is one of the few duty-free zones in Italy: the pedestrian centre, with its duty-free shops, is an almost obligatory stop even for non-skiers, with more competitive prices on spirits, perfumes and cosmetics."
          ]
        },
        {
          heading: '8. Traditional Valtellina dishes',
          paragraphs: [
            "After an active day, pizzoccheri, sciatt and bresaola della Valtellina IGP are worth trying at the town's restaurants, or cooking at your own pace in the apartment's fully equipped kitchen."
          ]
        },
        {
          heading: '9. Unwinding in the private sauna after an active day',
          paragraphs: [
            "The benefit of a private infrared sauna and steam room isn't just for winter: after a day of hiking or mountain biking, the warmth helps ease your muscles even before you think about dinner."
          ]
        },
        {
          heading: '10. Cool temperatures even in August',
          paragraphs: [
            'Summer temperatures in Livigno stay cool even at the height of summer, one more reason for anyone seeking relief from city heat without giving up the mountains.'
          ]
        }
      ]
    },
    de: {
      title: 'Was man in Livigno im Sommer erleben kann: 10 Highlights',
      description:
        'Von Mountainbiken über den Lago di Livigno bis zum Duty-free-Shopping: 10 Erlebnisse für den Sommerurlaub in Livigno.',
      intro:
        'Was gibt es in Livigno im Sommer zu tun? Viel mehr, als man von einem Ort erwarten würde, der vor allem für Skifahren bekannt ist: Von Juni bis September verwandelt sich der Alpenkessel in eine der Mountainbike-Hauptstädte Europas, mit Wegen für jedes Niveau, einem See, den man mit dem Kanu erkunden kann, und einem Fußgängerzentrum, das eine der wenigen zollfreien Zonen Italiens bleibt. Hier sind 10 Erlebnisse, die man sich nicht entgehen lassen sollte.',
      sections: [
        {
          heading: '1. Mountainbiken im Mottolino Bikepark',
          paragraphs: [
            'Livigno ist europaweit als eine der Mountainbike-Hauptstädte bekannt, und der Mottolino Bikepark ist ihr Herzstück: 14 Strecken zwischen Downhill, Jump-Area und North-Shore-Abschnitten mit Stegen und Holzelementen, für alle, die echtes Adrenalin im Sattel suchen.'
          ]
        },
        {
          heading: '2. Die Bike Academy für Familien mit Kindern',
          paragraphs: [
            'Man muss kein erfahrener Biker sein: Die Bike Academy bietet eine rund 5 km lange Strecke speziell für Anfänger und Kinder, eine gute Möglichkeit, auch die Kleinsten in einer sicheren Umgebung ans Radfahren heranzuführen.'
          ]
        },
        {
          heading: '3. Wandern rund um den Lago di Livigno',
          paragraphs: [
            'Ein klassischer, für alle geeigneter Spaziergang führt rund um den Lago di Livigno, mit Rastplätzen für ein Picknick an warmen Tagen – die am leichtesten zu organisierende Sommeraktivität, geeignet für jedes Alter.'
          ]
        },
        {
          heading: '4. Ausflüge zu den blühenden Almwiesen',
          paragraphs: [
            'Der Talkessel von Livigno wird von Wanderwegen jeden Schwierigkeitsgrads durchzogen, vorbei an blühenden Almwiesen – die Arnika ist die Symbolblume der Region –, Lärchenwäldern und Ausblicken auf die Rätischen Alpen, für alle, die einen anspruchsvolleren Ausflug suchen.'
          ]
        },
        {
          heading: '5. Carosello 3000 auch im Sommer geöffnet',
          paragraphs: [
            'Auch das winterliche Skigebiet erwacht im Sommer zum Leben: Carosello 3000 öffnet seine Lifte voraussichtlich vom 20. Juni bis 13. September und verbindet Panoramawege in der Höhe, die ohne allzu große Anstrengung erreichbar sind.'
          ]
        },
        {
          heading: '6. Eine Kanufahrt auf dem See',
          paragraphs: [
            'An wärmeren Tagen eignet sich der Lago di Livigno auch für eine Kanufahrt – eine andere Art, das Tal zu erleben, vom Wasser statt von den Bergwegen aus.'
          ]
        },
        {
          heading: '7. Shopping im zollfreien Fußgängerzentrum',
          paragraphs: [
            'Livigno ist eine der wenigen zollfreien Zonen Italiens: Das Fußgängerzentrum mit seinen Duty-free-Geschäften ist auch für Nicht-Skifahrer ein fast obligatorischer Stopp, mit wettbewerbsfähigeren Preisen für Spirituosen, Parfüm und Kosmetik.'
          ]
        },
        {
          heading: '8. Typische Gerichte der Valtellina',
          paragraphs: [
            'Nach einem aktiven Tag lohnt es sich, Pizzoccheri, Sciatt und Bresaola della Valtellina g.g.A. in den Restaurants des Ortes zu probieren – oder sie in Ruhe in der voll ausgestatteten Küche des Apartments selbst zuzubereiten.'
          ]
        },
        {
          heading: '9. Entspannung in der privaten Sauna nach einem aktiven Tag',
          paragraphs: [
            'Der Vorteil einer privaten Infrarotsauna und eines Dampfbads gilt nicht nur für den Winter: Nach einem Tag voller Wanderungen oder Mountainbiken hilft die Wärme, die Muskeln zu lockern, noch bevor man ans Abendessen denkt.'
          ]
        },
        {
          heading: '10. Kühle Temperaturen auch im August',
          paragraphs: [
            'Die Sommertemperaturen in Livigno bleiben auch mitten im Sommer angenehm kühl – ein weiterer Grund für alle, die Erholung von der Stadthitze suchen, ohne auf die Berge zu verzichten.'
          ]
        }
      ]
    }
  },
  'natale-capodanno-a-livigno': {
    en: {
      title: 'Christmas and New Year in Livigno: What to Expect',
      description:
        "Markets, lights on the snow, open slopes and a New Year's Eve party in the square: what to know if you're planning your end-of-year holiday in Livigno.",
      intro:
        "Spending Christmas and New Year in Livigno means waking up to snow-covered mountains outside your window and skiing on slopes that, during this period, are almost always guaranteed by natural snow thanks to the altitude. It's also one of the busiest times of year, so planning ahead really makes a difference. Here's what to expect.",
      sections: [
        {
          heading: 'The town in its festive dress',
          paragraphs: [
            "In the weeks around the holidays, Livigno's pedestrian centre lights up with decorations and Christmas lights, and it's common to find markets with local crafts and Valtellina specialities. It's the ideal time for an evening stroll through the centre after a day of skiing, perhaps stopping for a hot chocolate."
          ]
        },
        {
          heading: 'Skiing over the holidays',
          paragraphs: [
            "The lifts stay open throughout the Christmas period, barring any exceptional weather-related closures. Since this is one of the busiest times of year, it's worth buying your ski pass online in advance and, if possible, avoiding the first days of January to skip the queues at the ticket offices. Families travelling with children should book ski lessons well ahead: ski schools fill up quickly during the Christmas and New Year weeks."
          ]
        },
        {
          heading: "New Year's Eve in the square",
          paragraphs: [
            "On New Year's Eve, Livigno traditionally hosts a party in the main square with music and a fireworks display visible from several points in town — a different way to celebrate than a classic city dinner, with snow and mountains as the backdrop."
          ]
        },
        {
          heading: 'Why you should book well in advance',
          paragraphs: [
            "Between Christmas and New Year, Livigno reaches one of its highest occupancy rates of the year: the best accommodation (especially anything close to the lifts) sells out months in advance. An apartment like Ironwood Livigno, with a fully equipped kitchen, is handy during this period too for anyone wanting to organise a relaxed Christmas lunch with family, without depending on a restaurant's opening hours, and to end the day with a private sauna instead of queuing for a shared spa."
          ]
        }
      ]
    },
    de: {
      title: 'Weihnachten und Silvester in Livigno: Was Sie erwartet',
      description:
        'Märkte, Lichter im Schnee, geöffnete Pisten und eine Silvesterfeier auf dem Platz: was Sie wissen sollten, wenn Sie Ihren Jahreswechsel in Livigno planen.',
      intro:
        'Weihnachten und Silvester in Livigno zu verbringen bedeutet, morgens vor schneebedeckten Bergen aufzuwachen und auf Pisten zu fahren, die in dieser Zeit dank der Höhenlage fast immer durch Naturschnee garantiert sind. Es ist außerdem eine der geschäftigsten Zeiten des Jahres, weshalb sich eine frühzeitige Planung wirklich lohnt. Hier erfahren Sie, was Sie erwartet.',
      sections: [
        {
          heading: 'Der Ort im Festtagskleid',
          paragraphs: [
            'In den Wochen rund um die Feiertage erstrahlt die Fußgängerzone von Livigno in weihnachtlicher Dekoration und Lichtern, und es ist üblich, Märkte mit lokalem Kunsthandwerk und Spezialitäten der Valtellina zu finden. Es ist die ideale Zeit für einen abendlichen Bummel durchs Zentrum nach einem Skitag, vielleicht mit einem Zwischenstopp für eine heiße Schokolade.'
          ]
        },
        {
          heading: 'Skifahren über die Feiertage',
          paragraphs: [
            'Die Lifte bleiben während der gesamten Weihnachtszeit geöffnet, abgesehen von möglichen witterungsbedingten Ausnahmeschließungen. Da dies eine der geschäftigsten Zeiten des Jahres ist, lohnt es sich, den Skipass vorab online zu kaufen und, wenn möglich, die ersten Januartage zu meiden, um Warteschlangen an den Kassen zu vermeiden. Familien mit Kindern sollten Skikurse frühzeitig buchen: Die Skischulen sind in der Weihnachts- und Silvesterwoche schnell ausgebucht.'
          ]
        },
        {
          heading: 'Silvester auf dem Platz',
          paragraphs: [
            'An Silvester veranstaltet Livigno traditionell eine Feier auf dem Hauptplatz mit Musik und einem Feuerwerk, das von mehreren Punkten im Ort aus sichtbar ist – eine andere Art zu feiern als ein klassisches Stadtdinner, mit Schnee und Bergen als Kulisse.'
          ]
        },
        {
          heading: 'Warum man frühzeitig buchen sollte',
          paragraphs: [
            'Zwischen Weihnachten und Silvester erreicht Livigno eine seiner höchsten Auslastungsraten des Jahres: Die besten Unterkünfte (vor allem alles in Liftnähe) sind Monate im Voraus ausgebucht. Ein Apartment wie das Ironwood Livigno mit voll ausgestatteter Küche ist auch in dieser Zeit praktisch für alle, die ein entspanntes Weihnachtsessen mit der Familie organisieren möchten, ohne von den Öffnungszeiten eines Restaurants abhängig zu sein, und den Tag mit einer privaten Sauna statt einer Warteschlange vor einem Gemeinschaftsspa ausklingen lassen wollen.'
          ]
        }
      ]
    }
  }
};
