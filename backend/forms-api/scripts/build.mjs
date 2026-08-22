import { build } from "esbuild";
import { mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(rootDir, "dist");
const zipPath = path.join(rootDir, "function.zip");

rmSync(distDir, { recursive: true, force: true });
rmSync(zipPath, { force: true });
mkdirSync(distDir, { recursive: true });

await build({
  entryPoints: [path.join(rootDir, "src/index.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: path.join(distDir, "index.mjs"),
  // AWS SDK v3 is provided by the Lambda Node.js runtime; excluding it keeps the bundle small.
  external: ["@aws-sdk/*"],
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
});

if (existsSync(distDir)) {
  execSync(`cd ${distDir} && zip -r ${zipPath} .`, { stdio: "inherit" });
}

console.log(`Lambda bundle written to ${zipPath}`);
