// Static seasonal rate table. The site is a 100% static export (see
// README) with no booking/PMS backend, so there is no live, iCal-synced
// pricing or availability feed here — that was scoped out deliberately (see
// project notes) in favor of this typed placeholder structure, filled in
// with real numbers by hand as the owner confirms them.
//
// `pricePerNight: null` / `minNights: null` means "not set yet" and is
// rendered everywhere as "price on request" rather than a fabricated
// number. The same rule is enforced in StructuredData.tsx: a season with a
// null price is skipped when building schema.org `Offer` markup, so we
// never publish a guessed price to search engines either.
export type SeasonId = 'low' | 'mid' | 'high' | 'peak';

export type Season = {
  id: SeasonId;
  // EUR, per night. TODO: fill in the real 2026/27 rate card once the
  // owner confirms it — the four-season structure below is final.
  pricePerNight: number | null;
  // TODO: confirm minimum-stay policy per season (many Livigno properties
  // require 5–7 nights over Christmas/New Year).
  minNights: number | null;
};

export const CURRENCY = 'EUR';

export const rates: Season[] = [
  { id: 'low', pricePerNight: null, minNights: null },
  { id: 'mid', pricePerNight: null, minNights: null },
  { id: 'high', pricePerNight: null, minNights: null },
  { id: 'peak', pricePerNight: null, minNights: null }
];
