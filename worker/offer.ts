// Special-offer pop-up: the admin saves one offer (stay dates, price, the
// period the pop-up is shown, on/off switch) in KV under `offer`; the site
// asks /api/offer on every page view and shows the pop-up only while the
// offer is switched on and today (Italian time) is inside its window.

export type Offer = {
  active: boolean;
  checkIn: string; // YYYY-MM-DD, first night of the stay
  checkOut: string; // YYYY-MM-DD, departure day
  extraStays?: Stay[]; // more periods at the same price (e.g. the next weekends), visitors pick one
  price: number; // euro
  unit: 'stay' | 'night';
  originalPrice: number | null; // full price, shown struck through
  showFrom: string; // YYYY-MM-DD, first day the pop-up appears
  showUntil: string; // YYYY-MM-DD, last day (inclusive)
  image: string; // one of OFFER_IMAGES
  id: string; // changes on every save, so visitors who closed the old one see the new one
  updated: string;
  google?: boolean; // also publish it as an Offer post on the Google profile
  googlePost?: string; // resource name of that post, to remove it when the offer changes
};

export type Stay = { checkIn: string; checkOut: string };
// Enough for every weekend of a season stretch (e.g. ten weekends in a row). Keep in sync with EXTRA_ROWS in admin.ts.
export const MAX_EXTRA_STAYS = 9;

export const OFFER_KEY = 'offer';

// Photos the admin can pick for the pop-up: files in public/images with
// -480/-768/-1024 .webp/.avif variants (the pop-up's srcset uses those).
// Keep in sync with the picker in admin.ts.
export const OFFER_IMAGES = [
  'esterno-giorno',
  'esterno-notte',
  'hero-ironwood',
  'soggiorno',
  'sauna-vista-montagna',
  'camera1',
  'lago-livigno-panorama',
  'livigno-ghiaccioli-vista-vallata'
];
export const DEFAULT_OFFER_IMAGE = 'esterno-giorno';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isDate(v: unknown): v is string {
  return typeof v === 'string' && DATE_RE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
}

// Validates what the admin form sends; returns the offer to store or an error message in Italian.
export function parseOffer(body: Record<string, unknown>): Offer | string {
  const { checkIn, checkOut, showFrom, showUntil } = body;
  if (!isDate(checkIn) || !isDate(checkOut)) return 'Inserisci le date di arrivo e di partenza';
  if (checkOut <= checkIn) return 'La partenza deve essere dopo l’arrivo';
  if (!isDate(showFrom) || !isDate(showUntil)) return 'Inserisci inizio e fine dell’offerta';
  if (showUntil < showFrom) return 'La fine dell’offerta deve essere uguale o successiva all’inizio';

  const extraStays: Stay[] = [];
  if (Array.isArray(body.extraStays)) {
    for (const raw of body.extraStays.slice(0, MAX_EXTRA_STAYS)) {
      const st = (raw ?? {}) as Record<string, unknown>;
      if (!st.checkIn && !st.checkOut) continue; // row left empty
      if (!isDate(st.checkIn) || !isDate(st.checkOut)) return 'Inserisci arrivo e partenza anche per gli altri periodi (o lasciali vuoti)';
      if (st.checkOut <= st.checkIn) return 'In un altro periodo la partenza è prima dell’arrivo';
      extraStays.push({ checkIn: st.checkIn, checkOut: st.checkOut });
    }
  }

  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0 || price > 100000) return 'Inserisci un prezzo valido';
  const unit = body.unit === 'night' ? 'night' : 'stay';

  let originalPrice: number | null = null;
  if (body.originalPrice !== undefined && body.originalPrice !== null && body.originalPrice !== '') {
    originalPrice = Number(body.originalPrice);
    if (!Number.isFinite(originalPrice) || originalPrice <= price) return 'Il prezzo pieno deve essere più alto del prezzo dell’offerta (oppure lascialo vuoto)';
  }

  return {
    active: body.active === true,
    checkIn,
    checkOut,
    ...(extraStays.length ? { extraStays } : {}),
    price: Math.round(price * 100) / 100,
    unit,
    originalPrice: originalPrice === null ? null : Math.round(originalPrice * 100) / 100,
    showFrom,
    showUntil,
    image: typeof body.image === 'string' && OFFER_IMAGES.includes(body.image) ? body.image : DEFAULT_OFFER_IMAGE,
    id: crypto.randomUUID().slice(0, 8),
    updated: new Date().toISOString(),
    google: body.google === true
  };
}

// The UTC instant when a given Italian calendar day starts.
export function romeDayStart(date: string): number {
  const utcMidnight = Date.parse(`${date}T00:00:00Z`);
  // Italy is UTC+1 or UTC+2: read what time it is in Rome at UTC midnight.
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', hourCycle: 'h23' }).format(new Date(utcMidnight))
  );
  return utcMidnight - hour * 3600_000;
}

export function isLive(offer: Offer, today: string): boolean {
  return offer.active && offer.showFrom <= today && today <= offer.showUntil;
}

// Every period of the offer, by date.
export function allStays(offer: Offer): Stay[] {
  return [{ checkIn: offer.checkIn, checkOut: offer.checkOut }, ...(offer.extraStays ?? [])].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
}

// What the public site receives: no admin-only fields, plus when the offer ends.
// Periods whose arrival day is past are left out (the first weekend drops off
// on its Saturday), unless that would leave none.
export function publicOffer(offer: Offer, today?: string) {
  const all = allStays(offer);
  const upcoming = today ? all.filter((s) => s.checkIn >= today) : all;
  const stays = upcoming.length ? upcoming : all;
  const nextDay = new Date(Date.parse(`${offer.showUntil}T00:00:00Z`) + 86400_000).toISOString().slice(0, 10);
  return {
    id: offer.id,
    checkIn: stays[0].checkIn,
    checkOut: stays[0].checkOut,
    stays,
    price: offer.price,
    unit: offer.unit,
    originalPrice: offer.originalPrice,
    showUntil: offer.showUntil,
    image: offer.image && OFFER_IMAGES.includes(offer.image) ? offer.image : DEFAULT_OFFER_IMAGE,
    endsAt: romeDayStart(nextDay)
  };
}
