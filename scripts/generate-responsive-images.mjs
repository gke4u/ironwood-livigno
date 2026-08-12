#!/usr/bin/env node
// Generates responsive AVIF + WebP variants for every JPG in public/images,
// at the breakpoint widths Pic.tsx serves via srcset. Run automatically
// before every build (see package.json "prebuild") — idempotent: skips any
// variant that already exists and is newer than its source JPG, so repeat
// builds after the first one are near-instant.
//
// Naming convention consumed by Pic.tsx: `<name>-<width>.<format>`, e.g.
// `sauna-vista-montagna-768.avif`, `sauna-vista-montagna-1440.webp`. The
// original `<name>.jpg` (and `<name>.webp`, if it already existed) stay in
// place as the final fallback for the very few browsers that support
// neither AVIF nor WebP.
import { readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve(process.cwd(), 'public/images');
const WIDTHS = [480, 768, 1024, 1440, 1920];
const WEBP_QUALITY = 76;
const AVIF_QUALITY = 55; // sharp's AVIF quality scale runs lower than WebP/JPEG for equivalent visual quality

async function needsRegen(srcPath, outPath) {
  try {
    const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(outPath)]);
    return srcStat.mtimeMs > outStat.mtimeMs;
  } catch {
    return true; // output doesn't exist yet
  }
}

async function processImage(file) {
  const srcPath = path.join(IMAGES_DIR, file);
  const base = file.replace(/\.jpe?g$/i, '');
  const meta = await sharp(srcPath).metadata();
  const originalWidth = meta.width ?? 4000;

  const widths = WIDTHS.filter((w) => w <= originalWidth);
  // Always keep at least one variant even for small source images.
  if (widths.length === 0) widths.push(originalWidth);

  let made = 0;
  for (const w of widths) {
    const avifOut = path.join(IMAGES_DIR, `${base}-${w}.avif`);
    const webpOut = path.join(IMAGES_DIR, `${base}-${w}.webp`);

    if (await needsRegen(srcPath, webpOut)) {
      await sharp(srcPath).resize({ width: w }).webp({ quality: WEBP_QUALITY }).toFile(webpOut);
      made++;
    }
    if (await needsRegen(srcPath, avifOut)) {
      await sharp(srcPath).resize({ width: w }).avif({ quality: AVIF_QUALITY }).toFile(avifOut);
      made++;
    }
  }
  return { file, made, widths };
}

async function main() {
  await mkdir(IMAGES_DIR, { recursive: true });
  const entries = await readdir(IMAGES_DIR);
  // Skip files that are themselves already-generated variants (contain a
  // trailing -<number> before the extension) so re-running this script
  // never tries to generate variants of variants.
  const sources = entries.filter((f) => /\.jpe?g$/i.test(f) && !/-\d+\.jpe?g$/i.test(f));

  console.log(`Found ${sources.length} source JPGs.`);
  let totalMade = 0;
  for (const file of sources) {
    const result = await processImage(file);
    totalMade += result.made;
    if (result.made > 0) {
      console.log(`  ${file}: generated ${result.made} file(s) at widths [${result.widths.join(', ')}]`);
    }
  }
  console.log(totalMade === 0 ? 'All variants already up to date.' : `Done — generated ${totalMade} file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
