// Privacy/cookie policy content, per locale. Kept as plain data (not in
// messages/*.json) because it's long-form legal prose rather than reusable
// UI strings — easier to review and maintain as a single document per
// language. Drafted to be substantively GDPR-compliant for how this site
// actually works (static site, WhatsApp contact link, Holidu booking widget
// iframe, Google Maps iframe, Cloudflare Web Analytics), but this is not a
// substitute for review by a qualified lawyer or a service like iubenda
// before publishing — especially the parts describing third-party data
// flows (Holidu, Google) which the site owner should double-check against
// those providers' own current privacy documentation.

export type PrivacySection = { heading: string; body: string };
export type PrivacyContent = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: PrivacySection[];
};

export const privacyContent: Record<string, PrivacyContent> = {
  it: {
    title: 'Informativa sulla Privacy',
    lastUpdated: 'Ultimo aggiornamento: 11 settembre 2026',
    intro:
      'La presente informativa descrive come Ironwood Livigno tratta i dati personali dei visitatori del sito ironwoodlivigno.com e degli ospiti che richiedono informazioni o prenotazioni, ai sensi del Regolamento (UE) 2016/679 ("GDPR") e del Codice Privacy italiano (D.Lgs. 196/2003, come modificato dal D.Lgs. 101/2018).',
    sections: [
      {
        heading: '1. Titolare del trattamento',
        body: 'Titolare del trattamento è Ironwood Livigno, con sede in Via Saroch 771, 23041 Livigno (SO), Italia — CIN IT014037C274OJ27T8. Per qualsiasi richiesta relativa alla presente informativa o ai tuoi dati personali, puoi contattarci su WhatsApp al numero +39 0342 929285, oppure via email a info@ironwoodlivigno.com.'
      },
      {
        heading: '2. Quali dati raccolgono e perché',
        body: 'Il sito è in gran parte statico; il modulo di richiesta disponibilità è l\'eccezione, poiché si appoggia a un sistema di gestione delle richieste che processa i dati per nostro conto. Raccogliamo solo i dati minimi indicati di seguito:\n\n• Modulo di richiesta disponibilità: se compili il modulo "Richiedi disponibilità" sul sito, i dati che inserisci — nome, email, telefono, date del soggiorno, numero ed età degli ospiti, eventuali extra richiesti (colazione, e-bike), messaggio libero e lingua del sito — vengono inviati al nostro sistema interno di gestione delle richieste, che li rende disponibili a chi gestisce la struttura per rispondere alla tua richiesta ed evadere l\'eventuale prenotazione. Trattiamo questi dati in qualità di titolari del trattamento.\n\n• Contatto WhatsApp: se clicchi sul pulsante WhatsApp, si apre una conversazione con il nostro numero tramite l\'app WhatsApp (Meta): eventuali messaggi, numero di telefono e dati che ci invii in chat sono trattati secondo l\'informativa privacy di WhatsApp/Meta, oltre che da noi per rispondere alla tua richiesta e gestire l\'eventuale prenotazione.\n\n• Widget di prenotazione (Holidu): la sezione "Prenota" incorpora un modulo fornito da Holidu GmbH, che può raccogliere dati necessari a verificare disponibilità e gestire la prenotazione (nome, contatti, date di soggiorno, dati di pagamento). Questi dati sono trattati da Holidu in qualità di titolare autonomo o responsabile del trattamento, secondo la sua informativa privacy.\n\n• Mappa (Google Maps): la sezione "Dove siamo" incorpora una mappa di Google, che può impostare cookie o raccogliere dati tecnici (es. indirizzo IP) secondo l\'informativa privacy di Google.\n\n• Statistiche di utilizzo (Cloudflare Web Analytics): utilizziamo uno strumento di analisi del traffico che non usa cookie e non traccia i singoli utenti in modo identificativo; raccoglie solo dati aggregati e anonimi (es. numero di visite, pagine più viste), secondo l\'informativa privacy di Cloudflare.'
      },
      {
        heading: '3. Base giuridica del trattamento',
        body: 'Trattiamo i tuoi dati sulla base: dell\'esecuzione di misure precontrattuali o contrattuali (es. gestione della richiesta di prenotazione), del consenso quando richiesto esplicitamente (es. contatto volontario su WhatsApp), e del legittimo interesse per le statistiche aggregate e anonime sul funzionamento del sito.'
      },
      {
        heading: '4. Cookie',
        body: 'Il sito in sé non installa cookie propri. I contenuti di terze parti incorporati (widget di prenotazione Holidu, mappa Google) possono installare i propri cookie tecnici o di profilazione secondo le rispettive informative. Cloudflare Web Analytics, lo strumento statistico che utilizziamo, non utilizza cookie.'
      },
      {
        heading: '5. Conservazione dei dati',
        body: 'I dati raccolti tramite WhatsApp e tramite il modulo di richiesta disponibilità sono conservati per il tempo necessario a gestire la tua richiesta o il tuo soggiorno, e successivamente per il tempo previsto dagli obblighi fiscali e di legge (es. registrazione ospiti presso le autorità di pubblica sicurezza, conservazione documenti contabili).'
      },
      {
        heading: '6. I tuoi diritti',
        body: 'In quanto interessato, hai diritto di: accedere ai tuoi dati personali; richiederne la rettifica o la cancellazione; richiedere la limitazione del trattamento; opporti al trattamento; richiedere la portabilità dei dati; revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento basato sul consenso prima della revoca. Puoi esercitare questi diritti contattandoci su WhatsApp al numero +39 0342 929285, oppure via email a info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Trasferimento dei dati',
        body: 'Alcuni fornitori terzi menzionati (es. Meta/WhatsApp, Google, Cloudflare) possono trattare dati anche al di fuori dello Spazio Economico Europeo. In tali casi, questi fornitori dichiarano di adottare garanzie adeguate (es. clausole contrattuali standard della Commissione Europea), come descritto nelle rispettive informative privacy.'
      },
      {
        heading: '8. Reclami',
        body: 'Se ritieni che il trattamento dei tuoi dati violi la normativa vigente, hai diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it), autorità di controllo italiana.'
      },
      {
        heading: '9. Modifiche alla presente informativa',
        body: 'Questa informativa può essere aggiornata nel tempo, ad esempio in caso di modifiche normative o ai servizi utilizzati sul sito. La data di ultimo aggiornamento è indicata in cima alla pagina.'
      }
    ]
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: September 11, 2026',
    intro:
      'This policy describes how Ironwood Livigno processes the personal data of visitors to ironwoodlivigno.com and guests who request information or bookings, in accordance with Regulation (EU) 2016/679 ("GDPR") and Italian Legislative Decree 196/2003, as amended by Legislative Decree 101/2018.',
    sections: [
      {
        heading: '1. Data controller',
        body: 'The data controller is Ironwood Livigno, based at Via Saroch 771, 23041 Livigno (SO), Italy — CIN IT014037C274OJ27T8. For any request regarding this policy or your personal data, you can contact us on WhatsApp at +39 0342 929285, or by email at info@ironwoodlivigno.com.'
      },
      {
        heading: '2. What data we collect and why',
        body: 'This site is largely static; the availability request form is the exception, as it relies on a request-management system that processes data on our behalf. We only collect the minimal data described below:\n\n• Availability request form: if you fill in the "Check availability" form on the site, the data you enter — name, email, phone number, stay dates, number and ages of guests, any extras requested (breakfast, e-bike), free-text message and site language — is sent to our internal request-management system, which makes it available to the property manager to respond to your request and process any booking. We process this data as data controller.\n\n• WhatsApp contact: clicking the WhatsApp button opens a conversation with our number via the WhatsApp app (Meta). Any messages, phone number and data you send us in chat are handled according to WhatsApp/Meta\'s own privacy policy, as well as by us to respond to your request and manage any booking.\n\n• Booking widget (Holidu): the "Book" section embeds a form provided by Holidu GmbH, which may collect data needed to check availability and manage the booking (name, contact details, stay dates, payment data). This data is processed by Holidu as an independent controller or processor, per its own privacy policy.\n\n• Map (Google Maps): the "Location" section embeds a Google Map, which may set cookies or collect technical data (e.g. IP address) per Google\'s privacy policy.\n\n• Usage statistics (Cloudflare Web Analytics): we use a traffic analysis tool that does not use cookies and does not identify individual visitors; it only collects aggregated, anonymous data (e.g. number of visits, most viewed pages), per Cloudflare\'s privacy policy.'
      },
      {
        heading: '3. Legal basis for processing',
        body: 'We process your data based on: the performance of pre-contractual or contractual measures (e.g. handling your booking request); consent where explicitly required (e.g. voluntarily contacting us on WhatsApp); and legitimate interest for aggregated, anonymous statistics on how the site is used.'
      },
      {
        heading: '4. Cookies',
        body: 'The site itself does not set any cookies of its own. Embedded third-party content (the Holidu booking widget, the Google Map) may set their own technical or profiling cookies per their respective policies. Cloudflare Web Analytics, the statistics tool we use, does not use cookies.'
      },
      {
        heading: '5. Data retention',
        body: 'Data collected via WhatsApp and via the availability request form is retained for as long as needed to handle your request or stay, and afterwards for as long as required by tax and legal obligations (e.g. guest registration with public safety authorities, retention of accounting records).'
      },
      {
        heading: '6. Your rights',
        body: 'As a data subject, you have the right to: access your personal data; request its rectification or erasure; request restriction of processing; object to processing; request data portability; withdraw consent at any time, without affecting the lawfulness of consent-based processing carried out before withdrawal. You can exercise these rights by contacting us on WhatsApp at +39 0342 929285, or by email at info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Data transfers',
        body: 'Some of the third-party providers mentioned (e.g. Meta/WhatsApp, Google, Cloudflare) may process data outside the European Economic Area. In such cases, these providers state that they apply appropriate safeguards (e.g. the European Commission\'s standard contractual clauses), as described in their respective privacy policies.'
      },
      {
        heading: '8. Complaints',
        body: 'If you believe the processing of your data breaches applicable law, you have the right to lodge a complaint with the Italian Data Protection Authority, Garante per la protezione dei dati personali (www.garanteprivacy.it), or with the supervisory authority in your own EU country of residence.'

      },
      {
        heading: '9. Changes to this policy',
        body: 'This policy may be updated over time, for example following regulatory changes or changes to the services used on the site. The last-updated date is shown at the top of this page.'
      }
    ]
  },
  de: {
    title: 'Datenschutzerklärung',
    lastUpdated: 'Zuletzt aktualisiert: 11. September 2026',
    intro:
      'Diese Datenschutzerklärung beschreibt, wie Ironwood Livigno personenbezogene Daten von Besuchern der Website ironwoodlivigno.com sowie von Gästen, die Informationen oder Buchungen anfragen, gemäß der Verordnung (EU) 2016/679 ("DSGVO") und dem italienischen Gesetzesdekret 196/2003 in der durch das Gesetzesdekret 101/2018 geänderten Fassung verarbeitet.',
    sections: [
      {
        heading: '1. Verantwortlicher',
        body: 'Verantwortlicher ist Ironwood Livigno, Via Saroch 771, 23041 Livigno (SO), Italien — CIN IT014037C274OJ27T8. Für Anfragen zu dieser Erklärung oder Ihren personenbezogenen Daten erreichen Sie uns per WhatsApp unter +39 0342 929285 oder per E-Mail an info@ironwoodlivigno.com.'
      },
      {
        heading: '2. Welche Daten wir erheben und warum',
        body: 'Die Website ist größtenteils statisch; das Verfügbarkeitsanfrage-Formular bildet die Ausnahme, da es auf ein Anfragenverwaltungssystem zurückgreift, das Daten in unserem Auftrag verarbeitet. Wir erheben nur die folgenden minimalen Daten:\n\n• Verfügbarkeitsanfrage-Formular: Wenn Sie das Formular „Verfügbarkeit anfragen" auf der Website ausfüllen, werden die von Ihnen eingegebenen Daten — Name, E-Mail, Telefonnummer, Aufenthaltsdaten, Anzahl und Alter der Gäste, gewünschte Extras (Frühstück, E-Bike), Freitextnachricht und Sprache der Website — an unser internes Anfragenverwaltungssystem übermittelt, das sie der Unterkunftsverwaltung zur Beantwortung Ihrer Anfrage und Abwicklung einer eventuellen Buchung zur Verfügung stellt. Wir verarbeiten diese Daten als Verantwortlicher.\n\n• WhatsApp-Kontakt: Ein Klick auf den WhatsApp-Button öffnet ein Gespräch mit unserer Nummer über die WhatsApp-App (Meta). Nachrichten, Telefonnummer und weitere im Chat übermittelte Daten werden gemäß der Datenschutzerklärung von WhatsApp/Meta sowie von uns zur Bearbeitung Ihrer Anfrage und einer eventuellen Buchung verarbeitet.\n\n• Buchungs-Widget (Holidu): Der Bereich "Buchen" bindet ein Formular der Holidu GmbH ein, das Daten zur Verfügbarkeitsprüfung und Buchungsabwicklung erheben kann (Name, Kontaktdaten, Aufenthaltsdaten, Zahlungsdaten). Diese Daten werden von Holidu als eigenständig Verantwortlichem oder Auftragsverarbeiter gemäß dessen eigener Datenschutzerklärung verarbeitet.\n\n• Karte (Google Maps): Der Bereich "Lage" bindet eine Google-Karte ein, die gemäß der Datenschutzerklärung von Google Cookies setzen oder technische Daten (z. B. IP-Adresse) erheben kann.\n\n• Nutzungsstatistiken (Cloudflare Web Analytics): Wir verwenden ein Analysetool, das keine Cookies verwendet und einzelne Besucher nicht identifiziert; es erhebt nur aggregierte, anonyme Daten (z. B. Anzahl der Besuche, meistbesuchte Seiten) gemäß der Datenschutzerklärung von Cloudflare.'
      },
      {
        heading: '3. Rechtsgrundlage der Verarbeitung',
        body: 'Wir verarbeiten Ihre Daten auf Grundlage: der Durchführung vorvertraglicher oder vertraglicher Maßnahmen (z. B. Bearbeitung Ihrer Buchungsanfrage), der Einwilligung, wenn diese ausdrücklich erforderlich ist (z. B. freiwillige Kontaktaufnahme über WhatsApp), und des berechtigten Interesses an aggregierten, anonymen Statistiken zur Website-Nutzung.'
      },
      {
        heading: '4. Cookies',
        body: 'Die Website selbst setzt keine eigenen Cookies. Eingebundene Inhalte Dritter (Holidu-Buchungs-Widget, Google-Karte) können gemäß ihren jeweiligen Richtlinien eigene technische oder Profiling-Cookies setzen. Cloudflare Web Analytics, das von uns verwendete Statistik-Tool, verwendet keine Cookies.'
      },
      {
        heading: '5. Speicherdauer',
        body: 'Über WhatsApp und über das Verfügbarkeitsanfrage-Formular erhobene Daten werden so lange gespeichert, wie es zur Bearbeitung Ihrer Anfrage oder Ihres Aufenthalts erforderlich ist, danach so lange, wie es steuerliche und gesetzliche Pflichten vorsehen (z. B. Gästemeldung bei Sicherheitsbehörden, Aufbewahrung von Buchhaltungsunterlagen).'
      },
      {
        heading: '6. Ihre Rechte',
        body: 'Als betroffene Person haben Sie das Recht auf: Auskunft über Ihre personenbezogenen Daten; Berichtigung oder Löschung; Einschränkung der Verarbeitung; Widerspruch gegen die Verarbeitung; Datenübertragbarkeit; sowie den jederzeitigen Widerruf einer erteilten Einwilligung, ohne die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung zu berühren. Sie können diese Rechte über WhatsApp unter +39 0342 929285 oder per E-Mail an info@ironwoodlivigno.com geltend machen.'
      },
      {
        heading: '7. Datenübermittlung',
        body: 'Einige der genannten Drittanbieter (z. B. Meta/WhatsApp, Google, Cloudflare) können Daten auch außerhalb des Europäischen Wirtschaftsraums verarbeiten. In solchen Fällen erklären diese Anbieter, geeignete Garantien anzuwenden (z. B. Standardvertragsklauseln der Europäischen Kommission), wie in ihren jeweiligen Datenschutzerklärungen beschrieben.'
      },
      {
        heading: '8. Beschwerden',
        body: 'Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen geltendes Recht verstößt, haben Sie das Recht, sich bei der italienischen Datenschutzbehörde Garante per la protezione dei dati personali (www.garanteprivacy.it) oder bei der Aufsichtsbehörde Ihres EU-Wohnsitzlandes zu beschweren.'
      },
      {
        heading: '9. Änderungen dieser Erklärung',
        body: 'Diese Erklärung kann im Laufe der Zeit aktualisiert werden, etwa infolge rechtlicher Änderungen oder Änderungen der auf der Website genutzten Dienste. Das Datum der letzten Aktualisierung ist oben auf dieser Seite angegeben.'
      }
    ]
  },
  fr: {
    title: 'Politique de confidentialité',
    lastUpdated: 'Dernière mise à jour : 11 septembre 2026',
    intro:
      'Cette politique décrit comment Ironwood Livigno traite les données personnelles des visiteurs du site ironwoodlivigno.com et des hôtes qui demandent des informations ou effectuent une réservation, conformément au Règlement (UE) 2016/679 (« RGPD ») et au décret législatif italien 196/2003, tel que modifié par le décret législatif 101/2018.',
    sections: [
      {
        heading: '1. Responsable du traitement',
        body: 'Le responsable du traitement est Ironwood Livigno, Via Saroch 771, 23041 Livigno (SO), Italie — CIN IT014037C274OJ27T8. Pour toute demande concernant cette politique ou vos données personnelles, contactez-nous sur WhatsApp au +39 0342 929285, ou par e-mail à info@ironwoodlivigno.com.'
      },
      {
        heading: '2. Quelles données nous collectons et pourquoi',
        body: 'Le site est majoritairement statique ; le formulaire de demande de disponibilité fait exception, car il s\'appuie sur un système de gestion des demandes qui traite les données pour notre compte. Nous ne collectons que les données minimales suivantes :\n\n• Formulaire de demande de disponibilité : si vous remplissez le formulaire « Demander la disponibilité » sur le site, les données que vous saisissez — nom, e-mail, téléphone, dates du séjour, nombre et âge des personnes, extras demandés (petit-déjeuner, e-bike), message libre et langue du site — sont transmises à notre système interne de gestion des demandes, qui les met à disposition du gestionnaire de la structure pour répondre à votre demande et traiter une éventuelle réservation. Nous traitons ces données en tant que responsable du traitement.\n\n• Contact WhatsApp : cliquer sur le bouton WhatsApp ouvre une conversation avec notre numéro via l\'application WhatsApp (Meta). Les messages, le numéro de téléphone et les données que vous nous transmettez dans le chat sont traités selon la politique de confidentialité de WhatsApp/Meta, ainsi que par nous-mêmes pour répondre à votre demande et gérer une éventuelle réservation.\n\n• Module de réservation (Holidu) : la section « Réserver » intègre un formulaire fourni par Holidu GmbH, susceptible de collecter les données nécessaires pour vérifier la disponibilité et gérer la réservation (nom, coordonnées, dates de séjour, données de paiement). Ces données sont traitées par Holidu en tant que responsable ou sous-traitant indépendant, selon sa propre politique de confidentialité.\n\n• Carte (Google Maps) : la section « Localisation » intègre une carte Google, qui peut déposer des cookies ou collecter des données techniques (ex. adresse IP) selon la politique de confidentialité de Google.\n\n• Statistiques de fréquentation (Cloudflare Web Analytics) : nous utilisons un outil d\'analyse du trafic qui n\'utilise pas de cookies et n\'identifie pas les visiteurs individuellement ; il ne collecte que des données agrégées et anonymes (ex. nombre de visites, pages les plus consultées), selon la politique de confidentialité de Cloudflare.'
      },
      {
        heading: '3. Base juridique du traitement',
        body: 'Nous traitons vos données sur la base : de l\'exécution de mesures précontractuelles ou contractuelles (ex. traitement de votre demande de réservation), du consentement lorsqu\'il est explicitement requis (ex. prise de contact volontaire sur WhatsApp), et de l\'intérêt légitime pour les statistiques agrégées et anonymes sur l\'utilisation du site.'
      },
      {
        heading: '4. Cookies',
        body: 'Le site lui-même ne dépose aucun cookie propre. Les contenus tiers intégrés (module de réservation Holidu, carte Google) peuvent déposer leurs propres cookies techniques ou de profilage selon leurs politiques respectives. Cloudflare Web Analytics, l\'outil statistique que nous utilisons, n\'utilise pas de cookies.'
      },
      {
        heading: '5. Conservation des données',
        body: 'Les données collectées via WhatsApp et via le formulaire de demande de disponibilité sont conservées le temps nécessaire pour traiter votre demande ou votre séjour, puis pendant la durée requise par les obligations fiscales et légales (ex. enregistrement des hôtes auprès des autorités de sécurité publique, conservation des documents comptables).'
      },
      {
        heading: '6. Vos droits',
        body: 'En tant que personne concernée, vous avez le droit : d\'accéder à vos données personnelles ; d\'en demander la rectification ou l\'effacement ; de demander la limitation du traitement ; de vous opposer au traitement ; de demander la portabilité des données ; de retirer votre consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant ce retrait. Vous pouvez exercer ces droits en nous contactant sur WhatsApp au +39 0342 929285, ou par e-mail à info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Transferts de données',
        body: 'Certains des fournisseurs tiers mentionnés (ex. Meta/WhatsApp, Google, Cloudflare) peuvent traiter des données en dehors de l\'Espace économique européen. Dans ce cas, ces fournisseurs déclarent appliquer des garanties appropriées (ex. clauses contractuelles types de la Commission européenne), comme décrit dans leurs politiques de confidentialité respectives.'
      },
      {
        heading: '8. Réclamations',
        body: 'Si vous estimez que le traitement de vos données enfreint la réglementation applicable, vous avez le droit d\'introduire une réclamation auprès de l\'autorité italienne de protection des données, le Garante per la protezione dei dati personali (www.garanteprivacy.it), ou auprès de l\'autorité de contrôle de votre pays de résidence dans l\'UE.'
      },
      {
        heading: '9. Modifications de cette politique',
        body: 'Cette politique peut être mise à jour au fil du temps, par exemple à la suite de changements réglementaires ou de changements des services utilisés sur le site. La date de dernière mise à jour figure en haut de cette page.'
      }
    ]
  },
  da: {
    title: 'Privatlivspolitik',
    lastUpdated: 'Sidst opdateret: 11. september 2026',
    intro:
      'Denne politik beskriver, hvordan Ironwood Livigno behandler personoplysninger for besøgende på ironwoodlivigno.com og gæster, der anmoder om oplysninger eller foretager en booking, i overensstemmelse med Forordning (EU) 2016/679 ("GDPR") og det italienske lovdekret 196/2003 som ændret ved lovdekret 101/2018.',
    sections: [
      {
        heading: '1. Dataansvarlig',
        body: 'Dataansvarlig er Ironwood Livigno, Via Saroch 771, 23041 Livigno (SO), Italien — CIN IT014037C274OJ27T8. For henvendelser om denne politik eller dine personoplysninger kan du kontakte os på WhatsApp på +39 0342 929285, eller via e-mail på info@ironwoodlivigno.com.'
      },
      {
        heading: '2. Hvilke data vi indsamler, og hvorfor',
        body: 'Hjemmesiden er overvejende statisk; formularen til forespørgsel om ledighed er undtagelsen, da den anvender et system til håndtering af forespørgsler, som behandler data på vores vegne. Vi indsamler kun følgende minimale data:\n\n• Formular til forespørgsel om ledighed: Hvis du udfylder formularen "Forespørg om ledighed" på hjemmesiden, sendes de data, du indtaster — navn, e-mail, telefonnummer, opholdsdatoer, antal og alder på gæster, eventuelle ønskede ekstraydelser (morgenmad, e-bike), fritekstbesked og hjemmesidens sprog — til vores interne system til håndtering af forespørgsler, som gør dem tilgængelige for den, der administrerer stedet, så din forespørgsel kan besvares og en eventuel booking behandles. Vi behandler disse data som dataansvarlig.\n\n• WhatsApp-kontakt: Et klik på WhatsApp-knappen åbner en samtale med vores nummer via WhatsApp-appen (Meta). Beskeder, telefonnummer og andre data, du sender os i chatten, behandles ifølge WhatsApp/Metas egen privatlivspolitik samt af os for at besvare din henvendelse og håndtere en eventuel booking.\n\n• Booking-widget (Holidu): Sektionen "Book" indeholder en formular fra Holidu GmbH, som kan indsamle data til at tjekke ledighed og håndtere bookingen (navn, kontaktoplysninger, opholdsdatoer, betalingsdata). Disse data behandles af Holidu som selvstændig dataansvarlig eller databehandler ifølge deres egen privatlivspolitik.\n\n• Kort (Google Maps): Sektionen "Beliggenhed" indeholder et Google-kort, som kan sætte cookies eller indsamle tekniske data (f.eks. IP-adresse) ifølge Googles privatlivspolitik.\n\n• Brugsstatistik (Cloudflare Web Analytics): Vi bruger et trafikanalyseværktøj, der ikke bruger cookies og ikke identificerer individuelle besøgende; det indsamler kun aggregerede, anonyme data (f.eks. antal besøg, mest viste sider) ifølge Cloudflares privatlivspolitik.'
      },
      {
        heading: '3. Retsgrundlag for behandlingen',
        body: 'Vi behandler dine data på grundlag af: opfyldelse af foranstaltninger forud for eller i forbindelse med en kontrakt (f.eks. håndtering af din bookinganmodning), samtykke hvor det udtrykkeligt kræves (f.eks. frivillig kontakt via WhatsApp), og legitim interesse i aggregerede, anonyme statistikker om brugen af hjemmesiden.'
      },
      {
        heading: '4. Cookies',
        body: 'Hjemmesiden selv sætter ingen egne cookies. Indlejret tredjepartsindhold (Holidu-booking-widget, Google-kort) kan sætte egne tekniske eller profileringscookies ifølge deres respektive politikker. Cloudflare Web Analytics, det statistikværktøj vi bruger, bruger ikke cookies.'
      },
      {
        heading: '5. Opbevaring af data',
        body: 'Data indsamlet via WhatsApp og via formularen til forespørgsel om ledighed opbevares, så længe det er nødvendigt for at håndtere din anmodning eller dit ophold, og derefter så længe skattemæssige og juridiske forpligtelser kræver det (f.eks. gæsteregistrering hos offentlige sikkerhedsmyndigheder, opbevaring af regnskabsbilag).'
      },
      {
        heading: '6. Dine rettigheder',
        body: 'Som registreret har du ret til: indsigt i dine personoplysninger; at anmode om berigtigelse eller sletning; at anmode om begrænsning af behandlingen; at gøre indsigelse mod behandlingen; at anmode om dataportabilitet; at trække samtykke tilbage når som helst, uden at det berører lovligheden af behandling baseret på samtykke inden tilbagetrækningen. Du kan udøve disse rettigheder ved at kontakte os på WhatsApp på +39 0342 929285, eller via e-mail på info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Dataoverførsler',
        body: 'Nogle af de nævnte tredjepartsudbydere (f.eks. Meta/WhatsApp, Google, Cloudflare) kan behandle data uden for Det Europæiske Økonomiske Samarbejdsområde. I sådanne tilfælde erklærer disse udbydere, at de anvender passende garantier (f.eks. Europa-Kommissionens standardkontraktbestemmelser), som beskrevet i deres respektive privatlivspolitikker.'
      },
      {
        heading: '8. Klager',
        body: 'Hvis du mener, at behandlingen af dine data er i strid med gældende lovgivning, har du ret til at indgive en klage til den italienske databeskyttelsesmyndighed Garante per la protezione dei dati personali (www.garanteprivacy.it), eller til tilsynsmyndigheden i dit eget EU-bopælsland.'
      },
      {
        heading: '9. Ændringer af denne politik',
        body: 'Denne politik kan opdateres over tid, f.eks. som følge af lovændringer eller ændringer i de tjenester, der bruges på hjemmesiden. Datoen for seneste opdatering vises øverst på denne side.'
      }
    ]
  },
  pl: {
    title: 'Polityka prywatności',
    lastUpdated: 'Ostatnia aktualizacja: 11 września 2026',
    intro:
      'Niniejsza polityka opisuje, w jaki sposób Ironwood Livigno przetwarza dane osobowe osób odwiedzających stronę ironwoodlivigno.com oraz gości, którzy proszą o informacje lub dokonują rezerwacji, zgodnie z Rozporządzeniem (UE) 2016/679 („RODO") oraz włoskim dekretem ustawodawczym nr 196/2003, zmienionym dekretem ustawodawczym nr 101/2018.',
    sections: [
      {
        heading: '1. Administrator danych',
        body: 'Administratorem danych jest Ironwood Livigno, Via Saroch 771, 23041 Livigno (SO), Włochy — CIN IT014037C274OJ27T8. W sprawie niniejszej polityki lub swoich danych osobowych możesz się z nami skontaktować przez WhatsApp pod numerem +39 0342 929285, lub e-mailem na adres info@ironwoodlivigno.com.'
      },
      {
        heading: '2. Jakie dane zbieramy i dlaczego',
        body: 'Strona jest w większości statyczna; formularz zapytania o dostępność stanowi wyjątek, ponieważ korzysta z systemu zarządzania zapytaniami, który przetwarza dane w naszym imieniu. Zbieramy wyłącznie poniższe minimalne dane:\n\n• Formularz zapytania o dostępność: jeśli wypełnisz formularz „Zapytaj o dostępność" na stronie, dane, które wpisujesz — imię i nazwisko, e-mail, telefon, daty pobytu, liczba i wiek gości, ewentualne dodatkowe usługi (śniadanie, e-bike), wiadomość oraz język strony — są przesyłane do naszego wewnętrznego systemu zarządzania zapytaniami, który udostępnia je osobie zarządzającej obiektem w celu odpowiedzi na Twoje zapytanie i obsługi ewentualnej rezerwacji. Przetwarzamy te dane jako administrator danych.\n\n• Kontakt WhatsApp: kliknięcie przycisku WhatsApp otwiera rozmowę z naszym numerem za pośrednictwem aplikacji WhatsApp (Meta). Wiadomości, numer telefonu i inne dane przesłane nam na czacie są przetwarzane zgodnie z polityką prywatności WhatsApp/Meta, a także przez nas w celu odpowiedzi na Twoje zapytanie i obsługi ewentualnej rezerwacji.\n\n• Widget rezerwacji (Holidu): sekcja „Rezerwuj" zawiera formularz dostarczony przez Holidu GmbH, który może zbierać dane potrzebne do sprawdzenia dostępności i obsługi rezerwacji (imię i nazwisko, dane kontaktowe, daty pobytu, dane płatności). Dane te są przetwarzane przez Holidu jako niezależnego administratora lub podmiot przetwarzający, zgodnie z jego własną polityką prywatności.\n\n• Mapa (Google Maps): sekcja „Lokalizacja" zawiera mapę Google, która może ustawiać pliki cookie lub zbierać dane techniczne (np. adres IP) zgodnie z polityką prywatności Google.\n\n• Statystyki użytkowania (Cloudflare Web Analytics): korzystamy z narzędzia do analizy ruchu, które nie używa plików cookie i nie identyfikuje pojedynczych odwiedzających; zbiera wyłącznie zagregowane, anonimowe dane (np. liczbę wizyt, najczęściej odwiedzane strony), zgodnie z polityką prywatności Cloudflare.'
      },
      {
        heading: '3. Podstawa prawna przetwarzania',
        body: 'Przetwarzamy Twoje dane na podstawie: wykonania działań przed zawarciem umowy lub w ramach umowy (np. obsługa zapytania o rezerwację), zgody, gdy jest wyraźnie wymagana (np. dobrowolny kontakt przez WhatsApp), oraz prawnie uzasadnionego interesu w zakresie zagregowanych, anonimowych statystyk dotyczących korzystania ze strony.'
      },
      {
        heading: '4. Pliki cookie',
        body: 'Sama strona nie instaluje żadnych własnych plików cookie. Osadzone treści stron trzecich (widget rezerwacji Holidu, mapa Google) mogą instalować własne pliki cookie techniczne lub profilujące zgodnie z ich politykami. Cloudflare Web Analytics, narzędzie statystyczne, którego używamy, nie korzysta z plików cookie.'
      },
      {
        heading: '5. Przechowywanie danych',
        body: 'Dane zebrane za pośrednictwem WhatsApp oraz formularza zapytania o dostępność są przechowywane przez czas niezbędny do obsługi Twojego zapytania lub pobytu, a następnie przez okres wymagany przez obowiązki podatkowe i prawne (np. rejestracja gości u organów bezpieczeństwa publicznego, przechowywanie dokumentów księgowych).'
      },
      {
        heading: '6. Twoje prawa',
        body: 'Jako osoba, której dane dotyczą, masz prawo do: dostępu do swoich danych osobowych; żądania ich sprostowania lub usunięcia; żądania ograniczenia przetwarzania; wniesienia sprzeciwu wobec przetwarzania; żądania przenoszenia danych; wycofania zgody w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania dokonanego na podstawie zgody przed jej wycofaniem. Możesz skorzystać z tych praw, kontaktując się z nami przez WhatsApp pod numerem +39 0342 929285, lub e-mailem na adres info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Przekazywanie danych',
        body: 'Niektórzy z wymienionych dostawców zewnętrznych (np. Meta/WhatsApp, Google, Cloudflare) mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym. W takich przypadkach dostawcy ci deklarują stosowanie odpowiednich zabezpieczeń (np. standardowych klauzul umownych Komisji Europejskiej), zgodnie z opisem w ich politykach prywatności.'
      },
      {
        heading: '8. Skargi',
        body: 'Jeśli uważasz, że przetwarzanie Twoich danych narusza obowiązujące przepisy, masz prawo wnieść skargę do włoskiego organu ochrony danych osobowych, Garante per la protezione dei dati personali (www.garanteprivacy.it), lub do organu nadzorczego w kraju Twojego zamieszkania w UE.'
      },
      {
        heading: '9. Zmiany w niniejszej polityce',
        body: 'Niniejsza polityka może być z czasem aktualizowana, na przykład w wyniku zmian przepisów lub zmian usług wykorzystywanych na stronie. Data ostatniej aktualizacji jest podana na górze tej strony.'
      }
    ]
  },
  cs: {
    title: 'Zásady ochrany osobních údajů',
    lastUpdated: 'Poslední aktualizace: 11. září 2026',
    intro:
      'Tyto zásady popisují, jak Ironwood Livigno zpracovává osobní údaje návštěvníků webu ironwoodlivigno.com a hostů, kteří žádají o informace nebo rezervaci, v souladu s nařízením (EU) 2016/679 („GDPR") a italským legislativním nařízením č. 196/2003, ve znění legislativního nařízení č. 101/2018.',
    sections: [
      {
        heading: '1. Správce údajů',
        body: 'Správcem údajů je Ironwood Livigno, Via Saroch 771, 23041 Livigno (SO), Itálie — CIN IT014037C274OJ27T8. S jakýmkoli dotazem ohledně těchto zásad nebo vašich osobních údajů nás můžete kontaktovat na WhatsApp na čísle +39 0342 929285, nebo e-mailem na info@ironwoodlivigno.com.'
      },
      {
        heading: '2. Jaké údaje shromažďujeme a proč',
        body: 'Web je převážně statický; formulář žádosti o dostupnost je výjimkou, jelikož využívá systém pro správu žádostí, který zpracovává údaje naším jménem. Shromažďujeme pouze následující minimální údaje:\n\n• Formulář žádosti o dostupnost: pokud vyplníte formulář „Zjistit dostupnost" na webu, údaje, které zadáte — jméno, e-mail, telefon, data pobytu, počet a věk hostů, případné požadované extra služby (snídaně, e-bike), volný text zprávy a jazyk webu — jsou odeslány do našeho interního systému pro správu žádostí, který je zpřístupní správci ubytování k vyřízení vaší žádosti a případné rezervace. Tyto údaje zpracováváme jako správce údajů.\n\n• Kontakt přes WhatsApp: kliknutím na tlačítko WhatsApp se otevře konverzace s naším číslem prostřednictvím aplikace WhatsApp (Meta). Zprávy, telefonní číslo a další údaje, které nám v chatu zašlete, jsou zpracovávány podle zásad ochrany osobních údajů WhatsApp/Meta a také námi za účelem odpovědi na váš dotaz a případné vyřízení rezervace.\n\n• Rezervační widget (Holidu): sekce „Rezervovat" obsahuje formulář poskytovaný společností Holidu GmbH, který může shromažďovat údaje potřebné k ověření dostupnosti a vyřízení rezervace (jméno, kontaktní údaje, data pobytu, platební údaje). Tyto údaje zpracovává Holidu jako samostatný správce nebo zpracovatel podle svých vlastních zásad ochrany osobních údajů.\n\n• Mapa (Google Maps): sekce „Kde se nacházíme" obsahuje mapu Google, která může nastavovat cookies nebo shromažďovat technické údaje (např. IP adresu) podle zásad ochrany osobních údajů Google.\n\n• Statistiky používání (Cloudflare Web Analytics): používáme nástroj pro analýzu návštěvnosti, který nepoužívá cookies a neidentifikuje jednotlivé návštěvníky; shromažďuje pouze agregovaná, anonymní data (např. počet návštěv, nejnavštěvovanější stránky) podle zásad ochrany osobních údajů Cloudflare.'
      },
      {
        heading: '3. Právní základ zpracování',
        body: 'Vaše údaje zpracováváme na základě: plnění předsmluvních nebo smluvních opatření (např. vyřízení vaší žádosti o rezervaci), souhlasu, je-li výslovně vyžadován (např. dobrovolné oslovení přes WhatsApp), a oprávněného zájmu na agregovaných, anonymních statistikách o používání webu.'
      },
      {
        heading: '4. Cookies',
        body: 'Samotný web neukládá žádné vlastní cookies. Vložený obsah třetích stran (rezervační widget Holidu, mapa Google) může ukládat vlastní technické nebo profilovací cookies podle svých zásad. Cloudflare Web Analytics, statistický nástroj, který používáme, cookies nepoužívá.'
      },
      {
        heading: '5. Doba uchovávání údajů',
        body: 'Údaje shromážděné přes WhatsApp a přes formulář žádosti o dostupnost jsou uchovávány po dobu nezbytnou k vyřízení vaší žádosti nebo pobytu, poté po dobu vyžadovanou daňovými a zákonnými povinnostmi (např. evidence hostů u orgánů veřejné bezpečnosti, uchovávání účetních dokladů).'
      },
      {
        heading: '6. Vaše práva',
        body: 'Jako subjekt údajů máte právo: na přístup ke svým osobním údajům; požádat o jejich opravu nebo výmaz; požádat o omezení zpracování; vznést námitku proti zpracování; požádat o přenositelnost údajů; kdykoli odvolat souhlas, aniž by tím byla dotčena zákonnost zpracování založeného na souhlasu uděleném před jeho odvoláním. Tato práva můžete uplatnit kontaktováním nás na WhatsApp na čísle +39 0342 929285, nebo e-mailem na info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Předávání údajů',
        body: 'Někteří ze zmíněných poskytovatelů třetích stran (např. Meta/WhatsApp, Google, Cloudflare) mohou zpracovávat údaje i mimo Evropský hospodářský prostor. V takových případech tito poskytovatelé uvádějí, že uplatňují vhodné záruky (např. standardní smluvní doložky Evropské komise), jak je popsáno v jejich příslušných zásadách ochrany osobních údajů.'
      },
      {
        heading: '8. Stížnosti',
        body: 'Domníváte-li se, že zpracování vašich údajů porušuje platné právní předpisy, máte právo podat stížnost u italského úřadu pro ochranu osobních údajů, Garante per la protezione dei dati personali (www.garanteprivacy.it), nebo u dozorového úřadu ve své zemi bydliště v EU.'
      },
      {
        heading: '9. Změny těchto zásad',
        body: 'Tyto zásady mohou být časem aktualizovány, například v důsledku legislativních změn nebo změn služeb používaných na webu. Datum poslední aktualizace je uvedeno v horní části této stránky.'
      }
    ]
  },
  no: {
    title: 'Personvernerklæring',
    lastUpdated: 'Sist oppdatert: 11. september 2026',
    intro:
      'Denne erklæringen beskriver hvordan Ironwood Livigno behandler personopplysninger til besøkende på ironwoodlivigno.com og gjester som ber om informasjon eller booking, i samsvar med forordning (EU) 2016/679 ("GDPR") og den italienske lovforordningen 196/2003, endret ved lovforordning 101/2018.',
    sections: [
      {
        heading: '1. Behandlingsansvarlig',
        body: 'Behandlingsansvarlig er Ironwood Livigno, Via Saroch 771, 23041 Livigno (SO), Italia — CIN IT014037C274OJ27T8. For henvendelser om denne erklæringen eller dine personopplysninger kan du kontakte oss på WhatsApp på +39 0342 929285, eller på e-post til info@ironwoodlivigno.com.'
      },
      {
        heading: '2. Hvilke data vi samler inn, og hvorfor',
        body: 'Nettstedet er stort sett statisk; skjemaet for forespørsel om tilgjengelighet er unntaket, siden det bruker et system for håndtering av forespørsler som behandler data på våre vegne. Vi samler kun inn følgende minimale data:\n\n• Skjema for forespørsel om tilgjengelighet: Hvis du fyller ut skjemaet "Spør om tilgjengelighet" på nettstedet, sendes dataene du oppgir — navn, e-post, telefonnummer, oppholdsdatoer, antall og alder på gjestene, eventuelle ønskede tillegg (frokost, e-sykkel), fritekstmelding og nettstedets språk — til vårt interne system for håndtering av forespørsler, som gjør dem tilgjengelige for den som administrerer stedet, slik at forespørselen din kan besvares og en eventuell booking behandles. Vi behandler disse dataene som behandlingsansvarlig.\n\n• WhatsApp-kontakt: Et klikk på WhatsApp-knappen åpner en samtale med vårt nummer via WhatsApp-appen (Meta). Meldinger, telefonnummer og andre data du sender oss i chatten behandles i henhold til WhatsApp/Metas egen personvernerklæring, samt av oss for å svare på din henvendelse og håndtere en eventuell booking.\n\n• Booking-widget (Holidu): Seksjonen "Book" inneholder et skjema fra Holidu GmbH, som kan samle inn data som trengs for å sjekke tilgjengelighet og håndtere bookingen (navn, kontaktinformasjon, oppholdsdatoer, betalingsdata). Disse dataene behandles av Holidu som selvstendig behandlingsansvarlig eller databehandler i henhold til deres egen personvernerklæring.\n\n• Kart (Google Maps): Seksjonen "Beliggenhet" inneholder et Google-kart, som kan sette informasjonskapsler eller samle inn tekniske data (f.eks. IP-adresse) i henhold til Googles personvernerklæring.\n\n• Bruksstatistikk (Cloudflare Web Analytics): Vi bruker et trafikkanalyseverktøy som ikke bruker informasjonskapsler og ikke identifiserer enkeltbesøkende; det samler kun inn aggregerte, anonyme data (f.eks. antall besøk, mest viste sider) i henhold til Cloudflares personvernerklæring.'
      },
      {
        heading: '3. Rettslig grunnlag for behandlingen',
        body: 'Vi behandler dine data på grunnlag av: gjennomføring av tiltak forut for eller i forbindelse med en avtale (f.eks. håndtering av din bookingforespørsel), samtykke der dette uttrykkelig kreves (f.eks. frivillig kontakt via WhatsApp), og berettiget interesse i aggregerte, anonyme statistikker om bruken av nettstedet.'
      },
      {
        heading: '4. Informasjonskapsler',
        body: 'Nettstedet i seg selv setter ingen egne informasjonskapsler. Innebygd tredjepartsinnhold (Holidu-booking-widget, Google-kart) kan sette egne tekniske eller profileringsinformasjonskapsler i henhold til sine respektive retningslinjer. Cloudflare Web Analytics, statistikkverktøyet vi bruker, bruker ikke informasjonskapsler.'
      },
      {
        heading: '5. Lagring av data',
        body: 'Data samlet inn via WhatsApp og via skjemaet for forespørsel om tilgjengelighet lagres så lenge det er nødvendig for å håndtere din forespørsel eller ditt opphold, og deretter så lenge skattemessige og juridiske forpliktelser krever det (f.eks. gjesteregistrering hos offentlige sikkerhetsmyndigheter, oppbevaring av regnskapsdokumenter).'
      },
      {
        heading: '6. Dine rettigheter',
        body: 'Som registrert har du rett til: innsyn i dine personopplysninger; å be om retting eller sletting; å be om begrensning av behandlingen; å protestere mot behandlingen; å be om dataportabilitet; å trekke tilbake samtykke når som helst, uten at det påvirker lovligheten av behandling basert på samtykke gitt før tilbaketrekningen. Du kan utøve disse rettighetene ved å kontakte oss på WhatsApp på +39 0342 929285, eller på e-post til info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Dataoverføringer',
        body: 'Noen av de nevnte tredjepartsleverandørene (f.eks. Meta/WhatsApp, Google, Cloudflare) kan behandle data utenfor Det europeiske økonomiske samarbeidsområdet. I slike tilfeller erklærer disse leverandørene at de anvender egnede garantier (f.eks. EU-kommisjonens standard kontraktsklausuler), som beskrevet i deres respektive personvernerklæringer.'
      },
      {
        heading: '8. Klager',
        body: 'Hvis du mener at behandlingen av dine data bryter med gjeldende lovgivning, har du rett til å klage til den italienske datatilsynsmyndigheten Garante per la protezione dei dati personali (www.garanteprivacy.it), eller til tilsynsmyndigheten i ditt eget EU-bostedsland.'
      },
      {
        heading: '9. Endringer i denne erklæringen',
        body: 'Denne erklæringen kan oppdateres over tid, for eksempel som følge av regelverksendringer eller endringer i tjenestene som brukes på nettstedet. Datoen for siste oppdatering vises øverst på denne siden.'
      }
    ]
  },
  nl: {
    title: 'Privacybeleid',
    lastUpdated: 'Laatst bijgewerkt: 11 september 2026',
    intro:
      'Dit beleid beschrijft hoe Ironwood Livigno persoonsgegevens verwerkt van bezoekers van ironwoodlivigno.com en gasten die om informatie of een boeking vragen, in overeenstemming met Verordening (EU) 2016/679 ("AVG") en het Italiaanse wetsbesluit 196/2003, zoals gewijzigd bij wetsbesluit 101/2018.',
    sections: [
      {
        heading: '1. Verwerkingsverantwoordelijke',
        body: 'De verwerkingsverantwoordelijke is Ironwood Livigno, Via Saroch 771, 23041 Livigno (SO), Italië — CIN IT014037C274OJ27T8. Voor vragen over dit beleid of uw persoonsgegevens kunt u contact met ons opnemen via WhatsApp op +39 0342 929285, of per e-mail op info@ironwoodlivigno.com.'
      },
      {
        heading: '2. Welke gegevens we verzamelen en waarom',
        body: 'De website is grotendeels statisch; het beschikbaarheidsaanvraagformulier vormt de uitzondering, aangezien het gebruikmaakt van een aanvraagbeheersysteem dat gegevens namens ons verwerkt. Wij verzamelen alleen de volgende minimale gegevens:\n\n• Beschikbaarheidsaanvraagformulier: als u het formulier "Beschikbaarheid aanvragen" op de site invult, worden de gegevens die u invoert — naam, e-mail, telefoonnummer, verblijfsdata, aantal en leeftijd van de gasten, eventueel gevraagde extra\'s (ontbijt, e-bike), vrije tekst bericht en taal van de site — verzonden naar ons interne aanvraagbeheersysteem, dat deze beschikbaar stelt aan de beheerder van de accommodatie om uw aanvraag te beantwoorden en een eventuele boeking te verwerken. Wij verwerken deze gegevens als verwerkingsverantwoordelijke.\n\n• WhatsApp-contact: door op de WhatsApp-knop te klikken, opent u een gesprek met ons nummer via de WhatsApp-app (Meta). Berichten, telefoonnummer en andere gegevens die u ons in de chat stuurt, worden verwerkt volgens het eigen privacybeleid van WhatsApp/Meta, en ook door ons om te reageren op uw verzoek en een eventuele boeking te beheren.\n\n• Boekingswidget (Holidu): de sectie "Boek" bevat een formulier van Holidu GmbH, dat gegevens kan verzamelen die nodig zijn om beschikbaarheid te controleren en de boeking te beheren (naam, contactgegevens, verblijfsdata, betalingsgegevens). Deze gegevens worden door Holidu verwerkt als zelfstandige verwerkingsverantwoordelijke of verwerker, volgens haar eigen privacybeleid.\n\n• Kaart (Google Maps): de sectie "Locatie" bevat een Google-kaart, die cookies kan plaatsen of technische gegevens (bijv. IP-adres) kan verzamelen volgens het privacybeleid van Google.\n\n• Gebruiksstatistieken (Cloudflare Web Analytics): we gebruiken een verkeersanalysetool die geen cookies gebruikt en individuele bezoekers niet identificeert; het verzamelt alleen geaggregeerde, anonieme gegevens (bijv. aantal bezoeken, meest bekeken pagina\'s) volgens het privacybeleid van Cloudflare.'
      },
      {
        heading: '3. Rechtsgrondslag voor de verwerking',
        body: 'Wij verwerken uw gegevens op basis van: de uitvoering van precontractuele of contractuele maatregelen (bijv. het behandelen van uw boekingsaanvraag), toestemming waar uitdrukkelijk vereist (bijv. vrijwillig contact via WhatsApp), en gerechtvaardigd belang voor geaggregeerde, anonieme statistieken over het gebruik van de website.'
      },
      {
        heading: '4. Cookies',
        body: 'De website zelf plaatst geen eigen cookies. Ingesloten content van derden (Holidu-boekingswidget, Google-kaart) kan eigen technische of profileringscookies plaatsen volgens hun respectieve beleid. Cloudflare Web Analytics, de statistiektool die we gebruiken, gebruikt geen cookies.'
      },
      {
        heading: '5. Bewaring van gegevens',
        body: 'Gegevens verzameld via WhatsApp en via het beschikbaarheidsaanvraagformulier worden bewaard zolang als nodig is om uw verzoek of verblijf te behandelen, en daarna zolang als vereist door fiscale en wettelijke verplichtingen (bijv. gastregistratie bij openbare veiligheidsautoriteiten, bewaring van boekhoudkundige documenten).'
      },
      {
        heading: '6. Uw rechten',
        body: 'Als betrokkene heeft u het recht om: uw persoonsgegevens in te zien; rectificatie of verwijdering ervan te vragen; beperking van de verwerking te vragen; bezwaar te maken tegen de verwerking; gegevensoverdraagbaarheid te vragen; op elk moment uw toestemming in te trekken, zonder dat dit afbreuk doet aan de rechtmatigheid van de verwerking op basis van toestemming vóór de intrekking. U kunt deze rechten uitoefenen door contact met ons op te nemen via WhatsApp op +39 0342 929285, of per e-mail op info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Gegevensoverdracht',
        body: 'Sommige van de genoemde externe aanbieders (bijv. Meta/WhatsApp, Google, Cloudflare) kunnen gegevens ook buiten de Europese Economische Ruimte verwerken. In dergelijke gevallen verklaren deze aanbieders passende waarborgen toe te passen (bijv. standaardcontractbepalingen van de Europese Commissie), zoals beschreven in hun respectieve privacybeleid.'
      },
      {
        heading: '8. Klachten',
        body: 'Als u van mening bent dat de verwerking van uw gegevens in strijd is met de toepasselijke wetgeving, heeft u het recht een klacht in te dienen bij de Italiaanse gegevensbeschermingsautoriteit, Garante per la protezione dei dati personali (www.garanteprivacy.it), of bij de toezichthoudende autoriteit in uw eigen EU-land van verblijf.'
      },
      {
        heading: '9. Wijzigingen in dit beleid',
        body: 'Dit beleid kan in de loop van de tijd worden bijgewerkt, bijvoorbeeld als gevolg van wijzigingen in regelgeving of in de op de website gebruikte diensten. De datum van de laatste update staat bovenaan deze pagina.'
      }
    ]
  },
  'en-us': {
    title: 'Privacy Policy for Guests in Italy',
    lastUpdated: 'Last updated: September 11, 2026',
    intro:
      'This policy describes how Ironwood Livigno processes the personal data of visitors to ironwoodlivigno.com and guests who request information or bookings, in accordance with Regulation (EU) 2016/679 ("GDPR") and Italian Legislative Decree 196/2003, as amended by Legislative Decree 101/2018. Because our property is located in Italy, GDPR applies to how we handle your data regardless of where you are booking from.',
    sections: [
      {
        heading: '1. Data controller',
        body: 'The data controller is Ironwood Livigno, based at Via Saroch 771, 23041 Livigno (SO), Italy — CIN IT014037C274OJ27T8. For any request regarding this policy or your personal data, you can contact us on WhatsApp at +39 0342 929285, or by email at info@ironwoodlivigno.com.'
      },
      {
        heading: '2. What data we collect and why',
        body: 'This site is largely static; the availability request form is the exception, as it relies on a request-management system that processes data on our behalf. We only collect the minimal data described below:\n\n• Availability request form: if you fill in the "Check availability" form on the site, the data you enter — name, email, phone number, stay dates, number and ages of guests, any extras requested (breakfast, e-bike), free-text message and site language — is sent to our internal request-management system, which makes it available to the property manager to respond to your request and process any booking. We process this data as data controller.\n\n• WhatsApp contact: clicking the WhatsApp button opens a conversation with our number via the WhatsApp app (Meta). Any messages, phone number and data you send us in chat are handled according to WhatsApp/Meta\'s own privacy policy, as well as by us to respond to your request and manage any booking.\n\n• Booking widget (Holidu): the "Book" section embeds a form provided by Holidu GmbH, which may collect data needed to check availability and manage the booking (name, contact details, stay dates, payment data). This data is processed by Holidu as an independent controller or processor, per its own privacy policy.\n\n• Map (Google Maps): the "Location" section embeds a Google Map, which may set cookies or collect technical data (e.g. IP address) per Google\'s privacy policy.\n\n• Usage statistics (Cloudflare Web Analytics): we use a traffic analysis tool that does not use cookies and does not identify individual visitors; it only collects aggregated, anonymous data (e.g. number of visits, most viewed pages), per Cloudflare\'s privacy policy.'
      },
      {
        heading: '3. Legal basis for processing',
        body: 'We process your data based on: the performance of pre-contractual or contractual measures (e.g. handling your booking request); consent where explicitly required (e.g. voluntarily contacting us on WhatsApp); and legitimate interest for aggregated, anonymous statistics on how the site is used.'
      },
      {
        heading: '4. Cookies',
        body: 'The site itself does not set any cookies of its own. Embedded third-party content (the Holidu booking widget, the Google Map) may set their own technical or profiling cookies per their respective policies. Cloudflare Web Analytics, the statistics tool we use, does not use cookies.'
      },
      {
        heading: '5. Data retention',
        body: 'Data collected via WhatsApp and via the availability request form is retained for as long as needed to handle your request or stay, and afterwards for as long as required by tax and legal obligations (e.g. guest registration with public safety authorities, retention of accounting records).'
      },
      {
        heading: '6. Your rights',
        body: 'As a data subject, you have the right to: access your personal data; request its rectification or erasure; request restriction of processing; object to processing; request data portability; withdraw consent at any time, without affecting the lawfulness of consent-based processing carried out before withdrawal. You can exercise these rights by contacting us on WhatsApp at +39 0342 929285, or by email at info@ironwoodlivigno.com.'
      },
      {
        heading: '7. Data transfers',
        body: 'Some of the third-party providers mentioned (e.g. Meta/WhatsApp, Google, Cloudflare) may process data outside the European Economic Area, including in the United States. In such cases, these providers state that they apply appropriate safeguards (e.g. the European Commission\'s standard contractual clauses), as described in their respective privacy policies.'
      },
      {
        heading: '8. Complaints',
        body: 'If you believe the processing of your data breaches applicable law, you have the right to lodge a complaint with the Italian Data Protection Authority, Garante per la protezione dei dati personali (www.garanteprivacy.it), or with the supervisory authority in your own country of residence, where applicable.'
      },
      {
        heading: '9. Changes to this policy',
        body: 'This policy may be updated over time, for example following regulatory changes or changes to the services used on the site. The last-updated date is shown at the top of this page.'
      }
    ]
  },
  zh: {
    title: '隐私政策',
    lastUpdated: '最后更新时间：2026年9月11日',
    intro:
      '本政策说明 Ironwood Livigno 如何根据欧盟《通用数据保护条例》（(EU) 2016/679，简称"GDPR"）以及经第101/2018号立法令修订的意大利第196/2003号立法令，处理访问 ironwoodlivigno.com 网站的访客以及咨询信息或预订的客人的个人数据。',
    sections: [
      {
        heading: '1. 数据控制者',
        body: '数据控制者为 Ironwood Livigno，地址位于意大利利维尼奥（Livigno）萨罗赫街771号，邮编23041（SO省）— CIN编号 IT014037C274OJ27T8。如对本政策或您的个人数据有任何疑问，可通过WhatsApp（+39 0342 929285）或电子邮件（info@ironwoodlivigno.com）与我们联系。'
      },
      {
        heading: '2. 我们收集哪些数据及原因',
        body: '本网站大部分为静态网站；可预订查询表单是例外情况，因为它依赖一个代表我们处理数据的查询管理系统。我们仅收集以下最基本的数据：\n\n• 可预订查询表单：如果您填写网站上的"查询可预订情况"表单，您输入的数据——姓名、电子邮箱、电话号码、入住日期、客人人数及年龄、所需的额外服务（早餐、电动自行车）、自由文本留言以及所使用的网站语言——将被发送至我们内部的查询管理系统，该系统会将这些信息提供给房源管理者，以便回复您的查询并处理可能的预订。我们作为数据控制者处理这些数据。\n\n• WhatsApp联系：点击WhatsApp按钮会通过WhatsApp应用程序（Meta旗下）打开与我们号码的对话。您在聊天中发送给我们的消息、电话号码及其他数据将根据WhatsApp/Meta自身的隐私政策进行处理，同时我们也会使用这些信息来回复您的咨询并处理相关预订。\n\n• 预订插件（Holidu）："预订"部分嵌入了由 Holidu GmbH 提供的表单，该表单可能会收集核实空房情况和管理预订所需的数据（姓名、联系方式、入住日期、付款信息）。这些数据由 Holidu 作为独立的数据控制者或处理者，根据其自身的隐私政策进行处理。\n\n• 地图（谷歌地图）："位置"部分嵌入了谷歌地图，根据谷歌的隐私政策，该地图可能会设置cookie或收集技术数据（如IP地址）。\n\n• 使用统计（Cloudflare Web Analytics）：我们使用一款不使用cookie、也不会识别具体访客身份的流量分析工具；它仅根据Cloudflare的隐私政策收集汇总的匿名数据（如访问次数、浏览量最高的页面）。'
      },
      {
        heading: '3. 处理数据的法律依据',
        body: '我们处理您的数据的依据包括：履行合同前或合同相关的措施（例如处理您的预订咨询）；在明确需要时获得的同意（例如您主动通过WhatsApp联系我们）；以及为了网站使用情况的汇总匿名统计而产生的合法利益。'
      },
      {
        heading: '4. Cookie',
        body: '网站本身不设置任何自有cookie。嵌入的第三方内容（Holidu预订插件、谷歌地图）可能会根据各自的政策设置其自身的技术性或分析性cookie。我们使用的统计工具Cloudflare Web Analytics不使用cookie。'
      },
      {
        heading: '5. 数据保留',
        body: '通过WhatsApp及可预订查询表单收集的数据将在处理您的咨询或入住事宜所需的时间内予以保留，此后将根据税务和法律义务所要求的期限继续保留（例如向公共安全机关进行的客人登记、会计凭证的保存）。'
      },
      {
        heading: '6. 您的权利',
        body: '作为数据主体，您有权：访问您的个人数据；要求更正或删除数据；要求限制数据处理；反对数据处理；要求数据可携带；随时撤回同意，但不影响撤回前基于同意所进行处理的合法性。您可以通过WhatsApp（+39 0342 929285）或电子邮件（info@ironwoodlivigno.com）与我们联系以行使上述权利。'
      },
      {
        heading: '7. 数据传输',
        body: '上述部分第三方服务提供商（如Meta/WhatsApp、谷歌、Cloudflare）可能会在欧洲经济区以外处理数据。在此类情况下，这些提供商声明其采取了适当的保障措施（如欧盟委员会的标准合同条款），具体详见其各自的隐私政策。'
      },
      {
        heading: '8. 投诉',
        body: '如果您认为对您数据的处理违反了现行法律，您有权向意大利数据保护机关 Garante per la protezione dei dati personali（www.garanteprivacy.it）投诉，或在适用情况下向您所在国家/地区的监管机构投诉。'
      },
      {
        heading: '9. 本政策的变更',
        body: '本政策可能会随时间更新，例如因法规变化或网站所用服务发生变化。最后更新日期显示在本页顶部。'
      }
    ]
  },
  ja: {
    title: 'プライバシーポリシー',
    lastUpdated: '最終更新日：2026年9月11日',
    intro:
      '本ポリシーは、Ironwood Livignoが、EU一般データ保護規則（(EU) 2016/679、以下「GDPR」）およびイタリア立法令第101/2018号により改正されたイタリア立法令第196/2003号に基づき、ironwoodlivigno.comの訪問者および情報や予約を問い合わせるゲストの個人データをどのように取り扱うかについて説明するものです。',
    sections: [
      {
        heading: '1. データ管理者',
        body: 'データ管理者はIronwood Livignoであり、所在地はイタリア、Via Saroch 771, 23041 Livigno (SO) です — CIN番号 IT014037C274OJ27T8。本ポリシーまたはお客様の個人データに関するお問い合わせは、WhatsApp（+39 0342 929285）または電子メール（info@ironwoodlivigno.com）までご連絡ください。'
      },
      {
        heading: '2. 収集するデータとその目的',
        body: '当サイトの大部分は静的です。空室状況お問い合わせフォームはその例外であり、当方に代わってデータを処理するお問い合わせ管理システムを利用しています。当方が収集するのは、以下の最小限のデータのみです。\n\n• 空室状況お問い合わせフォーム：サイト上の「空室状況を問い合わせる」フォームにご入力いただいたデータ（氏名、メールアドレス、電話番号、宿泊日程、ゲストの人数と年齢、ご希望の追加サービス（朝食、eバイク）、自由記述のメッセージ、サイトの言語）は、当方の内部お問い合わせ管理システムに送信され、施設管理者がお問い合わせへの対応や予約の処理を行うために利用されます。当方はこれらのデータをデータ管理者として処理します。\n\n• WhatsApp連絡：WhatsAppボタンをクリックすると、WhatsAppアプリ（Meta社）を通じて当方の番号とのチャットが開始されます。チャットで送信されたメッセージ、電話番号、その他のデータは、WhatsApp/Metaのプライバシーポリシーに従って取り扱われるとともに、お問い合わせへの返信や予約管理のために当方でも利用いたします。\n\n• 予約ウィジェット（Holidu）：「予約」セクションには、Holidu GmbHが提供するフォームが埋め込まれており、空室状況の確認や予約管理に必要なデータ（氏名、連絡先、宿泊日程、支払い情報）を収集する場合があります。これらのデータはHoliduが独自のデータ管理者または処理者として、同社独自のプライバシーポリシーに基づき処理します。\n\n• 地図（Googleマップ）：「アクセス」セクションにはGoogleマップが埋め込まれており、Googleのプライバシーポリシーに基づき、Cookieの設定や技術データ（IPアドレスなど）の収集が行われる場合があります。\n\n• 利用統計（Cloudflare Web Analytics）：当方はCookieを使用せず、個々の訪問者を特定しないトラフィック分析ツールを利用しています。Cloudflareのプライバシーポリシーに基づき、集計・匿名化されたデータ（訪問回数や閲覧数の多いページなど）のみを収集します。'
      },
      {
        heading: '3. 処理の法的根拠',
        body: '当方は以下を根拠にお客様のデータを処理します：契約前または契約に関連する措置の履行（予約に関するお問い合わせへの対応など）、明示的に必要な場合の同意（WhatsAppを通じた任意のご連絡など）、およびサイトの利用状況に関する集計・匿名統計についての正当な利益。'
      },
      {
        heading: '4. Cookie',
        body: '当サイト自体は独自のCookieを設定しません。埋め込まれた第三者コンテンツ（Holidu予約ウィジェット、Googleマップ）は、それぞれのポリシーに基づき、独自の技術的またはプロファイリング用Cookieを設定する場合があります。当方が使用する統計ツールであるCloudflare Web AnalyticsはCookieを使用しません。'
      },
      {
        heading: '5. データの保存期間',
        body: 'WhatsApp経由および空室状況お問い合わせフォーム経由で収集されたデータは、お問い合わせやご滞在の対応に必要な期間保存され、その後は税務・法的義務（治安当局へのゲスト登録、会計書類の保存など）で定められた期間保存されます。'
      },
      {
        heading: '6. お客様の権利',
        body: 'データ主体として、お客様には以下の権利があります：ご自身の個人データへのアクセス権、訂正または削除の請求権、処理の制限を求める権利、処理に異議を唱える権利、データポータビリティを求める権利、いつでも同意を撤回する権利（撤回前に同意に基づき行われた処理の適法性には影響しません）。これらの権利は、WhatsApp（+39 0342 929285）または電子メール（info@ironwoodlivigno.com）を通じて行使いただけます。'
      },
      {
        heading: '7. データの移転',
        body: '前述の一部の第三者提供者（Meta/WhatsApp、Google、Cloudflareなど）は、欧州経済領域外でデータを処理する場合があります。その場合、これらの提供者はそれぞれのプライバシーポリシーに記載の通り、適切な保護措置（欧州委員会の標準契約条項など）を適用しているとしています。'
      },
      {
        heading: '8. 苦情の申し立て',
        body: 'お客様のデータの取り扱いが適用法に違反していると思われる場合、イタリアのデータ保護機関であるGarante per la protezione dei dati personali（www.garanteprivacy.it）、または該当する場合はお客様の居住国の監督機関に苦情を申し立てる権利があります。'
      },
      {
        heading: '9. 本ポリシーの変更',
        body: '本ポリシーは、法令の改正やサイトで利用するサービスの変更などに伴い、随時更新される場合があります。最終更新日はこのページの上部に記載されています。'
      }
    ]
  }
};
