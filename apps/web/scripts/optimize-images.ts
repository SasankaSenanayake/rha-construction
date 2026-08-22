/**
 * Pre-optimizes real photos before they're committed to public/images/.
 * Static export has no server-side image optimization (next/image runs
 * with `unoptimized: true`), so this has to happen at authoring time.
 *
 * Usage: place raw photos under content-source-images/<same-path-as-target>,
 * then:
 *   npx tsx scripts/optimize-images.ts
 *
 * Each image is resized to a max width of 1600px and re-encoded as WebP at
 * quality 80, written to public/images/ under the matching relative path.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = path.join(process.cwd(), "content-source-images");
const OUTPUT_DIR = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function collectImageFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectImageFiles(fullPath);
      return SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
    }),
  );
  return files.flat();
}

async function main() {
  const exists = await fs
    .access(SOURCE_DIR)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    console.log(`No content-source-images/ directory found at ${SOURCE_DIR} — nothing to optimize.`);
    return;
  }

  const files = await collectImageFiles(SOURCE_DIR);
  for (const file of files) {
    const relative = path.relative(SOURCE_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, relative).replace(/\.(jpe?g|png|webp)$/i, ".webp");
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    await sharp(file)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    console.log(`Optimized ${relative} -> ${path.relative(process.cwd(), outputPath)}`);
  }

  console.log(`Done. Optimized ${files.length} image(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
