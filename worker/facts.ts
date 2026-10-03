// What NIGI knows about the apartment, built from the site's own Italian
// texts (messages/it.json) and rate table (src/data/rates.ts) when the
// Worker is bundled. Change a text on the site, publish, and NIGI knows it:
// there is no second copy to keep in sync.
//
// Only what the site says is here, plus the few facts it doesn't state in
// these sections (email, lift season) in EXTRA. The owner's own questions
// and answers from the admin come on top (worker/chat.ts, KV `chat_kb`).

import it from '../messages/it.json';
import { rates } from '../src/data/rates';
import { landingPages } from '../src/content/landingPages';

type Dict = Record<string, string>;

const EXTRA = `
## Altro
- Email: info@ironwoodlivigno.com · Sito: https://ironwoodlivigno.com
- Gli impianti di Livigno sono aperti indicativamente da dicembre ad aprile.
`;

// Values of a section whose keys match a pattern, in file order.
function pick(section: Dict, re: RegExp): string[] {
  return Object.entries(section)
    .filter(([k, v]) => re.test(k) && typeof v === 'string' && v.trim())
    .map(([, v]) => v.trim());
}

function lines(items: string[]): string {
  return items.map((t) => `- ${t}`).join('\n');
}

function buildFacts(): string {
  const hero = it.hero as Dict;
  const glance = it.glance as Dict;
  const rooms = it.rooms as Dict;
  const exp = it.experience as Dict;
  const loc = it.location as Dict;
  const am = it.amenities as Dict;
  const ex = it.extras as Dict;
  const rt = it.rates as Dict;
  const faq = it.faq as Dict;
  const rev = it.reviews as Dict;
  const sum = it.summer as Dict;

  const groups = ['group1', 'group2', 'group3', 'group4']
    .filter((g) => am[`${g}_title`])
    .map((g, i) => `- ${am[`${g}_title`]}: ${pick(am, new RegExp(`^g${i + 1}_\\d+$`)).join(', ')}`);

  const seasons = (['low', 'mid', 'high', 'peak'] as const).map((id) => {
    const r = rates.find((s) => s.id === id);
    const price = r?.pricePerNight != null ? `€ ${r.pricePerNight} a notte` : 'prezzo su preventivo';
    const nights = r?.minNights != null ? `, minimo ${r.minNights} notti` : '';
    return `- ${rt[`season_${id}_label`]} (${rt[`season_${id}_period`]}): ${price}${nights}`;
  });

  const qa: string[] = [];
  for (let i = 1; faq[`q${i}_q`]; i++) qa.push(`- ${faq[`q${i}_q`]} ${faq[`q${i}_a`]}`);

  // The theme pages' own questions (winter, summer, families, how to get
  // here, about us, sauna, rooms), in Italian.
  const pageQa = landingPages.flatMap((p) => (p.faq ?? []).map((f) => `- ${f.q} ${f.a}`));

  return `
# Ironwood Livigno — appartamento vacanze
- ${hero.seo_description}
- Indirizzo: ${loc.address}
- ${glance.area}: ${glance.value_area}. ${hero.stat_sleeps}, ${hero.stat_rooms}.
- ${glance.booking}: ${glance.value_booking}.

## Camere
${lines([`${rooms.room1_title}: ${rooms.room1_text}`, `${rooms.room2_title}: ${rooms.room2_text}`, `${rooms.room3_title}: ${rooms.room3_text}`, rooms.bathrooms_note])}

## Benessere
${lines([`${exp.point_1_title}: ${exp.point_1_text}`, `${exp.point_2_title}: ${exp.point_2_text}`, `${exp.point_3_title}: ${exp.point_3_text}`])}

## Dotazioni
${groups.join('\n')}
- (${am.extra_note}: colazione ed e-bike)

## Posizione
${lines(pick(loc, /^point_\d+$/).slice(0, 1))} (altri dettagli nelle domande frequenti)

## Servizi extra
- ${ex.subtitle}
- ${ex.breakfast_title}: ${ex.breakfast_price} ${ex.breakfast_price_unit}. ${ex.breakfast_text}
- ${ex.ebike_title}: ${ex.ebike_price} ${ex.ebike_price_unit}. ${ex.ebike_text}
- ${ex.booking_note}

## Tariffe
- ${rt.text}
${seasons.join('\n')}
- ${rt.disclaimer}

## Estate
- ${sum.text}

## Domande frequenti (risposte ufficiali)
${qa.join('\n')}

## Altre domande dalle pagine del sito (inverno, estate, famiglie, come arrivare, chi siamo, sauna, camere)
${pageQa.join('\n')}

## Recensioni
- ${rev.disclaimer}

## Contatti
- WhatsApp e telefono: ${(it.footer as Dict).whatsapp}
${EXTRA}`;
}

// "Il modulo qui sotto / qui sopra" on the page is "il modulo sul sito" in a chat.
export const FACTS = buildFacts().replace(/qui (sotto|sopra)/g, 'sul sito');
