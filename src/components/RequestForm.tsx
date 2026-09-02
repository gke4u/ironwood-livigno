'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import DatePicker, { fromISO } from './DatePicker';

// Submits to TORBERO's own public intake Worker (torbero-richieste, in the
// separate `torberto` project — richieste-worker/src/index.js's /submit
// handler) at richieste.ironwoodlivigno.com, so a booking request lands
// directly in the property-management app's Richieste tab instead of a
// separate system (the previous forms.ironwoodlivigno.com backend) that
// TORBERO couldn't see. Same request/response contract as before (this
// component is otherwise unchanged) — the new backend was built to accept
// the exact same payload shape. No access key here: authentication is
// implicit in the Worker's own deployment (its D1/email bindings only
// exist inside that Worker, never in this client-side bundle).
const FORMS_ENDPOINT = 'https://richieste.ironwoodlivigno.com/submit';
const CONTACT_PHONE = '390342929285';
const CONTACT_EMAIL = 'info@ironwoodlivigno.com';

// Backend stores/reads dates as ISO (yyyy-mm-dd, same as the DatePicker's
// own value), but the notification email and the mailto fallback below are
// always read by Francesco, in Italian — so both spell out "15 agosto
// 2026" regardless of which of the 12 site locales the guest was browsing
// in. Deliberately not gg/mm/aaaa (the previous format): an all-numeric
// date is exactly the kind of thing that gets misread — 05/08 as 5 August
// vs 8 May is the classic ambiguity — and the whole point of this string
// is that Francesco reads it correctly at a glance, every time.
function toItalianDate(iso: string): string {
  const date = fromISO(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

// Very light spam-resistance for a form with no backend of its own:
// 1) a honeypot field bots fill in but humans never see, 2) a minimum time
// between mount and submit (a filled multi-field form submitted in under
// ~2.5s is essentially always a script, not a person).
const MIN_SUBMIT_MS = 2500;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOURCE_OPTIONS = ['google', 'instagram', 'facebook', 'booking', 'airbnb', 'referral', 'other'] as const;

// Shared field styling — kept as constants (rather than repeated inline on
// every input) so the whole form reads as one deliberately designed piece
// instead of default browser inputs: soft tinted fill that turns crisp
// white on focus, generous padding, a small gold-adjacent focus ring.
const LABEL_CLASS = 'block text-xs font-semibold uppercase tracking-wider text-ink/65 mb-2';
const INPUT_CLASS =
  'w-full rounded-2xl border border-ink/12 bg-mist/40 px-4 py-3.5 text-ink placeholder:text-ink/35 focus:outline-none focus:bg-white focus:border-brick focus:ring-4 focus:ring-brick/10 transition-all aria-[invalid=true]:border-brick aria-[invalid=true]:ring-brick/10';

type Errors = Partial<
  Record<'name' | 'email' | 'checkin' | 'checkout' | 'privacy', string>
>;

// Same info mark as Amenities' breakfast/e-bike entries, and same tooltip
// copy (extras.eyebrow) — this is the other place a guest sees those two
// items, so the "on request, paid" cue should look and read identically.
function InfoIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 8v.01" />
    </svg>
  );
}

export default function RequestForm({ showAltMethods = true }: { showAltMethods?: boolean }) {
  const t = useTranslations('request');
  const tExtras = useTranslations('extras');
  const locale = useLocale();
  // Locale-prefixed absolute path (not a bare "#servizi-extra" hash): this
  // form also renders standalone on the /contatti page, which has no
  // ExtraServices section of its own to scroll within — same pattern as
  // the "#prenota" links elsewhere in the codebase (Nav, MobileMenu, blog
  // CTAs) that need to reach a home-page section from any page.
  const extraServicesHref = `/${locale}#servizi-extra`;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [childrenAges, setChildrenAges] = useState<string[]>([]);
  const [source, setSource] = useState('');
  const [message, setMessage] = useState('');
  const [extraBreakfast, setExtraBreakfast] = useState(false);
  const [extraEbike, setExtraEbike] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [company, setCompany] = useState(''); // honeypot — real users never fill this in
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const mountedAt = useRef(Date.now());
  const today = useRef(new Date()).current;

  // Picking a check-in later than the already-chosen check-out leaves a
  // stale, now-invalid check-out behind — clear it instead of leaving the
  // guest with a silently broken date range they'd only discover on submit.
  function handleCheckinChange(next: string) {
    setCheckin(next);
    if (checkout && checkout <= next) setCheckout('');
  }

  // Booking.com-style guest picker: adults + children counters, with a
  // per-child age dropdown once children > 0 (0–17, matching the backend's
  // MAX_CHILD_AGE) — lets Francesco see at a glance whether a crib/high
  // chair request further down actually matches an infant in the party,
  // instead of just a bare headcount. The two counters share one combined
  // cap (MAX_GUESTS = 6 server-side): the apartment's real occupancy limit,
  // 3 bedrooms sleeping up to 6 total. Each handler clamps the *other*
  // counter down if the new value would push the total over that cap,
  // rather than letting the UI reach an invalid combination that the
  // server would then reject with a generic error.
  const maxChildrenForAdults = (a: string) => Math.max(0, 6 - Number(a));

  function handleAdultsChange(next: string) {
    setAdults(next);
    const maxC = maxChildrenForAdults(next);
    if (Number(children) > maxC) {
      setChildren(String(maxC));
      setChildrenAges((prev) => prev.slice(0, maxC));
    }
  }

  function handleChildrenChange(next: string) {
    setChildren(next);
    const count = Number(next);
    setChildrenAges((prev) => {
      const kept = prev.slice(0, count);
      while (kept.length < count) kept.push('5');
      return kept;
    });
  }

  function handleChildAgeChange(index: number, age: string) {
    setChildrenAges((prev) => prev.map((a, i) => (i === index ? age : a)));
  }

  const checkinMinDate = today;
  // The check-out calendar's floor — and, together with DatePicker's own
  // "open on the selected/min date, never on today" rule, what makes it
  // open on the check-in month once one is picked instead of jumping back
  // to the current month.
  const checkoutMinDate = (checkin && fromISO(checkin)) || today;

  // The success banner is meant to be a quick, visible confirmation, not a
  // permanent page state — it clears itself after a few seconds so the form
  // is ready again for a second request (e.g. a different set of dates).
  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => setStatus('idle'), 6000);
    return () => clearTimeout(timer);
  }, [status]);

  function buildLines() {
    const lines = [
      `${t('label_name')}: ${name || '-'}`,
      `${t('label_email')}: ${email || '-'}`,
      `${t('label_phone')}: ${phone || '-'}`,
      `${t('label_checkin')}: ${checkin ? toItalianDate(checkin) : '-'}`,
      `${t('label_checkout')}: ${checkout ? toItalianDate(checkout) : '-'}`,
      `${t('label_adults')}: ${adults}`
    ];
    if (Number(children) > 0) {
      lines.push(`${t('label_children')}: ${children} (${t('label_child_ages_prefix')} ${childrenAges.join(', ')})`);
    }
    if (extraBreakfast || extraEbike) {
      const extras = [
        extraBreakfast ? t('extra_breakfast_label') : null,
        extraEbike ? t('extra_ebike_label') : null
      ].filter(Boolean);
      lines.push(`${t('extras_title')}: ${extras.join(' + ')}`);
    }
    if (source) {
      lines.push(`${t('label_source')}: ${t(`source_option_${source}`)}`);
    }
    if (message.trim()) {
      lines.push(`${t('label_message')}: ${message.trim()}`);
    }
    return lines;
  }

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    t('email_subject')
  )}&body=${encodeURIComponent(buildLines().join('\n'))}`;
  const telHref = `tel:+${CONTACT_PHONE}`;

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = t('error_required');
    if (!email.trim()) next.email = t('error_required');
    else if (!EMAIL_RE.test(email.trim())) next.email = t('error_email_invalid');
    if (!checkin) next.checkin = t('error_required');
    if (!checkout) next.checkout = t('error_required');
    // <= (not <): a same-day check-out is a zero-night stay, and the
    // backend's own validate() rejects checkout_iso <= checkin_iso — this
    // must reject the same range client-side, or a guest who picks equal
    // dates only finds out from a generic, non-field-specific error banner
    // after submitting.
    else if (checkin && checkout && checkout <= checkin) next.checkout = t('error_dates_invalid');
    if (!privacyConsent) next.privacy = t('error_privacy_required');
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Honeypot: a real visitor never sees or fills this field. If it's
    // populated, quietly pretend to succeed rather than tipping off a bot
    // that its submission was rejected.
    if (company.trim() || Date.now() - mountedAt.current < MIN_SUBMIT_MS) {
      setStatus('success');
      return;
    }

    setStatus('sending');

    // Attempt the real submission. On any failure (network error, the Worker
    // rejecting the request, backend not yet reachable) we show an inline
    // error and point at the email/phone buttons below — we never
    // auto-redirect to a mailto: link. Auto-navigating to mailto: is jarring
    // on any device without a default mail client configured: the browser/OS
    // pops up an "how do you want to open this?" chooser instead of quietly
    // composing an email, which reads as a broken form rather than a
    // fallback. Letting the person click the email button themselves avoids
    // that surprise entirely.
    // The Worker now answers as soon as the request is durably saved,
    // without waiting on the notification email (see forms-worker/src/
    // index.ts) — but this abort timeout stays as a backstop against any
    // other stall (a slow TLS handshake to the Worker itself, a flaky
    // connection) so a bad network never leaves the button stuck on
    // "sending" indefinitely with no feedback.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);

    try {
      const res = await fetch(FORMS_ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          checkin: checkin ? toItalianDate(checkin) : '',
          checkin_iso: checkin,
          checkout: checkout ? toItalianDate(checkout) : '',
          checkout_iso: checkout,
          adults: Number(adults),
          children: Number(children),
          children_ages: Number(children) > 0 ? childrenAges.map(Number) : undefined,
          extra_breakfast: extraBreakfast,
          extra_ebike: extraEbike,
          source: source || undefined,
          message: message.trim() || undefined,
          locale,
          company // honeypot, always empty here (the bot branch above already returned)
        })
      });
      const json = await res.json();
      if (json.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setCheckin('');
        setCheckout('');
        setAdults('2');
        setChildren('0');
        setChildrenAges([]);
        setSource('');
        setMessage('');
        setExtraBreakfast(false);
        setExtraEbike(false);
        setPrivacyConsent(false);
        setErrors({});
        return;
      }
    } catch {
      // network/CSP error, or the 20s abort above firing — fall through to
      // the error state below
    } finally {
      clearTimeout(timeoutId);
    }

    setStatus('error');
  }

  function fieldProps(field: keyof Errors) {
    const error = errors[field];
    return {
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `req-${field}-error` : undefined
    } as const;
  }

  function ErrorText({ field }: { field: keyof Errors }) {
    const error = errors[field];
    if (!error) return null;
    return (
      <p id={`req-${field}-error`} role="alert" className="text-brick text-xs mt-1.5">
        {error}
      </p>
    );
  }

  // Splits the "I accept the <link>privacy policy</link>" string on its
  // <link>...</link> markers so the linked segment can be rendered as a
  // real anchor while everything else stays plain text — avoids pulling in
  // next-intl's t.rich just for one string.
  const consentLabel = t('privacy_consent_label');
  const consentMatch = consentLabel.match(/^(.*)<link>(.*)<\/link>(.*)$/);

  return (
    <form onSubmit={handleSubmit} noValidate className="grid sm:grid-cols-2 gap-x-6 gap-y-6 max-w-2xl">
      {/* Honeypot — visually and semantically hidden from real users and
          screen readers, but present in the DOM for bots that blindly fill
          every field. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="req-company">Company</label>
        <input
          id="req-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="req-name" className={LABEL_CLASS}>
          {t('label_name')}
        </label>
        <input
          id="req-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          {...fieldProps('name')}
          className={INPUT_CLASS}
        />
        <ErrorText field="name" />
      </div>

      <div>
        <label htmlFor="req-email" className={LABEL_CLASS}>
          {t('label_email')}
        </label>
        <input
          id="req-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          {...fieldProps('email')}
          className={INPUT_CLASS}
        />
        <ErrorText field="email" />
      </div>

      <div>
        <label htmlFor="req-phone" className={LABEL_CLASS}>
          {t('label_phone')}
        </label>
        <input
          id="req-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="req-checkin" className={LABEL_CLASS}>
          {t('label_checkin')}
        </label>
        <DatePicker
          id="req-checkin"
          value={checkin}
          onChange={handleCheckinChange}
          minDate={checkinMinDate}
          invalid={Boolean(errors.checkin)}
          ariaDescribedBy={errors.checkin ? 'req-checkin-error' : undefined}
          label={t('label_checkin')}
        />
        <ErrorText field="checkin" />
      </div>

      <div>
        <label htmlFor="req-checkout" className={LABEL_CLASS}>
          {t('label_checkout')}
        </label>
        <DatePicker
          id="req-checkout"
          value={checkout}
          onChange={setCheckout}
          minDate={checkoutMinDate}
          excludeMinDate={Boolean(checkin)}
          invalid={Boolean(errors.checkout)}
          ariaDescribedBy={errors.checkout ? 'req-checkout-error' : undefined}
          label={t('label_checkout')}
        />
        <ErrorText field="checkout" />
      </div>

      <div>
        <label htmlFor="req-adults" className={LABEL_CLASS}>
          {t('label_adults')}
        </label>
        <select
          id="req-adults"
          value={adults}
          onChange={(e) => handleAdultsChange(e.target.value)}
          className={`${INPUT_CLASS} select-arrow`}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="req-children" className={LABEL_CLASS}>
          {t('label_children')}
        </label>
        <select
          id="req-children"
          value={children}
          onChange={(e) => handleChildrenChange(e.target.value)}
          className={`${INPUT_CLASS} select-arrow`}
        >
          {Array.from({ length: maxChildrenForAdults(adults) + 1 }, (_, n) => n).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* One age dropdown per child (0–17), Booking.com-style — only shown
          once at least one child is selected above. Lets Francesco see
          whether a crib/high chair request below actually matches an
          infant in the party, instead of just a bare headcount. */}
      {Number(children) > 0 && (
        <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {childrenAges.map((age, i) => (
            <div key={i}>
              <label htmlFor={`req-child-age-${i}`} className={LABEL_CLASS}>
                {t('label_child_age', { n: i + 1 })}
              </label>
              <select
                id={`req-child-age-${i}`}
                value={age}
                onChange={(e) => handleChildAgeChange(i, e.target.value)}
                className={`${INPUT_CLASS} select-arrow`}
              >
                {Array.from({ length: 18 }, (_, a) => a).map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="sm:col-span-2">
        <label htmlFor="req-source" className={LABEL_CLASS}>
          {t('label_source')}
        </label>
        <select
          id="req-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className={`sm:w-64 ${INPUT_CLASS} select-arrow`}
        >
          <option value="">{t('source_option_placeholder')}</option>
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {t(`source_option_${opt}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Optional add-ons get their own soft-bordered panel, set apart from
          the required booking fields above — reads as a curated "enhance
          your stay" moment rather than more boxes to fill in. */}
      <div className="sm:col-span-2 rounded-2xl border border-ink/10 bg-mist/30 p-5">
        <span className={LABEL_CLASS}>{t('extras_title')}</span>
        <div className="flex flex-col gap-3 mt-1">
          <label className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={extraBreakfast}
              onChange={(e) => setExtraBreakfast(e.target.checked)}
              className="h-4 w-4 rounded border-ink/25 text-brick focus:ring-brick/40 accent-brick"
            />
            <span className="inline-flex items-center gap-1.5">
              {t('extra_breakfast_label')}
              <a
                href={extraServicesHref}
                title={tExtras('eyebrow')}
                aria-label={tExtras('eyebrow')}
                onClick={(e) => e.stopPropagation()}
                className="text-brick/60 hover:text-brick transition-colors"
              >
                <InfoIcon />
              </a>
            </span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={extraEbike}
              onChange={(e) => setExtraEbike(e.target.checked)}
              className="h-4 w-4 rounded border-ink/25 text-brick focus:ring-brick/40 accent-brick"
            />
            <span className="inline-flex items-center gap-1.5">
              {t('extra_ebike_label')}
              <a
                href={extraServicesHref}
                title={tExtras('eyebrow')}
                aria-label={tExtras('eyebrow')}
                onClick={(e) => e.stopPropagation()}
                className="text-brick/60 hover:text-brick transition-colors"
              >
                <InfoIcon />
              </a>
            </span>
          </label>
        </div>
        <p className="text-ink/65 text-xs mt-3">{t('extras_hint')}</p>
        {(extraBreakfast || extraEbike) && (
          <p className="text-ink/65 text-xs mt-1">{t('extras_note')}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="req-message" className={LABEL_CLASS}>
          {t('label_message')}
        </label>
        <textarea
          id="req-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('placeholder_message')}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-2.5 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            {...fieldProps('privacy')}
            className="h-4 w-4 mt-0.5 rounded border-ink/25 text-brick focus:ring-brick/40 accent-brick shrink-0"
          />
          <span>
            {consentMatch ? (
              <>
                {consentMatch[1]}
                <a
                  href={`/${locale}/privacy`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-brick transition-colors"
                >
                  {consentMatch[2]}
                </a>
                {consentMatch[3]}
              </>
            ) : (
              consentLabel
            )}
          </span>
        </label>
        <ErrorText field="privacy" />
      </div>

      <div className="sm:col-span-2 pt-2 border-t border-ink/10">
        {status === 'success' ? (
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl px-5 py-4 shadow-soft">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 shrink-0 mt-0.5" aria-hidden>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m22 4-10 10-3-3" />
            </svg>
            <p className="text-base font-medium">{t('success_message')}</p>
          </div>
        ) : (
          <>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brick text-mist rounded-full px-9 py-4 text-base font-medium tracking-wide hover:bg-brick/90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-wait disabled:hover:translate-y-0 transition-all shadow-soft"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              {status === 'sending' ? t('sending') : t('submit_button')}
            </button>
            <p className="text-ink/65 text-xs mt-3">{t('disclaimer')}</p>
            {status === 'error' && (
              <div className="flex items-start gap-3 bg-brick/10 border border-brick/20 text-ink rounded-2xl px-5 py-4 mt-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brick shrink-0 mt-0.5" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
                <p className="text-sm">{t('error_message')}</p>
              </div>
            )}
          </>
        )}

        {showAltMethods && (
          <div className="mt-6 pt-6 border-t border-ink/10">
            <p className="text-ink/60 text-sm mb-3">{t('alt_methods_intro')}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 border border-ink/20 text-ink rounded-full px-6 py-3 font-medium hover:bg-ink/5 transition-colors"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 6 10-6" />
                </svg>
                {t('email_button')}
              </a>
              <a
                href={telHref}
                className="inline-flex items-center gap-2 border border-ink/20 text-ink rounded-full px-6 py-3 font-medium hover:bg-ink/5 transition-colors"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                {t('call_button')}
              </a>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
