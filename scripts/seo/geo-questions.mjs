// GEO / AEO retrieval test set: real questions travellers ask search engines
// and AI assistants, each with the answer the site should support, the URL
// that should contain it, and the facts (regexes) that must be present in
// that page's text or JSON-LD for the answer to be retrievable.
//
//   node scripts/seo/geo-questions.mjs seo-engineering/baseline
//
// reads DIR/pages.json (written by audit.mjs --report=DIR) and writes
// 17_GEO_AEO_QUERY_SET.csv and 18_GEO_ANSWERABILITY_AUDIT.csv to DIR.
// The answerability score is an INTERNAL engineering metric (share of the
// expected facts present on the expected page) — not a ranking or a promise
// that any AI will cite the site.

import fs from 'node:fs';
import path from 'node:path';

const S = 'https://ironwoodlivigno.com';

// Fact patterns, language-independent where the number/name is the fact.
const F = {
  guests6: /\b6\b|sei |six|sechs|seks|sześ|šest|zes|six|六|6名|6人/i,
  bedrooms3: /\b3\b.{0,25}(camer|bedroom|Schlafzimmer|Zimmer|chambre|soveværelse|soverom|sypialni|ložnic|slaapkamer|卧室|寝室)|(camer|bedroom|Schlafzimmer|chambre|soveværelse|soverom|sypialni|ložnic|slaapkamer).{0,10}\b3\b|三间|3间|3つ|寝室3/i,
  bathrooms2: /\b2\b.{0,25}(bagn|bathroom|Bad|salle|badeværelse|bad|łazien|koupel|badkamer|浴室|卫生间|バスルーム)/i,
  infrared: /infraross|infrasaun|infrared|Infrarot|infrarouge|infrarød|podczerwie|infračerv|infrarood|红外|赤外線/i,
  steam: /bagno turco|steam bath|steam room|Turkish bath|Dampfbad|hammam|dampbad|łaźni[aę] parow|parní lázeň|stoombad|dampbad|蒸汽浴|土耳其浴|スチームバス|ミストサウナ/i,
  privateWellness: /privat|private|privé|prywatn|soukrom|eksklusiv|exclusive|esclusiv|仅供|専用|プライベート|私人/i,
  neverShared: /mai condivis|never shared|nie mit anderen|jamais partag|aldrig delt|aldri delt|nigdy nie|nikdy nesd|nooit gedeeld|不与其他|共有しない|他のゲストと共有/i,
  lifts100: /100\s?(m|metri|meter|metres|mètres|metrů|metrów|米|メートル)/i,
  school50: /50\s?(m|metri|meter|metres|mètres|metrů|metrów|米|メートル)/i,
  centre15: /15[\s-]?(minut|min|Minuten|minutter|minuter|minuten|分)/i,
  address: /Via Saroch/i,
  carosello: /Carosello/i,
  livigno: /Livigno|利维尼奥|リヴィーニョ/i,
  area90: /90\s?(m²|sqm|sq m|square met|平方米|㎡)/i,
  parkingFree: /parcheggio|posto auto|parking|Parkplatz|parkeringsplads|parkeringsplass|parkovac|parkeerplaats|miejsce parkingowe|停车|駐車/i,
  pets: /animali|pets|Haustier|animaux|kæledyr|kjæledyr|zwierz|zvířat|huisdier|宠物|ペット/i,
  breakfast15: /15[,.]?0?0?\s?€|€\s?15|15\s?EUR/i,
  ebike: /e-?bike|E-Bike|vélo électrique|elcykel|el-sykkel|rower elektryczny|elektrokol|elektrische fiets|电动自行车|電動自転車/i,
  ebike35: /35[,.]?0?0?\s?€|€\s?35/i,
  cot: /culla|cot|crib|Babybett|Kinderbett|lit bébé|lit parapluie|tremmeseng|barneseng|łóżeczk|postýlk|kinderbed|婴儿床|ベビーベッド/i,
  highchair: /seggiolone|high chair|Hochstuhl|chaise haute|høj stol|barnestol|krzesełk|židličk|kinderstoel|儿童餐椅|ベビーチェア|ハイチェア/i,
  skiStorage: /deposito (?:per )?sci|ski (?:& bike |and bike )?storage|storage for skis|ski room|Abstellraum für Ski|Ski- und Fahrradabstellraum|opbevaring til ski|rum til ski|berging voor ski|fietsberging|Skiraum|Skiabstell|local à skis|skirum|skibod|przechowalni|lyžárn|skiberging|ski-opslag|滑雪储物|スキー保管|スキー置き場/i,
  whatsapp: /WhatsApp/i,
  phone: /\+39 0342 929285|0342 929285/,
  email: /info@ironwoodlivigno\.com/,
  minStay: /2\s?[-–]\s?3/,
  checkin: /check-?in|Anreise|arrivée|indtjekning|innsjekk|zameldow|příjezd|inchecken|入住|チェックイン/i,
  cancellation: /cancellazion|cancell?ation|Stornierung|annulation|afbestilling|avbestilling|anulow|storno|annulering|取消|キャンセル/i,
  noCommission: /commission|Provision|prowizj|provize|provisie|commissie|佣金|手数料/i,
  fireplace: /camino|fireplace|Kamin|cheminée|pejs|peis|kominek|krb|haard|壁炉|暖炉/i,
  balconies: /balcon|balcony|balconies|Balkon|altan|balkong|balkon|阳台|バルコニー/i,
  wifi: /Wi-?Fi/i,
  hosts: /Francesco/,
  local: /livignasc|born and raised|geboren und aufgewachsen|né et|født og opvokset|født og oppvokst|urodzon|narozen|geboren en getogen|土生土长|生まれ育/i,
  summer: /trekking|hiking|Wander|randonnée|vandre|tur|wędrów|turistik|wandel|徒步|ハイキング/i,
  mtb: /mountain bik|Mountainbike|VTT|mountainbike|rower górski|horské kolo|山地车|マウンテンバイク/i,
  lake: /Lago di Livigno|Lake Livigno|Livigno-?See|lac de Livigno|Livigno-søen|Livignosjøen|jezioro Livigno|jezer[oa] Livigno|meer van Livigno|利维尼奥湖|リヴィーニョ湖/i,
  family: /famigli|famil|Famil|famille|rodzin|rodin|gezin|家庭|家族/i,
  tirano: /Tiran[oau]/,
  milan: /Milano|Milan|Mailand|Mediolan|Milán|Milaan|米兰|ミラノ/i,
  dutyFree: /duty[- ]?free|zollfrei|hors taxes|toldfri|tollfri|bezcł|bezcel|belastingvrij|免税/i,
  mottolino: /Mottolino/,
  season: /novembre|november|Novemb|listopad|maggio|May|Mai|maj|květ|mei|11月|5月/i,
  requestForm: /modulo|form|Formular|formulaire|formular|formulář|formulier|表格|フォーム/i,
  directBooking: /diretta|direct|direkt|bezpośredni|přímo|rechtstreeks|直接/i
};

const Q = [];
const q = (lang, cat, question, answer, url, facts) => Q.push({ lang, cat, question, answer, url: S + url, facts });

// ---------- ITALIANO ----------
q('it', 'destination', 'Dove alloggiare a Livigno vicino agli impianti?', 'Ironwood Livigno, Via Saroch 767: appartamento a circa 100 m a piedi dagli impianti.', '/it', ['address', 'lifts100', 'livigno']);
q('it', 'location', 'Appartamento a Livigno vicino al Carosello 3000', 'Ironwood Livigno è in Via Saroch, lato Carosello 3000, 100 m dagli impianti.', '/inverno', ['carosello', 'lifts100']);
q('it', 'wellness', 'Appartamento a Livigno con sauna privata', 'Sì: sauna a infrarossi e bagno turco privati, mai condivisi.', '/sauna-bagno-turco-privato-livigno', ['infrared', 'steam', 'neverShared']);
q('it', 'wellness', 'La sauna di Ironwood Livigno è finlandese o a infrarossi?', 'A infrarossi.', '/sauna-bagno-turco-privato-livigno', ['infrared']);
q('it', 'wellness', 'Sauna e bagno turco sono condivisi con altri ospiti?', 'No, sono ad uso esclusivo degli ospiti dell\'appartamento.', '/it', ['neverShared', 'steam']);
q('it', 'wellness', 'Si paga a parte la sauna?', 'No, l\'uso di sauna e bagno turco è incluso, senza prenotazione.', '/sauna-bagno-turco-privato-livigno', ['infrared']);
q('it', 'wellness', 'Appartamento con bagno turco a Livigno', 'Ironwood Livigno ha un bagno turco privato in appartamento.', '/sauna-bagno-turco-privato-livigno', ['steam', 'privateWellness']);
q('it', 'accommodation', 'Appartamento a Livigno per 6 persone', 'Ironwood Livigno ospita fino a 6 persone in 3 camere.', '/camere-appartamento-livigno', ['guests6', 'bedrooms3']);
q('it', 'accommodation', 'Appartamento a Livigno con 3 camere da letto', '3 camere: matrimoniale, doppia con letti uniti, camera con due singoli.', '/camere-appartamento-livigno', ['bedrooms3']);
q('it', 'accommodation', 'Quanti bagni ha Ironwood Livigno?', '2 bagni completi.', '/camere-appartamento-livigno', ['bathrooms2']);
q('it', 'accommodation', 'Quanto è grande l\'appartamento?', '90 m².', '/camere-appartamento-livigno', ['area90']);
q('it', 'accommodation', 'Affittate anche a una coppia?', 'Sì, l\'intero appartamento si affitta da 1 a 6 ospiti.', '/it', ['guests6']);
q('it', 'accommodation', 'L\'appartamento ha il camino?', 'Sì, un camino elettrico in soggiorno.', '/it', ['fireplace']);
q('it', 'accommodation', 'C\'è il Wi-Fi?', 'Sì, Wi-Fi ad alta velocità.', '/it', ['wifi']);
q('it', 'accommodation', 'L\'appartamento ha il balcone?', 'Due balconi con vista montagna.', '/it', ['balconies']);
q('it', 'ski', 'Quanto dista Ironwood dagli impianti di risalita?', 'Circa 100 m a piedi; scuola sci e noleggio a 50 m.', '/it', ['lifts100', 'school50']);
q('it', 'ski', 'Ironwood Livigno è ski-in ski-out?', 'No, ma è a circa 100 m a piedi dagli impianti.', '/inverno', ['lifts100']);
q('it', 'ski', 'C\'è un deposito sci?', 'Sì, deposito dedicato per sci, scarponi e biciclette.', '/it', ['skiStorage']);
q('it', 'ski', 'Scuola sci vicino all\'appartamento?', 'Scuola sci e noleggio a circa 50 m.', '/inverno', ['school50']);
q('it', 'ski', 'Carosello 3000 o Mottolino: quale scegliere?', 'Guida al confronto dei due versanti.', '/blog/carosello-3000-vs-mottolino-quale-scegliere', ['carosello', 'mottolino']);
q('it', 'ski', 'Quando apre la stagione sciistica a Livigno?', 'Da fine novembre a inizio maggio.', '/inverno', ['season']);
q('it', 'location', 'Quanto dista dal centro di Livigno?', 'Circa 15 minuti a piedi dal centro pedonale.', '/it', ['centre15']);
q('it', 'location', 'Qual è l\'indirizzo di Ironwood Livigno?', 'Via Saroch 767, 23041 Livigno (SO).', '/it/contatti', ['address']);
q('it', 'location', 'Come si arriva a Livigno in treno?', 'Treno fino a Tirano, poi bus o taxi (circa 70 km).', '/come-arrivare', ['tirano']);
q('it', 'location', 'Come arrivare a Livigno da Milano?', 'In auto circa 3 ore via Foscagno o Forcola; in treno via Tirano.', '/blog/come-arrivare-a-livigno', ['milan', 'tirano']);
q('it', 'family', 'Appartamento a Livigno per famiglie con bambini', 'Culla e seggiolone su richiesta, 3 camere, fino a 6 persone.', '/famiglie', ['cot', 'highchair', 'guests6']);
q('it', 'family', 'Avete la culla?', 'Sì, culla e seggiolone su richiesta.', '/it', ['cot', 'highchair']);
q('it', 'family', 'Cosa fare a Livigno con i bambini?', 'Guida alle attività in famiglia.', '/blog/livigno-con-bambini-attivita-famiglia', ['family']);
q('it', 'groups', 'Alloggio a Livigno per un gruppo di amici', '3 camere e 2 bagni per 6 persone, sauna e bagno turco privati.', '/blog/livigno-per-gruppi-numerosi-fino-a-6-persone', ['guests6', 'bedrooms3']);
q('it', 'summer', 'Appartamento a Livigno d\'estate', 'Base per trekking, mountain bike, lago; e-bike a noleggio.', '/estate', ['summer', 'mtb', 'ebike']);
q('it', 'summer', 'Noleggio e-bike a Livigno in appartamento', '2 e-bike in struttura, 35 € a persona al giorno.', '/it', ['ebike', 'ebike35']);
q('it', 'summer', 'Cosa fare a Livigno d\'estate?', 'Mountain bike, trekking, Lago di Livigno.', '/blog/livigno-estate-mountain-bike-trekking-lago', ['mtb', 'lake']);
q('it', 'booking', 'Come si prenota Ironwood Livigno?', 'Modulo di richiesta sul sito o WhatsApp +39 0342 929285.', '/it', ['requestForm', 'whatsapp', 'phone']);
q('it', 'booking', 'Si può prenotare senza commissioni?', 'Sì, prenotando direttamente non ci sono commissioni di intermediazione.', '/chi-siamo', ['noCommission', 'directBooking']);
q('it', 'booking', 'Qual è il soggiorno minimo?', 'Generalmente 2-3 notti.', '/it', ['minStay']);
q('it', 'booking', 'Orari di check-in?', 'Confermati alla prenotazione, flessibili.', '/it', ['checkin']);
q('it', 'booking', 'Politica di cancellazione?', 'Rimborso parziale entro una scadenza, dettagli alla prenotazione.', '/it', ['cancellation']);
q('it', 'practical', 'C\'è il parcheggio?', 'Sì, un posto auto gratuito.', '/it', ['parkingFree']);
q('it', 'practical', 'Sono ammessi cani?', 'No, niente animali.', '/it', ['pets']);
q('it', 'practical', 'Si può fare colazione?', 'Sì, in struttura convenzionata a 50 m, 15 € a persona al giorno.', '/it', ['breakfast15', 'school50']);
q('it', 'practical', 'Chi gestisce Ironwood Livigno?', 'Francesco e la sua famiglia, livignaschi.', '/chi-siamo', ['hosts', 'local']);
q('it', 'practical', 'Cosa conviene comprare a Livigno duty-free?', 'Guida allo shopping duty-free.', '/blog/shopping-duty-free-livigno-cosa-comprare', ['dutyFree']);
q('it', 'practical', 'Email di Ironwood Livigno?', 'info@ironwoodlivigno.com', '/it/contatti', ['email']);

// ---------- ENGLISH ----------
q('en', 'destination', 'Where should I stay in Livigno near Carosello 3000?', 'Ironwood Livigno, Via Saroch 767, about 100 m on foot from the lifts on the Carosello 3000 side.', '/inverno/en', ['carosello', 'lifts100']);
q('en', 'destination', 'Where to stay in Livigno close to the ski lifts?', 'Ironwood Livigno is about 100 m from the lifts.', '/en', ['lifts100', 'address']);
q('en', 'wellness', 'Which Livigno apartments have a private sauna?', 'Ironwood Livigno has a private infrared sauna and steam bath, never shared.', '/sauna-bagno-turco-privato-livigno/en', ['infrared', 'steam', 'privateWellness']);
q('en', 'wellness', 'Which accommodation in Livigno has a Turkish bath?', 'Ironwood Livigno has a private steam (Turkish) bath.', '/sauna-bagno-turco-privato-livigno/en', ['steam']);
q('en', 'wellness', 'Does Ironwood Livigno have a private sauna?', 'Yes, a private infrared sauna for its guests only.', '/en', ['infrared', 'neverShared']);
q('en', 'wellness', 'Is the sauna at Ironwood Livigno shared?', 'No, never shared with other guests.', '/en', ['neverShared']);
q('en', 'wellness', 'Is the sauna extra or included?', 'Included, no booking or extra charge.', '/sauna-bagno-turco-privato-livigno/en', ['infrared']);
q('en', 'accommodation', 'Where can six people stay in a 3-bedroom apartment in Livigno?', 'Ironwood Livigno: 3 bedrooms, 2 bathrooms, up to 6 guests.', '/camere-appartamento-livigno/en', ['guests6', 'bedrooms3', 'bathrooms2']);
q('en', 'accommodation', 'Which apartment has three bedrooms and two bathrooms in Livigno?', 'Ironwood Livigno.', '/en', ['bedrooms3', 'bathrooms2']);
q('en', 'accommodation', 'Livigno apartment for 6 people', 'Up to 6 guests in 3 bedrooms, 90 m².', '/en', ['guests6', 'area90']);
q('en', 'accommodation', 'How big is Ironwood Livigno?', '90 m².', '/camere-appartamento-livigno/en', ['area90']);
q('en', 'accommodation', 'What beds are in the bedrooms?', 'Main double bed; double room with joined singles; twin room.', '/camere-appartamento-livigno/en', ['bedrooms3']);
q('en', 'accommodation', 'What is a luxury apartment near Carosello 3000?', 'Ironwood Livigno: renovated 2022, wood and iron, private wellness, 100 m from lifts.', '/en', ['lifts100', 'infrared']);
q('en', 'accommodation', 'Does the apartment have Wi-Fi?', 'Yes, high-speed Wi-Fi.', '/en', ['wifi']);
q('en', 'accommodation', 'Is there a fireplace?', 'An electric fireplace in the living room.', '/en', ['fireplace']);
q('en', 'ski', 'How far is Ironwood Livigno from the ski lifts?', 'About 100 m on foot.', '/en', ['lifts100']);
q('en', 'ski', 'Is Ironwood Livigno ski-in ski-out?', 'No; it is about 100 m on foot from the lifts.', '/inverno/en', ['lifts100']);
q('en', 'ski', 'Is there a ski school near the apartment?', 'Ski school and ski rental about 50 m away.', '/en', ['school50']);
q('en', 'ski', 'Does the apartment have ski storage?', 'Yes, a dedicated ski and bike storage room.', '/en', ['skiStorage']);
q('en', 'ski', 'Carosello 3000 or Mottolino?', 'Guide comparing the two sides.', '/blog/carosello-3000-vs-mottolino-quale-scegliere/en', ['carosello', 'mottolino']);
q('en', 'ski', 'How much does skiing in Livigno cost?', 'Guide to ski pass and ski prices.', '/blog/quanto-costa-sciare-a-livigno-guida-prezzi/en', ['livigno']);
q('en', 'location', 'How far is Ironwood from Livigno centre?', 'About 15 minutes on foot.', '/en', ['centre15']);
q('en', 'location', 'What is the address of Ironwood Livigno?', 'Via Saroch 767, 23041 Livigno (SO), Italy.', '/en/contact', ['address']);
q('en', 'location', 'How do I get to Livigno by train?', 'Train to Tirano, then bus or taxi.', '/come-arrivare/en', ['tirano']);
q('en', 'location', 'How do I get to Livigno from Milan?', 'By car via Foscagno/Forcola or train to Tirano.', '/blog/come-arrivare-a-livigno/en', ['milan', 'tirano']);
q('en', 'family', 'Which Livigno accommodation is suitable for a family?', 'Ironwood Livigno: cot and high chair on request, 3 bedrooms.', '/famiglie/en', ['cot', 'highchair', 'bedrooms3']);
q('en', 'family', 'Do you have a cot and high chair?', 'Yes, on request.', '/en', ['cot', 'highchair']);
q('en', 'family', 'What can kids do in Livigno?', 'Family activities guide.', '/blog/livigno-con-bambini-attivita-famiglia/en', ['family']);
q('en', 'groups', 'Livigno accommodation for a group of 6 friends', '3 bedrooms, 2 bathrooms, private sauna.', '/blog/livigno-per-gruppi-numerosi-fino-a-6-persone/en', ['guests6', 'bedrooms3']);
q('en', 'summer', 'Summer apartment in Livigno', 'Base for hiking, mountain biking and the lake.', '/estate/en', ['summer', 'mtb', 'lake']);
q('en', 'summer', 'E-bike apartment Livigno', '2 e-bikes for rent on site, €35 per person per day.', '/en', ['ebike', 'ebike35']);
q('en', 'summer', 'What to do in Livigno in summer?', 'Mountain biking, hiking, Lake Livigno.', '/blog/livigno-estate-mountain-bike-trekking-lago/en', ['mtb', 'lake']);
q('en', 'booking', 'How do I book Ironwood Livigno?', 'Request form on the site or WhatsApp +39 0342 929285.', '/en', ['requestForm', 'whatsapp', 'phone']);
q('en', 'booking', 'Can I book directly without commission?', 'Yes, direct booking with the owners, no commission.', '/chi-siamo/en', ['noCommission', 'directBooking']);
q('en', 'booking', 'What is the minimum stay?', 'Usually 2-3 nights.', '/en', ['minStay']);
q('en', 'booking', 'What are the check-in times?', 'Confirmed at booking, flexible.', '/en', ['checkin']);
q('en', 'booking', 'What is the cancellation policy?', 'Partial refund before a deadline.', '/en', ['cancellation']);
q('en', 'practical', 'Is parking included?', 'Yes, one free parking space.', '/en', ['parkingFree']);
q('en', 'practical', 'Are dogs allowed?', 'No pets.', '/en', ['pets']);
q('en', 'practical', 'Is breakfast available?', 'At a partner venue 50 m away, €15 per person per day.', '/en', ['breakfast15']);
q('en', 'practical', 'Who runs Ironwood Livigno?', 'Francesco and his family, born and raised in Livigno.', '/chi-siamo/en', ['hosts', 'local']);
q('en', 'practical', 'What is duty-free shopping in Livigno?', 'Guide to duty-free shopping.', '/blog/shopping-duty-free-livigno-cosa-comprare/en', ['dutyFree']);
q('en-us', 'accommodation', 'Vacation rental in Livigno for 6 people with a sauna', 'Ironwood Livigno: up to 6 guests, private infrared sauna.', '/en-us', ['guests6', 'infrared']);

// ---------- DEUTSCH ----------
q('de', 'wellness', 'Ferienwohnung Livigno Sauna', 'Ironwood Livigno: private Infrarotsauna und Dampfbad, nie geteilt.', '/sauna-bagno-turco-privato-livigno/de', ['infrared', 'steam', 'neverShared']);
q('de', 'wellness', 'Ferienwohnung Livigno mit privatem Dampfbad', 'Ja, privates Dampfbad in der Wohnung.', '/de', ['steam', 'privateWellness']);
q('de', 'accommodation', 'Ferienwohnung Livigno für 6 Personen', 'Bis zu 6 Gäste, 3 Schlafzimmer, 2 Bäder.', '/de', ['guests6', 'bedrooms3', 'bathrooms2']);
q('de', 'accommodation', 'Ferienwohnung Livigno 3 Schlafzimmer', '3 Schlafzimmer, 90 m².', '/camere-appartamento-livigno/de', ['bedrooms3', 'area90']);
q('de', 'ski', 'Unterkunft Livigno nah am Skilift', 'Etwa 100 m zu Fuß zu den Liften.', '/de', ['lifts100']);
q('de', 'ski', 'Ferienwohnung Livigno Carosello 3000', 'Via Saroch, Seite Carosello 3000.', '/inverno/de', ['carosello', 'lifts100']);
q('de', 'ski', 'Skischule und Skiverleih in der Nähe?', 'Etwa 50 m entfernt.', '/de', ['school50']);
q('de', 'ski', 'Gibt es einen Skiraum?', 'Ja, Ski- und Fahrradraum.', '/de', ['skiStorage']);
q('de', 'family', 'Familienurlaub Livigno Ferienwohnung', 'Babybett und Hochstuhl auf Anfrage.', '/famiglie/de', ['cot', 'highchair']);
q('de', 'summer', 'Livigno im Sommer: Wandern und Mountainbike', 'Wandern, Mountainbike, See.', '/estate/de', ['summer', 'mtb']);
q('de', 'summer', 'E-Bike Verleih Livigno Ferienwohnung', '2 E-Bikes, 35 € pro Person und Tag.', '/de', ['ebike', 'ebike35']);
q('de', 'location', 'Wie weit ist es zum Zentrum von Livigno?', 'Etwa 15 Minuten zu Fuß.', '/de', ['centre15']);
q('de', 'location', 'Anreise nach Livigno mit dem Zug', 'Bis Tirano, dann Bus oder Taxi.', '/come-arrivare/de', ['tirano']);
q('de', 'booking', 'Wie buche ich direkt?', 'Anfrageformular oder WhatsApp.', '/de', ['requestForm', 'whatsapp']);
q('de', 'practical', 'Parkplatz inklusive?', 'Ja, kostenloser Parkplatz.', '/de', ['parkingFree']);
q('de', 'practical', 'Sind Haustiere erlaubt?', 'Nein.', '/de', ['pets']);
q('de', 'practical', 'Frühstück möglich?', '15 € pro Person und Tag, 50 m entfernt.', '/de', ['breakfast15']);
q('de', 'practical', 'Wer vermietet Ironwood Livigno?', 'Francesco und Familie aus Livigno.', '/chi-siamo/de', ['hosts']);
q('de', 'destination', 'Carosello 3000 oder Mottolino?', 'Vergleich der beiden Skigebiete.', '/blog/carosello-3000-vs-mottolino-quale-scegliere/de', ['carosello', 'mottolino']);
q('de', 'practical', 'Zollfrei einkaufen in Livigno', 'Ratgeber zollfreies Einkaufen.', '/blog/shopping-duty-free-livigno-cosa-comprare/de', ['dutyFree']);

// ---------- FRANÇAIS ----------
q('fr', 'wellness', 'Appartement Livigno sauna privée', 'Sauna infrarouge et hammam privés.', '/sauna-bagno-turco-privato-livigno/fr', ['infrared', 'steam']);
q('fr', 'accommodation', 'Location Livigno 6 personnes 3 chambres', 'Jusqu\'à 6 personnes, 3 chambres, 2 salles de bains.', '/fr', ['guests6', 'bedrooms3', 'bathrooms2']);
q('fr', 'ski', 'Appartement Livigno proche des remontées', 'Environ 100 m à pied.', '/fr', ['lifts100']);
q('fr', 'family', 'Appartement Livigno famille', 'Lit bébé et chaise haute sur demande.', '/famiglie/fr', ['cot', 'highchair']);
q('fr', 'summer', 'Livigno en été', 'Randonnée, VTT, lac.', '/estate/fr', ['summer', 'lake']);
q('fr', 'location', 'Comment aller à Livigno en train ?', 'Jusqu\'à Tirano puis bus.', '/come-arrivare/fr', ['tirano']);
q('fr', 'booking', 'Comment réserver ?', 'Formulaire ou WhatsApp.', '/fr', ['whatsapp']);
q('fr', 'practical', 'Parking gratuit ?', 'Oui, une place gratuite.', '/fr', ['parkingFree']);
q('fr', 'ski', 'Local à skis ?', 'Oui.', '/fr', ['skiStorage']);
q('fr', 'location', 'Distance du centre de Livigno ?', 'Environ 15 minutes à pied.', '/fr', ['centre15']);

// ---------- POLSKI ----------
q('pl', 'wellness', 'Apartament Livigno sauna', 'Prywatna sauna na podczerwień i łaźnia parowa.', '/sauna-bagno-turco-privato-livigno/pl', ['infrared', 'steam']);
q('pl', 'accommodation', 'Apartament Livigno dla 6 osób', 'Do 6 osób, 3 sypialnie, 2 łazienki.', '/pl', ['guests6', 'bedrooms3', 'bathrooms2']);
q('pl', 'ski', 'Nocleg Livigno blisko wyciągów', 'Około 100 m pieszo.', '/pl', ['lifts100']);
q('pl', 'family', 'Livigno z dziećmi apartament', 'Łóżeczko i krzesełko na życzenie.', '/famiglie/pl', ['cot', 'highchair']);
q('pl', 'summer', 'Livigno latem', 'Wędrówki, rower górski, jezioro.', '/estate/pl', ['summer']);
q('pl', 'booking', 'Jak zarezerwować?', 'Formularz lub WhatsApp.', '/pl', ['whatsapp']);
q('pl', 'practical', 'Czy jest parking?', 'Tak, bezpłatne miejsce.', '/pl', ['parkingFree']);
q('pl', 'location', 'Jak dojechać do Livigno?', 'Pociągiem do Tirano, potem autobus.', '/come-arrivare/pl', ['tirano']);

// ---------- DANSK ----------
q('da', 'ski', 'Lejlighed Livigno ski', 'Ca. 100 m til liftene, skirum.', '/da', ['lifts100', 'skiStorage']);
q('da', 'wellness', 'Lejlighed Livigno med privat sauna', 'Privat infrarød sauna og dampbad.', '/sauna-bagno-turco-privato-livigno/da', ['infrared', 'steam']);
q('da', 'accommodation', 'Ferielejlighed Livigno 6 personer', 'Op til 6 gæster, 3 soveværelser.', '/da', ['guests6', 'bedrooms3']);
q('da', 'family', 'Livigno med børn', 'Tremmeseng og høj stol efter aftale.', '/famiglie/da', ['cot']);
q('da', 'location', 'Hvordan kommer man til Livigno?', 'Tog til Tirano, derefter bus.', '/come-arrivare/da', ['tirano']);
q('da', 'booking', 'Hvordan booker man?', 'Formular eller WhatsApp.', '/da', ['whatsapp']);

// ---------- NORSK ----------
q('no', 'ski', 'Leilighet Livigno nær skiheisen', 'Ca. 100 m til heisene.', '/no', ['lifts100']);
q('no', 'wellness', 'Leilighet Livigno med privat badstue', 'Privat infrarød badstue og dampbad.', '/sauna-bagno-turco-privato-livigno/no', ['infrared', 'steam']);
q('no', 'accommodation', 'Leilighet Livigno for 6 personer', 'Opptil 6 gjester, 3 soverom.', '/no', ['guests6', 'bedrooms3']);
q('no', 'location', 'Hvordan reise til Livigno?', 'Tog til Tirano, så buss.', '/come-arrivare/no', ['tirano']);
q('no', 'booking', 'Hvordan bestiller man?', 'Skjema eller WhatsApp.', '/no', ['whatsapp']);

// ---------- NEDERLANDS ----------
q('nl', 'ski', 'Appartement Livigno ski', 'Ongeveer 100 m van de liften, skiberging.', '/nl', ['lifts100', 'skiStorage']);
q('nl', 'wellness', 'Appartement Livigno met privé sauna', 'Privé infraroodsauna en stoombad.', '/sauna-bagno-turco-privato-livigno/nl', ['infrared', 'steam']);
q('nl', 'accommodation', 'Vakantieappartement Livigno 6 personen', 'Tot 6 gasten, 3 slaapkamers.', '/nl', ['guests6', 'bedrooms3']);
q('nl', 'family', 'Livigno met kinderen', 'Kinderbed en kinderstoel op aanvraag.', '/famiglie/nl', ['cot', 'highchair']);
q('nl', 'location', 'Hoe kom je in Livigno?', 'Trein naar Tirano, dan bus.', '/come-arrivare/nl', ['tirano']);
q('nl', 'booking', 'Hoe boek ik?', 'Formulier of WhatsApp.', '/nl', ['whatsapp']);

// ---------- ČEŠTINA ----------
q('cs', 'ski', 'Apartmán Livigno u vleku', 'Asi 100 m od lanovek.', '/cs', ['lifts100']);
q('cs', 'wellness', 'Apartmán Livigno se saunou', 'Soukromá infrasauna a parní lázeň.', '/sauna-bagno-turco-privato-livigno/cs', ['infrared', 'steam']);
q('cs', 'accommodation', 'Apartmán Livigno pro 6 osob', 'Až 6 hostů, 3 ložnice.', '/cs', ['guests6', 'bedrooms3']);
q('cs', 'location', 'Jak se dostat do Livigna?', 'Vlakem do Tirana, pak autobusem.', '/come-arrivare/cs', ['tirano']);
q('cs', 'booking', 'Jak rezervovat?', 'Formulář nebo WhatsApp.', '/cs', ['whatsapp']);

// ---------- 中文 / 日本語 ----------
q('zh', 'wellness', '利维尼奥 带私人桑拿的公寓', '私人红外桑拿和蒸汽浴。', '/sauna-bagno-turco-privato-livigno/zh', ['infrared', 'steam']);
q('zh', 'accommodation', '利维尼奥 6人公寓', '最多6人，3间卧室。', '/zh', ['guests6']);
q('ja', 'wellness', 'リヴィーニョ プライベートサウナ付きアパート', '赤外線サウナとスチームバス。', '/sauna-bagno-turco-privato-livigno/ja', ['infrared']);
q('ja', 'accommodation', 'リヴィーニョ 6人 アパート', '最大6名、寝室3室。', '/ja', ['guests6']);

// ---------- run ----------
const dir = process.argv[2] ?? 'seo-engineering/baseline';
const pages = JSON.parse(fs.readFileSync(path.join(dir, 'pages.json'), 'utf8'));
const byUrl = Object.fromEntries(pages.map((p) => [p.url, p]));
const csv = (rows) => rows.map((r) => r.map((c) => { const s = String(c ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n') + '\n';

const rows = [];
let total = 0;
const perCat = {};
const perLang = {};
for (const x of Q) {
  const p = byUrl[x.url];
  const hay = p ? `${p.title} ${p.description} ${p.text} ${JSON.stringify(p.schema)}` : '';
  const present = x.facts.filter((f) => F[f].test(hay));
  const missing = x.facts.filter((f) => !F[f].test(hay));
  const score = p ? present.length / x.facts.length : 0;
  total += score;
  (perCat[x.cat] ??= []).push(score);
  (perLang[x.lang] ??= []).push(score);
  rows.push([x.lang, x.cat, x.question, x.answer, x.url, p ? 'yes' : 'PAGE MISSING', present.join(' '), missing.join(' '), score.toFixed(2)]);
}
fs.writeFileSync(path.join(dir, '17_GEO_AEO_QUERY_SET.csv'), csv([['lang', 'category', 'question', 'expected_answer', 'source_url', 'expected_facts'], ...Q.map((x) => [x.lang, x.cat, x.question, x.answer, x.url, x.facts.join(' ')])]));
fs.writeFileSync(path.join(dir, '18_GEO_ANSWERABILITY_AUDIT.csv'), csv([['lang', 'category', 'question', 'expected_answer', 'source_url', 'page_found', 'evidence_present', 'evidence_missing', 'answerability_score'], ...rows]));
const avg = (a) => (a.reduce((s, v) => s + v, 0) / a.length).toFixed(2);
console.log(`GEO test set: ${Q.length} questions · mean answerability ${(total / Q.length).toFixed(3)} (internal metric)`);
console.log('by category:', Object.fromEntries(Object.entries(perCat).map(([k, v]) => [k, avg(v)])));
console.log('by language:', Object.fromEntries(Object.entries(perLang).map(([k, v]) => [k, avg(v)])));
for (const r of rows.filter((r) => Number(r[8]) < 1)) console.log(`  ${r[8]} [${r[0]}] ${r[2]} → ${r[4].replace(S, '')} missing: ${r[7] || r[5]}`);

// --strict (used by `npm run test:seo` before every deploy): fail when a
// question's expected page is gone or has lost any of its expected facts.
if (process.argv.includes('--strict')) {
  const broken = rows.filter((r) => Number(r[8]) < 1);
  if (broken.length) {
    console.error(`GEO regression: ${broken.length} question(s) no longer fully answerable`);
    process.exit(1);
  }
}
