// en/de translations of the 10 practical-guide posts published 2026-08-09
// (prices, sauna vs hotel, groups, ski storage, booking calendar, breakfast
// and e-bike, tax free, avoiding crowds, dogs, sunsets). Kept in their own
// file so blogTranslations.ts stays readable; merged into the same
// `blogTranslations` map there, so routes, sitemap and hreflang pick them up
// with no other change.
import type { BlogTranslation, TranslatedBlogLocale } from './blogTranslations';

export const practicalBlogTranslations: Record<string, Partial<Record<TranslatedBlogLocale, BlogTranslation>>> = {
  'quanto-costa-un-appartamento-a-livigno': {
    en: {
      title: 'How Much Does an Apartment in Livigno Cost? Prices by Season',
      description:
        'What pushes the price of a stay in Livigno up or down season by season, and how to find the right dates for your budget without surprises.',
      intro:
        "The price of an apartment in Livigno changes a lot depending on when you book, not just where you stay. Before comparing individual listings, it helps to understand which factors really move the total — so you can choose knowingly between saving money and having quieter slopes or trails.",
      sections: [
        {
          heading: 'High season, low season and the weeks in between',
          paragraphs: [
            "As in almost every Alpine resort, the year in Livigno is split into bands: high season (Christmas, New Year, the February school-holiday weeks, and August in summer), low season (the start and end of winter, June and September in summer) and the shoulder periods in between. Properties, Ironwood Livigno included, adjust their rates to this demand: more demand means higher prices, regardless of the quality of the accommodation."
          ]
        },
        {
          heading: 'What raises the price, besides the dates',
          paragraphs: [
            "Seasonality is joined by other factors: how far ahead you book, how many nights you stay (longer stays often get better terms), and location — an apartment close to the lifts, like ours [just 100 metres from the ski lifts](/come-arrivare/en), usually has a different value from one where you need the car to reach the slopes."
          ]
        },
        {
          heading: 'Booking early or last minute: pros and cons',
          paragraphs: [
            "Booking well in advance gives you the widest choice of dates and often the best terms, especially for peak periods, which fill up first. Waiting until the last minute can occasionally reward travellers with completely flexible dates, but it's a gamble: in the busiest weeks, waiting mostly means finding nothing available."
          ]
        },
        {
          heading: "How to get Ironwood Livigno's current rates",
          paragraphs: [
            "Rates vary by season and availability, so the most reliable way to get an exact figure is to ask directly: [write to us with the dates you have in mind](/en/contact) and we'll reply with the current rate for that period, with no last-minute surprises."
          ]
        }
      ],
      relatedLinks: [
        { href: '/en/contact', label: 'Ask us for a quote for your dates' },
        { href: '/blog/quando-prenotare-livigno-calendario-stagionale/en', label: "Read Livigno's full seasonal calendar" },
        { href: '/camere-appartamento-livigno/en', label: 'See the apartment room by room' }
      ]
    },
    de: {
      title: 'Was kostet eine Ferienwohnung in Livigno? Preise nach Saison',
      description:
        'Was den Preis eines Aufenthalts in Livigno je nach Saison steigen oder sinken lässt – und wie Sie ohne Überraschungen die passenden Reisedaten finden.',
      intro:
        'Der Preis einer Ferienwohnung in Livigno hängt stark davon ab, wann Sie buchen – nicht nur davon, wo Sie wohnen. Bevor Sie einzelne Angebote vergleichen, lohnt es sich zu verstehen, welche Faktoren den Gesamtpreis wirklich beeinflussen. So entscheiden Sie bewusst zwischen Sparen und ruhigeren Pisten oder Wegen.',
      sections: [
        {
          heading: 'Hochsaison, Nebensaison und die Wochen dazwischen',
          paragraphs: [
            'Wie in fast allen Alpenorten ist das Jahr in Livigno in Zeiträume gegliedert: Hochsaison (Weihnachten, Silvester, die Februarwochen mit Schulferien und im Sommer der August), Nebensaison (Anfang und Ende des Winters, Juni und September im Sommer) und die Übergangszeiten dazwischen. Die Unterkünfte – Ironwood Livigno eingeschlossen – passen ihre Preise dieser Nachfrage an: Mehr Nachfrage bedeutet höhere Preise, unabhängig von der Qualität der Unterkunft.'
          ]
        },
        {
          heading: 'Was den Preis außer dem Reisedatum erhöht',
          paragraphs: [
            'Zur Saison kommen weitere Faktoren hinzu: wie früh Sie buchen, wie viele Nächte Sie bleiben (längere Aufenthalte erhalten oft bessere Konditionen) und die Lage. Eine Wohnung nahe den Liften, wie unsere [nur 100 Meter von den Aufstiegsanlagen entfernt](/come-arrivare/de), hat in der Regel einen anderen Wert als eine, bei der Sie für den Weg zur Piste das Auto brauchen.'
          ]
        },
        {
          heading: 'Früh buchen oder Last Minute: Vor- und Nachteile',
          paragraphs: [
            'Wer lange im Voraus bucht, hat die größte Auswahl an Terminen und oft die besten Konditionen – besonders in den Spitzenzeiten, die zuerst ausgebucht sind. Last Minute kann sich gelegentlich für Reisende mit völlig flexiblen Daten lohnen, bleibt aber ein Glücksspiel: In den gefragtesten Wochen bedeutet Warten meist, dass nichts mehr frei ist.'
          ]
        },
        {
          heading: 'So erfahren Sie die aktuellen Preise von Ironwood Livigno',
          paragraphs: [
            'Die Preise variieren je nach Saison und Verfügbarkeit. Am zuverlässigsten erhalten Sie einen genauen Betrag, wenn Sie direkt anfragen: [Schreiben Sie uns Ihre Wunschdaten](/de/kontakt), und wir antworten Ihnen mit dem aktuellen Preis für diesen Zeitraum – ohne Überraschungen in letzter Minute.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/de/kontakt', label: 'Angebot für Ihre Reisedaten anfragen' },
        { href: '/blog/quando-prenotare-livigno-calendario-stagionale/de', label: 'Den kompletten Saisonkalender von Livigno lesen' },
        { href: '/camere-appartamento-livigno/de', label: 'Die Wohnung Zimmer für Zimmer ansehen' }
      ]
    }
  },
  'appartamento-con-sauna-privata-livigno-vs-hotel': {
    en: {
      title: 'Apartment with a Private Sauna in Livigno vs a Hotel Spa',
      description:
        "What changes between a shared hotel spa and a private sauna included in your apartment: no time slots, no bookings, every day of your holiday.",
      intro:
        "Many mountain hotels offer a spa, but it is almost always shared with other guests, with time slots to book and access charged separately from the room. An apartment with its own private sauna changes that balance — and you feel the difference most after a few days of holiday.",
      sections: [
        {
          heading: 'The trouble with a shared hotel spa',
          paragraphs: [
            "Booking a slot, waiting your turn, sharing the space with strangers: small frictions you notice most when you come back tired from skiing or a hike and just want to relax without thinking about it. In high season the available slots shrink even further."
          ]
        },
        {
          heading: 'Sauna and steam bath as part of the apartment, not an extra',
          paragraphs: [
            "At Ironwood Livigno the [infrared sauna and steam bath](/sauna-bagno-turco-privato-livigno/en) are part of the apartment itself, not a paid service in a common area: they are exclusive to the guests staying here, available whenever you like, never shared with other guests and with nothing to book."
          ]
        },
        {
          heading: 'A ritual that becomes part of the holiday',
          paragraphs: [
            "The most concrete practical advantage is that you can repeat it: it becomes a fixed moment of every day rather than an occasional treat you have to schedule in advance. You come back from the slopes or the trail, warm up at your own pace, and only then think about dinner — with no timetable to keep."
          ]
        },
        {
          heading: 'Who it really makes a difference for',
          paragraphs: [
            "It matters most for stays of several days and for families or groups who want to use the space together rather than splitting into shifts. For a single night in a hotel the comparison weighs less; over a ski week or a longer summer holiday, the difference adds up day after day."
          ]
        }
      ],
      relatedLinks: [
        { href: '/sauna-bagno-turco-privato-livigno/en', label: 'Discover the private sauna in Livigno' },
        { href: '/blog/sauna-privata-vs-condivisa-livigno/en', label: 'Read the full private vs shared sauna comparison' },
        { href: '/camere-appartamento-livigno/en', label: 'See the apartment in detail' }
      ]
    },
    de: {
      title: 'Ferienwohnung mit privater Sauna in Livigno oder Hotel-Spa?',
      description:
        'Was sich zwischen einem geteilten Hotel-Spa und einer privaten Sauna in der eigenen Ferienwohnung ändert: keine Zeitfenster, keine Reservierung, jeden Urlaubstag.',
      intro:
        'Viele Berghotels bieten einen Wellnessbereich – fast immer aber mit anderen Gästen geteilt, mit buchbaren Zeitfenstern und separat bezahltem Zugang. Eine Ferienwohnung mit eigener privater Sauna verschiebt dieses Gleichgewicht, und den Unterschied spürt man vor allem nach ein paar Urlaubstagen.',
      sections: [
        {
          heading: 'Das Problem mit dem geteilten Hotel-Spa',
          paragraphs: [
            'Einen Termin buchen, warten, bis man an der Reihe ist, den Raum mit Fremden teilen: Kleinigkeiten, die vor allem dann stören, wenn man müde vom Skifahren oder Wandern zurückkommt und einfach nur entspannen möchte. In der Hochsaison werden die freien Zeitfenster zudem noch knapper.'
          ]
        },
        {
          heading: 'Sauna und Dampfbad als Teil der Wohnung, nicht als Extra',
          paragraphs: [
            'Bei Ironwood Livigno gehören [Infrarotsauna und Dampfbad](/sauna-bagno-turco-privato-livigno/de) zur Wohnung selbst und sind kein kostenpflichtiger Service in einem Gemeinschaftsbereich: Sie stehen ausschließlich den Gästen dieser Wohnung zur Verfügung, wann immer Sie möchten – ohne Teilen mit anderen und ohne Reservierung.'
          ]
        },
        {
          heading: 'Ein Ritual, das zum Urlaub gehört',
          paragraphs: [
            'Der konkreteste Vorteil ist die Wiederholbarkeit: Die Sauna wird zu einem festen Moment jedes Tages statt zu einem gelegentlichen Erlebnis, das man vorab planen muss. Sie kommen von der Piste oder vom Wanderweg zurück, wärmen sich in Ruhe auf und denken erst danach ans Abendessen – ganz ohne feste Zeiten.'
          ]
        },
        {
          heading: 'Für wen es sich wirklich lohnt',
          paragraphs: [
            'Den größten Unterschied macht es bei mehrtägigen Aufenthalten und für Familien oder Gruppen, die den Raum gemeinsam nutzen möchten, statt sich in Schichten aufzuteilen. Für eine einzelne Hotelnacht fällt der Vergleich weniger ins Gewicht; in einer Skiwoche oder einem längeren Sommerurlaub summiert sich der Unterschied Tag für Tag.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/sauna-bagno-turco-privato-livigno/de', label: 'Die private Sauna in Livigno entdecken' },
        { href: '/blog/sauna-privata-vs-condivisa-livigno/de', label: 'Den Vergleich private vs. geteilte Sauna lesen' },
        { href: '/camere-appartamento-livigno/de', label: 'Die Wohnung im Detail ansehen' }
      ]
    }
  },
  'livigno-per-gruppi-numerosi-fino-a-6-persone': {
    en: {
      title: 'Livigno for Groups: How to Plan a Stay for Up to 6 People',
      description:
        'Practical tips for planning a group holiday in Livigno: living space, bathrooms, kitchen and logistics so up to 6 people stay comfortable together.',
      intro:
        "Planning a holiday in Livigno with a larger group — friends, extended families, several couples together — raises different questions from a couple or a small family: shared living space, bathrooms and getting everyone ready in the morning all become things to think about before you book.",
      sections: [
        {
          heading: 'How much space a group really needs',
          paragraphs: [
            "An apartment meant for groups needs more than just beds: it needs living areas large enough for everyone to spend the evening together, without someone always ending up alone in their room. [Ironwood Livigno spans 90 m² with 3 bedrooms](/camere-appartamento-livigno/en), for up to 6 guests — designed precisely for this kind of stay."
          ]
        },
        {
          heading: 'Two bathrooms make all the difference',
          paragraphs: [
            "With a bigger group, a single bathroom quickly becomes a bottleneck, especially in the morning before heading to the slopes. The apartment has 2 full bathrooms, a layout chosen precisely to avoid queues when the house is full."
          ]
        },
        {
          heading: 'Your own kitchen vs eating out every night',
          paragraphs: [
            "For a group, always eating out often means complicated reservations and growing bills. A fully equipped kitchen lets you mix things up: some dinners all together in the apartment, some evenings at a restaurant, with more flexibility on timing and budget than a hotel with fixed half board."
          ]
        },
        {
          heading: 'Ski and bike storage to keep the entrance clear',
          paragraphs: [
            "With more people, the gear multiplies: skis, boots, poles, maybe bikes. Ironwood Livigno's dedicated ski and bike storage keeps all of it from piling up in the entrance or being carried indoors every evening."
          ]
        }
      ],
      relatedLinks: [
        { href: '/camere-appartamento-livigno/en', label: 'See the layout of the 3 bedrooms and 2 bathrooms' },
        { href: '/en/contact', label: "Write to us to plan your group's stay" },
        { href: '/blog/quanto-costa-sciare-a-livigno-guida-prezzi/en', label: 'Read how much a ski week in Livigno costs' }
      ]
    },
    de: {
      title: 'Livigno mit der Gruppe: Aufenthalt für bis zu 6 Personen planen',
      description:
        'Praktische Tipps für den Gruppenurlaub in Livigno: Platz, Badezimmer, Küche und Organisation, damit sich bis zu 6 Personen gemeinsam wohlfühlen.',
      intro:
        'Wer mit einer größeren Gruppe nach Livigno reist – Freunde, Großfamilie, mehrere Paare zusammen –, steht vor anderen Fragen als ein Paar oder eine kleine Familie: Gemeinschaftsräume, Badezimmer und die Zeit, bis morgens alle startklar sind, sollten Sie schon vor der Buchung bedenken.',
      sections: [
        {
          heading: 'Wie viel Platz eine Gruppe wirklich braucht',
          paragraphs: [
            'Eine Wohnung für Gruppen braucht mehr als nur Betten: Die Gemeinschaftsräume müssen groß genug sein, damit abends alle zusammensitzen können, ohne dass jemand immer allein im Zimmer bleibt. [Ironwood Livigno bietet 90 m² mit 3 Schlafzimmern](/camere-appartamento-livigno/de) für bis zu 6 Gäste – genau für diese Art von Aufenthalt gedacht.'
          ]
        },
        {
          heading: 'Zwei Badezimmer machen den Unterschied',
          paragraphs: [
            'In einer großen Gruppe wird ein einziges Bad schnell zum Engpass, vor allem morgens vor dem Aufbruch zur Piste. Die Wohnung hat 2 vollständige Badezimmer – eine Aufteilung, die bewusst Warteschlangen vermeidet, wenn das Haus voll belegt ist.'
          ]
        },
        {
          heading: 'Eigene Küche statt jeden Abend ins Restaurant',
          paragraphs: [
            'Für eine Gruppe bedeutet jeden Abend auswärts essen oft komplizierte Reservierungen und hohe Rechnungen. Mit einer voll ausgestatteten Küche können Sie abwechseln: einige Abendessen gemeinsam in der Wohnung, einige Abende im Restaurant – mit mehr Flexibilität bei Zeiten und Budget als in einem Hotel mit fester Halbpension.'
          ]
        },
        {
          heading: 'Ski- und Fahrradraum, damit der Eingang frei bleibt',
          paragraphs: [
            'Mit mehr Personen vervielfacht sich die Ausrüstung: Ski, Skischuhe, Stöcke, vielleicht Fahrräder. Der eigene Ski- und Fahrradraum von Ironwood Livigno verhindert, dass sich all das im Eingang stapelt oder jeden Abend in die Wohnung getragen werden muss.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/camere-appartamento-livigno/de', label: 'Aufteilung der 3 Schlafzimmer und 2 Bäder ansehen' },
        { href: '/de/kontakt', label: 'Schreiben Sie uns, um den Gruppenaufenthalt zu planen' },
        { href: '/blog/quanto-costa-sciare-a-livigno-guida-prezzi/de', label: 'Lesen, was eine Skiwoche in Livigno kostet' }
      ]
    }
  },
  'deposito-sci-e-attrezzatura-a-livigno-cosa-cercare': {
    en: {
      title: 'Ski Storage in Livigno: What to Look For in Your Accommodation',
      description:
        'Why a dedicated ski room in your accommodation changes a snow holiday, and what to check about space, heating and security before you book.',
      intro:
        "Skis, boots, poles, helmets: ski gear takes up space, is awkward to carry around wet, and left in your room it can damage floors and rugs. A dedicated ski room in your accommodation is one of those details that seem minor until you have one — and then become indispensable.",
      sections: [
        {
          heading: "Why it's more than a convenience",
          paragraphs: [
            "Coming back from the slopes with wet boots and having to carry them all the way to your room, perhaps up the stairs of an apartment building, is awkward and slows down the whole family's evening routine. A storage room near the entrance solves the problem at the root: the gear stays ready for the next day without cluttering the living space."
          ]
        },
        {
          heading: 'What to look for: space, heating, security',
          paragraphs: [
            "Not all ski rooms are equal: check that there is enough space for the whole group's gear, whether it is heated or at least sheltered (so boots and gloves can dry overnight), and whether it can be locked — especially if your equipment is rented or valuable."
          ]
        },
        {
          heading: "Ironwood Livigno's ski and bike storage",
          paragraphs: [
            "Ironwood Livigno includes a dedicated ski and bike storage room, designed for guests who arrive with their own gear — skis in winter, bikes in summer. And since [the apartment is just 100 metres from the ski lifts](/come-arrivare/en), the walk between storage and slopes is very short anyway."
          ]
        },
        {
          heading: 'A detail you notice most with children or groups',
          paragraphs: [
            "More people means more gear to manage every day: with small children or a large group, a dedicated storage room keeps the entrance from turning into a pile of skis, boots and wet jackets every evening."
          ]
        }
      ],
      relatedLinks: [
        { href: '/camere-appartamento-livigno/en', label: 'See all the practical details of the apartment' },
        { href: '/inverno/en', label: 'Read the complete guide to winter in Livigno' },
        { href: '/blog/migliori-piste-sci-livigno-famiglie/en', label: 'Discover the best slopes for families' }
      ]
    },
    de: {
      title: 'Skiraum in Livigno: Worauf Sie bei der Unterkunft achten sollten',
      description:
        'Warum ein eigener Skiraum in der Unterkunft den Winterurlaub verändert – und was Sie vor der Buchung zu Platz, Heizung und Sicherheit prüfen sollten.',
      intro:
        'Ski, Skischuhe, Stöcke, Helm: Die Skiausrüstung braucht Platz, ist nass unhandlich zu tragen und kann im Zimmer Böden und Teppiche beschädigen. Ein eigener Skiraum in der Unterkunft gehört zu den Details, die nebensächlich wirken, bis man einen hat – und dann unverzichtbar werden.',
      sections: [
        {
          heading: 'Warum es mehr als nur Komfort ist',
          paragraphs: [
            'Mit nassen Skischuhen von der Piste zu kommen und sie bis ins Zimmer tragen zu müssen, womöglich das Treppenhaus hinauf, ist lästig und bremst den Abendablauf der ganzen Familie. Ein Raum nahe dem Eingang löst das Problem an der Wurzel: Die Ausrüstung liegt für den nächsten Tag bereit, ohne den Wohnraum zu belegen.'
          ]
        },
        {
          heading: 'Worauf Sie achten sollten: Platz, Heizung, Sicherheit',
          paragraphs: [
            'Skiraum ist nicht gleich Skiraum: Prüfen Sie, ob genug Platz für die Ausrüstung der ganzen Gruppe da ist, ob er beheizt oder zumindest geschützt ist (damit Schuhe und Handschuhe über Nacht trocknen) und ob er abschließbar ist – besonders bei geliehener oder wertvoller Ausrüstung.'
          ]
        },
        {
          heading: 'Der Ski- und Fahrradraum von Ironwood Livigno',
          paragraphs: [
            'Ironwood Livigno verfügt über einen eigenen Ski- und Fahrradraum für Gäste, die mit Ausrüstung anreisen – im Winter mit Ski, im Sommer mit dem Rad. Und da [die Wohnung nur 100 Meter von den Liften entfernt liegt](/come-arrivare/de), ist der Weg vom Skiraum zur Piste ohnehin sehr kurz.'
          ]
        },
        {
          heading: 'Ein Detail, das man mit Kindern oder in der Gruppe besonders merkt',
          paragraphs: [
            'Mehr Personen bedeuten mehr Ausrüstung, die jeden Tag verstaut werden will: Mit kleinen Kindern oder einer großen Gruppe verhindert ein eigener Skiraum, dass sich im Eingang jeden Abend Ski, Schuhe und nasse Jacken türmen.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/camere-appartamento-livigno/de', label: 'Alle praktischen Details der Wohnung ansehen' },
        { href: '/inverno/de', label: 'Den kompletten Winter-Guide für Livigno lesen' },
        { href: '/blog/migliori-piste-sci-livigno-famiglie/de', label: 'Die besten Pisten für Familien entdecken' }
      ]
    }
  },
  'quando-prenotare-livigno-calendario-stagionale': {
    en: {
      title: 'When to Book Livigno: A Seasonal Calendar',
      description:
        "High season, low season and the shoulder weeks: how to read Livigno's calendar to choose when to go, and how far ahead to book for each period.",
      intro:
        "Livigno is one of the few Alpine resorts with two distinct tourist seasons, winter and summer, both long compared with many similar destinations. Understanding how the calendar works helps you pick the right dates, both for the kind of holiday you want and for booking with enough notice.",
      sections: [
        {
          heading: 'The winter calendar',
          paragraphs: [
            "The ski season in Livigno generally runs from late November to early May — a longer stretch than at many other Italian Alpine resorts. That means you can ski at the very start or end of the season, when lifts elsewhere are already closed, often with fewer crowds and a quieter atmosphere."
          ]
        },
        {
          heading: 'The summer calendar',
          paragraphs: [
            "In summer the ski area changes face: the lifts reopen roughly from 20 June to 13 September for the bike park and high-altitude trails, while the rest of the valley — the lake, hiking, mountain pastures — stays accessible for the whole summer, from June to September."
          ]
        },
        {
          heading: 'The peak periods to book furthest ahead',
          paragraphs: [
            "Christmas, New Year and the February school-holiday weeks are traditionally the most sought-after times of the winter; August is the peak of the summer. If you want to travel in these windows, book well ahead, because availability drops quickly."
          ]
        },
        {
          heading: 'A practical tip on timing',
          paragraphs: [
            "If your dates are flexible, the weeks just before or after the peaks — early December and March-April in winter, June or September in summer — often offer the same scenery and activities with fewer people. If you're aiming exactly at the peak periods, book well in advance."
          ]
        }
      ],
      relatedLinks: [
        { href: '/blog/natale-capodanno-a-livigno/en', label: 'Read what to expect from Christmas and New Year in Livigno' },
        { href: '/inverno/en', label: 'Discover the complete winter guide' },
        { href: '/estate/en', label: 'Discover the complete summer guide' }
      ]
    },
    de: {
      title: 'Wann Livigno buchen? Der Saisonkalender',
      description:
        'Hochsaison, Nebensaison und Übergangswochen: So lesen Sie den Kalender von Livigno, um den richtigen Reisezeitpunkt und die passende Vorlaufzeit zu wählen.',
      intro:
        'Livigno ist einer der wenigen Alpenorte mit zwei klar getrennten Tourismussaisons, Winter und Sommer, die beide im Vergleich zu ähnlichen Zielen lang sind. Wer versteht, wie der Kalender aufgebaut ist, wählt leichter die richtigen Daten – für die gewünschte Urlaubsart und mit genügend Vorlauf bei der Buchung.',
      sections: [
        {
          heading: 'Der Winterkalender',
          paragraphs: [
            'Die Skisaison in Livigno beginnt in der Regel Ende November und dauert bis Anfang Mai – länger als in vielen anderen italienischen Alpenorten. So können Sie auch ganz am Anfang oder Ende der Saison Ski fahren, wenn anderswo die Lifte schon geschlossen sind, oft mit weniger Andrang und in ruhigerer Atmosphäre.'
          ]
        },
        {
          heading: 'Der Sommerkalender',
          paragraphs: [
            'Im Sommer verwandelt sich das Skigebiet: Die Lifte öffnen etwa vom 20. Juni bis 13. September wieder für den Bikepark und die Höhenwege, während der Rest des Tals – See, Wanderungen, Almen – den ganzen Sommer über von Juni bis September zugänglich bleibt.'
          ]
        },
        {
          heading: 'Die Spitzenzeiten, die Sie am frühesten buchen sollten',
          paragraphs: [
            'Weihnachten, Silvester und die Februarwochen mit Schulferien sind traditionell die gefragtesten Zeiten im Winter, im Sommer ist es der August. Wer in diesen Zeiträumen reisen möchte, sollte früh buchen, denn die Verfügbarkeit sinkt schnell.'
          ]
        },
        {
          heading: 'Ein praktischer Tipp zum richtigen Zeitpunkt',
          paragraphs: [
            'Wenn Sie flexibel sind, bieten die Wochen direkt vor oder nach den Spitzenzeiten – Anfang Dezember und März/April im Winter, Juni oder September im Sommer – oft dieselbe Landschaft und dieselben Aktivitäten mit weniger Menschen. Wenn Sie genau die Spitzenzeiten anpeilen, buchen Sie am besten lange im Voraus.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/blog/natale-capodanno-a-livigno/de', label: 'Weihnachten und Silvester in Livigno: was Sie erwartet' },
        { href: '/inverno/de', label: 'Den kompletten Winter-Guide entdecken' },
        { href: '/estate/de', label: 'Den kompletten Sommer-Guide entdecken' }
      ]
    }
  },
  'vacanza-senza-pensieri-a-livigno-colazione-ed-e-bike': {
    en: {
      title: 'A Carefree Holiday in Livigno: Breakfast and E-Bike Rental',
      description:
        'Two optional services that make your stay at Ironwood Livigno easier: breakfast on request nearby and e-bike rental straight from the apartment.',
      intro:
        "An apartment holiday gives you more freedom than a hotel, but sometimes you give up a few comforts to get it. At Ironwood Livigno we've added two optional services to narrow that gap, without giving up the independence of having a whole apartment to yourself.",
      sections: [
        {
          heading: 'Breakfast on request, a few steps from home',
          paragraphs: [
            "For guests who'd like to start the day with a proper breakfast before heading out, we offer a paid breakfast-on-request service at a partner venue a few metres from the apartment — handy if you don't want to give up this ritual but still prefer to cook for yourself the rest of the time."
          ]
        },
        {
          heading: 'E-bike rental straight from the apartment',
          paragraphs: [
            "On request, we arrange e-bike rental directly at the apartment: a great way to cover more ground in summer without wearing yourself out on the climbs, from the trails around [Lake Livigno](/estate/en) to the routes up to the high pastures."
          ]
        },
        {
          heading: 'Who they are really useful for',
          paragraphs: [
            "Both services are designed for people travelling with children, with less active parents, or who simply want one less thing to organise, while keeping the flexibility of an independent apartment instead of a hotel with fixed board."
          ]
        },
        {
          heading: 'How to request them',
          paragraphs: [
            "Both services are on request and not automatically included in your stay: [write to us](/en/contact) before or on arrival to arrange breakfast and e-bikes around your plans and availability for your dates."
          ]
        }
      ],
      relatedLinks: [
        { href: '/en/contact', label: 'Write to us to request breakfast or e-bikes' },
        { href: '/sauna-bagno-turco-privato-livigno/en', label: 'Discover the private sauna and steam bath' },
        { href: '/blog/livigno-estate-mountain-bike-trekking-lago/en', label: 'Read the e-bike routes around the lake' }
      ]
    },
    de: {
      title: 'Sorgenfreier Urlaub in Livigno: Frühstück und E-Bike-Verleih',
      description:
        'Zwei optionale Services, die Ihren Aufenthalt bei Ironwood Livigno einfacher machen: Frühstück auf Anfrage in der Nähe und E-Bike-Verleih direkt ab der Wohnung.',
      intro:
        'Ein Urlaub in der Ferienwohnung bietet mehr Freiheit als ein Hotel, doch dafür verzichtet man manchmal auf etwas Komfort. Bei Ironwood Livigno haben wir zwei optionale Services eingeführt, die diesen Kompromiss verkleinern – ohne auf die Unabhängigkeit einer eigenen Wohnung zu verzichten.',
      sections: [
        {
          heading: 'Frühstück auf Anfrage, nur ein paar Schritte entfernt',
          paragraphs: [
            'Für Gäste, die den Tag gern mit einem ausgiebigen Frühstück beginnen, bieten wir einen kostenpflichtigen Frühstücksservice auf Anfrage in einem Partnerbetrieb wenige Meter von der Wohnung entfernt an – praktisch, wenn Sie auf dieses Ritual nicht verzichten, sich aber sonst lieber selbst versorgen möchten.'
          ]
        },
        {
          heading: 'E-Bike-Verleih direkt ab der Wohnung',
          paragraphs: [
            'Auf Anfrage organisieren wir den E-Bike-Verleih direkt an der Wohnung: ideal, um im Sommer mehr Strecke zu schaffen, ohne sich an den Anstiegen zu verausgaben – von den Wegen rund um den [Lago di Livigno](/estate/de) bis zu den Routen hinauf zu den Almen.'
          ]
        },
        {
          heading: 'Für wen sie wirklich nützlich sind',
          paragraphs: [
            'Beide Services richten sich an Familien mit Kindern, an Reisende mit weniger trainierten Eltern oder an alle, die sich einfach eine organisatorische Sorge sparen möchten – mit der Flexibilität einer unabhängigen Wohnung statt eines Hotels mit fester Verpflegung.'
          ]
        },
        {
          heading: 'So fragen Sie sie an',
          paragraphs: [
            'Beide Services gibt es auf Anfrage, sie sind nicht automatisch im Aufenthalt enthalten: [Schreiben Sie uns](/de/kontakt) vor oder bei Ihrer Ankunft, um Frühstück und E-Bikes nach Ihren Wünschen und der Verfügbarkeit zu organisieren.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/de/kontakt', label: 'Frühstück oder E-Bikes anfragen' },
        { href: '/sauna-bagno-turco-privato-livigno/de', label: 'Private Sauna und Dampfbad entdecken' },
        { href: '/blog/livigno-estate-mountain-bike-trekking-lago/de', label: 'Die E-Bike-Routen rund um den See lesen' }
      ]
    }
  },
  'livigno-tax-free-guida-per-chi-arriva-dallestero': {
    en: {
      title: 'Livigno Tax Free: A Practical Guide for Visitors from Abroad',
      description:
        "What it means that Livigno is a customs-free zone, what's worth buying, and what to know about duty-free allowances before making larger purchases.",
      intro:
        "Livigno is one of Italy's few customs-free zones: because of its isolated position, it has historically been exempt from certain taxes, including VAT on many goods. If you're coming from abroad, this status has practical implications worth knowing before you fill your basket.",
      sections: [
        {
          heading: 'What "customs-free zone" means',
          paragraphs: [
            "Being a customs-free zone means that on many products — spirits, perfume, cosmetics, cigarettes, fuel — prices are lower than in the rest of Italy and much of Europe, because they don't carry the same taxes. It's one of the reasons Livigno draws visitors even just for shopping."
          ]
        },
        {
          heading: "What's worth buying",
          paragraphs: [
            "The best value is in wines, spirits and liqueurs — including niche labels — as well as cigarettes and cigars, generally the products where the saving compared with usual prices is most noticeable."
          ]
        },
        {
          heading: 'Duty-free allowances when you go home',
          paragraphs: [
            "Duty-free allowances depend on the country you're returning to: travellers returning to another EU country follow EU customs rules, which are generally more generous; those returning outside the EU or to Switzerland need to check their own country's specific limits, which are often stricter. The rules change over time, so don't take them for granted."
          ]
        },
        {
          heading: 'A practical tip before making larger purchases',
          paragraphs: [
            "If you're planning a sizeable purchase — a case of wine, several bottles of spirits — check the allowances on the official customs website of your country of residence beforehand, so there are no surprises on the way home."
          ]
        }
      ],
      relatedLinks: [
        { href: '/blog/shopping-duty-free-livigno-cosa-comprare/en', label: 'Read the complete duty-free shopping guide' },
        { href: '/blog/come-arrivare-a-livigno/en', label: 'Find out how to get to Livigno from abroad' },
        { href: '/en/contact', label: 'Write to us to plan your stay' }
      ]
    },
    de: {
      title: 'Livigno zollfrei: Praktischer Guide für Gäste aus dem Ausland',
      description:
        'Was es bedeutet, dass Livigno eine Zollfreizone ist, was sich zu kaufen lohnt und was Sie vor größeren Einkäufen über Freimengen wissen sollten.',
      intro:
        'Livigno ist eine der wenigen Zollfreizonen Italiens: Wegen seiner abgelegenen Lage ist der Ort seit jeher von bestimmten Steuern befreit, darunter die Mehrwertsteuer auf viele Waren. Wer aus dem Ausland anreist, sollte die praktischen Folgen dieses Status kennen, bevor der Einkaufskorb voll ist.',
      sections: [
        {
          heading: 'Was „Zollfreizone“ bedeutet',
          paragraphs: [
            'Als Zollfreizone sind viele Produkte – Spirituosen, Parfüm, Kosmetik, Zigaretten, Treibstoff – günstiger als im übrigen Italien und in weiten Teilen Europas, weil nicht dieselben Steuern anfallen. Das ist einer der Gründe, warum Livigno Besucher auch nur zum Einkaufen anzieht.'
          ]
        },
        {
          heading: 'Was sich zu kaufen lohnt',
          paragraphs: [
            'Am meisten sparen Sie bei Weinen, Spirituosen und Likören – auch bei Nischenmarken – sowie bei Zigaretten und Zigarren, die im Vergleich zu den üblichen Preisen meist den deutlichsten Preisvorteil bieten.'
          ]
        },
        {
          heading: 'Freimengen bei der Rückreise',
          paragraphs: [
            'Die zollfreien Mengen hängen vom Land ab, in das Sie zurückreisen: Wer in ein anderes EU-Land zurückkehrt, folgt den EU-Zollregeln, die in der Regel großzügiger sind. Wer in ein Land außerhalb der EU oder in die Schweiz zurückreist, muss die dortigen, oft strengeren Grenzen prüfen. Die Regeln ändern sich mit der Zeit und sollten nicht als selbstverständlich gelten.'
          ]
        },
        {
          heading: 'Ein praktischer Tipp vor größeren Einkäufen',
          paragraphs: [
            'Wenn Sie einen größeren Einkauf planen – eine Kiste Wein, mehrere Flaschen Spirituosen –, prüfen Sie vorher die Freimengen auf der offiziellen Zollwebsite Ihres Wohnsitzlandes, damit es bei der Heimreise keine Überraschungen gibt. In Deutschland ist das der Zoll, in der Schweiz das Bundesamt für Zoll und Grenzsicherheit (BAZG).'
          ]
        }
      ],
      relatedLinks: [
        { href: '/blog/shopping-duty-free-livigno-cosa-comprare/de', label: 'Den kompletten Duty-free-Shopping-Guide lesen' },
        { href: '/blog/come-arrivare-a-livigno/de', label: 'Anreise nach Livigno aus dem Ausland' },
        { href: '/de/kontakt', label: 'Schreiben Sie uns, um Ihren Aufenthalt zu planen' }
      ]
    }
  },
  'migliori-periodi-per-evitare-la-folla-a-livigno': {
    en: {
      title: 'The Best Times to Avoid the Crowds in Livigno',
      description:
        "When Livigno is busiest, and which weeks of the year let you enjoy the slopes, trails and town centre with fewer queues and a calmer atmosphere.",
      intro:
        "Livigno is a popular destination in both winter and summer, but not every week of the year is equally busy. Knowing the quieter windows helps you enjoy the slopes, trails and town centre with fewer queues, often without missing out on anything.",
      sections: [
        {
          heading: 'The busiest periods',
          paragraphs: [
            "In winter, Christmas, New Year and the February school-holiday weeks are traditionally the peaks, with busier lifts and a fuller town centre. In summer, August is the most popular month, thanks to most visitors' summer holidays."
          ]
        },
        {
          heading: 'The quieter windows',
          paragraphs: [
            "At the start and end of the ski season — December before the holidays, or March-April — the slopes are often emptier, with the same reliable snow thanks to the altitude. In summer, June and September offer trails and the lake with fewer people than August, and still pleasant temperatures."
          ]
        },
        {
          heading: 'Practical benefits of travelling off-peak',
          paragraphs: [
            "Fewer crowds generally means shorter queues at the lifts, more choice of restaurants without booking weeks ahead, and a more relaxed atmosphere in the pedestrian centre. Often, though not always, it also means more accommodation available and more room to choose."
          ]
        },
        {
          heading: 'A workable balance',
          paragraphs: [
            "If you're not tied to school holidays, the weeks right next to the peak periods — without falling on the absolute busiest days — often offer the best compromise between a festive atmosphere and manageable queues."
          ]
        }
      ],
      relatedLinks: [
        { href: '/blog/quando-prenotare-livigno-calendario-stagionale/en', label: 'Read the full seasonal calendar' },
        { href: '/inverno/en', label: 'Discover the complete winter guide' },
        { href: '/estate/en', label: 'Discover the complete summer guide' }
      ]
    },
    de: {
      title: 'Die besten Reisezeiten, um in Livigno den Massen zu entgehen',
      description:
        'Wann in Livigno am meisten los ist und in welchen Wochen Sie Pisten, Wanderwege und Ortszentrum mit weniger Andrang und ruhigerer Atmosphäre genießen.',
      intro:
        'Livigno ist im Winter wie im Sommer ein sehr gefragtes Ziel, aber nicht jede Woche des Jahres ist gleich voll. Wer die ruhigeren Zeitfenster kennt, genießt Pisten, Wanderwege und Ortszentrum mit weniger Warteschlangen – oft ohne auf etwas verzichten zu müssen.',
      sections: [
        {
          heading: 'Die vollsten Zeiträume',
          paragraphs: [
            'Im Winter sind Weihnachten, Silvester und die Februarwochen mit Schulferien traditionell die Spitzenzeiten, mit volleren Liften und belebtem Ortszentrum. Im Sommer ist der August der gefragteste Monat, weil dann die meisten Gäste Ferien haben.'
          ]
        },
        {
          heading: 'Die ruhigeren Zeitfenster',
          paragraphs: [
            'Zu Beginn und am Ende der Skisaison – im Dezember vor den Feiertagen oder im März/April – sind die Pisten oft leerer, bei dank der Höhenlage gleich sicherem Schnee. Im Sommer bieten Juni und September Wanderwege und See mit weniger Menschen als im August und trotzdem angenehme Temperaturen.'
          ]
        },
        {
          heading: 'Praktische Vorteile außerhalb der Spitzenzeiten',
          paragraphs: [
            'Weniger Andrang bedeutet in der Regel kürzere Wartezeiten an den Liften, mehr Auswahl bei Restaurants ohne wochenlange Vorreservierung und eine entspanntere Atmosphäre in der Fußgängerzone. Oft, wenn auch nicht immer, gibt es zudem mehr freie Unterkünfte und mehr Auswahl.'
          ]
        },
        {
          heading: 'Ein guter Kompromiss',
          paragraphs: [
            'Wenn Sie nicht an Schulferien gebunden sind, bieten die Wochen direkt neben den Spitzenzeiten – ohne auf die absolut vollsten Tage zu fallen – oft den besten Mittelweg zwischen festlicher Stimmung und überschaubaren Warteschlangen.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/blog/quando-prenotare-livigno-calendario-stagionale/de', label: 'Den kompletten Saisonkalender lesen' },
        { href: '/inverno/de', label: 'Den kompletten Winter-Guide entdecken' },
        { href: '/estate/de', label: 'Den kompletten Sommer-Guide entdecken' }
      ]
    }
  },
  'livigno-con-il-cane-regole-e-alternative': {
    en: {
      title: 'Livigno with Your Dog: Rules and Alternatives',
      description:
        "What to know if you want to bring your dog on holiday to Livigno, and why Ironwood Livigno isn't the right choice for guests travelling with pets.",
      intro:
        "Taking the dog to the mountains is a common choice for many travellers, but not every property is set up to welcome one. Here's what to know if you're considering a holiday in Livigno with your dog — and why it's best to be clear about this from the start.",
      sections: [
        {
          heading: "Ironwood Livigno doesn't accept pets",
          paragraphs: [
            "We say it openly to avoid misunderstandings at booking: our apartment does not accept pets. If you're travelling with your dog, this property isn't the right fit for your stay."
          ]
        },
        {
          heading: 'General rules for bringing a dog to the mountains',
          paragraphs: [
            "In the mountains there are usually common-sense rules and local regulations on leashes and on access to lifts and trails, which can vary between ski areas and change from season to season. Before you leave, it's worth checking the latest rules on Livigno's official tourism channels."
          ]
        },
        {
          heading: 'Alternatives if you travel with a dog to Livigno',
          paragraphs: [
            "There are properties in the area specifically set up for guests with pets: the most reliable approach is to look for accommodation that explicitly states it is pet-friendly and to check any conditions directly with the host (size, extra charges, accessible common areas)."
          ]
        },
        {
          heading: 'Our advice',
          paragraphs: [
            "If your dog is part of the holiday, look for a property that explicitly says it is pet-friendly before booking, so there are no surprises on arrival. For everything else about a holiday in Livigno, we're always happy to share tips about the area."
          ]
        }
      ],
      relatedLinks: [
        { href: '/en/contact', label: 'Contact us for more information about your stay' },
        { href: '/blog/livigno-con-bambini-attivita-famiglia/en', label: 'Read the guide to family holidays in Livigno' },
        { href: '/camere-appartamento-livigno/en', label: 'See the apartment in detail' }
      ]
    },
    de: {
      title: 'Livigno mit Hund: Regeln und Alternativen',
      description:
        'Was Sie wissen sollten, wenn Sie Ihren Hund mit in den Urlaub nach Livigno nehmen möchten – und warum Ironwood Livigno für Reisende mit Haustieren nicht passt.',
      intro:
        'Den Hund mit in die Berge zu nehmen, ist für viele Reisende selbstverständlich, doch nicht jede Unterkunft ist darauf eingestellt. Hier erfahren Sie, was Sie bei einem Urlaub in Livigno mit Hund beachten sollten – und warum wir dazu lieber von Anfang an klare Worte finden.',
      sections: [
        {
          heading: 'Ironwood Livigno nimmt keine Haustiere auf',
          paragraphs: [
            'Wir sagen es offen, um Missverständnisse bei der Buchung zu vermeiden: In unserer Wohnung sind keine Haustiere erlaubt. Wenn Sie mit Ihrem Hund reisen, ist diese Unterkunft nicht die richtige Wahl für Ihren Aufenthalt.'
          ]
        },
        {
          heading: 'Allgemeine Regeln für Hunde in den Bergen',
          paragraphs: [
            'In den Bergen gelten meist Regeln des gesunden Menschenverstands sowie lokale Vorschriften zu Leinenpflicht und zum Zugang zu Liften und Wegen, die je nach Skigebiet unterschiedlich sein und sich von Saison zu Saison ändern können. Prüfen Sie vor der Abreise die aktuellen Regeln auf den offiziellen Tourismuskanälen von Livigno.'
          ]
        },
        {
          heading: 'Alternativen für Reisende mit Hund in Livigno',
          paragraphs: [
            'In der Gegend gibt es Unterkünfte, die speziell auf Gäste mit Tieren ausgerichtet sind: Am zuverlässigsten ist es, gezielt nach ausdrücklich hundefreundlichen Unterkünften zu suchen und Bedingungen (Größe, Aufpreise, zugängliche Gemeinschaftsbereiche) direkt beim Gastgeber zu klären.'
          ]
        },
        {
          heading: 'Unser Rat',
          paragraphs: [
            'Wenn Ihr Hund mit in den Urlaub kommt, suchen Sie vor der Buchung eine Unterkunft, die ausdrücklich hundefreundlich ist, damit es bei der Ankunft keine Überraschungen gibt. Für alle anderen Fragen rund um Ihren Urlaub in Livigno geben wir Ihnen gern Tipps zur Gegend.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/de/kontakt', label: 'Kontaktieren Sie uns für weitere Informationen' },
        { href: '/blog/livigno-con-bambini-attivita-famiglia/de', label: 'Den Guide für Familienurlaub in Livigno lesen' },
        { href: '/camere-appartamento-livigno/de', label: 'Die Wohnung im Detail ansehen' }
      ]
    }
  },
  'da-dove-ammirare-il-tramonto-a-livigno': {
    en: {
      title: 'Where to Watch the Sunset in Livigno',
      description:
        'The most scenic spots to watch the sunset over the mountains of Livigno, from high-altitude trails to an easy evening walk around the lake, in winter and summer.',
      intro:
        "The Alpine basin that Livigno sits in, surrounded by peaks over 3,000 metres, puts on sunsets whose colours change quickly across the mountains. Here's where to go, from high trails to easier spots, to enjoy them at their best.",
      sections: [
        {
          heading: 'Why Livigno is a special place for sunsets',
          paragraphs: [
            "Because it is surrounded by mountains on every side, the Livigno basin gives you sunsets reflected on the peaks opposite the sun, with colours that shift within minutes — an effect that is less striking in more open valleys."
          ]
        },
        {
          heading: 'The view from the high trails',
          paragraphs: [
            "If you're happy to walk, the Monte della Neve loop offers a 360-degree panorama over Livigno, the Engadine and the Ortler peaks — one of the most spectacular spots for a high-altitude sunset, reachable in summer when the trails are open."
          ]
        },
        {
          heading: 'The view from Lake Livigno',
          paragraphs: [
            "For an easier option, the walk around Lake Livigno gives you the sunset reflected on the water with the mountains as a backdrop — a stroll anyone can manage, even as a couple after dinner in summer."
          ]
        },
        {
          heading: 'The sunset from home',
          paragraphs: [
            "You don't always need to go out: [Ironwood Livigno's infrared sauna](/sauna-bagno-turco-privato-livigno/en) looks out onto the mountains, an easy way to enjoy the late-afternoon light changing on the peaks without leaving the apartment after a day on the slopes or trails."
          ]
        }
      ],
      relatedLinks: [
        { href: '/estate/en', label: 'Discover all the summer experiences in Livigno' },
        { href: '/blog/livigno-estate-mountain-bike-trekking-lago/en', label: 'Read the hiking routes around the lake' },
        { href: '/sauna-bagno-turco-privato-livigno/en', label: 'Discover the sauna with a mountain view' }
      ]
    },
    de: {
      title: 'Die schönsten Orte für den Sonnenuntergang in Livigno',
      description:
        'Die schönsten Aussichtspunkte für den Sonnenuntergang über den Bergen von Livigno – vom Höhenweg bis zum leichten Abendspaziergang am See, im Winter wie im Sommer.',
      intro:
        'Der Talkessel, in dem Livigno liegt, ist von Gipfeln über 3.000 Metern umgeben und schenkt Sonnenuntergänge, deren Farben schnell über die Berge wandern. Hier erfahren Sie, wohin Sie gehen können – vom Höhenweg bis zu leicht erreichbaren Plätzen –, um sie am besten zu genießen.',
      sections: [
        {
          heading: 'Warum Livigno ein besonderer Ort für Sonnenuntergänge ist',
          paragraphs: [
            'Da der Talkessel von Livigno auf allen Seiten von Bergen umgeben ist, spiegelt sich der Sonnenuntergang auf den gegenüberliegenden Gipfeln, mit Farben, die sich innerhalb weniger Minuten ändern – ein Effekt, der in offeneren Tälern weniger ausgeprägt ist.'
          ]
        },
        {
          heading: 'Der Blick von den Höhenwegen',
          paragraphs: [
            'Wer gern wandert, findet auf der Runde um den Monte della Neve ein 360-Grad-Panorama über Livigno, das Engadin und die Ortler-Gipfel – einer der spektakulärsten Orte für einen Sonnenuntergang in der Höhe, erreichbar im Sommer, wenn die Wege geöffnet sind.'
          ]
        },
        {
          heading: 'Der Blick vom Lago di Livigno',
          paragraphs: [
            'Leichter zu erreichen ist der Spaziergang rund um den Lago di Livigno, bei dem sich der Sonnenuntergang im Wasser spiegelt, mit den Bergen im Hintergrund – ein Weg für alle, auch zu zweit nach dem Abendessen im Sommer.'
          ]
        },
        {
          heading: 'Der Sonnenuntergang von zu Hause',
          paragraphs: [
            'Man muss nicht immer hinaus: [Die Infrarotsauna von Ironwood Livigno](/sauna-bagno-turco-privato-livigno/de) blickt auf die Berge – eine bequeme Art, das wechselnde Licht des späten Nachmittags auf den Gipfeln zu genießen, ohne die Wohnung nach einem Tag auf Piste oder Wanderweg zu verlassen.'
          ]
        }
      ],
      relatedLinks: [
        { href: '/estate/de', label: 'Alle Sommererlebnisse in Livigno entdecken' },
        { href: '/blog/livigno-estate-mountain-bike-trekking-lago/de', label: 'Die Wanderrouten rund um den See lesen' },
        { href: '/sauna-bagno-turco-privato-livigno/de', label: 'Die Sauna mit Bergblick entdecken' }
      ]
    }
  }
};
