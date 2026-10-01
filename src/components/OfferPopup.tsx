'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Special-offer pop-up. The offer itself (stay dates, price, visibility
// window, on/off) is set by the owner at /admin and served by the Worker at
// /api/offer, which returns it only while it is switched on and inside its
// dates — so the static pages never need rebuilding for a new offer.
//
// Opens by itself after 5 seconds of the page actually being on screen, on
// every visit. Closing it only lasts for the rest of that visit
// (sessionStorage, keyed by the offer id): moving between pages doesn't bring
// it back each time, but the next visit does. Meanwhile a small "Offer"
// button above the WhatsApp one lets visitors reopen it.
// `?anteprima-offerta` in the URL (the admin's preview link) opens it at
// once and asks the Worker for the saved offer even if it isn't live yet.

export type OfferStrings = {
  eyebrow: string;
  title: string;
  checkInLabel: string;
  checkOutLabel: string;
  nights: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
  perStay: string;
  perNight: string;
  save: string;
  features: string[];
  featureOffSeason: string;
  limited: string;
  validUntil: string;
  endsIn: string;
  days: string;
  hours: string;
  minutes: string;
  ctaWhatsapp: string;
  ctaEmail: string;
  close: string;
  pill: string;
  waMessage: string;
  emailSubject: string;
  emailFields: string;
};

type Offer = {
  id: string;
  checkIn: string;
  checkOut: string;
  price: number;
  unit: 'stay' | 'night';
  originalPrice: number | null;
  showUntil: string;
  image?: string;
  endsAt: number;
};

const CLOSED_KEY = 'iw-offer-closed';
// Seconds of the page being visible, counted from when it started loading.
const OPEN_AFTER_MS = 5000;
const WHATSAPP = '390342929285';
const EMAIL = 'info@ironwoodlivigno.com';
// Same @id as the LodgingBusiness in StructuredData.tsx (src/lib/structuredDataIds.ts).
const SITE_URL = 'https://ironwoodlivigno.com';
// Site locale -> the tag Intl formats best with ('no' is Norwegian Bokmål).
const INTL_LOCALE: Record<string, string> = { en: 'en-GB', 'en-us': 'en-US', no: 'nb-NO' };
// Photo chosen in the admin (see OFFER_IMAGES in worker/offer.ts). On phones
// the photo is a wide strip, so some pictures need their focus point moved.
const DEFAULT_IMAGE = 'esterno-giorno';
// Months the lifts are open (late November/early December to the start of
// May): same as LIFT_MONTHS in worker/index.ts. A stay with no night in them
// doesn't advertise the lifts (features[1]) but the walk to the centre.
const LIFT_MONTHS = [12, 1, 2, 3, 4];
function isSkiStay(checkIn: string, checkOut: string) {
  for (let t = Date.parse(checkIn); t < Date.parse(checkOut); t += 86400_000) {
    if (LIFT_MONTHS.includes(new Date(t).getUTCMonth() + 1)) return true;
  }
  return false;
}
const MOBILE_FOCUS: Record<string, string> = { 'esterno-notte': 'object-[center_58%]', 'esterno-giorno': 'object-[center_45%]' };
// Width in pixels of each offer photo's original (public/images/<name>.webp).
// The srcset offers every generated size up to it (scripts/generate-responsive-
// images.mjs makes 480…1920 when the original is that wide) plus the original
// itself: on a computer the photo fills a tall box (cropped from ~1100px wide, or
// ~2200 real pixels on a sharp screen), so stopping at 1024 made it blurry.
const OFFER_IMAGE_WIDTH: Record<string, number> = {
  'esterno-giorno': 1181,
  'esterno-notte': 1920,
  'hero-ironwood': 1920,
  soggiorno: 1920,
  'sauna-vista-montagna': 2000,
  camera1: 1905,
  'lago-livigno-panorama': 1080,
  'livigno-ghiaccioli-vista-vallata': 1400
};
const SIZES = [480, 768, 1024, 1440, 1920];
function offerSrcSet(img: string, original: number, format: 'avif' | 'webp') {
  const list = SIZES.filter((w) => w <= original).map((w) => `${img}-${w}.${format} ${w}w`);
  // The original only exists as WebP (and JPG).
  if (format === 'webp' && !SIZES.includes(original)) list.push(`${img}.webp ${original}w`);
  return list.join(', ');
}

// Calls `cb` once the page has been visible for `ms` in total; the countdown
// pauses while the tab is in the background. Returns a cancel function.
function afterVisibleFor(ms: number, cb: () => void) {
  let remaining = ms;
  let startedAt = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const start = () => {
    if (timer || remaining <= 0) return;
    startedAt = performance.now();
    timer = setTimeout(() => {
      timer = undefined;
      remaining = 0;
      cb();
    }, remaining);
  };
  const pause = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = undefined;
    remaining -= performance.now() - startedAt;
  };
  const onVisibility = () => (document.visibilityState === 'visible' ? start() : pause());
  document.addEventListener('visibilitychange', onVisibility);
  onVisibility();
  return () => {
    pause();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

const fill = (s: string, values: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k) => values[k] ?? m);

export default function OfferPopup({ locale, strings: t }: { locale: string; strings: OfferStrings }) {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const previewRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  const show = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  }, []);

  const hide = useCallback(() => {
    setShown(false);
    setTimeout(() => setOpen(false), 350);
    if (offer && !previewRef.current) {
      try {
        sessionStorage.setItem(CLOSED_KEY, offer.id);
      } catch {}
    }
  }, [offer]);

  // Counts this page view for the admin's visit stats (worker/stats.ts): a
  // POST beacon, never cached, so every page opened counts. `r` is only the
  // host the visitor came from (e.g. www.google.com); nothing personal is sent.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('anteprima-offerta')) return;
    let ref = '';
    try {
      ref = document.referrer ? new URL(document.referrer).hostname : '';
    } catch {}
    try {
      navigator.sendBeacon(`/api/visita${ref ? `?r=${encodeURIComponent(ref)}` : ''}`);
    } catch {}
  }, []);

  // Fetch after the page has settled, then open after a short delay.
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has('anteprima-offerta');
    previewRef.current = preview;
    let cancelOpen: (() => void) | undefined;
    const fetchTimer = setTimeout(async () => {
      try {
        const res = await fetch(preview ? '/api/offer?preview=1' : '/api/offer', { credentials: 'same-origin' });
        if (!res.ok) return;
        const data = (await res.json()) as { offer: Offer | null };
        if (!data.offer) return;
        setOffer(data.offer);
        let closed = false;
        try {
          // Earlier versions remembered a closed pop-up for ever; forget that.
          localStorage.removeItem(CLOSED_KEY);
          closed = sessionStorage.getItem(CLOSED_KEY) === data.offer.id;
        } catch {}
        if (preview) show();
        else if (!closed) cancelOpen = afterVisibleFor(Math.max(0, OPEN_AFTER_MS - performance.now()), show);
      } catch {
        // No offer endpoint (e.g. local `next dev`): nothing to show.
      }
    }, 0);
    return () => {
      clearTimeout(fetchTimer);
      cancelOpen?.();
    };
  }, [show]);

  // While open: lock page scroll, close on Escape, focus the close button, tick the countdown.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide();
    document.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 60);
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      clearTimeout(focusTimer);
      clearInterval(tick);
    };
  }, [open, hide]);

  // The live offer as JSON-LD, so search engines that render the page see it
  // too (the static HTML can't carry it: it changes from the admin without a
  // rebuild). Not in preview, where the offer may not be public yet.
  useEffect(() => {
    if (!offer || previewRef.current) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: `${t.eyebrow}: ${offer.checkIn} – ${offer.checkOut}`,
      url: window.location.href.split(/[?#]/)[0],
      price: offer.price,
      priceCurrency: 'EUR',
      priceValidUntil: offer.showUntil,
      availabilityStarts: offer.checkIn,
      availabilityEnds: offer.checkOut,
      availability: 'https://schema.org/LimitedAvailability',
      ...(offer.unit === 'night'
        ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: offer.price, priceCurrency: 'EUR', unitCode: 'DAY' } }
        : {}),
      offeredBy: { '@id': `${SITE_URL}/#organization` },
      image: `${SITE_URL}/images/${offer.image ?? DEFAULT_IMAGE}-1024.webp`
    });
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [offer, t.eyebrow]);

  // After closing, keyboard focus moves to the reopen button (rendered only once the dialog is gone).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) wasOpen.current = true;
    else if (wasOpen.current) pillRef.current?.focus({ preventScroll: true });
  }, [open]);

  if (!offer) return null;

  const intl = INTL_LOCALE[locale] ?? locale;
  const day = (d: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(intl, { ...opts, timeZone: 'UTC' }).format(new Date(`${d}T00:00:00Z`));
  const longDate = (d: string) => day(d, { day: 'numeric', month: 'long', year: 'numeric' });
  const money = (v: number) =>
    new Intl.NumberFormat(intl, { style: 'currency', currency: 'EUR', maximumFractionDigits: Number.isInteger(v) ? 0 : 2 }).format(v);

  const nightsCount = Math.round((Date.parse(offer.checkOut) - Date.parse(offer.checkIn)) / 86400_000);
  const pluralKey = new Intl.PluralRules(intl).select(nightsCount);
  const nightsLabel = fill(t.nights[pluralKey] ?? t.nights.other, { n: String(nightsCount) });
  const pct = offer.originalPrice ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100) : 0;
  const unitLabel = offer.unit === 'night' ? t.perNight : t.perStay;
  const features = isSkiStay(offer.checkIn, offer.checkOut) ? t.features : t.features.map((f, i) => (i === 1 ? t.featureOffSeason : f));
  const priceText = `${money(offer.price)}${offer.unit === 'night' ? ` ${t.perNight}` : ''}`;

  const values = { checkIn: longDate(offer.checkIn), checkOut: longDate(offer.checkOut), price: priceText };
  const waText = fill(t.waMessage, values);
  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`;
  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(fill(t.emailSubject, values))}&body=${encodeURIComponent(`${waText}\n\n${t.emailFields}`)}`;

  const imageKey = offer.image ?? DEFAULT_IMAGE;
  const IMG = `/images/${imageKey}`;
  const imgWidth = OFFER_IMAGE_WIDTH[imageKey] ?? 1024;
  const remaining = offer.endsAt - now;
  const showCountdown = remaining > 0 && remaining < 7 * 86400_000;
  const cd = {
    d: Math.floor(remaining / 86400_000),
    h: Math.floor((remaining % 86400_000) / 3600_000),
    m: Math.floor((remaining % 3600_000) / 60_000)
  };

  return (
    <>
      {!open && (
        <button
          ref={pillRef}
          type="button"
          onClick={show}
          className="fixed right-6 bottom-[4.25rem] z-50 inline-flex items-center gap-2 rounded-full bg-gold text-ink pl-3 pr-4 py-2 text-xs font-semibold shadow-soft hover:brightness-105 transition"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-brick opacity-75 animate-ping motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brick" />
          </span>
          {t.pill} · {money(offer.price)}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center" role="presentation">
          <div
            className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`}
            onClick={hide}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-title"
            className={`relative w-full md:max-w-4xl md:mx-6 max-h-[92vh] md:max-h-[94vh] overflow-y-auto overscroll-contain bg-[#3D3026] text-mist rounded-t-[2rem] md:rounded-[2rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] md:grid md:grid-cols-[1.05fr_1fr] transition-all duration-500 ease-out motion-reduce:transition-none ${
              shown ? 'translate-y-0 opacity-100 md:scale-100' : 'translate-y-full md:translate-y-6 opacity-0 md:scale-95'
            }`}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={hide}
              aria-label={t.close}
              className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-ink/60 backdrop-blur text-mist ring-1 ring-mist/25 flex items-center justify-center hover:bg-ink/85 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="relative aspect-[2/1] min-[400px]:aspect-[16/9] sm:aspect-auto sm:h-72 md:h-auto md:min-h-[540px] overflow-hidden">
              <span className="md:hidden absolute top-2.5 left-1/2 -translate-x-1/2 z-10 h-1.5 w-12 rounded-full bg-mist/60" aria-hidden />
              <picture>
                {/* AVIF only while it reaches the size a computer needs: otherwise the browser would
                    take a small AVIF over the large WebP and stretch it. */}
                {imgWidth >= 1920 && <source type="image/avif" srcSet={offerSrcSet(IMG, imgWidth, 'avif')} sizes="(min-width: 768px) 1100px, 100vw" />}
                <source type="image/webp" srcSet={offerSrcSet(IMG, imgWidth, 'webp')} sizes="(min-width: 768px) 1100px, 100vw" />
                {/* No slow zoom here (unlike the homepage photos): it enlarged the photo by a further 12%. */}
                <img src={`${IMG}-1024.webp`} alt="" className={`absolute inset-0 w-full h-full object-cover ${MOBILE_FOCUS[imageKey] ?? 'object-center'} md:object-center`} />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D3026] via-[#3D3026]/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#3D3026]/40" aria-hidden />
              {pct > 0 && (
                <span className="absolute left-5 top-5 md:left-6 md:top-6 z-10 rounded-full bg-brick text-mist px-4 py-2 text-sm md:text-base font-semibold shadow-soft tabular-nums">
                  −{pct}%
                </span>
              )}
            </div>

            <div className="relative px-6 pt-4 sm:px-8 md:px-10 md:pt-9 md:pb-8 flex flex-col">
              <p className="flex items-center gap-2 text-gold tracking-[0.25em] uppercase text-[11px] md:text-xs font-semibold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2l2.4 6.9L21 12l-6.6 3.1L12 22l-2.4-6.9L3 12l6.6-3.1z" />
                </svg>
                {t.eyebrow}
              </p>
              <h2 id="offer-title" className="font-display text-2xl min-[400px]:text-[1.75rem] leading-[1.15] md:text-[2.1rem] mt-2 md:mt-3">
                {t.title}
              </h2>

              <div className="mt-4 md:mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-mist/[0.06] ring-1 ring-mist/10 p-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-mist/55">{t.checkInLabel}</p>
                  <p className="mt-1 font-medium leading-snug">{day(offer.checkIn, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-gold/15 text-gold px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                  </svg>
                  {nightsLabel}
                </span>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-widest text-mist/55">{t.checkOutLabel}</p>
                  <p className="mt-1 font-medium leading-snug">{day(offer.checkOut, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="mt-4 md:mt-5 flex items-end flex-wrap gap-x-4 gap-y-1">
                <span className="font-display text-5xl md:text-6xl leading-none tabular-nums">{money(offer.price)}</span>
                {offer.originalPrice && (
                  <span className="text-xl text-mist/45 line-through tabular-nums mb-1">{money(offer.originalPrice)}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-mist/70">
                {unitLabel}
                {pct > 0 && <span className="text-gold font-semibold"> · {fill(t.save, { pct: String(pct) })}</span>}
              </p>

              <ul className="mt-5 md:mt-4 space-y-2 text-sm text-mist/85">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold flex-none" aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5 md:mt-4 text-sm">
                {showCountdown ? (
                  <p className="flex items-center flex-wrap gap-2">
                    <span className="text-mist/70">{t.endsIn}</span>
                    {[
                      [cd.d, t.days],
                      [cd.h, t.hours],
                      [cd.m, t.minutes]
                    ].map(([v, l]) => (
                      <span key={l} className="rounded-lg bg-mist/10 px-2.5 py-1 font-semibold tabular-nums">
                        {v} <span className="font-normal text-mist/70">{l}</span>
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-mist/70">{fill(t.validUntil, { date: longDate(offer.showUntil) })}</p>
                )}
              </div>

              <p className="mt-4 text-xs text-mist/55">{t.limited}</p>

              <div className="sticky bottom-0 -mx-6 sm:-mx-8 md:mx-0 mt-4 px-6 sm:px-8 md:px-0 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-12px_24px_-12px_rgba(0,0,0,0.6)] md:shadow-none md:pb-0 bg-[#3D3026] md:bg-transparent md:static">
                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gold text-ink font-semibold px-6 py-3.5 shadow-[0_12px_30px_-10px_rgba(201,160,89,0.7)] hover:brightness-105 transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.07.77.82-2.99-.2-.31a8.11 8.11 0 0 1-1.25-4.29C3.9 7.5 7.5 3.9 12.04 3.9c2.18 0 4.22.85 5.76 2.39a8.06 8.06 0 0 1 2.38 5.76c0 4.55-3.7 8.97-8.14 8.97Zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
                    </svg>
                    {t.ctaWhatsapp}
                  </a>
                  <a
                    href={mailHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-mist/30 text-mist font-semibold px-6 py-3.5 hover:bg-mist/10 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                    {t.ctaEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
