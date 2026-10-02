// Fact consistency engine: every number the site states about the property
// (guests, bedrooms, bathrooms, m², distance to the lifts…) must match
// seo-engineering/property-facts.json, in every language. Claims the property
// can't support (ski-in/ski-out, Finnish sauna) are flagged wherever they
// appear without a negation. Conflicts are P1: they block the deploy.

import fs from 'node:fs';

const facts = JSON.parse(fs.readFileSync(new URL('../../seo-engineering/property-facts.json', import.meta.url), 'utf8'));

// [fact name, expected value, regex whose group 1 is the stated number]
// Patterns only match statements about the apartment (e.g. "fino a N ospiti"),
// not every number in a travel guide.
const N = '(\\d+)';
const rules = [
  ['max_guests', facts.capacity.max_guests, [
    `fino a ${N} (?:ospiti|persone)`, `up to ${N} (?:guests|people)`, `sleeps (?:up to |1\s?[–-]\s?)?${N}`, `bis zu ${N} (?:Gäste|Personen)`,
    `jusqu.(?:à|a) ${N} (?:personnes|voyageurs|hôtes|invités)`, `op til ${N} (?:gæster|personer)`, `opptil ${N} (?:gjester|personer)`,
    `do ${N} (?:osób|gości)`, `až (?:pro )?${N} (?:hostů|osob)`, `tot ${N} (?:gasten|personen)`, `最多(?:可入住)?${N}`, `最大${N}名`]],
  ['bedrooms', facts.bedrooms.count, [
    `${N} camere(?: da letto)?\\b`, `${N}[ -]bedroom`, `${N} Schlafzimmer`, `${N} chambres`, `${N} soveværelser`, `${N} sypialn`, `${N} ložnic`,
    `${N} soverom`, `${N} slaapkamers`, `${N}间卧室`, `${N}つの寝室`, `寝室${N}`]],
  ['bathrooms', facts.bathrooms.count, [
    `${N} bagni`, `${N} (?:full )?bathrooms`, `${N} (?:Badezimmer|Bäder|Bädern)`, `${N} salles de bains?`, `${N} badeværelser`, `${N} łazien`,
    `${N} koupeln`, `${N} bad(?:rom)?\\b`, `${N} badkamers`, `${N}间(?:浴室|卫生间)`, `バスルーム${N}`]],
  ['floor_area_m2', facts.property.floor_area_m2, [`${N}\\s?m²(?! (?:di|of) (?:spa|wellness))`]],
  ['lift_distance_m', facts.location.distances.ski_lifts.value, [
    `${N}\\s?(?:m|metri|meters?|metres?) (?:a piedi )?(?:dagli|from the|von den|des|fra|od|od|van de|from) (?:impianti|piste|(?:ski )?lifts?|Lift|Skilift|remontées|lifterne|liften|heisene|wyciąg|lanov|vlek)`,
    `${N}\\s?(?:m|Meter) (?:zu den|zum|bis zu den) (?:Lift|Skilift)`, `${N}\\s?(?:m|metrů|metrów|meter|mètres) (?:od|fra|des|van) `]],
  // Street number (767, confirmed by the owner 2026-10-02; the site said 771 before).
  // "Via Saroch, 100 m dagli impianti" is a distance, not a number: skip "N m".
  ['street_number', Number(facts.location.street_address.match(/\d+/)[0]), [`Saroch,? ${N}\\b(?!\\s?(?:m\\b|met|Met|mèt|米|メートル))`, `萨罗赫街${N}号`]]
];

const negation = /\b(non|not|nicht|kein|pas|ikke|nie|není|niet|ingen)\b|不是|ではない|ではありません/i;
const banned = [
  ['ski-in/ski-out claim', /ski[- ]?in(?:\s*\/\s*|\s+|-)ski[- ]?out|ski-to-door/i],
  ['Finnish sauna (it is infrared)', /sauna finlandese|finnish sauna|finnische sauna|sauna finlandaise|finsk sauna|saun[aę] fińsk|finsk(?:e)? badstue|finská sauna|finse sauna/i]
];

export function checkFacts(pages) {
  const out = [];
  for (const d of pages) {
    const text = d.fullText;
    for (const [name, expected, patterns] of rules) {
      for (const p of patterns) {
        for (const m of text.matchAll(new RegExp(p, 'giu'))) {
          const v = Number(m[1]);
          // distances: 50 m is the ski school/rental, which may sit next to "impianti"
          if (name === 'lift_distance_m' && v === facts.location.distances.ski_school.value) continue;
          if (v !== expected) {
            const ctx = text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 40);
            out.push({ sev: 'P1', code: `fact-conflict-${name}`, url: d.url, detail: `"${m[0]}" (expected ${expected}) … ${ctx}` });
          }
        }
      }
    }
    for (const [label, re] of banned) {
      for (const m of text.matchAll(new RegExp(re.source, 'giu'))) {
        const sentenceStart = Math.max(text.lastIndexOf('.', m.index), text.lastIndexOf('?', m.index), 0);
        const sentence = text.slice(sentenceStart, m.index + 80);
        if (negation.test(sentence)) continue;
        // a traveller's question quoted in an FAQ ("…ski-in ski-out…?") is not a claim
        const end = text.slice(m.index).search(/[.?!\n]/);
        if (end >= 0 && text[m.index + end] === '?') continue;
        out.push({ sev: 'P1', code: 'fact-unsupported-claim', url: d.url, detail: `${label}: …${text.slice(Math.max(0, m.index - 70), m.index + 60)}…` });
      }
    }
  }
  return out;
}

// Plain-text files that aren't HTML pages but are read by AI systems.
export function checkTextFile(name, text) {
  return checkFacts([{ url: name, fullText: text }]);
}
