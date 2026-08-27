// Standalone SEO landing pages — /inverno, /estate, /famiglie, /benessere,
// /come-arrivare. Same rationale as src/content/blog.ts: Italian-only,
// living outside the [locale] routing tree, ~500+ words each, written to
// intercept search intent that the homepage (a single long scroll) doesn't
// target directly with its own URL/title/meta. Facts reused from the rest
// of the site (distances, amenities, ski area, season dates) — nothing new
// invented here.
//
// /come-arrivare deliberately does NOT duplicate the existing blog article
// /blog/come-arrivare-a-livigno (transport options from Milan). It's scoped
// to the property itself (exact address, last stretch of the drive, parking,
// check-in) so the two pages target different queries instead of competing
// for the same one — each links to the other.

export type LandingPage = {
  slug: string;
  title: string; // H1
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  image: { src: string; alt: string; w: number; h: number };
  sections: { heading: string; body: string[] }[];
  highlights: string[];
  ctaText: string;
  relatedLink: { href: string; label: string };
  breadcrumbName: string;
  // Optional — only 'chi-siamo' uses these so far. Real, previously-published
  // guest quotes (see src/components/Reviews.tsx / messages/it.json) reused
  // here rather than duplicated as new copy, and FAQ pairs that also drive
  // this page's FAQPage JSON-LD (see chi-siamo/page.tsx).
  testimonials?: { quote: string; author: string }[];
  faq?: { q: string; a: string }[];
  // Contextual internal links with descriptive anchor text, rendered as
  // their own block (in addition to the single relatedLink CTA every
  // landing page already has) — only 'chi-siamo' uses this so far.
  internalLinks?: { href: string; label: string }[];
};

export const landingPages: LandingPage[] = [
  {
    slug: 'inverno',
    title: 'Vacanza sulla neve a Livigno: sci, sauna privata e comfort a due passi dalle piste',
    metaTitle: 'Vacanza invernale a Livigno | Appartamento con sauna a 100 m dagli impianti',
    metaDescription:
      "Sci, sauna a infrarossi e bagno turco privati a 100 m dal Carosello 3000: scopri come vivere l'inverno a Livigno da Ironwood.",
    eyebrow: 'Inverno a Livigno',
    intro:
      "Livigno è una delle mete alpine italiane con la stagione sciistica più lunga: piste aperte da fine novembre a inizio maggio, un comprensorio che sale oltre i 3.000 metri e la comodità, rara, di poter tornare a scaldarsi in una sauna privata dopo l'ultima discesa.",
    image: {
      src: '/images/livigno-skilift-vallata-nebbia.jpg',
      alt: 'Vista dalla seggiovia sulla vallata di Livigno tra le nuvole',
      w: 1400,
      h: 1143
    },
    sections: [
      {
        heading: 'Il comprensorio: Carosello 3000 e Mottolino',
        body: [
          "Livigno si sviluppa su due versanti principali. Carosello 3000, il più esteso, offre piste per ogni livello e un panorama che arriva a sfiorare i 3.000 metri sul livello del mare. Mottolino è invece il riferimento per il freeride e per chi cerca pendii più tecnici, oltre a diventare il bike park della località in estate. Insieme, i due comprensori formano un'area sciabile che soddisfa sia le famiglie alle prime armi sia gli sciatori più esperti.",
          "Livigno è nota anche per lo sci di fondo: alcuni anelli attraversano il centro del paese e la vallata, un'attività più rilassata da alternare alle giornate sulle piste da discesa, adatta a chi viaggia con bambini o vuole semplicemente un ritmo diverso."
        ]
      },
      {
        heading: 'Una stagione più lunga della media',
        body: [
          'La stagione invernale a Livigno parte generalmente a fine novembre e arriva fino a inizio maggio, un arco di tempo più ampio rispetto a molte altre località alpine italiane. Significa poter sciare anche a inizio o fine stagione, quando altrove gli impianti sono già chiusi, spesso con meno affollamento sulle piste e prezzi più contenuti fuori dai periodi di punta (Natale, Capodanno, febbraio).'
        ]
      },
      {
        heading: 'Il vantaggio di tornare a 100 metri dalle piste',
        body: [
          "Ironwood Livigno si trova a soli 100 metri a piedi dagli impianti di risalita e a 50 metri da scuola sci e noleggio attrezzatura: si scia al mattino senza muovere l'auto, si rientra per pranzo se serve e si può tornare sulle piste nel pomeriggio senza perdere tempo in spostamenti.",
          "Ma è dopo l'ultima discesa che si sente davvero la differenza. Nell'appartamento, sauna a infrarossi e bagno turco sono privati — mai condivisi con altri ospiti, a differenza della spa di un hotel. È il momento in cui i muscoli si scaldano davvero, prima ancora di pensare alla cena, seduti vicino al camino elettrico del soggiorno.",
          "L'appartamento include inoltre un deposito dedicato per sci, scarponi e attrezzatura, così non serve portare tutto dentro casa ogni sera, e un posto auto gratuito per chi arriva in macchina."
        ]
      }
    ],
    highlights: [
      '100 m dagli impianti di risalita, 50 m da scuola sci e noleggio',
      'Sauna a infrarossi e bagno turco privati, mai condivisi',
      'Deposito sci e scarponi dedicato',
      '3 camere e 2 bagni per famiglie e gruppi fino a 6 persone'
    ],
    ctaText: 'Verifica la disponibilità per il tuo inverno a Livigno',
    relatedLink: {
      href: '/blog/sci-a-livigno-guida-carosello-3000',
      label: 'Leggi la guida completa al comprensorio Carosello 3000'
    },
    breadcrumbName: 'Inverno a Livigno',
    faq: [
      {
        q: 'Quanto dura la stagione sciistica a Livigno?',
        a: 'Generalmente da fine novembre a inizio maggio: una delle stagioni sciistiche più lunghe delle Alpi italiane.'
      },
      {
        q: 'Quanto dista l\'appartamento dagli impianti di risalita?',
        a: 'Circa 100 metri a piedi dagli impianti; la scuola sci e il noleggio attrezzatura si trovano a 50 metri.'
      },
      {
        q: 'C\'è un posto dove riporre sci, scarponi e attrezzatura?',
        a: 'Sì, un deposito dedicato per sci, scarponi e attrezzatura, oltre a un posto auto gratuito per chi arriva in macchina.'
      }
    ]
  },
  {
    slug: 'estate',
    title: "Livigno d'estate: mountain bike, trekking e relax nell'appartamento con sauna",
    metaTitle: 'Vacanza estiva a Livigno | Mountain bike, trekking e sauna privata',
    metaDescription:
      "Bike park, sentieri per tutti i livelli e il Lago di Livigno: scopri l'estate a Livigno e perché un appartamento con sauna privata è la base ideale.",
    eyebrow: 'Estate a Livigno',
    intro:
      "Livigno non è solo una meta invernale: da giugno a settembre la conca alpina si trasforma in una delle capitali della mountain bike in Europa, con sentieri per famiglie, appassionati di trekking e biker esperti.",
    image: {
      src: '/images/mountain-bike-estate.jpg',
      alt: 'Mountain bike in alta quota d’estate',
      w: 960,
      h: 640
    },
    sections: [
      {
        heading: 'Mountain bike: dal Mottolino Bike Park alla Bike Academy',
        body: [
          "Il Mottolino Bike Park è il punto di riferimento per chi cerca adrenalina, con tracciati tra downhill, jump area e sezioni north shore. Anche Carosello 3000 apre gli impianti in estate, collegando sentieri panoramici in quota. Per chi muove i primi pedali o viaggia con bambini, la Bike Academy offre un percorso pensato apposta per principianti.",
          "In totale il comprensorio conta oltre 50 km di sentieri organizzati, adatti sia a chi cerca discese tecniche sia a chi preferisce un giro tranquillo tra i boschi di larici."
        ]
      },
      {
        heading: 'Trekking, il Lago di Livigno e gli alpeggi',
        body: [
          "Non serve essere biker per godersi Livigno d'estate. La conca è attraversata da sentieri di trekking di ogni difficoltà, tra alpeggi fioriti — l'arnica è il fiore simbolo della zona — e panorami sulle Alpi Retiche. Una passeggiata alla portata di tutti è quella intorno al Lago di Livigno, con soste per un picnic nelle giornate più calde.",
          'Le temperature estive restano fresche anche ad agosto, un altro motivo per cui Livigno è una meta apprezzata da chi cerca sollievo dal caldo delle città.'
        ]
      },
      {
        heading: 'Perché soggiornare da Ironwood in estate',
        body: [
          "La posizione a due passi dagli impianti, comoda in inverno, resta utile anche d'estate per raggiungere a piedi o in bici gli accessi ai sentieri principali. Su richiesta, mettiamo a disposizione il noleggio di 2 e-bike direttamente in struttura, per esplorare più terreno senza affaticarsi troppo in salita — utile anche per chi è in vacanza con bambini o non è un ciclista allenato.",
          'Dopo una giornata tra sentieri e bici, i due balconi con vista montagna dell\'appartamento sono il posto giusto per rilassarsi, e la sauna a infrarossi privata resta un piccolo lusso disponibile anche fuori stagione sciistica, per chi vuole distendere i muscoli dopo un trekking impegnativo.'
        ]
      }
    ],
    highlights: [
      'Noleggio e-bike disponibile direttamente in struttura',
      'Due balconi con vista montagna',
      'Sauna a infrarossi privata, utile anche dopo il trekking',
      'A due passi dagli accessi ai sentieri e al bike park'
    ],
    ctaText: 'Verifica la disponibilità per la tua estate a Livigno',
    relatedLink: {
      href: '/blog/livigno-estate-mountain-bike-trekking-lago',
      label: "Leggi la guida completa all'estate a Livigno"
    },
    breadcrumbName: 'Estate a Livigno',
    faq: [
      {
        q: 'Quando è la stagione estiva per mountain bike e trekking a Livigno?',
        a: 'Da giugno a settembre, con oltre 50 km di sentieri organizzati, il Mottolino Bike Park e gli impianti estivi di Carosello 3000 aperti.'
      },
      {
        q: 'È possibile noleggiare e-bike?',
        a: 'Sì, su richiesta mettiamo a disposizione 2 e-bike a noleggio direttamente in struttura.'
      },
      {
        q: "Livigno d'estate è adatta anche a chi non pratica sport?",
        a: 'Sì: la passeggiata intorno al Lago di Livigno è alla portata di tutti, e le temperature restano fresche anche ad agosto.'
      }
    ]
  },
  {
    slug: 'famiglie',
    title: "Livigno con bambini: l'appartamento pensato per le famiglie",
    metaTitle: 'Appartamento per famiglie a Livigno | Fino a 6 persone, culla e seggiolone',
    metaDescription:
      '3 camere, 2 bagni, culla e seggiolone su richiesta: scopri perché Ironwood Livigno è pensato per famiglie e gruppi fino a 6 persone.',
    eyebrow: 'Famiglie a Livigno',
    intro:
      "Organizzare una vacanza a Livigno con bambini significa cercare spazio, sicurezza e comodità — non solo un letto in più. Ironwood Livigno nasce pensando proprio a questo: famiglie e gruppi fino a 6 persone, in un appartamento dove ognuno ha il proprio spazio.",
    image: {
      src: '/images/appartamento-soggiorno.jpg',
      alt: 'Zona giorno dell’appartamento a Livigno con vista sulle montagne',
      w: 2000,
      h: 1333
    },
    sections: [
      {
        heading: 'Spazio per tutti: 3 camere, 2 bagni, 90 m²',
        body: [
          "L'appartamento si sviluppa su 90 m² con 3 camere da letto e 2 bagni completi, una configurazione flessibile che permette ai genitori di avere un po' di privacy mentre i più piccoli dormono nella stanza accanto. La camera matrimoniale con topper è pensata per i genitori del gruppo, mentre la camera con letti singoli è comoda per bambini o ragazzi più grandi.",
          "Su richiesta forniamo culla e seggiolone, così non serve viaggiare con l'attrezzatura ingombrante. La cucina è completamente attrezzata — lavastoviglie, forno, macchina per il caffè — per preparare pasti su misura per i più piccoli senza dover mangiare fuori ogni sera."
        ]
      },
      {
        heading: 'Attività adatte anche ai bambini, in ogni stagione',
        body: [
          "In inverno, gli anelli di sci di fondo che attraversano il centro di Livigno sono un'attività più tranquilla rispetto alle piste da discesa, adatta anche ai bambini che si affacciano per la prima volta alla neve. Per chi invece vuole provare lo sci alpino, la scuola sci si trova a soli 50 metri dall'appartamento — comodo per lezioni e cambi rapidi senza dover usare l'auto.",
          "In estate, la Bike Academy di Livigno offre un percorso di circa 5 km pensato apposta per principianti e bambini, mentre una passeggiata intorno al Lago di Livigno è alla portata di tutta la famiglia, con soste per un picnic."
        ]
      },
      {
        heading: 'Una zona sicura e tranquilla',
        body: [
          "L'appartamento si trova a 100 metri dagli impianti di risalita e a 15 minuti a piedi dal centro di Livigno, in una posizione strategica ma tranquilla — comoda per raggiungere piste, scuola sci e negozi a piedi, senza il viavai del centro pieno di turisti. Il deposito sci e bici dedicato evita di dover trasportare l'attrezzatura di tutta la famiglia dentro casa ogni sera.",
          'E quando i bambini finalmente dormono, la sauna a infrarossi e il bagno turco privati restano uno spazio tutto per i genitori — un dettaglio che, dalle recensioni che riceviamo, molte famiglie ci segnalano come una delle sorprese più apprezzate del soggiorno.'
        ]
      }
    ],
    highlights: [
      '3 camere e 2 bagni, fino a 6 posti letto',
      'Culla e seggiolone disponibili su richiesta',
      'Scuola sci a 50 m, sci di fondo adatto ai bambini in centro',
      'Cucina completamente attrezzata per pasti su misura'
    ],
    ctaText: 'Verifica la disponibilità per la tua famiglia',
    relatedLink: {
      href: '/blog/livigno-con-bambini-attivita-famiglia',
      label: 'Leggi la guida completa a Livigno con bambini'
    },
    breadcrumbName: 'Famiglie a Livigno',
    faq: [
      {
        q: "L'appartamento è adatto a bambini piccoli?",
        a: "Sì: su richiesta forniamo culla e seggiolone, e le 3 camere e 2 bagni danno spazio e un po' di privacy a genitori e bambini."
      },
      {
        q: 'Quali attività sono adatte ai bambini a Livigno?',
        a: 'In inverno gli anelli di sci di fondo che attraversano il centro del paese, in estate la Bike Academy (circa 5 km, pensata per principianti) e le passeggiate intorno al lago.'
      },
      {
        q: 'La cucina è attrezzata per cucinare per i bambini?',
        a: 'Sì, è completamente attrezzata con lavastoviglie, forno e macchina per il caffè, per preparare pasti su misura senza mangiare fuori ogni sera.'
      }
    ]
  },
  {
    slug: 'benessere',
    title: 'Benessere a Livigno: sauna a infrarossi e bagno turco privati',
    metaTitle: 'Sauna privata a Livigno | Bagno turco e benessere in appartamento',
    metaDescription:
      'Sauna a infrarossi e bagno turco privati, mai condivisi con altri ospiti: scopri il lato benessere di un soggiorno a Livigno da Ironwood.',
    eyebrow: 'Benessere',
    intro:
      "Dopo una giornata sugli sci o sui sentieri, il modo in cui recuperi conta quanto l'attività stessa. A Ironwood Livigno, sauna a infrarossi e bagno turco non sono un servizio condiviso in uno spazio comune: sono privati, dentro l'appartamento, a disposizione solo di chi soggiorna qui.",
    image: {
      src: '/images/sauna-vista-montagna.jpg',
      alt: 'Sauna a infrarossi privata',
      w: 2000,
      h: 1333
    },
    sections: [
      {
        heading: 'Perché una sauna privata fa la differenza',
        body: [
          'In molte strutture ricettive di montagna, sauna e bagno turco sono spazi comuni, con orari di prenotazione, accappatoi da portare e la possibilità concreta di doverli condividere con sconosciuti. A Livigno da Ironwood la sauna a infrarossi e il bagno turco sono invece riservati esclusivamente agli ospiti dell\'appartamento: nessuna attesa, nessuna prenotazione, nessuna condivisione — a qualunque ora del giorno o della sera.',
          'La sauna a infrarossi, in particolare, è indicata per il recupero muscolare: il calore penetra in profondità nei tessuti, un aiuto concreto dopo una giornata di sci, trekking o mountain bike, quando gambe e schiena chiedono di essere sciolte prima ancora di sedersi a cena.'
        ]
      },
      {
        heading: 'Un rituale semplice, ripetibile ogni giorno',
        body: [
          "Il vantaggio di avere sauna e bagno turco in casa, invece che in una spa condivisa, è la libertà di farne un'abitudine quotidiana della vacanza: si rientra dalle piste o dal sentiero, ci si scalda con calma, magari un bicchiere di vino dalla cantinetta in cucina, e solo dopo si pensa alla cena. Nessun orario da rispettare, nessuna app per prenotare uno slot.",
          'Il soggiorno, con il suo camino elettrico, completa il quadro: la sera in appartamento diventa parte dell\'esperienza tanto quanto la giornata sulle piste o sui sentieri, non un semplice posto dove dormire.'
        ]
      },
      {
        heading: 'Un plus che gli ospiti notano davvero',
        body: [
          'Non è solo una descrizione di marketing: è uno dei dettagli più citati nelle recensioni reali che riceviamo su Google e Airbnb, spesso descritto come uno dei motivi principali per scegliere Ironwood invece di un hotel tradizionale. E per chi vuole completare l\'esperienza con una colazione curata prima di uscire, offriamo anche un servizio di colazione su richiesta, a pagamento, in una struttura convenzionata a pochi metri dall\'appartamento.'
        ]
      }
    ],
    highlights: [
      'Sauna a infrarossi e bagno turco privati, mai condivisi',
      'Nessuna prenotazione, disponibili in ogni momento della giornata',
      'Camino elettrico in soggiorno per le serate',
      "Colazione su richiesta a pochi metri dall'appartamento"
    ],
    ctaText: 'Prenota il tuo momento di benessere a Livigno',
    relatedLink: {
      href: '/it#esperienza',
      label: "Scopri tutti i dettagli di sauna e bagno turco privati"
    },
    breadcrumbName: 'Benessere',
    faq: [
      {
        q: 'Posso usare la sauna e il bagno turco a qualsiasi ora, anche la sera tardi?',
        a: 'Sì: non essendo uno spazio condiviso con nessuna prenotazione da fare, sono disponibili in qualsiasi momento della giornata o della sera.'
      },
      {
        q: 'Conviene un appartamento con sauna privata rispetto a un hotel con spa?',
        a: "Per molti ospiti sì: niente orari di prenotazione, accappatoio da portare o rischio di condividere lo spazio con sconosciuti — è uno dei dettagli più citati nelle recensioni reali su Google e Airbnb."
      },
      {
        q: 'È possibile abbinare colazione e relax dopo la sauna?',
        a: 'Sì, su richiesta e a pagamento è disponibile un servizio colazione in una struttura convenzionata a pochi metri dall\'appartamento.'
      }
    ]
  },
  {
    slug: 'come-arrivare',
    title: 'Come raggiungere Ironwood Livigno: indirizzo, parcheggio e ultimi chilometri',
    metaTitle: 'Come arrivare a Ironwood Livigno | Indirizzo, parcheggio e ultimo tratto',
    metaDescription:
      'Indirizzo, parcheggio gratuito e distanza dagli impianti: la guida pratica per arrivare a Ironwood Livigno, via Saroch 771, senza sorprese.',
    eyebrow: 'Come arrivare',
    intro:
      'Se hai già deciso di soggiornare da Ironwood Livigno, questa pagina raccoglie le informazioni pratiche sull\'ultimo tratto del viaggio: dove si trova esattamente l\'appartamento, come raggiungerlo dal Passo di Foscagno o da Tirano, e cosa sapere su parcheggio e arrivo. Per la guida completa su treno, auto e aereo da Milano, trovi tutti i dettagli nel nostro articolo dedicato, linkato in fondo a questa pagina.',
    image: {
      src: '/images/esterno-giorno.jpg',
      alt: 'Esterno dell’appartamento a Livigno vicino agli impianti, di giorno',
      w: 1181,
      h: 787
    },
    sections: [
      {
        heading: 'Indirizzo e posizione esatta',
        body: [
          "Ironwood Livigno si trova in Via Saroch 771, 23041 Livigno (SO), a circa 100 metri a piedi dagli impianti di risalita e a 50 metri da scuola sci e noleggio attrezzatura. È una posizione strategica ma tranquilla, a circa 15 minuti a piedi dal centro del paese — comoda per raggiungere piste, negozi e ristoranti senza muovere l'auto una volta arrivati.",
          "Le coordinate GPS esatte sono 46.525061, 10.126967: utili da inserire nel navigatore, soprattutto negli ultimi chilometri di montagna dove la copertura di rete può essere meno affidabile."
        ]
      },
      {
        heading: 'L\'ultimo tratto, da Tirano o dal confine svizzero',
        body: [
          "Chi arriva in treno scende alla stazione di Tirano e prosegue con un autobus di linea (cambio a Bormio) fino a Livigno. Chi arriva in auto da Milano percorre la SS38 in direzione Bormio e poi il Passo di Foscagno; chi arriva dalla Svizzera passa invece dalla Forcola di Livigno. In inverno, controlla le condizioni del passo prima di partire: in caso di forti nevicate può richiedere catene o pneumatici invernali, e in rari casi può chiudere temporaneamente.",
          'Una volta in paese, segui le indicazioni per Via Saroch, nella zona degli impianti di risalita: l\'appartamento è facilmente riconoscibile, con l\'esterno in legno tipico dello stile alpino della zona.'
        ]
      },
      {
        heading: 'Parcheggio e arrivo in appartamento',
        body: [
          "L'appartamento include un posto auto gratuito, quindi non è necessario cercare parcheggio a pagamento in paese. Gli orari di check-in e check-out vengono confermati al momento della prenotazione via WhatsApp, con una certa flessibilità in base alla disponibilità — comoda per chi arriva dopo un viaggio lungo o con orari di treno/autobus non sempre puntuali.",
          "Per qualsiasi dubbio sull'ultimo tratto del viaggio, il modo più rapido per contattarci è WhatsApp: rispondiamo con indicazioni precise e, se serve, con foto dell'ingresso per riconoscere subito il palazzo."
        ]
      }
    ],
    highlights: [
      'Via Saroch 771, Livigno (SO) — 100 m dagli impianti di risalita',
      'Posto auto gratuito incluso',
      'Coordinate GPS: 46.525061, 10.126967',
      'Check-in flessibile, confermato via WhatsApp'
    ],
    ctaText: 'Scrivici su WhatsApp per indicazioni sull\'arrivo',
    relatedLink: {
      href: '/blog/come-arrivare-a-livigno',
      label: 'Leggi la guida completa: treno, auto o aereo da Milano'
    },
    breadcrumbName: 'Come arrivare',
    faq: [
      {
        q: "Qual è l'indirizzo esatto di Ironwood Livigno?",
        a: 'Via Saroch 771, 23041 Livigno (SO) — coordinate GPS 46.525061, 10.126967.'
      },
      {
        q: "C'è un parcheggio incluso?",
        a: "Sì, l'appartamento include un posto auto gratuito."
      },
      {
        q: 'Come si raggiunge Livigno in auto o in treno?',
        a: 'In auto da Milano si percorre la SS38 fino al Passo di Foscagno (dalla Svizzera si passa invece dalla Forcola di Livigno); in treno si scende a Tirano e si prosegue con un autobus di linea, con cambio a Bormio.'
      }
    ]
  },
  {
    slug: 'chi-siamo',
    title: 'Chi siamo: la famiglia livignasca dietro Ironwood Livigno',
    metaTitle: 'Chi Siamo | Ironwood Livigno — Famiglia Host a Livigno',
    metaDescription:
      'Ironwood Livigno è gestito direttamente da Francesco e famiglia, livignaschi da sempre: scopri la nostra storia e le recensioni, prenota senza commissioni.',
    eyebrow: 'Chi siamo',
    intro:
      "Chi siamo, dietro Ironwood Livigno? Non un'agenzia immobiliare né una catena di case vacanze, ma una famiglia vera che vive a Livigno tutto l'anno. Io sono Francesco, nato e cresciuto qui, e insieme a mia moglie Tania e alle nostre due figlie, Nicole e Giulia, abbiamo trasformato la nostra casa di famiglia in un appartamento pensato per chi viene a Livigno per sciare d'inverno o camminare in montagna d'estate. Quando prenoti da noi, non stai scrivendo a un centralino: stai scrivendo direttamente a chi quella casa l'ha ristrutturata con le proprie mani, stanza per stanza.",
    image: {
      src: '/images/esterno-giorno.jpg',
      alt: 'Ironwood Livigno, la casa di famiglia di Francesco e Tania ristrutturata nel 2022',
      w: 1181,
      h: 787
    },
    sections: [
      {
        heading: 'Una famiglia livignasca, non un\'agenzia',
        body: [
          "Siamo in quattro: io, mia moglie Tania, e le nostre due figlie, Nicole (18 anni) e Giulia (13 anni). Non gestiamo Ironwood Livigno da remoto né tramite un property manager: viviamo qui tutto l'anno, non solo in stagione, ed è per questo che conosciamo bene i tempi delle piste, i periodi più affollati e i dettagli pratici che una guida turistica generica non può darti.",
          "Essere livignaschi di nascita significa anche poterti dare consigli reali su quando prenotare lo skipass online per evitare le code, quale versante scegliere in base al meteo del giorno, o dove mangiare la sera senza affidarti solo alle recensioni online."
        ]
      },
      {
        heading: 'Una casa di famiglia, ristrutturata con cura nel 2022',
        body: [
          "Ironwood Livigno non è nato come un investimento qualsiasi. È la nostra casa, che abbiamo ristrutturato completamente scegliendo di lavorare soprattutto con ferro e legno — materiali che raccontano la montagna meglio di un arredamento standard da casa vacanze. I lavori si sono conclusi nel 2022: sauna a infrarossi privata, bagno turco, camino elettrico, cucina completamente attrezzata e 3 camere da letto per un totale di 90 m², pensati per ospitare famiglie e gruppi fino a 6 persone comodamente, con 2 bagni completi a disposizione.",
          "Il risultato è una casa vacanze che si trova a soli 100 metri dagli impianti di risalita e a 50 metri da scuola sci e noleggio attrezzatura, in Via Saroch — ma che dentro conserva il calore di una vera casa di famiglia, non di un appartamento standardizzato."
        ]
      },
      {
        heading: 'Perché prenotare direttamente da Ironwood Livigno conviene',
        body: [
          "Gestiamo Ironwood Livigno in prima persona, senza intermediari: significa che quando scrivi su WhatsApp per chiedere disponibilità, rispondiamo noi, non un call center. Possiamo confermarti orari di check-in flessibili, darti indicazioni precise sull'ultimo tratto di strada, e sistemare al volo una richiesta particolare — una culla in più, un cambio di data — senza passare da una piattaforma terza.",
          "Prenotando direttamente, inoltre, eviti le commissioni di intermediazione che di solito gravano sul prezzo finale su Airbnb o Booking: il prezzo che concordiamo via WhatsApp o email è quello che paghi, senza sorprese in fase di checkout."
        ]
      },
      {
        heading: 'Cosa dicono gli ospiti che hanno soggiornato da noi',
        body: [
          'Le recensioni qui sotto sono reali, pubblicate su Google e Airbnb — le stesse che trovi nella sezione recensioni della home.'
        ]
      }
    ],
    testimonials: [
      {
        quote:
          'Francesco e la sua famiglia hanno costruito senza dubbio l\'alloggio più bello in cui abbiamo soggiornato, con un livello di lusso a cui non siamo abituati. È impossibile trovare difetti nell\'appartamento.',
        author: 'Duncan, Airbnb'
      },
      {
        quote:
          'The most beautifully appointed chalet we have ever stayed in. Our hosts were exceptional and our every possible need was met.',
        author: "Verity O'Donoghue, Google"
      },
      {
        quote:
          'Sicuramente il miglior alloggio Airbnb in cui abbiamo soggiornato. La casa è estremamente ben costruita e l\'host si prende molta cura di renderla un soggiorno perfetto.',
        author: 'Scott, Airbnb'
      }
    ],
    faq: [
      {
        q: 'Ironwood Livigno è gestito da un\'agenzia?',
        a: 'No. Ironwood Livigno è gestito direttamente da Francesco e dalla sua famiglia, proprietari e residenti a Livigno tutto l\'anno — non un\'agenzia immobiliare o una catena di case vacanze.'
      },
      {
        q: 'Conviene prenotare direttamente invece che su Airbnb o Booking?',
        a: 'Sì: prenotando direttamente via WhatsApp, telefono o email eviti le commissioni di intermediazione delle piattaforme, e hai un contatto diretto con chi gestisce davvero l\'appartamento per qualsiasi richiesta prima, durante e dopo il soggiorno.'
      },
      {
        q: 'Da chi è stata ristrutturata la casa?',
        a: 'È la casa di famiglia di Francesco e Tania, ristrutturata completamente e completata nel 2022, con un progetto basato principalmente su ferro e legno.'
      },
      {
        q: 'Quanti anni vivete a Livigno?',
        a: 'Francesco è nato e cresciuto a Livigno e ci vive tutto l\'anno, non solo durante la stagione turistica — la stessa cosa vale per tutta la famiglia.'
      },
      {
        q: 'Come posso contattarvi direttamente?',
        a: 'Il modo più rapido è WhatsApp al +39 0342 929285, oppure via email a info@ironwoodlivigno.com o dal modulo di richiesta disponibilità sul sito.'
      }
    ],
    highlights: [
      'Gestione diretta, senza agenzie né intermediari',
      'Livignaschi da sempre: consigli reali su piste e stagione',
      'Casa di famiglia ristrutturata nel 2022, ferro e legno',
      'Risposta diretta su WhatsApp, non un call center'
    ],
    internalLinks: [
      { href: '/it#camere', label: 'Scopri le nostre 3 camere pensate per famiglie e gruppi' },
      { href: '/come-arrivare', label: 'Leggi la guida su come arrivare a Ironwood Livigno' },
      { href: '/inverno', label: "Scopri Livigno d'inverno da Ironwood" },
      { href: '/it#recensioni', label: 'Vedi tutte le recensioni verificate' },
      { href: '/blog', label: 'Leggi le nostre guide su Livigno' }
    ],
    ctaText: 'Scrivici direttamente su WhatsApp',
    relatedLink: {
      href: '/it/contatti',
      label: 'Vai alla pagina contatti per scriverci o chiamarci'
    },
    breadcrumbName: 'Chi siamo'
  },
  {
    slug: 'sauna-bagno-turco-privato-livigno',
    title: 'Appartamento con sauna privata a Livigno: sauna a infrarossi e bagno turco esclusivi',
    metaTitle: 'Sauna Privata Livigno | Appartamento con Bagno Turco Privato',
    metaDescription:
      "A Livigno, un appartamento con sauna a infrarossi e bagno turco privati, mai condivisi: nessuna prenotazione, disponibili ogni giorno a qualsiasi ora.",
    eyebrow: 'Sauna privata',
    intro:
      "Cerchi un appartamento con sauna privata a Livigno? A Ironwood Livigno sauna a infrarossi e bagno turco non sono un servizio a pagamento in una spa comune, ma parte dell'appartamento stesso: esclusivi di chi soggiorna qui, senza orari da rispettare né condivisione con altri ospiti. Questa pagina raccoglie tutti i dettagli pratici, per chi vuole valutare esattamente cosa include.",
    image: {
      src: '/images/sauna.jpg',
      alt: 'Sauna a infrarossi privata nell’appartamento Ironwood a Livigno',
      w: 2000,
      h: 1333
    },
    sections: [
      {
        heading: 'Sauna a infrarossi privata, non condivisa',
        body: [
          "La sauna a infrarossi è pensata per il recupero muscolare: il calore penetra in profondità nei tessuti, un aiuto concreto dopo una giornata di sci, trekking o mountain bike. È dentro l'appartamento, non in uno spazio comune dell'edificio — significa che non la userà mai nessun altro ospite prima o dopo di te."
        ]
      },
      {
        heading: 'Bagno turco privato incluso',
        body: [
          "Accanto alla sauna, l'appartamento include anche un bagno turco privato: vapore caldo a disposizione esclusiva, da alternare alla sauna a infrarossi a seconda delle preferenze, senza dover scegliere tra i due o prenotare l'accesso a uno spazio condiviso."
        ]
      },
      {
        heading: 'Nessuna prenotazione, disponibile in ogni momento',
        body: [
          "A differenza della spa di un hotel, dove spesso serve prenotare uno slot orario, qui sauna e bagno turco sono disponibili in qualunque momento della giornata: al rientro dalle piste, dopo un'escursione estiva, o semplicemente la sera prima di cena."
        ]
      },
      {
        heading: 'Perché conviene rispetto a una spa condivisa',
        body: [
          "Abbiamo scritto una guida dedicata al confronto tra sauna privata e sauna condivisa, con i vantaggi pratici in termini di igiene, orari e comfort — utile se stai ancora valutando se un appartamento con sauna privata sia la scelta giusta per il tuo soggiorno a Livigno."
        ]
      }
    ],
    highlights: [
      'Sauna a infrarossi privata, mai condivisa con altri ospiti',
      'Bagno turco privato incluso nell\'appartamento',
      'Disponibili in ogni momento, nessuna prenotazione',
      'Parte di un appartamento di 90 m², 3 camere, fino a 6 persone'
    ],
    faq: [
      {
        q: 'La sauna è davvero privata o condivisa con altri appartamenti?',
        a: 'È completamente privata: si trova dentro l\'appartamento ed è a disposizione esclusiva degli ospiti che soggiornano lì, mai condivisa con altri ospiti o altre unità.'
      },
      {
        q: 'Serve prenotare un orario per usare la sauna o il bagno turco?',
        a: 'No. Non essendo uno spazio condiviso, non c\'è nessuno slot da prenotare: sono disponibili in qualsiasi momento della giornata durante tutto il soggiorno.'
      },
      {
        q: 'Sauna e bagno turco sono inclusi nel prezzo del soggiorno?',
        a: 'Sì, fanno parte dell\'appartamento e non comportano costi aggiuntivi rispetto al soggiorno prenotato.'
      },
      {
        q: 'Sono adatti anche in estate, non solo dopo lo sci?',
        a: 'Sì: molti ospiti li usano anche in estate per il recupero muscolare dopo una giornata di trekking o mountain bike, non solo in inverno dopo lo sci.'
      }
    ],
    internalLinks: [
      { href: '/benessere', label: 'Scopri la sezione benessere completa di Ironwood Livigno' },
      { href: '/blog/sauna-privata-vs-condivisa-livigno', label: 'Leggi il confronto: sauna privata vs sauna condivisa' },
      { href: '/chi-siamo', label: 'Scopri perché abbiamo scelto una sauna privata per la nostra casa' }
    ],
    ctaText: 'Verifica la disponibilità e prenota la tua sauna privata',
    relatedLink: {
      href: '/benessere',
      label: 'Scopri anche camino, colazione e gli altri dettagli benessere'
    },
    breadcrumbName: 'Sauna privata'
  },
  {
    slug: 'camere-appartamento-livigno',
    title: "Le 3 camere dell'appartamento a Livigno: layout, letti e dettagli",
    metaTitle: 'Appartamento 3 Camere a Livigno | Layout delle Stanze',
    metaDescription:
      "3 camere, 2 bagni, 90 m²: scopri il layout dettagliato dell'appartamento a Livigno, camera per camera, pensato per famiglie e gruppi fino a 6 persone.",
    eyebrow: 'Le camere',
    intro:
      "Stai cercando un appartamento con 3 camere a Livigno e vuoi sapere esattamente come sono organizzati gli spazi prima di prenotare? Ironwood Livigno si sviluppa su 90 m² con 3 camere da letto e 2 bagni completi, per un massimo di 6 ospiti, a soli 100 metri a piedi dagli impianti di risalita. Qui trovi il dettaglio camera per camera, così sai esattamente cosa aspettarti.",
    image: {
      src: '/images/camera3.jpg',
      alt: 'Una delle 3 camere da letto dell’appartamento Ironwood a Livigno',
      w: 2000,
      h: 1333
    },
    sections: [
      {
        heading: 'Camera 1 — Camera Doppia (letti uniti)',
        body: [
          'Due letti singoli uniti da un topper, per un comfort continuo da vero letto matrimoniale — ideale per la coppia o per i genitori del gruppo che preferiscono comunque la flessibilità di due letti singoli.'
        ]
      },
      {
        heading: 'Camera 2 — Camera Letti Singoli',
        body: [
          'Due letti singoli, abbinabili a richiesta per formare un letto matrimoniale — comoda per bambini, ragazzi più grandi o amici che viaggiano insieme senza condividere un letto matrimoniale fisso.'
        ]
      },
      {
        heading: 'Camera 3 — Camera Matrimoniale Principale',
        body: [
          "Letto matrimoniale con topper per il massimo comfort: è la camera principale dell'appartamento, pensata per chi cerca più privacy rispetto alle altre due stanze."
        ]
      },
      {
        heading: '2 bagni completi, condivisi tra le camere',
        body: [
          'A disposizione di tutta la casa ci sono 2 bagni completi, una configurazione pensata apposta per evitare code al mattino quando l\'appartamento ospita famiglie o gruppi al completo — un dettaglio che fa una differenza concreta rispetto a un tipico bilocale con un solo bagno.'
        ]
      }
    ],
    highlights: [
      '3 camere da letto, 90 m² totali',
      '2 bagni completi condivisi tra le camere',
      'Fino a 6 posti letto per famiglie e gruppi',
      'Configurazione flessibile: letti singoli o matrimoniali',
      '100 m dagli impianti di risalita'
    ],
    faq: [
      {
        q: 'Quante persone possono dormire comodamente nell\'appartamento?',
        a: 'Fino a 6 persone, distribuite tra le 3 camere: una con letti singoli uniti stile matrimoniale, una con letti singoli separabili, e la camera matrimoniale principale.'
      },
      {
        q: 'I letti singoli possono essere uniti per formare un matrimoniale?',
        a: 'Sì, nella Camera 2 i due letti singoli sono abbinabili su richiesta. Nella Camera 1 sono invece già uniti con un topper, per il comfort continuo di un letto matrimoniale.'
      },
      {
        q: 'C\'è più di un bagno?',
        a: 'Sì, l\'appartamento ha 2 bagni completi, condivisi tra le 3 camere — comodo per famiglie e gruppi che occupano tutti gli spazi contemporaneamente.'
      }
    ],
    internalLinks: [
      { href: '/famiglie', label: "Scopri perché l'appartamento è pensato per famiglie e gruppi" },
      { href: '/chi-siamo', label: "Scopri chi ha ristrutturato l'appartamento e perché" },
      { href: '/come-arrivare', label: "Vedi indirizzo, parcheggio e come arrivare" }
    ],
    ctaText: 'Verifica la disponibilità per le tue camere',
    relatedLink: {
      href: '/famiglie',
      label: "Scopri tutti i dettagli pensati per famiglie e gruppi"
    },
    breadcrumbName: 'Le camere'
  },
  {
    slug: 'livigno-estate',
    title: "Cosa fare a Livigno d'estate: 10 esperienze imperdibili",
    metaTitle: "Livigno d'Estate | 10 Cose da Fare tra Bike, Trekking e Lago",
    metaDescription:
      "Mountain bike, trekking, il Lago di Livigno e sauna privata dopo lo sport: 10 esperienze da non perdere per organizzare al meglio la tua estate a Livigno.",
    eyebrow: "Livigno d'estate",
    intro:
      "Cosa fare a Livigno d'estate, in pratica? Da giugno a settembre la conca alpina si trasforma in una delle capitali della mountain bike in Europa, con sentieri per ogni livello, un lago da scoprire in canoa o a piedi, e un centro pedonale duty-free tutto da girare. Ecco 10 esperienze imperdibili per organizzare la tua estate a Livigno, in sintesi.",
    image: {
      src: '/images/mucca-alpeggio-livigno.jpg',
      alt: 'Mucca al pascolo sugli alpeggi intorno a Livigno d’estate',
      w: 1119,
      h: 1200
    },
    sections: [
      {
        heading: '1–2. Mountain bike: Mottolino Bike Park e Bike Academy',
        body: [
          "Il Mottolino Bike Park è il riferimento per l'adrenalina, con 14 tracciati tra downhill, jump area e sezioni north shore. Per chi viaggia con bambini o muove i primi pedali, la Bike Academy offre un percorso di circa 5 km pensato apposta per principianti."
        ]
      },
      {
        heading: '3–4. Trekking: il Lago di Livigno e gli alpeggi fioriti',
        body: [
          "Il giro intorno al Lago di Livigno è la passeggiata più semplice e alla portata di tutti, con soste per un picnic. Per chi cerca un'escursione più impegnativa, i sentieri tra gli alpeggi fioriti — l'arnica è il fiore simbolo della zona — offrono panorami sulle Alpi Retiche."
        ]
      },
      {
        heading: '5–6. Carosello 3000 d\'estate e un giro in canoa',
        body: [
          "Anche gli impianti del comprensorio sciistico invernale aprono in estate (indicativamente dal 20 giugno al 13 settembre), collegando sentieri panoramici in quota. Nelle giornate più calde, il lago si presta anche a un giro in canoa."
        ]
      },
      {
        heading: '7–8. Shopping duty-free e piatti tipici della Valtellina',
        body: [
          "Il centro pedonale di Livigno, zona franca doganale, resta una tappa quasi obbligata per lo shopping. Da provare anche i piatti tipici della Valtellina — pizzoccheri, sciatt e bresaola IGP — nei ristoranti del paese o cucinati con calma in appartamento."
        ]
      },
      {
        heading: '9–10. Sauna privata dopo lo sport e temperature fresche anche ad agosto',
        body: [
          "Dopo una giornata di trekking o mountain bike, la sauna a infrarossi e il bagno turco privati aiutano a sciogliere i muscoli prima di cena. E le temperature estive a Livigno restano fresche anche nel pieno dell'estate — un motivo in più per chi cerca sollievo dal caldo delle città."
        ]
      }
    ],
    highlights: [
      'Oltre 50 km di sentieri per mountain bike e trekking',
      'Lago di Livigno: passeggiata, picnic o canoa',
      'Centro pedonale duty-free a 15 minuti a piedi',
      'Sauna privata disponibile anche dopo lo sport estivo'
    ],
    faq: [
      {
        q: 'Livigno è una meta valida anche per chi non fa mountain bike?',
        a: "Sì: il giro intorno al lago, gli alpeggi fioriti, lo shopping duty-free e i piatti tipici della Valtellina sono esperienze alla portata di tutti, non richiedono essere biker o escursionisti esperti."
      },
      {
        q: 'Quando sono aperti gli impianti estivi di Carosello 3000?',
        a: 'Indicativamente dal 20 giugno al 13 settembre, per collegare sentieri panoramici in quota — le date esatte possono variare di anno in anno.'
      },
      {
        q: 'Fa caldo a Livigno in estate?',
        a: 'Le temperature restano generalmente fresche anche ad agosto, uno dei motivi per cui Livigno è apprezzata da chi cerca sollievo dal caldo delle città.'
      }
    ],
    internalLinks: [
      { href: '/estate', label: "Leggi la guida completa all'estate a Livigno da Ironwood" },
      { href: '/blog/livigno-estate-10-esperienze-imperdibili', label: "Leggi l'articolo completo con tutti i dettagli" },
      { href: '/famiglie', label: 'Scopri le attività adatte anche ai bambini' }
    ],
    ctaText: 'Verifica la disponibilità per la tua estate a Livigno',
    relatedLink: {
      href: '/blog/livigno-estate-mountain-bike-trekking-lago',
      label: "Leggi anche la guida su mountain bike, trekking e lago"
    },
    breadcrumbName: "Livigno d'estate"
  }
];
