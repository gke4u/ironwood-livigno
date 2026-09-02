import { useTranslations } from 'next-intl';
import Pic from './Pic';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink">
      {/* Hero photo is the page's LCP element. It used to be a CSS
          background (with manual <link rel=preload> hints to compensate
          for the browser not discovering it from the HTML alone) — but a
          real-world PageSpeed Insights run showed LCP dominated by "load
          delay": the browser can't even consider the background paintable
          until the render-blocking main CSS bundle finishes downloading
          and parsing, no matter how early the image bytes themselves were
          preloaded. A real <img>, discovered directly by the browser's
          preload scanner while it streams the HTML, doesn't have that
          dependency. Pic already emits AVIF/WebP/JPG responsive sources;
          `loading="eager"` + `fetchPriority="high"` mark it as the LCP
          candidate to prioritize. A slow, continuous "Ken Burns" zoom/pan
          (animate-kenburns, defined in tailwind.config.ts) gives the still
          photo the same sense of motion as a video background, without the
          weight of an actual video file — and it's paused for anyone with
          prefers-reduced-motion set. */}
      <Pic
        src="/images/hero-ironwood.jpg"
        alt=""
        width={1920}
        height={1280}
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover animate-kenburns motion-reduce:animate-none"
      />
      {/* Same dark gradient scrim that used to be baked into the CSS
          background-image itself, now a separate layer on top of the
          <img> — keeps hero text readable over any part of the photo. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/[0.32] via-ink/[0.62] via-60% to-ink/[0.94]"
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
