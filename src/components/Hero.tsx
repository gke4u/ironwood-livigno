import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink">
      {/* Hero photo is the page's LCP element; it's a CSS background so the
          browser can't discover it from the HTML alone. React 19 hoists this
          <link> into <head>, giving it top network priority instead of
          waiting on CSS parsing. A slow, continuous "Ken Burns" zoom/pan
          (animate-kenburns, defined in tailwind.config.ts) gives the still
          photo the same sense of motion as a video background, without the
          weight of an actual video file — and it's paused for anyone with
          prefers-reduced-motion set (see globals.css). */}
      {/* Preloads the WebP at the same width tier the CSS below is about to
          select for this viewport (mobile/tablet/desktop), via the
          preload's own `media` attribute — three candidates, only the
          matching one actually fetches. Every browser that supports <link
          rel=preload> with `media` also supports WebP, and browsers that
          support neither simply fall back to loading the JPG referenced by
          the CSS below. Without the media split, a single preload here
          would have to guess one size for every device — either wasting
          bandwidth on mobile (preloading the desktop file) or serving a
          soft image on a large screen (preloading the mobile file). */}
      <link rel="preload" as="image" href="/images/hero-ironwood-768.webp" media="(max-width: 768px)" fetchPriority="high" />
      <link
        rel="preload"
        as="image"
        href="/images/hero-ironwood-1440.webp"
        media="(min-width: 769px) and (max-width: 1440px)"
        fetchPriority="high"
      />
      <link rel="preload" as="image" href="/images/hero-ironwood-1920.webp" media="(min-width: 1441px)" fetchPriority="high" />
      {/* Background (gradient + photo, WebP with JPG fallback via
          image-set) lives in globals.css (.hero-bg) because inline styles
          can't express a fallback chain of two background-image
          declarations. */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center animate-kenburns motion-reduce:animate-none"
        aria-hidden
      />

      <div className="relative max-w-content w-full mx-auto px-6 md:px-10 pt-28 pb-16 md:pt-24 md:pb-28 min-h-[100svh] md:min-h-0 flex flex-col justify-end">
        <p className="text-mist tracking-[0.2em] uppercase text-xs md:text-sm mb-3 md:mb-5 animate-fadeIn [text-shadow:0_1px_4px_rgba(36,28,21,0.9)]">
          {t('eyebrow')}
        </p>
        <h1 className="font-display text-mist text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1.05] max-w-3xl mb-4 md:mb-6 animate-fadeUp">
          {t('title')}
        </h1>
        <p className="text-mist/85 text-base md:text-lg max-w-xl mb-8 md:mb-10 animate-fadeUp [animation-delay:150ms]">
          {t('subtitle')}
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-10 md:mb-12 animate-fadeUp [animation-delay:250ms]">
          <a
            href="#prenota"
            className="bg-brick text-mist rounded-full px-7 py-3.5 font-medium hover:bg-brick/90 transition-colors shadow-soft"
          >
            {t('cta_primary')}
          </a>
          <a
            href="#esperienza"
            className="text-mist/90 underline underline-offset-4 decoration-gold/60 hover:decoration-gold transition-colors"
          >
            {t('cta_secondary')}
          </a>
        </div>

        {/* Semantic list (a <dl> needs dt+dd pairs; these are standalone
            facts, so a plain <ul> is the correct element). A rigid
            grid-cols-3 forced every stat into an equal third of max-w-xl —
            fine for short English strings, but several translations
            ("3 chambres · 2 salles de bain", "6 miejsc noclegowych") are
            long enough to wrap into 2–3 uneven lines at that width, breaking
            the row's alignment. flex-wrap lets each stat take only the
            width it needs and wrap as a whole item, and a smaller,
            non-display font keeps the row compact enough that wrapping is
            rare even for the longest translations. */}
        <ul className="flex flex-wrap gap-x-8 gap-y-2 max-w-xl border-t border-mist/20 pt-6 animate-fadeUp [animation-delay:350ms] list-none p-0 m-0 [text-shadow:0_1px_3px_rgba(36,28,21,0.85)]">
          <li className="text-mist font-medium text-sm md:text-base whitespace-nowrap">{t('stat_sleeps')}</li>
          <li className="text-mist font-medium text-sm md:text-base whitespace-nowrap">{t('stat_rooms')}</li>
          <li className="text-mist font-medium text-sm md:text-base whitespace-nowrap">{t('stat_distance')}</li>
        </ul>
      </div>
    </section>
  );
}
