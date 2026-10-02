// Topic clusters of the Livigno guide: for every article, three related
// articles on the same or the next topic, shown at the end of the article in
// its own language ("Leggi anche"). Before this, articles linked only to
// landing pages, so 133 article URLs (every language) had at most 2 internal
// links pointing at them — mostly just their language's blog index.
// Chosen by hand by topic, so the links are useful to the reader, and every
// article receives at least two of them (checked by scripts/seo/audit.mjs:
// pages with ≤1 inbound link are reported).
//
// Clusters: travel & planning · winter & skiing · summer · the apartment,
// families & groups · food & shopping.
export const relatedPosts: Record<string, [string, string, string]> = {
  'come-arrivare-a-livigno': ['quando-prenotare-livigno-calendario-stagionale', 'migliori-periodi-per-evitare-la-folla-a-livigno', 'livigno-tax-free-guida-per-chi-arriva-dallestero'],
  'sci-a-livigno-guida-carosello-3000': ['carosello-3000-vs-mottolino-quale-scegliere', 'quanto-costa-sciare-a-livigno-guida-prezzi', 'deposito-sci-e-attrezzatura-a-livigno-cosa-cercare'],
  'livigno-estate-mountain-bike-trekking-lago': ['livigno-estate-10-esperienze-imperdibili', 'vacanza-senza-pensieri-a-livigno-colazione-ed-e-bike', 'da-dove-ammirare-il-tramonto-a-livigno'],
  'cosa-mangiare-a-livigno-piatti-tipici': ['shopping-duty-free-livigno-cosa-comprare', 'natale-capodanno-a-livigno', 'livigno-estate-10-esperienze-imperdibili'],
  'shopping-duty-free-livigno-cosa-comprare': ['livigno-tax-free-guida-per-chi-arriva-dallestero', 'cosa-mangiare-a-livigno-piatti-tipici', 'come-arrivare-a-livigno'],
  'livigno-con-bambini-attivita-famiglia': ['migliori-piste-sci-livigno-famiglie', 'livigno-per-gruppi-numerosi-fino-a-6-persone', 'livigno-con-il-cane-regole-e-alternative'],
  'livigno-estate-10-esperienze-imperdibili': ['da-dove-ammirare-il-tramonto-a-livigno', 'livigno-estate-mountain-bike-trekking-lago', 'cosa-mangiare-a-livigno-piatti-tipici'],
  'migliori-piste-sci-livigno-famiglie': ['livigno-con-bambini-attivita-famiglia', 'sci-a-livigno-guida-carosello-3000', 'deposito-sci-e-attrezzatura-a-livigno-cosa-cercare'],
  'sauna-privata-vs-condivisa-livigno': ['appartamento-con-sauna-privata-livigno-vs-hotel', 'quanto-costa-un-appartamento-a-livigno', 'livigno-per-gruppi-numerosi-fino-a-6-persone'],
  'quanto-costa-sciare-a-livigno-guida-prezzi': ['quanto-costa-un-appartamento-a-livigno', 'sci-a-livigno-guida-carosello-3000', 'migliori-periodi-per-evitare-la-folla-a-livigno'],
  'natale-capodanno-a-livigno': ['quando-prenotare-livigno-calendario-stagionale', 'migliori-periodi-per-evitare-la-folla-a-livigno', 'cosa-mangiare-a-livigno-piatti-tipici'],
  'carosello-3000-vs-mottolino-quale-scegliere': ['sci-a-livigno-guida-carosello-3000', 'migliori-piste-sci-livigno-famiglie', 'deposito-sci-e-attrezzatura-a-livigno-cosa-cercare'],
  'quanto-costa-un-appartamento-a-livigno': ['quando-prenotare-livigno-calendario-stagionale', 'appartamento-con-sauna-privata-livigno-vs-hotel', 'sauna-privata-vs-condivisa-livigno'],
  'appartamento-con-sauna-privata-livigno-vs-hotel': ['sauna-privata-vs-condivisa-livigno', 'livigno-per-gruppi-numerosi-fino-a-6-persone', 'quanto-costa-un-appartamento-a-livigno'],
  'livigno-per-gruppi-numerosi-fino-a-6-persone': ['livigno-con-bambini-attivita-famiglia', 'appartamento-con-sauna-privata-livigno-vs-hotel', 'vacanza-senza-pensieri-a-livigno-colazione-ed-e-bike'],
  'deposito-sci-e-attrezzatura-a-livigno-cosa-cercare': ['sci-a-livigno-guida-carosello-3000', 'carosello-3000-vs-mottolino-quale-scegliere', 'vacanza-senza-pensieri-a-livigno-colazione-ed-e-bike'],
  'quando-prenotare-livigno-calendario-stagionale': ['migliori-periodi-per-evitare-la-folla-a-livigno', 'natale-capodanno-a-livigno', 'quanto-costa-un-appartamento-a-livigno'],
  'vacanza-senza-pensieri-a-livigno-colazione-ed-e-bike': ['livigno-estate-mountain-bike-trekking-lago', 'deposito-sci-e-attrezzatura-a-livigno-cosa-cercare', 'livigno-per-gruppi-numerosi-fino-a-6-persone'],
  'livigno-tax-free-guida-per-chi-arriva-dallestero': ['shopping-duty-free-livigno-cosa-comprare', 'come-arrivare-a-livigno', 'livigno-con-il-cane-regole-e-alternative'],
  'migliori-periodi-per-evitare-la-folla-a-livigno': ['quando-prenotare-livigno-calendario-stagionale', 'quanto-costa-sciare-a-livigno-guida-prezzi', 'da-dove-ammirare-il-tramonto-a-livigno'],
  'livigno-con-il-cane-regole-e-alternative': ['come-arrivare-a-livigno', 'livigno-tax-free-guida-per-chi-arriva-dallestero', 'livigno-estate-10-esperienze-imperdibili'],
  'da-dove-ammirare-il-tramonto-a-livigno': ['livigno-estate-10-esperienze-imperdibili', 'livigno-estate-mountain-bike-trekking-lago', 'migliori-periodi-per-evitare-la-folla-a-livigno']
};

// Heading of the block, in each blog language.
export const relatedHeading: Record<string, string> = {
  it: 'Leggi anche',
  en: 'Related guides',
  de: 'Weitere Ratgeber',
  fr: 'À lire aussi',
  da: 'Læs også',
  pl: 'Przeczytaj też',
  cs: 'Mohlo by vás zajímat',
  no: 'Les også',
  nl: 'Lees ook',
  zh: '相关指南',
  ja: '関連ガイド'
};
