'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import DatePicker, { fromISO } from './DatePicker';

// Static site, no backend of our own: the form can't POST to anything we
// host. Instead it submits directly to Web3Forms (https://web3forms.com) —
// a free service that takes the POST from the browser and emails it to the
// address tied to the access key below, no account/backend needed on our
// side. Get a free key by entering your email at https://web3forms.com and
// paste it in place of the placeholder — the form falls back to opening a
// pre-filled email (mailto) until you do, so it always works.
const WEB3FORMS_ACCESS_KEY = '2b74f827-dd36-44b3-b791-b3e4a83db65f';
const CONTACT_PHONE = '390342929285';
const CONTACT_EMAIL = 'info@ironwoodlivigno.com';

// Very light spam-resistance for a form with no backend of its own:
// 1) a honeypot field bots fill in but humans never see, 2) a minimum time
// between mount and submit (a filled multi-field form submitted in under
// ~2.5s is essentially always a script, not a person).
const MIN_SUBMIT_MS = 2500;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared field styling — kept as constants (rather than repeated inline on
// every input) so the whole form reads as one deliberately designed piece
// instead of default browser inputs: soft tinted fill that turns crisp
// white on focus, generous padding, a small gold-adjacent focus ring.
const LABEL_CLASS = 'block text-xs font-semibold uppercase tracking-wider text-ink/45 mb-2';
const INPUT_CLASS =
  'w-full rounded-2xl border border-ink/12 bg-mist/40 px-4 py-3.5 text-ink placeholder:text-ink/35 focus:outline-none focus:bg-white focus:border-brick focus:ring-4 focus:ring-brick/10 transition-all aria-[invalid=true]:border-brick aria-[invalid=true]:ring-brick/10';

type Errors = Partial<
  Record<'name' | 'email' | 'checkin' | 'checkout' | 'privacy', string>
>;

export default function RequestForm({ showAltMethods = true }: { showAltMethods?: boolean }) {
  const t = useTranslations('request');
  const locale = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState('2');
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
    if (checkout && checkout < next) setCheckout('');
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
      `${t('label_checkin')}: ${checkin || '-'}`,
      `${t('label_checkout')}: ${checkout || '-'}`,
      `${t('label_guests')}: ${guests}`
    ];
    if (extraBreakfast || extraEbike) {
      const extras = [
        extraBreakfast ? t('extra_breakfast_label') : null,
        extraEbike ? t('extra_ebike_label') : null
      ].filter(Boolean);
      lines.push(`${t('extras_title')}: ${extras.join(' + ')}`);
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
    else if (checkin && checkout && checkout < checkin) next.checkout = t('error_dates_invalid');
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

    // Attempt the real submission. On any failure (network error, Web3Forms
    // rejecting the request, access key not yet configured) we show an
    // inline error and point at the email/phone buttons below — we never
    // auto-redirect to a mailto: link. Auto-navigating to mailto: is jarring
    // on any device without a default mail client configured: the browser/OS
    // pops up an "how do you want to open this?" chooser instead of quietly
    // composing an email, which reads as a broken form rather than a
    // fallback. Letting the person click the email button themselves avoids
    // that surprise entirely.
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: t('email_subject'),
          from_name: name || 'Ironwood Livigno — richiesta dal sito',
          email: email || undefined,
          // Web3Forms uses the "email" field above as the Reply-To on the
          // notification it sends us, by default. "replyto" is the explicit
          // override for the same thing — sending both makes it certain
          // that clicking "Reply" in the inbox goes straight to the guest,
          // not back to Web3Forms or nowhere.
          replyto: email || undefined,
          phone: phone || undefined,
          message: buildLines().join('\n')
        })
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setCheckin('');
        setCheckout('');
        setGuests('2');
        setMessage('');
        setExtraBreakfast(false);
        setExtraEbike(false);
        setPrivacyConsent(false);
        setErrors({});
        return;
      }
    } catch {
      // network/CSP error — fall through to the error state below
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
          invalid={Boolean(errors.checkout)}
          ariaDescribedBy={errors.checkout ? 'req-checkout-error' : undefined}
          label={t('label_checkout')}
        />
        <ErrorText field="checkout" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="req-guests" className={LABEL_CLASS}>
          {t('label_guests')}
        </label>
        <select
          id="req-guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className={`sm:w-48 ${INPUT_CLASS}`}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
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
            {t('extra_breakfast_label')}
          </label>
          <label className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={extraEbike}
              onChange={(e) => setExtraEbike(e.target.checked)}
              className="h-4 w-4 rounded border-ink/25 text-brick focus:ring-brick/40 accent-brick"
            />
            {t('extra_ebike_label')}
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
