// Serves responsive, next-gen images without next/image's optimizer (not
// available: this is a static export, `images.unoptimized: true`, no server
// to resize on request). Variants are pre-generated at build time by
// scripts/generate-responsive-images.mjs (runs automatically via the
// "prebuild" npm script) at 480/768/1024/1440/1920px, in both AVIF and
// WebP, following the naming convention `<name>-<width>.<format>`.
//
// Source order matters: <picture> picks the first <source> whose `type`
// the browser supports AND whose `srcset`/`sizes` resolve — so AVIF (best
// compression) is listed first, WebP second, and the plain <img src> at the
// end is the fallback for the few browsers/crawlers that support neither.
const BREAKPOINTS = [480, 768, 1024, 1440, 1920];

type PicProps = {
  src: string; // path to the original .jpg, e.g. '/images/sauna.jpg'
  alt: string;
  width: number; // intrinsic width of the ORIGINAL photo (not a target size)
  height: number;
  loading?: 'lazy' | 'eager';
  // As rendered on screen across breakpoints, e.g.
  // "(min-width: 1024px) 50vw, 100vw" — defaults to a reasonable guess for
  // the common 2-column section layout used across the site; pass an
  // explicit value for anything narrower (grid/gallery thumbnails) or
  // full-bleed (hero-style) images.
  sizes?: string;
  className?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
};

export default function Pic({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  className,
  fetchPriority
}: PicProps) {
  const base = src.replace(/\.jpe?g$/i, '');
  const widths = BREAKPOINTS.filter((w) => w <= width);
  if (widths.length === 0) widths.push(width);

  const srcSet = (ext: 'avif' | 'webp') => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');

  return (
    <picture>
      <source srcSet={srcSet('avif')} sizes={sizes} type="image/avif" />
      <source srcSet={srcSet('webp')} sizes={sizes} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={loading === 'eager' ? 'sync' : 'async'}
        // Widely supported (Chrome/Edge/Safari); ignored harmlessly by
        // browsers that don't know it. Complements the `loading` prop for
        // above-the-fold images that also need to win the priority race.
        {...(fetchPriority ? { fetchPriority } : {})}
        className={className}
      />
    </picture>
  );
}
