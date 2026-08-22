import fs from "node:fs";
import path from "node:path";
import type { ZodType, ZodTypeDef } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * Reads every *.json file in content/<dirName>, validates it against schema,
 * and fails the build loudly (not silently) if any file is malformed or
 * missing a locale — content bugs should be caught at build time, not
 * discovered by a site visitor.
 */
export function loadContentDir<T>(
  dirName: string,
  schema: ZodType<T, ZodTypeDef, unknown>,
  baseDir: string = CONTENT_DIR,
): T[] {
  const dir = path.join(baseDir, dirName);
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));

  return files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
    const result = schema.safeParse(raw);
    if (!result.success) {
      throw new Error(
        `Invalid content file content/${dirName}/${file}:\n${result.error.toString()}`,
      );
    }
    return result.data;
  });
}

export function assertImageExists(relativeSrc: string, contextLabel: string): void {
  const fullPath = path.join(PUBLIC_DIR, relativeSrc);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Referenced image "${relativeSrc}" (${contextLabel}) does not exist under public/`);
  }
}
