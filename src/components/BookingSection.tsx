import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import RequestForm from './RequestForm';

const CONTACT_PHONE = '390342929285';

function StarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#C9A059" aria-hidden>
      <path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.6l-6.1 3.1 1.5-6.7L2.3 9.4l6.8-.7Z" />
    </svg>
  );
}

// The embedded Holidu calendar widget (booking-widget iframe) was removed
// on request — only the direct request form is shown now. See
// BookingWidgetScript.tsx (no longer rendered in page.tsx) for the iframe
// resize listener that only existed to support that widget.
//
// On wide desktop viewports the form alone (max-w-2xl) left a large empty
// gap to its right inside the full-width section — a two-column layout
// puts a "why book with us" reassurance panel there instead, so the
// section actually uses the space and gives hesitant visitors a reason to
// trust the form (response time, no online prepayment, rating) right next
// to where they're about to type their details.
//
// Everything now sits inside one elevated white "reception desk" card
// (rounded corners, soft shadow, generous padding) instead of floating
// directly on the section background — on request, to read as the site's
// single most important moment rather than just another content block.
// The 5-star rating (already in booking_panel.point3) is promoted out of
// the bullet list into its own headline badge with gold stars, since
// that's the strongest trust signal a first-time visitor sees before
// typing anything.
export default function BookingSection() {
  const t = useTranslations('request');
  const tp = useTranslations('booking_panel');

  const points = [tp('point1'), tp('point2'), tp('point4')];

  return (
    <section id="prenota" className="bg-mist py-24 md:py-28">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="rounded-[2rem] md:rounded-[2.5rem] bg-white shadow-soft border border-ink/[0.06] p-6 sm:p-10 md:p-14">
          <Reveal className="max-w-2xl mb-6">
            <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{t('eyebrow')}</p>
            <h2 className="font-display text-3xl md:text-5xl text-ink mb-5 leading-tight">{t('title')}</h2>
            <p className="text-ink/70 text-base md:text-lg">{t('subtitle')}</p>
          </Reveal>

          <Reveal delay={60} className="mb-10 md:mb-12">
            <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-ink/10 pt-5">
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </span>
              <span className="text-ink/60 text-sm">{tp('point3')}</span>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 items-start">
            <Reveal delay={100}>
              <RequestForm />
            </Reveal>

            <Reveal delay={180}>
              <aside className="bg-mist/60 border border-ink/[0.06] rounded-3xl p-7 lg:sticky lg:top-28">
                <h3 className="font-display text-xl text-ink mb-5">{tp('title')}</h3>
                <ul className="space-y-4 mb-6">
                  {points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink/70">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-brick shrink-0 mt-0.5"
                        aria-hidden
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m22 4-10 10-3-3" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/${CONTACT_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-brick text-mist rounded-full px-5 py-3 min-h-[44px] text-sm font-medium hover:bg-brick/90 transition-colors shadow-soft"
                >
                  {tp('whatsapp_cta')}
                </a>
              </aside>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
