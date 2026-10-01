// Order of the homepage sections, and which are hidden, chosen in the admin. The static pages keep
// their built order; for the homepages (HOME_PATHS, routed to the Worker in
// wrangler.jsonc) the Worker adds a small <style> with CSS `order` values for
// the sections inside <div id="sezioni"> (a flex column, see
// src/app/[locale]/page.tsx), and `display:none` for hidden ones. No
// rebuild, and nothing moves after the page has painted.

export const LAYOUT_KEY = 'layout';

// Every movable section: its element id on the page and its name in the admin.
// Default order = the order in page.tsx.
export const SECTIONS: { id: string; label: string }[] = [
  { id: 'meteo', label: 'Meteo' },
  { id: 'galleria', label: 'Galleria foto' },
  { id: 'tour-virtuale', label: 'Tour virtuale 360°' },
  { id: 'camere', label: 'Camere' },
  { id: 'prenota', label: 'Richiedi disponibilità' },
  { id: 'foto-del-giorno', label: 'Foto del giorno' },
  { id: 'tariffe', label: 'Tariffe' },
  { id: 'servizi', label: 'Servizi inclusi' },
  { id: 'servizi-extra', label: 'Colazione ed e-bike' },
  { id: 'posizione', label: 'Posizione e mappa' },
  { id: 'estate', label: 'Estate e inverno' },
  { id: 'esperienza', label: 'Sauna e bagno turco' },
  { id: 'recensioni', label: 'Recensioni' },
  { id: 'faq', label: 'Domande frequenti' }
];

export const HOME_PATHS = ['/it', '/en', '/de', '/fr', '/da', '/pl', '/cs', '/no', '/nl', '/zh', '/ja', '/en-us'];

// Keeps only known ids, each once; sections missing from a saved order
// (e.g. added to the site later) go at the end in their default order.
export function normalizeOrder(order: unknown): string[] {
  const known = SECTIONS.map((s) => s.id);
  const list = Array.isArray(order) ? order.filter((id): id is string => typeof id === 'string' && known.includes(id)) : [];
  const unique = [...new Set(list)];
  return [...unique, ...known.filter((id) => !unique.includes(id))];
}

export type Layout = { order: string[]; hidden: string[] };

// Accepts what is stored in KV or sent by the admin; an older value was just the order array.
export function parseLayout(value: unknown): Layout {
  const v = (Array.isArray(value) ? { order: value } : value ?? {}) as { order?: unknown; hidden?: unknown };
  const known = SECTIONS.map((s) => s.id);
  const hidden = Array.isArray(v.hidden) ? [...new Set(v.hidden.filter((id): id is string => typeof id === 'string' && known.includes(id)))] : [];
  return { order: normalizeOrder(v.order), hidden };
}

export function isDefault(layout: Layout): boolean {
  return layout.hidden.length === 0 && layout.order.every((id, i) => id === SECTIONS[i].id);
}

export function layoutCss(layout: Layout): string {
  return (
    layout.order.map((id, i) => `#sezioni>#${id}{order:${i}}`).join('') +
    layout.hidden.map((id) => `#sezioni>#${id}{display:none}`).join('')
  );
}
